"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Sparkles, Building2, TrendingDown, Landmark, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string; // Gradient background/accent colors
  href: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: "recommended",
    title: "Recommended Homes",
    description: "Curated specifically for your lifestyle and preferences.",
    icon: Heart,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/35",
    href: "/properties?tag=recommended",
  },
  {
    id: "new-listings",
    title: "New Listings",
    description: "Fresh properties published onto our index within 24 hours.",
    icon: Sparkles,
    color: "from-amber-500/20 to-yellow-500/20 border-amber-500/35",
    href: "/properties?tag=new",
  },
  {
    id: "new-constructions",
    title: "New Constructions",
    description: "Brand new homes featuring modern materials and smart systems.",
    icon: Building2,
    color: "from-blue-500/20 to-sky-500/20 border-blue-500/35",
    href: "/properties?tag=construction",
  },
  {
    id: "price-reduced",
    title: "Price Reduced",
    description: "Properties with recent price drops offering superb value.",
    icon: TrendingDown,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/35",
    href: "/properties?tag=reduced",
  },
  {
    id: "luxury-estates",
    title: "Luxury Estates",
    description: "Elite level homes, penthouses, and private coastal villas.",
    icon: Gem,
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/35",
    href: "/properties?tag=luxury",
  },
  {
    id: "foreclosures",
    title: "Foreclosures",
    description: "Bank-owned properties listing below standard market rate.",
    icon: Landmark,
    color: "from-red-500/20 to-orange-500/20 border-red-500/35",
    href: "/properties?tag=foreclosure",
  },
];

export function CategorySlider() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  // Disable arrows if scrolled to the absolute start/end
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollLimits = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    }
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollLimits, { passive: true });
      window.addEventListener("resize", checkScrollLimits);
      
      // Initial check
      checkScrollLimits();
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScrollLimits);
      }
      window.removeEventListener("resize", checkScrollLimits);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const cardWidth = el.querySelector("[data-card]")?.getBoundingClientRect().width || 280;
      const gap = 16; // gap-4 = 16px
      const scrollAmount = (cardWidth + gap) * (direction === "left" ? -1 : 1);
      
      el.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl text-text-primary font-heading font-extrabold tracking-tight">
            Explore by Category
          </h2>
          <p className="text-text-muted text-xs sm:text-sm font-body font-normal">
            Quickly browse properties filtering on exclusive segments and listing tags.
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "h-10 w-10 rounded-full border border-border-default/45 flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary backdrop-blur-md transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:pointer-events-none",
              "bg-white/40 dark:bg-accent-navy/40"
            )}
            aria-label="Slide left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "h-10 w-10 rounded-full border border-border-default/45 flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary backdrop-blur-md transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:pointer-events-none",
              "bg-white/40 dark:bg-accent-navy/40"
            )}
            aria-label="Slide right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 px-0.5"
      >
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            data-card
            className={cn(
              "snap-start shrink-0 w-[80%] sm:w-[47%] lg:w-[calc(25%-12px)] relative rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between h-48",
              "backdrop-blur-md bg-white/10 dark:bg-accent-navy/40 border-white/20 dark:border-white/10 hover:bg-white/15 dark:hover:bg-accent-navy/55 shadow-lg group"
            )}
          >
            {/* Top Row: Icon Box */}
            <div className="flex justify-between items-start">
              <div
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center bg-linear-to-br border shadow-sm",
                  category.color
                )}
              >
                <category.icon className="h-6 w-6 text-text-primary dark:text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Micro badge */}
              <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore &rarr;
              </span>
            </div>

            {/* Bottom Row: Text content */}
            <div className="space-y-1 mt-4">
              <h3 className="font-heading text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors duration-200">
                {category.title}
              </h3>
              <p className="text-xs text-text-muted font-body leading-relaxed line-clamp-2">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
