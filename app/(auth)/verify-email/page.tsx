"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MailCheck,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { AuthLayoutShell } from "@/components/layout/auth-layout-shell";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────
// Loading state
// ─────────────────────────────────────────────────────────
function VerifyingCard() {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-accent-primary/10 flex items-center justify-center">
            <MailCheck className="h-10 w-10 text-accent-primary" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-accent-primary/30 animate-ping" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary font-heading">
          Verifying your email…
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
          Please wait while we confirm your email address.
        </p>
      </div>
      <div className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent-primary" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Success state
// ─────────────────────────────────────────────────────────
function SuccessCard() {
  const router = useRouter();

  React.useEffect(() => {
    const t = setTimeout(() => router.push("/login"), 4000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="text-center space-y-6 animate-fade-in">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary font-heading">
          Email Verified!
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
          Your account is now active. You can sign in and start exploring
          premium properties on RealHoms.
        </p>
      </div>

      {/* Confetti badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
          Redirecting you to sign in automatically…
        </p>
      </div>

      {/* CTA */}
      <Link href="/login">
        <Button className="w-full h-12 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-sm shadow-md shadow-accent-primary/20 hover:shadow-lg hover:shadow-accent-primary/30 transition-all duration-200">
          <span className="flex items-center gap-2">
            Sign In Now <ArrowRight className="h-4 w-4" />
          </span>
        </Button>
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Error / invalid token state
// ─────────────────────────────────────────────────────────
function ErrorCard({ message }: { message: string }) {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-state-error/10 flex items-center justify-center">
          <ShieldAlert className="h-10 w-10 text-state-error" />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary font-heading">
          Verification Failed
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
          {message}
        </p>
      </div>

      {/* Error badge */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-state-error/8 border border-state-error/20 text-left">
        <ShieldAlert className="h-4 w-4 text-state-error shrink-0 mt-0.5" />
        <p className="text-xs text-state-error leading-relaxed">
          Verification links expire after <strong>24 hours</strong>. Register
          again to receive a fresh link.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link href="/register">
          <Button className="w-full h-12 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-sm shadow-md shadow-accent-primary/20 transition-all duration-200">
            <span className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Register Again
            </span>
          </Button>
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary hover:underline transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Missing token state
// ─────────────────────────────────────────────────────────
function MissingTokenCard() {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-state-warning/10 flex items-center justify-center">
          <MailCheck className="h-10 w-10 text-state-warning" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary font-heading">
          No Token Found
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
          This page requires a valid email verification link. Please check your
          inbox and click the link we sent you.
        </p>
      </div>
      <Link href="/login">
        <Button className="w-full h-12 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-sm shadow-md shadow-accent-primary/20 transition-all duration-200">
          <span className="flex items-center gap-2">
            Go to Sign In <ArrowRight className="h-4 w-4" />
          </span>
        </Button>
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main content — reads token, calls API on mount
// ─────────────────────────────────────────────────────────
type VerifyState = "idle" | "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = React.useState<VerifyState>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const hasFired = React.useRef(false);

  React.useEffect(() => {
    if (!token || hasFired.current) return;
    hasFired.current = true;

    setState("loading");

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.status === "success") {
          setState("success");
          toast.success("Email verified!", {
            description: "Your account is now active.",
          });
        } else {
          setState("error");
          setErrorMessage(
            data.message ?? "The verification link is invalid or has expired."
          );
          toast.error("Verification failed", {
            description: data.message,
          });
        }
      })
      .catch(() => {
        setState("error");
        setErrorMessage(
          "Something went wrong. Please try again or contact support."
        );
        toast.error("Network error", {
          description: "Could not reach the server. Please try again.",
        });
      });
  }, [token]);

  // No token in URL
  if (!token) return <MissingTokenCard />;

  // Loading
  if (state === "loading" || state === "idle") return <VerifyingCard />;

  // Success
  if (state === "success") return <SuccessCard />;

  // Error
  return <ErrorCard message={errorMessage} />;
}

// ─────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────
export default function VerifyEmailPage() {
  return (
    <AuthLayoutShell
      heading="Verify your email"
      subheading="We sent a confirmation link to your inbox. Click it to activate your account."
    >
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
          </div>
        }
      >
        <VerifyEmailContent />
      </React.Suspense>
    </AuthLayoutShell>
  );
}
