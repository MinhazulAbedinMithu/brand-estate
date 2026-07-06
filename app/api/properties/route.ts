/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/property.model';
import { User } from '@/lib/db/models/user.model';
import { verifyJwt } from '@/lib/auth/tokens';

const COOKIE_NAME = 'be_auth_token';

// ─────────────────────────────────────────────
// GET /api/properties (Filtered, Paginated)
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Parse queries
    const category = searchParams.get('category'); // apartment, house, room_share, commercial
    const type = searchParams.get('type'); // buy, rent, roommate_share
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const minSqFt = searchParams.get('minSqFt');
    const maxSqFt = searchParams.get('maxSqFt');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy'); // price-asc, price-desc, date-desc, default
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status') || 'active'; // default public search is active

    // Build Mongoose filter object
    const filter: any = {};

    // Filter by status (public vs dashboard)
    if (status !== 'all') {
      filter.status = status;
    }

    if (category) {
      filter.propertyCategory = category;
    }

    if (type) {
      filter.transactionType = type;
    }

    if (city) {
      filter.city = { $regex: new RegExp(city, 'i') };
    }

    if (ownerId) {
      filter.ownerId = ownerId;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Bedrooms / Bathrooms
    if (bedrooms) {
      filter.bedrooms = { $gte: parseInt(bedrooms, 10) };
    }
    if (bathrooms) {
      filter.bathrooms = { $gte: parseFloat(bathrooms) };
    }

    // Size range
    if (minSqFt || maxSqFt) {
      filter.squareFeet = {};
      if (minSqFt) filter.squareFeet.$gte = parseInt(minSqFt, 10);
      if (maxSqFt) filter.squareFeet.$lte = parseInt(maxSqFt, 10);
    }

    // Text search (Atlas-like search regex matching)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { city: { $regex: searchRegex } },
        { formattedAddress: { $regex: searchRegex } },
      ];
    }

    // Sort mapping
    let sortOptions: any = {};
    if (sortBy === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'date-desc') {
      sortOptions = { createdAt: -1 };
    } else {
      // Default: featured first, then newest
      sortOptions = { isFeatured: -1, createdAt: -1 };
    }

    // Pagination bounds
    const skip = (page - 1) * limit;

    const [total, properties] = await Promise.all([
      Property.countDocuments(filter),
      Property.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const sanitizedData = properties.map((p: any) => ({
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
      views: p.views || 0,
      ownerId: p.ownerId.toString(),
      listerProfile: p.listerProfile,
      seo: p.seo,
      amenities: p.amenities,
      apartment: p.apartment,
      house: p.house,
      roomShare: p.roomShare,
      commercial: p.commercial,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    const pages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      status: 'success',
      data: sanitizedData,
      pagination: {
        total,
        page,
        pages,
        limit,
      },
    });
  } catch (err: any) {
    console.error('[GET /api/properties]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/properties (Create Property)
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
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
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Lister account not found.' },
        { status: 401 }
      );
    }

    // Role check
    const isAllowed = ['agent', 'owner', 'admin', 'super_admin'].includes(user.role);
    if (!isAllowed) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to list properties.' },
        { status: 403 }
      );
    }

    // Status check for agents and owners
    if (['agent', 'owner'].includes(user.role) && user.status !== 'active') {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'Your status is not active. Submit documents for approval first.' },
        { status: 403 }
      );
    }

    // ── 2. Parse & Validate input ─────────────────────────────
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Body must be valid JSON.' },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      transactionType,
      propertyCategory,
      price,
      currency,
      formattedAddress,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      squareFeet,
      bedrooms,
      bathrooms,
      yearBuilt,
      images,
      videoTourUrl,
      virtualTourUrl,
      neighborhoodNotes,
      amenities,
      seo,
      apartment,
      house,
      roomShare,
      commercial,
      applicationFeeRequired,
      applicationFee,
      depositRequired,
      depositAmount,
      petsAllowed,
      petAllowanceCharge,
      outdoorFacilities,
    } = body;

    // Validate core fields
    if (!title?.trim() || !description?.trim() || !formattedAddress?.trim() || !city?.trim() || !state?.trim() || !price || !squareFeet) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Missing required core property fields.' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!baseSlug) baseSlug = 'property';
    
    let slug = baseSlug;
    let counter = 1;
    while (await Property.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const priceNum = parseFloat(price);
    const sqFeet = parseInt(squareFeet, 10);
    const sqMeters = Number((sqFeet * 0.092903).toFixed(2));

    // Construct lister profile using agent's account details
    const listerProfile = {
      name: user.name,
      avatar: user.avatar || 'https://cdn.realhoms.com/avatars/default.jpg',
      phone: user.phone || '+1-555-0100', // default fallback
      email: user.email,
      agencyName: user.legalDocs?.agencyName || 'Independent Agent',
      licenseNumber: user.legalDocs?.licenseNumber || '',
      agentSlug: user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    // Construct SEO
    const seoTitle = seo?.seoTitle?.trim() || `${title} | RealHoms`;
    const metaDescription = seo?.metaDescription?.trim() || description.slice(0, 155);
    const ogImageUrl = seo?.ogImageUrl || images?.[0] || '';
    const keywords = seo?.keywords || [];

    // Platform settings: admin/super_admin lists are active automatically, agents require admin review
    const listingStatus = ['admin', 'super_admin'].includes(user.role) ? 'active' : 'pending_approval';

    // Price history record
    const priceHistory = [
      {
        date: new Date().toISOString().split('T')[0],
        price: priceNum,
        currency: currency || 'USD',
        event: 'listed',
      },
    ];

    const newPropData: any = {
      title,
      slug,
      description,
      transactionType,
      propertyCategory,
      price: priceNum,
      currency: currency || 'USD',
      priceHistory,
      taxHistory: [],
      formattedAddress,
      city,
      state,
      zipCode,
      _geo: {
        lat: parseFloat(latitude || '40.7128'),
        lng: parseFloat(longitude || '-74.0060'),
      },
      squareFeet: sqFeet,
      squareMeters: sqMeters,
      totalRooms: parseInt(bedrooms || '0', 10) + parseInt(bathrooms || '0', 10) + 1,
      bedrooms: parseInt(bedrooms || '0', 10),
      bathrooms: parseFloat(bathrooms || '0'),
      yearBuilt: parseInt(yearBuilt || new Date().getFullYear().toString(), 10),
      images: images || [],
      videoTourUrl: videoTourUrl || null,
      virtualTourUrl: virtualTourUrl || null,
      neighborhoodNotes: neighborhoodNotes || '',
      status: listingStatus,
      ownerId: user._id,
      listerProfile,
      seo: {
        seoTitle,
        metaDescription,
        ogImageUrl,
        keywords,
      },
      amenities: amenities || [],
      applicationFeeRequired: !!applicationFeeRequired,
      applicationFee: parseInt(applicationFee || '0', 10) || 0,
      depositRequired: !!depositRequired,
      depositAmount: parseInt(depositAmount || '0', 10) || 0,
      petsAllowed: !!petsAllowed,
      petAllowanceCharge: parseInt(petAllowanceCharge || '0', 10) || 0,
      outdoorFacilities: outdoorFacilities || [],
    };

    // Add category discriminator attributes if matching category
    if (propertyCategory === 'apartment' && apartment) {
      newPropData.apartment = {
        floorNumber: parseInt(apartment.floorNumber || '0', 10),
        totalBuildingFloors: parseInt(apartment.totalBuildingFloors || '0', 10),
        monthlyMaintenanceFee: parseInt(apartment.monthlyMaintenanceFee || '0', 10),
        hasElevator: !!apartment.hasElevator,
        parkingSlotNumber: apartment.parkingSlotNumber || null,
      };
    } else if (propertyCategory === 'house' && house) {
      newPropData.house = {
        lotSizeAcres: parseFloat(house.lotSizeAcres || '0'),
        lotSizeSqFt: parseInt(house.lotSizeSqFt || '0', 10),
        garageSpacesCount: parseInt(house.garageSpacesCount || '0', 10),
        roofType: house.roofType || 'flat',
        foundationType: house.foundationType || 'concrete_slab',
        heatingCoolingSystem: house.heatingCoolingSystem || '',
        backyardAreaSqFt: parseInt(house.backyardAreaSqFt || '0', 10),
      };
    } else if (propertyCategory === 'room_share' && roomShare) {
      newPropData.roomShare = {
        roomType: roomShare.roomType || 'private',
        bathroomType: roomShare.bathroomType || 'common',
        currentOccupantsCount: parseInt(roomShare.currentOccupantsCount || '0', 10),
        preferredGender: roomShare.preferredGender || 'any',
        utilitiesIncluded: roomShare.utilitiesIncluded || [],
        minimumLeasePeriodMonths: parseInt(roomShare.minimumLeasePeriodMonths || '1', 10),
      };
    } else if (propertyCategory === 'commercial' && commercial) {
      newPropData.commercial = {
        zoningCode: commercial.zoningCode || 'office',
        loadingDocksCount: parseInt(commercial.loadingDocksCount || '0', 10),
        ceilingHeightFt: parseInt(commercial.ceilingHeightFt || '0', 10),
        minimumLeaseTermYears: parseInt(commercial.minimumLeaseTermYears || '1', 10),
        electricalCapacity: commercial.electricalCapacity || '',
      };
    }

    const createdProp = await Property.create(newPropData);

    return NextResponse.json(
      {
        status: 'success',
        data: {
          id: (createdProp._id as { toString(): string }).toString(),
          title: createdProp.title,
          slug: createdProp.slug,
          status: createdProp.status,
          createdAt: createdProp.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[POST /api/properties]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
