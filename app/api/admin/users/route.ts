import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { verifyEdgeJwt } from '@/lib/auth/edge-jwt';

const COOKIE_NAME = 'be_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(request: NextRequest) {
  try {
    // ── 1. Authenticate & authorize admin session ────────────
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication token required.' },
        { status: 401 }
      );
    }

    const payload = await verifyEdgeJwt(token, JWT_SECRET);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'Administrative access required.' },
        { status: 403 }
      );
    }

    // ── 2. Retrieve and format users from database ───────────
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });

    const mappedUsers = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar || '',
      status: u.status || 'active',
      isVerified: u.isVerified,
      suspendedReason: u.suspendedReason,
      legalDocs: u.legalDocs ? {
        licenseNumber: u.legalDocs.licenseNumber,
        agencyName: u.legalDocs.agencyName,
        documentUrl: u.legalDocs.documentUrl,
        submittedAt: u.legalDocs.submittedAt?.toISOString()
      } : undefined,
      nidStatus: u.nidStatus || 'unsubmitted',
      nidCardNumber: u.nidCardNumber,
      nidDocumentUrl: u.nidDocumentUrl,
      nidSubmittedAt: u.nidSubmittedAt?.toISOString(),
      nidRejectionReason: u.nidRejectionReason,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      { status: 'success', data: mappedUsers },
      { status: 200 }
    );
  } catch (err) {
    console.error('[GET /api/admin/users]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to retrieve user listing.' },
      { status: 500 }
    );
  }
}
