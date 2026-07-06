import { type NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { Property } from '@/lib/db/models/property.model';
import { agentsMock } from '@/src/mocks/agentsMock';
import { mockProperties } from '@/src/mocks/propertiesMock';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    if (force) {
      await Property.deleteMany({});
      // Note: We don't delete users to avoid destroying manually registered test accounts,
      // but we will update/upsert the mock agents.
    }

    const propertiesCount = await Property.countDocuments();
    if (propertiesCount > 0 && !force) {
      return NextResponse.json({
        status: 'success',
        message: 'Database already seeded with properties. Use ?force=true to re-seed.',
        count: propertiesCount,
      });
    }

    // ── 1. Seed Agents ────────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('AgentPassword123!', 12);
    const agentMap: Record<string, string> = {}; // Mock ID -> MongoDB ObjectId string

    for (const agentMock of agentsMock) {
      const email = agentMock.email.toLowerCase().trim();
      let user = await User.findOne({ email });

      const agentData = {
        name: agentMock.name,
        email,
        password: passwordHash,
        role: 'agent' as const,
        status: 'active' as const,
        isVerified: true,
        avatar: agentMock.avatar,
        phone: agentMock.phone,
        slug: agentMock.slug,
        coverImage: agentMock.coverImage,
        title: agentMock.title,
        bio: agentMock.bio,
        location: agentMock.location,
        specializations: agentMock.specializations,
        languages: agentMock.languages,
        yearsExperience: agentMock.yearsExperience,
        activeListings: agentMock.activeListings,
        totalSales: agentMock.totalSales,
        totalVolume: agentMock.totalVolume,
        rating: agentMock.rating,
        reviewCount: agentMock.reviewCount,
        reviews: agentMock.reviews,
        socialLinks: agentMock.socialLinks,
        certifications: agentMock.certifications,
        legalDocs: {
          licenseNumber: agentMock.licenseNumber,
          agencyName: agentMock.title || 'RealHoms Agency',
          documentUrl: agentMock.avatar,
          submittedAt: new Date(),
        },
      };

      if (!user) {
        user = await User.create(agentData);
      } else {
        Object.assign(user, agentData);
        await user.save();
      }

      const userIdStr = (user._id as { toString(): string }).toString();
      agentMap[agentMock.id] = userIdStr;
    }

    // ── 2. Seed Properties ────────────────────────────────────────────────────
    let seededCount = 0;

    for (const propMock of mockProperties) {
      // Map mock ownerId (like "user-agent-001") to the correct MongoDB user ObjectId
      const mockAgentId = propMock.ownerId.replace('user-', '');
      const dbOwnerId = agentMap[mockAgentId] || agentMap['agent-001']; // fallback to Sophia Chen

      if (!dbOwnerId) {
        continue;
      }

      // Check if property with this slug already exists (if not in force mode)
      const existingProp = await Property.findOne({ slug: propMock.slug });
      if (existingProp && !force) {
        continue;
      }

      const sqFeet = propMock.squareFeet;
      const sqMeters = Number((sqFeet * 0.092903).toFixed(2));

      // Build the Mongoose document fields
      const newPropData: Record<string, unknown> = {
        title: propMock.title,
        slug: propMock.slug,
        description: propMock.description,
        transactionType: propMock.transactionType,
        propertyCategory: propMock.propertyCategory,
        price: propMock.price,
        currency: propMock.currency || 'USD',
        taxHistory: propMock.taxHistory || [],
        priceHistory: propMock.priceHistory || [],
        formattedAddress: propMock.formattedAddress,
        city: propMock.city,
        state: propMock.state,
        zipCode: propMock.zipCode,
        _geo: propMock._geo,
        neighborhoodNotes: propMock.neighborhoodNotes || '',
        squareFeet: sqFeet,
        squareMeters: sqMeters,
        totalRooms: propMock.totalRooms || (propMock.bedrooms + propMock.bathrooms + 1),
        bedrooms: propMock.bedrooms,
        bathrooms: propMock.bathrooms,
        yearBuilt: propMock.yearBuilt || 2020,
        images: propMock.images,
        videoTourUrl: propMock.videoTourUrl || null,
        virtualTourUrl: propMock.virtualTourUrl || null,
        status: propMock.status || 'active',
        isFeatured: propMock.isFeatured || false,
        ownerId: dbOwnerId,
        listerProfile: {
          name: propMock.listerProfile.name,
          avatar: propMock.listerProfile.avatar,
          phone: propMock.listerProfile.phone,
          email: propMock.listerProfile.email,
          agencyName: propMock.listerProfile.agencyName,
          licenseNumber: propMock.listerProfile.licenseNumber || '',
          agentSlug: propMock.listerProfile.agentSlug || '',
        },
        seo: {
          seoTitle: propMock.seo.seoTitle || propMock.title,
          metaDescription: propMock.seo.metaDescription || propMock.description,
          ogImageUrl: propMock.seo.ogImageUrl || propMock.images[0],
          keywords: propMock.seo.keywords || [],
        },
        amenities: propMock.amenities || [],
      };

      // Extract discriminator data safely
      if (propMock.propertyCategory === 'apartment' && 'apartment' in propMock) {
        newPropData.apartment = propMock.apartment;
      } else if (propMock.propertyCategory === 'house' && 'house' in propMock) {
        newPropData.house = propMock.house;
      } else if (propMock.propertyCategory === 'room_share' && 'roomShare' in propMock) {
        newPropData.roomShare = propMock.roomShare;
      } else if (propMock.propertyCategory === 'commercial' && 'commercial' in propMock) {
        newPropData.commercial = propMock.commercial;
      }

      if (existingProp && force) {
        // Update existing
        await Property.replaceOne({ _id: existingProp._id }, newPropData);
      } else {
        // Create new
        await Property.create(newPropData);
      }
      seededCount++;
    }

    return NextResponse.json({
      status: 'success',
      message: `Database seeding completed successfully.`,
      agentsCount: Object.keys(agentMap).length,
      propertiesSeededCount: seededCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    console.error('[GET /api/properties/seed]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message },
      { status: 500 }
    );
  }
}
