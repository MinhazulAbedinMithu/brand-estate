"use client";

import * as React from "react";
import Link from "next/link";
import { Building, Plus, Edit2, Archive, Trash2, ArrowUpRight, Search, MapPin, GitCompare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import type { MockProperty } from "@/src/mocks/propertyTypes";

export function ListingsClient() {
  const { currentUser } = useAuth();
  const [listings, setListings] = React.useState<MockProperty[]>([]);
  const [loadingListings, setLoadingListings] = React.useState(true);
  const [filterTab, setFilterTab] = React.useState<"all" | "active" | "draft" | "archived">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (!currentUser) return;
    
    let active = true;
    const currentUserId = currentUser.id;
    async function fetchListings() {
      try {
        setLoadingListings(true);
        const response = await fetch(`/api/properties?ownerId=${currentUserId}&status=all&limit=100`);
        const result = await response.json();
        if (active && result.status === 'success') {
          setListings(result.data || []);
        }
      } catch (err) {
        console.error("Failed to load agent listings:", err);
      } finally {
        if (active) setLoadingListings(false);
      }
    }
    
    fetchListings();
    return () => { active = false; };
  }, [currentUser]);

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

  const stats = React.useMemo(() => {
    return {
      total: listings.length,
      active: listings.filter((l) => l.status === "active").length,
      draft: listings.filter((l) => l.status === "draft" || l.status === "pending_approval").length,
      archived: listings.filter((l) => l.status === "sold" || l.status === "rented").length,
    };
  }, [listings]);

  if (currentUser && currentUser.role === "owner" && currentUser.status !== "active") {
    return (
      <div className="max-w-xl mx-auto py-12 px-6 rounded-2xl border border-border-default bg-bg-surface text-center space-y-6 my-8 shadow-sm">
        <div className="h-16 w-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <Building className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold font-heading text-text-primary">Listing Capabilities Locked</h1>
          <p className="text-sm text-text-secondary font-medium leading-relaxed">
            {currentUser.status === "unsubmitted"
              ? "You must submit your legal documents and verify your credentials before you can manage property listings on the platform."
              : "Your legal documents have been submitted and are currently pending administrator review. You will be notified once approved."}
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          {currentUser.status === "unsubmitted" ? (
            <Button render={<Link href="/owner/submit-docs" />} className="bg-accent-primary text-white hover:bg-accent-primary-hov rounded-full px-6 h-10 font-bold cursor-pointer">
              Submit Legal Documents
            </Button>
          ) : (
            <Button render={<Link href="/owner/dashboard" />} variant="outline" className="border-border-default text-text-secondary rounded-full px-6 h-10 font-bold cursor-pointer">
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>
    );
  }

  const handleArchive = async (id: string, title: string) => {
    try {
      const propToArchive = listings.find(l => l.id === id);
      if (!propToArchive) return;
      const targetStatus = propToArchive.transactionType === "buy" ? "sold" : "rented";

      const response = await fetch(`/api/properties/${id}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus })
      });
      const result = await response.json();

      if (result.status === "success") {
        setListings((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              return { ...item, status: targetStatus };
            }
            return item;
          })
        );
        toast.success("Listing archived", { description: `"${title}" has been marked as ${targetStatus}.` });
      } else {
        toast.error("Failed to archive listing", { description: result.message || "Request failed." });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error", { description: "An unexpected network error occurred." });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE"
      });
      const result = await response.json();

      if (result.status === "success") {
        setListings((prev) => prev.filter((item) => item.id !== id));
        toast.success("Listing removed", { description: `"${title}" was deleted successfully.` });
      } else {
        toast.error("Failed to delete listing", { description: result.message || "Request failed." });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error", { description: "An unexpected network error occurred." });
    }
  };

  return (
    <div className="space-y-6 relative pb-20">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <Building className="h-5 w-5 text-accent-primary" />
            My Listings
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">Manage and monitor all your listed property entries</p>
        </div>
        <Button render={<Link href="/owner/listings/new" />} className="h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-5">
          <span className="flex items-center gap-1.5"><Plus className="h-4 w-4" /> Create New Listing</span>
        </Button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Properties", value: stats.total },
          { label: "Active Listings", value: stats.active, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Drafts / Pending", value: stats.draft, color: "text-amber-600 dark:text-amber-400" },
          { label: "Archived Listings", value: stats.archived, color: "text-text-secondary" },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-border-default/60 bg-bg-surface text-center shadow-xs">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">{item.label}</span>
            <span className={cn("text-xl font-extrabold font-heading mt-1 block", item.color || "text-text-primary")}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <Input
            placeholder="Search listings by title or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 border-border-default bg-bg-surface text-text-primary placeholder:text-text-faint focus:ring-accent-primary text-sm rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-1 bg-bg-alt border border-border-default/80 p-1 rounded-xl">
          {(["all", "active", "draft", "archived"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all select-none cursor-pointer",
                filterTab === tab ? "bg-accent-primary text-white" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tab === "draft" ? "Drafts" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Listings Table ── */}
      {loadingListings ? (
        <div className="py-20 text-center font-body font-semibold text-text-muted">
          Loading listings...
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border-default bg-bg-alt/20 p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center gap-4 mt-6 animate-fade-in shadow-xs">
          <div className="h-14 w-14 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted">
            <Building className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-base font-bold text-text-primary">No Properties Found</h3>
            <p className="text-xs text-text-muted max-w-xs font-semibold">
              You don&apos;t have any properties matching this filter criteria. Get started by publishing your first listing!
            </p>
          </div>
          <Button render={<Link href="/owner/listings/new" />} size="sm" className="h-9 rounded-full bg-accent-primary text-white font-bold px-5 mt-2 cursor-pointer">
            Create Listing Now
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border-default bg-bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-default bg-bg-alt/50 text-text-secondary font-extrabold uppercase select-none">
                  <th className="py-4 px-5">Property Details</th>
                  <th className="py-4 px-5">Financial Price</th>
                  <th className="py-4 px-5">Type / Category</th>
                  <th className="py-4 px-5">Listing Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/45 text-text-secondary font-medium">
                {filteredListings.map((prop) => {
                  const isRent = prop.transactionType === "rent" || prop.transactionType === "roommate_share";
                  const symbol = prop.currency === "USD" ? "$" : prop.currency + " ";
                  const formattedPrice = `${symbol}${prop.price.toLocaleString()}${isRent ? "/mo" : ""}`;

                  return (
                    <tr key={prop.id} className="hover:bg-bg-alt/10 transition-colors">
                      {/* Image + Title */}
                      <td className="py-4 px-5 max-w-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="h-11 w-11 rounded-lg object-cover border border-border-default shrink-0 shadow-xs"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-text-primary block truncate max-w-[200px] sm:max-w-xs">
                              {prop.title}
                            </span>
                            <div className="flex items-center flex-wrap gap-1.5 mt-1">
                              <span className="text-[10px] text-text-muted font-semibold flex items-center gap-1.5">
                                <MapPin className="h-3 w-3 text-accent-primary shrink-0" />
                                {prop.city}, {prop.state}
                              </span>
                              {prop.hasPendingUpdate && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 uppercase tracking-wider mt-0.5 sm:mt-0">
                                  <GitCompare className="h-2.5 w-2.5" /> Update Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-5 font-mono font-bold text-text-secondary">
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
                          prop.status === "active" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                          (prop.status === "sold" || prop.status === "rented") ? "text-text-muted bg-bg-alt border-border-default" :
                          "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                        )}>
                          {(prop.status === "sold" || prop.status === "rented") ? "archived" : prop.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button render={<Link href={`/owner/listings/${prop.id}/edit`} />} size="icon-sm" variant="ghost" className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg cursor-pointer">
                            <span className="flex items-center justify-center w-full h-full">
                              <Edit2 className="h-3.5 w-3.5" />
                            </span>
                          </Button>
                          {prop.status !== "sold" && prop.status !== "rented" && (
                            <Button
                              onClick={() => handleArchive(prop.id, prop.title)}
                              size="icon-sm"
                              variant="ghost"
                              className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg cursor-pointer"
                              title="Archive listing"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDelete(prop.id, prop.title)}
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg cursor-pointer"
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
        <Link href="/owner/listings/new">
          <button
            className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white hover:scale-105 active:scale-95 shadow-xl shadow-accent-primary/20 border border-white/10 transition-all group cursor-pointer"
            title="Create listing"
          >
            <Plus className="h-6 w-6 transition-transform group-hover:rotate-90 duration-300" />
          </button>
        </Link>
      </div>

    </div>
  );
}
