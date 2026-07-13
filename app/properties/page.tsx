import * as React from "react";
import { parseSearchParams, countActiveFilters } from "@/lib/property-search-params";
import { connectDB } from "@/lib/db/mongoose";
import { Property, IProperty } from "@/lib/db/models/property.model";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertySortBar } from "@/components/property/property-sort-bar";
import { PropertyGrid } from "@/components/property/property-grid";
import { Pagination } from "@/components/shared/pagination";
import type { RawSearchParams } from "@/lib/property-search-params";
import { Metadata } from "next";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockProperty } from "@/src/mocks/propertyTypes";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Search Properties | RealHoms",
  description: "Browse and filter premium properties available for sale, rent, or co-living roommate shares.",
  openGraph: {
    title: "Search Properties | RealHoms",
    description: "Browse and filter premium properties available for sale, rent, or co-living roommate shares.",
    url: "/properties",
    siteName: "RealHoms",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Search Properties | RealHoms",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Properties | RealHoms",
    description: "Browse and filter premium properties available for sale, rent, or co-living roommate shares.",
    images: ["/og-image.png"],
  },
};

// Next.js page component
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const rawParams = await searchParams;
  const parsedParams = parseSearchParams(rawParams);
  
  await connectDB();

  // Dynamic backfill migration for missing country field in legacy properties
  const countMissing = await Property.countDocuments({ country: { $exists: false } });
  if (countMissing > 0) {
    const cityCountryMap: Record<string, string> = {
      "New York": "United States",
      "Malibu": "United States",
      "Chicago": "United States",
      "Los Angeles": "United States",
      "East Hampton": "United States",
      "Austin": "United States",
      "Houston": "United States",
      "Shibuya": "Japan",
      "Dubai": "United Arab Emirates",
      "Berlin": "Germany",
      "London": "United Kingdom",
      "Sydney": "Australia",
      "Toronto": "Canada",
      "Melbourne": "Australia",
      "Paris": "France",
      "Singapore": "Singapore",
      "Mumbai": "India",
      "Dhaka": "Bangladesh"
    };

    const docsToUpdate = await Property.find({ country: { $exists: false } }).lean();
    for (const doc of docsToUpdate) {
      const resolved = cityCountryMap[doc.city] || "United States";
      await Property.updateOne({ _id: doc._id }, { $set: { country: resolved } });
    }
  }

  interface PropertyFilterQuery {
    status?: string;
    propertyCategory?: string;
    transactionType?: string;
    price?: { $gte?: number; $lte?: number };
    bedrooms?: { $gte: number };
    bathrooms?: { $gte: number };
    squareFeet?: { $gte?: number; $lte?: number };
    isFeatured?: boolean;
    city?: string | { $regex: RegExp };
    country?: string | { $regex: RegExp };
    $or?: Array<{ [key: string]: string | RegExp | { $regex: RegExp } }>;
  }

  const filter: PropertyFilterQuery = { status: "active" };

  const cookieStore = await cookies();
  const userCity = cookieStore.get("user_city")?.value;
  const userCountry = cookieStore.get("user_country")?.value;

  // Apply default location filters from cookie if not searching/filtering explicitly by address/city/zip
  if (!parsedParams.q) {
    if (userCity) {
      filter.city = { $regex: new RegExp(`^${userCity}$`, "i") };
    }
    if (userCountry) {
      filter.country = { $regex: new RegExp(`^${userCountry}$`, "i") };
    }
  }

  if (parsedParams.category) {
    filter.propertyCategory = parsedParams.category;
  }
  if (parsedParams.type) {
    filter.transactionType = parsedParams.type;
  }
  if (parsedParams.minPrice !== undefined || parsedParams.maxPrice !== undefined) {
    filter.price = {};
    if (parsedParams.minPrice !== undefined) filter.price.$gte = parsedParams.minPrice;
    if (parsedParams.maxPrice !== undefined) filter.price.$lte = parsedParams.maxPrice;
  }
  if (parsedParams.minBed !== undefined) {
    filter.bedrooms = { $gte: parsedParams.minBed };
  }
  if (parsedParams.minBath !== undefined) {
    filter.bathrooms = { $gte: parsedParams.minBath };
  }
  if (parsedParams.minSqFt !== undefined || parsedParams.maxSqFt !== undefined) {
    filter.squareFeet = {};
    if (parsedParams.minSqFt !== undefined) filter.squareFeet.$gte = parsedParams.minSqFt;
    if (parsedParams.maxSqFt !== undefined) filter.squareFeet.$lte = parsedParams.maxSqFt;
  }
  if (parsedParams.featured) {
    filter.isFeatured = true;
  }
  if (parsedParams.q) {
    const searchRegex = new RegExp(parsedParams.q, "i");
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { city: searchRegex },
      { formattedAddress: searchRegex },
    ];
  }

  // Sort Option Mapping
  let sortOptions: Record<string, 1 | -1> = {};
  if (parsedParams.sort === "price_asc") {
    sortOptions = { price: 1 };
  } else if (parsedParams.sort === "price_desc") {
    sortOptions = { price: -1 };
  } else if (parsedParams.sort === "sqft_asc") {
    sortOptions = { squareFeet: 1 };
  } else if (parsedParams.sort === "sqft_desc") {
    sortOptions = { squareFeet: -1 };
  } else if (parsedParams.sort === "newest") {
    sortOptions = { yearBuilt: -1 };
  } else if (parsedParams.sort === "oldest") {
    sortOptions = { yearBuilt: 1 };
  } else {
    // Default featured first, then price desc
    sortOptions = { isFeatured: -1, price: -1 };
  }

  const page = parsedParams.page ?? 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  let total = await Property.countDocuments(filter as unknown as Record<string, unknown>);
  if (total === 0 && !parsedParams.q && userCity && userCountry) {
    // If no properties match city, try country-only fallback (removes city, but keeps country!)
    if (filter.city) {
      delete filter.city;
      total = await Property.countDocuments(filter as unknown as Record<string, unknown>);
    }
  }

  const [_, propertiesDocs] = await Promise.all([
    Promise.resolve(total),
    Property.find(filter as unknown as Record<string, unknown>)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  // Convert Mongoose documents/dates/ObjectIds to plain JSON primitives
  const plainDocs = JSON.parse(JSON.stringify(propertiesDocs));

  // Map database documents to MockProperty shape for components
  const items = plainDocs.map((p: any) => ({
    ...p,
    id: p._id,
    ownerId: p.ownerId,
  })) as unknown as MockProperty[];

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const results = { items, total, page, totalPages, pageSize: limit };
  const activeCount = countActiveFilters(parsedParams);

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-text-primary">
            Find Your Dream Home
          </h1>
          <p className="text-sm text-text-muted mt-2 font-body max-w-2xl leading-relaxed">
            Explore our catalog of apartments, single-family houses, shared rooms, and commercial spaces. Use the filters to find exactly what you need.
          </p>
        </div>

        {/* Search layout: filter sidebar + main content grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:flex lg:flex-col lg:w-72 shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
            <PropertyFilters key={JSON.stringify(parsedParams)} currentParams={parsedParams} />
          </aside>

          {/* Main Results Grid */}
          <div className="flex-1 w-full space-y-6">
            {/* Mobile Actions: Filters Trigger Button & Result Count (only visible under lg) */}
            <div className="flex items-center justify-between lg:hidden p-4 rounded-2xl border border-border-default/50 bg-bg-surface/50 backdrop-blur-md">
              <Sheet>
                <SheetTrigger
                  render={
                    <button
                      type="button"
                      className={cn(
                        "group rounded-full flex items-center gap-2.5 text-xs font-bold font-body px-5 py-2.5 border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-sm hover:shadow-md",
                        activeCount > 0
                          ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary hover:bg-accent-primary hover:text-white hover:border-transparent hover:shadow-accent-primary/10"
                          : "bg-bg-surface border-border-default/80 text-text-primary hover:border-accent-primary/45 hover:text-accent-primary"
                      )}
                    >
                      <SlidersHorizontal className={cn(
                        "h-3.5 w-3.5 transition-colors duration-300",
                        activeCount > 0 ? "text-accent-primary group-hover:text-white" : "text-text-secondary group-hover:text-accent-primary"
                      )} />
                      <span className="transition-colors duration-300">Filters</span>
                      {activeCount > 0 && (
                        <span className="bg-accent-primary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full group-hover:bg-white group-hover:text-accent-primary transition-colors duration-300 animate-fade-in">
                          {activeCount}
                        </span>
                      )}
                    </button>
                  }
                />
                <SheetContent side="left" className="w-[300px] sm:max-w-[340px] p-0 border-r border-border-default bg-bg-surface">
                  <div className="sr-only">
                    <h2>Filter Properties</h2>
                    <p>Select transaction types, property categories, price ranges, beds, baths, and more filters.</p>
                  </div>
                  <div className="h-full flex flex-col pt-10">
                    <PropertyFilters key={JSON.stringify(parsedParams)} currentParams={parsedParams} borderless />
                  </div>
                </SheetContent>
              </Sheet>

              <p className="text-xs text-text-muted font-bold font-body">
                {results.total} results
              </p>
            </div>

            {/* Sort & Count Bar */}
            <PropertySortBar total={results.total} params={parsedParams} />

            {/* Property Cards */}
            <PropertyGrid properties={results.items} view={parsedParams.view ?? "grid"} />

            {/* Pagination Controls */}
            {results.totalPages > 1 && (
              <div className="pt-8 border-t border-border-default/45 flex justify-center">
                <Pagination
                  page={results.page}
                  totalPages={results.totalPages}
                  params={parsedParams}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
