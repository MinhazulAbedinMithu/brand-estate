// ─────────────────────────────────────────────────────────────────────────────
// lib/property-filters.ts
// Pure filter + sort utility over MockProperty[].
// No side effects. Easy to swap for a real API call in Phase 2.
// ─────────────────────────────────────────────────────────────────────────────

import type { MockProperty } from "@/src/mocks/propertyTypes";
import type { PropertySearchParams } from "./property-search-params";

const ITEMS_PER_PAGE = 12;

// ─── Text search scoring ──────────────────────────────────────────────────────

function matchesQuery(p: MockProperty, q: string): boolean {
  if (!q) return true;
  const haystack = [
    p.title,
    p.city,
    p.state,
    p.zipCode,
    p.formattedAddress,
    p.neighborhoodNotes,
    p.description,
  ]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

// ─── Main filter function ─────────────────────────────────────────────────────

export function filterProperties(
  properties: MockProperty[],
  params: PropertySearchParams
): MockProperty[] {
  let results = properties;

  // Text query
  if (params.q) {
    results = results.filter((p) => matchesQuery(p, params.q!));
  }

  // Transaction type
  if (params.type) {
    results = results.filter((p) => p.transactionType === params.type);
  }

  // Category
  if (params.category) {
    results = results.filter((p) => p.propertyCategory === params.category);
  }

  // Price range
  if (params.minPrice !== undefined) {
    results = results.filter((p) => p.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= params.maxPrice!);
  }

  // Bedrooms
  if (params.minBed !== undefined) {
    results = results.filter((p) => p.bedrooms >= params.minBed!);
  }

  // Bathrooms
  if (params.minBath !== undefined) {
    results = results.filter((p) => p.bathrooms >= params.minBath!);
  }

  // Square feet
  if (params.minSqFt !== undefined) {
    results = results.filter((p) => p.squareFeet >= params.minSqFt!);
  }
  if (params.maxSqFt !== undefined) {
    results = results.filter((p) => p.squareFeet <= params.maxSqFt!);
  }

  // Featured only
  if (params.featured) {
    results = results.filter((p) => p.isFeatured);
  }

  // Status
  if (params.status) {
    results = results.filter((p) => p.status === params.status);
  }

  return results;
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

export function sortProperties(
  properties: MockProperty[],
  sort?: PropertySearchParams["sort"]
): MockProperty[] {
  const arr = [...properties];

  switch (sort) {
    case "price_asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price_desc":
      return arr.sort((a, b) => b.price - a.price);
    case "sqft_asc":
      return arr.sort((a, b) => a.squareFeet - b.squareFeet);
    case "sqft_desc":
      return arr.sort((a, b) => b.squareFeet - a.squareFeet);
    case "newest":
      return arr.sort((a, b) => b.yearBuilt - a.yearBuilt);
    case "oldest":
      return arr.sort((a, b) => a.yearBuilt - b.yearBuilt);
    default:
      // Default: featured first, then by price desc
      return arr.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.price - a.price;
      });
  }
}

// ─── Paginate ─────────────────────────────────────────────────────────────────

export interface PaginatedProperties {
  items: MockProperty[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

export function paginateProperties(
  properties: MockProperty[],
  page: number = 1,
  pageSize: number = ITEMS_PER_PAGE
): PaginatedProperties {
  const total = properties.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = properties.slice(start, start + pageSize);

  return { items, total, page: safePage, totalPages, pageSize };
}

// ─── One-shot helper used by the RSC page ────────────────────────────────────

export function searchProperties(
  properties: MockProperty[],
  params: PropertySearchParams
): PaginatedProperties {
  const filtered = filterProperties(properties, params);
  const sorted = sortProperties(filtered, params.sort);
  return paginateProperties(sorted, params.page ?? 1);
}

// ─── Related listings (same category, excludes current) ──────────────────────

export function getRelatedListings(
  properties: MockProperty[],
  currentId: string,
  category: MockProperty["propertyCategory"],
  limit = 4
): MockProperty[] {
  return properties
    .filter((p) => p.id !== currentId && p.propertyCategory === category && p.status === "active")
    .slice(0, limit);
}
