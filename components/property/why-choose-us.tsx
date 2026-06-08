"use client";

import * as React from "react";
import { Shield, UserCheck, BarChart3, Landmark, Eye, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitCard {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  theme: "indigo" | "sky" | "violet" | "slate" | "teal";
  gridClass: string;
  isBig?: boolean;
}

const BENEFITS: BenefitCard[] = [
  // ROW 1
  {
    id: 1,
    icon: Shield,
    title: "Verified Listings Only",
    description: "Every single property listing undergoes a rigorous multi-point document check and ownership verification by our administration team before publishing.",
    theme: "indigo",
    gridClass: "md:col-span-2 lg:col-span-2",
    isBig: true,
  },
  {
    id: 2,
    icon: UserCheck,
    title: "Elite 1% Local Agents",
    description: "Connect exclusively with local agents in the top percentile of sales and customer satisfaction.",
    theme: "sky",
    gridClass: "col-span-1 lg:col-span-1",
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track views, saves, listing conversion ratios, and local pricing trends instantly through a high-performance console dashboard built for property owners and listing agents.",
    theme: "violet",
    gridClass: "col-span-1 lg:col-span-1 lg:row-span-2",
    isBig: true,
  },
  // ROW 2
  {
    id: 4,
    icon: Landmark,
    title: "Secure Escrow Pipeline",
    description: "Safeguarded financial escrow transactions built directly into contract templates to guarantee deposit safety.",
    theme: "slate",
    gridClass: "col-span-1 lg:col-span-1",
  },
  {
    id: 5,
    icon: Eye,
    title: "Virtual HD Tours & Interactive Layouts",
    description: "Experience homes from anywhere with aerial drone footage, professional walk-throughs, and interactive 3D floor plan visualizers built natively into listings.",
    theme: "teal",
    gridClass: "col-span-1 lg:col-span-2",
    isBig: true,
  },
];

const THEME_CLASSES = {
  indigo: {
    cardLight: "bg-linear-to-br from-indigo-100 via-indigo-50 to-blue-100/80",
    cardDark: "dark:from-indigo-950/55 dark:via-[#131E33] dark:to-blue-950/30",
    border: "border-indigo-300/80 hover:border-indigo-500/70 dark:border-indigo-500/25 dark:hover:border-indigo-400/60",
    orb: "bg-indigo-500/25 dark:bg-indigo-500/30",
    shadow: "hover:shadow-indigo-300/60 dark:hover:shadow-indigo-500/20",
    iconBg: "bg-white border border-indigo-300 text-indigo-600 shadow-sm dark:bg-indigo-500/15 dark:border-indigo-500/40 dark:text-indigo-400",
    badge: "bg-indigo-200/70 border border-indigo-300 text-indigo-800 dark:bg-indigo-500/15 dark:border-indigo-500/40 dark:text-indigo-300",
    title: "text-indigo-950 dark:text-white",
    desc: "text-indigo-900/65 dark:text-white/60",
  },
  sky: {
    cardLight: "bg-linear-to-br from-sky-100 via-sky-50 to-cyan-100/80",
    cardDark: "dark:from-sky-950/55 dark:via-[#131E33] dark:to-cyan-950/30",
    border: "border-sky-300/80 hover:border-sky-500/70 dark:border-sky-500/25 dark:hover:border-sky-400/60",
    orb: "bg-sky-500/25 dark:bg-sky-500/30",
    shadow: "hover:shadow-sky-300/60 dark:hover:shadow-sky-500/20",
    iconBg: "bg-white border border-sky-300 text-sky-600 shadow-sm dark:bg-sky-500/15 dark:border-sky-500/40 dark:text-sky-400",
    badge: "bg-sky-200/70 border border-sky-300 text-sky-800 dark:bg-sky-500/15 dark:border-sky-500/40 dark:text-sky-300",
    title: "text-sky-950 dark:text-white",
    desc: "text-sky-900/65 dark:text-white/60",
  },
  violet: {
    cardLight: "bg-linear-to-br from-violet-100 via-purple-50 to-indigo-100/80",
    cardDark: "dark:from-violet-950/55 dark:via-[#131E33] dark:to-indigo-950/30",
    border: "border-violet-300/80 hover:border-violet-500/70 dark:border-violet-500/25 dark:hover:border-violet-400/60",
    orb: "bg-violet-500/25 dark:bg-violet-500/30",
    shadow: "hover:shadow-violet-300/60 dark:hover:shadow-violet-500/20",
    iconBg: "bg-white border border-violet-300 text-violet-600 shadow-sm dark:bg-violet-500/15 dark:border-violet-500/40 dark:text-violet-400",
    badge: "bg-violet-200/70 border border-violet-300 text-violet-800 dark:bg-violet-500/15 dark:border-violet-500/40 dark:text-violet-300",
    title: "text-violet-950 dark:text-white",
    desc: "text-violet-900/65 dark:text-white/60",
  },
  slate: {
    cardLight: "bg-linear-to-br from-slate-200 via-slate-100 to-slate-100/80",
    cardDark: "dark:from-slate-800/50 dark:via-[#131E33] dark:to-slate-900/30",
    border: "border-slate-300/80 hover:border-slate-500/60 dark:border-slate-600/30 dark:hover:border-slate-500/60",
    orb: "bg-slate-500/20 dark:bg-slate-500/20",
    shadow: "hover:shadow-slate-300/60 dark:hover:shadow-slate-500/15",
    iconBg: "bg-white border border-slate-300 text-slate-600 shadow-sm dark:bg-slate-700/40 dark:border-slate-600/50 dark:text-slate-300",
    badge: "bg-slate-200/80 border border-slate-300 text-slate-700 dark:bg-slate-700/40 dark:border-slate-600/50 dark:text-slate-300",
    title: "text-slate-900 dark:text-white",
    desc: "text-slate-700 dark:text-white/60",
  },
  teal: {
    cardLight: "bg-linear-to-br from-teal-100 via-teal-50 to-emerald-100/80",
    cardDark: "dark:from-teal-950/55 dark:via-[#131E33] dark:to-emerald-950/30",
    border: "border-teal-300/80 hover:border-teal-500/70 dark:border-teal-500/25 dark:hover:border-teal-400/60",
    orb: "bg-teal-500/25 dark:bg-teal-500/30",
    shadow: "hover:shadow-teal-300/60 dark:hover:shadow-teal-500/20",
    iconBg: "bg-white border border-teal-300 text-teal-600 shadow-sm dark:bg-teal-500/15 dark:border-teal-500/40 dark:text-teal-400",
    badge: "bg-teal-200/70 border border-teal-300 text-teal-800 dark:bg-teal-500/15 dark:border-teal-500/40 dark:text-teal-300",
    title: "text-teal-950 dark:text-white",
    desc: "text-teal-900/65 dark:text-white/60",
  },
};

export function WhyChooseUs() {
  return (
    <section className="bg-bg-alt/45 dark:bg-accent-navy text-text-primary dark:text-white border-y border-border-default/35 dark:border-white/10 py-16 sm:py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary-dim border border-accent-primary/20 text-xs font-semibold uppercase tracking-wider text-accent-primary animate-fade-in">
            <Shield className="h-3.5 w-3.5" />
            Security & Performance
          </div>
          <h2 className="text-3xl sm:text-4xl text-text-primary dark:text-white font-heading font-extrabold tracking-tight">
            Why Choose Brand Estate?
          </h2>
          <p className="text-text-muted dark:text-white/70 text-sm sm:text-base font-body font-normal">
            We merge sophisticated property management analytics, certified agent channels, and client-centric features to deliver a seamless real estate SaaS experience.
          </p>
        </div>

        {/* Asymmetrical 4-column, 2-row grid layout on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 items-stretch">
          {BENEFITS.map((benefit) => {
            const theme = THEME_CLASSES[benefit.theme];
            return (
              <div
                key={benefit.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl bg-linear-to-br",
                  theme.cardLight,
                  theme.cardDark,
                  theme.border,
                  theme.shadow,
                  benefit.gridClass
                )}
              >
                {/* Decorative blurred accent orb — top-right corner */}
                <div
                  className={cn(
                    "absolute -top-8 -right-8 w-36 h-36 rounded-full blur-2xl pointer-events-none",
                    theme.orb
                  )}
                />

                {/* Subtle dot-grid texture overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.07]"
                  style={{
                    backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />

                {/* Card content */}
                <div className="space-y-4 relative z-10">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110",
                    theme.iconBg
                  )}>
                    <benefit.icon className="h-5 w-5 stroke-[1.8]" />
                  </div>

                  {/* Title */}
                  <h3 className={cn("text-base sm:text-lg font-bold font-body tracking-tight", theme.title)}>
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className={cn(
                    "text-xs sm:text-sm font-body font-normal leading-relaxed",
                    benefit.isBig ? "lg:line-clamp-6" : "line-clamp-4",
                    theme.desc
                  )}>
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative badge on Big Cards */}
                {benefit.isBig && (
                  <div className={cn(
                    "mt-6 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border w-fit relative z-10",
                    theme.badge
                  )}>
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    {benefit.id === 1 ? "Verified Trust" : benefit.id === 3 ? "Analytics Power" : "HD Virtual Experience"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
