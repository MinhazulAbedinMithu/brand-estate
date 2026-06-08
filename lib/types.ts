// ─────────────────────────────────────────────
// User & Auth
// ─────────────────────────────────────────────

export type UserRole = 'guest' | 'auth_user' | 'agent' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  savedProperties?: string[];
  createdAt: string;
}

// ─────────────────────────────────────────────
// Property
// ─────────────────────────────────────────────

export type ListingType = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
export type ListingStatus = 'active' | 'pending' | 'archived' | 'rejected';

export interface PropertyLocation {
  city: string;
  area: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  location: PropertyLocation;
  bedrooms: number;
  bathrooms: number;
  area: number; // sq ft
  images: string[];
  agentId: string;
  status: ListingStatus;
  featured: boolean;
  amenities?: string[];
  yearBuilt?: number;
  parkingSpaces?: number;
  createdAt: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// Agent
// ─────────────────────────────────────────────

export interface Agent {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  specializations?: PropertyType[];
  licenseNumber?: string;
  activeListings: number;
  totalSales: number;
  rating: number;
  reviewCount: number;
  joinedAt: string;
}

// ─────────────────────────────────────────────
// Inquiry / Lead
// ─────────────────────────────────────────────

export type InquiryStatus = 'new' | 'read' | 'replied' | 'closed';

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  propertyImage?: string;
  userId?: string; // undefined for guest inquiries
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  agentId: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Filters / Search
// ─────────────────────────────────────────────

export interface PropertyFilters {
  listingType?: ListingType;
  propertyType?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  featured?: boolean;
}

// ─────────────────────────────────────────────
// API / Response shapes (backend phase)
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// Dashboard / Analytics
// ─────────────────────────────────────────────

export interface StatCard {
  label: string;
  value: string | number;
  change?: number; // percentage change
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}

export interface AgentStats {
  totalListings: number;
  activeListings: number;
  totalInquiries: number;
  newInquiries: number;
  totalViews: number;
  totalSaves: number;
}

export interface AdminStats {
  totalUsers: number;
  totalAgents: number;
  totalListings: number;
  pendingListings: number;
  totalInquiries: number;
  newUsersThisMonth: number;
}

// ─────────────────────────────────────────────
// Navigation Menu / Dropdowns
// ─────────────────────────────────────────────

export interface NavMegaMenuItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavMegaMenuColumn {
  title: string;
  items: NavMegaMenuItem[];
}

export interface NavMegaMenuPromo {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  tag?: string;
  image?: string;
}

export interface NavLinkWithDropdown {
  label: string;
  href?: string;
  type: 'link' | 'dropdown';
  columns?: NavMegaMenuColumn[];
  promo?: NavMegaMenuPromo;
  items?: NavMegaMenuItem[];
}

