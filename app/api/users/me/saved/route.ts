import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { Property, IProperty } from '@/lib/db/models/property.model';
import { verifyJwt } from '@/lib/auth/tokens';

const COOKIE_NAME = 'be_auth_token';

// ─────────────────────────────────────────────
// GET /api/users/me/saved (Read Saved Listings)
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
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
    const user = await User.findById(payload.id).populate('savedProperties').lean();

    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'User account not found.' },
        { status: 404 }
      );
    }

    const savedList = (user.savedProperties || []) as unknown as IProperty[];

    const sanitizedData = savedList
      .filter((p) => p && p._id) // filter out potentially deleted properties
      .map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        description: p.description,
        transactionType: p.transactionType,
        propertyCategory: p.propertyCategory,
        price: p.price,
        currency: p.currency,
        formattedAddress: p.formattedAddress,
        city: p.city,
        state: p.state,
        zipCode: p.zipCode,
        _geo: p._geo,
        squareFeet: p.squareFeet,
        squareMeters: p.squareMeters,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        images: p.images,
        status: p.status,
        isFeatured: p.isFeatured,
        ownerId: p.ownerId.toString(),
        listerProfile: p.listerProfile,
        seo: p.seo,
        amenities: p.amenities,
        apartment: p.apartment,
        house: p.house,
        roomShare: p.roomShare,
        commercial: p.commercial,
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
      }));

    return NextResponse.json({
      status: 'success',
      data: sanitizedData,
    });
  } catch (err: unknown) {
    console.error('[GET /api/users/me/saved]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/users/me/saved (Save Property Listing)
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
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

    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { propertyId } = body;
    if (!propertyId) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Property ID is required.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify property exists
    const propertyExists = await Property.exists({ _id: propertyId });
    if (!propertyExists) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Property listing not found.' },
        { status: 404 }
      );
    }

    // Add to user's savedProperties list
    await User.findByIdAndUpdate(payload.id, {
      $addToSet: { savedProperties: propertyId },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Property listing saved successfully.',
    });
  } catch (err: unknown) {
    console.error('[POST /api/users/me/saved]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
