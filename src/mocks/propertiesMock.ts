// ─────────────────────────────────────────────
// Type Definitions & Interfaces
// ─────────────────────────────────────────────

export interface ListerProfile {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  agencyName: string;
}

export interface PropertyLocation {
  street: string;
  city: string;
  state: string;
  zip: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ParkingConfig {
  type: "garage" | "driveway" | "street" | "carport" | "underground" | "valet" | "none";
  spaces: number;
}

export interface UtilitiesConfig {
  water: boolean;
  gas: boolean;
  internet: boolean;
}

export interface RiskFactors {
  climateZone: string;
  fireRisk: "low" | "medium" | "high";
  floodZone: boolean;
}

// Base Property Interface
export interface BaseProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  transactionType: "buy" | "rent";
  location: PropertyLocation;
  yearBuilt: number;
  agentCommissionPercent: number;
  listerProfile: ListerProfile;
  rooms: number;
  washrooms: number;
  balconies: number;
  parking: ParkingConfig;
  utilities: UtilitiesConfig;
  riskFactors: RiskFactors;
  images: string[];
  floorPlanUrl: string;
}

// Discriminator Interfaces
export interface Apartment extends BaseProperty {
  type: "apartment";
  floorNumber: number;
  hasElevator: boolean;
  monthlyHOAFees: number;
}

export interface House extends BaseProperty {
  type: "house";
  lotSizeSqFt: number;
  hasBasement: boolean;
  stories: number;
}

export interface RoomShare extends BaseProperty {
  type: "roomshare";
  roommateCount: number;
  isPrivateBath: boolean;
  genderPreference: "any" | "female" | "male";
}

export interface Commercial extends BaseProperty {
  type: "commercial";
  zoningType: string; // e.g. Retail, Office, Industrial, Mixed-use
  hasLoadingDock: boolean;
  businessLicenseRequired: boolean;
}

// Union Type for mock properties
export type MockProperty = Apartment | House | RoomShare | Commercial;

// ─────────────────────────────────────────────
// Mock Data Array
// ─────────────────────────────────────────────

