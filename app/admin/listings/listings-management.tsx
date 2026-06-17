"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, Search, SlidersHorizontal, Check, X, ShieldCheck, ShieldAlert, FileText, MapPin, Eye, Trash2, ArrowUpRight } from "lucide-react";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock database adding status discriminators for Admin Listing workspace
const initialListings = [
  ...mockProperties.slice(0, 3).map(p => ({ ...p, status: "active" as const })),
  ...mockProperties.slice(3, 6).map(p => ({ ...p, status: "pending_approval" as const })),
  ...mockProperties.slice(6, 8).map(p => ({ ...p, status: "rejected" as const })),
];

export function ListingsManagementClient() {
  const [listings, setListings] = React.useState(initialListings);
  const [tab, setTab] = React.useState<"pending_approval" | "active" | "rejected" | "all">("pending_approval");
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [inspectedProp, setInspectedProp] = React.useState<typeof initialListings[0] | null>(null);

  const filteredListings = React.useMemo(() => {
    return listings.filter((item) => {
      const matchesTab = tab === "all" || item.status === tab;
      
      const q = search.toLowerCase().trim();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.listerProfile.name.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [listings, tab, search]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredListings.map(l => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const approveListing = (id: string, title: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "active" } : l));
    if (inspectedProp?.id === id) setInspectedProp(null);
    toast.success("Listing Approved", { description: `"${title}" has been published.` });
  };

  const rejectListing = (id: string, title: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "rejected" } : l));
    if (inspectedProp?.id === id) setInspectedProp(null);
    toast.error("Listing Rejected", { description: `"${title}" was rejected.` });
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    setListings(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, status: "active" } : l));
    setSelectedIds([]);
    toast.success("Bulk approvals complete", { description: `Approved ${selectedIds.length} listings.` });
  };

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return;
    setListings(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, status: "rejected" } : l));
    setSelectedIds([]);
    toast.error("Bulk rejections complete", { description: `Rejected ${selectedIds.length} listings.` });
  };

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ─      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <Building2 className="h-5 w-5 text-accent-primary" />
            Manage Listings
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">Supervise property submission queue, verify details and approve listings</p>
        </div>
        <div className="text-xs font-bold bg-bg-alt border border-border-default px-3.5 py-1.5 rounded-full text-text-secondary select-none">
          Queue Length: <span className="text-text-primary">{listings.filter(l => l.status === "pending_approval").length} pending</span>
        </div>
      </div>

      {/* ── Toolbar: Search & Tab filters ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by title, city or lister..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-border-default bg-bg-surface text-sm text-text-primary placeholder:text-text-muted focus:ring-accent-primary rounded-xl"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-bg-alt border border-border-default p-0.5 rounded-xl">
            {(["pending_approval", "active", "rejected", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSelectedIds([]); }}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all select-none cursor-pointer",
                  tab === t ? "bg-accent-primary text-white" : "text-text-muted hover:text-text-primary"
                )}
              >
                {t === "pending_approval" ? "Pending Approval" : t}
              </button>
            ))}
          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={handleBulkReject}
                size="sm"
                variant="outline"
                className="h-10 rounded-xl border-rose-600/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-bold px-4"
              >
                Reject ({selectedIds.length})
              </Button>
              <Button
                onClick={handleBulkApprove}
                size="sm"
                className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4"
              >
                Approve ({selectedIds.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Table Grid ── */}
      {filteredListings.length === 0 ? (
        <div className="py-12 text-center text-text-muted text-xs font-bold">
          No listings found matching this status queue.
        </div>
      ) : (
        <div className="rounded-2xl border border-border-default bg-bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-default bg-bg-alt/50 text-text-secondary font-extrabold uppercase select-none">
                  <th className="py-4 px-5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={filteredListings.length > 0 && selectedIds.length === filteredListings.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-border-default bg-bg-base"
                    />
                  </th>
                  <th className="py-4 px-5">Listing Details</th>
                  <th className="py-4 px-5">Lister Profile</th>
                  <th className="py-4 px-5">Price</th>
                  <th className="py-4 px-5">Status Badge</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default text-text-secondary font-medium">
                {filteredListings.map((prop) => {
                  const isRent = prop.transactionType === "rent" || prop.transactionType === "roommate_share";
                  const symbol = prop.currency === "USD" ? "$" : prop.currency + " ";
                  const formattedPrice = `${symbol}${prop.price.toLocaleString()}${isRent ? "/mo" : ""}`;

                  return (
                    <tr key={prop.id} className="hover:bg-bg-alt/25 transition-colors">
                      <td className="py-4 px-5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(prop.id)}
                          onChange={(e) => handleSelectOne(prop.id, e.target.checked)}
                          className="rounded border-border-default bg-bg-base"
                        />
                      </td>

                      {/* Image + Title */}
                      <td className="py-4 px-5 max-w-sm cursor-pointer" onClick={() => setInspectedProp(prop)}>
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="h-10 w-10 rounded-lg object-cover border border-border-default shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-text-primary block truncate max-w-[150px] sm:max-w-xs hover:text-accent-primary transition-colors">
                              {prop.title}
                            </span>
                            <span className="text-[10px] text-text-muted font-semibold flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-accent-primary shrink-0" />
                              {prop.city}, {prop.state}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Lister */}
                      <td className="py-4 px-5 text-text-secondary">
                        {prop.listerProfile.name}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-5 font-mono font-bold text-text-primary">
                        {formattedPrice}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border tracking-wider",
                          prop.status === "active" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                          prop.status === "rejected" ? "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" :
                          "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                        )}>
                          {prop.status === "pending_approval" ? "pending" : prop.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => setInspectedProp(prop)}
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg cursor-pointer"
                            title="Inspect details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {prop.status !== "active" && (
                            <Button
                              onClick={() => approveListing(prop.id, prop.title)}
                              size="icon-sm"
                              className="h-8 w-8 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white rounded-lg flex items-center justify-center border border-emerald-500/25 hover:border-transparent transition-all cursor-pointer"
                              title="Approve listing"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {prop.status !== "rejected" && (
                            <Button
                              onClick={() => rejectListing(prop.id, prop.title)}
                              size="icon-sm"
                              className="h-8 w-8 bg-rose-500/15 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white rounded-lg flex items-center justify-center border border-rose-500/25 hover:border-transparent transition-all cursor-pointer"
                              title="Reject listing"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
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

      {/* ── Slide-over properties inspector drawer ── */}
      <Sheet open={!!inspectedProp} onOpenChange={(open) => !open && setInspectedProp(null)}>
        <SheetContent className="w-full sm:max-w-md bg-bg-surface border-l border-border-default text-text-primary flex flex-col justify-between p-6">
          <SheetHeader className="pb-4 border-b border-border-default">
            <SheetTitle className="text-text-primary text-left font-heading text-lg font-bold">Property Verification</SheetTitle>
            <SheetDescription className="text-left text-text-muted text-xs mt-0.5">
              Review transaction structures, pricing, and structural specifications.
            </SheetDescription>
          </SheetHeader>

          {inspectedProp && (
            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1 custom-scrollbar">
              
              {/* Cover preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border-default bg-bg-alt shrink-0 shadow-inner select-none">
                <img src={inspectedProp.images[0]} alt="Verify" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-bg-base to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-accent-primary text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase font-body tracking-wider">
                    {inspectedProp.propertyCategory}
                  </span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="space-y-1">
                <span className="text-lg font-extrabold text-accent-primary font-mono block">
                  {inspectedProp.currency === "USD" ? "$" : inspectedProp.currency + " "}{inspectedProp.price.toLocaleString()}
                </span>
                <h4 className="text-sm font-bold text-text-primary leading-snug">{inspectedProp.title}</h4>
                <p className="text-xs text-text-muted flex items-center gap-1 font-semibold truncate pt-1">
                  <MapPin className="h-3.5 w-3.5 text-accent-primary shrink-0" />
                  {inspectedProp.formattedAddress}
                </p>
              </div>

              {/* Lister metadata */}
              <div className="p-3.5 rounded-xl bg-bg-alt border border-border-default space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Agent Submitter</span>
                <div className="text-xs font-bold text-text-primary mt-1.5">{inspectedProp.listerProfile.name}</div>
                <div className="text-[10px] text-text-muted">{inspectedProp.listerProfile.agencyName}</div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-accent-primary" /> Listing Description
                </span>
                <p className="text-xs text-text-secondary leading-relaxed font-body line-clamp-4">{inspectedProp.description}</p>
              </div>

            </div>
          )}

          {/* Action buttons */}
          <div className="border-t border-border-default pt-4 flex gap-3 mt-4">
            {inspectedProp && inspectedProp.status !== "rejected" && (
              <Button
                onClick={() => rejectListing(inspectedProp.id, inspectedProp.title)}
                variant="outline"
                className="flex-1 h-10 rounded-xl border-rose-600/30 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 font-bold cursor-pointer"
              >
                Reject Listing
              </Button>
            )}
            {inspectedProp && inspectedProp.status !== "active" && (
              <Button
                onClick={() => approveListing(inspectedProp.id, inspectedProp.title)}
                className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
              >
                Approve Listing
              </Button>
            )}
            {inspectedProp && inspectedProp.status === "active" && (
              <Button
                onClick={() => setInspectedProp(null)}
                className="flex-1 h-10 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white font-bold cursor-pointer"
              >
                Close Verification
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}
