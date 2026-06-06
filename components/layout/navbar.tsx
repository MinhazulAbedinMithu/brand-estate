"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, ArrowRight, Building } from "lucide-react";

import { cn } from "@/lib/utils";
import { PUBLIC_NAV_LINKS, APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { LocationSelector } from "./location-selector";
import { SearchModal } from "@/components/shared/search-modal";

export function Navbar() {
  const pathname = usePathname();
  
  // Geolocation & Search Modal state
  const [location, setLocation] = React.useState("");
  const [isGeoLoading, setIsGeoLoading] = React.useState(true);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchDefaultTab, setSearchDefaultTab] = React.useState<"search" | "location">("search");
  
  // Mobile sheet open state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Geolocation effect
  React.useEffect(() => {
    let active = true;
    fetch("https://ipapi.co/json/")
      .then((res) => {
        if (!res.ok) throw new Error("Geolocation failed");
        return res.json();
      })
      .then((data) => {
        if (active && data.country_name) {
          setLocation(data.country_name);
        }
      })
      .catch(() => {
        if (active) setLocation("United States");
      })
      .finally(() => {
        if (active) setIsGeoLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openSearch = () => {
    setSearchDefaultTab("search");
    setIsSearchOpen(true);
  };

  const openLocation = () => {
    setSearchDefaultTab("location");
    setIsSearchOpen(true);
  };

  const handleSelectCountry = (country: string) => {
    setLocation(country);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-default/50 bg-bg-base/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Building className="h-5 w-5 text-accent-primary shrink-0" />
              <span>{APP_NAME}</span>
            </Link>
          </div>

          {/* Middle: Navigation Links (Desktop) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex items-center space-x-1">
              {PUBLIC_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full hover:bg-bg-elevated",
                        isActive
                          ? "text-accent-primary font-semibold"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: Actions Group */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Search Icon Button */}
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={openSearch}
              className="h-9 w-9 rounded-full border border-border-default/50 hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all duration-200"
              aria-label="Search properties"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Location Selector */}
            <LocationSelector
              currentLocation={location}
              isLoading={isGeoLoading}
              onClick={openLocation}
            />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/register">
                <Button
                  variant="outline"
                  className="rounded-full h-9 px-4 font-semibold border-border-default/80 hover:bg-bg-elevated hover:text-text-primary text-text-secondary text-xs transition-all duration-200"
                >
                  Join
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  className="rounded-full h-9 px-4 font-semibold bg-accent-primary text-white hover:bg-accent-primary-hov text-xs shadow-sm hover:shadow transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Mobile Navigation Trigger (Hamburger Menu) */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger render={
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="h-9 w-9 rounded-full border border-border-default/50 hover:bg-bg-elevated text-text-secondary hover:text-text-primary"
                    aria-label="Open mobile menu"
                  />
                }>
                  <Menu className="h-[1.1rem] w-[1.1rem]" />
                </SheetTrigger>
                
                <SheetContent side="right" className="bg-bg-surface border-l border-border-default p-6 w-80 max-w-sm flex flex-col justify-between transition-all duration-300">
                  <div>
                    <SheetHeader className="p-0 border-b border-border-default/50 pb-4 mb-6">
                      <SheetTitle className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
                        <Building className="h-5 w-5 text-accent-primary" />
                        <span>{APP_NAME}</span>
                      </SheetTitle>
                    </SheetHeader>

                    {/* Navigation list */}
                    <nav aria-label="Mobile Navigation" className="mt-4">
                      <ul className="space-y-1">
                        {PUBLIC_NAV_LINKS.map((link) => {
                          const isActive = pathname === link.href;
                          return (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  "block w-full px-4 py-3 rounded-full text-sm font-medium transition-all duration-200",
                                  isActive
                                    ? "bg-accent-primary-dim text-accent-primary font-semibold"
                                    : "text-text-secondary hover:bg-bg-alt dark:hover:bg-bg-subtle hover:text-text-primary"
                                )}
                              >
                                {link.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>

                  {/* Auth Actions Group (Mobile Bottom) */}
                  <div className="border-t border-border-default/50 pt-6 mt-auto space-y-3">
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                      <Button
                        variant="outline"
                        className="w-full rounded-full h-11 font-semibold border-border-default hover:bg-bg-elevated text-text-secondary text-sm"
                      >
                        Join Now
                      </Button>
                    </Link>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                      <Button
                        className="w-full rounded-full h-11 font-semibold bg-accent-primary text-white hover:bg-accent-primary-hov text-sm shadow-sm"
                      >
                        Sign In
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>

        </div>
      </div>

      {/* Global Unified Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        defaultTab={searchDefaultTab}
        selectedCountry={location}
        onSelectCountry={handleSelectCountry}
      />
    </header>
  );
}
