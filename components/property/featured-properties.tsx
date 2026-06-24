"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PropertyCard } from "./property-card";
import type { MockProperty } from "@/src/mocks/propertyTypes";

interface FeaturedPropertiesProps {
  properties?: MockProperty[];
}

export function FeaturedProperties({ properties = [] }: FeaturedPropertiesProps) {
  // Filter for featured listings (isFeatured === true), cap at 4
  const featuredListings = React.useMemo(() => {
    return properties.filter((p) => p.isFeatured).slice(0, 4);
  }, [properties]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 pt-20 pb-10">

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary-dim border border-accent-primary/20 text-xs font-semibold uppercase tracking-wider text-accent-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Handpicked Deals
          </div>
          <h2 className="text-3xl sm:text-4xl text-text-primary font-heading font-extrabold tracking-tight">
            Featured Properties
          </h2>
          <p className="text-text-muted text-sm sm:text-base font-body max-w-xl font-normal">
            Explore our collection of top-tier listings selected for outstanding location, high-performance commission splits, and premium design.
          </p>
        </div>

        <Link
          href="/properties"
          className="group flex items-center gap-1.5 text-sm font-bold text-accent-primary hover:text-accent-primary-hov transition-colors duration-200 shrink-0"
        >
          View All Listings
          <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredListings.map((property) => (
          <PropertyCard key={property.id} property={property} variant="grid" />
        ))}
      </div>
    </section>
  );
}
