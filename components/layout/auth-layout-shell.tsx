"use client";

import * as React from "react";
import Link from "next/link";
import { Star, Home, TrendingUp, Shield, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

// ─────────────────────────────────────────────────────────
// Testimonials data
// ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "RealHoms made finding our dream home feel effortless. The platform's intuitive design and expert agents made everything seamless.",
    author: "Jessica & Mark Torres",
    role: "First-time Homebuyers",
    avatar: "JT",
  },
  {
    quote:
      "As a real estate agent, RealHoms's platform has tripled my listings' visibility. The tools are world-class.",
    author: "Michael Reeves",
    role: "Senior Real Estate Agent",
    avatar: "MR",
  },
  {
    quote:
      "We sold our property 40% faster than the market average thanks to RealHoms's professional network.",
    author: "Priya Anand",
    role: "Property Seller, Dubai",
    avatar: "PA",
  },
];

const STATS = [
  { value: "22k+", label: "Listings" },
  { value: "98%", label: "Satisfaction" },
  { value: "150+", label: "Cities" },
];

const FEATURES = [
  { icon: Home, label: "Premium Listings" },
  { icon: Shield, label: "Verified Agents" },
  { icon: TrendingUp, label: "Market Insights" },
];

interface AuthLayoutShellProps {
  children: React.ReactNode;
  heading: string;
  subheading?: string;
  panelTitle?: string;
  /** Show a back-to-home link below the form heading on mobile */
  showBackLink?: boolean;
}

export function AuthLayoutShell({
  children,
  heading,
  subheading,
  panelTitle = APP_NAME,
}: AuthLayoutShellProps) {
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[activeTestimonial];

  return (
    <div className="min-h-screen flex bg-bg-base dark:bg-dark-bg-base">
      {/* ═══════════════════════════════════════════════
          LEFT — Brand Visual Panel (desktop only)
          ═══════════════════════════════════════════════ */}
      <aside className="hidden lg:flex lg:w-[50%] xl:w-[52%] relative overflow-hidden flex-col shrink-0">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90')",
          }}
        />

        {/* Layered gradient overlay — richer depth */}
        <div className="absolute inset-0 bg-linear-to-b from-[#010611]/90 via-[#010611]/80 to-[#010611]/95" />
        <div className="absolute inset-0 bg-linear-to-tr from-accent-primary/20 via-transparent to-transparent" />

        {/* Glow orbs */}
        <div className="absolute top-1/3 -left-32 w-[480px] h-[480px] rounded-full bg-accent-primary/15 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-[60px] pointer-events-none" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-accent-primary/40 group-hover:shadow-accent-primary/60 group-hover:scale-105 transition-all duration-300">
              <img src="/favicon-32x32.png" alt="Logo" className="h-6 w-6" />
            </div>
            <span className="font-heading text-xl font-bold text-white tracking-tight">
              {panelTitle}
            </span>
          </Link>

          {/* Hero content */}
          <div className="flex-1 flex flex-col justify-center py-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm w-fit mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.12em]">
                Trusted Real Estate Platform
              </span>
            </div>

            <h2 className="text-[2.6rem] xl:text-5xl font-bold text-white leading-[1.12] font-heading mb-5">
              Find Your{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#4DA6FF] to-[#0067D2]">
                  Perfect
                </span>
              </span>
              <br />
              Property Today
            </h2>

            <p className="text-[15px] text-white/55 leading-relaxed max-w-[320px] mb-8">
              Join over 50,000 buyers, renters, and agents who trust RealHoms for premium property discovery.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-9">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/6 border border-white/10 backdrop-blur-sm text-white/65 text-[11px] font-semibold hover:bg-white/10 hover:text-white/85 transition-all duration-200"
                >
                  <Icon className="h-3.5 w-3.5 text-[#4DA6FF] shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex gap-0 mb-2">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex-1 text-center py-4",
                    i < STATS.length - 1 && "border-r border-white/10"
                  )}
                >
                  <div className="text-2xl xl:text-3xl font-bold text-white font-heading leading-none mb-1">
                    {value}
                  </div>
                  <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial card */}
          <div className="relative">
            {/* Subtle top separator */}
            <div className="w-full h-px bg-white/8 mb-5" />
            <div className="p-5 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-md">
              {/* Stars */}
              <div className="flex gap-0.5 mb-3.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative min-h-[70px]">
                {TESTIMONIALS.map((testimonial, idx) => (
                  <p
                    key={idx}
                    className={cn(
                      "absolute inset-0 text-[13px] text-white/70 leading-relaxed italic transition-all duration-600",
                      idx === activeTestimonial
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3 pointer-events-none"
                    )}
                  >
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                ))}
              </div>

              {/* Author row */}
              <div className="mt-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-accent-primary to-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white leading-tight">{t.author}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">{t.role}</div>
                  </div>
                </div>

                {/* Nav dots */}
                <div className="flex gap-1.5">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                        idx === activeTestimonial ? "w-6 bg-accent-primary" : "w-1.5 bg-white/25 hover:bg-white/40"
                      )}
                      aria-label={`Testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════
          RIGHT — Form Panel
          ═══════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-h-screen bg-bg-base dark:bg-[#080D16] overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-border-default/40 dark:border-dark-border-default/40">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-md shadow-accent-primary/25 border border-border-default/40">
              <img src="/favicon-32x32.png" alt="Logo" className="h-5 w-5" />
            </div>
            <span className="font-heading text-[17px] font-bold text-text-primary dark:text-white">
              {APP_NAME}
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-primary dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-5 py-8 sm:py-12 sm:px-8">
          <div className="w-full max-w-[420px]">
            {/* Heading block */}
            <div className="mb-7 text-center lg:text-left">
              <h1 className="text-[2rem] sm:text-[2.25rem] font-bold text-text-primary dark:text-white mb-2 font-heading tracking-tight">
                {heading}
              </h1>
              {subheading && (
                <p className="text-text-muted dark:text-[#8D93A5] text-sm leading-relaxed">
                  {subheading}
                </p>
              )}
            </div>

            {/* Form content */}
            <div className="space-y-0">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
