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
    card: "from-rose-500/10 via-rose-500/5 to-pink-500/5 border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/15 hover:shadow-rose-500/10",
    iconBg: "bg-rose-500/10 border border-rose-500/20 text-rose-400",
    badge: "bg-rose-500/10 border border-rose-500/20 text-rose-400"
  },
  sky: {
    card: "from-sky-500/10 via-sky-500/5 to-teal-500/5 border-sky-500/20 hover:border-sky-500/40 hover:bg-sky-500/15 hover:shadow-sky-500/10",
    iconBg: "bg-sky-500/10 border border-sky-500/20 text-sky-400",
    badge: "bg-sky-500/10 border border-sky-500/20 text-sky-400"
  },
  amber: {
    card: "from-amber-500/10 via-amber-500/5 to-yellow-500/5 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/15 hover:shadow-amber-500/10",
    iconBg: "bg-amber-500/10 border border-amber-500/20 text-amber-400",
    badge: "bg-amber-500/10 border border-amber-500/20 text-amber-400"
  },
  slate: {
    card: "from-slate-200/10 via-slate-100/5 to-slate-200/5 border-slate-700/50 hover:border-slate-500 hover:bg-slate-800/20 hover:shadow-slate-500/5",
    iconBg: "bg-slate-800/30 border border-slate-700/50 text-slate-300",
    badge: "bg-slate-800/30 border border-slate-700/50 text-slate-300"
  }
};

export function WhyChooseUs() {
  return (
    <section className="bg-accent-navy text-white border-y border-white/10 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary-dim border border-accent-primary/20 text-xs font-semibold uppercase tracking-wider text-accent-primary animate-fade-in">
            <Shield className="h-3.5 w-3.5" />
            Security & Performance
          </div>
          <h2 className="text-3xl sm:text-4xl text-white font-heading font-extrabold tracking-tight">
            Why Choose Brand Estate?
          </h2>
          <p className="text-white/70 text-sm sm:text-base font-body font-normal">
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
                  <h3 className="text-white text-base sm:text-lg font-bold font-body tracking-tight">
                    {benefit.title}
                  </h3>
                  
                  {/* Description */}
                  <p className={cn(
                    "text-white/60 text-xs sm:text-sm font-body font-normal leading-relaxed",
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
