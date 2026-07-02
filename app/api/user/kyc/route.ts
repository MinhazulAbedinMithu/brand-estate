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

    const { docType, docNumber, frontUrl, backUrl, selfieUrl } = body as {
      docType?: string;
      docNumber?: string;
      frontUrl?: string;
      backUrl?: string;
      selfieUrl?: string;
    };

    if (!docType || !docNumber || !frontUrl || !backUrl || !selfieUrl) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'All KYC fields are required (docType, docNumber, frontUrl, backUrl, selfieUrl).' },
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

    user.kycStatus = 'pending';
    user.kycDocType = docType as 'nid' | 'passport' | 'driving_license';
    user.kycDocNumber = docNumber;
    user.kycFrontUrl = frontUrl;
    user.kycBackUrl = backUrl;
    user.kycSelfieUrl = selfieUrl;
    user.kycSubmittedAt = new Date();
    user.kycRejectionReason = '';

    await user.save();

    return NextResponse.json(
      { status: 'success', message: 'KYC submitted successfully and is pending review.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('KYC submission error:', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: err.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}
