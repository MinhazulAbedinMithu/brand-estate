// ─────────────────────────────────────────────────────────────────────────────
// housesMock.ts
// Mock data for House listings — buy & rent transactions
// ─────────────────────────────────────────────────────────────────────────────

import type { HouseProperty } from "./propertyTypes";

export const housesMock: HouseProperty[] = [
  // ── HSE-001: Buy — Malibu Oceanfront Villa ───────────────────────────────
  {
    id: "hse-001",
    title: "Pacific Crest Modern Sanctuary",
    slug: "pacific-crest-modern-sanctuary-malibu",
    description:
      "An architectural masterpiece designed by Kengo Kuma, nestled directly on the Malibu coastline with 180-foot private ocean frontage. Features an infinity-edge pool cantilevered over the beach, a 14-seat formal dining pavilion, a state-of-the-art chef's kitchen with double Sub-Zero refrigerators and a La Cornue range, and a private guest cottage. Designed with reclaimed teak, Portuguese limestone, and Italian travertine — all sourced responsibly. Four Tesla Powerwalls ensure 72-hour autonomous energy independence.",
    transactionType: "buy",
    propertyCategory: "house",
    price: 28_500_000,
    currency: "USD",
    taxHistory: [
      { year: 2023, taxValue: 312_000, currency: "USD" },
      { year: 2022, taxValue: 298_500, currency: "USD" },
      { year: 2021, taxValue: 270_000, currency: "USD" },
      { year: 2020, taxValue: 255_000, currency: "USD" },
    ],
    priceHistory: [
      { date: "2024-06-01", price: 28_500_000, currency: "USD", event: "listed" },
      { date: "2022-04-10", price: 24_750_000, currency: "USD", event: "sold" },
      { date: "2022-02-01", price: 25_500_000, currency: "USD", event: "price_drop" },
      { date: "2021-10-15", price: 25_500_000, currency: "USD", event: "listed" },
    ],
    formattedAddress: "27400 Pacific Coast Highway, Malibu, CA 90265",
    city: "Malibu",
    state: "CA",
    zipCode: "90265",
    _geo: { lat: 34.0259, lng: -118.7798 },
    neighborhoodNotes:
      "Carbon Beach ('Billionaire's Beach') — one of the most private stretches of coastline in America. Neighbours include A-list celebrities, Fortune 500 executives, and tech founders. PCH provides direct access to Santa Monica and Beverly Hills.",
    squareFeet: 11_400,
    squareMeters: 1_059.1,
    totalRooms: 14,
    bedrooms: 6,
    bathrooms: 7.5,
    yearBuilt: 2022,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    virtualTourUrl: "https://my.matterport.com/show/?m=JTucNwbCCse",
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-001",
    listerProfile: {
      name: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (310) 555-0192",
      email: "sarah.jenkins@brandestate.com",
      agencyName: "Brand Estate Beverly Hills",
      licenseNumber: "CA-DRE-02184732",
      agentSlug: "daniel-kowalski",
    },
    seo: {
      seoTitle: "Oceanfront Villa for Sale in Malibu | 6BD/7.5BA | $28.5M — Brand Estate",
      metaDescription:
        "Kengo Kuma-designed oceanfront villa in Malibu — 11,400 sq ft, 6 bedrooms, infinity pool, 180ft private beach. Listed at $28.5 million.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    },
    house: {
      lotSizeAcres: 1.42,
      lotSizeSqFt: 61_855,
      garageSpacesCount: 4,
      roofType: "flat",
      foundationType: "concrete_slab",
      heatingCoolingSystem: "Hydronics Radiant Floor + Mitsubishi Multi-Zone VRF — 5 zones",
      backyardAreaSqFt: 8_200,
    },
  },

  // ── HSE-002: Buy — Toronto High Park Craftsman ───────────────────────────
  {
    id: "hse-002",
    title: "High Park Oakwood Craftsman",
    slug: "high-park-oakwood-craftsman-toronto",
    description:
      "Beautifully restored early-century Craftsman home in the prestigious High Park neighborhood. Original quarter-sawn oak floors, restored Douglas Fir beamed ceilings, and period-detailed millwork exist harmoniously alongside a fully modernized chef's kitchen featuring Sub-Zero refrigeration and a Wolf six-burner range. The fully finished basement suite includes a separate entrance — perfect for a rental income unit or extended family. The private landscaped backyard features mature maple trees, a cedar deck, and a garden studio/workshop.",
    transactionType: "buy",
    propertyCategory: "house",
    price: 2_150_000,
    currency: "CAD",
    taxHistory: [
      { year: 2023, taxValue: 9_841, currency: "CAD" },
      { year: 2022, taxValue: 9_420, currency: "CAD" },
      { year: 2021, taxValue: 8_975, currency: "CAD" },
      { year: 2020, taxValue: 8_650, currency: "CAD" },
    ],
    priceHistory: [
      { date: "2024-03-05", price: 2_150_000, currency: "CAD", event: "listed" },
      { date: "2018-09-22", price: 1_380_000, currency: "CAD", event: "sold" },
      { date: "2018-08-10", price: 1_419_000, currency: "CAD", event: "price_drop" },
      { date: "2018-07-01", price: 1_419_000, currency: "CAD", event: "listed" },
    ],
    formattedAddress: "214 Glenforest Road, High Park, Toronto, ON M4N 2A4",
    city: "Toronto",
    state: "ON",
    zipCode: "M4N 2A4",
    _geo: { lat: 43.7251, lng: -79.3972 },
    neighborhoodNotes:
      "High Park North — one of Toronto's most sought-after family neighborhoods. Flanks the city's largest park with off-leash areas, a zoo, tennis courts, and summer Shakespeare. Served by High Park subway station (Bloor-Danforth line).",
    squareFeet: 3_840,
    squareMeters: 356.7,
    totalRooms: 10,
    bedrooms: 4,
    bathrooms: 3.5,
    yearBuilt: 1928,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://www.youtube.com/embed/ZbZSe6N_BXs",
    virtualTourUrl: "https://my.matterport.com/show/?m=Zh14WDtkjdC",
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-002",
    listerProfile: {
      name: "Priya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b4e2a4b3?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (416) 555-0387",
      email: "priya.sharma@brandestate.ca",
      agencyName: "Brand Estate Toronto",
      licenseNumber: "RECO-ON-4892017",
      agentSlug: "ashley-brooks",
    },
    seo: {
      seoTitle: "Craftsman Home for Sale in High Park, Toronto | 4BD/3.5BA | CAD 2.15M — Brand Estate",
      metaDescription:
        "Restored 1928 Craftsman at 214 Glenforest Rd, High Park. 3,840 sq ft, 4 beds, original oak floors, landscaped garden, basement suite. CAD 2.15 million.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    },
    house: {
      lotSizeAcres: 0.14,
      lotSizeSqFt: 6_200,
      garageSpacesCount: 2,
      roofType: "asphalt_shingle",
      foundationType: "full_basement",
      heatingCoolingSystem: "Lennox Gas Forced-Air Furnace 96% AFUE + Central A/C",
      backyardAreaSqFt: 3_100,
    },
  },

  // ── HSE-003: Rent — Hamptons Modern Farmhouse ────────────────────────────
  {
    id: "hse-003",
    title: "East Hampton Modern Farmhouse — Summer Rental",
    slug: "east-hampton-modern-farmhouse-summer-rental",
    description:
      "A stunning new-construction Modern Farmhouse estate on a private 2.4-acre lot in East Hampton. This 7,200 sq ft retreat features vaulted shiplap ceilings, wide-plank white oak floors, a showroom Bulthaup kitchen, a 60-foot gunite pool with spa, an outdoor kitchen with a pizza oven and Wolf grill, a putting green, and a detached 2-car garage converted into a private media room and gym. Available as a premium seasonal rental — minimum 4-week engagement.",
    transactionType: "rent",
    propertyCategory: "house",
    price: 75_000,
    currency: "USD",
    taxHistory: [],
    priceHistory: [
      { date: "2024-05-01", price: 75_000, currency: "USD", event: "listed" },
      { date: "2023-05-01", price: 68_000, currency: "USD", event: "rented" },
    ],
    formattedAddress: "18 Lily Pond Lane, East Hampton, NY 11937",
    city: "East Hampton",
    state: "NY",
    zipCode: "11937",
    _geo: { lat: 40.9632, lng: -72.1828 },
    neighborhoodNotes:
      "Lily Pond Lane, East Hampton — the most prestigious address in the Hamptons, flanked by celebrity estates and an easy walk to the village, Main Beach, and high-end farm stands. Seasonal hotspot for the New York elite.",
    squareFeet: 7_200,
    squareMeters: 668.9,
    totalRooms: 16,
    bedrooms: 7,
    bathrooms: 7,
    yearBuilt: 2023,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1598228723793-28ab8756c13d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://vimeo.com/embed/763141698",
    virtualTourUrl: "https://my.matterport.com/show/?m=aSx3M4RaVBf",
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-001",
    listerProfile: {
      name: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (631) 555-0192",
      email: "sarah.jenkins@brandestate.com",
      agencyName: "Brand Estate Beverly Hills",
      licenseNumber: "CA-DRE-02184732",
      agentSlug: "sophia-chen",
    },
    seo: {
      seoTitle: "7-Bed Modern Farmhouse for Rent in East Hampton | $75K/mo — Brand Estate",
      metaDescription:
        "Luxury Modern Farmhouse on Lily Pond Lane, East Hampton — 7,200 sq ft, 7 bedrooms, 60ft pool, outdoor kitchen. From $75,000/month (4-week minimum).",
      ogImageUrl:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    },
    house: {
      lotSizeAcres: 2.4,
      lotSizeSqFt: 104_544,
      garageSpacesCount: 2,
      roofType: "metal",
      foundationType: "concrete_slab",
      heatingCoolingSystem: "Geothermal Heat Pump + Radiant Floor — 8 zones",
      backyardAreaSqFt: 42_000,
    },
  },
];
