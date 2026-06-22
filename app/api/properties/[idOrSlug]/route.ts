import { type NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/property.model';
import { User } from '@/lib/db/models/user.model';
import { verifyJwt } from '@/lib/auth/tokens';
import type {
  PropertyStatus,
  Currency,
  RoofType,
  FoundationType,
  RoomType,
  BathroomType,
  GenderPreference,
  UtilityType,
  CommercialZoningCode,
} from '@/src/mocks/propertyTypes';

// ─────────────────────────────────────────────
// Typed body for PATCH requests
// ─────────────────────────────────────────────
interface PatchPropertyBody {
  title?: string;
  description?: string;
  formattedAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  squareFeet?: string | number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  yearBuilt?: string | number;
  images?: string[];
  videoTourUrl?: string | null;
  virtualTourUrl?: string | null;
  amenities?: string[];
  neighborhoodNotes?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  price?: string | number;
  currency?: Currency;
  status?: PropertyStatus;
  seo?: {
    seoTitle?: string;
    metaDescription?: string;
    ogImageUrl?: string;
    keywords?: string[];
  };
  apartment?: {
    floorNumber?: number;
    totalBuildingFloors?: number;
    monthlyMaintenanceFee?: number;
    hasElevator?: boolean;
    parkingSlotNumber?: string | null;
  };
  house?: {
    lotSizeAcres?: number;
    lotSizeSqFt?: number;
    garageSpacesCount?: number;
    roofType?: RoofType;
    foundationType?: FoundationType;
    heatingCoolingSystem?: string;
    backyardAreaSqFt?: number;
  };
  roomShare?: {
    roomType?: RoomType;
    bathroomType?: BathroomType;
    currentOccupantsCount?: number;
    preferredGender?: GenderPreference;
    utilitiesIncluded?: UtilityType[];
    minimumLeasePeriodMonths?: number;
  };
  commercial?: {
    zoningCode?: CommercialZoningCode;
    loadingDocksCount?: number;
    ceilingHeightFt?: number;
    minimumLeaseTermYears?: number;
    electricalCapacity?: string;
  };
}


const COOKIE_NAME = 'be_auth_token';

// Helper to determine if a string is a 24-char hex MongoDB ObjectId
function isObjectId(val: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(val);
}

// ─────────────────────────────────────────────
// GET /api/properties/[idOrSlug]
// ─────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    await connectDB();
    const { idOrSlug } = await params;

    let query = {};
    if (isObjectId(idOrSlug)) {
      query = { _id: idOrSlug };
    } else {
      query = { slug: idOrSlug.toLowerCase() };
    }

    const prop = await Property.findOne(query).lean();

    if (!prop) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Property listing not found.' },
        { status: 404 }
      );
    }

    const sanitizedData = {
      id: (prop._id as { toString(): string }).toString(),
      title: prop.title,
      slug: prop.slug,
      description: prop.description,
      transactionType: prop.transactionType,
      propertyCategory: prop.propertyCategory,
      price: prop.price,
      currency: prop.currency,
      taxHistory: prop.taxHistory || [],
      priceHistory: prop.priceHistory || [],
      formattedAddress: prop.formattedAddress,
      city: prop.city,
      state: prop.state,
      zipCode: prop.zipCode,
      _geo: prop._geo,
      neighborhoodNotes: prop.neighborhoodNotes || '',
      squareFeet: prop.squareFeet,
      squareMeters: prop.squareMeters,
      totalRooms: prop.totalRooms,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      yearBuilt: prop.yearBuilt,
      images: prop.images,
      videoTourUrl: prop.videoTourUrl,
      virtualTourUrl: prop.virtualTourUrl,
      status: prop.status,
      isFeatured: prop.isFeatured,
      views: prop.views || 0,
      ownerId: prop.ownerId.toString(),
      listerProfile: prop.listerProfile,
      seo: prop.seo,
      amenities: prop.amenities,
      apartment: prop.apartment,
      house: prop.house,
      roomShare: prop.roomShare,
      commercial: prop.commercial,
      createdAt: prop.createdAt.toISOString(),
      updatedAt: prop.updatedAt.toISOString(),
    };

    return NextResponse.json({
      status: 'success',
      data: sanitizedData,
    });
  } catch (err: unknown) {
    console.error('[GET /api/properties/[idOrSlug]]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PATCH /api/properties/[idOrSlug]
// ─────────────────────────────────────────────
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

    // Check permissions (owner or admin/super_admin)
    const isOwner = prop.ownerId.toString() === payload.id;
    const isAdmin = ['admin', 'super_admin'].includes(payload.role);
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to modify this listing.' },
        { status: 403 }
      );
    }

    // ── 2. Parse updates ──────────────────────────────────────
    let body: PatchPropertyBody;
    try {
      body = await request.json() as PatchPropertyBody;
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Body must be valid JSON.' },
        { status: 400 }
      );
    }

    // List of allowed update fields
    const coreFields = [
      'title',
      'description',
      'formattedAddress',
      'city',
      'state',
      'zipCode',
      'squareFeet',
      'bedrooms',
      'bathrooms',
      'yearBuilt',
      'images',
      'videoTourUrl',
      'virtualTourUrl',
      'amenities',
      'neighborhoodNotes',
    ];

    // Apply core updates — cast body to indexed type for dynamic field loop
    const indexableBody = body as Record<string, unknown>;
    for (const field of coreFields) {
      if (indexableBody[field] !== undefined) {
        prop.set(field, indexableBody[field]);
      }
    }

    // Geolocation coords
    if (body.latitude !== undefined || body.longitude !== undefined) {
      prop._geo = {
        lat: parseFloat(String(body.latitude !== undefined ? body.latitude : prop._geo.lat)),
        lng: parseFloat(String(body.longitude !== undefined ? body.longitude : prop._geo.lng)),
      };
    }

    // Derive squareMeters if squareFeet updated
    if (body.squareFeet !== undefined) {
      prop.squareMeters = Number((parseInt(String(body.squareFeet), 10) * 0.092903).toFixed(2));
    }

    // Track price modification history
    if (body.price !== undefined) {
      const newPrice = parseFloat(String(body.price));
      if (newPrice !== prop.price) {
        const priceDiffEvent = newPrice < prop.price ? 'price_drop' : 'price_increase';
        prop.priceHistory.push({
          date: new Date().toISOString().split('T')[0],
          price: newPrice,
          currency: body.currency || prop.currency,
          event: priceDiffEvent,
        });
        prop.price = newPrice;
      }
    }

    if (body.currency !== undefined) {
      prop.currency = body.currency;
    }

    // SEO updates
    if (body.seo) {
      prop.seo = {
        seoTitle: body.seo.seoTitle?.trim() || prop.seo.seoTitle,
        metaDescription: body.seo.metaDescription?.trim() || prop.seo.metaDescription,
        ogImageUrl: body.seo.ogImageUrl || prop.seo.ogImageUrl,
        keywords: body.seo.keywords || prop.seo.keywords,
      };
    }

    // Category discriminator updates
    const cat = prop.propertyCategory;
    if (cat === 'apartment' && body.apartment) {
      prop.apartment = {
        floorNumber: body.apartment.floorNumber ?? (prop.apartment?.floorNumber ?? 0),
        totalBuildingFloors: body.apartment.totalBuildingFloors ?? (prop.apartment?.totalBuildingFloors ?? 0),
        monthlyMaintenanceFee: body.apartment.monthlyMaintenanceFee ?? (prop.apartment?.monthlyMaintenanceFee ?? 0),
        hasElevator: body.apartment.hasElevator !== undefined ? !!body.apartment.hasElevator : (prop.apartment?.hasElevator ?? false),
        parkingSlotNumber: body.apartment.parkingSlotNumber !== undefined ? body.apartment.parkingSlotNumber : (prop.apartment?.parkingSlotNumber ?? null),
      };
    } else if (cat === 'house' && body.house) {
      prop.house = {
        lotSizeAcres: body.house.lotSizeAcres ?? (prop.house?.lotSizeAcres ?? 0),
        lotSizeSqFt: body.house.lotSizeSqFt ?? (prop.house?.lotSizeSqFt ?? 0),
        garageSpacesCount: body.house.garageSpacesCount ?? (prop.house?.garageSpacesCount ?? 0),
        roofType: body.house.roofType || (prop.house?.roofType ?? 'flat'),
        foundationType: body.house.foundationType || (prop.house?.foundationType ?? 'concrete_slab'),
        heatingCoolingSystem: body.house.heatingCoolingSystem !== undefined ? body.house.heatingCoolingSystem : (prop.house?.heatingCoolingSystem ?? ''),
        backyardAreaSqFt: body.house.backyardAreaSqFt ?? (prop.house?.backyardAreaSqFt ?? 0),
      };
    } else if (cat === 'room_share' && body.roomShare) {
      prop.roomShare = {
        roomType: body.roomShare.roomType || (prop.roomShare?.roomType ?? 'private'),
        bathroomType: body.roomShare.bathroomType || (prop.roomShare?.bathroomType ?? 'common'),
        currentOccupantsCount: body.roomShare.currentOccupantsCount ?? (prop.roomShare?.currentOccupantsCount ?? 0),
        preferredGender: body.roomShare.preferredGender || (prop.roomShare?.preferredGender ?? 'any'),
        utilitiesIncluded: body.roomShare.utilitiesIncluded || (prop.roomShare?.utilitiesIncluded ?? []),
        minimumLeasePeriodMonths: body.roomShare.minimumLeasePeriodMonths ?? (prop.roomShare?.minimumLeasePeriodMonths ?? 0),
      };
    } else if (cat === 'commercial' && body.commercial) {
      prop.commercial = {
        zoningCode: body.commercial.zoningCode || (prop.commercial?.zoningCode ?? 'office'),
        loadingDocksCount: body.commercial.loadingDocksCount ?? (prop.commercial?.loadingDocksCount ?? 0),
        ceilingHeightFt: body.commercial.ceilingHeightFt ?? (prop.commercial?.ceilingHeightFt ?? 0),
        minimumLeaseTermYears: body.commercial.minimumLeaseTermYears ?? (prop.commercial?.minimumLeaseTermYears ?? 0),
        electricalCapacity: body.commercial.electricalCapacity !== undefined ? body.commercial.electricalCapacity : (prop.commercial?.electricalCapacity ?? ''),
      };
    }

    // ── 3. Determine how to commit the changes ──────────────
    //
    // KEY BUSINESS RULE:
    //   • New listing (never active) or admin editing → apply directly.
    //   • Agent editing an already-active listing → store changes as
    //     pendingUpdate overlay. The live listing stays "active" and
    //     publicly visible. Admin reviews and merges/discards the diff.
    //
    const isActiveListing = prop.status === 'active';

    if (!isAdmin && isActiveListing) {
      // ── PENDING UPDATE PATH ──────────────────────────────
      // Do NOT write any live fields. Store the full submitted body
      // as a pending overlay for admin to review. Previous pending
      // diff (if any) is overwritten by the latest submission.
      prop.set('hasPendingUpdate', true);
      prop.set('pendingUpdate', {
        ...(body as Record<string, unknown>),
        submittedAt: new Date(),
      });

      await prop.save();

      return NextResponse.json({
        status: 'success',
        data: {
          id: prop._id.toString(),
          status: prop.status,
          hasPendingUpdate: true,
          updatedAt: prop.updatedAt.toISOString(),
        },
        message: 'Your changes have been submitted for admin review. The current listing stays live until approved.',
      });
    }

    // ── DIRECT APPLY PATH (new listing or admin) ─────────────
    if (!isAdmin) {
      // New/rejected/draft listing edited by agent → back to pending_approval
      prop.status = 'pending_approval';
    } else if (body.status !== undefined) {
      // Admins can change status directly
      prop.status = body.status;
    }

    await prop.save();

    return NextResponse.json({
      status: 'success',
      data: {
        id: prop._id.toString(),
        price: prop.price,
        status: prop.status,
        updatedAt: prop.updatedAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    console.error('[PATCH /api/properties/[idOrSlug]]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/properties/[idOrSlug]
// ─────────────────────────────────────────────
export async function DELETE(
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
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to delete this listing.' },
        { status: 403 }
      );
    }

    await Property.deleteOne({ _id: prop._id });

    return NextResponse.json({
      status: 'success',
      message: 'Property listing deleted successfully.',
    });
  } catch (err: unknown) {
    console.error('[DELETE /api/properties/[idOrSlug]]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
