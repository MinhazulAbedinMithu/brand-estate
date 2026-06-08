// ─────────────────────────────────────────────────────────────────────────────
// propertiesMock.ts
// Master barrel — re-exports all property types & mock data arrays
//
// SCHEMA REFERENCE
// ──────────────────
// Base (all categories):  identity · financials · location · specs · media · platform · SEO
// Apartment discriminator: floorNumber · totalBuildingFloors · monthlyMaintenanceFee
//                          hasElevator · parkingSlotNumber
// House discriminator:    lotSizeAcres · lotSizeSqFt · garageSpacesCount
//                          roofType · foundationType · heatingCoolingSystem · backyardAreaSqFt
// RoomShare discriminator: roomType · bathroomType · currentOccupantsCount
//                          preferredGender · utilitiesIncluded · minimumLeasePeriodMonths
// Commercial discriminator: zoningCode · loadingDocksCount · ceilingHeightFt
//                           minimumLeaseTermYears · electricalCapacity
// ─────────────────────────────────────────────────────────────────────────────

// ── Type Re-exports ───────────────────────────────────────────────────────────
export type {
  // Primitives
  TransactionType,
  PropertyCategory,
  PropertyStatus,
  Currency,
  GeoPoint,
  RoomType,
  BathroomType,
  GenderPreference,
  UtilityType,
  RoofType,
  FoundationType,
  CommercialZoningCode,
  // Financial history
  TaxHistoryEntry,
  PriceHistoryEntry,
  // Sub-interfaces
  PropertySEO,
  ListerProfile,
  // Discriminator attribute blocks
  ApartmentAttributes,
  HouseAttributes,
  RoomShareAttributes,
  CommercialAttributes,
  // Property entities
  BaseProperty,
  ApartmentProperty,
  HouseProperty,
  RoomShareProperty,
  CommercialProperty,
  // Master union
  MockProperty,
} from "./propertyTypes";

// ── Data Re-exports ───────────────────────────────────────────────────────────
export { apartmentsMock } from "./apartmentsMock";
export { housesMock } from "./housesMock";
export { roomSharesMock } from "./roomSharesMock";
export { commercialMock } from "./commercialMock";

// ── Aggregated Collection ─────────────────────────────────────────────────────
import { apartmentsMock } from "./apartmentsMock";
import { housesMock } from "./housesMock";
import { roomSharesMock } from "./roomSharesMock";
import { commercialMock } from "./commercialMock";
import type { MockProperty } from "./propertyTypes";

/**
 * All mock property listings combined into a single typed array.
 * Suitable for full-catalog displays, global search indexing, and map views.
 *
 * Breakdown:
 *  - Apartments:   6 entries  (buy + rent, NYC · Tokyo · Dubai · London · Singapore · Paris)
 *  - Houses:       5 entries  (buy + rent, Malibu · Toronto · Hamptons · Melbourne · Austin)
 *  - Room Shares:  5 entries  (roommate_share, London · Sydney · NYC · Berlin · Singapore)
 *  - Commercial:   5 entries  (buy + rent, Berlin · Chicago · LA · Houston · NYC SoHo)
 *                  ─────────────────────────────────────────────────────────────
 *  Total:         21 listings
 */
export const mockProperties: MockProperty[] = [
  ...apartmentsMock,
  ...housesMock,
  ...roomSharesMock,
  ...commercialMock,
];

// ── Convenience Filters ───────────────────────────────────────────────────────

/** All buy-transaction listings across all categories */
export const mockPropertiesForSale = mockProperties.filter(
  (p) => p.transactionType === "buy"
);

/** All rental listings (rent + roommate_share) */
export const mockPropertiesForRent = mockProperties.filter(
  (p) => p.transactionType === "rent" || p.transactionType === "roommate_share"
);

/** Featured listings only */
export const mockFeaturedProperties = mockProperties.filter(
  (p) => p.isFeatured
);

/** Active listings only (status === "active") */
export const mockActiveProperties = mockProperties.filter(
  (p) => p.status === "active"
);
