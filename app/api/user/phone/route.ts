import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { getSessionUser } from '@/lib/auth/get-user';

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

    const { phone } = body as { phone?: string };

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Phone number is required.' },
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

    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.phone = phone.trim();
    user.phoneVerificationCode = verificationCode;
    user.phoneVerified = false;

    await user.save();

    return NextResponse.json(
      { 
        status: 'success', 
        message: 'Verification code sent.', 
        code: verificationCode // Expose code to mock UI so user knows what to type!
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Phone request error:', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: err.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}
