import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';

export async function GET(request: NextRequest) {
  try {
    // ── 1. Extract token from query params ────────────────────
    const token = request.nextUrl.searchParams.get('token');

    if (!token || typeof token !== 'string' || !token.trim()) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'InvalidOrExpiredToken',
          message: 'The verification token is invalid or has expired.',
        },
        { status: 400 }
      );
    }

    // ── 2. Find user by token — must not be expired ───────────
    await connectDB();

    const user = await User.findOne({
      verificationToken: token.trim(),
      verificationTokenExpires: { $gt: new Date() }, // token must still be valid
    });

    if (!user) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'InvalidOrExpiredToken',
          message: 'The verification token is invalid or has expired.',
        },
        { status: 400 }
      );
    }

    // ── 3. Activate the account ───────────────────────────────
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // ── 4. Respond ────────────────────────────────────────────
    return NextResponse.json(
      {
        status: 'success',
        message: 'Email verified successfully. You can now log in.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[GET /api/auth/verify-email]', err);
    return NextResponse.json(
      {
        status: 'error',
        error: 'InternalServerError',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
