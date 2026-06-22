import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/property.model';

function isObjectId(val: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(val);
}

// ─────────────────────────────────────────────
// POST /api/properties/[idOrSlug]/view
// ─────────────────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    await connectDB();

    let query = {};
    if (isObjectId(idOrSlug)) {
      query = { _id: idOrSlug };
    } else {
      query = { slug: idOrSlug.toLowerCase() };
    }

    const updated = await Property.updateOne(query, { $inc: { views: 1 } });

    if (updated.matchedCount === 0) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Property listing not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'View tracked successfully.',
    });
  } catch (err: unknown) {
    console.error('[POST /api/properties/[idOrSlug]/view]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
