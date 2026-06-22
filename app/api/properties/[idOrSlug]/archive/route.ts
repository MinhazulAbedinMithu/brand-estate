import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/property.model';
import { verifyJwt } from '@/lib/auth/tokens';
import type { PropertyStatus } from '@/src/mocks/propertyTypes';

const COOKIE_NAME = 'be_auth_token';

function isObjectId(val: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(val);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;

    // ── 1. Check Auth ─────────────────────────────────────────
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Session expired or invalid.' },
        { status: 401 }
      );
    }

    await connectDB();

    // Query property
    let query = {};
    if (isObjectId(idOrSlug)) {
      query = { _id: idOrSlug };
    } else {
      query = { slug: idOrSlug.toLowerCase() };
    }

    const prop = await Property.findOne(query);
    if (!prop) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Property listing not found.' },
        { status: 404 }
      );
    }

    // Verify owner or admin permissions
    const isOwner = prop.ownerId.toString() === payload.id;
    const isAdmin = ['admin', 'super_admin'].includes(payload.role);
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to archive this listing.' },
        { status: 403 }
      );
    }

    // ── 2. Parse status ────────────────────────────────────────
    let body: { status?: string };
    try {
      body = await request.json() as { status?: string };
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { status } = body;
    const allowedStatuses = ['active', 'draft', 'sold', 'rented'];

    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Invalid status for archive transition.' },
        { status: 400 }
      );
    }

    // Update status
    prop.status = status as PropertyStatus;
    
    // Also record event in priceHistory
    const eventName = status === 'sold' ? 'sold' : status === 'rented' ? 'rented' : 'relisted';
    prop.priceHistory.push({
      date: new Date().toISOString().split('T')[0],
      price: prop.price,
      currency: prop.currency,
      event: eventName,
    });

    await prop.save();

    return NextResponse.json({
      status: 'success',
      data: {
        id: prop._id.toString(),
        status: prop.status,
      },
    });
  } catch (err: unknown) {
    console.error('[PATCH /api/properties/[idOrSlug]/archive]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
