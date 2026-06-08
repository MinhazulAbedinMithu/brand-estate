"use client";

import * as React from "react";
import { Shield, UserCheck, BarChart3, Search, Landmark, Eye, LineChart, Headphones, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitCard {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  isBig: boolean;
  gridClass: string;
}

const BENEFITS: BenefitCard[] = [
  // ROW 1
  {
    id: 1,
    icon: Shield,
    title: "Verified Listings Only",
    description: "Every single property listing goes through a thorough multi-point document check by administrators before publication.",
    isBig: false,
    gridClass: "lg:col-span-1",
  },
  {
    id: 2,
    icon: UserCheck,
    title: "Elite 1% Local Agents",
    description: "Connect exclusively with experienced agents carrying top transaction histories and verified licensing profiles.",
    isBig: false,
    gridClass: "lg:col-span-1",
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Real-Time Advanced Analytics Platform",
    description: "Whether you are a listing agent or property owner, track traffic metrics, save counts, listing inquiries, and overall performance ratios through a centralized, high-fidelity dashboard console. Leverage predictive market charts to adjust rates instantly.",
    isBig: true,
    gridClass: "lg:col-span-2 bg-linear-to-br from-accent-primary/20 to-accent-primary-dim",
  },
  {
    id: 4,
    icon: Search,
    title: "Micro-Search Engine",
    description: "Filter properties with precision based on location coordinates, amenities checklists, and square footage spans.",
    isBig: false,
    gridClass: "lg:col-span-1",
  },
  
  // ROW 2
  {
    id: 5,
    icon: Landmark,
    title: "Secure Escrow Pipeline",
    description: "Safeguarded financial escrow transactions built directly into contract templates to guarantee deposit safety.",
    isBig: false,
    gridClass: "lg:col-span-1",
  },
  {
    id: 6,
    icon: Eye,
    title: "Virtual HD Tours & Interactive Layouts",
    description: "Experience homes from anywhere. Our platform supports high-fidelity aerial drone footage, professional interior photography, and high-performance interactive 2D and 3D floor plan visualizers built right into listing details.",
    isBig: true,
    gridClass: "lg:col-span-2 bg-linear-to-br from-accent-primary/20 to-accent-primary-dim",
  },
  {
    id: 7,
    icon: LineChart,
    title: "Valuation Estimator",
    description: "Sellers receive automated comparative market analysis to estimate property values instantly based on recent closings.",
    isBig: false,
    gridClass: "lg:col-span-1",
  },
  {
    id: 8,
    icon: Headphones,
    title: "24/7 Elite Support",
    description: "Our dedicated regional support managers are active around the clock to assist you with inquiries, scheduling, or technical help.",
    isBig: false,
    gridClass: "lg:col-span-1",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-bg-alt/45 dark:bg-bg-subtle/25 border-y border-border-default/35 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary-dim border border-accent-primary/20 text-xs font-semibold uppercase tracking-wider text-accent-primary">
            <Shield className="h-3.5 w-3.5" />
            Security & Performance
          </div>
          <h2 className="text-3xl sm:text-4xl text-text-primary font-heading font-extrabold tracking-tight">
            Why Choose Brand Estate?
          </h2>
          <p className="text-text-muted text-sm sm:text-base font-body font-normal">
            We merge sophisticated property management analytics, certified agent channels, and client-centric features to deliver a seamless real estate SaaS experience.
          </p>
        </div>

        {/* Asymmetrical Grid layout (5 columns on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className={cn(
                "relative backdrop-blur-md rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-white/40",
                "bg-white/10 dark:bg-accent-navy/40 border-white/20 dark:border-white/10",
                benefit.gridClass
              )}
            >
              {/* Card top icon row */}
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-accent-primary-dim border border-accent-primary/10 flex items-center justify-center text-accent-primary shadow-sm">
                  <benefit.icon className="h-5 w-5 stroke-[1.8]" />
                </div>
                
                {/* Title */}
                <h3 className="text-text-primary text-base sm:text-lg font-bold font-body tracking-tight">
                  {benefit.title}
                </h3>
                
                {/* Description */}
                <p className={cn(
                  "text-text-muted text-xs sm:text-sm font-body font-normal leading-relaxed",
                  benefit.isBig ? "lg:line-clamp-4" : "line-clamp-4"
                )}>
                  {benefit.description}
                </p>
              </div>

              {/* Decorative detail on Big Cards */}
              {benefit.isBig && (
                <div className="mt-6 flex items-center gap-1.5 text-[11px] font-bold text-accent-primary uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  Premium SaaS Integration
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
