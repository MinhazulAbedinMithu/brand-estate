"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, ArrowRight, Building, ChevronDown } from "lucide-react";

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

  // Custom hover state for mega menu dropdowns
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Mobile accordion state for dropdown menu items
  const [mobileExpanded, setMobileExpanded] = React.useState<Record<string, boolean>>({});

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileExpand = (label: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center justify-center flex-1">
            <ul className="flex items-center space-x-1">
              {PUBLIC_NAV_LINKS.map((link) => {
                const isDropdown = link.type === "dropdown";
                const isCurrentlyActive =
                  pathname === link.href ||
                  (isDropdown &&
                    (link.columns?.some((col) =>
                      col.items.some((item) => pathname === item.href)
                    ) ||
                      link.items?.some((item) => pathname === item.href)));
                const isOpen = activeDropdown === link.label;

                return (
                  <li
                    key={link.label}
                    onMouseEnter={() => isDropdown && handleMouseEnter(link.label)}
                    onMouseLeave={isDropdown ? handleMouseLeave : undefined}
                    className="relative"
                  >
                    {isDropdown ? (
                      <button
                        onClick={() => {
                          setActiveDropdown(isOpen ? null : link.label);
                        }}
                        className={cn(
                          "relative px-2 lg:px-2.5 xl:px-4 py-2 text-xs xl:text-sm font-medium transition-all duration-200 rounded-full hover:bg-bg-elevated flex items-center gap-1 cursor-pointer",
                          isCurrentlyActive
                            ? "text-accent-primary font-semibold"
                            : "text-text-secondary hover:text-text-primary",
                          isOpen && "bg-bg-elevated text-text-primary"
                        )}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200 text-text-muted",
                            isOpen && "rotate-180 text-text-primary"
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={link.href || "#"}
                        className={cn(
                          "relative px-2 lg:px-2.5 xl:px-4 py-2 text-xs xl:text-sm font-medium transition-all duration-200 rounded-full hover:bg-bg-elevated block",
                          isCurrentlyActive
                            ? "text-accent-primary font-semibold"
                            : "text-text-secondary hover:text-text-primary"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}

                    {/* Simple Dropdown Overlay (Desktop) */}
                    {isDropdown && link.items && isOpen && (
                      <div
                        onMouseEnter={() => handleMouseEnter(link.label)}
                        onMouseLeave={handleMouseLeave}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-bg-surface/95 backdrop-blur-md border border-border-default/50 rounded-2xl shadow-2xl p-4 transition-all duration-300 animate-fade-in z-50"
                      >
                        <ul className="space-y-1">
                          {link.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <Link
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="group block rounded-xl p-2.5 hover:bg-bg-elevated transition-all duration-200"
                              >
                                <div className="text-xs font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                                  {item.label}
                                </div>
                                {item.description && (
                                  <p className="text-[10px] text-text-muted mt-0.5 group-hover:text-text-secondary transition-colors font-normal">
                                    {item.description}
                                  </p>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
            <div className="lg:hidden">
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

                <SheetContent side="right" className="bg-bg-surface border-l border-border-default p-5 sm:p-6 w-[85vw] sm:w-80 max-w-sm flex flex-col justify-between transition-all duration-300">
                  <div>
                    <SheetHeader className="p-0 border-b border-border-default/50 pb-4 mb-6">
                      <SheetTitle className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
                        <Building className="h-5 w-5 text-accent-primary" />
                        <span>{APP_NAME}</span>
                      </SheetTitle>
                    </SheetHeader>

                    {/* Navigation list */}
                    <nav aria-label="Mobile Navigation" className="mt-4 overflow-y-auto max-h-[60vh] pr-1">
                      <ul className="space-y-1">
                        {PUBLIC_NAV_LINKS.map((link) => {
                          const isDropdown = link.type === "dropdown";

                          if (isDropdown) {
                            const isExpanded = !!mobileExpanded[link.label];
                            return (
                              <li key={link.label} className="space-y-1">
                                <button
                                  onClick={() => toggleMobileExpand(link.label)}
                                  className={cn(
                                    "flex w-full items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 text-text-secondary hover:bg-bg-alt dark:hover:bg-bg-subtle hover:text-text-primary cursor-pointer",
                                    isExpanded && "bg-bg-elevated text-text-primary font-semibold"
                                  )}
                                >
                                  <span>{link.label}</span>
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 transition-transform duration-200 text-text-muted",
                                      isExpanded && "rotate-180 text-text-primary"
                                    )}
                                  />
                                </button>

                                {isExpanded && (
                                  <div className="pl-4 pr-1 py-1 space-y-4 border-l border-border-default/50 ml-4 mt-1 animate-slide-in-left">
                                    {link.columns?.map((column, colIdx) => (
                                      <div key={colIdx} className="space-y-1.5">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-2 py-0.5">
                                          {column.title}
                                        </div>
                                        {column.items.map((item, itemIdx) => {
                                          const isSubActive = pathname === item.href;
                                          return (
                                            <Link
                                              key={itemIdx}
                                              href={item.href}
                                              onClick={() => setMobileMenuOpen(false)}
                                              className={cn(
                                                "block px-3 py-2 rounded-full text-xs font-medium transition-all duration-200",
                                                isSubActive
                                                  ? "bg-accent-primary-dim text-accent-primary font-semibold"
                                                  : "text-text-secondary hover:bg-bg-alt dark:hover:bg-bg-subtle hover:text-text-primary"
                                              )}
                                            >
                                              <div className="font-semibold">{item.label}</div>
                                              {item.description && (
                                                <div className="text-[10px] text-text-muted font-normal mt-0.5">
                                                  {item.description}
                                                </div>
                                              )}
                                            </Link>
                                          );
                                        })}
                                      </div>
                                    ))}

                                    {link.items?.map((item, itemIdx) => {
                                      const isSubActive = pathname === item.href;
                                      return (
                                        <Link
                                          key={itemIdx}
                                          href={item.href}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className={cn(
                                            "block px-3 py-2 rounded-full text-xs font-medium transition-all duration-200",
                                            isSubActive
                                              ? "bg-accent-primary-dim text-accent-primary font-semibold"
                                              : "text-text-secondary hover:bg-bg-alt dark:hover:bg-bg-subtle hover:text-text-primary"
                                          )}
                                        >
                                          <div className="font-semibold">{item.label}</div>
                                          {item.description && (
                                            <div className="text-[10px] text-text-muted font-normal mt-0.5">
                                              {item.description}
                                            </div>
                                          )}
                                        </Link>
                                      );
                                    })}

                                    {link.promo && (
                                      <div className="bg-bg-elevated/50 dark:bg-bg-subtle/40 rounded-2xl p-4 border border-border-default/30 space-y-2 mt-2">
                                        <div className="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold bg-accent-primary-dim text-accent-primary uppercase tracking-wider">
                                          {link.promo.tag}
                                        </div>
                                        <div className="text-xs font-bold text-text-primary">
                                          {link.promo.title}
                                        </div>
                                        <p className="text-[10px] text-text-muted leading-relaxed">
                                          {link.promo.description}
                                        </p>
                                        <Link
                                          href={link.promo.ctaHref}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent-primary hover:underline pt-1"
                                        >
                                          <span>{link.promo.ctaText}</span>
                                          <ArrowRight className="h-3 w-3" />
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </li>
                            );
                          }

                          const isActive = pathname === link.href;
                          return (
                            <li key={link.label}>
                              <Link
                                href={link.href || "#"}
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

      {/* Mega Menu Overlay (Desktop) */}
      {PUBLIC_NAV_LINKS.map((link) => {
        if (link.type !== "dropdown" || activeDropdown !== link.label || !link.columns) return null;

        return (
          <div
            key={link.label}
            onMouseEnter={() => handleMouseEnter(link.label)}
            onMouseLeave={handleMouseLeave}
            className="absolute top-full left-0 right-0 w-full bg-bg-surface/95 backdrop-blur-md border-b border-border-default/50 shadow-2xl transition-all duration-300 animate-fade-in z-40"
          >
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* 3 Columns of Links */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {link.columns?.map((column, colIdx) => (
                    <div key={colIdx} className="space-y-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted font-body">
                        {column.title}
                      </h4>
                      <ul className="space-y-2">
                        {column.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="group block rounded-xl p-2.5 -mx-2.5 hover:bg-bg-elevated transition-all duration-200"
                            >
                              <div className="text-xs font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                                {item.label}
                              </div>
                              {item.description && (
                                <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1 group-hover:text-text-secondary transition-colors">
                                  {item.description}
                                </p>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Right Side Promo Card */}
                {link.promo && (
                  <div className="bg-bg-elevated/60 dark:bg-bg-subtle/50 rounded-2xl p-6 border border-border-default/30 flex flex-col justify-between relative overflow-hidden group">
                    <div className="space-y-2 relative z-10">
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold bg-accent-primary-dim text-accent-primary uppercase tracking-wider">
                        {link.promo.tag}
                      </div>
                      <h4 className="text-sm font-bold text-text-primary font-heading">
                        {link.promo.title}
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {link.promo.description}
                      </p>
                    </div>
                    <div className="mt-6 relative z-10">
                      <Link
                        href={link.promo.ctaHref}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Button className="w-full rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov text-xs font-semibold shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2">
                          <span>{link.promo.ctaText}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                    {/* Subtle decorative background glow */}
                    <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-accent-primary/5 blur-2xl group-hover:bg-accent-primary/10 transition-all duration-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

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
