"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildSearchUrl, countActiveFilters } from "@/lib/property-search-params";
import type { PropertySearchParams } from "@/lib/property-search-params";

interface PropertyFiltersProps {
  currentParams: PropertySearchParams;
}

// ─── Accordion section ────────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-border-default/40 pb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-3 text-sm font-bold text-text-primary hover:text-accent-primary transition-colors duration-200 cursor-pointer"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

// ─── Chip button ─────────────────────────────────────────────────────────────

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer",
        active
          ? "bg-accent-primary text-white border-accent-primary shadow-sm"
          : "bg-bg-elevated/60 text-text-secondary border-border-default/60 hover:border-accent-primary/40 hover:text-accent-primary"
      )}
    >
      {label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PropertyFilters({ currentParams }: PropertyFiltersProps) {
  const router = useRouter();
  const activeCount = countActiveFilters(currentParams);

  // Local draft state — pushed to URL when "Apply" is clicked (or immediately for chips)
  const [draft, setDraft] = React.useState<PropertySearchParams>({ ...currentParams });

  // Sync draft when URL params change (e.g. browser back)
  React.useEffect(() => {
    setDraft({ ...currentParams });
  }, [currentParams]);

  const apply = (overrides: Partial<PropertySearchParams>) => {
    const next = { ...draft, ...overrides, page: 1 };
    setDraft(next);
    router.push(buildSearchUrl(next), { scroll: false });
  };

  const clearAll = () => {
    const reset: PropertySearchParams = { sort: currentParams.sort, view: currentParams.view };
    setDraft(reset);
    router.push(buildSearchUrl(reset), { scroll: false });
  };

  const toggle = <K extends keyof PropertySearchParams>(
    key: K,
    value: PropertySearchParams[K]
  ) => {
    const current = draft[key];
    apply({ [key]: current === value ? undefined : value } as Partial<PropertySearchParams>);
  };

  return (
    <aside className="w-full bg-bg-surface border border-border-default/50 rounded-2xl p-5 space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-default/40">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-accent-primary" />
          <span className="font-bold text-text-primary text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="bg-accent-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-state-error hover:text-state-error/80 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      {/* Transaction Type */}
      <FilterSection title="Transaction">
        <div className="flex flex-wrap gap-2">
          {(["buy", "rent", "roommate_share"] as const).map((t) => (
            <Chip
              key={t}
              label={t === "buy" ? "For Sale" : t === "rent" ? "For Rent" : "Room Share"}
              active={draft.type === t}
              onClick={() => toggle("type", t)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Property Type">
        <div className="flex flex-wrap gap-2">
          {(["apartment", "house", "room_share", "commercial"] as const).map((c) => (
            <Chip
              key={c}
              label={
                c === "apartment"
                  ? "Apartment"
                  : c === "house"
                  ? "House"
                  : c === "room_share"
                  ? "Room Share"
                  : "Commercial"
              }
              active={draft.category === c}
              onClick={() => toggle("category", c)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1">Min Price</label>
              <input
                type="number"
                placeholder="No min"
                value={draft.minPrice ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-border-default/60 bg-bg-elevated/50 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1">Max Price</label>
              <input
                type="number"
                placeholder="No max"
                value={draft.maxPrice ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-border-default/60 bg-bg-elevated/50 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => apply({})}
            className="w-full py-2 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-bold border border-accent-primary/20 hover:bg-accent-primary hover:text-white transition-all duration-200 cursor-pointer"
          >
            Apply Price
          </button>
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Min Bedrooms">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Chip
              key={n}
              label={n === 5 ? "5+" : String(n)}
              active={draft.minBed === n}
              onClick={() => toggle("minBed", n)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection title="Min Bathrooms">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((n) => (
            <Chip
              key={n}
              label={n === 4 ? "4+" : String(n)}
              active={draft.minBath === n}
              onClick={() => toggle("minBath", n)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Featured only */}
      <FilterSection title="Special">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => apply({ featured: draft.featured ? undefined : true })}
            className={cn(
              "w-10 h-5 rounded-full border-2 transition-all duration-300 relative cursor-pointer",
              draft.featured
                ? "bg-accent-primary border-accent-primary"
                : "bg-bg-elevated border-border-default/60 group-hover:border-accent-primary/40"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-all duration-300",
                draft.featured ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
          <span className="text-sm text-text-secondary font-medium">Featured only</span>
        </label>
      </FilterSection>
    </aside>
  );
}
