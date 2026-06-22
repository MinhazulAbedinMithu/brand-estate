"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2, Search, Check, X, ShieldAlert, FileText,
  MapPin, Eye, Trash2, GitCompare, AlertCircle, CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { MockProperty } from "@/src/mocks/propertyTypes";

// ─── Types ──────────────────────────────────────────────────────────────────

type AdminTab = "pending_approval" | "active" | "rejected" | "update_reviews" | "all";

// Extend MockProperty with hasPendingUpdate / pendingUpdate from the DB
type ListingWithUpdate = MockProperty & {
  hasPendingUpdate?: boolean;
  pendingUpdate?: Record<string, unknown> & { submittedAt?: string };
};

// ─── Diff Helpers ────────────────────────────────────────────────────────────

const DIFFABLE_FIELDS: Array<{ key: string; label: string }> = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "price", label: "Price" },
  { key: "currency", label: "Currency" },
  { key: "formattedAddress", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zipCode", label: "ZIP Code" },
  { key: "squareFeet", label: "Square Feet" },
  { key: "bedrooms", label: "Bedrooms" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "yearBuilt", label: "Year Built" },
  { key: "neighborhoodNotes", label: "Neighborhood Notes" },
  { key: "videoTourUrl", label: "Video Tour URL" },
  { key: "virtualTourUrl", label: "Virtual Tour URL" },
  { key: "amenities", label: "Amenities" },
  { key: "images", label: "Images" },
];

function renderValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ListingsManagementClient() {
  const [listings, setListings] = React.useState<ListingWithUpdate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [tab, setTab] = React.useState<AdminTab>("pending_approval");
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [inspectedProp, setInspectedProp] = React.useState<ListingWithUpdate | null>(null);
  const [diffMode, setDiffMode] = React.useState(false);

  const fetchListings = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties?status=all&limit=100");
      const result = await response.json();
      if (result.status === "success") {
        setListings(result.data || []);
      }
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    Promise.resolve().then(() => {
      fetchListings();
    });
  }, [fetchListings]);

  const filteredListings = React.useMemo(() => {
    return listings.filter((item) => {
      let matchesTab: boolean;
      if (tab === "update_reviews") {
        matchesTab = !!item.hasPendingUpdate;
      } else if (tab === "all") {
        matchesTab = true;
      } else {
        matchesTab = item.status === tab;
      }

      const q = search.toLowerCase().trim();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.listerProfile.name.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [listings, tab, search]);

  const updateReviewCount = React.useMemo(
    () => listings.filter(l => l.hasPendingUpdate).length,
    [listings]
  );

  // ── Selection handlers ─────────────────────────────────────────────────────

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredListings.map(l => l.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(item => item !== id));
  };

  // ── Approve / Reject (new listings) ────────────────────────────────────────

  const approveListing = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" })
      });
      const result = await response.json();
      if (result.status === "success") {
        setListings(prev => prev.map(l => l.id === id ? { ...l, status: "active" } : l));
        if (inspectedProp?.id === id) setInspectedProp(null);
        toast.success("Listing Approved", { description: `"${title}" has been published.` });
      } else {
        toast.error("Failed to approve", { description: result.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error approving listing");
    }
  };

  const rejectListing = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      });
      const result = await response.json();
      if (result.status === "success") {
        setListings(prev => prev.map(l => l.id === id ? { ...l, status: "rejected" } : l));
        if (inspectedProp?.id === id) setInspectedProp(null);
        toast.error("Listing Rejected", { description: `"${title}" was rejected.` });
      } else {
        toast.error("Failed to reject", { description: result.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error rejecting listing");
    }
  };

  // ── Approve / Reject pending *updates* ────────────────────────────────────

  const approveUpdate = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/properties/${id}/approve-update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (result.status === "success") {
        setListings(prev => prev.map(l =>
          l.id === id ? { ...l, hasPendingUpdate: false, pendingUpdate: undefined } : l
        ));
        if (inspectedProp?.id === id) setInspectedProp(null);
        setDiffMode(false);
        toast.success("Update Approved", { description: `Changes to "${title}" are now live.` });
      } else {
        toast.error("Failed to approve update", { description: result.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error approving update");
    }
  };

  const rejectUpdate = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/properties/${id}/reject-update`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (result.status === "success") {
        setListings(prev => prev.map(l =>
          l.id === id ? { ...l, hasPendingUpdate: false, pendingUpdate: undefined } : l
        ));
        if (inspectedProp?.id === id) setInspectedProp(null);
        setDiffMode(false);
        toast.info("Update Rejected", { description: `The live listing "${title}" remains unchanged.` });
      } else {
        toast.error("Failed to reject update", { description: result.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error rejecting update");
    }
  };

  // ── Bulk actions ──────────────────────────────────────────────────────────

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    await Promise.all(selectedIds.map(id => {
      const listing = listings.find(l => l.id === id);
      return fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" })
      }).then(() => {
        setListings(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, status: "active" } : l));
        return listing;
      });
    }));
    setSelectedIds([]);
    toast.success("Bulk approvals complete", { description: `Approved ${selectedIds.length} listings.` });
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    await Promise.all(selectedIds.map(id =>
      fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      })
    ));
    setListings(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, status: "rejected" } : l));
    setSelectedIds([]);
    toast.error("Bulk rejections complete", { description: `Rejected ${selectedIds.length} listings.` });
  };

  // ── Tab definitions ────────────────────────────────────────────────────────

  const tabs: Array<{ value: AdminTab; label: string; count?: number }> = [
    { value: "pending_approval", label: "Pending Approval", count: listings.filter(l => l.status === "pending_approval").length },
    { value: "update_reviews", label: "Update Reviews", count: updateReviewCount },
    { value: "active", label: "Active" },
    { value: "rejected", label: "Rejected" },
    { value: "all", label: "All" },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <Building2 className="h-5 w-5 text-accent-primary" />
            Manage Listings
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">Supervise property submission queue, verify details and approve listings</p>
        </div>
        <div className="flex items-center gap-3">
          {updateReviewCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-full text-amber-600 dark:text-amber-400 animate-pulse">
              <AlertCircle className="h-3.5 w-3.5" />
              {updateReviewCount} update{updateReviewCount !== 1 ? "s" : ""} pending review
            </div>
          )}
          <div className="text-xs font-bold bg-bg-alt border border-border-default px-3.5 py-1.5 rounded-full text-text-secondary select-none">
            Queue: <span className="text-text-primary">{listings.filter(l => l.status === "pending_approval").length} pending</span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
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

        {/* Tab filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-bg-alt border border-border-default p-0.5 rounded-xl">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => { setTab(t.value); setSelectedIds([]); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all select-none cursor-pointer flex items-center gap-1.5",
                  tab === t.value
                    ? t.value === "update_reviews"
                      ? "bg-amber-500 text-white"
                      : "bg-accent-primary text-white"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span className={cn(
                    "inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[9px] font-extrabold",
                    tab === t.value ? "bg-white/20 text-white" : "bg-bg-elevated text-text-primary"
                  )}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bulk actions (only for non-update-review tabs) */}
          {selectedIds.length > 0 && tab !== "update_reviews" && (
            <div className="flex gap-2">
              <Button onClick={handleBulkReject} size="sm" variant="outline"
                className="h-10 rounded-xl border-rose-600/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-bold px-4">
                Reject ({selectedIds.length})
              </Button>
              <Button onClick={handleBulkApprove} size="sm"
                className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4">
                Approve ({selectedIds.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="py-20 text-center font-body font-semibold text-text-muted animate-pulse">
          Loading moderation queue...
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="py-12 text-center text-text-muted text-xs font-bold">
          {tab === "update_reviews"
            ? "No pending agent updates. All listings are up to date."
            : "No listings found matching this status queue."}
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
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default text-text-secondary font-medium">
                {filteredListings.map((prop) => {
                  const isRent = prop.transactionType === "rent" || prop.transactionType === "roommate_share";
                  const symbol = prop.currency === "USD" ? "$" : prop.currency + " ";
                  const formattedPrice = `${symbol}${prop.price.toLocaleString()}${isRent ? "/mo" : ""}`;

                  return (
                    <tr key={prop.id} className={cn(
                      "hover:bg-bg-alt/25 transition-colors",
                      prop.hasPendingUpdate && "border-l-2 border-l-amber-500/50"
                    )}>
                      <td className="py-4 px-5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(prop.id)}
                          onChange={(e) => handleSelectOne(prop.id, e.target.checked)}
                          className="rounded border-border-default bg-bg-base"
                        />
                      </td>

                      {/* Image + Title */}
                      <td className="py-4 px-5 max-w-sm cursor-pointer" onClick={() => { setInspectedProp(prop); setDiffMode(!!prop.hasPendingUpdate); }}>
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
                            <div className="flex items-center flex-wrap gap-1.5 mt-1">
                              <span className="text-[10px] text-text-muted font-semibold flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-accent-primary shrink-0" />
                                {prop.city}, {prop.state}
                              </span>
                              {prop.hasPendingUpdate && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                  <GitCompare className="h-2.5 w-2.5" /> Update Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Lister */}
                      <td className="py-4 px-5 text-text-secondary">{prop.listerProfile.name}</td>

                      {/* Price */}
                      <td className="py-4 px-5 font-mono font-bold text-text-primary">{formattedPrice}</td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <div className="flex flex-col items-start gap-1">
                          <span className={cn(
                            "inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border tracking-wider",
                            prop.hasPendingUpdate ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30" :
                            prop.status === "active" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                            prop.status === "rejected" ? "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" :
                            "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                          )}>
                            {prop.hasPendingUpdate ? "EDIT PENDING" : prop.status === "pending_approval" ? "pending" : prop.status}
                          </span>
                          {prop.hasPendingUpdate && (
                            <span className="text-[9px] font-bold text-text-muted">Live: Active</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => { setInspectedProp(prop); setDiffMode(!!prop.hasPendingUpdate); }}
                            size="icon-sm" variant="ghost"
                            className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg cursor-pointer"
                            title="Inspect details"
                          >
                            {prop.hasPendingUpdate ? <GitCompare className="h-3.5 w-3.5 text-amber-500" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          {prop.hasPendingUpdate ? (
                            <>
                              <Button
                                onClick={() => rejectUpdate(prop.id, prop.title)}
                                size="icon-sm"
                                className="h-8 w-8 bg-rose-500/15 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white rounded-lg flex items-center justify-center border border-rose-500/25 hover:border-transparent transition-all cursor-pointer"
                                title="Reject update"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                onClick={() => approveUpdate(prop.id, prop.title)}
                                size="icon-sm"
                                className="h-8 w-8 bg-amber-500/15 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-white rounded-lg flex items-center justify-center border border-amber-500/25 hover:border-transparent transition-all cursor-pointer"
                                title="Approve update"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
                          <Link href={`/property/${prop.slug}`} target="_blank">
                            <Button size="icon-sm" variant="ghost"
                              className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg cursor-pointer"
                              title="View live listing"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            </Button>
                          </Link>
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

      {/* ── Inspector Sheet ── */}
      <Sheet open={!!inspectedProp} onOpenChange={(open) => { if (!open) { setInspectedProp(null); setDiffMode(false); } }}>
        <SheetContent className="w-full sm:max-w-lg bg-bg-surface border-l border-border-default text-text-primary flex flex-col justify-between p-6">
          <SheetHeader className="pb-4 border-b border-border-default">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-text-primary text-left font-heading text-lg font-bold">
                {diffMode ? "Review Pending Update" : "Property Verification"}
              </SheetTitle>
              {inspectedProp?.hasPendingUpdate && (
                <button
                  onClick={() => setDiffMode(prev => !prev)}
                  className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer",
                    diffMode
                      ? "bg-bg-alt border-border-default text-text-muted"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  )}
                >
                  {diffMode ? "Show Current" : "Show Update Diff"}
                </button>
              )}
            </div>
            <SheetDescription className="text-left text-text-muted text-xs mt-0.5">
              {diffMode
                ? "Fields highlighted in amber have proposed changes from the agent. Unchanged fields are hidden."
                : "Review transaction structures, pricing, and structural specifications."}
            </SheetDescription>
          </SheetHeader>

          {inspectedProp && (
            <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-1 custom-scrollbar">

              {/* ── DIFF MODE: Show pending changes ── */}
              {diffMode && inspectedProp.pendingUpdate ? (
                <>
                  {/* Submission time */}
                  {inspectedProp.pendingUpdate.submittedAt && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Update submitted</p>
                        <p className="text-[10px] text-text-muted">
                          {new Date(inspectedProp.pendingUpdate.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Diff table */}
                  <div className="rounded-xl border border-border-default overflow-hidden">
                    <div className="grid grid-cols-[auto_1fr_1fr] text-[10px] font-extrabold uppercase tracking-widest bg-bg-alt/70 border-b border-border-default">
                      <div className="py-2.5 px-3 text-text-muted border-r border-border-default">Field</div>
                      <div className="py-2.5 px-3 text-text-muted border-r border-border-default">Current (Live)</div>
                      <div className="py-2.5 px-3 text-amber-600 dark:text-amber-400">Proposed</div>
                    </div>
                    {(() => {
                      const diff = inspectedProp.pendingUpdate!;
                      const changedFields = DIFFABLE_FIELDS.filter(({ key }) => {
                        const proposed = diff[key];
                        if (proposed === undefined) return false;
                        const current = (inspectedProp as unknown as Record<string, unknown>)[key];
                        return renderValue(proposed) !== renderValue(current);
                      });

                      if (changedFields.length === 0) {
                        return (
                          <div className="py-8 text-center text-text-muted text-xs font-semibold">
                            No detectable field changes found.
                          </div>
                        );
                      }

                      return changedFields.map(({ key, label }) => {
                        const current = (inspectedProp as unknown as Record<string, unknown>)[key];
                        const proposed = diff[key];
                        return (
                          <div key={key} className="grid grid-cols-[auto_1fr_1fr] border-b border-border-default last:border-b-0 hover:bg-amber-500/5 transition-colors">
                            <div className="py-3 px-3 text-[10px] font-bold text-text-muted border-r border-border-default whitespace-nowrap">
                              {label}
                            </div>
                            <div className="py-3 px-3 text-[11px] text-text-secondary border-r border-border-default break-words">
                              {renderValue(current)}
                            </div>
                            <div className="py-3 px-3 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/5 break-words">
                              {renderValue(proposed)}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Images preview if changed */}
                  {inspectedProp.pendingUpdate.images && Array.isArray(inspectedProp.pendingUpdate.images) && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Proposed Images</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(inspectedProp.pendingUpdate.images as string[]).slice(0, 6).map((src, i) => (
                          <img key={i} src={src} alt="" className="aspect-video rounded-lg object-cover border border-amber-500/30" />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ── NORMAL MODE: Show current live listing ── */
                <>
                  {/* Cover preview */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-border-default bg-bg-alt shrink-0 shadow-inner select-none">
                    <img src={inspectedProp.images[0]} alt="Verify" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-bg-base to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="bg-accent-primary text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase font-body tracking-wider">
                        {inspectedProp.propertyCategory}
                      </span>
                      {inspectedProp.hasPendingUpdate && (
                        <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase font-body tracking-wider flex items-center gap-1">
                          <GitCompare className="h-2.5 w-2.5" /> Update Pending
                        </span>
                      )}
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
                </>
              )}
            </div>
          )}

          {/* ── Sheet Footer Actions ── */}
          <div className="border-t border-border-default pt-4 flex gap-3 mt-4">
            {/* Pending UPDATE actions */}
            {inspectedProp?.hasPendingUpdate && diffMode ? (
              <>
                <Button
                  onClick={() => rejectUpdate(inspectedProp.id, inspectedProp.title)}
                  variant="outline"
                  className="flex-1 h-10 rounded-xl border-rose-600/30 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 font-bold cursor-pointer"
                >
                  Reject Update
                </Button>
                <Button
                  onClick={() => approveUpdate(inspectedProp.id, inspectedProp.title)}
                  className="flex-1 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve &amp; Go Live
                </Button>
              </>
            ) : (
              /* New listing approval actions */
              <>
                {inspectedProp && inspectedProp.status !== "rejected" && !inspectedProp.hasPendingUpdate && (
                  <Button
                    onClick={() => rejectListing(inspectedProp.id, inspectedProp.title)}
                    variant="outline"
                    className="flex-1 h-10 rounded-xl border-rose-600/30 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 font-bold cursor-pointer"
                  >
                    Reject Listing
                  </Button>
                )}
                {inspectedProp && inspectedProp.status !== "active" && !inspectedProp.hasPendingUpdate && (
                  <Button
                    onClick={() => approveListing(inspectedProp.id, inspectedProp.title)}
                    className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                  >
                    Approve Listing
                  </Button>
                )}
                {inspectedProp && (inspectedProp.status === "active" || inspectedProp.hasPendingUpdate) && !diffMode && (
                  <Button
                    onClick={() => setInspectedProp(null)}
                    className="flex-1 h-10 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white font-bold cursor-pointer"
                  >
                    Close
                  </Button>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}
