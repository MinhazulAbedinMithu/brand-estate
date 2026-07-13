import type { ListingType, ListingStatus, PropertyType, UserRole, NavLinkWithDropdown, CountryCodeItem } from './types';

// ─────────────────────────────────────────────
// User Roles
// ─────────────────────────────────────────────

export const USER_ROLES: UserRole[] = [
  'guest',
  'auth_user',
  'agent',
  'owner',
  'admin',
  'super_admin',
];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  guest: 'Guest',
  auth_user: 'User',
  agent: 'Agent',
  owner: 'Owner',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

// ─────────────────────────────────────────────
// Property
// ─────────────────────────────────────────────

export const LISTING_TYPES: ListingType[] = ['sale', 'rent'];

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  sale: 'For Sale',
  rent: 'For Rent',
};

export const PROPERTY_TYPES: PropertyType[] = [
  'apartment',
  'house',
  'villa',
  'commercial',
  'land',
];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Apartment',
  house: 'House',
  villa: 'Villa',
  commercial: 'Commercial',
  land: 'Land',
};

export const LISTING_STATUSES: ListingStatus[] = [
  'active',
  'pending',
  'archived',
  'rejected',
  'pending_approval',
  'draft',
  'sold',
  'rented',
];

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  active: 'Active',
  pending: 'Pending Review',
  archived: 'Archived',
  rejected: 'Rejected',
  pending_approval: 'Pending Approval',
  draft: 'Draft',
  sold: 'Sold',
  rented: 'Rented',
};

// ─────────────────────────────────────────────
// Filters / Search Options
// ─────────────────────────────────────────────

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5] as const;

export const PRICE_RANGES_SALE = [
  { label: 'Under $100k', min: 0, max: 100_000 },
  { label: '$100k – $250k', min: 100_000, max: 250_000 },
  { label: '$250k – $500k', min: 250_000, max: 500_000 },
  { label: '$500k – $1M', min: 500_000, max: 1_000_000 },
  { label: 'Over $1M', min: 1_000_000, max: Infinity },
] as const;

export const PRICE_RANGES_RENT = [
  { label: 'Under $500/mo', min: 0, max: 500 },
  { label: '$500 – $1,000/mo', min: 500, max: 1_000 },
  { label: '$1,000 – $2,000/mo', min: 1_000, max: 2_000 },
  { label: '$2,000 – $5,000/mo', min: 2_000, max: 5_000 },
  { label: 'Over $5,000/mo', min: 5_000, max: Infinity },
] as const;

// ─────────────────────────────────────────────
// Amenities
// ─────────────────────────────────────────────

export const AMENITIES = [
  'Swimming Pool',
  'Gym / Fitness Center',
  'Parking',
  'Garden / Yard',
  'Balcony',
  'Elevator',
  'Security System',
  'Air Conditioning',
  'Central Heating',
  'Furnished',
  'Pet Friendly',
  'Wheelchair Accessible',
  'Rooftop Terrace',
  'Concierge',
  'Storage Room',
] as const;

// ─────────────────────────────────────────────
// App Config
// ─────────────────────────────────────────────

export const APP_NAME = 'RealHoms';
export const APP_TAGLINE = 'Find Your Perfect Property';
export const ITEMS_PER_PAGE = 12;
export const FEATURED_LISTINGS_COUNT = 6;
export const MAX_PROPERTY_IMAGES = 10;

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────

