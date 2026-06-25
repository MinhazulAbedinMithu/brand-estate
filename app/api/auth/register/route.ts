import { type NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import { User, type IUser } from '@/lib/db/models/user.model';
import { validateEmail, validatePassword } from '@/lib/auth/validation';
import { generateVerificationToken, hoursFromNow } from '@/lib/auth/tokens';
import { sendVerificationEmail } from '@/lib/auth/mailer';

// Only these roles may self-register via the public endpoint
const ALLOWED_ROLES = new Set(['auth_user', 'agent', 'owner']);

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

    const { name, email, password, role } = body as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    // Name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'ValidationError',
          message: 'Name is required.',
          details: { name: 'Required' },
        },
        { status: 400 }
      );
    }

    // Email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'ValidationError',
          message: 'A valid email address is required.',
          details: { email: 'Invalid format' },
        },
        { status: 400 }
      );
    }

    // Password
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

    // Role — only auth_user or agent allowed from the public endpoint
    const resolvedRole: IUser['role'] =
      role && ALLOWED_ROLES.has(role)
        ? (role as IUser['role'])
        : 'auth_user';

    // ── 2. Check for duplicate email ──────────────────────────
    await connectDB();

    const existing = await User.findOne({
      email: email.toLowerCase().trim(),
    }).lean();

    if (existing) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'EmailAlreadyExists',
          message: 'An account with this email address already exists.',
        },
        { status: 400 }
      );
    }

    // ── 3. Hash password ──────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password as string, 12);

    // ── 4. Generate verification token (24 hr expiry) ─────────
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = hoursFromNow(24);

    // ── 5. Persist user ───────────────────────────────────────
    const newUser: IUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: resolvedRole,
      status: (resolvedRole === 'agent' || resolvedRole === 'owner') ? 'unsubmitted' : 'active',
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // ── 6. Send verification email ────────────────────────────
    try {
      await sendVerificationEmail(newUser.email, newUser.name, verificationToken);
    } catch (mailErr) {
      // Non-fatal: user is created, email failed. Log and continue.
      console.error('[register] Verification email failed:', mailErr);
    }

    // ── 7. Return sanitized response ──────────────────────────
    return NextResponse.json(
      {
        status: 'success',
        data: {
          id: (newUser._id as { toString(): string }).toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified,
          createdAt: newUser.createdAt,
        },
        message:
          'Registration successful. Please check your email to verify your account.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/auth/register]', err);
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
