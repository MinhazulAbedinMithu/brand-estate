import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BlogPost } from '@/lib/db/models/blog-post.model';

const SUPPORTED_EMOJIS = ['🔥', '❤️', '👏', '💡', '😮', '🚀'];

function isObjectId(val: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(val);
}

// ─────────────────────────────────────────────
// POST /api/blogs/[idOrSlug]/react
// Public: Submit a blog reaction (emoji)
// ─────────────────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    const body = await request.json();
    const { reactionType } = body; // expecting emoji e.g., '🔥'

    if (!reactionType) {
      return NextResponse.json(
        { status: 'error', error: 'BadRequest', message: 'reactionType parameter is required.' },
        { status: 400 }
      );
    }

    if (!SUPPORTED_EMOJIS.includes(reactionType)) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'InvalidReactionType',
          message: `The requested reaction type is not supported. Supported: ${SUPPORTED_EMOJIS.join(', ')}`
        },
        { status: 400 }
      );
    }

    await connectDB();

    const query = isObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug.toLowerCase() };

    // Atomically increment the reaction count for the given emoji key
    const updatedPost = await BlogPost.findOneAndUpdate(
      query,
      { $inc: { [`reactions.${reactionType}`]: 1 } },
      { returnDocument: 'after' }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Article not found.' },
        { status: 404 }
      );
    }

    // Convert reactions map to plain object
    const reactionsObj = updatedPost.reactions instanceof Map 
      ? Object.fromEntries(updatedPost.reactions)
      : updatedPost.reactions;

    return NextResponse.json({
      status: 'success',
      data: {
        reactions: reactionsObj
      }
    });
  } catch (err: unknown) {
    console.error('[POST /api/blogs/[idOrSlug]/react]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to register reaction.' },
      { status: 500 }
    );
  }
}
