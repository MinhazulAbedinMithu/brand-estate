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
  color: string; // Icon wrapper accent color
  bgImage: string; // Unsplash background image URL
  href: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: "recommended",
    title: "Recommended Homes",
    description: "Curated specifically for your lifestyle and preferences.",
    icon: Heart,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/35 text-rose-300",
    bgImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
    href: "/properties?tag=recommended",
  },
  {
    id: "new-listings",
    title: "New Listings",
    description: "Fresh properties published onto our index within 24 hours.",
    icon: Sparkles,
    color: "from-amber-500/20 to-yellow-500/20 border-amber-500/35 text-amber-300",
    bgImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
    href: "/properties?tag=new",
  },
  {
    id: "new-constructions",
    title: "New Constructions",
    description: "Brand new homes featuring modern materials and smart systems.",
    icon: Building2,
    color: "from-blue-500/20 to-sky-500/20 border-blue-500/35 text-sky-300",
    bgImage: "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=600&q=80",
    href: "/properties?tag=construction",
  },
  {
    id: "price-reduced",
    title: "Price Reduced",
    description: "Properties with recent price drops offering superb value.",
    icon: TrendingDown,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/35 text-emerald-300",
    bgImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
    href: "/properties?tag=reduced",
  },
  {
    id: "luxury-estates",
    title: "Luxury Estates",
    description: "Elite level homes, penthouses, and private coastal villas.",
    icon: Gem,
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/35 text-purple-300",
    bgImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80",
    href: "/properties?tag=luxury",
  },
  {
    id: "foreclosures",
    title: "Foreclosures",
    description: "Bank-owned properties listing below standard market rate.",
    icon: Landmark,
    color: "from-red-500/20 to-orange-500/20 border-red-500/35 text-red-300",
    bgImage: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80",
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group/slider-container">
      {/* Self-contained Magic UI Border Beam conic gradient animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes beam-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .border-beam-card {
            position: relative;
            padding: 1.5px;
            overflow: hidden;
            border-radius: 1.5rem; /* rounded-2xl */
            display: flex;
            flex-direction: column;
            height: 12rem; /* h-48 */
            z-index: 0;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .dark .border-beam-card {
            background: rgba(1, 6, 17, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          
          .border-beam-card::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
              from 0deg,
              transparent 75%,
              #1d8cff 88%,
              #38bdf8 95%,
              transparent 100%
            );
            animation: beam-rotate 4s linear infinite;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          .border-beam-card:hover::before {
            opacity: 1;
          }
          .border-beam-inner {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            border-radius: calc(1.5rem - 1.5px);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5rem; /* p-6 */
            background: rgba(15, 23, 42, 0.35); /* dark overlay base */
          }
        `
      }} />

      {/* Floating Navigation Chevrons on Hover */}
      <button
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        className={cn(
          "absolute left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full border border-white/20 bg-accent-navy/60 hover:bg-accent-primary text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg opacity-0 group-hover/slider-container:opacity-100 disabled:pointer-events-none disabled:opacity-0"
        )}
        aria-label="Slide left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        className={cn(
          "absolute right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full border border-white/20 bg-accent-navy/60 hover:bg-accent-primary text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg opacity-0 group-hover/slider-container:opacity-100 disabled:pointer-events-none disabled:opacity-0"
        )}
        aria-label="Slide right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Horizontal Carousel Snap Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 px-0.5"
      >
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            data-card
            className="snap-start shrink-0 w-[80%] sm:w-[47%] lg:w-[calc(25%-12px)] border-beam-card group"
          >
            {/* The outer container holds the border-beam styling. The inner holds the card content */}
            <div className="border-beam-inner">
              {/* Unsplash Background Image with hover zoom */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 -z-20"
                style={{ backgroundImage: `url('${category.bgImage}')` }}
              />

              {/* Card Contrast Overlay — strong at the bottom where text is, clear at top */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/50 to-transparent -z-10" />

              {/* Top Row: Icon Box */}
              <div className="flex justify-between items-start">
                <div
                  className={cn(
                    "h-11 w-11 rounded-xl flex items-center justify-center bg-linear-to-br border shadow-sm",
                    category.color
                  )}
                >
                  <category.icon className="h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Micro badge — pill so it reads on any background */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-md opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  Explore →
                </span>
              </div>

              {/* Bottom Row: Text content */}
              <div className="space-y-1 relative z-10">
                <h3 className="font-heading text-base font-bold text-white group-hover:text-sky-300 transition-colors duration-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                  {category.title}
                </h3>
                <p className="text-xs text-white/90 font-body leading-relaxed line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
