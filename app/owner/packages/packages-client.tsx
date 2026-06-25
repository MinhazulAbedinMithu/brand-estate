"use client";

import * as React from "react";
import { Sparkles, Check, CheckCircle2, ChevronRight, HelpCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function OwnerPackagesClient() {
  const { getPackages } = useAuth();
  
  const [packages, setPackages] = React.useState<PricingPackage[]>([]);
  const [activePackageId, setActivePackageId] = React.useState("pkg-silver"); // Seed active package
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<PricingPackage | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    Promise.resolve().then(() => {
      setPackages(getPackages().filter(p => p.isActive));
    });
  }, [getPackages]);

  const handleSelectPlan = (pkg: PricingPackage) => {
    if (pkg.id === activePackageId) {
      toast.info("Already subscribed", { description: `You are currently on the ${pkg.name} plan.` });
      return;
    }
    setSelectedPlan(pkg);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setActivePackageId(selectedPlan.id);
    setShowUpgradeModal(false);
    toast.success("Plan updated successfully!", {
      description: `Your account has been upgraded to the ${selectedPlan.name} plan.`,
    });
  };

  const currentPlanObj = packages.find(p => p.id === activePackageId);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="border-b border-border-default pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
          Pricing Packages
        </h1>
        <p className="text-xs text-text-muted font-medium font-body mt-1">
          Review package limits, select listing tiers, and modify operational facilities.
        </p>
      </div>

      {/* Current Subscription overview panel */}
      {currentPlanObj && (
        <div className="rounded-2xl border border-border-default bg-bg-surface p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest block">Active Plan Overview</span>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 font-heading">
              {currentPlanObj.name}
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            </h3>
            <p className="text-xs text-text-muted max-w-md">
              Your package accommodates up to <span className="font-bold text-text-primary">{currentPlanObj.maxListings} active listings</span>. You have currently published 8 listings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <div className="p-4 rounded-xl border border-border-default bg-bg-alt/50 text-center shrink-0 min-w-[120px]">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Usage Limits</span>
              <span className="text-xl font-extrabold text-text-primary font-mono mt-1 block">8 / {currentPlanObj.maxListings}</span>
            </div>
            <div className="p-4 rounded-xl border border-border-default bg-bg-alt/50 text-center shrink-0 min-w-[120px]">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Tier Rate</span>
              <span className="text-xl font-extrabold text-text-primary font-mono mt-1 block">${currentPlanObj.price}<span className="text-xs font-semibold text-text-muted">/mo</span></span>
            </div>
          </div>
        </div>
      )}

      {/* Pricing packages comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const isActive = pkg.id === activePackageId;
          
          return (
            <div
              key={pkg.id}
              className={cn(
                "rounded-2xl border bg-bg-surface p-6 shadow-sm flex flex-col justify-between transition-all duration-300 relative group",
                isActive 
                  ? "border-accent-primary ring-2 ring-accent-primary/10 scale-[1.02]" 
                  : "border-border-default hover:border-border-subtle hover:-translate-y-0.5"
              )}
            >
              {isActive && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-bold bg-accent-primary text-white uppercase tracking-wider shadow">
                  Current Tier
                </span>
              )}

              <div className="space-y-4">
                {/* Plan details */}
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{pkg.name}</h4>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className="text-3xl font-extrabold text-text-primary font-mono">${pkg.price}</span>
                    <span className="text-xs text-text-muted font-bold">/ month</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-2 font-medium">
                    Supports up to <span className="font-bold text-text-primary">{pkg.maxListings} active listings</span> simultaneously.
                  </p>
                </div>

                <div className="h-px bg-border-default" />

                {/* Features */}
                <ul className="space-y-2.5">
                  {pkg.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-text-secondary">
                      <div className="h-4 w-4 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Button
                  onClick={() => handleSelectPlan(pkg)}
                  disabled={isActive}
                  className={cn(
                    "w-full h-10 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-bg-elevated border border-border-default text-text-muted cursor-default"
                      : "bg-accent-primary text-white hover:bg-accent-primary-hov shadow-sm"
                  )}
                >
                  {isActive ? "Current Plan" : "Upgrade Subscription"}
                </Button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Upgrade Confirmation Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md bg-bg-surface border-border-default text-text-primary rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-4 border-b border-border-default">
            <div className="h-12 w-12 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-3">
              <ShieldCheck className="h-6 w-6 animate-pulse" />
            </div>
            <DialogTitle className="text-text-primary text-lg font-bold font-heading">Confirm Subscription Upgrade</DialogTitle>
            <DialogDescription className="text-text-muted text-xs mt-1">
              Complete your subscription transition to update listings capabilities.
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4 py-4 text-xs font-medium">
              <div className="p-4 rounded-2xl bg-bg-alt border border-border-default space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border-default">
                  <span className="text-text-muted">Target Package</span>
                  <span className="font-bold text-text-primary">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border-default">
                  <span className="text-text-muted">Listings Allowance</span>
                  <span className="font-bold text-text-primary">{selectedPlan.maxListings} active properties</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">New Monthly Price</span>
                  <span className="font-bold text-accent-primary font-mono">${selectedPlan.price} / mo</span>
                </div>
              </div>
              <p className="text-[11px] text-text-muted leading-normal text-center max-w-xs mx-auto">
                Billing rates will adjust automatically at the start of your next billing cycle.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => setShowUpgradeModal(false)}
              variant="outline"
              disabled={loading}
              className="flex-1 h-10 rounded-xl border-border-default text-text-secondary cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmUpgrade}
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-accent-primary text-white font-bold text-xs cursor-pointer"
            >
              {loading ? "Processing..." : "Confirm Upgrade"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
