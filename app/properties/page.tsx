import * as React from "react";
import { parseSearchParams, countActiveFilters } from "@/lib/property-search-params";
import { searchProperties } from "@/lib/property-filters";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertySortBar } from "@/components/property/property-sort-bar";
import { PropertyGrid } from "@/components/property/property-grid";
import { Pagination } from "@/components/shared/pagination";
import type { RawSearchParams } from "@/lib/property-search-params";
import { Metadata } from "next";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

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
