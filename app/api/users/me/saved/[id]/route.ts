import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { verifyJwt } from '@/lib/auth/tokens';

const COOKIE_NAME = 'be_auth_token';

// ─────────────────────────────────────────────
// DELETE /api/users/me/saved/[id] (Remove Saved Listing)
// ─────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    await connectDB();

    // Pull propertyId from user's savedProperties array
    await User.findByIdAndUpdate(payload.id, {
      $pull: { savedProperties: id },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Property listing removed from saved list successfully.',
    });
  } catch (err: unknown) {
    console.error('[DELETE /api/users/me/saved/[id]]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
