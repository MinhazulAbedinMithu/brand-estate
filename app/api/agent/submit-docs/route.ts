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

    // Enforce role authorization (only 'agent' or 'owner' can submit credentials)
    if (payload.role !== 'agent' && payload.role !== 'owner') {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'Only agents or owners can submit credentials.' },
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

    const { licenseNumber, agencyName, documentUrl } = body as {
      licenseNumber?: string;
      agencyName?: string;
      documentUrl?: string;
    };

    if (
      !licenseNumber || typeof licenseNumber !== 'string' || !licenseNumber.trim() ||
      !agencyName || typeof agencyName !== 'string' || !agencyName.trim() ||
      !documentUrl || typeof documentUrl !== 'string' || !documentUrl.trim()
    ) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'ValidationError',
          message: 'licenseNumber, agencyName, and documentUrl are required fields.',
        },
        { status: 400 }
      );
    }

    // ── 3. Find and update agent user details ──────────────────
    await connectDB();

    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'User not found.' },
        { status: 404 }
      );
    }

    // Sets legal documents and updates user status to 'pending'
    user.legalDocs = {
      licenseNumber: licenseNumber.trim(),
      agencyName: agencyName.trim(),
      documentUrl: documentUrl.trim(),
      submittedAt: new Date(),
    };
    user.status = 'pending';

    await user.save();

    // ── 4. Respond ────────────────────────────────────────────
    return NextResponse.json(
      {
        status: 'success',
        message: 'Credentials submitted. Account is now pending administrative approval.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[POST /api/agent/submit-docs]', err);
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
