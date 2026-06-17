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
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
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

  // ── APT-004: Rent — London Shoreditch Loft ───────────────────────────────
  {
    id: "apt-004",
    title: "Redchurch Street Artist's Loft — 2BR",
    slug: "redchurch-street-artists-loft-shoreditch-london",
    description:
      "A characterful two-bedroom converted warehouse loft in the heart of Shoreditch. Exposed Victorian brick walls, 5-metre steel-beam ceilings, original concrete floors, and floor-to-ceiling Crittal steel windows flood the space with natural north light. The open-plan living kitchen features a bespoke Devol kitchen, while both bedrooms have mezzanine platforms and track lighting — perfect for creatives, designers, or tech professionals who want live/work flexibility.",
    transactionType: "rent",
    propertyCategory: "apartment",
    price: 4_200,
    currency: "GBP",
    taxHistory: [],
    priceHistory: [
      { date: "2024-02-01", price: 4_200, currency: "GBP", event: "listed" },
      { date: "2023-07-01", price: 3_950, currency: "GBP", event: "rented" },
      { date: "2023-06-01", price: 3_950, currency: "GBP", event: "listed" },
    ],
    formattedAddress: "42 Redchurch Street, Shoreditch, London, EC2A 7DP",
    city: "London",
    state: "Greater London",
    zipCode: "EC2A 7DP",
    _geo: { lat: 51.5246, lng: -0.0768 },
    neighborhoodNotes:
      "Shoreditch sits at the epicentre of East London's creative and tech economy. Surrounded by independent galleries, Michelin-starred pop-ups, and the vibrant Brick Lane market. Excellent Overground and Central Line access.",
    squareFeet: 1_480,
    squareMeters: 137.5,
    totalRooms: 5,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 1901,
    images: [
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://vimeo.com/embed/924056119",
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
      seoTitle: "2-Bed Warehouse Loft to Rent in Shoreditch | £4,200/mo — Brand Estate",
      metaDescription:
        "Converted loft at 42 Redchurch Street, Shoreditch. 1,480 sq ft, exposed brick, Victorian Crittal windows. Available from £4,200/month.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1200&q=80",
    },
    apartment: {
      floorNumber: 3,
      totalBuildingFloors: 4,
      monthlyMaintenanceFee: 420,
      hasElevator: false,
      parkingSlotNumber: null,
    },
  },

  // ── APT-005: Rent — Singapore Marina Bay ────────────────────────────────
  {
    id: "apt-005",
    title: "Marina Bay Suites — Sky Garden Residence",
    slug: "marina-bay-suites-sky-garden-singapore",
    description:
      "Residence on the 38th floor of the prestigious Marina Bay Suites, one of Singapore's most iconic integrated waterfront developments. The 4-bedroom unit commands sweeping views of Marina Bay, the Supertrees, and the Straits of Singapore. Interiors by Hirsch Bedner Associates: stone floors, custom joinery, and an open-plan gourmet kitchen with Gaggenau appliances. Residents enjoy the SkyGarden infinity pool, two tennis courts, a function suite, and 24-hour concierge.",
    transactionType: "rent",
    propertyCategory: "apartment",
    price: 18_500,
    currency: "SGD",
    taxHistory: [],
    priceHistory: [
      { date: "2024-04-01", price: 18_500, currency: "SGD", event: "listed" },
      { date: "2023-10-01", price: 17_200, currency: "SGD", event: "rented" },
    ],
    formattedAddress: "12 Marina Boulevard, #38-01, Marina Bay Suites, Singapore 018982",
    city: "Singapore",
    state: "Central Region",
    zipCode: "018982",
    _geo: { lat: 1.2831, lng: 103.8604 },
    neighborhoodNotes:
      "Marina Bay CBD — Singapore's prime financial district and entertainment precinct. Directly connected to Raffles Place MRT and Casino/Resort World Sentosa bus services. World-class F&B and retail at The Shoppes at Marina Bay Sands.",
    squareFeet: 3_261,
    squareMeters: 303.0,
    totalRooms: 9,
    bedrooms: 4,
    bathrooms: 4,
    yearBuilt: 2013,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://www.youtube.com/embed/6JYIGclVQDE",
    virtualTourUrl: "https://my.matterport.com/show/?m=NHDj39vEMFL",
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-005",
    listerProfile: {
      name: "Grace Teo",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
      phone: "+65 9123 4567",
      email: "grace.teo@brandestate.sg",
      agencyName: "Brand Estate Singapore",
      licenseNumber: "CEA-SG-R052183I",
      agentSlug: "fatima-al-rashidi",
    },
    seo: {
      seoTitle: "4-Bed Apartment for Rent at Marina Bay Suites, Singapore | SGD 18,500/mo — Brand Estate",
      metaDescription:
        "Sky Garden Residence at Marina Bay Suites — 3,261 sq ft, 4 bedrooms, panoramic marina views. Luxury living from SGD 18,500/month.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    },
    apartment: {
      floorNumber: 38,
      totalBuildingFloors: 55,
      monthlyMaintenanceFee: 1_200,
      hasElevator: true,
      parkingSlotNumber: "L3-038A",
    },
  },

  // ── APT-006: Buy — Paris 7ème Haussmannian ───────────────────────────────
  {
    id: "apt-006",
    title: "Boulevard Saint-Germain — Haussmannian Grand Appartement",
    slug: "boulevard-saint-germain-haussmannian-paris-7",
    description:
      "A classic Haussmannian grand appartement on the 3rd floor (with elevator) in the coveted 7th arrondissement, steps from the Musée d'Orsay and Saint-Thomas d'Aquin. The 240 m² residence features original herringbone parquet floors, a marble fireplace in the salon, 3.4-metre ceiling heights, ornate plasterwork cornices, and a south-facing wrought-iron balcony. Fully renovated by award-winning atelier Ciguë with respect for period detail: new plumbing, electrical, double glazing, and a custom eat-in kitchen by Henry Glass.",
    transactionType: "buy",
    propertyCategory: "apartment",
    price: 5_800_000,
    currency: "EUR",
    taxHistory: [
      { year: 2023, taxValue: 5_420, currency: "EUR" },
      { year: 2022, taxValue: 5_180, currency: "EUR" },
      { year: 2021, taxValue: 4_940, currency: "EUR" },
    ],
    priceHistory: [
      { date: "2024-04-20", price: 5_800_000, currency: "EUR", event: "listed" },
      { date: "2019-06-10", price: 4_200_000, currency: "EUR", event: "sold" },
    ],
    formattedAddress: "124 Boulevard Saint-Germain, 3ème étage, Paris, Île-de-France 75007",
    city: "Paris",
    state: "Île-de-France",
    zipCode: "75007",
    _geo: { lat: 48.8566, lng: 2.3311 },
    neighborhoodNotes:
      "Saint-Germain-des-Prés, 7ème arrondissement — the literary and intellectual heart of Paris. Bordered by the Seine, steps from Café de Flore and Brasserie Lipp. Metro 4, 10, 12 within walking distance.",
    squareFeet: 2_583,
    squareMeters: 240.0,
    totalRooms: 10,
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 1876,
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://vimeo.com/embed/817249205",
    virtualTourUrl: "https://my.matterport.com/show/?m=eP9XLbR3Hkq",
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-006",
    listerProfile: {
      name: "Isabelle Moreau",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      phone: "+33-1-42-86-0012",
      email: "isabelle.moreau@brandestate.fr",
      agencyName: "Brand Estate Paris",
      licenseNumber: "FR-CPI-75-2024-000182",
      agentSlug: "sophia-chen",
    },
    seo: {
      seoTitle: "Haussmannian Apartment for Sale in Saint-Germain, Paris 7ème | €5.8M — Brand Estate",
      metaDescription:
        "Grand Haussmannian appartement on Boulevard Saint-Germain — 240 m², 4 bedrooms, original parquet & marble fireplaces, south-facing balcony. €5.8 million.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    },
    apartment: {
      floorNumber: 3,
      totalBuildingFloors: 6,
      monthlyMaintenanceFee: 1_850,
      hasElevator: true,
      parkingSlotNumber: "Cave-B-07",
    },
  },
];
