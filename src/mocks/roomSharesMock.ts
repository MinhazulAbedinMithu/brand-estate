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
      agentSlug: "james-okafor",
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
      "Bondi Beach — Sydney's most iconic beachside suburb. Steps from the Bondi to Bronte coastal walk, Icebergs Dining Room, and Speedo's Café. Box access to CBD (30 min) and Bondi Junction (10 min).",
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
      agentSlug: "marco-rossi",
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
      agentSlug: "sophia-chen",
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
];
