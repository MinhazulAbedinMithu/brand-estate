"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, Bed, Bath, ChevronLeft, ChevronRight, Sparkles, Building, Key, Landmark, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { buttonVariants } from "@/components/ui/button";
import { PRICE_RANGES_SALE, PRICE_RANGES_RENT } from "@/lib/constants";

type TabType = "buy" | "rent" | "sell";

// Background images for the left 3/4 section
const BACKGROUND_IMAGES: Record<TabType, string> = {
  buy: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
  rent: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  sell: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
};

const PROPERTY_TYPE_MAP: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  roomshare: "Room Share",
  commercial: "Commercial",
};

export function HeroSection() {
  const router = useRouter();

  // State for search categories
  const [activeTab, setActiveTab] = React.useState<TabType>("buy");

  // State for search inputs
  const [location, setLocation] = React.useState("");
  const [propertyType, setPropertyType] = React.useState<string>("all");
  const [priceRange, setPriceRange] = React.useState<string>("all");

  // Slider State (Right 1/4 Column) - Filter mockProperties for slider (e.g. premium ones)
  const bestDeals = React.useMemo(() => {
    return mockProperties.filter(
      (p) => p.id === "mock-prop-apt-1" || p.id === "mock-prop-house-1" || p.id === "mock-prop-comm-1"
    );
  }, []);

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isSliderHovered, setIsSliderHovered] = React.useState(false);
  const sliderIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Auto-playing slider logic
  React.useEffect(() => {
    if (!isSliderHovered && bestDeals.length > 1) {
      sliderIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bestDeals.length);
      }, 5000);
    }

    return () => {
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }
    };
  }, [isSliderHovered, bestDeals.length]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentSlide((prev) => (prev - 1 + bestDeals.length) % bestDeals.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentSlide((prev) => (prev + 1) % bestDeals.length);
  };

  // Perform search action
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (activeTab === "sell") {
      router.push(`/sell/valuation?address=${encodeURIComponent(location)}&propertyType=${propertyType}`);
      return;
    }

    params.set("type", activeTab === "buy" ? "sale" : "rent");

    if (location) {
      params.set("query", location);
    }

    if (propertyType !== "all") {
      params.set("propertyType", propertyType);
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }

    router.push(`/properties?${params.toString()}`);
  };

  // Reset inputs when switching tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setLocation("");
    setPropertyType("all");
    setPriceRange("all");
  };

  // Get active price range options
  const currentPriceOptions = activeTab === "buy" ? PRICE_RANGES_SALE : PRICE_RANGES_RENT;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:py-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-4 items-stretch">

        {/* ── LEFT COLUMN (3/4 on Desktop) ── */}
        <div className="lg:col-span-3 relative rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 shadow-xl border border-border-default/20 transition-all duration-300">

          {/* Dynamic Swapping Background Images */}
          {Object.entries(BACKGROUND_IMAGES).map(([tab, url]) => (
            <div
              key={tab}
              className={cn(
                "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out z-0",
                activeTab === tab ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              )}
              style={{ backgroundImage: `url('${url}')` }}
            />
          ))}

          {/* Focused left-side gradient scrim — keeps bright images visible on the right */}
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent z-0" />

          {/* Top Label & Headline — wrapped in a localized glass backdrop for daylight contrast */}
          <div className="max-w-2xl space-y-4 sm:space-y-6 relative z-10">
            {/* Soft radial scrim — fades to transparent at all edges, no visible box border */}
            <div
              className="absolute -z-10 pointer-events-none"
              style={{
                inset: "-2rem -3rem",
                background: "radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.15) 55%, transparent 80%)",
              }}
            />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/35 border border-white/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-300">
                Introducing Brand Estate
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-heading font-extrabold leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Find Your <span className="text-sky-300 drop-shadow-[0_2px_12px_rgba(56,189,248,0.5)]">Dream Home</span>
            </h1>

            <p className="text-base sm:text-lg text-white leading-relaxed font-body max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-normal">
              Discover a curated selection of premium properties. Seamlessly connect with elite agents, and leverage state-of-the-art tools to secure your future.
            </p>
          </div>

          {/* Category Tabs & Integrated Search Console */}
          <div className="mt-8 lg:mt-12 w-full max-w-3xl space-y-4 relative z-10">

            {/* Custom Modern Tabs */}
            <div className="flex gap-2 p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full w-fit">
              {(["buy", "rent", "sell"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 sm:gap-2",
                    activeTab === tab
                      ? "bg-accent-primary text-white shadow-md shadow-accent-primary/25"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {tab === "buy" && <Building className="h-3.5 w-3.5" />}
                  {tab === "rent" && <Key className="h-3.5 w-3.5" />}
                  {tab === "sell" && <Landmark className="h-3.5 w-3.5" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Glassmorphic Search Form Box */}
            <form
              onSubmit={handleSearch}
              className="bg-white/95 dark:bg-accent-navy/95 border border-border-default/30 dark:border-border-default/15 p-3 sm:p-4 rounded-2xl sm:rounded-full shadow-2xl backdrop-blur-lg flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full transition-all duration-300"
            >
              {/* Field 1: Location Input */}
              <div className="flex-1 relative flex items-center min-w-0">
                <MapPin className="absolute left-4 text-text-muted h-5 w-5 pointer-events-none" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "sell"
                      ? "Enter your property address..."
                      : "City, neighborhood, or ZIP code..."
                  }
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent pl-12 pr-4 py-3 sm:py-2 text-sm text-text-primary focus:outline-none placeholder:text-text-muted/70 truncate border-b sm:border-b-0 sm:border-r border-border-default dark:border-border-default/15"
                />
              </div>

              {/* Field 2: Property Type Dropdown */}
              <div className="relative min-w-[130px] sm:max-w-[160px] flex items-center">
                <Building2 className="absolute left-3 text-text-muted h-4.5 w-4.5 pointer-events-none" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-transparent pl-10 pr-6 py-3 sm:py-2 text-sm text-text-primary focus:outline-none appearance-none cursor-pointer border-b sm:border-b-0 sm:border-r border-border-default dark:border-border-default/15 font-medium"
                >
                  <option value="all">All Types</option>
                  {Object.entries(PROPERTY_TYPE_MAP).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 text-text-muted h-4 w-4 rotate-90 pointer-events-none" />
              </div>

              {/* Field 3: Budget / Value Dropdown */}
              <div className="relative min-w-[130px] sm:max-w-[160px] flex items-center">
                <span className="absolute left-3 text-text-muted text-sm font-semibold pointer-events-none">
                  $
                </span>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full bg-transparent pl-7 pr-6 py-3 sm:py-2 text-sm text-text-primary focus:outline-none appearance-none cursor-pointer font-medium"
                >
                  <option value="all">
                    {activeTab === "sell" ? "Est. Value" : "Max Price"}
                  </option>
                  {activeTab === "sell" ? (
                    <>
                      <option value="0-250000">Under $250k</option>
                      <option value="250000-500000">$250k - $500k</option>
                      <option value="500000-1000000">$500k - $1M</option>
                      <option value="1000000-2500000">$1M - $2.5M</option>
                      <option value="2500000-999999999">Over $2.5M</option>
                    </>
                  ) : (
                    currentPriceOptions.map((range, index) => (
                      <option
                        key={index}
                        value={`${range.min}-${range.max === Infinity ? "" : range.max}`}
                      >
                        {range.label}
                      </option>
                    ))
                  )}
                </select>
                <ChevronRight className="absolute right-3 text-text-muted h-4 w-4 rotate-90 pointer-events-none" />
              </div>

              {/* Submit Search Button */}
              <Button
                type="submit"
                className="bg-accent-primary hover:bg-accent-primary-hov text-white px-5 py-2.5 rounded-xl sm:rounded-full h-10.5 cursor-pointer font-bold shadow-lg hover:shadow-accent-primary/20 hover:-translate-y-0.5 transition-all duration-200 shrink-0"
              >
                <Search className="h-4 w-4 mr-1.5" />
                {activeTab === "sell" ? "Evaluate" : "Search"}
              </Button>
            </form>
          </div>

        </div>

        {/* ── RIGHT COLUMN (1/4 on Desktop) ── */}
        <div
          className="relative rounded-3xl overflow-hidden flex flex-col justify-end min-h-[380px] lg:min-h-full p-6 group/slider border border-border-default/10 shadow-xl"
          onMouseEnter={() => setIsSliderHovered(true)}
          onMouseLeave={() => setIsSliderHovered(false)}
        >
          {/* Slides */}
          {bestDeals.map((property, idx) => (
            <div
              key={property.id}
              onClick={() => router.push(`/property/${property.id}`)}
              className={cn(
                "absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out cursor-pointer",
                currentSlide === idx ? "opacity-100 scale-100 visible" : "opacity-0 scale-105 invisible pointer-events-none"
              )}
              style={{ backgroundImage: `url('${property.images[0]}')` }}
            >
              {/* Bottom gradient overlay of the slide */}
              <div className="absolute inset-0 bg-linear-to-t from-accent-navy/80 via-accent-navy/20 to-transparent" />
            </div>
          ))}

          {/* Top Floating Badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-state-warning/90 backdrop-blur-md shadow-md text-[10px] font-bold uppercase tracking-wider text-white select-none animate-pulse">
            <Sparkles className="h-3 w-3 fill-white" />
            Best Deal
          </div>

          {/* Slide Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-3 right-3 flex justify-between opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
            <button
              onClick={handlePrevSlide}
              className="h-8 w-8 rounded-full bg-accent-navy/60 hover:bg-accent-primary border border-white/20 flex items-center justify-center text-white cursor-pointer pointer-events-auto transition-all duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="h-8 w-8 rounded-full bg-accent-navy/60 hover:bg-accent-primary border border-white/20 flex items-center justify-center text-white cursor-pointer pointer-events-auto transition-all duration-200"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Content Info Card Overlay */}
          <div
            onClick={() => router.push(`/property/${bestDeals[currentSlide].id}`)}
            className="relative bg-white/10 dark:bg-black/25 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/15 dark:hover:bg-black/35 hover:scale-[1.01] transition-all duration-300 z-10 space-y-3 shadow-lg select-none"
          >
            {/* Quick Specs */}
            <div className="flex items-center justify-between text-white/90 text-xs font-semibold">
              <span className="font-heading text-lg font-bold text-white tracking-wide">
                ${bestDeals[currentSlide].price.toLocaleString()}
              </span>
              <span className="bg-accent-primary text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {bestDeals[currentSlide].transactionType === "buy" ? "For Sale" : "For Rent"}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-sm sm:text-base font-bold text-white truncate drop-shadow-md">
                {bestDeals[currentSlide].title}
              </h3>
              <p className="text-[11px] text-white/80 flex items-center gap-1 font-medium truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-primary" />
                {bestDeals[currentSlide].location.city}, {bestDeals[currentSlide].location.state}
              </p>
            </div>

            {/* Details Icons bar */}
            <div className="flex justify-between items-center text-[10px] sm:text-xs text-white/90 pt-2 border-t border-white/15">
              <span className="flex items-center gap-1.5 font-semibold">
                <Bed className="h-3.5 w-3.5 text-accent-primary" />
                {bestDeals[currentSlide].rooms} Rooms
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Bath className="h-3.5 w-3.5 text-accent-primary" />
                {bestDeals[currentSlide].washrooms} Baths
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Eye className="h-3.5 w-3.5 text-accent-primary" />
                Built {bestDeals[currentSlide].yearBuilt}
              </span>
            </div>
          </div>

          {/* Dots Indicator bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {bestDeals.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={cn(
                  "h-1.5 transition-all duration-300 rounded-full cursor-pointer",
                  currentSlide === idx ? "w-4 bg-accent-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
