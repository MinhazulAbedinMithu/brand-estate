import { type NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { signJwt } from '@/lib/auth/tokens';
import { getSystemSetting } from '@/lib/db/settings';

const COOKIE_NAME = 'be_auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { idToken, role } = body as { idToken?: string; role?: string };

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Firebase ID token is required.' },
        { status: 400 }
      );
    }

    const apiKey = await getSystemSetting("firebaseApiKey", "NEXT_PUBLIC_FIREBASE_API_KEY");
    if (!apiKey) {
      return NextResponse.json(
        { status: 'error', error: 'ConfigError', message: 'Firebase API key is not configured.' },
        { status: 500 }
      );
    }

    // Verify token using Firebase Identity Toolkit lookup endpoint
    const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
    const lookupResponse = await fetch(lookupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (!lookupResponse.ok) {
      const errData = await lookupResponse.json();
      console.error('Firebase token verification failed:', errData);
      return NextResponse.json(
        { status: 'error', error: 'InvalidToken', message: 'Google token verification failed.' },
        { status: 400 }
      );
    }

    const lookupData = await lookupResponse.json();
    const fbUser = lookupData.users?.[0];
    if (!fbUser || !fbUser.email) {
      return NextResponse.json(
        { status: 'error', error: 'InvalidToken', message: 'Token does not contain user email.' },
        { status: 400 }
      );
    }

    const email = fbUser.email.toLowerCase().trim();
    const name = fbUser.displayName || email.split('@')[0];

    await connectDB();

    let user = await User.findOne({ email });

    if (user) {
      if (user.status === 'suspended') {
        return NextResponse.json(
          {
            status: 'error',
            error: 'AccountSuspended',
            message: 'Your account is suspended.',
            suspendedReason: user.suspendedReason || 'No reason specified.',
          },
          { status: 403 }
        );
      }
    } else {
      // Create a new user
      const userRole = (role && ['auth_user', 'agent', 'owner'].includes(role)) ? role : 'auth_user';
      
      // Hash a random password because it is a required field in Mongoose schema
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = new User({
        name,
        email,
        role: userRole,
        password: hashedPassword,
        isVerified: true, // Google accounts are pre-verified
        status: (userRole === 'agent' || userRole === 'owner') ? 'unsubmitted' : 'active',
        avatar: fbUser.photoUrl || '',
        savedProperties: []
      });

      await user.save();
    }

    // Sign JWT
    const token = signJwt({
      id: (user._id as { toString(): string }).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

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
          kycStatus: user.kycStatus || 'unsubmitted',
          kycDocType: user.kycDocType,
          kycDocNumber: user.kycDocNumber,
          kycFrontUrl: user.kycFrontUrl,
          kycBackUrl: user.kycBackUrl,
          kycSelfieUrl: user.kycSelfieUrl,
          kycSubmittedAt: user.kycSubmittedAt?.toISOString(),
          kycRejectionReason: user.kycRejectionReason,
          phoneVerified: user.phoneVerified,
          phone: user.phone,
          backgroundReportStatus: user.backgroundReportStatus || 'unsubmitted',
          backgroundReportUrl: user.backgroundReportUrl,
          backgroundReportSubmittedAt: user.backgroundReportSubmittedAt?.toISOString(),
          creditReportStatus: user.creditReportStatus || 'unsubmitted',
          creditReportUrl: user.creditReportUrl,
          creditScore: user.creditScore,
          creditReportSubmittedAt: user.creditReportSubmittedAt?.toISOString(),
          addressLine: user.addressLine,
          addressCity: user.addressCity,
          addressCountry: user.addressCountry,
          walletBalance: user.walletBalance ?? 1000,
        },
        message: 'Logged in with Google successfully.',
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
  } catch (err: unknown) {
    console.error('[POST /api/auth/google]', err);
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message },
      { status: 500 }
    );
  }
}
