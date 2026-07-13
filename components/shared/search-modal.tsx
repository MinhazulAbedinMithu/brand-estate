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
import { COUNTRIES, COUNTRY_CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "search" | "location";
  currentLocation?: string;
  onSelectLocation: (city: string, country: string) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  defaultTab = "search",
  currentLocation,
  onSelectLocation,
}: SearchModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"search" | "location">(defaultTab);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  const [cityInput, setCityInput] = React.useState("");
  const [countryInput, setCountryInput] = React.useState("");
  const [countrySearchQuery, setCountrySearchQuery] = React.useState("");
  const [citySearchQuery, setCitySearchQuery] = React.useState("");
  const [isCityFocused, setIsCityFocused] = React.useState(false);
  const [isCountrySearchFocused, setIsCountrySearchFocused] = React.useState(false);

  // Keep internal activeTab in sync with prop defaultTab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setActiveTab(defaultTab);
        setSearchQuery("");
        setCountrySearchQuery("");
        setCitySearchQuery("");

        // Parse currentLocation e.g. "Mumbai, India"
        const parts = (currentLocation || "").split(", ");
        if (parts.length >= 2) {
          setCityInput(parts[0]);
          setCitySearchQuery(parts[0]);
          setCountryInput(parts[1]);
        } else {
          setCityInput("");
          setCitySearchQuery("");
          setCountryInput(currentLocation || "");
        }
      }, 0);
    }
  }, [isOpen, defaultTab, currentLocation]);

  const filteredCountries = React.useMemo(() => {
    return COUNTRIES.filter((country) =>
      country.toLowerCase().includes(countrySearchQuery.toLowerCase())
    );
  }, [countrySearchQuery]);

  const citiesForSelectedCountry = React.useMemo(() => {
    if (!countryInput) return [];
    return COUNTRY_CITIES[countryInput] || [];
  }, [countryInput]);

  const filteredCities = React.useMemo(() => {
    if (!citySearchQuery) return citiesForSelectedCountry;
    return citiesForSelectedCountry.filter((city) =>
      city.toLowerCase().includes(citySearchQuery.toLowerCase())
    );
  }, [citiesForSelectedCountry, citySearchQuery]);

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
          <div className="space-y-4 animate-fade-in text-left">
            {/* Step 1: Select Country if none selected */}
            {!countryInput ? (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-text-secondary">Select Country</label>
                <div className="relative">
                  <Search className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-300",
                    isCountrySearchFocused ? "text-accent-primary" : "text-text-muted"
                  )} />
                  <input
                    type="text"
                    placeholder="Search for a country..."
                    className="pl-11 pr-4 h-11 w-full rounded-full border border-border-default bg-bg-elevated/35 focus:outline-none focus:ring-2 focus:ring-accent-primary/45 focus:border-accent-primary text-sm transition-all duration-300"
                    value={countrySearchQuery}
                    onFocus={() => setIsCountrySearchFocused(true)}
                    onBlur={() => setIsCountrySearchFocused(false)}
                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                  />
                </div>

                <div className="max-h-[220px] overflow-y-auto pr-1.5 space-y-0.5 scrollbar-thin dark:scrollbar-thumb-bg-elevated border border-border-default/30 rounded-2xl p-2 bg-bg-alt/25 dark:bg-bg-subtle/25 divide-y divide-border-default/10">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => {
                          setCountryInput(country);
                          setCountrySearchQuery("");
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50 transition-all duration-200 cursor-pointer"
                      >
                        <span>{country}</span>
                      </button>
                    ))
                  ) : (
                    <div className="py-6 text-center text-text-muted text-xs">
                      No countries matched &quot;{countrySearchQuery}&quot;
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Step 2: Select City for selected country */
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-accent-primary/5 border border-accent-primary/20 rounded-2xl p-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4.5 w-4.5 text-accent-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-text-muted">Selected Country</p>
                      <p className="text-sm font-bold text-text-primary">{countryInput}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCountryInput("");
                      setCityInput("");
                      setCitySearchQuery("");
                    }}
                    className="text-xs font-semibold text-accent-primary hover:underline"
                  >
                    Change Country
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Search or Select City</label>
                  <div className="relative">
                    <Search className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-300",
                      isCityFocused ? "text-accent-primary" : "text-text-muted"
                    )} />
                    <input
                      type="text"
                      placeholder="Type a city name..."
                      className="pl-11 pr-4 h-11 w-full rounded-full border border-border-default bg-bg-elevated/35 focus:outline-none focus:ring-2 focus:ring-accent-primary/45 focus:border-accent-primary text-sm transition-all duration-300"
                      value={citySearchQuery}
                      onFocus={() => setIsCityFocused(true)}
                      onBlur={() => setIsCityFocused(false)}
                      onChange={(e) => {
                        setCitySearchQuery(e.target.value);
                        setCityInput(e.target.value); // Sync typed input to cityInput
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    Important Cities in {countryInput}
                  </span>
                  <div className="max-h-[140px] overflow-y-auto pr-1.5 space-y-0.5 scrollbar-thin dark:scrollbar-thumb-bg-elevated border border-border-default/30 rounded-2xl p-2 bg-bg-alt/25 dark:bg-bg-subtle/25 divide-y divide-border-default/10">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setCityInput(city);
                            setCitySearchQuery(city);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all duration-200 cursor-pointer group/item",
                            cityInput.toLowerCase() === city.toLowerCase()
                              ? "bg-accent-primary/10 text-accent-primary font-semibold border border-accent-primary/10"
                              : "hover:bg-bg-elevated/50 text-text-secondary hover:text-text-primary"
                          )}
                        >
                          <span>{city}</span>
                          {cityInput.toLowerCase() === city.toLowerCase() && (
                            <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="py-6 text-center text-text-muted text-xs">
                        No matches found. Press &quot;Set Location&quot; to use &quot;{citySearchQuery}&quot;
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full px-5 py-5 h-auto font-semibold border-border-default hover:bg-bg-elevated text-text-secondary cursor-pointer"
                    onClick={() => {
                      setCountryInput("");
                      setCityInput("");
                      setCitySearchQuery("");
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-accent-primary hover:bg-accent-primary-hov text-white rounded-full px-6 py-5 h-auto font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    disabled={!countryInput}
                    onClick={() => {
                      onSelectLocation(cityInput.trim(), countryInput);
                      onClose();
                    }}
                  >
                    Set Location
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
