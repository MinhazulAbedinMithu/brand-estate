import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BlogPost } from '@/lib/db/models/blog-post.model';
import { verifyJwt } from '@/lib/auth/tokens';

const COOKIE_NAME = 'be_auth_token';

function isObjectId(val: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(val);
}

// Helper to generate a clean URL slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─────────────────────────────────────────────
// GET /api/blogs/[idOrSlug]
// ─────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    await connectDB();

    const query = isObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug.toLowerCase() };

    const post = await BlogPost.findOne(query);

    if (!post) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Article not found.' },
        { status: 404 }
      );
    }

    // Check visibility permissions for non-published posts
    if (post.status !== 'published') {
      const token = request.cookies.get(COOKIE_NAME)?.value;
      if (!token) {
        return NextResponse.json(
          { status: 'error', error: 'Unauthorized', message: 'Authentication required to view this draft.' },
          { status: 401 }
        );
      }

      const decoded = verifyJwt(token);
      if (!decoded) {
        return NextResponse.json(
          { status: 'error', error: 'Unauthorized', message: 'Session expired or invalid.' },
          { status: 401 }
        );
      }

      const isAuthor = decoded.id === post.authorId.toString();
      const isAdmin = ['admin', 'super_admin'].includes(decoded.role);

      if (!isAuthor && !isAdmin) {
        return NextResponse.json(
          { status: 'error', error: 'Forbidden', message: 'You do not have access to view this article.' },
          { status: 403 }
        );
      }
    }

    // Format output
    const obj = post.toObject();
    const formattedPost = {
      ...obj,
      id: obj._id.toString(),
      _id: undefined,
      reactions: obj.reactions instanceof Map ? Object.fromEntries(obj.reactions) : obj.reactions
    };

    return NextResponse.json({
      status: 'success',
      data: formattedPost
    });
  } catch (err: unknown) {
    console.error('[GET /api/blogs/[idOrSlug]]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to retrieve article details.' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PUT /api/blogs/[idOrSlug]
// ─────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;

    // 1. Verify Auth Session
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication is required.' },
        { status: 401 }
      );
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Session expired or invalid.' },
        { status: 401 }
      );
    }

    await connectDB();

    const query = isObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug.toLowerCase() };

    const post = await BlogPost.findOne(query);
    if (!post) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Article not found.' },
        { status: 404 }
      );
    }

    // 2. Validate update permissions
    const isAuthor = decoded.id === post.authorId.toString();
    const isAdmin = ['admin', 'super_admin'].includes(decoded.role);

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to edit this article.' },
        { status: 403 }
      );
    }

    // 3. Parse input and update fields
    const body = await request.json();
    const { title, content, excerpt, coverImage, category, tags, readTimeMinutes, status, seo } = body;

    if (title !== undefined) {
      post.title = title;
      // If title changed, update slug
      if (title.toLowerCase().trim() !== post.title.toLowerCase().trim()) {
        let baseSlug = generateSlug(title);
        let slug = baseSlug;
        let counter = 1;
        while (await BlogPost.findOne({ slug, _id: { $ne: post._id } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        post.slug = slug;
      }
    }

    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;
    if (readTimeMinutes !== undefined) {
      post.readTimeMinutes = readTimeMinutes;
    } else if (content !== undefined) {
      post.readTimeMinutes = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
    }

    // Manage status change
    if (status !== undefined) {
      if (isAdmin) {
        post.status = status;
      } else {
        // Agent or Member can save as draft or set to pending review
        // If updating a published/rejected article, automatically reset it to pending
        if (status === 'draft') {
          post.status = 'draft';
        } else {
          post.status = 'pending';
        }
      }
    } else {
      // If content was updated by an agent/member, and it was published/rejected, send back to pending
      if (!isAdmin && post.status !== 'draft') {
        post.status = 'pending';
      }
    }

    // Update SEO settings
    if (seo !== undefined) {
      post.seo = {
        title: seo.title || post.seo.title,
        metaDescription: seo.metaDescription || post.seo.metaDescription,
        keywords: seo.keywords || post.seo.keywords,
        ogImage: seo.ogImage || post.seo.ogImage,
        ogType: seo.ogType || post.seo.ogType || 'article',
        canonicalUrl: seo.canonicalUrl || post.seo.canonicalUrl || '',
        ogTitle: seo.ogTitle || post.seo.ogTitle || '',
        ogDescription: seo.ogDescription || post.seo.ogDescription || '',
        noIndex: seo.noIndex !== undefined ? seo.noIndex : post.seo.noIndex,
      };
    }

    await post.save();

    return NextResponse.json({
      status: 'success',
      data: {
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        status: post.status,
        updatedAt: post.updatedAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    console.error('[PUT /api/blogs/[idOrSlug]]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to update article.' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/blogs/[idOrSlug]
// ─────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;

    // 1. Verify Auth Session
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication is required.' },
        { status: 401 }
      );
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Session expired or invalid.' },
        { status: 401 }
      );
    }

    await connectDB();

    const query = isObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug.toLowerCase() };

    const post = await BlogPost.findOne(query);
    if (!post) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Article not found.' },
        { status: 404 }
      );
    }

    // 2. Validate deletion permissions
    const isAuthor = decoded.id === post.authorId.toString();
    const isAdmin = ['admin', 'super_admin'].includes(decoded.role);

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to delete this article.' },
        { status: 403 }
      );
    }

    await BlogPost.deleteOne({ _id: post._id });

    return NextResponse.json({
      status: 'success',
      message: 'Blog post deleted successfully.'
    });
  } catch (err: unknown) {
    console.error('[DELETE /api/blogs/[idOrSlug]]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to delete article.' },
      { status: 500 }
    );
  }
}
