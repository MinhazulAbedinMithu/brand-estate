import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/property.model';
import { verifyJwt } from '@/lib/auth/tokens';

const COOKIE_NAME = 'be_auth_token';

function isObjectId(val: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(val);
}

// ─────────────────────────────────────────────
// DELETE /api/properties/[idOrSlug]/reject-update
// Admin-only: discard pendingUpdate diff, live listing unchanged
// ─────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;

    // ── 1. Auth ───────────────────────────────────────────────
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Session expired or invalid.' },
        { status: 401 }
      );
    }

    // Admin only
    if (!['admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'Only admins can reject listing updates.' },
        { status: 403 }
      );
    }

    await connectDB();

    const query = isObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug.toLowerCase() };

    const prop = await Property.findOne(query);
    if (!prop) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Property listing not found.' },
        { status: 404 }
      );
    }

    if (!prop.hasPendingUpdate) {
      return NextResponse.json(
        { status: 'error', error: 'NoPendingUpdate', message: 'This listing has no pending update to reject.' },
        { status: 400 }
      );
    }

    // ── 2. Discard pending overlay, live listing unchanged ─────
    prop.set('hasPendingUpdate', false);
    prop.set('pendingUpdate', null);
    prop.markModified('pendingUpdate');

    await prop.save();

    return NextResponse.json({
      status: 'success',
      message: 'Pending update rejected. The live listing remains unchanged.',
      data: {
        id: prop._id.toString(),
        status: prop.status,
        hasPendingUpdate: false,
      },
    });
  } catch (err: unknown) {
    console.error('[DELETE /api/properties/[idOrSlug]/reject-update]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
