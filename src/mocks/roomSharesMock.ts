// ─────────────────────────────────────────────────────────────────────────────
// roomSharesMock.ts
// Mock data for Room Share listings — transactionType: "roommate_share"
// ─────────────────────────────────────────────────────────────────────────────

import type { RoomShareProperty } from "./propertyTypes";

export const roomSharesMock: RoomShareProperty[] = [
  // ── ROOM-001: Private En-Suite — Shoreditch Creative Loft ───────────────
  {
    id: "room-001",
    title: "En-Suite Room in Shoreditch Creative Loft",
    slug: "en-suite-room-shoreditch-creative-loft-london",
    description:
      "Located in the heart of Shoreditch's historic warehouse district, this private en-suite room in an industrial-chic loft has exposed brick walls, high timber beams, and your own attached bathroom with a rainfall shower. The room is on the second floor and receives afternoon western light. Common areas include a large open-plan living room with a projector screen, a fully stocked Smeg-fitted kitchen, and a shared balcony overlooking Redchurch Street. You'll be sharing with two friendly creative professionals (a UX designer and a filmmaker). Bills included.",
    transactionType: "roommate_share",
    propertyCategory: "room_share",
    price: 1_650,
    currency: "GBP",
    taxHistory: [],
    priceHistory: [
      { date: "2024-04-01", price: 1_650, currency: "GBP", event: "listed" },
      { date: "2023-09-15", price: 1_500, currency: "GBP", event: "rented" },
      { date: "2023-09-01", price: 1_500, currency: "GBP", event: "listed" },
    ],
    formattedAddress: "42 Redchurch Street, Shoreditch, London, EC2A 7DP",
    city: "London",
    state: "Greater London",
    zipCode: "EC2A 7DP",
    _geo: { lat: 51.5246, lng: -0.0768 },
    neighborhoodNotes:
      "Shoreditch — East London's tech and creative hub. Surrounded by independent galleries, craft breweries, Michelin-starred eateries, and the Columbia Road Flower Market. 5-minute walk to Shoreditch High Street Overground.",
    squareFeet: 280,
    squareMeters: 26.0,
    totalRooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 1901,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: null,
    virtualTourUrl: null,
    status: "active",
    isFeatured: false,
    ownerId: "user-agent-004",
    listerProfile: {
      name: "David Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      phone: "+44-20-7946-0281",
      email: "david.chen@brandestate.co.uk",
      agencyName: "Brand Estate London",
      licenseNumber: "NAEA-UK-104527",
    },
    seo: {
      seoTitle: "Private En-Suite Room to Rent in Shoreditch, London | £1,650/mo — Brand Estate",
      metaDescription:
        "Private en-suite room in an industrial-chic Shoreditch loft. Bills included. Sharing with 2 professionals. Available from £1,650/month.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    },
    roomShare: {
      roomType: "private",
      bathroomType: "attached",
      currentOccupantsCount: 2,
      preferredGender: "any",
      utilitiesIncluded: ["wifi", "gas", "water", "electricity"],
      minimumLeasePeriodMonths: 3,
    },
  },

  // ── ROOM-002: Private Master — Bondi Beach Townhouse ────────────────────
  {
    id: "room-002",
    title: "Bondi Beach Master Bedroom — Sea Breeze Townhouse",
    slug: "bondi-beach-master-bedroom-sea-breeze-townhouse-sydney",
    description:
      "Wake up to the sound of the ocean. A spacious master bedroom with a private balcony overlooking Bondi Beach in a premium shared townhouse. The room accommodates a king-size bed, has a walk-in wardrobe, and its own private attached bathroom with underfloor heating. You'll share with two female creative professionals. Common areas include a rooftop terrace, a fully equipped kitchen with a Nespresso machine and NutriBullet, a shared Netflix-equipped living room, and a weekly cleaner who covers common areas. Perfect for a Sydney professional or international relocator.",
    transactionType: "roommate_share",
    propertyCategory: "room_share",
    price: 1_950,
    currency: "AUD",
    taxHistory: [],
    priceHistory: [
      { date: "2024-05-01", price: 1_950, currency: "AUD", event: "listed" },
      { date: "2023-11-15", price: 1_800, currency: "AUD", event: "rented" },
      { date: "2023-11-01", price: 1_800, currency: "AUD", event: "listed" },
    ],
    formattedAddress: "88 Marine Parade, Bondi Beach, Sydney, NSW 2026",
    city: "Sydney",
    state: "NSW",
    zipCode: "2026",
    _geo: { lat: -33.8905, lng: 151.2746 },
    neighborhoodNotes:
      "Bondi Beach — Sydney's most iconic beachside suburb. Steps from the Bondi to Bronte coastal walk, Icebergs Dining Room, and Speedo's Café. Bus access to CBD (30 min) and Bondi Junction (10 min).",
    squareFeet: 320,
    squareMeters: 29.7,
    totalRooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 2017,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: null,
    virtualTourUrl: null,
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-007",
    listerProfile: {
      name: "James Whitmore",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      phone: "+61-2-9555-0821",
      email: "james.whitmore@brandestate.com.au",
      agencyName: "Brand Estate Sydney",
      licenseNumber: "NSW-REAA-2024-06421",
    },
    seo: {
      seoTitle: "Master Bedroom Room Share Near Bondi Beach, Sydney | AUD 1,950/mo — Brand Estate",
      metaDescription:
        "Private master bedroom with balcony and attached bath in Bondi Beach townhouse. Sharing with 2 females. All bills + weekly cleaning included. AUD 1,950/mo.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    },
    roomShare: {
      roomType: "private",
      bathroomType: "attached",
      currentOccupantsCount: 2,
      preferredGender: "female",
      utilitiesIncluded: ["wifi", "water", "electricity"],
      minimumLeasePeriodMonths: 2,
    },
  },

  // ── ROOM-003: Shared Room — NYC Midtown Co-Living ────────────────────────
  {
    id: "room-003",
    title: "Midtown Manhattan Co-Living — Shared Studio Flex",
    slug: "midtown-manhattan-co-living-shared-studio-flex",
    description:
      "Affordable co-living flex room in a professionally managed Midtown Manhattan co-living building. The shared room accommodates 2 occupants each with their own lockable wardrobe and dedicated desk space divided by a custom room divider. The 32-floor building features a rooftop terrace with East River views, a co-working lounge, a laundry room on every floor, and a café-style kitchen on the ground floor. Ideal for recent graduates, interns, or budget-conscious young professionals working in Midtown. All utilities and weekly linen cleaning included.",
    transactionType: "roommate_share",
    propertyCategory: "room_share",
    price: 1_100,
    currency: "USD",
    taxHistory: [],
    priceHistory: [
      { date: "2024-02-01", price: 1_100, currency: "USD", event: "listed" },
      { date: "2023-08-01", price: 1_050, currency: "USD", event: "rented" },
    ],
    formattedAddress: "460 Lexington Avenue, Floor 12, New York, NY 10017",
    city: "New York",
    state: "NY",
    zipCode: "10017",
    _geo: { lat: 40.7532, lng: -73.9762 },
    neighborhoodNotes:
      "Midtown East — directly across from Grand Central Terminal. The neighbourhood is a nexus of corporate offices, fine dining, and transit. Steps from 4/5/6 and S subway trains and the 42nd Street crosstown.",
    squareFeet: 160,
    squareMeters: 14.9,
    totalRooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 2019,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: null,
    virtualTourUrl: null,
    status: "active",
    isFeatured: false,
    ownerId: "user-agent-001",
    listerProfile: {
      name: "Tara Mitchell",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (212) 555-0775",
      email: "tara.mitchell@brandestate.com",
      agencyName: "Brand Estate Manhattan",
      licenseNumber: "NY-RE-0091228",
    },
    seo: {
      seoTitle: "Shared Room for Rent in Midtown Manhattan | $1,100/mo — Brand Estate",
      metaDescription:
        "Budget-friendly co-living room in Midtown Manhattan near Grand Central. All utilities and linen included. Ideal for professionals and interns. From $1,100/month.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    },
    roomShare: {
      roomType: "shared",
      bathroomType: "common",
      currentOccupantsCount: 1,
      preferredGender: "any",
      utilitiesIncluded: ["wifi", "water", "electricity", "cable", "trash"],
      minimumLeasePeriodMonths: 1,
    },
  },

  // ── ROOM-004: Private — Berlin Mitte Coliving ────────────────────────────
  {
    id: "room-004",
    title: "Mitte Designer Coliving — Private Room with Common Bath",
    slug: "mitte-designer-coliving-private-room-berlin",
    description:
      "A private furnished room in a curated designer flatshare in the heart of Berlin-Mitte. The room is 18m² with a Hay Copenhagen platform bed, a Muuto desk, integrated wardrobe, and large west-facing windows. The flat is shared with 3 international professionals (a product manager, a journalist, and an architect). The common bathroom is shared exclusively between two tenants. A large chef's kitchen (Fisher & Paykel, Bosch, and Mahlkönig espresso grinder), a living room with a vinyl setup, and a garden terrace are part of the common area. All utilities and a Bike Citizen premium bike share subscription included.",
    transactionType: "roommate_share",
    propertyCategory: "room_share",
    price: 1_150,
    currency: "EUR",
    taxHistory: [],
    priceHistory: [
      { date: "2024-03-01", price: 1_150, currency: "EUR", event: "listed" },
      { date: "2023-09-01", price: 1_050, currency: "EUR", event: "rented" },
    ],
    formattedAddress: "Torstraße 182, Mitte, Berlin 10115",
    city: "Berlin",
    state: "Berlin",
    zipCode: "10115",
    _geo: { lat: 52.5296, lng: 13.4068 },
    neighborhoodNotes:
      "Berlin-Mitte / Rosenthaler Platz — at the intersection of Berlin's creative, tech, and nightlife scenes. Walking distance to Hackescher Markt, Clarchens Ballhaus, and the KW Institute for Contemporary Art. U8 and U2 lines within 3-minute walk.",
    squareFeet: 194,
    squareMeters: 18.0,
    totalRooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 1910,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: null,
    virtualTourUrl: null,
    status: "active",
    isFeatured: false,
    ownerId: "user-agent-009",
    listerProfile: {
      name: "Elena Rostova",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      phone: "+49-30-5555-0812",
      email: "elena.rostova@brandestate.de",
      agencyName: "Brand Estate Berlin",
      licenseNumber: "DE-IVD-2024-B0041",
    },
    seo: {
      seoTitle: "Private Room to Rent in Berlin Mitte | €1,150/mo — Brand Estate",
      metaDescription:
        "Furnished designer room in Mitte flatshare. 18 m², private room, common bath, curated international housemates. All bills + bike share included. €1,150/month.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    },
    roomShare: {
      roomType: "private",
      bathroomType: "common",
      currentOccupantsCount: 3,
      preferredGender: "any",
      utilitiesIncluded: ["wifi", "gas", "water", "electricity"],
      minimumLeasePeriodMonths: 6,
    },
  },

  // ── ROOM-005: Private Female-Only — Singapore Tiong Bahru ────────────────
  {
    id: "room-005",
    title: "Tiong Bahru Heritage Shophouse — Female-Only Room Share",
    slug: "tiong-bahru-heritage-shophouse-female-only-singapore",
    description:
      "A beautifully renovated private bedroom in a 1930s Tiong Bahru Art Deco shophouse, shared exclusively among female professionals. The room features a queen-size Tempur mattress, a custom rattan wardrobe, and a writing desk by local maker Nook & Cranny. The apartment retains original terrazzo floors, arched windows, and a breezeway courtyard — all restored to their 1930s glamour. Shared with two female professionals: a flight attendant and a gallery curator. Attached bathroom is shared between two occupants only. Groceries can be delivered daily from the famous Tiong Bahru wet market.",
    transactionType: "roommate_share",
    propertyCategory: "room_share",
    price: 2_200,
    currency: "SGD",
    taxHistory: [],
    priceHistory: [
      { date: "2024-01-10", price: 2_200, currency: "SGD", event: "listed" },
      { date: "2023-07-01", price: 2_000, currency: "SGD", event: "rented" },
    ],
    formattedAddress: "7 Yong Siak Street, Tiong Bahru, Singapore 168651",
    city: "Singapore",
    state: "Central Region",
    zipCode: "168651",
    _geo: { lat: 1.2841, lng: 103.8268 },
    neighborhoodNotes:
      "Tiong Bahru — Singapore's hippest heritage neighbourhood. Pre-war Art Deco shophouses, bookshops, specialty coffee, and some of Singapore's most celebrated hawker stalls. 5-minute walk to Tiong Bahru MRT (EW Line).",
    squareFeet: 230,
    squareMeters: 21.4,
    totalRooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 1936,
    images: [
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: null,
    virtualTourUrl: null,
    status: "active",
    isFeatured: false,
    ownerId: "user-agent-005",
    listerProfile: {
      name: "Grace Teo",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
      phone: "+65 9123 4567",
      email: "grace.teo@brandestate.sg",
      agencyName: "Brand Estate Singapore",
      licenseNumber: "CEA-SG-R052183I",
    },
    seo: {
      seoTitle: "Female-Only Room Share in Tiong Bahru Heritage Shophouse | SGD 2,200/mo — Brand Estate",
      metaDescription:
        "Private room in a restored 1930s Art Deco shophouse in Tiong Bahru, Singapore. Female professionals only. SGD 2,200/month includes utilities.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
    },
    roomShare: {
      roomType: "private",
      bathroomType: "common",
      currentOccupantsCount: 2,
      preferredGender: "female",
      utilitiesIncluded: ["wifi", "water", "electricity"],
      minimumLeasePeriodMonths: 3,
    },
  },
];