export const PUBLIC_NAV_LINKS: NavLinkWithDropdown[] = [
  {
    label: 'Buy',
    type: 'dropdown',
    href: '/properties?type=sale',
    columns: [
      {
        title: 'Property Types',
        items: [
          { label: 'Villas for Sale', href: '/properties?type=sale&propertyType=villa', description: 'Find luxury estate villas' },
          { label: 'Apartments for Sale', href: '/properties?type=sale&propertyType=apartment', description: 'Cozy and premium apartments' },
          { label: 'Houses for Sale', href: '/properties?type=sale&propertyType=house', description: 'Beautiful single family homes' },
          { label: 'Penthouse Homes', href: '/properties?type=sale&tag=penthouse', description: 'Exclusive top-floor living' },
          { label: 'Commercial Sales', href: '/properties?type=sale&propertyType=commercial', description: 'Offices and retail buildings' },
        ]
      },
      {
        title: 'Explore Budgets',
        items: [
          { label: 'Under $250k', href: '/properties?type=sale&maxPrice=250000', description: 'Affordable entry properties' },
          { label: '$250k – $500k', href: '/properties?type=sale&minPrice=250000&maxPrice=500000', description: 'Mid-range family houses' },
          { label: '$500k – $1M', href: '/properties?type=sale&minPrice=500000&maxPrice=1000000', description: 'Premium residential properties' },
          { label: 'Luxury (Over $1M)', href: '/properties?type=sale&minPrice=1000000', description: 'Elite real estate and estates' },
        ]
      },
      {
        title: 'Featured Locations',
        items: [
          { label: 'United States', href: '/properties?type=sale&country=United%20States' },
          { label: 'United Kingdom', href: '/properties?type=sale&country=United%20Kingdom' },
          { label: 'Canada', href: '/properties?type=sale&country=Canada' },
          { label: 'Australia', href: '/properties?type=sale&country=Australia' },
          { label: 'Germany', href: '/properties?type=sale&country=Germany' },
        ]
      }
    ],
    promo: {
      title: 'Home Finder Assistant',
      description: 'Calculate your monthly mortgage and explore houses within your budget.',
      ctaText: 'Explore Mortgages',
      ctaHref: '/calculator',
      tag: 'NEW SERVICE',
    }
  },
  {
    label: 'Rent',
    type: 'dropdown',
    href: '/properties?type=rent',
    columns: [
      {
        title: 'Property Types',
        items: [
          { label: 'Apartments for Rent', href: '/properties?type=rent&propertyType=apartment', description: 'Modern downtown apartments' },
          { label: 'Houses for Rent', href: '/properties?type=rent&propertyType=house', description: 'Spacious suburban rentals' },
          { label: 'Villas for Rent', href: '/properties?type=rent&propertyType=villa', description: 'Prestigious seasonal rental homes' },
          { label: 'Commercial Rentals', href: '/properties?type=rent&propertyType=commercial', description: 'Retail shops and office spaces' },
          { label: 'Short-term Leases', href: '/properties?type=rent&tag=short-term', description: 'Flexible and transient options' },
        ]
      },
      {
        title: 'Monthly Budgets',
        items: [
          { label: 'Under $1,500/mo', href: '/properties?type=rent&maxPrice=1500', description: 'Budget friendly options' },
          { label: '$1,500 – $3,000/mo', href: '/properties?type=rent&minPrice=1500&maxPrice=3000', description: 'Standard residential rates' },
          { label: '$3,000 – $5,000/mo', href: '/properties?type=rent&minPrice=3000&maxPrice=5000', description: 'Premium spaces' },
          { label: 'Luxury (Over $5,000)', href: '/properties?type=rent&minPrice=5000', description: 'Elite residential rentals' },
        ]
      },
      {
        title: 'Popular Cities',
        items: [
          { label: 'New York, USA', href: '/properties?type=rent&city=New%20York' },
          { label: 'London, UK', href: '/properties?type=rent&city=London' },
          { label: 'Tokyo, JP', href: '/properties?type=rent&city=Tokyo' },
          { label: 'Sydney, AU', href: '/properties?type=rent&city=Sydney' },
        ]
      }
    ],
    promo: {
      title: 'Instant Pre-Approval',
      description: 'Get verified by top landlords immediately. Complete your digital rental profile.',
      ctaText: 'Prequalify Now',
      ctaHref: '/dashboard/profile',
      tag: 'FAST TRACK',
    }
  },
  {
    label: 'Sell',
    type: 'dropdown',
    href: '/sell',
    columns: [
      {
        title: 'Services',
        items: [
          { label: 'Home Valuation', href: '/sell/valuation', description: 'Get an instant property estimate' },
          { label: 'Professional Photography', href: '/sell/photography', description: 'Premium drone and interior photography' },
          { label: 'Virtual Home Staging', href: '/sell/virtual-staging', description: 'Render fully furnished layouts' },
          { label: 'SaaS Marketing Hub', href: '/sell/marketing', description: 'Automate social and listing ads' },
        ]
      },
      {
        title: 'Seller Resources',
        items: [
          { label: 'Seller Success Guide', href: '/blogs/seller-guide' },
          { label: 'Global Market Reports', href: '/blogs/market-reports' },
          { label: 'Cost of Selling Guide', href: '/blogs/selling-costs' },
          { label: 'Seller FAQs', href: '/blogs/seller-faq' },
        ]
      },
      {
        title: 'Options',
        items: [
          { label: 'Match with a Top Agent', href: '/agents', description: 'Work with local area listing agents' },
          { label: 'List as FSBO', href: '/agent/listings/new', description: 'Self-publish directly onto our index' },
          { label: 'Success Stories', href: '/about#stories', description: 'See homes recently sold by owners' },
        ]
      }
    ],
    promo: {
      title: 'What is your home worth?',
      description: 'Enter your address to receive a comprehensive, real-time market comparative valuation.',
      ctaText: 'Free Valuation',
      ctaHref: '/sell/valuation',
      tag: 'ESTIMATOR',
    }
  },
  {
    label: 'Find Agent',
    type: 'link',
    href: '/agents',
  },
  {
    label: 'Others',
    type: 'dropdown',
    items: [
      { label: 'About us', href: '/about', description: 'Our history, team and values' },
      { label: 'News & Insights', href: '/blogs', description: 'Latest articles and market updates' },
      { label: 'Contact', href: '/contact', description: 'Reach out to our offices' },
    ]
  },
];

