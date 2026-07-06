"use client";

import * as React from "react";
import { Search, MapPin, Building, SearchCode, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { COUNTRIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "search" | "location";
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  defaultTab = "search",
  selectedCountry,
  onSelectCountry,
}: SearchModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"search" | "location">(defaultTab);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  // Keep internal activeTab in sync with prop defaultTab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setActiveTab(defaultTab);
        setSearchQuery("");
      }, 0);
    }
  }, [isOpen, defaultTab]);

  const filteredCountries = React.useMemo(() => {
    if (activeTab !== "location") return [];
    return COUNTRIES.filter((country) =>
      country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  const handleCountrySelect = (country: string) => {
    if (onSelectCountry) {
      onSelectCountry(country);
    }
    onClose();
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/properties?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/properties");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md md:max-w-lg rounded-3xl bg-bg-surface/95 dark:bg-bg-surface border border-border-default/80 shadow-2xl p-6 backdrop-blur-lg transition-all duration-300">
        <DialogHeader className="mb-4 space-y-1">
          <DialogTitle className="text-2xl font-bold tracking-tight text-text-primary font-heading">
            Search <span className="text-accent-primary">RealHoms</span>
          </DialogTitle>
          <DialogDescription className="text-text-muted text-xs sm:text-sm tracking-wide">
            Find premium properties or change your location search scope.
          </DialogDescription>
        </DialogHeader>

        {/* Custom Premium Tabs Selector (replaces buggy shadcn tabs) */}
        <div className="grid w-full grid-cols-2 bg-bg-alt/80 dark:bg-bg-subtle/80 p-1 rounded-full border border-border-default/30 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab("search");
              setSearchQuery("");
            }}
            className={cn(
              "flex items-center justify-center rounded-full py-2.5 px-4 text-sm font-semibold transition-all duration-300 cursor-pointer",
              activeTab === "search"
                ? "bg-bg-surface text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <Building className="h-4 w-4 mr-2 text-accent-primary" />
            Properties
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("location");
              setSearchQuery("");
            }}
            className={cn(
              "flex items-center justify-center rounded-full py-2.5 px-4 text-sm font-semibold transition-all duration-300 cursor-pointer",
              activeTab === "location"
                ? "bg-bg-surface text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <MapPin className="h-4 w-4 mr-2 text-accent-primary" />
            Location
          </button>
        </div>

        {/* Tab 1: Search Properties */}
        {activeTab === "search" && (
          <div className="space-y-5 animate-fade-in">
            <div className="relative">
              <Search className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300",
                isFocused ? "text-accent-primary" : "text-text-muted"
              )} />
              <input
                type="text"
                placeholder="Search by city, neighborhood, or ZIP code..."
                className="pl-12 pr-4 h-12 w-full rounded-full border border-border-default bg-bg-elevated/35 focus:outline-none focus:ring-2 focus:ring-accent-primary/45 focus:border-accent-primary text-sm transition-all duration-300"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />
            </div>

            <div className="bg-bg-alt/40 dark:bg-bg-subtle/40 rounded-2xl p-4 border border-border-default/50">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-3">
                Suggested Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {["Luxury Villas", "Modern Apartments", "Commercial Spaces", "Beachfront Homes"].map(
                  (tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      className="rounded-full text-xs font-semibold border-border-default/60 bg-bg-surface/80 hover:bg-bg-elevated hover:text-text-primary hover:border-border-default text-text-secondary transition-all duration-200 px-4 py-1.5 h-auto cursor-pointer"
                      onClick={() => {
                        router.push(`/properties?q=${encodeURIComponent(tag)}`);
                        onClose();
                      }}
                    >
                      {tag}
                    </Button>
                  )
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                className="bg-accent-primary hover:bg-accent-primary-hov text-white rounded-full px-6 py-5 h-auto font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                onClick={handleSearchSubmit}
              >
                Search Properties
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Location Selector */}
        {activeTab === "location" && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <Search className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300",
                isFocused ? "text-accent-primary" : "text-text-muted"
              )} />
              <input
                type="text"
                placeholder="Search for a country..."
                className="pl-12 pr-4 h-12 w-full rounded-full border border-border-default bg-bg-elevated/35 focus:outline-none focus:ring-2 focus:ring-accent-primary/45 focus:border-accent-primary text-sm transition-all duration-300"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="max-h-[250px] overflow-y-auto pr-1.5 space-y-1 scrollbar-thin dark:scrollbar-thumb-bg-elevated divide-y divide-border-default/15">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 cursor-pointer group/item",
                      selectedCountry === country
                        ? "bg-accent-primary/10 text-accent-primary font-semibold border border-accent-primary/20"
                        : "hover:bg-bg-elevated/50 text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className={cn(
                        "h-4.5 w-4.5 transition-transform duration-200 group-hover/item:scale-110",
                        selectedCountry === country ? "text-accent-primary" : "text-text-muted"
                      )} />
                      <span className="font-medium tracking-wide">{country}</span>
                    </div>
                    {selectedCountry === country ? (
                      <span className="text-xs bg-accent-primary text-white px-2.5 py-0.5 rounded-full font-semibold">
                        Active
                      </span>
                    ) : (
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 text-text-muted transition-all duration-200" />
                    )}
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-text-muted bg-bg-alt/25 dark:bg-bg-subtle/25 rounded-2xl border border-dashed border-border-default/80">
                  <SearchCode className="h-10 w-10 mb-3 stroke-[1.2] text-text-muted/60" />
                  <p className="text-sm font-medium">No countries found for &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
