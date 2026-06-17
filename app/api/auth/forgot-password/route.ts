import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { validateEmail } from '@/lib/auth/validation';
import { generateResetToken, hoursFromNow } from '@/lib/auth/tokens';
import { sendPasswordResetEmail } from '@/lib/auth/mailer';

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

    const { email } = body as { email?: string };

    if (!email || !validateEmail(email)) {
      // Return the same success message to prevent user enumeration
      return NextResponse.json(
        {
          status: 'success',
          message:
            'If that email address exists in our database, we have sent a password reset link.',
        },
        { status: 200 }
      );
    }

    // ── 2. Connect to DB — look up user silently ──────────────
    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // If user not found, return success anyway (anti-enumeration per spec)
    if (!user) {
      return NextResponse.json(
        {
          status: 'success',
          message:
            'If that email address exists in our database, we have sent a password reset link.',
        },
        { status: 200 }
      );
    }

    // ── 3. Generate reset token (1 hr expiry) ─────────────────
    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = hoursFromNow(1);
    await user.save();

    // ── 4. Send reset email ───────────────────────────────────
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (mailErr) {
      console.error('[forgot-password] Reset email failed:', mailErr);
      // Per spec: if mailer fails, return 500 EmailDispatchFailed
      return NextResponse.json(
        {
          status: 'error',
          error: 'EmailDispatchFailed',
          message:
            'Unable to send recovery email at this time. Please try again later.',
        },
        { status: 500 }
      );
    }

    // ── 5. Respond ────────────────────────────────────────────
    return NextResponse.json(
      {
        status: 'success',
        message:
          'If that email address exists in our database, we have sent a password reset link.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[POST /api/auth/forgot-password]', err);
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