export const USER_DASHBOARD_NAV = [
  { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Saved Properties', href: '/dashboard/saved', icon: 'Heart' },
  { label: 'My Inquiries', href: '/dashboard/inquiries', icon: 'MessageSquare' },
  { label: 'Profile Settings', href: '/dashboard/profile', icon: 'Settings' },
] as const;

export const AGENT_NAV_LINKS = [
  { label: 'Dashboard', href: '/agent/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Listings', href: '/agent/listings', icon: 'Building2' },
  { label: 'Leads', href: '/agent/leads', icon: 'Users' },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Users', href: '/admin/users', icon: 'Users' },
  { label: 'Listings', href: '/admin/listings', icon: 'Building2' },
  { label: 'Reports', href: '/admin/reports', icon: 'Flag' },
] as const;

export const SUPER_ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/super-admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Role Management', href: '/super-admin/roles', icon: 'ShieldCheck' },
  { label: 'Platform Settings', href: '/super-admin/settings', icon: 'Settings2' },
] as const;

export const COUNTRIES = [
  "Australia",
  "Bangladesh",
  "Brazil",
  "Canada",
  "France",
  "Germany",
  "India",
  "Italy",
  "Japan",
  "Singapore",
  "South Africa",
  "Spain",
  "Turkey",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
] as const;

export const COUNTRY_CITIES: Record<string, string[]> = {
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Gold Coast", "Hobart"],
  Bangladesh: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Cox's Bazar"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Quebec City", "Winnipeg"],
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Bordeaux"],
  Germany: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart", "Düsseldorf", "Dresden"],
  India: ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Surat"],
  Italy: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Venice"],
  Japan: ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto", "Shibuya"],
  Singapore: ["Singapore Area", "Central Region", "East Region", "North Region", "Northeast Region", "West Region"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"],
  Spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma de Mallorca"],
  Turkey: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain", "Ras Al Khaimah", "Fujairah"],
  "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Leeds", "Edinburgh", "Belfast"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Francisco", "Miami", "Seattle", "Boston", "Malibu", "East Hampton", "Austin"]
};

export const DEFAULT_PACKAGES = [
  {
    id: "pkg-bronze",
    name: "Bronze Starter",
    price: 29,
    maxListings: 3,
    features: ["Up to 3 active listings", "Standard email support", "Basic analytics"],
    isActive: true,
  },
  {
    id: "pkg-silver",
    name: "Silver Professional",
    price: 79,
    maxListings: 10,
    features: ["Up to 10 active listings", "Priority email & chat support", "Advanced analytics & performance charts", "Featured tag for 2 listings"],
    isActive: true,
  },
  {
    id: "pkg-gold",
    name: "Gold Enterprise",
    price: 199,
    maxListings: 50,
    features: ["Up to 50 active listings", "Dedicated account manager", "24/7 phone support", "Featured tag for 10 listings", "Virtual tours & video uploads support"],
    isActive: true,
  },
];

export const COUNTRY_CODES: readonly CountryCodeItem[] = [
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", dialCode: "+971" },
  { name: "Bangladesh", code: "BD", flag: "🇧🇩", dialCode: "+880" },
  { name: "Australia", code: "AU", flag: "🇦🇺", dialCode: "+61" },
  { name: "Brazil", code: "BR", flag: "🇧🇷", dialCode: "+55" },
  { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1" },
  { name: "France", code: "FR", flag: "🇫🇷", dialCode: "+33" },
  { name: "Germany", code: "DE", flag: "🇩🇪", dialCode: "+49" },
  { name: "India", code: "IN", flag: "🇮🇳", dialCode: "+91" },
  { name: "Italy", code: "IT", flag: "🇮🇹", dialCode: "+39" },
  { name: "Japan", code: "JP", flag: "🇯🇵", dialCode: "+81" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", dialCode: "+65" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", dialCode: "+27" },
  { name: "Spain", code: "ES", flag: "🇪🇸", dialCode: "+34" },
  { name: "Turkey", code: "TR", flag: "🇹🇷", dialCode: "+90" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44" },
  { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1" },
] as const;


