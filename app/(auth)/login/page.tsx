"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Zap,
} from "lucide-react";

import { AuthLayoutShell } from "@/components/layout/auth-layout-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth, getDashboardRoute } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldAlert } from "lucide-react";

// ─────────────────────────────────────────────────────────
// Demo accounts config
// ─────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    label: "Buyer",
    tag: "auth_user",
    email: "user@brandestate.com",
    dotColor: "bg-accent-primary",
    tagBg: "bg-accent-primary/8 dark:bg-accent-primary/12 text-accent-primary border-accent-primary/20",
  },
  {
    label: "Agent",
    tag: "agent",
    email: "agent@brandestate.com",
    dotColor: "bg-emerald-500",
    tagBg: "bg-emerald-500/8 dark:bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    label: "Admin",
    tag: "admin",
    email: "admin@brandestate.com",
    dotColor: "bg-violet-500",
    tagBg: "bg-violet-500/8 dark:bg-violet-500/12 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
];

// ─────────────────────────────────────────────────────────
// Google icon
// ─────────────────────────────────────────────────────────
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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
// Shared input field wrapper
// ─────────────────────────────────────────────────────────
function Field({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  Icon,
  rightEl,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  Icon: React.ElementType;
  rightEl?: React.ReactNode;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-text-secondary dark:text-[#C7CEDE] mb-1.5 tracking-tight">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-text-faint dark:text-[#4A5568] pointer-events-none" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={cn(
            "pl-10 pr-4 h-11 rounded-xl border text-[13px] text-text-primary dark:text-white placeholder:text-text-faint dark:placeholder:text-[#4A5568]",
            "bg-bg-elevated/60 dark:bg-white/5 border-border-default dark:border-white/8",
            "transition-all duration-200",
            "focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary focus:bg-bg-base dark:focus:bg-white/8",
            error && "border-state-error/70 focus:ring-state-error/20 focus:border-state-error bg-state-error/3",
            rightEl && "pr-11"
          )}
        />
        {rightEl && (
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
      <FieldError message={error} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string; root?: string }>({});
  const [isUnverified, setIsUnverified] = React.useState(false);
  
  // Suspension modal state
  const [showSuspendedModal, setShowSuspendedModal] = React.useState(false);
  const [suspendedReason, setSuspendedReason] = React.useState("");
  const [suspendedName, setSuspendedName] = React.useState("");

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsUnverified(false);
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.success) {
      if (result.isSuspended) {
        setSuspendedName(result.user?.name || "User");
        setSuspendedReason(result.suspendedReason || "No suspension reason specified.");
        setShowSuspendedModal(true);
        return;
      }
      if (result.isUnverified) {
        setIsUnverified(true);
        toast.warning("Email Verification Required", {
          description: "Please verify your email address to log in.",
        });
        return;
      }
      setErrors({ root: result.error });
      toast.error("Sign-in failed", { description: result.error });
      return;
    }
    toast.success(`Welcome back, ${result.user?.name?.split(" ")[0]}! 🎉`, {
      description: "You've been signed in successfully.",
    });
    router.push(getDashboardRoute(result.user!.role));
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    setIsUnverified(false);
    toast.loading("Signing in with Google...");
    const result = await googleLogin();
    toast.dismiss();
    setIsSubmitting(false);
    if (!result.success) {
      if (result.isSuspended) {
        setSuspendedName(result.user?.name || "User");
        setSuspendedReason(result.suspendedReason || "No suspension reason specified.");
        setShowSuspendedModal(true);
        return;
      }
      toast.error("Google sign-in failed", { description: result.error });
      return;
    }
    toast.success(`Welcome back, ${result.user?.name?.split(" ")[0]}! 🎉`, {
      description: "You've been signed in successfully with Google.",
    });
    router.push(getDashboardRoute(result.user!.role));
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123");
    setErrors({});
    setIsUnverified(false);
  };

  return (
    <AuthLayoutShell
      heading="Welcome back"
      subheading="Sign in to access your dashboard, saved properties, and inquiries."
    >
      {/* ── Demo accounts ──────────────────────────────── */}
      <div className="mb-5 rounded-xl border border-border-default/60 dark:border-white/8 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-elevated/60 dark:bg-white/4 border-b border-border-default/60 dark:border-white/8">
          <Zap className="h-3.5 w-3.5 text-accent-primary" />
          <span className="text-[11px] font-bold text-text-muted dark:text-[#8D93A5] uppercase tracking-widest">
            Quick Demo Access
          </span>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border-default/60 dark:divide-white/8">
          {DEMO_ACCOUNTS.map(({ label, email: demoEmail, dotColor, tagBg }) => (
            <button
              key={demoEmail}
              type="button"
              onClick={() => fillDemo(demoEmail)}
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 text-center hover:bg-bg-elevated/80 dark:hover:bg-white/6 transition-all duration-150 cursor-pointer group"
            >
              <span className={cn("h-2 w-2 rounded-full transition-transform group-hover:scale-125", dotColor)} />
              <span className="text-[11px] font-bold text-text-primary dark:text-white">{label}</span>
              <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full border uppercase tracking-wide", tagBg)}>
                {label === "Buyer" ? "auth_user" : label.toLowerCase()}
              </span>
            </button>
          ))}
        </div>
        <div className="px-4 py-2 bg-bg-elevated/30 dark:bg-white/2 border-t border-border-default/60 dark:border-white/8">
          <p className="text-[10px] text-text-faint dark:text-[#4A5568] text-center">
            All use password:{" "}
            <code className="font-mono font-bold text-text-muted dark:text-[#8D93A5] bg-bg-elevated dark:bg-white/8 px-1.5 py-0.5 rounded text-[10px]">
              Password123
            </code>
          </p>
        </div>
      </div>

      {/* ── Unverified Alert ────────────────────────────── */}
      {isUnverified && (
        <div className="mb-4 p-4 rounded-xl bg-amber-500/8 dark:bg-amber-500/12 border border-amber-500/20 text-[13px] text-amber-600 dark:text-amber-400 font-medium animate-fade-in space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Please verify your email. Check your inbox for the verification link.</span>
          </div>
          <p className="text-[11px] text-text-muted dark:text-[#8D93A5] font-normal pl-3.5">
            Didn&apos;t receive it? You can register again with a different email or try resubmitting via the{" "}
            <Link href="/register" className="font-semibold text-accent-primary hover:underline">
              Registration Page
            </Link>.
          </p>
        </div>
      )}

      {/* ── Root error ─────────────────────────────────── */}
      {errors.root && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-state-error/8 border border-state-error/20 text-[13px] text-state-error font-medium animate-fade-in flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-state-error shrink-0" />
          {errors.root}
        </div>
      )}

      {/* ── Form ───────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field
          id="login-email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(v) => { setEmail(v); setErrors(p => ({ ...p, email: undefined })); setIsUnverified(false); }}
          error={errors.email}
          Icon={Mail}
          autoComplete="email"
        />

        <Field
          id="login-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(v) => { setPassword(v); setErrors(p => ({ ...p, password: undefined })); setIsUnverified(false); }}
          error={errors.password}
          Icon={Lock}
          autoComplete="current-password"
          rightEl={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-faint hover:text-text-primary dark:text-[#4A5568] dark:hover:text-white transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-[15px] w-[15px]" /> : <Eye className="h-[15px] w-[15px]" />}
            </button>
          }
        />

        <div className="flex justify-end -mt-1">
          <Link
            href="/forgot-password"
            className="text-[12px] font-semibold text-accent-primary hover:text-accent-primary-hov hover:underline transition-colors duration-200"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-[13px] shadow-sm shadow-accent-primary/20 hover:shadow-md hover:shadow-accent-primary/30 transition-all duration-200 disabled:opacity-60 mt-1"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign In
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* ── Divider ────────────────────────────────────── */}
      <div className="relative my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-border-default dark:bg-white/8" />
        <span className="text-[11px] font-medium text-text-faint dark:text-[#4A5568] shrink-0">or continue with</span>
        <div className="flex-1 h-px bg-border-default dark:bg-white/8" />
      </div>

      {/* ── Google ─────────────────────────────────────── */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogle}
        disabled={isSubmitting}
        className="w-full h-11 rounded-xl border-border-default dark:border-white/12 dark:bg-white/4 dark:hover:bg-white/8 dark:text-white font-semibold text-[13px] text-text-secondary hover:text-text-primary transition-all duration-200 flex items-center justify-center gap-2.5 hover:bg-bg-elevated"
      >
        <GoogleIcon className="h-4 w-4 shrink-0" />
        Continue with Google
      </Button>

      {/* ── Footer ─────────────────────────────────────── */}
      <p className="text-center text-[13px] text-text-muted dark:text-[#8D93A5] mt-7">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-accent-primary hover:text-accent-primary-hov hover:underline transition-colors duration-200"
        >
          Create one free
        </Link>
      </p>

      {/* ── Suspension Modal ────────────────────────────── */}
      <Dialog open={showSuspendedModal} onOpenChange={setShowSuspendedModal}>
        <DialogContent className="max-w-md bg-bg-surface border-border-default dark:border-slate-800 text-text-primary dark:text-slate-200 rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-4 border-b border-border-default dark:border-slate-800/60">
            <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-3">
              <ShieldAlert className="h-7 w-7 animate-pulse" />
            </div>
            <DialogTitle className="text-text-primary dark:text-white text-lg font-bold font-heading">Account Suspended</DialogTitle>
            <DialogDescription className="text-text-muted dark:text-slate-400 text-xs mt-1">
              Access to this account has been disabled by platform administration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-center">
            <p className="text-sm font-semibold text-text-primary dark:text-white">Hello, {suspendedName}</p>
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-left space-y-2">
              <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider block">Reason for Suspension</span>
              <p className="text-xs text-text-secondary dark:text-slate-300 leading-relaxed font-medium">
                &ldquo;{suspendedReason}&rdquo;
              </p>
            </div>
            <p className="text-xs text-text-muted dark:text-slate-500 leading-relaxed max-w-sm mx-auto">
              If you believe this is a mistake or wish to appeal this decision, please contact our support team at{" "}
              <a href="mailto:support@brandestate.com" className="text-accent-primary font-bold hover:underline">
                support@brandestate.com
              </a>.
            </p>
          </div>
          <div className="pt-2">
            <Button
              onClick={() => setShowSuspendedModal(false)}
              className="w-full h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-xs transition-all duration-200"
            >
              Understand & Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AuthLayoutShell>
  );
}
