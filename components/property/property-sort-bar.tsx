"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildSearchUrl } from "@/lib/property-search-params";
import type { PropertySearchParams, SortOption, ViewMode } from "@/lib/property-search-params";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price_desc", label: "Price: High → Low" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "newest", label: "Newest Built" },
  { value: "oldest", label: "Oldest Built" },
  { value: "sqft_desc", label: "Largest First" },
  { value: "sqft_asc", label: "Smallest First" },
];

interface PropertySortBarProps {
  total: number;
  params: PropertySearchParams;
}

export function PropertySortBar({ total, params }: PropertySortBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(params.q ?? "");

  const push = (overrides: Partial<PropertySearchParams>) => {
    router.push(buildSearchUrl({ ...params, ...overrides, page: 1 }), { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    push({ q: query || undefined });
  };

  const clearQuery = () => {
    setQuery("");
    push({ q: undefined });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex-1 relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city, title, address…"
          className="w-full pl-10 pr-9 py-2.5 rounded-full border border-border-default/60 bg-bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary transition-all duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Right controls */}
      <div className="flex items-center justify-between md:justify-start gap-3 shrink-0">
        {/* Result count */}
        <p className="text-sm text-text-muted font-medium hidden sm:block">
          <span className="text-text-primary font-bold">{total}</span>{" "}
          {total === 1 ? "property" : "properties"}
        </p>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={params.sort ?? ""}
            onChange={(e) => push({ sort: (e.target.value as SortOption) || undefined })}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-full border border-border-default/60 bg-bg-surface text-sm text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary cursor-pointer transition-all duration-200"
          >
            <option value="">Sort: Default</option>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        </div>

        {/* View toggle */}
        <div className="flex items-center rounded-full border border-border-default/60 bg-bg-surface overflow-hidden">
          {(["grid", "list"] as ViewMode[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => push({ view: v })}
              className={cn(
                "flex items-center justify-center p-2.5 transition-all duration-200 cursor-pointer",
                params.view === v || (!params.view && v === "grid")
                  ? "bg-accent-primary text-white"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-elevated"
              )}
              aria-label={v === "grid" ? "Grid view" : "List view"}
            >
              {v === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
