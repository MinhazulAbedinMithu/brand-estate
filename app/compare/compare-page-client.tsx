"use client";

import * as React from "react";
import Link from "next/link";
import {
  GitCompareArrows,
  X,
  ArrowLeft,
  Check,
  Minus,
  ExternalLink,
  Bed,
  Bath,
  Ruler,
  Calendar,
  MapPin,
  DollarSign,
  Tag,
  Home,
  Video,
  ImageIcon,
  ShieldCheck,
  PawPrint,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCompareItems,
  removeFromCompare,
  clearCompare,
  type CompareItem,
} from "@/lib/compare-store";
import type { MockProperty } from "@/src/mocks/propertyTypes";

// ─── helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  room_share: "Room Share",
  commercial: "Commercial",
};

const TRANSACTION_LABEL: Record<string, string> = {
  buy: "For Sale",
  rent: "For Rent",
  roommate_share: "Room Share",
};

const STATUS_COLOR: Record<string, string> = {
  active: "text-state-success bg-state-success/10 border-state-success/20",
  pending_approval: "text-state-warning bg-state-warning/10 border-state-warning/20",
  draft: "text-text-muted bg-bg-elevated border-border-default/30",
  sold: "text-state-error bg-state-error/10 border-state-error/20",
  rented: "text-state-info bg-state-info/10 border-state-info/20",
};

function formatPrice(p: MockProperty): string {
  const symbol =
    p.currency === "USD" ? "$" :
    p.currency === "GBP" ? "£" :
    p.currency === "EUR" ? "€" :
    p.currency === "AUD" ? "A$" :
    p.currency === "CAD" ? "C$" :
    p.currency === "SGD" ? "S$" :
    p.currency === "AED" ? "AED " :
    p.currency + " ";
  const isRent = p.transactionType === "rent" || p.transactionType === "roommate_share";
  return `${symbol}${p.price.toLocaleString()}${isRent ? "/mo" : ""}`;
}

// ─── Row types ────────────────────────────────────────────────────────────────

interface RowDef {
  label: string;
  icon: React.ElementType;
  key: string;
  render: (p: MockProperty) => React.ReactNode;
  highlight?: boolean; // visually distinguish the row
}

const ROWS: RowDef[] = [
  {
    label: "Price",
    icon: DollarSign,
    key: "price",
    render: (p) => (
      <span className="text-accent-primary font-extrabold text-base">{formatPrice(p)}</span>
    ),
    highlight: true,
  },
  {
    label: "Transaction",
    icon: Tag,
    key: "transactionType",
    render: (p) => (
      <span className="bg-accent-primary text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
        {TRANSACTION_LABEL[p.transactionType] ?? p.transactionType}
      </span>
    ),
  },
  {
    label: "Category",
    icon: Home,
    key: "propertyCategory",
    render: (p) => <span className="font-semibold capitalize">{CATEGORY_LABEL[p.propertyCategory] ?? p.propertyCategory}</span>,
  },
  {
    label: "Status",
    icon: ShieldCheck,
    key: "status",
    render: (p) => (
      <span className={cn("text-[10px] border px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider", STATUS_COLOR[p.status] ?? STATUS_COLOR.active)}>
        {p.status.replace("_", " ")}
      </span>
    ),
  },
  {
    label: "Location",
    icon: MapPin,
    key: "city",
    render: (p) => <span className="font-medium">{p.city}, {p.state}</span>,
  },
  {
    label: "Bedrooms",
    icon: Bed,
    key: "bedrooms",
    render: (p) =>
      p.propertyCategory === "commercial" ? (
        <span className="text-text-muted text-xs">N/A</span>
      ) : (
        <span className="font-bold text-text-primary">{p.bedrooms}</span>
      ),
    highlight: true,
  },
  {
    label: "Bathrooms",
    icon: Bath,
    key: "bathrooms",
    render: (p) =>
      p.propertyCategory === "commercial" ? (
        <span className="text-text-muted text-xs">N/A</span>
      ) : (
        <span className="font-bold text-text-primary">{p.bathrooms}</span>
      ),
    highlight: true,
  },
  {
    label: "Size (sq ft)",
    icon: Ruler,
    key: "squareFeet",
    render: (p) => <span className="font-bold text-text-primary">{p.squareFeet.toLocaleString()}</span>,
    highlight: true,
  },
  {
    label: "Year Built",
    icon: Calendar,
    key: "yearBuilt",
    render: (p) => <span className="font-semibold">{p.yearBuilt}</span>,
  },
  {
    label: "Pets Allowed",
    icon: PawPrint,
    key: "petsAllowed",
    render: (p) =>
      (p as any).petsAllowed ? (
        <span className="flex items-center gap-1.5 text-state-success font-bold text-xs">
          <Check className="h-3.5 w-3.5" /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs">
          <Minus className="h-3.5 w-3.5" /> No
        </span>
      ),
  },
  {
    label: "Video Tour",
    icon: Video,
    key: "videoTourUrl",
    render: (p) =>
      p.videoTourUrl ? (
        <span className="flex items-center gap-1.5 text-state-success font-bold text-xs">
          <Check className="h-3.5 w-3.5" /> Available
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-text-muted font-bold text-xs">
          <Minus className="h-3.5 w-3.5" /> None
        </span>
      ),
  },
  {
    label: "Images",
    icon: ImageIcon,
    key: "images",
    render: (p) => <span className="font-bold">{p.images.length} photos</span>,
  },
];

