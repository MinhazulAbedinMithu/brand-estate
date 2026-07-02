import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { verifyEdgeJwt } from '@/lib/auth/edge-jwt';

const COOKIE_NAME = 'be_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || '';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // ── 2. Parse & validate request inputs ───────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { type, status, reason } = body as {
      type?: 'kyc' | 'background' | 'credit' | 'nid';
      status?: 'verified' | 'rejected' | 'pending';
      reason?: string;
    };

    if (!type || !['kyc', 'background', 'credit', 'nid'].includes(type)) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Invalid verification type.' },
        { status: 400 }
      );
    }

    if (!status || !['verified', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Invalid verification status.' },
        { status: 400 }
      );
    }

    // ── 3. Find target user and save updates ─────────────────
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Target user account not found.' },
        { status: 404 }
      );
    }

    // Security check: normal admins cannot ban/modify other admins or super admins
    if (payload.role === 'admin' && (user.role === 'admin' || user.role === 'super_admin')) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to modify this administrator.' },
        { status: 403 }
      );
    }

    if (type === 'kyc') {
      user.kycStatus = status;
      if (status === 'rejected') {
        user.kycRejectionsCount = (user.kycRejectionsCount || 0) + 1;
        user.kycRejectionReason = reason?.trim() || 'KYC documents rejected.';
        if (user.kycRejectionsCount >= 3) {
          user.status = 'suspended';
          user.suspendedReason = 'Account locked: Exceeded maximum of 3 KYC verification rejections.';
        }
      } else if (status === 'verified') {
        user.kycRejectionsCount = 0;
        user.kycRejectionReason = undefined;
        user.nidStatus = 'verified';
      } else {
        user.kycRejectionReason = undefined;
      }
    } else if (type === 'background') {
      user.backgroundReportStatus = status;
      if (status === 'rejected') {
        user.backgroundRejectionsCount = (user.backgroundRejectionsCount || 0) + 1;
        if (user.backgroundRejectionsCount >= 3) {
          user.status = 'suspended';
          user.suspendedReason = 'Account locked: Exceeded maximum of 3 Background check verification rejections.';
        }
      } else if (status === 'verified') {
        user.backgroundRejectionsCount = 0;
      }
    } else if (type === 'credit') {
      user.creditReportStatus = status;
      if (status === 'rejected') {
        user.creditRejectionsCount = (user.creditRejectionsCount || 0) + 1;
        if (user.creditRejectionsCount >= 3) {
          user.status = 'suspended';
          user.suspendedReason = 'Account locked: Exceeded maximum of 3 Credit Score check verification rejections.';
        }
      } else if (status === 'verified') {
        user.creditRejectionsCount = 0;
      }
    } else if (type === 'nid') {
      user.nidStatus = status;
      if (status === 'rejected') {
        user.kycRejectionsCount = (user.kycRejectionsCount || 0) + 1;
        user.nidRejectionReason = reason?.trim() || 'Verification documents rejected.';
        if (user.kycRejectionsCount >= 3) {
          user.status = 'suspended';
          user.suspendedReason = 'Account locked: Exceeded maximum of 3 identity document verification rejections.';
        }
      } else if (status === 'verified') {
        user.kycRejectionsCount = 0;
        user.nidRejectionReason = undefined;
      } else {
        user.nidRejectionReason = undefined;
      }
    }

    await user.save();

    return NextResponse.json(
      { status: 'success', message: 'User verification status updated successfully.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('[PATCH /api/admin/users/[id]/verification-status]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to update user verification status.' },
      { status: 500 }
    );
  }
}
