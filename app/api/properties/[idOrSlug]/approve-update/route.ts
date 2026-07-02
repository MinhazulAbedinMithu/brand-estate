import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/property.model';
import { verifyJwt } from '@/lib/auth/tokens';
import type { PropertyStatus, Currency } from '@/src/mocks/propertyTypes';

const COOKIE_NAME = 'be_auth_token';

function isObjectId(val: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(val);
}

// ─────────────────────────────────────────────
// PATCH /api/properties/[idOrSlug]/approve-update
// Admin-only: merge pendingUpdate diff into live document
// ─────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;

    // ── 1. Auth ───────────────────────────────────────────────
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

    // Admin only
    if (!['admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'Only admins can approve listing updates.' },
        { status: 403 }
      );
    }

    await connectDB();

    const query = isObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug.toLowerCase() };

    const prop = await Property.findOne(query);
    if (!prop) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Property listing not found.' },
        { status: 404 }
      );
    }

    if (!prop.hasPendingUpdate || !prop.pendingUpdate) {
      return NextResponse.json(
        { status: 'error', error: 'NoPendingUpdate', message: 'This listing has no pending update to approve.' },
        { status: 400 }
      );
    }

    // ── 2. Merge pendingUpdate fields into live document ───────
    const diff = prop.pendingUpdate as Record<string, unknown>;

    const coreFields = [
      'title', 'description', 'formattedAddress', 'city', 'state', 'zipCode',
      'squareFeet', 'bedrooms', 'bathrooms', 'yearBuilt', 'images',
      'videoTourUrl', 'virtualTourUrl', 'amenities', 'neighborhoodNotes',
      'applicationFeeRequired',
      'applicationFee',
      'depositRequired',
      'depositAmount',
      'petsAllowed',
      'petAllowanceCharge',
      'outdoorFacilities',
    ];

    for (const field of coreFields) {
      if (diff[field] !== undefined) {
        prop.set(field, diff[field]);
      }
    }

    // Geolocation
    if (diff.latitude !== undefined || diff.longitude !== undefined) {
      prop._geo = {
        lat: parseFloat(String(diff.latitude ?? prop._geo.lat)),
        lng: parseFloat(String(diff.longitude ?? prop._geo.lng)),
      };
    }

    // squareMeters derived from squareFeet
    if (diff.squareFeet !== undefined) {
      prop.squareMeters = Number((parseInt(String(diff.squareFeet), 10) * 0.092903).toFixed(2));
    }

    // Price history tracking
    if (diff.price !== undefined) {
      const newPrice = parseFloat(String(diff.price));
      if (newPrice !== prop.price) {
        const priceDiffEvent = newPrice < prop.price ? 'price_drop' : 'price_increase';
        prop.priceHistory.push({
          date: new Date().toISOString().split('T')[0],
          price: newPrice,
          currency: (diff.currency as Currency) || prop.currency,
          event: priceDiffEvent,
        });
        prop.price = newPrice;
      }
    }

    if (diff.currency !== undefined) {
      prop.currency = diff.currency as Currency;
    }

    // SEO
    if (diff.seo && typeof diff.seo === 'object') {
      const seo = diff.seo as Record<string, unknown>;
      prop.seo = {
        seoTitle: (seo.seoTitle as string | undefined)?.trim() || prop.seo.seoTitle,
        metaDescription: (seo.metaDescription as string | undefined)?.trim() || prop.seo.metaDescription,
        ogImageUrl: (seo.ogImageUrl as string | undefined) || prop.seo.ogImageUrl,
        keywords: (seo.keywords as string[] | undefined) || prop.seo.keywords,
      };
    }

    // Category discriminator sub-docs
    const cat = prop.propertyCategory;
    if (cat === 'apartment' && diff.apartment && typeof diff.apartment === 'object') {
      const a = diff.apartment as Record<string, unknown>;
      prop.apartment = {
        floorNumber: (a.floorNumber as number | undefined) ?? (prop.apartment?.floorNumber ?? 0),
        totalBuildingFloors: (a.totalBuildingFloors as number | undefined) ?? (prop.apartment?.totalBuildingFloors ?? 0),
        monthlyMaintenanceFee: (a.monthlyMaintenanceFee as number | undefined) ?? (prop.apartment?.monthlyMaintenanceFee ?? 0),
        hasElevator: a.hasElevator !== undefined ? !!a.hasElevator : (prop.apartment?.hasElevator ?? false),
        parkingSlotNumber: (a.parkingSlotNumber as string | null | undefined) ?? (prop.apartment?.parkingSlotNumber ?? null),
      };
    } else if (cat === 'house' && diff.house && typeof diff.house === 'object') {
      const h = diff.house as Record<string, unknown>;
      prop.house = {
        lotSizeAcres: (h.lotSizeAcres as number | undefined) ?? (prop.house?.lotSizeAcres ?? 0),
        lotSizeSqFt: (h.lotSizeSqFt as number | undefined) ?? (prop.house?.lotSizeSqFt ?? 0),
        garageSpacesCount: (h.garageSpacesCount as number | undefined) ?? (prop.house?.garageSpacesCount ?? 0),
        roofType: (h.roofType as string | undefined) as never || (prop.house?.roofType ?? 'flat'),
        foundationType: (h.foundationType as string | undefined) as never || (prop.house?.foundationType ?? 'concrete_slab'),
        heatingCoolingSystem: (h.heatingCoolingSystem as string | undefined) ?? (prop.house?.heatingCoolingSystem ?? ''),
        backyardAreaSqFt: (h.backyardAreaSqFt as number | undefined) ?? (prop.house?.backyardAreaSqFt ?? 0),
      };
    } else if (cat === 'room_share' && diff.roomShare && typeof diff.roomShare === 'object') {
      const r = diff.roomShare as Record<string, unknown>;
      prop.roomShare = {
        roomType: (r.roomType as string | undefined) as never || (prop.roomShare?.roomType ?? 'private'),
        bathroomType: (r.bathroomType as string | undefined) as never || (prop.roomShare?.bathroomType ?? 'common'),
        currentOccupantsCount: (r.currentOccupantsCount as number | undefined) ?? (prop.roomShare?.currentOccupantsCount ?? 0),
        preferredGender: (r.preferredGender as string | undefined) as never || (prop.roomShare?.preferredGender ?? 'any'),
        utilitiesIncluded: (r.utilitiesIncluded as string[] | undefined) as never || (prop.roomShare?.utilitiesIncluded ?? []),
        minimumLeasePeriodMonths: (r.minimumLeasePeriodMonths as number | undefined) ?? (prop.roomShare?.minimumLeasePeriodMonths ?? 0),
      };
    } else if (cat === 'commercial' && diff.commercial && typeof diff.commercial === 'object') {
      const c = diff.commercial as Record<string, unknown>;
      prop.commercial = {
        zoningCode: (c.zoningCode as string | undefined) as never || (prop.commercial?.zoningCode ?? 'office'),
        loadingDocksCount: (c.loadingDocksCount as number | undefined) ?? (prop.commercial?.loadingDocksCount ?? 0),
        ceilingHeightFt: (c.ceilingHeightFt as number | undefined) ?? (prop.commercial?.ceilingHeightFt ?? 0),
        minimumLeaseTermYears: (c.minimumLeaseTermYears as number | undefined) ?? (prop.commercial?.minimumLeaseTermYears ?? 0),
        electricalCapacity: (c.electricalCapacity as string | undefined) ?? (prop.commercial?.electricalCapacity ?? ''),
      };
    }

    // Keep listing active and clear the pending overlay
    prop.status = 'active' as PropertyStatus;
    prop.set('hasPendingUpdate', false);
    prop.set('pendingUpdate', null);
    prop.markModified('pendingUpdate');

    await prop.save();

    return NextResponse.json({
      status: 'success',
      message: 'Pending update approved and merged into the live listing.',
      data: {
        id: prop._id.toString(),
        status: prop.status,
        hasPendingUpdate: false,
        updatedAt: prop.updatedAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    console.error('[PATCH /api/properties/[idOrSlug]/approve-update]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
