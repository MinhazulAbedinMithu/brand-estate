"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, MapPin, Bed, Bath, Car, ArrowUpRight } from "lucide-react";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { cn } from "@/lib/utils";

const PROPERTY_TYPE_MAP: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  roomshare: "Room Share",
  commercial: "Commercial",
};

export function FeaturedProperties() {
  // Select first 4 properties for the showcase
  const featuredListings = React.useMemo(() => {
    return mockProperties.slice(0, 4);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
      
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
          <Link 
            key={property.id} 
            href={`/property/${property.id}`}
            className="group flex flex-col bg-bg-surface border border-border-default/45 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-border-default/80 transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-bg-elevated">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Floating Favorite Action */}
              <div 
                className="absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full bg-white/70 hover:bg-white border border-white/20 backdrop-blur-md text-text-secondary hover:text-state-error shadow-sm transition-all duration-200 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="h-4.5 w-4.5" />
              </div>
              
              {/* Bottom tag row */}
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <span className="bg-accent-navy/85 backdrop-blur-md text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {PROPERTY_TYPE_MAP[property.type]}
                </span>
                <span className="bg-accent-primary text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                  {property.transactionType === "buy" ? "For Sale" : "For Rent"}
                </span>
              </div>
            </div>

            {/* Description details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-heading text-lg sm:text-xl font-bold text-accent-primary">
                    ${property.price.toLocaleString()}
                    {property.transactionType === "rent" && (
                      <span className="text-xs text-text-muted font-body font-medium">/mo</span>
                    )}
                  </span>
                  
                  {/* Commission Indicator */}
                  <span className="text-[10px] bg-state-success/10 border border-state-success/20 text-state-success px-2 py-0.5 rounded-md font-semibold select-none">
                    {property.agentCommissionPercent}% Comm.
                  </span>
                </div>
                
                <h3 className="text-text-primary text-sm sm:text-base font-bold font-body line-clamp-1 group-hover:text-accent-primary transition-colors duration-200">
                  {property.title}
                </h3>
                
                <p className="text-text-muted text-xs flex items-center gap-1 font-medium truncate">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-primary/80" />
                  {property.location.street}, {property.location.city}
                </p>
              </div>

              {/* Specs icons row */}
              <div className="flex justify-between items-center text-xs text-text-secondary pt-3.5 border-t border-border-default/40">
                <span className="flex items-center gap-1 font-semibold">
                  <Bed className="h-4 w-4 text-accent-primary/80" />
                  {property.rooms} {property.type === "roomshare" ? "Room" : "Bed"}
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Bath className="h-4 w-4 text-accent-primary/80" />
                  {property.washrooms} Bath
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Car className="h-4 w-4 text-accent-primary/80" />
                  {property.parking.spaces} Park
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
