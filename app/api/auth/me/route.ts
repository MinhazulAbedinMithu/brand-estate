import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { verifyJwt } from '@/lib/auth/tokens';

const COOKIE_NAME = 'be_auth_token';

export async function GET(request: NextRequest) {
  try {
    // ── 1. Read token from cookie ─────────────────────────────
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    // ── 2. Verify JWT ─────────────────────────────────────────
    const payload = verifyJwt(token);

    if (!payload) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    // ── 3. Fetch fresh user from DB ───────────────────────────
    await connectDB();

    const user = await User.findById(payload.id).lean();

    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    // ── 4. Return sanitized user ──────────────────────────────
    return NextResponse.json(
      {
        status: 'success',
        data: {
          id: (user._id as { toString(): string }).toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
          status: user.status,
          legalDocs: user.legalDocs,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[GET /api/auth/me]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
