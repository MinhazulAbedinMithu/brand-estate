import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { verifyEdgeJwt } from '@/lib/auth/edge-jwt';
import { recordAuditLog } from '@/lib/db/audit';

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

    const { status, reason } = body as { status?: string; reason?: string };

    if (!status || !['active', 'pending', 'suspended', 'unsubmitted'].includes(status)) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Invalid status value provided.' },
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

    user.status = status as 'active' | 'pending' | 'suspended' | 'unsubmitted';
    if (status === 'suspended') {
      user.suspendedReason = reason?.trim() || 'Administrative action suspension.';
    } else {
      user.suspendedReason = undefined;
    }

    await user.save();

    await recordAuditLog(
      request,
      "USER_STATUS_CHANGE",
      `Changed user status for ${user.name} (${user.email}) to "${status}".${
        status === "suspended" ? ` Reason: ${reason || "Violation of terms"}` : ""
      }`
    );

    return NextResponse.json(
      { status: 'success', message: 'User status updated successfully.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('[PATCH /api/admin/users/[id]/status]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to update user status.' },
      { status: 500 }
    );
  }
}
