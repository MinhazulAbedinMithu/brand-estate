import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BlogPost } from '@/lib/db/models/blog-post.model';

function isObjectId(val: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(val);
}

// ─────────────────────────────────────────────
// POST /api/blogs/[idOrSlug]/view
// Public: Increment view counter for a blog post
// ─────────────────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    await connectDB();

    const query = isObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug.toLowerCase() };

    const updatedPost = await BlogPost.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Article not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        views: updatedPost.views || 0,
      },
    });
  } catch (err: unknown) {
    console.error('[POST /api/blogs/[idOrSlug]/view]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to increment view counter.' },
      { status: 500 }
    );
  }
}
