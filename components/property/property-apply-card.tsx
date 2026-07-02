"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Shield, Check, X, Wallet, FileText, ArrowRight, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PropertyApplyCardProps {
  property: {
    id: string;
    title: string;
    applicationFeeRequired?: boolean;
    applicationFee?: number;
    depositRequired?: boolean;
    depositAmount?: number;
    petsAllowed?: boolean;
    petAllowanceCharge?: number;
  };
  className?: string;
}

export function PropertyApplyCard({ property, className }: PropertyApplyCardProps) {
  const { currentUser } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  
  // Wallet state
  const balance = currentUser?.walletBalance ?? 1000;
  const reqFee = property.applicationFeeRequired ? (property.applicationFee ?? 0) : 0;
  
  // Checklist validation states
  const emailOk = !!currentUser?.isVerified;
  const phoneOk = !!currentUser?.phoneVerified;
  
  // KYC can be nid status verified or kyc verified
  const kycOk = currentUser?.kycStatus === 'verified' || currentUser?.nidStatus === 'verified';
  
  const bgOk = currentUser?.backgroundReportStatus === 'verified';
  const creditOk = currentUser?.creditReportStatus === 'verified';
  
  const canApply = emailOk && phoneOk && kycOk && bgOk && creditOk;

  const handleApply = async () => {
    if (!currentUser) {
      toast.error("Authentication required", { description: "Please sign in to apply for this property." });
      return;
    }
    
    if (!canApply) {
      toast.error("Requirements incomplete", { description: "Please ensure all checklist tasks are green." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();
      if (data.status === "success") {
        if (data.direct) {
          toast.success("Application submitted successfully! 🚀");
          setOpen(false);
          setTimeout(() => window.location.reload(), 1500);
        } else if (data.url) {
          toast.success("Redirecting to secure Stripe checkout...");
          window.location.href = data.url;
        }
      } else {
        toast.error("Checkout initialization failed", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", { description: "An unexpected error occurred during submission." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5", className)}>
      <div className="border-b border-border-default pb-3">
        <h4 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
          <Shield className="h-4.5 w-4.5 text-accent-primary" />
          Apply & Reservation
        </h4>
        <p className="text-[11px] text-text-muted mt-0.5 font-medium font-body">Submit tenancy or purchase reservations instantly.</p>
      </div>

      {/* Policy specifications display */}
      <div className="space-y-3.5 text-xs font-medium">
        <div className="flex justify-between items-center py-0.5">
          <span className="text-text-muted">Application Fee</span>
          <span className="font-bold text-text-primary">
            {property.applicationFeeRequired ? `$${property.applicationFee}` : "Free"}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-text-muted">Security Deposit</span>
          <span className="font-bold text-text-primary">
            {property.depositRequired ? `$${property.depositAmount}` : "None"}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-text-muted">Pet Allowance Policy</span>
          <span className={cn("font-bold", property.petsAllowed ? "text-emerald-500" : "text-rose-500")}>
            {property.petsAllowed ? `Allowed ($${property.petAllowanceCharge}/mo)` : "Not Allowed"}
          </span>
        </div>
      </div>

      {/* Main trigger button */}
      {currentUser ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="w-full h-11 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold gap-1.5 active:scale-98 transition-all shadow-md">
              Apply For Property <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          } />
          
          <DialogContent className="bg-bg-surface border-border-default text-text-primary rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-text-primary font-heading font-bold text-left text-lg flex items-center gap-2">
                <Shield className="h-5.5 w-5.5 text-accent-primary" />
                Submit Tenancy Application
              </DialogTitle>
              <DialogDescription className="text-left text-text-muted text-xs leading-relaxed">
                Confirm your profile parameters and authorize payment of the listing application fee.
              </DialogDescription>
            </DialogHeader>

            {/* Checklist items */}
            <div className="space-y-3.5 my-4">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block border-b border-border-default pb-1.5">
                Verification Requirements Checklist
              </span>
              
              <div className="space-y-2.5">
                {[
                  { name: "Email Address Verified (15%)", ok: emailOk },
                  { name: "Phone Number Verified (15%)", ok: phoneOk },
                  { name: "Identity KYC Verified (25%)", ok: kycOk },
                  { name: "Background Check Report (15%)", ok: bgOk },
                  { name: "Credit Screening Check (15%)", ok: creditOk },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-text-secondary">{item.name}</span>
                    {item.ok ? (
                      <span className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="h-5 w-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                        <X className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Fee calculations and Stripe disclaimer */}
              <div className="pt-4 border-t border-border-default/60 space-y-3 text-xs text-left">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-text-secondary">Required Application Fee:</span>
                  <span className="text-text-primary">{reqFee > 0 ? `$${reqFee}` : "Free"}</span>
                </div>
                {reqFee > 0 && (
                  <div className="p-3 bg-accent-primary-dim/30 border border-accent-primary/20 rounded-xl text-[10px] text-text-secondary leading-relaxed flex items-start gap-2">
                    <Shield className="h-4 w-4 text-accent-primary shrink-0 mt-0.5" />
                    <span>
                      Payments are processed securely via Stripe. Application fees are fully refunded back to your card if your application is rejected.
                    </span>
                  </div>
                )}
                
                {!canApply && (
                  <div className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl text-[10px] font-bold text-rose-400 text-left leading-relaxed">
                    Some verification checks are missing. You can complete NID, KYC, Phone OTP, Background and Credit Score verification in your Profile settings.
                    <Link href="/dashboard/profile" className="underline block mt-1.5 hover:text-rose-300">
                      Go to Profile Settings →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex flex-row gap-3 mt-4">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1 h-10 rounded-xl border-border-default text-text-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                disabled={!canApply || submitting}
                className="flex-1 h-10 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white font-bold text-xs"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...
                  </span>
                ) : (
                  "Confirm & Apply"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="space-y-3">
          <Link href="/login" className="block w-full">
            <Button className="w-full h-11 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold shadow-md">
              Sign in to Apply
            </Button>
          </Link>
          <p className="text-[10px] text-text-muted text-center leading-relaxed">
            Tenants must be logged in and NID/KYC-verified to apply for properties.
          </p>
        </div>
      )}
    </div>
  );
}
