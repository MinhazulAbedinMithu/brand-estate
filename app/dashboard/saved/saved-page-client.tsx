"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Heart, SlidersHorizontal, MapPin, Ruler, Bed, Bath, ArrowUpRight, ArrowRight, Trash2 } from "lucide-react";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SavedPageClient() {
  const [properties, setProperties] = React.useState(mockProperties.slice(0, 5));
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("latest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 3;

  // Filter properties
  const filteredProperties = React.useMemo(() => {
    let result = [...properties];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q)
      );
    }

    // Sort properties
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "size-desc") {
      result.sort((a, b) => b.squareFeet - a.squareFeet);
    }

    return result;
  }, [properties, search, sortBy]);

  // Paginated list
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const handleRemove = (id: string, title: string) => {
    const itemToRemove = properties.find(p => p.id === id);
    setProperties(prev => prev.filter(p => p.id !== id));
    
    // Reset page if needed
    if (currentPage > 1 && paginatedProperties.length === 1) {
      setCurrentPage(prev => prev - 1);
    }

    toast.success("Property removed", {
      description: `"${title}" has been deleted from your saved listings.`,
      action: itemToRemove ? {
        label: "Undo",
        onClick: () => {
          setProperties(prev => [...prev, itemToRemove]);
          toast.success("Restored property to saved list");
        }
      } : undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            Saved Properties
          </h1>
          <p className="text-xs text-text-muted font-medium">Monitor pricing updates and view features for your favorited homes</p>
        </div>
        <div className="text-xs font-bold bg-bg-alt border border-border-default px-3.5 py-1.5 rounded-full text-text-muted select-none">
          Total Favorites: <span className="text-text-primary">{properties.length}</span>
        </div>
      </div>

      {/* ── Filter & Search Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by title, city or state..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-9 h-10 rounded-xl border-border-default bg-bg-surface text-sm text-text-primary placeholder:text-text-muted focus:ring-accent-primary focus:bg-bg-base transition-all"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 text-xs font-bold text-text-primary bg-bg-surface border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-accent-primary"
          >
            <option value="latest">Recently Saved</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="size-desc">Size: Largest Area</option>
          </select>
        </div>
      </div>

      {/* ── Grid/List Display ── */}
      {paginatedProperties.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border-default bg-bg-surface/40 p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center gap-4 mt-8">
          <div className="h-14 w-14 rounded-full bg-bg-alt flex items-center justify-center text-text-muted">
            <Heart className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-base font-bold text-text-primary">No Saved Properties</h3>
            <p className="text-xs text-text-muted max-w-xs font-medium">
              You haven&apos;t favorited any property listings yet. Browse listings to save your favorites!
            </p>
          </div>
          <Button render={<Link href="/properties" />} size="sm" className="h-9 rounded-full bg-accent-primary text-white font-bold px-5 mt-2">
            Browse Properties
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProperties.map((property) => {
              const isRent = property.transactionType === "rent" || property.transactionType === "roommate_share";
              const symbol = property.currency === "USD" ? "$" : property.currency + " ";
              const price = `${symbol}${property.price.toLocaleString()}${isRent ? "/mo" : ""}`;

              return (
                <div
                  key={property.id}
                  className="group flex flex-col bg-bg-surface border border-border-default/60 rounded-2xl overflow-hidden hover:border-border-subtle transition-all duration-300 hover:shadow-xl hover:shadow-accent-primary/2"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-bg-alt shrink-0">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-bg-base to-transparent pointer-events-none" />
                    <button
                      onClick={() => handleRemove(property.id, property.title)}
                      className="absolute top-3 right-3 h-8.5 w-8.5 rounded-full bg-bg-base/80 backdrop-blur-sm border border-border-default text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 flex items-center justify-center shadow transition-all duration-200"
                      aria-label="Remove property"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-accent-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {property.propertyCategory}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <span className="text-lg font-extrabold text-accent-primary tracking-tight">
                        {price}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-text-primary truncate group-hover:text-accent-primary transition-colors leading-snug">
                        {property.title}
                      </h3>
                      <p className="text-xs text-text-muted flex items-center gap-1 font-semibold truncate pt-1">
                        <MapPin className="h-3.5 w-3.5 text-accent-primary shrink-0" />
                        {property.city}, {property.state}
                      </p>
                    </div>

                    <div className="flex items-center justify-between bg-bg-base border border-border-default/60 p-2.5 rounded-xl text-xs text-text-secondary select-none">
                      {property.propertyCategory !== "commercial" ? (
                        <>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Bed className="h-3.5 w-3.5 text-accent-primary/80" />
                            <span className="font-bold text-text-primary">{property.bedrooms}</span> Bed
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Bath className="h-3.5 w-3.5 text-accent-primary/80" />
                            <span className="font-bold text-text-primary">{property.bathrooms}</span> Bath
                          </span>
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
                          <span className="text-text-muted font-bold capitalize truncate">
                            Commercial
                          </span>
                        </>
                      )}
                    </div>

                    <div className="border-t border-border-default/60 pt-3 flex items-center justify-between mt-1">
                      <span className="text-[10px] font-semibold text-text-muted">
                        Added 3 days ago
                      </span>
                      <Link
                        href={`/property/${property.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:text-text-primary transition-colors"
                      >
                        View Property <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-9 px-3 rounded-lg border-border-default text-text-secondary hover:bg-bg-elevated"
              >
                Previous
              </Button>
              <div className="text-xs font-semibold text-text-muted px-3 select-none">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-9 px-3 rounded-lg border-border-default text-text-secondary hover:bg-bg-elevated"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
