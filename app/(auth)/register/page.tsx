"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Home,
  Briefcase,
  MailCheck,
} from "lucide-react";

import { AuthLayoutShell } from "@/components/layout/auth-layout-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

// ─────────────────────────────────────────────────────────
// Role selector card config
// ─────────────────────────────────────────────────────────
const ROLE_OPTIONS: Array<{
  role: UserRole;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  features: string[];
  accentClass: string;
  bgClass: string;
}> = [
  {
    role: "auth_user",
    label: "Buyer / Renter",
    sublabel: "I'm looking for a property",
    icon: Home,
    features: ["Save favorite listings", "Submit inquiries to agents", "Access personal dashboard"],
    accentClass: "border-accent-primary",
    bgClass: "bg-accent-primary/5 dark:bg-accent-primary/10",
  },
  {
    role: "agent",
    label: "Real Estate Agent",
    sublabel: "I represent properties",
    icon: Briefcase,
    features: ["Publish & manage listings", "Receive buyer inquiries", "Agent analytics dashboard"],
    accentClass: "border-emerald-500 dark:border-emerald-400",
    bgClass: "bg-emerald-500/5 dark:bg-emerald-500/10",
  },
];

// ─────────────────────────────────────────────────────────
// Google Icon SVG
// ─────────────────────────────────────────────────────────
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// Field error
// ─────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-[11px] text-state-error flex items-center gap-1.5 animate-fade-in font-medium">
      <span className="inline-block h-1 w-1 rounded-full bg-state-error shrink-0" />
      {message}
    </p>
  );
}

// ─────────────────────────────────────────────────────────
// Password strength meter
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
  const colors = [
    "bg-state-error",
    "bg-state-error",
    "bg-state-warning",
    "bg-emerald-400",
    "bg-emerald-500",
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? colors[score] : "bg-border-default"
            )}
          />
        ))}
      </div>
      <p className={cn("text-[11px] font-medium", score >= 3 ? "text-emerald-600 dark:text-emerald-400" : score === 2 ? "text-state-warning" : "text-state-error")}>
        {label}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Email sent confirmation card
