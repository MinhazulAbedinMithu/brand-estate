import { type NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { validateEmail } from '@/lib/auth/validation';
import { signJwt } from '@/lib/auth/tokens';

// Cookie config
const COOKIE_NAME = 'be_auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse & validate input ─────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { email, password } = body as { email?: string; password?: string };

    if (!email || !validateEmail(email) || !password || typeof password !== 'string' || !password.trim()) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // ── 2. Find user in MongoDB ───────────────────────────────
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      '+password' // password field excluded by default — explicitly include it
    );

    // Generic "invalid credentials" for both missing user and wrong password
    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'InvalidCredentials', message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // ── 3. Verify password ────────────────────────────────────
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { status: 'error', error: 'InvalidCredentials', message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // ── 4. Check email verification ───────────────────────────
    if (!user.isVerified) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'AccountNotVerified',
          message: 'Please verify your email address before signing in.',
        },
        { status: 403 }
      );
    }

    // ── 5. Sign JWT ───────────────────────────────────────────
    const token = signJwt({
      id: (user._id as { toString(): string }).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    // ── 6. Set httpOnly cookie + return sanitized user ────────
    const response = NextResponse.json(
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
          nidStatus: user.nidStatus || 'unsubmitted',
          nidCardNumber: user.nidCardNumber,
          nidDocumentUrl: user.nidDocumentUrl,
          nidSubmittedAt: user.nidSubmittedAt?.toISOString(),
          nidRejectionReason: user.nidRejectionReason,

          // KYC
          kycStatus: user.kycStatus || 'unsubmitted',
          kycDocType: user.kycDocType,
          kycDocNumber: user.kycDocNumber,
          kycFrontUrl: user.kycFrontUrl,
          kycBackUrl: user.kycBackUrl,
          kycSelfieUrl: user.kycSelfieUrl,
          kycSubmittedAt: user.kycSubmittedAt?.toISOString(),
          kycRejectionReason: user.kycRejectionReason,

          // Phone
          phoneVerified: user.phoneVerified,
          phone: user.phone,

          // Reports
          backgroundReportStatus: user.backgroundReportStatus || 'unsubmitted',
          backgroundReportUrl: user.backgroundReportUrl,
          backgroundReportSubmittedAt: user.backgroundReportSubmittedAt?.toISOString(),
          creditReportStatus: user.creditReportStatus || 'unsubmitted',
          creditReportUrl: user.creditReportUrl,
          creditScore: user.creditScore,
          creditReportSubmittedAt: user.creditReportSubmittedAt?.toISOString(),

          // Address
          addressLine: user.addressLine,
          addressCity: user.addressCity,
          addressCountry: user.addressCountry,
          
          // Wallet
          walletBalance: user.walletBalance ?? 1000,
        },
        message: 'Logged in successfully.',
      },
      { status: 200 }
    );

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
