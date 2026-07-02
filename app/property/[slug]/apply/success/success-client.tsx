"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, ShieldCheck, ArrowRight, Home, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentSuccessClientProps {
  slug: string;
  sessionId: string;
}

export function PaymentSuccessClient({ slug, sessionId }: PaymentSuccessClientProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [application, setApplication] = React.useState<any>(null);

  React.useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setError("Missing Stripe session identifier.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/payment/verify?session_id=${sessionId}`);
        const data = await res.json();
        if (data.status === "success") {
          setApplication(data.data);
        } else {
          setError(data.message || "Failed to verify payment session.");
        }
      } catch (err) {
        console.error(err);
        setError("A network error occurred while verifying the payment.");
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-[80vh] bg-bg-base text-text-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-border-default bg-bg-surface p-6 sm:p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-accent-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />

        {loading ? (
          <div className="py-12 space-y-4 animate-fade-in flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-accent-primary animate-spin" />
            <h2 className="text-lg font-bold font-heading">Verifying payment authorization...</h2>
            <p className="text-xs text-text-muted max-w-xs leading-relaxed">
              We are connecting with Stripe to verify your transaction parameters and finalize your application database record.
            </p>
          </div>
        ) : error ? (
          <div className="py-8 space-y-4 animate-fade-in flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
              <span className="font-extrabold text-lg">!</span>
            </div>
            <h2 className="text-lg font-bold font-heading text-rose-400">Payment Verification Failed</h2>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              {error}
            </p>
            <div className="flex gap-3 pt-2 w-full">
              <Link href={`/property/${slug}`} className="flex-1">
                <Button variant="outline" className="w-full h-10 rounded-xl text-text-secondary text-xs">
                  Back to Property
                </Button>
              </Link>
              <Link href="/dashboard/profile" className="flex-1">
                <Button className="w-full h-10 rounded-xl bg-accent-primary text-white text-xs">
                  Go to Settings
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in flex flex-col items-center">
            {/* Animated Check */}
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-md">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-text-primary tracking-tight">
                Application Received!
              </h2>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Stripe payment succeeded
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="w-full rounded-2xl border border-border-default/60 bg-bg-alt/30 p-4.5 text-xs text-left space-y-3 font-semibold">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-text-muted">Target Property:</span>
                <span className="text-text-primary font-bold text-right truncate max-w-[200px]">
                  {application?.propertyTitle || "Listing Details"}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-t border-border-default/30 pt-2">
                <span className="text-text-muted">Processing Fee:</span>
                <span className="text-text-primary font-extrabold text-sm flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-accent-primary" />
                  ${application?.applicationFeePaid || 0} USD
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-t border-border-default/30 pt-2">
                <span className="text-text-muted">Transaction ID:</span>
                <span className="text-text-secondary font-mono text-[9px] select-all truncate max-w-[180px]">
                  {application?.stripePaymentIntentId || sessionId}
                </span>
              </div>
            </div>

            {/* Next Steps callout */}
            <div className="w-full rounded-2xl border border-border-default bg-bg-surface/50 p-4.5 text-left text-xs font-semibold text-text-secondary space-y-2.5">
              <div className="flex items-center gap-2 text-accent-primary">
                <ShieldCheck className="h-4.5 w-4.5" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Tenancy Application Logged</span>
              </div>
              <p className="text-[11px] leading-relaxed text-text-muted">
                The listing broker or agent has been notified and is reviewing your application alongside your verified KYC details, credit score, and background report.
              </p>
            </div>

            {/* CTA Actions */}
            <div className="w-full space-y-3 pt-2">
              <Link href="/dashboard/applications" className="block w-full">
                <Button className="w-full h-11 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold gap-1.5 shadow-md active:scale-98 transition-all">
                  Go to My Applications <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/property/${slug}`} className="block w-full">
                <Button variant="outline" className="w-full h-11 rounded-full border-border-default text-text-secondary text-xs font-bold gap-1.5">
                  <Home className="h-4 w-4" /> Return to Property Detail
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