export const mockProperties: MockProperty[] = [
  {
    id: "mock-prop-apt-1",
    type: "apartment",
    title: "The Summit Residences — Penthouse A",
    description: "Suspended in the clouds, this extraordinary penthouse offers 360-degree views of the iconic city skyline. Features include double-height ceilings, a wrap-around private terrace, a climate-controlled wine cellar, and direct private elevator access. Fully equipped with smart home automation for climate, blinds, and media.",
    price: 2850000,
    transactionType: "buy",
    yearBuilt: 2019,
    agentCommissionPercent: 2.5,
    listerProfile: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 019-2834",
      email: "sarah.jenkins@brandestate.com",
      agencyName: "Brand Estate Beverly Hills"
    },
    location: {
      street: "742 Park Avenue, Penthouse B",
      city: "New York",
      state: "NY",
      zip: "10021",
      coordinates: {
        lat: 40.7694,
        lng: -73.9678
      }
    },
    rooms: 3,
    washrooms: 3.5,
    balconies: 2,
    parking: {
      type: "valet",
      spaces: 2
    },
    utilities: {
      water: true,
      gas: true,
      internet: true
    },
    riskFactors: {
      climateZone: "Humid Subtropical (Cfa)",
      fireRisk: "low",
      floodZone: false
    },
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    floorNumber: 42,
    hasElevator: true,
    monthlyHOAFees: 1250
  },
  {
    id: "mock-prop-house-1",
    type: "house",
    title: "Pacific Crest Modern Sanctuary",
    description: "An architectural masterpiece nestled in the Malibu coastline, featuring panoramic ocean views, an infinity pool, a state-of-the-art chef's kitchen, and a private guest house. Designed with materials sourced from Italy, the villa offers true resort-style living with automated smart home systems and integrated Tesla Powerwalls.",
    price: 5200000,
    transactionType: "buy",
    yearBuilt: 2022,
    agentCommissionPercent: 3.0,
    listerProfile: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 019-2834",
      email: "sarah.jenkins@brandestate.com",
      agencyName: "Brand Estate Beverly Hills"
    },
    location: {
      street: "27400 Pacific Coast Highway",
      city: "Malibu",
      state: "CA",
      zip: "90265",
      coordinates: {
        lat: 34.0259,
        lng: -118.7798
      }
    },
    rooms: 5,
    washrooms: 6,
    balconies: 3,
    parking: {
      type: "garage",
      spaces: 4
    },
    utilities: {
      water: true,
      gas: true,
      internet: true
    },
    riskFactors: {
      climateZone: "Mediterranean (Csb)",
      fireRisk: "high",
      floodZone: false
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    lotSizeSqFt: 18500,
    hasBasement: false,
    stories: 2
  },
  {
    id: "mock-prop-room-1",
    type: "roomshare",
    title: "En-Suite Room in Shoreditch Creative Loft",
    description: "Located in the heart of the historic warehouse district, this industrial-chic loft room has exposed brick walls, high timber beams, and a private attached bathroom. Common areas include a large open-plan living room, fully stocked kitchen, and a shared balcony overlooking Redchurch Street.",
    price: 1450,
    transactionType: "rent",
    yearBuilt: 2015,
    agentCommissionPercent: 5.0,
    listerProfile: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 014-9821",
      email: "david.chen@brandestate.com",
      agencyName: "Brand Estate London Group"
    },
    location: {
      street: "42 Redchurch Street",
      city: "London",
      state: "Greater London",
      zip: "EC2A 7DP",
      coordinates: {
        lat: 51.5246,
        lng: -0.0768
      }
    },
    rooms: 1, // 1 private room rented
    washrooms: 1, // 1 private attached washroom
    balconies: 1, // shared
    parking: {
      type: "none",
      spaces: 0
    },
    utilities: {
      water: true,
      gas: true,
      internet: true
    },
    riskFactors: {
      climateZone: "Temperate Oceanic (Cfb)",
      fireRisk: "low",
      floodZone: true // near River Thames basin scope
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    roommateCount: 2,
    isPrivateBath: true,
    genderPreference: "any"
  },
  {
    id: "mock-prop-comm-1",
    type: "commercial",
    title: "Mitte Creative Hub — High-Street Showroom",
    description: "Highly visible retail and premium office building in the center of Berlin's historic Mitte business district. Features massive floor-to-ceiling street front windows, multi-zone central air, fully wired server rooms, double loading docks, and 5 underground parking slots.",
    price: 12500,
    transactionType: "rent",
    yearBuilt: 2012,
    agentCommissionPercent: 4.0,
    listerProfile: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 018-3729",
      email: "elena.rostova@brandestate.com",
      agencyName: "Rostova Global Advisors"
    },
    location: {
      street: "74 Friedrichstraße",
      city: "Berlin",
      state: "Berlin State",
      zip: "10117",
      coordinates: {
        lat: 52.5121,
        lng: 13.3892
      }
    },
    rooms: 8,
    washrooms: 4,
    balconies: 0,
    parking: {
      type: "underground",
      spaces: 5
    },
    utilities: {
      water: true,
      gas: true,
      internet: true
    },
    riskFactors: {
      climateZone: "Marine West Coast (Cfb)",
      fireRisk: "low",
      floodZone: false
    },
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    zoningType: "mixed-use retail/office",
    hasLoadingDock: true,
    businessLicenseRequired: true
  },
  {
    id: "mock-prop-apt-2",
    type: "apartment",
    title: "Shibuya Garden Terrace Studio",
    description: "A quiet, high-tech studio apartment situated in Shibuya's exclusive Nanpeidai district. Outfitted with intelligent floor plans, heated flooring, premium Japanese furnishings, and a spacious balcony overlooking the private courtyard garden.",
    price: 3200,
    transactionType: "rent",
    yearBuilt: 2021,
    agentCommissionPercent: 5.0,
    listerProfile: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 014-9821",
      email: "david.chen@brandestate.com",
      agencyName: "Brand Estate London Group"
    },
    location: {
      street: "2-chome Nanpeidaicho",
      city: "Shibuya",
      state: "Tokyo",
      zip: "150-0036",
      coordinates: {
        lat: 35.6562,
        lng: 139.6975
      }
    },
    rooms: 1,
    washrooms: 1,
    balconies: 1,
    parking: {
      type: "underground",
      spaces: 1
    },
    utilities: {
      water: true,
      gas: true,
      internet: true
    },
    riskFactors: {
      climateZone: "Humid Subtropical (Cfa)",
      fireRisk: "low",
      floodZone: false
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    floorNumber: 5,
    hasElevator: true,
    monthlyHOAFees: 350
  },
  {
    id: "mock-prop-house-2",
    type: "house",
    title: "High Park Oakwood Craftsman",
    description: "Beautifully restored Craftsman home in the prestigious High Park neighborhood. Features a private landscaped backyard, red-brick accents, original oak flooring, high-end subzero kitchen appliances, and a completely finished basement suite perfect for rental or in-law accommodation.",
    price: 1450000,
    transactionType: "buy",
    yearBuilt: 1938,
    agentCommissionPercent: 2.0,
    listerProfile: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 019-2834",
      email: "sarah.jenkins@brandestate.com",
      agencyName: "Brand Estate Beverly Hills"
    },
    location: {
      street: "214 Glenforest Road",
      city: "Toronto",
      state: "ON",
      zip: "M4N 2A4",
      coordinates: {
        lat: 43.7251,
        lng: -79.3972
      }
    },
    rooms: 4,
    washrooms: 3,
    balconies: 1,
    parking: {
      type: "driveway",
      spaces: 2
    },
    utilities: {
      water: true,
      gas: true,
      internet: true
    },
    riskFactors: {
      climateZone: "Humid Continental (Dfb)",
      fireRisk: "low",
      floodZone: false
    },
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80"
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    lotSizeSqFt: 6200,
    hasBasement: true,
    stories: 2
  },
  {
    id: "mock-prop-room-2",
    type: "roomshare",
    title: "Bondi Beach Co-Living Loft",
    description: "Wake up to ocean breezes! A spacious master bedroom with a private attached balcony in a shared premium townhouse right on Bondi Beach. Shares a modern kitchen, roof deck, and living space with two creative professionals. Inclusive of all utilities.",
    price: 1100,
    transactionType: "rent",
    yearBuilt: 2017,
    agentCommissionPercent: 6.0,
    listerProfile: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 014-9821",
      email: "david.chen@brandestate.com",
      agencyName: "Brand Estate London Group"
    },
    location: {
      street: "88 Marine Parade",
      city: "Sydney",
      state: "NSW",
      zip: "2026",
      coordinates: {
        lat: -33.8291,
        lng: 151.2415
      }
    },
    rooms: 1,
    washrooms: 1,
    balconies: 1,
    parking: {
      type: "street",
      spaces: 0
    },
    utilities: {
      water: true,
      gas: true,
      internet: true
    },
    riskFactors: {
      climateZone: "Temperate (Cfb)",
      fireRisk: "low",
      floodZone: true
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80"
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    roommateCount: 2,
    isPrivateBath: true,
    genderPreference: "female"
  },
  {
    id: "mock-prop-comm-2",
    type: "commercial",
    title: "Loop Business Plaza — Office Suite",
    description: "Prime corner office suite located in the heart of Chicago's Loop. Features high-speed fiber internet lines, 3 modern conference rooms, private executive offices, and direct skybridge connection to city transit hubs.",
    price: 1750000,
    transactionType: "buy",
    yearBuilt: 2008,
    agentCommissionPercent: 2.2,
    listerProfile: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 018-3729",
      email: "elena.rostova@brandestate.com",
      agencyName: "Rostova Global Advisors"
    },
    location: {
      street: "333 South State Street",
      city: "Chicago",
      state: "IL",
      zip: "60604",
      coordinates: {
        lat: 41.8781,
        lng: -87.6298
      }
    },
    rooms: 12,
    washrooms: 2,
    balconies: 0,
    parking: {
      type: "garage",
      spaces: 3
    },
    utilities: {
      water: true,
      gas: true,
      internet: true
    },
    riskFactors: {
      climateZone: "Humid Continental (Dfa)",
      fireRisk: "low",
      floodZone: false
    },
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    zoningType: "Office Commercial (C3)",
    hasLoadingDock: false,
    businessLicenseRequired: true
  }
];
