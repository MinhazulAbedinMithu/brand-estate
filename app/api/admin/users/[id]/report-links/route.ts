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

    // ── 2. Parse request body ────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { type, url, score } = body as {
      type?: 'background' | 'credit';
      url?: string;
      score?: number | null;
    };

    if (!type || !['background', 'credit'].includes(type)) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Invalid report type.' },
        { status: 400 }
      );
    }

    // ── 3. Update the user ───────────────────────────────────
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Target user account not found.' },
        { status: 404 }
      );
    }

    if (payload.role === 'admin' && (user.role === 'admin' || user.role === 'super_admin')) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to modify this administrator.' },
        { status: 403 }
      );
    }

    if (type === 'background') {
      user.backgroundReportUrl = url || undefined;
    } else if (type === 'credit') {
      user.creditReportUrl = url || undefined;
      if (score !== undefined) {
        user.creditScore = score === null ? undefined : score;
      }
    }

    await user.save();

    return NextResponse.json(
      { status: 'success', message: 'Report link updated successfully.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('[PATCH /api/admin/users/[id]/report-links]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'Failed to update report links.' },
      { status: 500 }
    );
  }
}
