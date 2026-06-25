import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { verifyEdgeJwt } from '@/lib/auth/edge-jwt';

const COOKIE_NAME = 'be_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    // ── 1. Authenticate user from session cookie ──────────────
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const payload = await verifyEdgeJwt(token, JWT_SECRET);

    if (!payload) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    // Enforce role authorization (only 'auth_user' can submit NID)
    if (payload.role !== 'auth_user') {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'Only buyer/renter accounts can submit NID verification.' },
        { status: 403 }
      );
    }

    // ── 2. Parse & validate payload inputs ─────────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { nidCardNumber, nidDocumentUrl } = body as {
      nidCardNumber?: string;
      nidDocumentUrl?: string;
    };

    if (
      !nidCardNumber || typeof nidCardNumber !== 'string' || !nidCardNumber.trim() ||
      !nidDocumentUrl || typeof nidDocumentUrl !== 'string' || !nidDocumentUrl.trim()
    ) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'ValidationError',
          message: 'nidCardNumber and nidDocumentUrl are required fields.',
        },
        { status: 400 }
      );
    }

    // ── 3. Find and update user details ────────────────────────
    await connectDB();

    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'User not found.' },
        { status: 404 }
      );
    }

    user.nidStatus = 'pending';
    user.nidCardNumber = nidCardNumber.trim();
    user.nidDocumentUrl = nidDocumentUrl.trim();
    user.nidSubmittedAt = new Date();
    user.nidRejectionReason = undefined;

    await user.save();

    // ── 4. Respond ────────────────────────────────────────────
    return NextResponse.json(
      {
        status: 'success',
        message: 'NID documents submitted. Account is now pending administrative verification.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[POST /api/user/submit-nid]', err);
    return NextResponse.json(
      {
        status: 'error',
        error: 'InternalServerError',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
