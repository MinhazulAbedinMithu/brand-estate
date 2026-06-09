"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Coins,
  Key,
  Users,
  Building,
  Home,
  Bed,
  Briefcase,
  Sparkles,
  Infinity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildSearchUrl, countActiveFilters } from "@/lib/property-search-params";
import type { PropertySearchParams } from "@/lib/property-search-params";
import { Slider } from "@/components/ui/slider";

interface PropertyFiltersProps {
  currentParams: PropertySearchParams;
  borderless?: boolean;
}

// ─── Price Helpers & Presets ──────────────────────────────────────────────────

const PRICE_TIERS = {
  low: { min: 0, max: 850000, step: 10000 },
  medium: { min: 750000, max: 5000000, step: 50000 },
  high: { min: 5000000, max: 75000000, step: 250000 },
} as const;

type PriceTier = keyof typeof PRICE_TIERS;

const formatPrice = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toLocaleString()}`;
};

// ─── Accordion section ────────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
  defaultOpen = true,
  isActive = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isActive?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-border-default/50 last:border-b-0 py-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold font-body text-text-primary hover:text-accent-primary transition-colors duration-300 cursor-pointer group"
      >
        <span className="flex items-center gap-2">
          {title}
          {isActive && (
            <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-300 ease-out group-hover:text-accent-primary",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100 mb-3" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-1 pb-2 space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chip button ─────────────────────────────────────────────────────────────

function Chip({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border font-body transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        active
          ? "bg-accent-primary text-white border-accent-primary shadow-md shadow-accent-primary/20"
          : "bg-bg-elevated/40 text-text-secondary border-border-default hover:border-accent-primary/30 hover:bg-bg-elevated/85 hover:text-accent-primary"
      )}
    >
      {Icon && (
        <Icon className={cn(
          "h-3.5 w-3.5 transition-colors",
          active ? "text-white" : "text-text-muted"
        )} />
      )}
      <span>{label}</span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TRANSACTION_TYPES = [
  { key: "buy", label: "For Sale", icon: Coins },
  { key: "rent", label: "For Rent", icon: Key },
  { key: "roommate_share", label: "Room Share", icon: Users },
] as const;

const PROPERTY_TYPES = [
  { key: "apartment", label: "Apartment", icon: Building },
  { key: "house", label: "House", icon: Home },
  { key: "room_share", label: "Room Share", icon: Bed },
  { key: "commercial", label: "Commercial", icon: Briefcase },
] as const;

export function PropertyFilters({ currentParams, borderless = false }: PropertyFiltersProps) {
  const router = useRouter();
  const activeCount = countActiveFilters(currentParams);

  // Local draft state — pushed to URL when "Apply" is clicked (or immediately for chips)
  const [draft, setDraft] = React.useState<PropertySearchParams>({ ...currentParams });

  // Initial detection of active price tier based on parameters
  const getInitialTier = (min?: number, max?: number): PriceTier => {
    if (max !== undefined && max <= 850000) return "low";
    if (min !== undefined && min >= 5000000) return "high";
    return "medium";
  };

  const [activeTier, setActiveTier] = React.useState<PriceTier>(() =>
    getInitialTier(currentParams.minPrice, currentParams.maxPrice)
  );

  const apply = (overrides: Partial<PropertySearchParams>) => {
    const next = { ...draft, ...overrides, page: 1 };
    setDraft(next);
    router.push(buildSearchUrl(next), { scroll: false });
  };

  const clearAll = () => {
    const reset: PropertySearchParams = { sort: currentParams.sort, view: currentParams.view };
    setDraft(reset);
    setActiveTier("medium");
    router.push(buildSearchUrl(reset), { scroll: false });
  };

  const toggle = <K extends keyof PropertySearchParams>(
    key: K,
    value: PropertySearchParams[K]
  ) => {
    const current = draft[key];
    apply({ [key]: current === value ? undefined : value } as Partial<PropertySearchParams>);
  };

  const priceConfig = React.useMemo(() => {
    if (draft.type === "rent" || draft.type === "roommate_share") {
      return { min: 0, max: 30000, step: 100 };
    }
    return PRICE_TIERS[activeTier];
  }, [draft.type, activeTier]);

  const currentVal = [
    draft.minPrice ?? priceConfig.min,
    draft.maxPrice ?? priceConfig.max,
  ];

  const handlePriceChange = (val: number | readonly number[]) => {
    if (Array.isArray(val)) {
      setDraft((d) => ({
        ...d,
        minPrice: val[0] === priceConfig.min ? undefined : val[0],
        maxPrice: val[1] === priceConfig.max ? undefined : val[1],
      }));
    }
  };

  const handlePriceCommit = (val: number | readonly number[]) => {
    if (Array.isArray(val)) {
      const nextMin = val[0] === priceConfig.min ? undefined : val[0];
      const nextMax = val[1] === priceConfig.max ? undefined : val[1];
      apply({ minPrice: nextMin, maxPrice: nextMax });
    }
  };

  const handleTierSelect = (tier: PriceTier) => {
    setActiveTier(tier);
    const conf = PRICE_TIERS[tier];
    setDraft((d) => ({
      ...d,
      minPrice: conf.min,
      maxPrice: conf.max,
    }));
    apply({ minPrice: conf.min, maxPrice: conf.max });
  };

  return (
    <div className={cn(
      "w-full bg-bg-surface flex flex-col max-h-full overflow-hidden",
      !borderless && "border border-border-default rounded-2xl shadow-sm"
    )}>
      {/* Header */}
      <div className="p-5 border-b border-border-default flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="h-4 w-4 text-accent-primary" />
          <span className="font-bold text-text-primary text-sm font-body tracking-tight">Search Filters</span>
          {activeCount > 0 && (
            <span className="bg-accent-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-fade-in">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-state-error hover:text-state-error/85 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      {/* Scrollable Filters List */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-3 fancy-scrollbar">
        {/* Transaction Type */}
        <FilterSection title="Transaction" isActive={!!draft.type}>
          <div className="flex flex-wrap gap-2">
            {TRANSACTION_TYPES.map((t) => (
              <Chip
                key={t.key}
                label={t.label}
                active={draft.type === t.key}
                onClick={() => toggle("type", t.key)}
                icon={t.icon}
              />
            ))}
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Property Type" isActive={!!draft.category}>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((c) => (
              <Chip
                key={c.key}
                label={c.label}
                active={draft.category === c.key}
                onClick={() => toggle("category", c.key)}
                icon={c.icon}
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" isActive={draft.minPrice !== undefined || draft.maxPrice !== undefined}>
          <div className="space-y-4 pt-1">
            {/* Low, Medium, High preset switcher (Only for Sale / Buy / Undefined) */}
            {!(draft.type === "rent" || draft.type === "roommate_share") && (
              <div className="flex rounded-full border border-border-default/85 bg-bg-elevated/20 p-0.5 w-full overflow-hidden shadow-inner">
                {(["low", "medium", "high"] as const).map((tier) => {
                  const active = activeTier === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => handleTierSelect(tier)}
                      className={cn(
                        "flex-1 py-1.5 text-center text-[10px] font-bold font-body rounded-full transition-all duration-300 cursor-pointer capitalize",
                        active
                          ? "bg-accent-primary text-white shadow-sm"
                          : "text-text-secondary hover:text-accent-primary hover:bg-bg-elevated/45"
                      )}
                    >
                      {tier}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Price labels and indicator */}
            <div className="flex items-center justify-between text-xs font-bold font-body text-text-primary px-1">
              <span className="bg-bg-elevated/60 px-3 py-1.5 rounded-xl border border-border-default/60 min-w-[70px] text-center">
                {formatPrice(currentVal[0])}
              </span>
              <span className="text-text-faint font-semibold">to</span>
              <span className="bg-bg-elevated/60 px-3 py-1.5 rounded-xl border border-border-default/60 min-w-[70px] flex items-center justify-center h-[34px]">
                {activeTier === "high" && currentVal[1] === 75000000 ? (
                  <Infinity className="h-4 w-4 text-text-primary" />
                ) : (
                  formatPrice(currentVal[1])
                )}
              </span>
            </div>

            {/* Slider track control */}
            <div className="px-1.5 py-2">
              <Slider
                value={currentVal}
                onValueChange={handlePriceChange}
                onValueCommitted={handlePriceCommit}
                min={priceConfig.min}
                max={priceConfig.max}
                step={priceConfig.step}
                className="w-full"
              />
            </div>
          </div>
        </FilterSection>

        {/* Bedrooms */}
        <FilterSection title="Min Bedrooms" isActive={draft.minBed !== undefined}>
          <div className="flex rounded-full border border-border-default/85 bg-bg-elevated/20 p-0.5 w-full overflow-hidden">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = draft.minBed === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => toggle("minBed", n)}
                  className={cn(
                    "flex-1 py-2 text-center text-xs font-semibold font-body rounded-full transition-all duration-300 cursor-pointer",
                    active
                      ? "bg-accent-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-accent-primary hover:bg-bg-elevated/40"
                  )}
                >
                  {n === 5 ? "5+" : n}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Bathrooms */}
        <FilterSection title="Min Bathrooms" isActive={draft.minBath !== undefined}>
          <div className="flex rounded-full border border-border-default/85 bg-bg-elevated/20 p-0.5 w-full overflow-hidden">
            {[1, 2, 3, 4].map((n) => {
              const active = draft.minBath === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => toggle("minBath", n)}
                  className={cn(
                    "flex-1 py-2 text-center text-xs font-semibold font-body rounded-full transition-all duration-300 cursor-pointer",
                    active
                      ? "bg-accent-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-accent-primary hover:bg-bg-elevated/40"
                  )}
                >
                  {n === 4 ? "4+" : n}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Featured only */}
        <FilterSection title="Special Listings" isActive={draft.featured !== undefined}>
          <div className="rounded-2xl border border-accent-primary/10 bg-accent-primary/[0.02] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                draft.featured ? "bg-accent-primary/15 text-accent-primary" : "bg-bg-elevated/60 text-text-muted"
              )}>
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-semibold font-body text-text-primary block">Featured Properties</span>
                <span className="text-[10px] text-text-muted font-medium block">Show only premium listings</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!!draft.featured}
              onClick={() => apply({ featured: draft.featured ? undefined : true })}
              className={cn(
                "w-11 h-6 rounded-full border border-border-default/85 transition-all duration-300 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary/25",
                draft.featured
                  ? "bg-accent-primary border-accent-primary shadow-sm shadow-accent-primary/20"
                  : "bg-bg-elevated/40 hover:bg-bg-elevated/80"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-md transition-all duration-300 ease-out",
                  draft.featured ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
