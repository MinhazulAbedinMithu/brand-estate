"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import { AuthLayoutShell } from "@/components/layout/auth-layout-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// Password strength indicator
// ─────────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const label = ["Too weak", "Weak", "Fair", "Strong", "Very strong"][score];
  const colors = ["bg-state-error", "bg-state-error", "bg-state-warning", "bg-emerald-400", "bg-emerald-500"];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300", i < score ? colors[score] : "bg-border-default")} />
        ))}
      </div>
      <p className={cn("text-[11px] font-medium", score >= 3 ? "text-emerald-600 dark:text-emerald-400" : score === 2 ? "text-state-warning" : "text-state-error")}>{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Invalid token card
// ─────────────────────────────────────────────────────────
function InvalidTokenCard() {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-state-error/10 flex items-center justify-center">
          <ShieldAlert className="h-10 w-10 text-state-error" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary font-heading">Link Expired</h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
      </div>
      <Link href="/forgot-password">
        <Button className="w-full h-12 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-sm shadow-md shadow-accent-primary/20 transition-all duration-200">
          Request New Link
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
  );
}

// ─────────────────────────────────────────────────────────
// Success card
// ─────────────────────────────────────────────────────────
function SuccessCard() {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary font-heading">Password Updated!</h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
      </div>
      <Link href="/login">
        <Button className="w-full h-12 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-sm shadow-md shadow-accent-primary/20 transition-all duration-200">
          <span className="flex items-center gap-2">
            Sign In Now <ArrowRight className="h-4 w-4" />
          </span>
        </Button>
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page — uses Suspense boundary internally via useSearchParams
// ─────────────────────────────────────────────────────────
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [invalidToken, setInvalidToken] = React.useState(false);
  const [errors, setErrors] = React.useState<{ password?: string; confirm?: string }>({});

  // If no token in URL or API said invalid — render the invalid card
  if (!token || invalidToken) {
    return <InvalidTokenCard />;
  }

  if (done) {
    return <SuccessCard />;
  }

  const validate = () => {
    const errs: typeof errors = {};
    if (!password) errs.password = "New password is required.";
    else if (password.length < 8) errs.password = "Minimum 8 characters required.";
    else if (!/\d/.test(password)) errs.password = "Password must include at least one number.";
    if (!confirm) errs.confirm = "Please confirm your new password.";
    else if (confirm !== password) errs.confirm = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword: confirm }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "PasswordMismatch") {
          setErrors({ confirm: "Passwords do not match." });
        } else if (data.error === "InvalidOrExpiredToken") {
          setInvalidToken(true);
          return;
        } else {
          setErrors({ password: data.message ?? "An error occurred. Please try again." });
        }
        toast.error("Reset failed", { description: data.message });
        return;
      }

      setDone(true);
      toast.success("Password reset successful!", {
        description: "You can now sign in with your new password.",
      });
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setErrors({ password: "Network error. Please check your connection and try again." });
      toast.error("Network error", { description: "Could not reach the server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Token info pill */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
          Reset link verified — set your new password below.
        </p>
      </div>

      {/* New password */}
      <div>
        <label htmlFor="reset-password" className="block text-sm font-semibold text-text-primary mb-2">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <Input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a new password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
            autoComplete="new-password"
            className={cn(
              "pl-10 pr-12 h-12 rounded-full border-border-default bg-bg-elevated/50 text-text-primary placeholder:text-text-faint transition-all duration-200",
              "focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary",
              errors.password && "border-state-error focus:ring-state-error/30 focus:border-state-error"
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-text-muted hover:text-text-primary"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-state-error flex items-center gap-1 animate-fade-in">
            <span className="inline-block h-1 w-1 rounded-full bg-state-error shrink-0" />{errors.password}
          </p>
        )}
        <PasswordStrength password={password} />
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="reset-confirm" className="block text-sm font-semibold text-text-primary mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <Input
            id="reset-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your new password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: undefined })); }}
            autoComplete="new-password"
            className={cn(
              "pl-10 pr-12 h-12 rounded-full border-border-default bg-bg-elevated/50 text-text-primary placeholder:text-text-faint transition-all duration-200",
              "focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary",
              errors.confirm && "border-state-error focus:ring-state-error/30 focus:border-state-error",
              confirm && password && confirm === password && !errors.confirm && "border-emerald-500"
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-text-muted hover:text-text-primary"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.confirm ? (
          <p className="mt-1.5 text-xs text-state-error flex items-center gap-1 animate-fade-in">
            <span className="inline-block h-1 w-1 rounded-full bg-state-error shrink-0" />{errors.confirm}
          </p>
        ) : confirm && password === confirm ? (
          <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
            <CheckCircle2 className="h-3 w-3" />Passwords match
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-sm shadow-md shadow-accent-primary/20 hover:shadow-lg hover:shadow-accent-primary/30 transition-all duration-200 disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Updating password...</span>
        ) : (
          <span className="flex items-center gap-2">Reset Password <ArrowRight className="h-4 w-4" /></span>
        )}
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary hover:underline transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayoutShell
      heading="Set new password"
      subheading="Your new password must be at least 6 characters long."
    >
      <React.Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
        </div>
      }>
        <ResetPasswordForm />
      </React.Suspense>
    </AuthLayoutShell>
  );
}
