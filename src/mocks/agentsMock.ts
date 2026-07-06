// ─────────────────────────────────────────────────────────────────────────────
// agentsMock.ts
// 8 realistic mock real-estate agents spanning multiple cities & specialties
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string; // initials fallback
  rating: number; // 1–5
  comment: string;
  date: string;
  propertyType: string;
}

export interface MockAgent {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  avatar: string; // Unsplash URL
  coverImage: string; // Unsplash URL — profile banner
  title: string; // e.g. "Senior Residential Agent"
  bio: string;
  location: { city: string; state: string; country: string };
  specializations: string[]; // e.g. ["Luxury Residential", "Investments"]
  languages: string[];
  licenseNumber: string;
  yearsExperience: number;
  activeListings: number;
  totalSales: number;
  totalVolume: string; // "$42M+"
  rating: number;
  reviewCount: number;
  reviews: AgentReview[];
  listingIds: string[]; // refs to mock property IDs
  socialLinks: { platform: string; url: string }[];
  certifications: string[];
  joinedAt: string;
}

export const agentsMock: MockAgent[] = [
  {
    id: "agent-001",
    slug: "sophia-chen",
    name: "Sophia Chen",
    email: "sophia.chen@realhoms.com",
    phone: "+1 (212) 555-0142",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    title: "Senior Luxury Residential Agent",
    bio: "With over 14 years navigating New York City's ultra-competitive luxury market, Sophia has become the go-to advisor for high-net-worth buyers and international investors. Known for her meticulous attention to detail and deep neighborhood expertise — from TriBeCa penthouses to Park Slope brownstones — she consistently delivers above-ask results for her sellers and exclusive off-market access for her buyers.",
    location: { city: "New York", state: "NY", country: "United States" },
    specializations: ["Luxury Residential", "Investment Properties", "International Buyers"],
    languages: ["English", "Mandarin", "Cantonese"],
    licenseNumber: "NY-LIC-0047821",
    yearsExperience: 14,
    activeListings: 12,
    totalSales: 187,
    totalVolume: "$310M+",
    rating: 4.9,
    reviewCount: 94,
    certifications: ["Certified Luxury Home Marketing Specialist (CLHMS)", "Accredited Buyer's Representative (ABR)"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
    listingIds: ["apt-001", "apt-002", "apt-006"],
    joinedAt: "2020-03-14",
    reviews: [
      {
        id: "rv-001",
        reviewerName: "Marcus Webb",
        reviewerAvatar: "MW",
        rating: 5,
        comment: "Sophia found us the perfect TriBeCa loft in under three weeks. Her market knowledge is unmatched — she knew every listing before it hit Zillow.",
        date: "2024-11-03",
        propertyType: "Apartment",
      },
      {
        id: "rv-002",
        reviewerName: "Yuki Tanaka",
        reviewerAvatar: "YT",
        rating: 5,
        comment: "As international buyers, we were nervous about the NYC process. Sophia guided us flawlessly from offer to close. We recommend her without reservation.",
        date: "2024-09-17",
        propertyType: "Penthouse",
      },
      {
        id: "rv-003",
        reviewerName: "Claire Fontaine",
        reviewerAvatar: "CF",
        rating: 5,
        comment: "Sold our Upper West Side apartment 18% over asking price. Sophia's staging advice and negotiation strategy were phenomenal.",
        date: "2024-07-22",
        propertyType: "Apartment",
      },
    ],
  },
  {
    id: "agent-002",
    slug: "james-okafor",
    name: "James Okafor",
    email: "james.okafor@realhoms.com",
    phone: "+44 20 7946 0392",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1600&q=80",
    title: "Commercial & Investment Specialist",
    bio: "James brings 11 years of commercial and mixed-use real estate expertise across London, Dubai, and Singapore. A former investment banker, he applies rigorous financial analysis to every deal — ensuring his clients always understand the true yield potential and risk profile of every asset. Fluent in both English and French, he serves corporate clients, family offices, and sovereign wealth funds.",
    location: { city: "London", state: "England", country: "United Kingdom" },
    specializations: ["Commercial Properties", "Buy-to-Let Investments", "Portfolio Acquisitions"],
    languages: ["English", "French", "Yoruba"],
    licenseNumber: "UK-RICS-JO8821",
    yearsExperience: 11,
    activeListings: 8,
    totalSales: 143,
    totalVolume: "£220M+",
    rating: 4.8,
    reviewCount: 71,
    certifications: ["RICS Member (MRICS)", "Certified Commercial Investment Member (CCIM)"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Twitter", url: "#" },
    ],
    listingIds: ["com-001", "com-002"],
    joinedAt: "2021-01-07",
    reviews: [
      {
        id: "rv-004",
        reviewerName: "Oliver Strauss",
        reviewerAvatar: "OS",
        rating: 5,
        comment: "James sourced a below-market retail unit in Canary Wharf with 7.2% yield from day one. His financial analysis saved us months of due diligence.",
        date: "2024-10-15",
        propertyType: "Commercial",
      },
      {
        id: "rv-005",
        reviewerName: "Priya Sharma",
        reviewerAvatar: "PS",
        rating: 5,
        comment: "Exceptional professionalism. James handled our entire buy-to-let portfolio acquisition in South London and negotiated terms that exceeded our targets.",
        date: "2024-08-30",
        propertyType: "Investment Portfolio",
      },
      {
        id: "rv-006",
        reviewerName: "Hassan Al-Rashid",
        reviewerAvatar: "HR",
        rating: 4,
        comment: "Very knowledgeable about international cross-border investments. Would have liked slightly faster communication at times, but results were excellent.",
        date: "2024-06-12",
        propertyType: "Commercial Office",
      },
    ],
  },
  {
    id: "agent-003",
    slug: "amara-patel",
    name: "Amara Patel",
    email: "amara.patel@realhoms.com",
    phone: "+971 50 444 8823",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    title: "Dubai Luxury & Waterfront Specialist",
    bio: "Amara has dominated Dubai's waterfront and ultra-luxury segment for 9 years, representing buyers and sellers on Palm Jumeirah, Downtown, and Dubai Marina. Her track record of closing high-value off-plan deals and her deep developer relationships give her clients an edge in one of the world's fastest-moving markets.",
    location: { city: "Dubai", state: "Dubai", country: "United Arab Emirates" },
    specializations: ["Waterfront Properties", "Off-Plan Investments", "Luxury Villas"],
    languages: ["English", "Hindi", "Arabic"],
    licenseNumber: "RERA-DXB-AP-50912",
    yearsExperience: 9,
    activeListings: 18,
    totalSales: 221,
    totalVolume: "AED 980M+",
    rating: 4.9,
    reviewCount: 118,
    certifications: ["RERA Certified Broker", "Dubai Land Department (DLD) Approved"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
    listingIds: ["apt-003"],
    joinedAt: "2020-06-22",
    reviews: [
      {
        id: "rv-007",
        reviewerName: "Stefan Mueller",
        reviewerAvatar: "SM",
        rating: 5,
        comment: "Amara helped us purchase a Palm Jumeirah signature villa. Her knowledge of the off-plan market and payment plans saved us 12% compared to launch prices.",
        date: "2024-12-01",
        propertyType: "Villa",
      },
      {
        id: "rv-008",
        reviewerName: "Fatima Al-Nouri",
        reviewerAvatar: "FA",
        rating: 5,
        comment: "Best agent in Dubai, no contest. Amara's response time and attention to detail are extraordinary. We felt like her only client.",
        date: "2024-09-05",
        propertyType: "Apartment",
      },
      {
        id: "rv-009",
        reviewerName: "Ravi Krishnamurthy",
        reviewerAvatar: "RK",
        rating: 5,
        comment: "Three investment apartments purchased through Amara. Each one immediately tenanted. Her after-sale support is equally impressive.",
        date: "2024-07-18",
        propertyType: "Apartment",
      },
    ],
  },
  {
    id: "agent-004",
    slug: "lena-hoffmann",
    name: "Lena Hoffmann",
    email: "lena.hoffmann@realhoms.com",
    phone: "+49 30 2093 8811",
    avatar:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
    title: "Residential & Relocation Specialist",
    bio: "Lena specializes in helping expat families and corporate relocations settle seamlessly into Berlin and Munich. She combines thorough neighborhood expertise with patient, stress-free guidance — from viewing to key handover — ensuring that international clients feel at home in the German property market without the language or legal complexity.",
    location: { city: "Berlin", state: "Berlin", country: "Germany" },
    specializations: ["Residential Lettings", "Corporate Relocation", "First-Time Buyers"],
    languages: ["German", "English", "French"],
    licenseNumber: "DE-IHK-LH-2019042",
    yearsExperience: 7,
    activeListings: 9,
    totalSales: 112,
    totalVolume: "€85M+",
    rating: 4.7,
    reviewCount: 55,
    certifications: ["Immobilienmakler (IHK Certified)", "Real Estate Advisor — EU Directive Compliant"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Xing", url: "#" },
    ],
    listingIds: ["com-001"],
    joinedAt: "2021-09-01",
    reviews: [
      {
        id: "rv-010",
        reviewerName: "Aaron Mitchell",
        reviewerAvatar: "AM",
        rating: 5,
        comment: "Lena made our Berlin relocation completely painless. She pre-screened 14 apartments for us and arranged all viewings in one efficient day. Outstanding.",
        date: "2024-11-20",
        propertyType: "Apartment",
      },
      {
        id: "rv-011",
        reviewerName: "Isabel García",
        reviewerAvatar: "IG",
        rating: 4,
        comment: "Very professional and honest about the Berlin rental market. She set realistic expectations and delivered exactly what she promised.",
        date: "2024-08-12",
        propertyType: "Apartment",
      },
      {
        id: "rv-012",
        reviewerName: "Ananya Roy",
        reviewerAvatar: "AR",
        rating: 5,
        comment: "From first call to signing, Lena was responsive and thorough. She translated every document and walked us through the entire German process.",
        date: "2024-06-29",
        propertyType: "House",
      },
    ],
  },
  {
    id: "agent-005",
    slug: "daniel-kowalski",
    name: "Daniel Kowalski",
    email: "daniel.kowalski@realhoms.com",
    phone: "+1 (310) 555-0284",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    title: "Malibu & Coastal California Specialist",
    bio: "Daniel's decade in the LA luxury coastal market — from Malibu's carbon beach to Santa Monica's oceanfront — has made him one of Southern California's most respected agents. A passionate surfer himself, he understands the coastal lifestyle that drives this market and delivers record-breaking sale prices through premium marketing and Hollywood clientele referrals.",
    location: { city: "Los Angeles", state: "CA", country: "United States" },
    specializations: ["Luxury Coastal Homes", "Celebrity & High-Profile Clients", "Beach Houses"],
    languages: ["English", "Polish"],
    licenseNumber: "CA-DRE-01872391",
    yearsExperience: 10,
    activeListings: 7,
    totalSales: 168,
    totalVolume: "$620M+",
    rating: 4.8,
    reviewCount: 82,
    certifications: ["Certified Luxury Home Marketing Specialist (CLHMS)", "Fine & Country Network Partner"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
    listingIds: ["hse-001"],
    joinedAt: "2020-11-15",
    reviews: [
      {
        id: "rv-013",
        reviewerName: "Vanessa Torres",
        reviewerAvatar: "VT",
        rating: 5,
        comment: "Daniel sold our Malibu home for $1.2M over asking. His marketing strategy — drone photography, exclusive preview events, and targeted outreach — was extraordinary.",
        date: "2024-10-08",
        propertyType: "Coastal Home",
      },
      {
        id: "rv-014",
        reviewerName: "Bryce Hammond",
        reviewerAvatar: "BH",
        rating: 5,
        comment: "Working with Daniel was a pleasure from start to finish. He knows every home on Carbon Beach personally and got us an off-market deal we didn't know existed.",
        date: "2024-08-22",
        propertyType: "Beach House",
      },
      {
        id: "rv-015",
        reviewerName: "Mia Nakamura",
        reviewerAvatar: "MN",
        rating: 4,
        comment: "Very knowledgeable and plugged into the market. Sold our Santa Monica condo quickly and handled all the complex negotiations without stress on our part.",
        date: "2024-05-31",
        propertyType: "Condo",
      },
    ],
  },
  {
    id: "agent-006",
    slug: "fatima-al-rashidi",
    name: "Fatima Al-Rashidi",
    email: "fatima.alrashidi@realhoms.com",
    phone: "+65 8122 4490",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1536558519039-be9f2975ba59?auto=format&fit=crop&w=1600&q=80",
    title: "Singapore GCB & Landed Property Expert",
    bio: "Fatima is one of Singapore's most trusted agents for Good Class Bungalows and high-value landed properties. With 12 years serving Singapore's UHNW community and a deep understanding of restricted foreign ownership regulations, she's the first call for sovereign wealth families and tech founders seeking prestigious Sentosa Cove or Nassim Road addresses.",
    location: { city: "Singapore", state: "Central Region", country: "Singapore" },
    specializations: ["Good Class Bungalows", "Sentosa Cove", "Foreign Buyer Regulations"],
    languages: ["English", "Arabic", "Malay"],
    licenseNumber: "CEA-L3010804F-SG",
    yearsExperience: 12,
    activeListings: 5,
    totalSales: 89,
    totalVolume: "SGD $1.2B+",
    rating: 5.0,
    reviewCount: 43,
    certifications: ["CEA Licensed Salesperson (Singapore)", "APREA Member"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
    ],
    listingIds: ["apt-005", "rom-005"],
    joinedAt: "2021-04-10",
    reviews: [
      {
        id: "rv-016",
        reviewerName: "David Lim",
        reviewerAvatar: "DL",
        rating: 5,
        comment: "Fatima is in a class of her own. She secured us a Nassim Road GCB that was never publicly listed. Her discretion and network are unparalleled.",
        date: "2024-11-15",
        propertyType: "GCB",
      },
      {
        id: "rv-017",
        reviewerName: "Nadia Al-Farsi",
        reviewerAvatar: "NF",
        rating: 5,
        comment: "As foreign buyers, navigating Singapore's ABSD regulations was daunting. Fatima structured our purchase perfectly and saved us significant stamp duty.",
        date: "2024-09-28",
        propertyType: "Condo",
      },
      {
        id: "rv-018",
        reviewerName: "Kevin Tan",
        reviewerAvatar: "KT",
        rating: 5,
        comment: "Fastest GCB sale in the district in 2024. Fatima brought the buyer herself within 10 days. Absolutely elite service.",
        date: "2024-07-04",
        propertyType: "GCB",
      },
    ],
  },
  {
    id: "agent-007",
    slug: "marco-rossi",
    name: "Marco Rossi",
    email: "marco.rossi@realhoms.com",
    phone: "+61 2 9374 4821",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80",
    title: "Sydney Harbour & Eastern Suburbs Agent",
    bio: "Marco has spent 8 years mastering Sydney's most competitive submarkets — from Mosman's harbour-front estates to Bondi's beachside apartments. His Italian background and bilingual capability make him the preferred agent for Sydney's growing Italian-Australian community and European expat buyers seeking lifestyle properties in the world's most liveable coastal city.",
    location: { city: "Sydney", state: "NSW", country: "Australia" },
    specializations: ["Harbour Estates", "Beachside Apartments", "Off-the-Plan"],
    languages: ["English", "Italian"],
    licenseNumber: "NSW-CPPREP4-MR2021",
    yearsExperience: 8,
    activeListings: 11,
    totalSales: 204,
    totalVolume: "AUD $310M+",
    rating: 4.7,
    reviewCount: 96,
    certifications: ["Real Estate License (NSW)", "Auctioneer Certification"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
    listingIds: ["hse-004", "rom-002"],
    joinedAt: "2020-08-03",
    reviews: [
      {
        id: "rv-019",
        reviewerName: "Rachel & Tom Burns",
        reviewerAvatar: "RB",
        rating: 5,
        comment: "Marco auctioned our Mosman home and achieved $380k above reserve. His energy at auction is electric and his pre-campaign preparation was thorough.",
        date: "2024-12-03",
        propertyType: "House",
      },
      {
        id: "rv-020",
        reviewerName: "Giulia Romano",
        reviewerAvatar: "GR",
        rating: 5,
        comment: "Perfect agent for Italian buyers in Sydney. Marco understood our culture, our expectations, and our lifestyle requirements. Grazie mille!",
        date: "2024-10-10",
        propertyType: "Apartment",
      },
      {
        id: "rv-021",
        reviewerName: "Nathan Clarke",
        reviewerAvatar: "NC",
        rating: 4,
        comment: "Sold our Bondi apartment in just 11 days. Marco's digital marketing and Instagram campaigns drove enormous engagement.",
        date: "2024-09-01",
        propertyType: "Apartment",
      },
    ],
  },
  {
    id: "agent-008",
    slug: "ashley-brooks",
    name: "Ashley Brooks",
    email: "ashley.brooks@realhoms.com",
    phone: "+1 (416) 555-0391",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80",
    title: "Toronto Family Homes & Suburbs Specialist",
    bio: "Ashley has been helping Toronto families find their forever homes for 6 years. Specializing in the family-friendly neighbourhoods of North York, Scarborough, and the 905 belt, she brings warmth, patience, and sharp negotiation skills to every transaction. Known for her honest, no-pressure approach, Ashley consistently earns five-star referrals from families throughout the GTA.",
    location: { city: "Toronto", state: "ON", country: "Canada" },
    specializations: ["Family Homes", "Suburban Neighbourhoods", "First-Time Buyers"],
    languages: ["English", "French"],
    licenseNumber: "CA-RECO-AB-ON2018041",
    yearsExperience: 6,
    activeListings: 6,
    totalSales: 134,
    totalVolume: "CAD $180M+",
    rating: 4.8,
    reviewCount: 67,
    certifications: ["Salesperson — RECO Ontario", "Certified Negotiation Expert (CNE)"],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Facebook", url: "#" },
    ],
    listingIds: ["hse-002"],
    joinedAt: "2022-02-18",
    reviews: [
      {
        id: "rv-022",
        reviewerName: "Sarah & Raj Kapoor",
        reviewerAvatar: "SK",
        rating: 5,
        comment: "Ashley found us a detached home in North York within budget after three previous agents couldn't. Her knowledge of the GTA market is exceptional.",
        date: "2024-11-28",
        propertyType: "Detached House",
      },
      {
        id: "rv-023",
        reviewerName: "Mike Patterson",
        reviewerAvatar: "MP",
        rating: 5,
        comment: "As a first-time buyer, I was overwhelmed. Ashley walked me through every step patiently and made sure I never felt rushed. Genuinely remarkable service.",
        date: "2024-10-17",
        propertyType: "Townhouse",
      },
      {
        id: "rv-024",
        reviewerName: "Christine Leblanc",
        reviewerAvatar: "CL",
        rating: 4,
        comment: "Great agent, very responsive and knowledgeable about Scarborough neighbourhoods. We would definitely use Ashley again.",
        date: "2024-08-05",
        propertyType: "Semi-detached",
      },
    ],
  },
];

// Convenience exports
export const getFeaturedAgents = () => agentsMock.slice(0, 6);
export const getAgentBySlug = (slug: string) =>
  agentsMock.find((a) => a.slug === slug) ?? null;
export const getAgentById = (id: string) =>
  agentsMock.find((a) => a.id === id) ?? null;
