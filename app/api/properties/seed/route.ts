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

    const extraProperties: any[] = [
      {
        id: "apt-extra-001",
        title: "Palais Royale Skyline Apartment",
        slug: "palais-royale-skyline-apartment-mumbai",
        description: "Luxurious apartment overlooking the Mumbai skyline. High-end finishes, private elevator, gated security, pool, and gym access.",
        transactionType: "buy",
        propertyCategory: "apartment",
        price: 180000000,
        currency: "INR",
        taxHistory: [],
        priceHistory: [],
        formattedAddress: "Palais Royale, Worli Naka, Mumbai, MH 400018, India",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        zipCode: "400018",
        _geo: { lat: 19.0067, lng: 72.8194 },
        neighborhoodNotes: "Premium neighborhood Worli, steps from premium shopping and dining.",
        squareFeet: 3500,
        squareMeters: 325.16,
        totalRooms: 7,
        bedrooms: 3,
        bathrooms: 3,
        yearBuilt: 2021,
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"],
        videoTourUrl: null,
        virtualTourUrl: null,
        status: "active",
        isFeatured: true,
        ownerId: "user-agent-001",
        listerProfile: {
          name: "Sophia Chen",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          phone: "+1 (555) 0199",
          email: "sophia.chen@realhoms.com",
          agencyName: "RealHoms Agency",
          licenseNumber: "NY-RE-0082341",
          agentSlug: "sophia-chen",
        },
        seo: {
          seoTitle: "Palais Royale Skyline Apartment for Sale in Mumbai Worli",
          metaDescription: "3 Bedroom luxury apartment for sale in Worli, Mumbai. Palais Royale Skyline Residence with pool and gym.",
          ogImageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
          keywords: ["mumbai", "worli", "luxury", "skyline", "apartment"]
        },
        amenities: ["Swimming Pool", "Fitness Gym", "Security System", "Elevator"]
      },
      {
        id: "apt-extra-002",
        title: "Gulshan Lakefront Residence",
        slug: "gulshan-lakefront-residence-dhaka",
        description: "Stunning duplex penthouse facing Gulshan Lake. Equipped with smart home automation, terrace garden, and 24/7 power backup.",
        transactionType: "rent",
        propertyCategory: "apartment",
        price: 250000,
        currency: "BDT",
        taxHistory: [],
        priceHistory: [],
        formattedAddress: "Road 79, Gulshan 2, Dhaka 1212, Bangladesh",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zipCode: "1212",
        _geo: { lat: 23.7925, lng: 90.4125 },
        neighborhoodNotes: "Gulshan 2 lakefront. Highly secure diplomatic zone close to embassies and premium clubs.",
        squareFeet: 4200,
        squareMeters: 390.19,
        totalRooms: 9,
        bedrooms: 4,
        bathrooms: 4.5,
        yearBuilt: 2023,
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"],
        videoTourUrl: null,
        virtualTourUrl: null,
        status: "active",
        isFeatured: true,
        ownerId: "user-agent-002",
        listerProfile: {
          name: "Sophia Chen",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          phone: "+1 (555) 0199",
          email: "sophia.chen@realhoms.com",
          agencyName: "RealHoms Agency",
          licenseNumber: "NY-RE-0082341",
          agentSlug: "sophia-chen",
        },
        seo: {
          seoTitle: "Gulshan Lakefront Duplex Penthouse for Rent in Dhaka 2",
          metaDescription: "4 Bedroom duplex lakefront apartment for rent in Gulshan 2, Dhaka. Premium secure location.",
          ogImageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
          keywords: ["dhaka", "gulshan", "penthouse", "lakefront", "rent"]
        },
        amenities: ["Rooftop Terrace", "Security System", "Power Backup", "Smart Home Integration"]
      }
    ];

    const allProps = [...mockProperties, ...extraProperties];

    for (const propMock of allProps) {
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

      const cityCountryMap: Record<string, string> = {
        "New York": "United States",
        "Malibu": "United States",
        "Chicago": "United States",
        "Los Angeles": "United States",
        "East Hampton": "United States",
        "Austin": "United States",
        "Houston": "United States",
        "Shibuya": "Japan",
        "Dubai": "United Arab Emirates",
        "Berlin": "Germany",
        "London": "United Kingdom",
        "Sydney": "Australia",
        "Toronto": "Canada",
        "Melbourne": "Australia",
        "Paris": "France",
        "Singapore": "Singapore",
        "Mumbai": "India",
        "Dhaka": "Bangladesh"
      };

      const resolvedCountry = cityCountryMap[propMock.city] || "United States";

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
        country: resolvedCountry,
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
