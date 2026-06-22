import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { verifyEdgeJwt } from '@/lib/auth/edge-jwt';

const COOKIE_NAME = 'be_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || '';

export async function DELETE(
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

    // ── 2. Find target user and delete ───────────────────────
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Target user account not found.' },
        { status: 404 }
      );
    }

    // Security check: normal admins cannot delete other admins or super admins
    if (payload.role === 'admin' && (user.role === 'admin' || user.role === 'super_admin')) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to delete this administrator.' },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { status: 'success', message: 'User deleted successfully.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('[DELETE /api/admin/users/[id]]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to delete user account.' },
      { status: 500 }
    );
  }
}
