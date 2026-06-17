// ─────────────────────────────────────────────────────────────────────────────
// propertyTypes.ts
// Master Type Definitions & Interfaces — Brand Estate Mock Schema
// ─────────────────────────────────────────────────────────────────────────────

// ─── Primitive Helpers ───────────────────────────────────────────────────────

export type TransactionType = "buy" | "rent" | "roommate_share";

export type PropertyCategory = "apartment" | "house" | "room_share" | "commercial";

export type PropertyStatus =
  | "draft"
  | "pending_approval"
  | "active"
  | "sold"
  | "rented";

export type Currency = "USD" | "GBP" | "EUR" | "JPY" | "AUD" | "CAD" | "AED" | "SGD";

// ─── Meilisearch Geo ─────────────────────────────────────────────────────────

/**
 * Meilisearch _geo field format for proximity-based geo search.
 * @see https://www.meilisearch.com/docs/learn/filtering_and_sorting/geosearch
 */
export interface GeoPoint {
  lat: number;
  lng: number;
}

// ─── Financial History ───────────────────────────────────────────────────────

/** Inspired by Redfin's tax history table */
export interface TaxHistoryEntry {
  year: number;
  taxValue: number; // In listed currency
  currency: Currency;
}

/** Inspired by Realtor.com's price history timeline */
export interface PriceHistoryEntry {
  date: string; // ISO 8601 date string: "2023-04-15"
  price: number;
  currency: Currency;
  event: "listed" | "price_drop" | "price_increase" | "sold" | "rented" | "relisted" | "expired";
}

// ─── Dynamic SEO ─────────────────────────────────────────────────────────────

export interface PropertySEO {
  seoTitle: string;
  metaDescription: string;
  ogImageUrl: string; // AWS S3 public key or full URL
  keywords?: string[];
}

// ─── Lister / Agent Profile ──────────────────────────────────────────────────

export interface ListerProfile {
  name: string;
  avatar: string; // URL
  phone: string;
  email: string;
  agencyName: string;
  licenseNumber?: string;
  agentSlug?: string; // Links to /agents/[slug] public profile
}

// ─── Class-Specific Attribute Blocks ─────────────────────────────────────────

export interface ApartmentAttributes {
  floorNumber: number;
  totalBuildingFloors: number;
  monthlyMaintenanceFee: number; // In listed currency
  hasElevator: boolean;
  parkingSlotNumber: string | null; // e.g. "B2-045", null if none
}

export type RoofType =
  | "asphalt_shingle"
  | "metal"
  | "clay_tile"
  | "flat"
  | "slate"
  | "wood_shake";

export type FoundationType =
  | "concrete_slab"
  | "crawl_space"
  | "full_basement"
  | "pier_and_beam"
  | "stem_wall";

/** Inspired by Realtor.com's structural detail breakdown */
export interface HouseAttributes {
  lotSizeAcres: number;
  lotSizeSqFt: number;
  garageSpacesCount: number;
  roofType: RoofType;
  foundationType: FoundationType;
  heatingCoolingSystem: string; // e.g. "Ducted Split System — Carrier 18 SEER"
  backyardAreaSqFt: number;
}

export type RoomType = "private" | "shared";
export type BathroomType = "attached" | "common";
export type GenderPreference = "any" | "male" | "female";
export type UtilityType = "wifi" | "gas" | "water" | "electricity" | "cable" | "trash";

export interface RoomShareAttributes {
  roomType: RoomType;
  bathroomType: BathroomType;
  currentOccupantsCount: number;
  preferredGender: GenderPreference;
  utilitiesIncluded: UtilityType[];
  minimumLeasePeriodMonths: number;
}

export type CommercialZoningCode = "retail" | "office" | "industrial" | "warehouse";

export interface CommercialAttributes {
  zoningCode: CommercialZoningCode;
  loadingDocksCount: number;
  ceilingHeightFt: number;
  minimumLeaseTermYears: number;
  electricalCapacity: string; // e.g. "400A / 3-Phase 480V"
}

// ─── Base Property ────────────────────────────────────────────────────────────

export interface BaseProperty {
  // Identity
  id: string;
  title: string;
  slug: string;
  description: string;
  transactionType: TransactionType;
  propertyCategory: PropertyCategory;

  // Financials
  price: number;
  currency: Currency;
  taxHistory: TaxHistoryEntry[];
  priceHistory: PriceHistoryEntry[];

  // Location Metrics
  formattedAddress: string;
  city: string;
  state: string;
  zipCode: string;
  _geo: GeoPoint; // Meilisearch _geo format
  neighborhoodNotes: string;

  // Core Specs
  squareFeet: number;
  squareMeters: number; // Auto-derivable: sqft × 0.0929, stored for convenience
  totalRooms: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;

  // Media Assets
  images: string[]; // AWS S3 public keys or CDN URLs
  videoTourUrl: string | null; // YouTube / Vimeo embed link
  virtualTourUrl: string | null; // Matterport 3D embed URL (inspired by Redfin)

  // Platform Control
  status: PropertyStatus;
  isFeatured: boolean;
  ownerId: string; // References User.id

  // Lister
  listerProfile: ListerProfile;

  // Dynamic SEO
  seo: PropertySEO;

  // Amenities
  amenities?: string[];
}

// ─── Discriminated Union Members ──────────────────────────────────────────────

export interface ApartmentProperty extends BaseProperty {
  propertyCategory: "apartment";
  apartment: ApartmentAttributes;
}

export interface HouseProperty extends BaseProperty {
  propertyCategory: "house";
  house: HouseAttributes;
}

export interface RoomShareProperty extends BaseProperty {
  propertyCategory: "room_share";
  transactionType: "roommate_share";
  roomShare: RoomShareAttributes;
}

export interface CommercialProperty extends BaseProperty {
  propertyCategory: "commercial";
  commercial: CommercialAttributes;
}

// ─── Master Union Type ────────────────────────────────────────────────────────

export type MockProperty =
  | ApartmentProperty
  | HouseProperty
  | RoomShareProperty
  | CommercialProperty;
