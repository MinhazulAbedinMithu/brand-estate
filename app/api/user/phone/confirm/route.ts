import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { getSessionUser } from '@/lib/auth/get-user';
import { getSystemSetting } from '@/lib/db/settings';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { code, token, phone } = body as { code?: string; token?: string; phone?: string };

    // 1. Firebase Token Verification Flow
    if (token) {
      if (!phone || !phone.trim()) {
        return NextResponse.json(
          { status: 'error', error: 'ValidationError', message: 'Phone number is required for token verification.' },
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

      const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
      const lookupResponse = await fetch(lookupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
      });

      if (!lookupResponse.ok) {
        const errData = await lookupResponse.json();
        console.error('Firebase token verification failed:', errData);
        return NextResponse.json(
          { status: 'error', error: 'InvalidToken', message: 'Firebase token verification failed.' },
          { status: 400 }
        );
      }

      const lookupData = await lookupResponse.json();
      const fbUser = lookupData.users?.[0];
      if (!fbUser || !fbUser.phoneNumber) {
        return NextResponse.json(
          { status: 'error', error: 'InvalidToken', message: 'Token does not contain a verified phone number.' },
          { status: 400 }
        );
      }

      const cleanInput = phone.trim().replace(/[\s-()]/g, "");
      const cleanFb = fbUser.phoneNumber.trim().replace(/[\s-()]/g, "");

      if (cleanInput !== cleanFb && !cleanFb.endsWith(cleanInput.replace(/^\+/, ""))) {
        return NextResponse.json(
          { 
            status: 'error', 
            error: 'MismatchedPhone', 
            message: `The verified phone number (${fbUser.phoneNumber}) does not match the requested number.` 
          },
          { status: 400 }
        );
      }

      await connectDB();
      const user = await User.findById(session.id);
      if (!user) {
        return NextResponse.json(
          { status: 'error', error: 'NotFound', message: 'User not found.' },
          { status: 404 }
        );
      }

      user.phone = fbUser.phoneNumber;
      user.phoneVerified = true;
      user.phoneVerificationCode = '';
      await user.save();

      return NextResponse.json(
        { status: 'success', message: 'Phone number verified successfully.' },
        { status: 200 }
      );
    }

    // 2. Legacy Mock Code Verification Flow
    if (!code || !code.trim()) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Verification code or token is required.' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'User not found.' },
        { status: 404 }
      );
    }

    if (user.phoneVerificationCode !== code.trim()) {
      return NextResponse.json(
        { status: 'error', error: 'InvalidCode', message: 'The verification code is incorrect.' },
        { status: 400 }
      );
    }

    user.phoneVerified = true;
    user.phoneVerificationCode = '';

    await user.save();

    return NextResponse.json(
      { status: 'success', message: 'Phone number verified successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Phone confirmation error:', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: err.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}
