"use client";

import * as React from "react";
import { Shield, UserCheck, BarChart3, Search, Landmark, Eye, LineChart, Headphones, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitCard {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  theme: "rose" | "sky" | "amber" | "slate";
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
    theme: "rose",
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
    theme: "amber",
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
    theme: "rose",
    gridClass: "col-span-1 lg:col-span-2",
    isBig: true,
  },
];

const THEME_CLASSES = {
  rose: {
    card: "from-rose-50/50 to-pink-50/30 border-rose-200/60 hover:from-rose-50/70 hover:to-pink-50/50 hover:border-rose-300 hover:shadow-rose-500/5 dark:from-rose-950/20 dark:to-pink-950/10 dark:border-rose-500/25 dark:hover:border-rose-400/50 dark:hover:shadow-rose-500/15",
    iconBg: "bg-rose-100/80 border border-rose-200/80 text-rose-600 dark:bg-rose-900/30 dark:border-rose-800/40 dark:text-rose-400",
    badge: "bg-rose-100/80 border border-rose-200/80 text-rose-600 dark:bg-rose-900/30 dark:border-rose-800/40 dark:text-rose-400"
  },
  sky: {
    card: "from-sky-50/50 to-teal-50/30 border-sky-200/60 hover:from-sky-50/70 hover:to-teal-50/50 hover:border-sky-300 hover:shadow-sky-500/5 dark:from-sky-950/20 dark:to-teal-950/10 dark:border-sky-500/25 dark:hover:border-sky-400/50 dark:hover:shadow-sky-500/15",
    iconBg: "bg-sky-100/80 border border-sky-200/80 text-sky-600 dark:bg-sky-900/30 dark:border-sky-800/40 dark:text-sky-400",
    badge: "bg-sky-100/80 border border-sky-200/80 text-sky-600 dark:bg-sky-900/30 dark:border-sky-800/40 dark:text-sky-400"
  },
  amber: {
    card: "from-amber-50/50 to-yellow-50/30 border-amber-200/60 hover:from-amber-50/70 hover:to-yellow-50/50 hover:border-amber-300 hover:shadow-amber-500/5 dark:from-amber-950/20 dark:to-yellow-950/10 dark:border-amber-500/25 dark:hover:border-amber-400/50 dark:hover:shadow-amber-500/15",
    iconBg: "bg-amber-100/80 border border-amber-200/80 text-amber-600 dark:bg-amber-900/30 dark:border-amber-800/40 dark:text-amber-400",
    badge: "bg-amber-100/80 border border-amber-200/80 text-amber-600 dark:bg-amber-900/30 dark:border-amber-800/40 dark:text-amber-400"
  },
  slate: {
    card: "from-slate-50/60 to-slate-100/40 border-slate-200/80 hover:from-slate-50/80 hover:to-slate-100/60 hover:border-slate-300 hover:shadow-slate-500/5 dark:from-slate-900/20 dark:to-slate-950/10 dark:border-slate-800/80 dark:hover:border-slate-700 dark:hover:shadow-slate-500/10",
    iconBg: "bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700/50 dark:text-slate-300",
    badge: "bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700/50 dark:text-slate-300"
  }
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
                  "relative backdrop-blur-md rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-xl",
                  "bg-linear-to-br",
                  theme.card,
                  benefit.gridClass
                )}
              >
                {/* Card top icon row */}
                <div className="space-y-4">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 hover:scale-110",
                    theme.iconBg
                  )}>
                    <benefit.icon className="h-5 w-5 stroke-[1.8]" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-text-primary dark:text-white text-base sm:text-lg font-bold font-body tracking-tight">
                    {benefit.title}
                  </h3>
                  
                  {/* Description */}
                  <p className={cn(
                    "text-text-muted dark:text-white/60 text-xs sm:text-sm font-body font-normal leading-relaxed",
                    benefit.isBig ? "lg:line-clamp-6" : "line-clamp-4"
                  )}>
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative detail on Big Cards */}
                {benefit.isBig && (
                  <div className={cn(
                    "mt-6 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border w-fit",
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
