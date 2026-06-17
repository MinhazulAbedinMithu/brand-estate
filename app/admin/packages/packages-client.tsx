"use client";

import * as React from "react";
import { Sparkles, Plus, Edit2, CheckCircle2, ShieldCheck, Settings, Users, Percent, DollarSign, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PricingPackage } from "@/lib/types";

export function AdminPackagesClient() {
  const { getPackages, updatePackage, createPackage } = useAuth();
  
  const [packages, setPackages] = React.useState<PricingPackage[]>([]);
  const [showFormModal, setShowFormModal] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<PricingPackage | null>(null);
  
  // Form state
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [maxListings, setMaxListings] = React.useState("");
  const [features, setFeatures] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const refreshList = React.useCallback(() => {
    setPackages(getPackages());
  }, [getPackages]);

  React.useEffect(() => {
    Promise.resolve().then(() => {
      refreshList();
    });
  }, [refreshList]);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setName("");
    setPrice("");
    setMaxListings("");
    setFeatures("Standard listings, Email support");
    setIsActive(true);
    setShowFormModal(true);
  };

  const handleOpenEdit = (pkg: PricingPackage) => {
    setEditingPlan(pkg);
    setName(pkg.name);
    setPrice(pkg.price.toString());
    setMaxListings(pkg.maxListings.toString());
    setFeatures(pkg.features.join(", "));
    setIsActive(pkg.isActive);
    setShowFormModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !maxListings) {
      toast.error("Validation error", { description: "Please complete all mandatory fields." });
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);

    const featureList = features.split(",").map(f => f.trim()).filter(Boolean);

    if (editingPlan) {
      // Edit
      updatePackage({
        id: editingPlan.id,
        name: name.trim(),
        price: Number(price),
        maxListings: Number(maxListings),
        features: featureList,
        isActive,
      });
      toast.success("Package updated", { description: `"${name}" package configurations saved.` });
    } else {
      // Create
      createPackage({
        name: name.trim(),
        price: Number(price),
        maxListings: Number(maxListings),
        features: featureList,
        isActive,
      });
      toast.success("Package created", { description: `"${name}" package has been created successfully.` });
    }

    setShowFormModal(false);
    refreshList();
  };

  // Mock subscribers metrics
  const subscriberCounts: Record<string, number> = {
    "pkg-bronze": 4,
    "pkg-silver": 12,
    "pkg-gold": 3,
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent-primary" />
            Pricing Packages
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">
            Configure listing limits, rates, and feature configurations for agent tiers.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          size="sm"
          className="h-10 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-5 cursor-pointer"
        >
          <span className="flex items-center gap-1.5"><Plus className="h-4 w-4" /> Create Package</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Subscribers", value: "19 Agents", icon: Users, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
          { label: "Active Plan Tiers", value: `${packages.length} Configured`, icon: Building, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
          { label: "Monthly SaaS Revenue", value: "$1,691 USD", icon: DollarSign, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-2xl border border-border-default bg-bg-surface p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">{stat.label}</span>
                <span className="text-lg font-bold text-text-primary font-heading">{stat.value}</span>
              </div>
              <div className={cn("h-10 w-10 rounded-xl border flex items-center justify-center", stat.color)}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Packages Admin Table */}
      <div className="rounded-2xl border border-border-default bg-bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-default bg-bg-alt/50 text-text-secondary font-extrabold uppercase select-none">
                <th className="py-4 px-5">Plan Name</th>
                <th className="py-4 px-5">Monthly Fee</th>
                <th className="py-4 px-5">Listings Limit</th>
                <th className="py-4 px-5">Subscribers</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-text-secondary font-medium">
              {packages.map((pkg) => {
                const subs = subscriberCounts[pkg.id] || 0;
                
                return (
                  <tr key={pkg.id} className="hover:bg-bg-alt/20 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-5 font-bold text-text-primary">
                      {pkg.name}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-5 font-mono font-bold text-text-primary">
                      ${pkg.price}/mo
                    </td>

                    {/* Listings limit */}
                    <td className="py-4 px-5 font-bold text-text-secondary">
                      {pkg.maxListings} Listings max
                    </td>

                    {/* Subscribers count */}
                    <td className="py-4 px-5 font-mono">
                      {subs} Agents
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                        pkg.isActive
                          ? "text-emerald-600 bg-emerald-500/5 border-emerald-500/20"
                          : "text-text-muted bg-bg-alt border-border-default"
                      )}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <Button
                        onClick={() => handleOpenEdit(pkg)}
                        size="icon-sm"
                        variant="ghost"
                        className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg cursor-pointer"
                        title="Edit configurations"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="max-w-md bg-bg-surface border-border-default text-text-primary rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-4 border-b border-border-default/60">
            <div className="h-12 w-12 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <DialogTitle className="text-text-primary text-lg font-bold font-heading">
              {editingPlan ? "Edit Package Configurations" : "Create Pricing Package"}
            </DialogTitle>
            <DialogDescription className="text-text-muted text-xs mt-1">
              Configure parameters to dictate listings limits and subscription features.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Package Name *</label>
              <Input
                placeholder="e.g. Silver Professional"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Fee */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Monthly Fee ($) *</label>
                <Input
                  type="number"
                  placeholder="e.g. 79"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  required
                />
              </div>

              {/* Limit */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Max Listings *</label>
                <Input
                  type="number"
                  placeholder="e.g. 10"
                  value={maxListings}
                  onChange={(e) => setMaxListings(e.target.value)}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Features List (comma separated)</label>
              <textarea
                placeholder="e.g. Priority email support, 2 featured listings, advanced statistics"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={3}
                className="w-full text-sm border bg-bg-base text-text-primary border-border-default rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none font-medium"
              />
            </div>

            {/* Status toggle */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="pkg-active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border-default bg-bg-base"
              />
              <label htmlFor="pkg-active" className="text-xs text-text-secondary font-bold select-none cursor-pointer">
                Active & Subscribable Plan
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border-default/60 mt-4">
              <Button
                type="button"
                onClick={() => setShowFormModal(false)}
                variant="outline"
                className="flex-1 h-10 rounded-xl border-border-default text-text-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 h-10 rounded-xl bg-accent-primary text-white font-bold text-xs"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
