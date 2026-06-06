import type { ListingType, ListingStatus, PropertyType, UserRole } from './types';

// ─────────────────────────────────────────────
// User Roles
// ─────────────────────────────────────────────

export const USER_ROLES: UserRole[] = [
  'guest',
  'auth_user',
  'agent',
  'admin',
  'super_admin',
];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  guest: 'Guest',
  auth_user: 'User',
  agent: 'Agent',
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
];

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  active: 'Active',
  pending: 'Pending Review',
  archived: 'Archived',
  rejected: 'Rejected',
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

export const APP_NAME = 'Brand Estate';
export const APP_TAGLINE = 'Find Your Perfect Property';
export const ITEMS_PER_PAGE = 12;
export const FEATURED_LISTINGS_COUNT = 6;
export const MAX_PROPERTY_IMAGES = 10;

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────

export const PUBLIC_NAV_LINKS = [
  { label: 'Properties', href: '/properties' },
  { label: 'Agents', href: '/agents' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

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

