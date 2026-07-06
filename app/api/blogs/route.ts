import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BlogPost } from '@/lib/db/models/blog-post.model';
import { User } from '@/lib/db/models/user.model';
import { verifyJwt } from '@/lib/auth/tokens';
import { seedBlogs } from '@/lib/db/seed-blogs-helper';

const COOKIE_NAME = 'be_auth_token';

// Helper to generate a clean URL slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special characters
    .replace(/[\s_]+/g, '-')  // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

// ─────────────────────────────────────────────
// GET /api/blogs
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Auto-seed if database is empty of blog posts
    const totalCount = await BlogPost.countDocuments({});
    if (totalCount === 0) {
      await seedBlogs();
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10); // default to 100 to return catalog

    // 1. Determine visibility based on user auth role
    const token = request.cookies.get(COOKIE_NAME)?.value;
    let currentUser = null;

    if (token) {
      currentUser = verifyJwt(token);
    }

    const query: Record<string, unknown> = {};

    if (!currentUser) {
      // Guest: only published posts
      query.status = 'published';
    } else if (['admin', 'super_admin'].includes(currentUser.role)) {
      // Admin/Super Admin: see all posts
      // No status filter applied
    } else {
      // Agent/Auth User: see published posts OR their own posts
      query.$or = [
        { status: 'published' },
        { authorId: currentUser.id }
      ];
    }

    // 2. Apply search/category/tag filters
    if (category && category !== 'all') {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      // If query already has $or (from role filters), wrap everything in $and
      const searchConditions = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex }
      ];

      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: searchConditions }
        ];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    // 3. Query DB with pagination and sort
    const skip = (page - 1) * limit;
    const total = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Map Mongoose _id to string id
    const formattedPosts = posts.map((post) => {
      const obj = post.toObject();
      return {
        ...obj,
        id: obj._id.toString(),
        _id: undefined,
        reactions: obj.reactions instanceof Map ? Object.fromEntries(obj.reactions) : obj.reactions
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      status: 'success',
      data: formattedPosts,
      pagination: {
        total,
        page,
        pages: totalPages,
        limit
      }
    });
  } catch (err: unknown) {
    console.error('[GET /api/blogs]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to retrieve blogs.' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/blogs
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authentication
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
        { status: 'error', error: 'Unauthorized', message: 'Invalid or expired session.' },
        { status: 401 }
      );
    }

    // Role check: must be agent, owner, admin, or super_admin to create blog posts
    if (!['agent', 'owner', 'admin', 'super_admin'].includes(decoded.role)) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to publish articles.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, category, tags, readTimeMinutes, status, seo } = body;

    if (!title || !content || !excerpt || !coverImage || !category) {
      return NextResponse.json(
        { status: 'error', error: 'BadRequest', message: 'Required fields: title, content, excerpt, coverImage, category.' },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Fetch User Details for Author Profile mapping
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'User profile not found.' },
        { status: 404 }
      );
    }

    // 3. Generate Unique Slug
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await BlogPost.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 4. Map default status based on role
    // Admins publish immediately, agents/members go to pending review unless saved as draft
    let finalStatus = status || 'pending';
    if (['admin', 'super_admin'].includes(user.role) && finalStatus !== 'draft') {
      finalStatus = 'published';
    }

    // Assemble Author subdoc
    const author = {
      name: user.name,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      role: user.role === 'admin' || user.role === 'super_admin' 
        ? 'Platform Editor' 
        : (user.legalDocs?.agencyName ? `Licensed Agent at ${user.legalDocs.agencyName}` : 'Luxury Property Advisor'),
      bio: user.legalDocs?.agencyName 
        ? `Advising clients globally from ${user.legalDocs.agencyName}.` 
        : 'Expert real estate contributor and analyst.',
    };

    // Assemble SEO metadata
    const finalSeo = {
      title: seo?.title || `${title} | RealHoms`,
      metaDescription: seo?.metaDescription || excerpt,
      keywords: seo?.keywords || tags || [],
      ogImage: seo?.ogImage || coverImage,
      ogType: seo?.ogType || 'article',
      canonicalUrl: seo?.canonicalUrl || '',
      ogTitle: seo?.ogTitle || title,
      ogDescription: seo?.ogDescription || excerpt,
      noIndex: seo?.noIndex || false,
    };

    const newPost = await BlogPost.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      category,
      tags: tags || [],
      author,
      authorId: user._id,
      authorRole: user.role,
      isFeatured: false,
      readTimeMinutes: readTimeMinutes || Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
      status: finalStatus,
      seo: finalSeo,
    });

    return NextResponse.json(
      {
        status: 'success',
        data: {
          id: newPost._id.toString(),
          title: newPost.title,
          slug: newPost.slug,
          status: newPost.status,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('[POST /api/blogs]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to create blog post.' },
      { status: 500 }
    );
  }
}
