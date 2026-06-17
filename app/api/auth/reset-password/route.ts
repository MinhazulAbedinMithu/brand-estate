import { type NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { validatePassword } from '@/lib/auth/validation';

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse & validate input ─────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          status: 'error',
          error: 'InvalidBody',
          message: 'Request body must be valid JSON.',
        },
        { status: 400 }
      );
    }

    const { token, password, confirmPassword } = body as {
      token?: string;
      password?: string;
      confirmPassword?: string;
    };

    // Token
    if (!token || typeof token !== 'string' || !token.trim()) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'InvalidOrExpiredToken',
          message: 'The password reset token is invalid or has expired.',
        },
        { status: 400 }
      );
    }

    // Password strength
    const passwordCheck = validatePassword(password ?? '');
    if (!passwordCheck.valid) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'ValidationError',
          message: passwordCheck.message,
          details: { password: 'Too short or missing digit' },
        },
        { status: 400 }
      );
    }

    // Passwords match — check before hitting the DB
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'PasswordMismatch',
          message: 'Passwords do not match.',
        },
        { status: 400 }
      );
    }

    // ── 2. Find user by reset token — must not be expired ─────
    await connectDB();

    const user = await User.findOne({
      resetPasswordToken: token.trim(),
      resetPasswordTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'InvalidOrExpiredToken',
          message: 'The password reset token is invalid or has expired.',
        },
        { status: 400 }
      );
    }

    // ── 3. Hash new password & persist ───────────────────────
    const hashedPassword = await bcrypt.hash(password as string, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    // ── 4. Respond ────────────────────────────────────────────
    return NextResponse.json(
      {
        status: 'success',
        message:
          'Your password has been reset successfully. You may now log in with your new password.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[POST /api/auth/reset-password]', err);
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