// ─────────────────────────────────────────────────────────
function EmailSentCard({ email }: { email: string }) {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
            <MailCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary font-heading">Check your inbox!</h2>
        <p className="text-sm text-text-muted leading-relaxed">
          We&apos;ve sent a verification link to
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated border border-border-default">
          <Mail className="h-3.5 w-3.5 text-accent-primary shrink-0" />
          <span className="text-sm font-semibold text-text-primary truncate max-w-[220px]">{email}</span>
        </div>
        <p className="text-xs text-text-faint mt-2">
          Click the link in your email to activate your account. The link expires in 24 hours.
        </p>
      </div>
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-accent-primary/6 border border-accent-primary/20 text-left">
        <CheckCircle2 className="h-4 w-4 text-accent-primary shrink-0 mt-0.5" />
        <p className="text-xs text-text-secondary leading-relaxed">
          Didn&apos;t receive it? Check your spam folder, or{" "}
          <Link href="/register" className="font-semibold text-accent-primary hover:underline">register again</Link>{" "}
          to resend.
        </p>
      </div>
      <Link href="/login">
        <Button className="w-full h-11 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-[13px] shadow-sm shadow-accent-primary/20 transition-all duration-200">
          <span className="flex items-center gap-2">Go to Sign In <ArrowRight className="h-4 w-4" /></span>
        </Button>
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("auth_user");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [registered, setRegistered] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
    root?: string;
  }>({});

  // ── Validation (matches API: 8+ chars, digit required) ─
  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 8) errs.password = "Minimum 8 characters required.";
    else if (!/\d/.test(password)) errs.password = "Password must include at least one number.";
    if (!confirmPassword) errs.confirm = "Please confirm your password.";
    else if (password !== confirmPassword) errs.confirm = "Passwords do not match.";
    return errs;
  };

  // ── Submit → real API ──────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password, role: selectedRole }),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.message ?? "Registration failed. Please try again.";
        if (data.error === "EmailAlreadyExists") {
          setErrors({ email: "An account with this email already exists." });
        } else {
          setErrors({ root: msg });
        }
        toast.error("Registration failed", { description: msg });
        return;
      }

      // Success — show confirmation card
      toast.success(`Welcome, ${data.data?.name?.split(" ")[0] ?? name.split(" ")[0]}! 🏡`, {
        description: "Check your inbox to verify your email.",
      });
      setRegistered(true);
    } catch {
      setErrors({ root: "Network error. Please check your connection and try again." });
      toast.error("Network error", { description: "Could not reach the server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Google register (mock — no OAuth API yet) ──────────
  const handleGoogle = () => {
    toast.info("Google sign-up coming soon!", { description: "Use email registration for now." });
  };

  if (registered) {
    return (
      <AuthLayoutShell
        heading="Verify your email"
        subheading="One last step — check your inbox to activate your account."
      >
        <EmailSentCard email={email} />
      </AuthLayoutShell>
    );
  }

  return (
    <AuthLayoutShell
      heading="Create your account"
      subheading="Join thousands of buyers, renters, and agents on Brand Estate."
    >
      {/* Root error */}
      {errors.root && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-state-error/8 border border-state-error/20 text-[13px] text-state-error font-medium animate-fade-in flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-state-error shrink-0" />
          {errors.root}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* ─── Role Selector ──────────────────────────────── */}
        <div>
          <p className="text-[13px] font-semibold text-text-secondary dark:text-[#C7CEDE] mb-2.5 tracking-tight">I am joining as a</p>
          <div className="grid grid-cols-2 gap-2.5">
            {ROLE_OPTIONS.map(({ role, label, sublabel, icon: Icon, features, accentClass, bgClass }) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "relative p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer",
                    "hover:scale-[1.01] active:scale-[0.99]",
                    isSelected
                      ? cn("shadow-md", accentClass, bgClass)
                      : "border-border-default dark:border-white/10 hover:border-border-subtle dark:hover:border-white/20 bg-bg-elevated/30 dark:bg-white/4"
                  )}
                  aria-pressed={isSelected}
                >
                  {isSelected && (
                    <CheckCircle2 className="absolute top-3 right-3 h-3.5 w-3.5 text-accent-primary" />
                  )}
                  <Icon className={cn("h-5 w-5 mb-2", isSelected ? "text-accent-primary" : "text-text-muted dark:text-[#8D93A5]")} />
                  <div className="text-[13px] font-bold text-text-primary dark:text-white leading-tight">{label}</div>
                  <div className="text-[11px] text-text-muted dark:text-[#8D93A5] mt-0.5 leading-snug">{sublabel}</div>
                  {isSelected && (
                    <ul className="mt-2.5 space-y-1">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-[11px] text-text-secondary dark:text-[#C7CEDE]">
                          <span className="h-1 w-1 rounded-full bg-accent-primary shrink-0 mt-1.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Name ───────────────────────────────────────── */}
        <div>
          <label htmlFor="reg-name" className="block text-[13px] font-semibold text-text-secondary dark:text-[#C7CEDE] mb-1.5 tracking-tight">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-text-faint dark:text-[#4A5568] pointer-events-none" />
            <Input
              id="reg-name"
              type="text"
              placeholder="John Smith"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
              autoComplete="name"
              className={cn(
                "pl-10 h-11 rounded-xl border text-[13px] bg-bg-elevated/60 dark:bg-white/5 border-border-default dark:border-white/8 text-text-primary dark:text-white placeholder:text-text-faint dark:placeholder:text-[#4A5568] transition-all duration-200",
                "focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary focus:bg-bg-base dark:focus:bg-white/8",
                errors.name && "border-state-error/70 focus:ring-state-error/20 focus:border-state-error"
              )}
            />
          </div>
          <FieldError message={errors.name} />
        </div>

        {/* ─── Email ──────────────────────────────────────── */}
        <div>
          <label htmlFor="reg-email" className="block text-[13px] font-semibold text-text-secondary dark:text-[#C7CEDE] mb-1.5 tracking-tight">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-text-faint dark:text-[#4A5568] pointer-events-none" />
            <Input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
              autoComplete="email"
              className={cn(
                "pl-10 h-11 rounded-xl border text-[13px] bg-bg-elevated/60 dark:bg-white/5 border-border-default dark:border-white/8 text-text-primary dark:text-white placeholder:text-text-faint dark:placeholder:text-[#4A5568] transition-all duration-200",
                "focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary focus:bg-bg-base dark:focus:bg-white/8",
                errors.email && "border-state-error/70 focus:ring-state-error/20 focus:border-state-error"
              )}
            />
          </div>
          <FieldError message={errors.email} />
        </div>

        {/* ─── Password ───────────────────────────────────── */}
        <div>
          <label htmlFor="reg-password" className="block text-[13px] font-semibold text-text-secondary dark:text-[#C7CEDE] mb-1.5 tracking-tight">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-text-faint dark:text-[#4A5568] pointer-events-none" />
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
              autoComplete="new-password"
              className={cn(
                "pl-10 pr-11 h-11 rounded-xl border text-[13px] bg-bg-elevated/60 dark:bg-white/5 border-border-default dark:border-white/8 text-text-primary dark:text-white placeholder:text-text-faint dark:placeholder:text-[#4A5568] transition-all duration-200",
                "focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary focus:bg-bg-base dark:focus:bg-white/8",
                errors.password && "border-state-error/70 focus:ring-state-error/20 focus:border-state-error"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-text-faint hover:text-text-primary dark:text-[#4A5568] dark:hover:text-white transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-[15px] w-[15px]" /> : <Eye className="h-[15px] w-[15px]" />}
            </button>
          </div>
          <FieldError message={errors.password} />
          <PasswordStrength password={password} />
        </div>

        {/* ─── Confirm Password ────────────────────────────── */}
        <div>
          <label htmlFor="reg-confirm" className="block text-[13px] font-semibold text-text-secondary dark:text-[#C7CEDE] mb-1.5 tracking-tight">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-text-faint dark:text-[#4A5568] pointer-events-none" />
            <Input
              id="reg-confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirm: undefined })); }}
              autoComplete="new-password"
              className={cn(
                "pl-10 pr-11 h-11 rounded-xl border text-[13px] bg-bg-elevated/60 dark:bg-white/5 border-border-default dark:border-white/8 text-text-primary dark:text-white placeholder:text-text-faint dark:placeholder:text-[#4A5568] transition-all duration-200",
                "focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary focus:bg-bg-base dark:focus:bg-white/8",
                errors.confirm && "border-state-error/70 focus:ring-state-error/20 focus:border-state-error",
                confirmPassword && password && confirmPassword === password && !errors.confirm && "border-emerald-500/70 focus:ring-emerald-500/20"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-text-faint hover:text-text-primary dark:text-[#4A5568] dark:hover:text-white transition-colors cursor-pointer"
              aria-label={showConfirm ? "Hide" : "Show"}
            >
              {showConfirm ? <EyeOff className="h-[15px] w-[15px]" /> : <Eye className="h-[15px] w-[15px]" />}
            </button>
          </div>
          <FieldError message={errors.confirm} />
          {!errors.confirm && confirmPassword && password === confirmPassword && (
            <p className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-fade-in font-medium">
              <CheckCircle2 className="h-3 w-3" />
              Passwords match
            </p>
          )}
        </div>

        {/* ─── Submit ─────────────────────────────────────── */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-[13px] shadow-sm shadow-accent-primary/20 hover:shadow-md hover:shadow-accent-primary/30 transition-all duration-200 disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Creating account...</span>
          ) : (
            <span className="flex items-center gap-2">Create Account <ArrowRight className="h-4 w-4" /></span>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-border-default dark:bg-white/8" />
        <span className="text-[11px] font-medium text-text-faint dark:text-[#4A5568] shrink-0">or</span>
        <div className="flex-1 h-px bg-border-default dark:bg-white/8" />
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogle}
        disabled={isSubmitting}
        className="w-full h-11 rounded-xl border-border-default dark:border-white/12 dark:bg-white/4 dark:hover:bg-white/8 dark:text-white hover:bg-bg-elevated font-semibold text-[13px] text-text-secondary hover:text-text-primary transition-all duration-200 flex items-center justify-center gap-2.5"
      >
        <GoogleIcon className="h-4 w-4 shrink-0" />
        Sign up with Google
      </Button>

      {/* Footer */}
      <p className="text-center text-[13px] text-text-muted dark:text-[#8D93A5] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent-primary hover:text-accent-primary-hov hover:underline transition-colors duration-200">
          Sign in
        </Link>
      </p>
    </AuthLayoutShell>
  );
}
