import * as React from "react";
import { parseSearchParams, buildSearchUrl } from "@/lib/property-search-params";
import { searchProperties } from "@/lib/property-filters";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertySortBar } from "@/components/property/property-sort-bar";
import { PropertyGrid } from "@/components/property/property-grid";
import { Pagination } from "@/components/shared/pagination";
import type { RawSearchParams } from "@/lib/property-search-params";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Properties",
  description: "Browse and filter premium properties available for sale, rent, or co-living roommate shares.",
};

// Next.js page component
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const rawParams = await searchParams;
  const parsedParams = parseSearchParams(rawParams);
  const results = searchProperties(mockProperties, parsedParams);

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-text-primary">
            Find Your Dream Home
          </h1>
          <p className="text-sm text-text-muted mt-2 font-body max-w-2xl leading-relaxed">
            Explore our curated catalog of apartments, single-family houses, shared rooms, and commercial spaces. Use the filters to find exactly what you need.
          </p>
        </div>

        {/* Search layout: filter sidebar + main content grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters (Desktop) */}
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border-default bg-bg-surface p-5 md:p-6 shadow-sm">
              <h2 className="text-base font-bold font-body text-text-primary border-b border-border-default pb-4 mb-5">
                Search Filters
              </h2>
              <PropertyFilters currentParams={parsedParams} />
            </div>
          </aside>

          {/* Main Results Grid */}
          <div className="flex-1 w-full space-y-6">
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
