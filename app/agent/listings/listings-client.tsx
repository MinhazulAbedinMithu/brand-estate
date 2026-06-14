"use client";

import * as React from "react";
import Link from "next/link";
import { Building, Plus, Edit2, Archive, Trash2, ArrowUpRight, Search, MapPin } from "lucide-react";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ListingsClient() {
  const [listings, setListings] = React.useState(mockProperties.slice(0, 6));
  const [filterTab, setFilterTab] = React.useState<"all" | "active" | "draft" | "archived">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredListings = React.useMemo(() => {
    return listings.filter((item) => {
      // Role filter check
      let matchesTab = false;
      if (filterTab === "all") {
        matchesTab = true;
      } else if (filterTab === "active") {
        matchesTab = item.status === "active";
      } else if (filterTab === "draft") {
        matchesTab = item.status === "draft" || item.status === "pending_approval";
      } else if (filterTab === "archived") {
        matchesTab = item.status === "sold" || item.status === "rented";
      }
      
      // Search check
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  }, [listings, filterTab, searchQuery]);

  const handleArchive = (id: string, title: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const status = (item.transactionType === "buy" ? "sold" : "rented") as "sold" | "rented";
          return { ...item, status };
        }
        return item;
      })
    );
    toast.success("Listing archived", { description: `"${title}" has been moved to archives.` });
  };

  const handleDelete = (id: string, title: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    toast.success("Listing removed", { description: `"${title}" was deleted.` });
  };

  const stats = React.useMemo(() => {
    return {
      total: listings.length,
      active: listings.filter((l) => l.status === "active").length,
      draft: listings.filter((l) => l.status === "draft" || l.status === "pending_approval").length,
      archived: listings.filter((l) => l.status === "sold" || l.status === "rented").length,
    };
  }, [listings]);

  return (
    <div className="space-y-6 relative pb-20">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-accent-primary" />
            My Listings
          </h1>
          <p className="text-xs text-slate-500 font-medium font-body">Manage and monitor all your listed property entries</p>
        </div>
        <Button render={<Link href="/agent/listings/new" />} className="h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-5">
          <span className="flex items-center gap-1.5"><Plus className="h-4 w-4" /> Create New Listing</span>
        </Button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Properties", value: stats.total },
          { label: "Active Listings", value: stats.active, color: "text-emerald-400" },
          { label: "Drafts / Pending", value: stats.draft, color: "text-amber-400" },
          { label: "Archived Listings", value: stats.archived, color: "text-slate-400" },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-800/60 bg-[#0A101C] text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{item.label}</span>
            <span className={cn("text-xl font-extrabold font-heading mt-1 block", item.color || "text-white")}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search listings by title or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 border-slate-800 bg-[#0A101C] text-slate-200 placeholder:text-slate-500 focus:ring-accent-primary text-sm rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-1 bg-[#0F1829] border border-slate-800/80 p-1 rounded-xl">
          {(["all", "active", "draft", "archived"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all select-none",
                filterTab === tab ? "bg-accent-primary text-white" : "text-slate-400 hover:text-white"
              )}
            >
              {tab === "draft" ? "Drafts" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Listings Table ── */}
      {filteredListings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800/80 bg-[#0A101C]/40 p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center gap-4 mt-6 animate-fade-in">
          <div className="h-14 w-14 rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
            <Building className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-base font-bold text-white">No Properties Found</h3>
            <p className="text-xs text-slate-500 max-w-xs font-medium">
              You don&apos;t have any properties matching this filter criteria. Get started by publishing your first listing!
            </p>
          </div>
          <Button render={<Link href="/agent/listings/new" />} size="sm" className="h-9 rounded-full bg-accent-primary text-white font-bold px-5 mt-2">
            Create Listing Now
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/60 bg-[#0A101C] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#0F1829]/50 text-slate-400 font-extrabold uppercase select-none">
                  <th className="py-4 px-5">Property Details</th>
                  <th className="py-4 px-5">Financial Price</th>
                  <th className="py-4 px-5">Type / Category</th>
                  <th className="py-4 px-5">Listing Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {filteredListings.map((prop) => {
                  const isRent = prop.transactionType === "rent" || prop.transactionType === "roommate_share";
                  const symbol = prop.currency === "USD" ? "$" : prop.currency + " ";
                  const formattedPrice = `${symbol}${prop.price.toLocaleString()}${isRent ? "/mo" : ""}`;

                  return (
                    <tr key={prop.id} className="hover:bg-[#0F1829]/20 transition-colors">
                      {/* Image + Title */}
                      <td className="py-4 px-5 max-w-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="h-11 w-11 rounded-lg object-cover border border-slate-850 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate max-w-[200px] sm:max-w-xs">
                              {prop.title}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1.5 mt-1">
                              <MapPin className="h-3 w-3 text-accent-primary shrink-0" />
                              {prop.city}, {prop.state}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-5 font-mono font-bold text-slate-200">
                        {formattedPrice}
                      </td>

                      {/* Property type */}
                      <td className="py-4 px-5 capitalize">
                        {prop.propertyCategory.replace("_", " ")}
                      </td>

                      {/* Status Badges */}
                      <td className="py-4 px-5">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border tracking-wider",
                          prop.status === "active" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                          (prop.status === "sold" || prop.status === "rented") ? "text-slate-400 bg-slate-500/10 border-slate-500/20" :
                          "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        )}>
                          {(prop.status === "sold" || prop.status === "rented") ? "archived" : prop.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button render={<Link href={`/agent/listings/${prop.id}/edit`} />} size="icon-sm" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                            <span className="flex items-center justify-center w-full h-full">
                              <Edit2 className="h-3.5 w-3.5" />
                            </span>
                          </Button>
                          {prop.status !== "sold" && prop.status !== "rented" && (
                            <Button
                              onClick={() => handleArchive(prop.id, prop.title)}
                              size="icon-sm"
                              variant="ghost"
                              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                              title="Archive listing"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDelete(prop.id, prop.title)}
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg"
                            title="Delete listing"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Action Shortcut Button */}
      <div className="fixed bottom-6 right-6 z-40 lg:bottom-8 lg:right-8">
        <Link href="/agent/listings/new">
          <button
            className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white hover:scale-105 active:scale-95 shadow-xl shadow-accent-primary/20 border border-white/10 transition-all group"
            title="Create listing"
          >
            <Plus className="h-6 w-6 transition-transform group-hover:rotate-90 duration-300" />
          </button>
        </Link>
      </div>

    </div>
  );
}
