// ─────────────────────────────────────────────────────────────────────────────
// commercialMock.ts
// Mock data for Commercial Space listings — buy & rent, all zoning types
// ─────────────────────────────────────────────────────────────────────────────

import type { CommercialProperty } from "./propertyTypes";

export const commercialMock: CommercialProperty[] = [
  // ── COM-001: Rent — Berlin Mitte Retail/Office Mixed-Use ─────────────────
  {
    id: "com-001",
    title: "Mitte Creative Hub — High-Street Showroom",
    slug: "mitte-creative-hub-high-street-showroom-berlin",
    description:
      "Highly visible premium retail and office flagship space in Berlin's historic Mitte business district on Friedrichstraße. The 1,100 m² bipartite space features massive floor-to-ceiling steel-framed storefront windows, 6-metre ceilings, polished concrete floors, and three independently rentable sub-suites on the upper mezzanine. Fully wired fibre server rooms, double loading docks for freight, a central reception atrium, and 5 underground parking bays. Previously occupied by a major fashion house — fitted with category-A office infrastructure including raised floors and a BMS building management system.",
    transactionType: "rent",
    propertyCategory: "commercial",
    price: 32_500,
    currency: "EUR",
    taxHistory: [
      { year: 2023, taxValue: 0, currency: "EUR" }, // Tenant pays Gewerbesteuer (trade tax) directly
      { year: 2022, taxValue: 0, currency: "EUR" },
    ],
    priceHistory: [
      { date: "2024-02-01", price: 32_500, currency: "EUR", event: "listed" },
      { date: "2022-07-01", price: 28_000, currency: "EUR", event: "rented" },
      { date: "2022-06-01", price: 30_000, currency: "EUR", event: "price_drop" },
    ],
    formattedAddress: "74 Friedrichstraße, Mitte, Berlin 10117",
    city: "Berlin",
    state: "Berlin",
    zipCode: "10117",
    _geo: { lat: 52.5121, lng: 13.3892 },
    neighborhoodNotes:
      "Friedrichstraße — Berlin's premium commercial high street. A hub for luxury retail, media companies, and global brands. Located near the Gendarmenmarkt and major transit: U6, S1/S2/S25/S5/S7 at Friedrichstraße Bahnhof.",
    squareFeet: 11_840,
    squareMeters: 1_100.0,
    totalRooms: 14,
    bedrooms: 0,
    bathrooms: 4,
    yearBuilt: 2012,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://vimeo.com/embed/871234099",
    virtualTourUrl: "https://my.matterport.com/show/?m=NHDj39vEMFL",
    status: "active",
    isFeatured: true,
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
      seoTitle: "Retail & Office Space for Rent on Friedrichstraße, Berlin | €32,500/mo — Brand Estate",
      metaDescription:
        "1,100 m² mixed-use showroom on Friedrichstraße, Berlin Mitte. 6m ceilings, loading docks, 5 parking bays, Category-A fit-out. From €32,500/month.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    },
    commercial: {
      zoningCode: "retail",
      loadingDocksCount: 2,
      ceilingHeightFt: 19.7,
      minimumLeaseTermYears: 3,
      electricalCapacity: "400A / 3-Phase 400V",
    },
  },

  // ── COM-002: Buy — Chicago Loop Office Tower Suite ────────────────────────
  {
    id: "com-002",
    title: "Loop Business Plaza — Premium Office Suite",
    slug: "loop-business-plaza-premium-office-chicago",
    description:
      "A prime corner office suite spanning the entire 14th floor of a landmark 40-story building in the heart of the Chicago Loop. The 9,200 sq ft full-floor plate features a private executive boardroom suite, 3 glass-walled conference rooms, a wellness room, an enterprise server closet, a 12-person reception area, and a private executive dining room. Built out to Tier-3 data center specs: dual 10Gb fibre feeds, N+1 redundancy, and a 250kVA UPS in a dedicated electrical room. Direct skybridge connection to Chicago Transit's Red and Blue line stations.",
    transactionType: "buy",
    propertyCategory: "commercial",
    price: 6_400_000,
    currency: "USD",
    taxHistory: [
      { year: 2023, taxValue: 112_400, currency: "USD" },
      { year: 2022, taxValue: 108_200, currency: "USD" },
      { year: 2021, taxValue: 101_800, currency: "USD" },
    ],
    priceHistory: [
      { date: "2024-01-10", price: 6_400_000, currency: "USD", event: "listed" },
      { date: "2019-04-22", price: 4_750_000, currency: "USD", event: "sold" },
      { date: "2019-03-01", price: 4_900_000, currency: "USD", event: "price_drop" },
    ],
    formattedAddress: "333 South State Street, Floor 14, Chicago, IL 60604",
    city: "Chicago",
    state: "IL",
    zipCode: "60604",
    _geo: { lat: 41.8781, lng: -87.6298 },
    neighborhoodNotes:
      "Chicago Loop — the city's central business district and financial hub. Surrounded by Millennium Park, the Art Institute of Chicago, and the Chicago Riverwalk. Excellent access to all CTA rail lines and Metra commuter rail.",
    squareFeet: 9_200,
    squareMeters: 854.8,
    totalRooms: 18,
    bedrooms: 0,
    bathrooms: 3,
    yearBuilt: 2008,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://www.youtube.com/embed/G1IbRujko-A",
    virtualTourUrl: null,
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-010",
    listerProfile: {
      name: "Marcus Webb",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (312) 555-0441",
      email: "marcus.webb@brandestate.com",
      agencyName: "Brand Estate Chicago",
      licenseNumber: "IL-DRE-0041928",
    },
    seo: {
      seoTitle: "Full-Floor Office Suite for Sale in Chicago Loop | 9,200 sq ft | $6.4M — Brand Estate",
      metaDescription:
        "Full 14th-floor office plate at 333 S. State St, Chicago. 9,200 sq ft, 3 conference rooms, Tier-3 data build-out, skybridge transit access. $6.4 million.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    },
    commercial: {
      zoningCode: "office",
      loadingDocksCount: 0,
      ceilingHeightFt: 11.5,
      minimumLeaseTermYears: 5,
      electricalCapacity: "1000A / Single-Phase 208V + 250kVA UPS",
    },
  },

  // ── COM-003: Rent — Los Angeles Industrial Warehouse ─────────────────────
  {
    id: "com-003",
    title: "Arts District Industrial Warehouse — Creative Production Space",
    slug: "arts-district-industrial-warehouse-los-angeles",
    description:
      "A cavernous 24,000 sq ft industrial warehouse in LA's thriving Arts District, ideal for film production, large-scale fabrication, e-commerce fulfillment, or creative studio use. The building features three grade-level loading doors (18 ft clearance), two interior loading docks with levellers, 30-foot clear ceiling heights, 800A/3-Phase 480V power, a dedicated mezzanine office of 2,400 sq ft, 12 skylights, and a rear concrete yard of 8,000 sq ft for overflow storage or truck staging. Already home to two major streaming platform productions in the past two years.",
    transactionType: "rent",
    propertyCategory: "commercial",
    price: 48_000,
    currency: "USD",
    taxHistory: [],
    priceHistory: [
      { date: "2024-04-01", price: 48_000, currency: "USD", event: "listed" },
      { date: "2023-05-01", price: 42_000, currency: "USD", event: "rented" },
      { date: "2023-04-10", price: 44_000, currency: "USD", event: "price_drop" },
    ],
    formattedAddress: "2200 Alameda Street, Arts District, Los Angeles, CA 90021",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90021",
    _geo: { lat: 34.0283, lng: -118.2314 },
    neighborhoodNotes:
      "LA Arts District — one of the fastest-growing creative and industrial neighbourhoods in the US. Adjacent to major production studios, tech headquarters, and the Fashion District. Excellent truck access to the 10 Freeway and the Port of LA.",
    squareFeet: 24_000,
    squareMeters: 2_229.7,
    totalRooms: 6,
    bedrooms: 0,
    bathrooms: 4,
    yearBuilt: 1968,
    images: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: null,
    virtualTourUrl: null,
    status: "active",
    isFeatured: false,
    ownerId: "user-agent-011",
    listerProfile: {
      name: "Carlos Mendes",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (323) 555-0641",
      email: "carlos.mendes@brandestate.com",
      agencyName: "Brand Estate Los Angeles",
      licenseNumber: "CA-DRE-01982847",
    },
    seo: {
      seoTitle: "Industrial Warehouse for Rent in LA Arts District | 24,000 sq ft | $48K/mo — Brand Estate",
      metaDescription:
        "24,000 sq ft industrial warehouse in the LA Arts District. 30ft ceilings, 2 loading docks, 800A/3-Phase power, 8,000 sq ft yard. Available from $48,000/month.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    },
    commercial: {
      zoningCode: "industrial",
      loadingDocksCount: 2,
      ceilingHeightFt: 30.0,
      minimumLeaseTermYears: 2,
      electricalCapacity: "800A / 3-Phase 480V",
    },
  },

  // ── COM-004: Buy — Houston Distribution Warehouse ────────────────────────
  {
    id: "com-004",
    title: "Greenway Logistics Centre — Class-A Warehouse",
    slug: "greenway-logistics-centre-class-a-warehouse-houston",
    description:
      "A state-of-the-art Class-A distribution warehouse strategically situated at the intersection of two major Houston freight corridors. The 85,000 sq ft facility features 8 ESFR-sprinklered truck docks with pneumatic levellers, two drive-in ramped doors for 53-foot trailer access, 36-foot clear ceiling heights, a Tier-1 2000A/3-Phase electrical service, a 12,000 sq ft climate-controlled pharmaceutical-grade sub-bay, and 1.2 acres of truck court and auto-parking (120 stalls). Fully installed with Honeywell Novar building management, 4G+ network repeaters, and a 20kW rooftop solar array.",
    transactionType: "buy",
    propertyCategory: "commercial",
    price: 24_500_000,
    currency: "USD",
    taxHistory: [
      { year: 2023, taxValue: 298_000, currency: "USD" },
      { year: 2022, taxValue: 281_400, currency: "USD" },
      { year: 2021, taxValue: 265_200, currency: "USD" },
    ],
    priceHistory: [
      { date: "2024-06-01", price: 24_500_000, currency: "USD", event: "listed" },
      { date: "2020-02-15", price: 16_200_000, currency: "USD", event: "sold" },
    ],
    formattedAddress: "5800 Greenway Plaza, Katy Freeway, Houston, TX 77027",
    city: "Houston",
    state: "TX",
    zipCode: "77027",
    _geo: { lat: 29.7432, lng: -95.4592 },
    neighborhoodNotes:
      "Greenway Freeway Corridor — one of the most active commercial freight zones in Texas. Adjacent to Beltway 8 and Interstate 10, with 40-minute access to the Port of Houston and Bush Intercontinental Airport.",
    squareFeet: 85_000,
    squareMeters: 7_897.4,
    totalRooms: 10,
    bedrooms: 0,
    bathrooms: 6,
    yearBuilt: 2017,
    images: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://www.youtube.com/embed/j5a0jTc9S10",
    virtualTourUrl: null,
    status: "active",
    isFeatured: true,
    ownerId: "user-agent-008",
    listerProfile: {
      name: "Marcus Webb",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (713) 555-0441",
      email: "marcus.webb@brandestate.com",
      agencyName: "Brand Estate Houston",
      licenseNumber: "TX-TREC-0841293",
    },
    seo: {
      seoTitle: "Class-A Warehouse for Sale in Houston | 85,000 sq ft | $24.5M — Brand Estate",
      metaDescription:
        "Greenway Logistics Centre — 85,000 sq ft Class-A warehouse in Houston. 8 dock doors, 36ft ceilings, 2000A/3-Phase, pharma sub-bay, 1.2-acre truck court. $24.5 million.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
    },
    commercial: {
      zoningCode: "warehouse",
      loadingDocksCount: 8,
      ceilingHeightFt: 36.0,
      minimumLeaseTermYears: 10,
      electricalCapacity: "2000A / 3-Phase 480V + 20kW Solar",
    },
  },

  // ── COM-005: Rent — NYC SoHo Boutique Retail ─────────────────────────────
  {
    id: "com-005",
    title: "SoHo Cast-Iron Boutique Retail — Ground Floor Flagship",
    slug: "soho-cast-iron-boutique-retail-flagship-new-york",
    description:
      "An extraordinarily rare ground-floor retail flagship opportunity in a landmarked SoHo Cast-Iron building on Broadway. The 3,800 sq ft space features 14-foot pressed tin ceilings, original maple wood floors, four street-facing full-height arched windows with historic iron detailing, a private rear stockroom of 800 sq ft, and a full basement of 3,200 sq ft for storage. Utilities separately metered; tenant responsible for trade fixtures. Previously occupied by a global luxury fashion house — a plug-and-play retail opportunity with unparalleled foot traffic on SoHo's premier shopping corridor.",
    transactionType: "rent",
    propertyCategory: "commercial",
    price: 58_000,
    currency: "USD",
    taxHistory: [],
    priceHistory: [
      { date: "2024-03-20", price: 58_000, currency: "USD", event: "listed" },
      { date: "2022-09-01", price: 49_500, currency: "USD", event: "rented" },
      { date: "2022-08-01", price: 52_000, currency: "USD", event: "price_drop" },
      { date: "2022-06-01", price: 52_000, currency: "USD", event: "listed" },
    ],
    formattedAddress: "560 Broadway, Ground Floor, SoHo, New York, NY 10012",
    city: "New York",
    state: "NY",
    zipCode: "10012",
    _geo: { lat: 40.7238, lng: -73.9979 },
    neighborhoodNotes:
      "SoHo Broadway — the world's most influential retail corridor for luxury and fashion brands. Surrounded by Louis Vuitton, Prada, Balenciaga, and Apple. Served by the B/D/F/M at Broadway-Lafayette and N/Q/R/W at Prince Street.",
    squareFeet: 3_800,
    squareMeters: 353.1,
    totalRooms: 4,
    bedrooms: 0,
    bathrooms: 2,
    yearBuilt: 1882,
    images: [
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    ],
    videoTourUrl: "https://vimeo.com/embed/923718041",
    virtualTourUrl: "https://my.matterport.com/show/?m=JTucNwbCCse",
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
    },
    seo: {
      seoTitle: "Flagship Retail for Rent on SoHo Broadway, NYC | 3,800 sq ft | $58K/mo — Brand Estate",
      metaDescription:
        "Landmarked Cast-Iron ground floor at 560 Broadway, SoHo. 3,800 sq ft, 14ft pressed-tin ceilings, arched windows, 3,200 sq ft basement. $58,000/month.",
      ogImageUrl:
        "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80",
    },
    commercial: {
      zoningCode: "retail",
      loadingDocksCount: 0,
      ceilingHeightFt: 14.0,
      minimumLeaseTermYears: 5,
      electricalCapacity: "200A / Single-Phase 120/240V",
    },
  },
];
