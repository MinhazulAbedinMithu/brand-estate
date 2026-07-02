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

    const { documentUrl } = body as { documentUrl?: string };

    if (!documentUrl || !documentUrl.trim()) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Document URL is required.' },
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

    user.backgroundReportStatus = 'pending';
    user.backgroundReportUrl = documentUrl.trim();
    user.backgroundReportSubmittedAt = new Date();

    await user.save();

    return NextResponse.json(
      { status: 'success', message: 'Background report submitted successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Background report error:', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: err.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}
