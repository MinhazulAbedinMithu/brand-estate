"use client";

import * as React from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEmail("");
    }, 1200);
  };

  return (
    <div className="rounded-2xl border border-accent-primary/20 bg-accent-primary/5 dark:bg-accent-primary/10 p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden">
      {/* Background graphic */}
      <div className="absolute -right-8 -bottom-8 text-accent-primary/10 pointer-events-none">
        <Mail className="h-24 w-24 rotate-12" />
      </div>

      {success ? (
        <div className="text-center py-4 space-y-3 relative z-10 animate-fade-in">
          <div className="flex justify-center text-state-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <h5 className="font-heading text-base font-bold text-text-primary">
              Subscription Successful!
            </h5>
            <p className="text-xs text-text-secondary font-body mt-1 leading-relaxed">
              Thank you for subscribing to our newsletter. We&apos;ll send you our weekly insights.
            </p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="text-[11px] font-bold font-body text-accent-primary hover:underline cursor-pointer pt-2"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 relative z-10">
          <h4 className="font-heading text-base font-bold text-text-primary">
            Subscribe to Insights
          </h4>
          <p className="text-xs text-text-secondary font-body leading-relaxed">
            Join 15,000+ real estate professionals and enthusiasts. Get high-quality insights sent straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={cn(
                  "w-full pl-9 pr-3 py-2.5 rounded-full border border-border-default/80 bg-bg-surface text-xs text-text-primary placeholder:text-text-faint focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all font-body",
                  error && "border-state-error/55 focus:border-state-error focus:ring-state-error/10"
                )}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">
                <Mail className="h-3.5 w-3.5" />
              </div>
            </div>

            {error && (
              <span className="text-[10px] font-bold text-state-error font-body block px-2">
                {error}
              </span>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold font-body py-2.5 rounded-full hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md hover:shadow-accent-primary/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe Weekly</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
