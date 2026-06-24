// ─────────────────────────────────────────────────────────────────────────────
// apartmentsMock.ts
// Mock data for Apartment listings — all transaction types: buy & rent
// ─────────────────────────────────────────────────────────────────────────────

import type { ApartmentProperty } from "./propertyTypes";

export const apartmentsMock: ApartmentProperty[] = [
  // ── APT-001: Buy — NYC Penthouse ─────────────────────────────────────────
  {
    id: "apt-001",
    title: "The Summit Residences — Penthouse A",
    slug: "summit-residences-penthouse-a-new-york",
    description:
      "Suspended in the clouds, this extraordinary full-floor penthouse offers 360-degree views of the iconic Manhattan skyline. Features include double-height ceilings, a wrap-around private terrace, a climate-controlled wine cellar, and direct private elevator access. Fully equipped with Crestron smart home automation for climate, motorized blinds, and multi-room media. The master suite spans the entire east wing, with a marble wet room and his-and-her dressing rooms.",
    transactionType: "buy",
    propertyCategory: "apartment",
    price: 9_850_000,
    currency: "USD",
    taxHistory: [
      { year: 2023, taxValue: 132_800, currency: "USD" },
      { year: 2022, taxValue: 128_500, currency: "USD" },
      { year: 2021, taxValue: 119_400, currency: "USD" },
      { year: 2020, taxValue: 115_200, currency: "USD" },
    ],
    priceHistory: [
      { date: "2024-03-15", price: 9_850_000, currency: "USD", event: "listed" },
      { date: "2023-11-20", price: 10_200_000, currency: "USD", event: "expired" },
      { date: "2023-08-01", price: 10_200_000, currency: "USD", event: "listed" },
    ],
    formattedAddress: "742 Park Avenue, Penthouse A, New York, NY 10021",
    city: "New York",
    state: "NY",
    zipCode: "10021",
    _geo: { lat: 40.7694, lng: -73.9678 },
    neighborhoodNotes:
      "Park Avenue / Upper East Side — Manhattan's gold coast of residential real estate. Steps from Central Park, world-class dining, and Museum Mile. Served by 4/5/6 subway lines.",
    squareFeet: 6_800,
    squareMeters: 631.6,
    totalRooms: 9,
    bedrooms: 4,
    bathrooms: 4.5,
    yearBuilt: 2019,
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    virtualTourUrl: "https://my.matterport.com/show/?m=SxQL3iGyvde",
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-001",
    listerProfile: {
      name: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (212) 555-0192",
      email: "sarah.jenkins@brandestate.com",
      agencyName: "Brand Estate Manhattan",
      licenseNumber: "NY-RE-0082341",
      agentSlug: "sophia-chen",
    },
    seo: {
      seoTitle: "Penthouse for Sale in Park Avenue NYC | 4BD/4.5BA | $9.85M — Brand Estate",
      metaDescription:
        "Full-floor penthouse at 742 Park Avenue, Manhattan. 6,800 sq ft, 4 bedrooms, wrap-around terrace, 360° skyline views. Listed at $9.85M.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      keywords: ["penthouse", "luxury", "skyline", "park-avenue", "new-york"],
    },
    amenities: ["Swimming Pool", "Fitness Gym", "Rooftop Terrace", "Security System", "Smart Home Integration", "Elevator"],
    apartment: {
      floorNumber: 52,
      totalBuildingFloors: 52,
      monthlyMaintenanceFee: 8_400,
      hasElevator: true,
      parkingSlotNumber: "LVL-P3-001",
    },
  },

  // ── APT-002: Rent — Tokyo Studio ─────────────────────────────────────────
  {
    id: "apt-002",
    title: "Shibuya Garden Terrace Studio",
    slug: "shibuya-garden-terrace-studio-tokyo",
    description:
      "A quiet, high-tech studio apartment situated in Shibuya's exclusive Nanpeidai district. Outfitted with an intelligent open floor plan, Panasonic heated flooring, premium Japanese furnishings from Karimoku, and a spacious balcony overlooking the private courtyard garden. The compact kitchen features IH induction cooking, a high-efficiency washer-dryer combo, and custom millwork storage throughout.",
    transactionType: "rent",
    propertyCategory: "apartment",
    price: 3_200,
    currency: "USD",
    taxHistory: [],
    priceHistory: [
      { date: "2024-01-01", price: 3_200, currency: "USD", event: "listed" },
      { date: "2023-04-01", price: 3_000, currency: "USD", event: "rented" },
      { date: "2023-03-10", price: 3_000, currency: "USD", event: "listed" },
    ],
    formattedAddress: "2-chome-14 Nanpeidaicho, Shibuya City, Tokyo, 150-0036",
    city: "Shibuya",
    state: "Tokyo",
    zipCode: "150-0036",
    _geo: { lat: 35.6562, lng: 139.6975 },
    neighborhoodNotes:
      "Nanpeidai-cho sits above Shibuya Crossing in the quieter residential pocket of Daikanyama. Walk to Daikanyama T-Site, premium supermarkets, and boutique coffee. 8 min walk to Shibuya station.",
    squareFeet: 520,
    squareMeters: 48.3,
    totalRooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 2021,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: null,
    virtualTourUrl: "https://my.matterport.com/show/?m=Zh14WDtkjdC",
    status: "active",
    isFeatured: false,
    ownerId: "user-agent-002",
    listerProfile: {
      name: "Kenji Nakamura",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
      phone: "+81-3-5555-0214",
      email: "kenji.nakamura@brandestate.jp",
      agencyName: "Brand Estate Tokyo",
      licenseNumber: "JP-RE-T2024-0541",
      agentSlug: "james-okafor",
    },
    seo: {
      seoTitle: "Studio for Rent in Shibuya Nanpeidai, Tokyo | $3,200/mo — Brand Estate",
      metaDescription:
        "Modern 520 sq ft studio in Nanpeidai, Shibuya. Heated floors, balcony, Daikanyama-adjacent. Available from $3,200/month.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    },
    apartment: {
      floorNumber: 5,
      totalBuildingFloors: 12,
      monthlyMaintenanceFee: 180,
      hasElevator: true,
      parkingSlotNumber: "B1-022",
    },
  },

  // ── APT-003: Buy — Dubai Marina High-Rise ────────────────────────────────
  {
    id: "apt-003",
    title: "Silverene Tower — Waterfront Residence",
    slug: "silverene-tower-waterfront-dubai-marina",
    description:
      "A stunning 3-bedroom sky residence in the iconic Silverene Towers, offering unobstructed views of the Dubai Marina walk, the Arabian Gulf, and the Ain Dubai ferris wheel. The apartment features Italian marble flooring throughout, a chef's island kitchen by Bulthaup, automated blackout drapes, and three en-suite master suites. Building amenities include an infinity pool, a 25m lap pool, a Technogym-equipped gym, concierge, and a private beach access shuttle.",
    transactionType: "buy",
    propertyCategory: "apartment",
    price: 4_250_000,
    currency: "AED",
    taxHistory: [
      { year: 2023, taxValue: 0, currency: "AED" }, // No income tax in UAE; DLD registration fee
      { year: 2022, taxValue: 0, currency: "AED" },
    ],
    priceHistory: [
      { date: "2024-05-01", price: 4_250_000, currency: "AED", event: "listed" },
      { date: "2022-09-14", price: 3_900_000, currency: "AED", event: "sold" },
      { date: "2022-08-01", price: 4_050_000, currency: "AED", event: "price_drop" },
      { date: "2022-06-20", price: 4_050_000, currency: "AED", event: "listed" },
    ],
    formattedAddress: "Silverene Tower A, Dubai Marina, Dubai, UAE 00000",
    city: "Dubai",
    state: "Dubai",
    zipCode: "00000",
    _geo: { lat: 25.0772, lng: 55.1373 },
    neighborhoodNotes:
      "Dubai Marina is one of the world's largest man-made marinas. A 24-hour pedestrian-friendly waterfront lined with restaurants, retail, and superyacht berths. Minutes from JBR Beach and the Metro.",
    squareFeet: 2_840,
    squareMeters: 263.8,
    totalRooms: 7,
    bedrooms: 3,
    bathrooms: 3.5,
    yearBuilt: 2014,
    images: [
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    virtualTourUrl: "https://my.matterport.com/show/?m=aSx3M4RaVBf",
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-003",
    listerProfile: {
      name: "Aisha Al Mansoori",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      phone: "+971-4-555-0392",
      email: "aisha.mansoori@brandestate.ae",
      agencyName: "Brand Estate Dubai",
      licenseNumber: "RERA-AE-2024-18742",
      agentSlug: "amara-patel",
    },
    seo: {
      seoTitle: "3-Bed Waterfront Apartment for Sale in Dubai Marina | AED 4.25M — Brand Estate",
      metaDescription:
        "Silverene Tower Dubai Marina — 2,840 sq ft, 3 bedrooms, marina & gulf views, infinity pool, private beach shuttle. AED 4.25 million.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80",
    },
    apartment: {
      floorNumber: 31,
      totalBuildingFloors: 38,
      monthlyMaintenanceFee: 3_800,
      hasElevator: true,
      parkingSlotNumber: "P2-311",
    },
  },
];
