// ─────────────────────────────────────────────
// User & Auth
// ─────────────────────────────────────────────

export type UserRole = 'guest' | 'auth_user' | 'agent' | 'owner' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'pending' | 'suspended' | 'unsubmitted';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  savedProperties?: string[];
  createdAt: string;
  status: UserStatus;
  suspendedReason?: string;
  isVerified?: boolean;
  legalDocs?: {
    licenseNumber: string;
    agencyName: string;
    documentUrl: string;
    submittedAt: string;
  };
  nidStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  nidCardNumber?: string;
  nidDocumentUrl?: string;
  nidSubmittedAt?: string;
  nidRejectionReason?: string;

  // Rejection limit tracking counters
  kycRejectionsCount?: number;
  backgroundRejectionsCount?: number;
  creditRejectionsCount?: number;
  
  // KYC 3-photo fields
  kycStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  kycDocType?: 'nid' | 'passport' | 'driving_license';
  kycDocNumber?: string;
  kycFrontUrl?: string;
  kycBackUrl?: string;
  kycSelfieUrl?: string;
  kycSubmittedAt?: string;
  kycRejectionReason?: string;

  // Phone verification
  phoneVerified?: boolean;
  phoneVerificationCode?: string;

  // Background and credit reports
  backgroundReportStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  backgroundReportUrl?: string;
  backgroundReportSubmittedAt?: string;
  creditReportStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  creditReportUrl?: string;
  creditScore?: number;
  creditReportSubmittedAt?: string;

  // Address
  addressLine?: string;
  addressCity?: string;
  addressCountry?: string;

  // Wallet
  walletBalance?: number;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  maxListings: number;
  features: string[];
  isActive: boolean;
}

// ─────────────────────────────────────────────
// Property
// ─────────────────────────────────────────────

export type ListingType = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
export type ListingStatus = 'active' | 'pending' | 'archived' | 'rejected' | 'pending_approval' | 'draft' | 'sold' | 'rented';

export interface PropertyLocation {
  city: string;
  area: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface PropertySEO {
  seoTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  keywords?: string[];
}

export interface OutdoorFacility {
  facilityType: 'hospital' | 'school' | 'supermarket' | 'bank_atm' | 'bus_stop' | 'gym';
  distance: string;
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
  seo?: PropertySEO;

  // Application Fee, Deposit, Pets Policies
  applicationFeeRequired?: boolean;
  applicationFee?: number;
  depositRequired?: boolean;
  depositAmount?: number;
  petsAllowed?: boolean;
  petAllowanceCharge?: number;
  outdoorFacilities?: OutdoorFacility[];
}

export interface PropertyApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  userId: string;
  userName: string;
  agentOwnerId: string;
  applicationFeePaid: number;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  submittedAt: string;
  processedAt?: string;
  feedback?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  stripeRefundId?: string;
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
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
  draftListings: number;
  archivedListings: number;
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
  stats: {
    totalUsers: number;
    activeListings: number;
    pendingApprovals: number;
    totalInquiries: number;
    dailyInquiries: number;
  };
  signupsHistory?: Array<{ month: string; Users: number; Agents: number }>;
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

// ─────────────────────────────────────────────
// Blog & SEO
// ─────────────────────────────────────────────

export interface BlogAuthor {
  name: string;
  avatar: string; // URL
  role: string;   // e.g. "Senior Market Analyst", "Head of Content"
  bio?: string;
}

export interface BlogSEO {
  title: string;           // Custom SEO title tag
  metaDescription: string; // Meta description optimized for search engine CTR
  keywords: string[];      // Relevant target keywords
  ogImage: string;         // Open Graph image URL
  ogType?: 'article' | 'website'; // Defaults to 'article'
  canonicalUrl?: string;   // Canonical URL redirect
  ogTitle?: string;        // Open Graph Title
  ogDescription?: string;  // Open Graph Description
  noIndex?: boolean;       // Index or NoIndex robots flag
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;         // Rich Markdown formatting
  excerpt: string;         // Short excerpt (150-160 characters)
  coverImage: string;      // Featured image URL
  category: 'market-trends' | 'buying-guide' | 'selling-guide' | 'investment' | 'lifestyle';
  tags: string[];          // List of tag topics
  author: BlogAuthor;
  publishedAt: string;     // ISO Date
  updatedAt?: string;      // ISO Date
  readTimeMinutes: number;
  isFeatured: boolean;
  seo: BlogSEO;
  status?: 'draft' | 'pending' | 'published' | 'rejected';
  authorId?: string;
  authorRole?: UserRole;
  rejectionReason?: string;
  reactions?: Record<string, number>;
  views?: number;
}


