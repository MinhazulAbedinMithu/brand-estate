// ─────────────────────────────────────────────────────────────────────────────
// lib/property-search-params.ts
// URL query-parameter schema for /properties search page.
// All filter state lives in the URL — this file owns the shape.
// ─────────────────────────────────────────────────────────────────────────────

import type { PropertyCategory, TransactionType, PropertyStatus } from "@/src/mocks/propertyTypes";

// ─── Typed param shape ────────────────────────────────────────────────────────

export type SortOption =
  | "price_asc"
  | "price_desc"
  | "newest"
  | "oldest"
  | "sqft_asc"
  | "sqft_desc";

export type ViewMode = "grid" | "list";

export interface PropertySearchParams {
  q?: string;                      // Free-text search
  type?: TransactionType;          // buy | rent | roommate_share
  category?: PropertyCategory;     // apartment | house | room_share | commercial
  minPrice?: number;
  maxPrice?: number;
  minBed?: number;
  minBath?: number;
  minSqFt?: number;
  maxSqFt?: number;
  featured?: boolean;
  status?: PropertyStatus;
  sort?: SortOption;
  view?: ViewMode;
  page?: number;
}

// Raw Next.js searchParams (all values are string | string[] | undefined)
export type RawSearchParams = Record<string, string | string[] | undefined>;

// ─── Parser — converts raw URL strings → typed params ────────────────────────

function firstString(val: string | string[] | undefined): string | undefined {
  if (!val) return undefined;
  return Array.isArray(val) ? val[0] : val;
}

function parseNum(val: string | undefined): number | undefined {
  if (!val) return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
}

function parseBool(val: string | undefined): boolean | undefined {
  if (val === "true") return true;
  if (val === "false") return false;
  return undefined;
}

const VALID_TRANSACTION_TYPES = new Set<TransactionType>(["buy", "rent", "roommate_share"]);
const VALID_CATEGORIES = new Set<PropertyCategory>(["apartment", "house", "room_share", "commercial"]);
const VALID_STATUSES = new Set<PropertyStatus>(["draft", "pending_approval", "active", "sold", "rented"]);
const VALID_SORTS = new Set<SortOption>(["price_asc", "price_desc", "newest", "oldest", "sqft_asc", "sqft_desc"]);

export function parseSearchParams(raw: RawSearchParams): PropertySearchParams {
  const get = (key: string) => firstString(raw[key]);

  const rawType = get("type") as TransactionType;
  const rawCategory = get("category") as PropertyCategory;
  const rawStatus = get("status") as PropertyStatus;
  const rawSort = get("sort") as SortOption;

  return {
    q: get("q") || undefined,
    type: VALID_TRANSACTION_TYPES.has(rawType) ? rawType : undefined,
    category: VALID_CATEGORIES.has(rawCategory) ? rawCategory : undefined,
    minPrice: parseNum(get("minPrice")),
    maxPrice: parseNum(get("maxPrice")),
    minBed: parseNum(get("minBed")),
    minBath: parseNum(get("minBath")),
    minSqFt: parseNum(get("minSqFt")),
    maxSqFt: parseNum(get("maxSqFt")),
    featured: parseBool(get("featured")),
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : undefined,
    sort: VALID_SORTS.has(rawSort) ? rawSort : undefined,
    view: get("view") === "list" ? "list" : "grid",
    page: parseNum(get("page")) ?? 1,
  };
}

// ─── Builder — converts typed params → URL search string ─────────────────────

export function buildSearchUrl(
  params: Partial<PropertySearchParams>,
  base = "/properties"
): string {
  const sp = new URLSearchParams();
  const set = (key: string, val: string | number | boolean | undefined) => {
    if (val !== undefined && val !== null && val !== "") {
      sp.set(key, String(val));
    }
  };

  set("q", params.q);
  set("type", params.type);
  set("category", params.category);
  set("minPrice", params.minPrice);
  set("maxPrice", params.maxPrice);
  set("minBed", params.minBed);
  set("minBath", params.minBath);
  set("minSqFt", params.minSqFt);
  set("maxSqFt", params.maxSqFt);
  if (params.featured) set("featured", "true");
  set("status", params.status);
  set("sort", params.sort);
  if (params.view && params.view !== "grid") set("view", params.view);
  if (params.page && params.page > 1) set("page", params.page);

  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

// ─── Active filter count (for badge on "Filters" button) ─────────────────────

export function countActiveFilters(params: PropertySearchParams): number {
  let count = 0;
  if (params.q) count++;
  if (params.type) count++;
  if (params.category) count++;
  if (params.minPrice !== undefined) count++;
  if (params.maxPrice !== undefined) count++;
  if (params.minBed !== undefined) count++;
  if (params.minBath !== undefined) count++;
  if (params.minSqFt !== undefined || params.maxSqFt !== undefined) count++;
  if (params.featured) count++;
  if (params.status) count++;
  return count;
}
