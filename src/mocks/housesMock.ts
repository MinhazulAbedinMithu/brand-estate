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

  // ── HSE-004: Buy — Melbourne Heritage Victorian ──────────────────────────
  {
    id: "hse-004",
    title: "South Yarra Converted Victorian Terrace",
    slug: "south-yarra-converted-victorian-terrace-melbourne",
    description:
      "A rare Victorian-era double-fronted terrace seamlessly extended into a contemporary 5-bedroom family home in the heart of South Yarra. The original 1892 bluestone facade and wrought-iron lacework has been preserved impeccably while the rear addition — in polished concrete, spotted gum timber, and glass — opens to a north-facing entertainer's courtyard with an in-ground plunge pool. The architect-designed kitchen features Calacatta marble bench tops, integrated Miele appliances, and a butler's pantry.",
    transactionType: "buy",
    propertyCategory: "house",
    price: 4_800_000,
    currency: "AUD",
    taxHistory: [
      { year: 2023, taxValue: 14_920, currency: "AUD" },
      { year: 2022, taxValue: 14_200, currency: "AUD" },
      { year: 2021, taxValue: 13_100, currency: "AUD" },
    ],
    priceHistory: [
      { date: "2024-07-10", price: 4_800_000, currency: "AUD", event: "listed" },
      { date: "2021-03-20", price: 3_600_000, currency: "AUD", event: "sold" },
    ],
    formattedAddress: "88 Toorak Road, South Yarra, VIC 3141, Australia",
    city: "Melbourne",
    state: "VIC",
    zipCode: "3141",
    _geo: { lat: -37.8390, lng: 144.9938 },
    neighborhoodNotes:
      "South Yarra — Melbourne's undisputed blue-ribbon suburb. Chapel Street boutiques, Fawkner Park, the Royal Botanic Gardens, and the iconic Domain Road restaurant strip are all within walking distance. Tram direct to CBD.",
    squareFeet: 4_200,
    squareMeters: 390.2,
    totalRooms: 11,
    bedrooms: 5,
    bathrooms: 4,
    yearBuilt: 1892,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://www.youtube.com/embed/QH2-TGUlwu4",
    virtualTourUrl: null,
    status: "active",
    isFeatured: false,
    ownerId: "user-agent-007",
    listerProfile: {
      name: "James Whitmore",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      phone: "+61-3-9555-0821",
      email: "james.whitmore@brandestate.com.au",
      agencyName: "Brand Estate Melbourne",
      licenseNumber: "VIC-REAA-2024-08821",
      agentSlug: "marco-rossi",
    },
    seo: {
      seoTitle: "Victorian Terrace for Sale in South Yarra, Melbourne | 5BD | AUD 4.8M — Brand Estate",
      metaDescription:
        "Double-fronted 1892 Victorian terrace extended to 4,200 sq ft in South Yarra. 5 beds, 4 baths, plunge pool, Miele kitchen. AUD 4.8 million.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    },
    house: {
      lotSizeAcres: 0.09,
      lotSizeSqFt: 3_920,
      garageSpacesCount: 2,
      roofType: "slate",
      foundationType: "pier_and_beam",
      heatingCoolingSystem: "Ducted Reverse-Cycle Daikin VRV — 6 zones",
      backyardAreaSqFt: 1_200,
    },
  },

  // ── HSE-005: Buy — Texas Hill Country Ranch ──────────────────────────────
  {
    id: "hse-005",
    title: "Barton Creek Limestone Ranch",
    slug: "barton-creek-limestone-ranch-austin",
    description:
      "A spectacular 18-acre hilltop ranch compound in the Texas Hill Country overlooking Lake Travis. The 6,800 sq ft main residence is built entirely from locally quarried Austin white limestone, with a standing-seam metal roof, 11-foot ceilings, and a great room that opens to a 120-foot limestone ledge infinity pool overlooking 30 miles of Hill Country panorama. The working ranch also includes a 4-stall horse barn, a guest cottage, a climate-controlled wine cave, and a private helipad.",
    transactionType: "buy",
    propertyCategory: "house",
    price: 14_750_000,
    currency: "USD",
    taxHistory: [
      { year: 2023, taxValue: 89_200, currency: "USD" },
      { year: 2022, taxValue: 78_400, currency: "USD" },
      { year: 2021, taxValue: 62_100, currency: "USD" },
    ],
    priceHistory: [
      { date: "2024-01-15", price: 14_750_000, currency: "USD", event: "listed" },
      { date: "2019-11-05", price: 8_900_000, currency: "USD", event: "sold" },
    ],
    formattedAddress: "1200 Barton Creek Blvd, Austin, TX 78746",
    city: "Austin",
    state: "TX",
    zipCode: "78746",
    _geo: { lat: 30.2629, lng: -97.9012 },
    neighborhoodNotes:
      "Barton Creek Reserve, Austin — one of Central Texas's most exclusive gated communities, adjacent to the Barton Creek Greenbelt nature preserve. 20 minutes to downtown Austin, the Circuit of the Americas, and Austin-Bergstrom International Airport.",
    squareFeet: 6_800,
    squareMeters: 631.6,
    totalRooms: 14,
    bedrooms: 5,
    bathrooms: 6,
    yearBuilt: 2018,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1598228723793-28ab8756c13d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://www.youtube.com/embed/ysz5S6PUM-M",
    virtualTourUrl: "https://my.matterport.com/show/?m=eP9XLbR3Hkq",
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-008",
    listerProfile: {
      name: "Marcus Webb",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (512) 555-0441",
      email: "marcus.webb@brandestate.com",
      agencyName: "Brand Estate Austin",
      licenseNumber: "TX-TREC-0841293",
      agentSlug: "daniel-kowalski",
    },
    seo: {
      seoTitle: "Limestone Ranch for Sale in Austin Hill Country | 5BD/6BA | $14.75M — Brand Estate",
      metaDescription:
        "18-acre hilltop ranch compound in Barton Creek, Austin. 6,800 sq ft limestone residence, 120ft infinity pool, horse barn, wine cave, helipad. $14.75 million.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    },
    house: {
      lotSizeAcres: 18.2,
      lotSizeSqFt: 792_792,
      garageSpacesCount: 4,
      roofType: "metal",
      foundationType: "concrete_slab",
      heatingCoolingSystem: "Carrier Geothermal HVAC + Radiant Floor — Full Zoned",
      backyardAreaSqFt: 680_000,
    },
  },
];
