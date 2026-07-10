"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Bed, Bath, Ruler, Star, ArrowUpRight, Heart, GitCompareArrows, ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockProperty } from "@/src/mocks/propertyTypes";
import { useFavourites } from "@/lib/favourites-store";
import { addToCompare, removeFromCompare, isInCompare } from "@/lib/compare-store";
import { toast } from "sonner";

// ─── Label maps ───────────────────────────────────────────────────────────────

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
  active: "text-state-success bg-state-success/10 border-state-success/15",
  pending_approval: "text-state-warning bg-state-warning/10 border-state-warning/15",
  draft: "text-text-muted bg-bg-elevated border-border-default/30",
  sold: "text-state-error bg-state-error/10 border-state-error/15",
  rented: "text-state-info bg-state-info/10 border-state-info/15",
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PropertyCardProps {
  property: MockProperty;
  variant?: "grid" | "list";
  className?: string;
}

// ─── Shared price formatter ───────────────────────────────────────────────────

function formatPrice(property: MockProperty): string {
  const symbol =
    property.currency === "USD"
      ? "$"
      : property.currency === "GBP"
        ? "£"
        : property.currency === "EUR"
          ? "€"
          : property.currency === "AUD"
            ? "A$"
            : property.currency === "CAD"
              ? "C$"
              : property.currency === "SGD"
                ? "S$"
                : property.currency === "AED"
                  ? "AED "
                  : property.currency + " ";

  const isRent =
    property.transactionType === "rent" || property.transactionType === "roommate_share";

  return `${symbol}${property.price.toLocaleString()}${isRent ? "/mo" : ""}`;
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function GridCard({ property, className }: { property: MockProperty; className?: string }) {
  const [hovered, setHovered] = React.useState(false);
  const [inCompare, setInCompare] = React.useState(false);
  const { isSaved, toggle } = useFavourites();

  const img2 = property.images[1] ?? property.images[0];
  const saved = isSaved(property.id);
  const hasVideo = !!property.videoTourUrl;
  const imageCount = property.images.length;

  React.useEffect(() => {
    setInCompare(isInCompare(property.id));
    const onchange = () => setInCompare(isInCompare(property.id));
    window.addEventListener("comparechange", onchange);
    return () => window.removeEventListener("comparechange", onchange);
  }, [property.id]);

  const handleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(property.id, property.title);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(property.id);
      toast.success("Removed from compare");
    } else {
      const result = addToCompare({
        id: property.id,
        slug: property.slug,
        title: property.title,
        image: property.images[0] ?? "",
        price: formatPrice(property),
      });
      if (!result.success) {
        toast.error("Compare limit reached", { description: result.message });
      } else {
        toast.success("Added to compare ⇄");
      }
    }
  };

  return (
    <Link
      href={`/property/${property.slug}`}
      className={cn(
        "group flex flex-col bg-bg-surface border border-border-default/45 rounded-2xl overflow-hidden",
        "hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent-primary/5 hover:border-accent-primary/20 transition-all duration-300",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-bg-elevated flex-shrink-0">
        <img
          src={hovered ? img2 : property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark mask overlay on hover */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

        {/* Top Floating Badges (Left) */}
        {property.isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md select-none">
            <Star className="h-3 w-3 fill-white" />
            FEATURED
          </div>
        )}

        {/* Action Buttons (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleFavourite}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full backdrop-blur-md border shadow transition-all duration-200",
              saved
                ? "bg-state-error/20 border-state-error/40 text-state-error"
                : "bg-black/35 border-white/15 text-white hover:bg-black/55 hover:scale-105 active:scale-95"
            )}
            aria-label={saved ? "Remove from saved" : "Save listing"}
          >
            <Heart className={cn("h-3.5 w-3.5 transition-all", saved ? "fill-state-error" : "")} />
          </button>
          <button
            onClick={handleCompare}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full backdrop-blur-md border shadow transition-all duration-200",
              inCompare
                ? "bg-accent-primary/20 border-accent-primary/40 text-accent-primary"
                : "bg-black/35 border-white/15 text-white hover:bg-black/55 hover:scale-105 active:scale-95"
            )}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Category & Transaction floating badges */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
          <span className="bg-black/40 backdrop-blur-md text-white border border-white/10 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {CATEGORY_LABEL[property.propertyCategory]}
          </span>
          <span className="bg-accent-primary text-white text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
            {TRANSACTION_LABEL[property.transactionType]}
          </span>
        </div>

        {/* Image & Video count (Bottom Right) */}
        <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
          {imageCount > 0 && (
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
              <ImageIcon className="h-2.5 w-2.5" />
              {imageCount}
            </span>
          )}
          {hasVideo && (
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
              <Video className="h-2.5 w-2.5" />
              1
            </span>
          )}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          {/* Price + status badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-xl font-extrabold text-accent-primary tracking-tight">
              {formatPrice(property)}
            </span>
            <span
              className={cn(
                "text-[9px] border px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider select-none shrink-0",
                STATUS_COLOR[property.status] ?? STATUS_COLOR.active
              )}
            >
              {property.status.replace("_", " ")}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-text-primary text-sm sm:text-base font-bold font-body line-clamp-1 group-hover:text-accent-primary transition-colors duration-200">
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-text-muted text-xs flex items-center gap-1 font-semibold truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-primary/80" />
            {property.city}, {property.state}
          </p>
        </div>

        {/* Specs Box: Embedded card style */}
        <div className="flex items-center justify-between bg-bg-alt/55 border border-border-default/45 p-2.5 rounded-xl text-xs text-text-secondary select-none">
          {property.propertyCategory !== "commercial" ? (
            <>
              <span className="flex items-center gap-1.5 font-medium">
                <Bed className="h-3.5 w-3.5 text-accent-primary/80" />
                <span className="font-bold text-text-primary">{property.bedrooms}</span> {property.propertyCategory === "room_share" ? "Room" : "Bed"}
              </span>
              <div className="h-3 w-px bg-border-default/80" />
              <span className="flex items-center gap-1.5 font-medium">
                <Bath className="h-3.5 w-3.5 text-accent-primary/80" />
                <span className="font-bold text-text-primary">{property.bathrooms}</span> Bath
              </span>
              <div className="h-3 w-px bg-border-default/80" />
              <span className="flex items-center gap-1.5 font-medium">
                <Ruler className="h-3.5 w-3.5 text-accent-primary/80 rotate-90" />
                <span className="font-bold text-text-primary">{property.squareFeet.toLocaleString()}</span> ft²
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5 font-medium">
                <Ruler className="h-3.5 w-3.5 text-accent-primary/80 rotate-90" />
                <span className="font-bold text-text-primary">{property.squareFeet.toLocaleString()}</span> ft²
              </span>
              <div className="h-3 w-px bg-border-default/80" />
              <span className="text-text-muted font-bold capitalize truncate">
                {"commercial" in property
                  ? (property as typeof property & { commercial: { zoningCode: string } }).commercial?.zoningCode?.replace("_", " ")
                  : "Commercial"}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── List card ────────────────────────────────────────────────────────────────

function ListCard({ property, className }: { property: MockProperty; className?: string }) {
  const [inCompare, setInCompare] = React.useState(false);
  const { isSaved, toggle } = useFavourites();

  const saved = isSaved(property.id);
  const hasVideo = !!property.videoTourUrl;
  const imageCount = property.images.length;

  React.useEffect(() => {
    setInCompare(isInCompare(property.id));
    const onchange = () => setInCompare(isInCompare(property.id));
    window.addEventListener("comparechange", onchange);
    return () => window.removeEventListener("comparechange", onchange);
  }, [property.id]);

  const handleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(property.id, property.title);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(property.id);
      toast.success("Removed from compare");
    } else {
      const result = addToCompare({
        id: property.id,
        slug: property.slug,
        title: property.title,
        image: property.images[0] ?? "",
        price: formatPrice(property),
      });
      if (!result.success) {
        toast.error("Compare limit reached", { description: result.message });
      } else {
        toast.success("Added to compare ⇄");
      }
    }
  };

  return (
    <Link
      href={`/property/${property.slug}`}
      className={cn(
        "group flex flex-col sm:flex-row bg-bg-surface border border-border-default/45 rounded-2xl overflow-hidden",
        "hover:shadow-2xl hover:shadow-accent-primary/5 hover:border-accent-primary/20 transition-all duration-300",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative w-full sm:w-60 md:w-68 aspect-video sm:aspect-auto flex-shrink-0 overflow-hidden bg-bg-elevated">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark mask overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

        {property.isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow">
            <Star className="h-3 w-3 fill-white" />
            FEATURED
          </div>
        )}

        {/* Action Buttons (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleFavourite}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full backdrop-blur-md border shadow transition-all duration-200",
              saved
                ? "bg-state-error/20 border-state-error/40 text-state-error"
                : "bg-black/35 border-white/15 text-white hover:bg-black/55 hover:scale-105 active:scale-95"
            )}
            aria-label={saved ? "Remove from saved" : "Save listing"}
          >
            <Heart className={cn("h-3.5 w-3.5 transition-all", saved ? "fill-state-error" : "")} />
          </button>
          <button
            onClick={handleCompare}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full backdrop-blur-md border shadow transition-all duration-200",
              inCompare
                ? "bg-accent-primary/20 border-accent-primary/40 text-accent-primary"
                : "bg-black/35 border-white/15 text-white hover:bg-black/55 hover:scale-105 active:scale-95"
            )}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Image & Video count (Bottom Right) */}
        <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
          {imageCount > 0 && (
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
              <ImageIcon className="h-2.5 w-2.5" />
              {imageCount}
            </span>
          )}
          {hasVideo && (
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
              <Video className="h-2.5 w-2.5" />
              1
            </span>
          )}
        </div>
      </div>

      {/* Body Details */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div className="space-y-2">
          {/* Badge row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-black/40 backdrop-blur-md text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-text-primary border border-border-default/40">
              {CATEGORY_LABEL[property.propertyCategory]}
            </span>
            <span className="bg-accent-primary text-white text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {TRANSACTION_LABEL[property.transactionType]}
            </span>
            <span
              className={cn(
                "text-[9px] border px-2 py-0.5 rounded-md font-bold uppercase tracking-wider",
                STATUS_COLOR[property.status] ?? STATUS_COLOR.active
              )}
            >
              {property.status.replace("_", " ")}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-text-primary text-base font-bold font-body line-clamp-1 group-hover:text-accent-primary transition-colors duration-200">
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-text-muted text-xs flex items-center gap-1 font-semibold truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-primary/80" />
            {property.formattedAddress}
          </p>
        </div>

        {/* Bottom Specs Bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-default/40">
          <span className="font-body text-xl sm:text-2xl font-extrabold text-accent-primary tracking-tight">
            {formatPrice(property)}
          </span>
          <div className="flex items-center gap-3 text-xs text-text-secondary select-none">
            {property.propertyCategory !== "commercial" && (
              <>
                <span className="flex items-center gap-1 font-medium">
                  <Bed className="h-4 w-4 text-accent-primary/80" />
                  <span className="font-bold text-text-primary">{property.bedrooms}</span>bd
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Bath className="h-4 w-4 text-accent-primary/80" />
                  <span className="font-bold text-text-primary">{property.bathrooms}</span>ba
                </span>
              </>
            )}
            <span className="flex items-center gap-1 font-medium">
              <Ruler className="h-4 w-4 text-accent-primary/80 rotate-90" />
              <span className="font-bold text-text-primary">{property.squareFeet.toLocaleString()}</span> ft²
            </span>
          </div>
          <div className="hidden sm:flex h-8 w-8 rounded-full border border-border-default bg-bg-surface items-center justify-center text-text-secondary group-hover:bg-accent-primary group-hover:text-white group-hover:border-accent-primary transition-all duration-300">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────

export function PropertyCard({ property, variant = "grid", className }: PropertyCardProps) {
  if (variant === "list") {
    return <ListCard property={property} className={className} />;
  }
  return <GridCard property={property} className={className} />;
}
