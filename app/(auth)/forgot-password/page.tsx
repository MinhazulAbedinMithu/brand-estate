"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  ArrowLeft,
  MailCheck,
  Loader2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import { AuthLayoutShell } from "@/components/layout/auth-layout-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// Countdown hook for the resend cooldown timer
// ─────────────────────────────────────────────────────────
function useCountdown(seconds: number) {
  const [remaining, setRemaining] = React.useState(0);

  const start = React.useCallback(() => {
    setRemaining(seconds);
  }, [seconds]);

  React.useEffect(() => {
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  return { remaining, start, isActive: remaining > 0 };
}

// ─────────────────────────────────────────────────────────
// Success State Card
// ─────────────────────────────────────────────────────────
function SuccessCard({
  email,
  onResend,
  isResending,
  countdown,
}: {
  email: string;
  onResend: () => void;
  isResending: boolean;
  countdown: number;
}) {
  return (
    <div className="animate-fade-in text-center space-y-6">
      {/* Animated icon */}
      <div className="flex justify-center mb-2">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center animate-bounce-in">
            <MailCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          {/* Ring glow */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary font-heading">Check your inbox</h2>
        <p className="text-sm text-text-muted leading-relaxed">
          We&apos;ve sent a password reset link to
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated border border-border-default">
          <Mail className="h-3.5 w-3.5 text-accent-primary shrink-0" />
          <span className="text-sm font-semibold text-text-primary truncate max-w-[220px]">{email}</span>
        </div>
        <p className="text-xs text-text-faint mt-3">
          Didn&apos;t receive it? Check your spam folder or request a new link.
        </p>
      </div>

      {/* Resend button */}
      <Button
        type="button"
        onClick={onResend}
        disabled={countdown > 0 || isResending}
        variant="outline"
        className={cn(
          "w-full h-12 rounded-full font-semibold text-sm transition-all duration-200",
          countdown > 0
            ? "border-border-default text-text-faint cursor-not-allowed"
            : "border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white"
        )}
      >
        {isResending ? (
          <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Sending...</span>
        ) : countdown > 0 ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Resend in {countdown}s
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Resend email
          </span>
        )}
      </Button>

      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary hover:text-accent-primary-hov hover:underline transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const { remaining, start: startCountdown, isActive } = useCountdown(60);

  const validate = (value: string) => {
    if (!value.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    return "";
  };

  const callForgotPasswordAPI = async (emailValue: string): Promise<{ ok: boolean; message?: string }> => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailValue.trim().toLowerCase() }),
    });
    const data = await res.json();
    return { ok: res.ok, message: data.message };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(email);
    if (err) { setEmailError(err); return; }
    setEmailError("");
    setIsSubmitting(true);
    try {
      const result = await callForgotPasswordAPI(email);
      if (!result.ok) {
        toast.error("Failed to send", { description: result.message ?? "Please try again." });
        return;
      }
      setSubmitted(true);
      startCountdown();
      toast.success("Reset link sent!", { description: `Check your inbox at ${email}` });
    } catch {
      toast.error("Network error", { description: "Could not reach the server. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await callForgotPasswordAPI(email);
      startCountdown();
      toast.success("Email resent!", { description: "A fresh reset link has been sent." });
    } catch {
      toast.error("Network error", { description: "Could not reach the server." });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayoutShell
      heading={submitted ? "Email sent!" : "Reset your password"}
      subheading={
        submitted
          ? undefined
          : "Enter your account email and we'll send you a secure reset link."
      }
    >
      {submitted ? (
        <SuccessCard
          email={email}
          onResend={handleResend}
          isResending={isResending}
          countdown={remaining}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(validate(e.target.value));
                  }}
                  autoComplete="email"
                  className={cn(
                    "pl-10 h-12 rounded-full border-border-default bg-bg-elevated/50 text-text-primary placeholder:text-text-faint transition-all duration-200",
                    "focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary",
                    emailError && "border-state-error focus:ring-state-error/30 focus:border-state-error"
                  )}
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-state-error flex items-center gap-1 animate-fade-in">
                  <span className="inline-block h-1 w-1 rounded-full bg-state-error shrink-0" />
                  {emailError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-sm shadow-md shadow-accent-primary/20 hover:shadow-lg hover:shadow-accent-primary/30 transition-all duration-200 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending reset link...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Reset Link
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary hover:text-accent-primary-hov hover:underline transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </AuthLayoutShell>
  );
}