// ─── Empty slot ───────────────────────────────────────────────────────────────

function EmptySlot({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[260px] border-2 border-dashed border-border-default/50 rounded-2xl p-6 text-center">
      <div className="h-12 w-12 rounded-full bg-bg-alt flex items-center justify-center">
        <GitCompareArrows className="h-6 w-6 text-text-muted" />
      </div>
      <div>
        <p className="text-sm font-bold text-text-secondary">Add a property</p>
        <p className="text-xs text-text-muted mt-1">Browse listings and click the compare button</p>
      </div>
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-xs font-bold text-accent-primary hover:underline"
      >
        Browse Properties <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ─── Compare page client ──────────────────────────────────────────────────────

export function ComparePageClient() {
  const [compareItems, setCompareItems] = React.useState<CompareItem[]>([]);
  const [properties, setProperties] = React.useState<Record<string, MockProperty>>({});
  const [loading, setLoading] = React.useState(true);

  // Sync compare store
  React.useEffect(() => {
    const sync = () => setCompareItems(getCompareItems());
    sync();
    window.addEventListener("comparechange", sync);
    return () => window.removeEventListener("comparechange", sync);
  }, []);

  // Fetch full property details for each compare item
  React.useEffect(() => {
    if (compareItems.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function fetchAll() {
      const results = await Promise.allSettled(
        compareItems.map((item) =>
          fetch(`/api/properties/${item.id}`).then((r) => r.json())
        )
      );

      if (cancelled) return;

      const map: Record<string, MockProperty> = {};
      results.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value?.status === "success") {
          const p = result.value.data;
          map[compareItems[idx].id] = {
            ...p,
            id: p._id ?? p.id ?? compareItems[idx].id,
          };
        }
      });

      setProperties(map);
      setLoading(false);
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [compareItems]);

  const isEmpty = compareItems.length === 0;

  // ── Empty state
  if (!loading && isEmpty) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-6 px-4 py-20">
        <div className="h-20 w-20 rounded-full bg-accent-primary/10 flex items-center justify-center">
          <GitCompareArrows className="h-10 w-10 text-accent-primary" />
        </div>
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-extrabold font-heading text-text-primary mb-2">
            No Properties to Compare
          </h1>
          <p className="text-sm text-text-muted font-medium">
            Add up to 4 properties using the compare button on any listing card or detail page.
          </p>
        </div>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary-hov text-white font-bold text-sm px-6 py-3 rounded-full shadow-md shadow-accent-primary/20 transition-all active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Properties
        </Link>
      </div>
    );
  }

  // 4 possible columns (filled or empty)
  const slots = Array.from({ length: 4 }, (_, i) => compareItems[i] ?? null);

  return (
    <div className="min-h-screen bg-bg-base pb-32">
      {/* ── Header ── */}
      <div className="border-b border-border-default/50 bg-bg-surface sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border-default bg-bg-alt hover:bg-bg-elevated text-text-secondary transition-all"
              aria-label="Back to properties"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold font-heading text-text-primary leading-tight">
                Property Comparison
              </h1>
              <p className="text-[11px] text-text-muted font-medium">
                {compareItems.length} of 4 properties selected
              </p>
            </div>
          </div>
          {compareItems.length > 0 && (
            <button
              onClick={clearCompare}
              className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-state-error transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Property Cards Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {slots.map((item, idx) => {
            if (!item) return <EmptySlot key={`empty-${idx}`} onAdd={() => {}} />;

            const prop = properties[item.id];
            const isLoaded = !!prop;

            return (
              <div
                key={item.id}
                className="relative flex flex-col rounded-2xl border border-border-default/60 bg-bg-surface overflow-hidden shadow-sm group"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="absolute top-2.5 right-2.5 z-10 h-7 w-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-state-error/80 hover:border-state-error transition-all"
                  aria-label="Remove from compare"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* Image */}
                <div className="relative aspect-video w-full bg-bg-elevated overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-bg-elevated">
                      <Home className="h-8 w-8 text-text-muted" />
                    </div>
                  )}
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  {/* Price badge */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="bg-accent-primary text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow">
                      {item.price}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  {isLoaded && (
                    <p className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                      <MapPin className="h-3 w-3 text-accent-primary shrink-0" />
                      {prop.city}, {prop.state}
                    </p>
                  )}
                  <Link
                    href={`/property/${item.slug}`}
                    className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-accent-primary hover:underline"
                  >
                    View listing <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Comparison Table ── */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-bg-elevated animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border-default/60 overflow-hidden shadow-sm">
            {/* Table header — property name strip */}
            <div className="grid grid-cols-[180px_1fr_1fr_1fr_1fr] bg-bg-elevated border-b border-border-default/60">
              <div className="px-4 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Feature
              </div>
              {slots.map((item, idx) => (
                <div key={item?.id ?? `h-${idx}`} className="px-4 py-3 text-xs font-bold text-text-primary truncate border-l border-border-default/40">
                  {item ? (
                    <span className="line-clamp-1">{item.title}</span>
                  ) : (
                    <span className="text-text-muted italic font-normal">—</span>
                  )}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {ROWS.map((row, rowIdx) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.key}
                  className={cn(
                    "grid grid-cols-[180px_1fr_1fr_1fr_1fr] border-b border-border-default/40 last:border-b-0",
                    row.highlight ? "bg-accent-primary/3" : rowIdx % 2 === 0 ? "bg-bg-surface" : "bg-bg-alt/40"
                  )}
                >
                  {/* Label */}
                  <div className="px-4 py-3.5 flex items-center gap-2 text-xs font-bold text-text-secondary">
                    <Icon className="h-3.5 w-3.5 text-accent-primary shrink-0" />
                    {row.label}
                  </div>

                  {/* Values */}
                  {slots.map((item, idx) => {
                    const prop = item ? properties[item.id] : null;
                    return (
                      <div
                        key={item?.id ?? `v-${idx}`}
                        className="px-4 py-3.5 flex items-center text-xs text-text-secondary border-l border-border-default/30"
                      >
                        {prop ? (
                          row.render(prop)
                        ) : (
                          <span className="text-text-faint">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Amenities comparison ── */}
        {!loading && compareItems.some((item) => {
          const prop = properties[item.id];
          return prop?.amenities && prop.amenities.length > 0;
        }) && (
          <div className="mt-8 rounded-2xl border border-border-default/60 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-bg-elevated border-b border-border-default/60">
              <h2 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wider">
                Amenities
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-default/30">
              {slots.map((item, idx) => {
                const prop = item ? properties[item.id] : null;
                const amenities: string[] = prop?.amenities ?? [];
                return (
                  <div key={item?.id ?? `am-${idx}`} className="bg-bg-surface p-5">
                    {!item || !prop ? (
                      <p className="text-xs text-text-faint italic">—</p>
                    ) : amenities.length === 0 ? (
                      <p className="text-xs text-text-muted">No amenities listed</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {amenities.map((a) => (
                          <li key={a} className="flex items-center gap-2 text-[11px] text-text-secondary font-medium">
                            <Check className="h-3 w-3 text-state-success shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CTA row ── */}
        {!loading && compareItems.length > 0 && (
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {slots.map((item, idx) =>
              item ? (
                <Link
                  key={item.id}
                  href={`/property/${item.slug}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-accent-primary/20"
                >
                  View Details
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <div key={`cta-empty-${idx}`} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
