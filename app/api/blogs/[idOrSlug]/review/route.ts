import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BlogPost } from '@/lib/db/models/blog-post.model';
import { verifyJwt } from '@/lib/auth/tokens';

const COOKIE_NAME = 'be_auth_token';

function isObjectId(val: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(val);
}

// ─────────────────────────────────────────────
// POST /api/blogs/[idOrSlug]/review
// Admin-only: Approve or Reject a blog submission
// ─────────────────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;

    // 1. Verify Auth & Admin Role
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
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

    if (!['admin', 'super_admin'].includes(decoded.role)) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'Only admins or moderators can review submissions.' },
        { status: 403 }
      );
    }

    // 2. Parse Payload
    const body = await request.json();
    const { status, reason } = body; // status: 'published' | 'rejected', reason?: string

    if (!status || !['published', 'rejected'].includes(status)) {
      return NextResponse.json(
        { status: 'error', error: 'BadRequest', message: "status must be either 'published' or 'rejected'." },
        { status: 400 }
      );
    }

    if (status === 'rejected' && (!reason || !reason.trim())) {
      return NextResponse.json(
        { status: 'error', error: 'BadRequest', message: 'A rejection reason is required.' },
        { status: 400 }
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

    // 3. Update status & feedback
    post.status = status;
    if (status === 'rejected') {
      post.rejectionReason = reason?.trim();
    } else {
      post.rejectionReason = '';
      // Set/update published date on first publish
      if (!post.createdAt) {
        post.set('publishedAt', new Date().toISOString());
      }
    }

    await post.save();

    return NextResponse.json({
      status: 'success',
      data: {
        id: post._id.toString(),
        slug: post.slug,
        status: post.status,
        rejectionReason: post.rejectionReason || undefined,
        updatedAt: post.updatedAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    console.error('[POST /api/blogs/[idOrSlug]/review]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to complete review.' },
      { status: 500 }
    );
  }
}
