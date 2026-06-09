"use client";

import * as React from "react";
import { 
  Calculator, 
  TrendingUp, 
  Coins, 
  Building2, 
  Receipt, 
  Info, 
  Building,
  Store,
  Briefcase,
  FlaskConical,
  Truck,
  HelpCircle,
  CheckCircle2,
  TrendingDown,
  Percent,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoningSpec {
  code: string;
  name: string;
  maxHeight: string;
  maxFar: string;
  uses: string[];
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeClass: string;
  colorClass: string;
}

const ZONING_DATA: Record<string, ZoningSpec> = {
  "mu-r": {
    code: "MU-R",
    name: "Mixed-Use Retail",
    maxHeight: "45 ft (3–4 stories)",
    maxFar: "3.0 FAR",
    uses: ["Ground floor retail & cafes", "Upper-level apartments", "Boutique creative offices"],
    description: "Designed for vibrant, walkable urban centers combining retail storefronts with high-quality multi-family housing.",
    icon: Store,
    color: "indigo",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/45 dark:text-indigo-300 dark:border-indigo-800/40",
    colorClass: "text-indigo-600 dark:text-indigo-400",
  },
  "o-c": {
    code: "O-C",
    name: "Office Commercial",
    maxHeight: "60 ft (5–6 stories)",
    maxFar: "2.5 FAR",
    uses: ["Professional business offices", "Medical clinics", "Financial institutions"],
    description: "Supports administrative, medical, and financial office parks with parking facilities and arterial access.",
    icon: Briefcase,
    color: "sky",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/45 dark:text-sky-300 dark:border-sky-800/40",
    colorClass: "text-sky-600 dark:text-sky-400",
  },
  "i-l": {
    code: "I-L",
    name: "Light Industrial",
    maxHeight: "35 ft (1–2 stories)",
    maxFar: "1.5 FAR",
    uses: ["R&D laboratories", "Light assembly & packaging", "E-commerce distribution"],
    description: "Reserved for clean industrial operations, commercial labs, and tech assembly with strict emission limits.",
    icon: FlaskConical,
    color: "emerald",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/45 dark:text-emerald-300 dark:border-emerald-800/40",
    colorClass: "text-emerald-600 dark:text-emerald-400",
  },
  "w-d": {
    code: "W-D",
    name: "Warehouse & Distribution",
    maxHeight: "50 ft (high-ceiling)",
    maxFar: "2.0 FAR",
    uses: ["Wholesale storage & logistics hubs", "Cold storage facilities", "Freight shipping terminals"],
    description: "Optimized for large-scale freight shipping, storage, and 24/7 logistics with heavy vehicle access.",
    icon: Truck,
    color: "amber",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/45 dark:text-amber-300 dark:border-amber-800/40",
    colorClass: "text-amber-600 dark:text-amber-400",
  },
};

export function InvestmentCalculator() {
  // Inputs State
  const [purchasePrice, setPurchasePrice] = React.useState<number>(750000);
  const [monthlyRent, setMonthlyRent] = React.useState<number>(3800);
  const [appreciationRate, setAppreciationRate] = React.useState<number>(5.0);
  const [selectedZone, setSelectedZone] = React.useState<string>("mu-r");
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  // Calculations
  const annualRentalIncome = monthlyRent * 12;
  const grossRentalYield = purchasePrice > 0 ? (annualRentalIncome / purchasePrice) * 100 : 0;
  
  // Future projections over 10 years
  const tenYearPropertyValue = purchasePrice * Math.pow(1 + appreciationRate / 100, 10);
  const tenYearAppreciationProfit = tenYearPropertyValue - purchasePrice;
  const tenYearAccumulatedRent = annualRentalIncome * 10;
  const tenYearTotalReturn = tenYearAppreciationProfit + tenYearAccumulatedRent;
  const tenYearRoiRate = purchasePrice > 0 ? (tenYearTotalReturn / purchasePrice) * 100 : 0;

  // Closing cost breakdowns (connected to purchase price)
  const transferTax = purchasePrice * 0.015;
  const titleInsurance = purchasePrice * 0.005;
  const legalEscrowFee = 2500; // Flat
  const totalClosingCosts = transferTax + titleInsurance + legalEscrowFee;
  const annualPropertyTax = purchasePrice * 0.012;
  const totalCapitalRequired = purchasePrice + totalClosingCosts;

  // Determine Investment Profile
  let investmentProfile = {
    tier: "Balanced Asset",
    description: "Steady, secure wealth building with moderate yield.",
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };
  if (grossRentalYield >= 6.5 && appreciationRate >= 5.5) {
    investmentProfile = {
      tier: "High-Performance Core Plus",
      description: "Exceptional cash flow paired with robust capital appreciation.",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };
  } else if (grossRentalYield >= 6.0) {
    investmentProfile = {
      tier: "Income Focused",
      description: "Prioritizes immediate monthly yield over asset price appreciation.",
      color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
    };
  } else if (appreciationRate >= 6.0) {
    investmentProfile = {
      tier: "Capital Growth Leader",
      description: "Aggressive wealth growth through equity appreciation.",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    };
  }

  // Formatting helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const activeZone = ZONING_DATA[selectedZone];
  const ActiveZoneIcon = activeZone.icon;

  const toggleTooltip = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  return (
    <section className="py-20 sm:py-28 bg-bg-base dark:bg-[#080d16] border-t border-border-default/45 dark:border-white/10 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,103,210,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,103,210,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-accent-primary/5 dark:bg-accent-primary/10" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-indigo-500/5 dark:bg-indigo-500/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary-dim border border-accent-primary/20 text-xs font-semibold uppercase tracking-wider text-accent-primary animate-fade-in">
            <Calculator className="h-3.5 w-3.5" />
            Interactive Finance Suite
          </div>
          <h2 className="text-4xl sm:text-5xl text-text-primary dark:text-white font-heading font-extrabold tracking-tight">
            Property Valuation & Yield Planner
          </h2>
          <p className="text-text-muted dark:text-white/70 text-sm sm:text-base font-body font-normal max-w-2xl mx-auto leading-relaxed">
            Acquire premium assets with data certainty. Run real-time rental yield simulations, map commercial zoning compliance, and forecast total capitalization requirements.
          </p>
        </div>

        {/* ────────────────── MAIN GRID LAYOUT ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* 1. TOP ROW: ROI ESTIMATOR (FULL WIDTH CONTAINER) */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-border-default/80 dark:border-white/10 bg-linear-to-br from-indigo-50/50 via-bg-surface to-blue-50/45 dark:from-[#0d1829]/90 dark:via-[#080d16]/95 dark:to-[#131e33]/90 p-6 sm:p-10 transition-all duration-300 shadow-md hover:shadow-lg hover:border-accent-primary/30">
            
            {/* Visual Glassmorphic Accent Rings */}
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-indigo-500/10 dark:border-indigo-400/5 translate-x-12 -translate-y-12 pointer-events-none" />
            <div className="absolute top-12 right-12 w-48 h-48 rounded-full border border-accent-primary/10 dark:border-accent-primary/5 translate-x-12 -translate-y-12 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
              
              {/* Left Column (Inputs & Settings) */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-body text-text-primary dark:text-white flex items-center gap-2.5">
                    <TrendingUp className="h-6 w-6 text-accent-primary stroke-[1.8]" />
                    Interactive Investment Projection
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted dark:text-text-secondary mt-1 font-body">
                    Calibrate property metrics using the sliders below to visualize asset performance curves.
                  </p>
                </div>

                <div className="space-y-6 pt-2">
                  {/* Slider 1: Purchase Price */}
                  <div className="space-y-2 relative group">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-bold font-body text-text-secondary dark:text-text-secondary flex items-center gap-1.5">
                        Purchase Valuation
                        <button onClick={() => toggleTooltip("valuation")} className="text-text-faint hover:text-accent-primary transition-colors">
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-accent-primary bg-accent-primary-dim px-3 py-1 rounded-full border border-accent-primary/10 font-body">
                        {formatCurrency(purchasePrice)}
                      </span>
                    </div>
                    
                    {activeTooltip === "valuation" && (
                      <div className="absolute z-20 bg-slate-900 text-white dark:bg-[#131e33] border border-white/10 p-3 rounded-xl text-xs max-w-xs shadow-xl animate-fade-in">
                        The estimated acquisition cost or market value of the property listing.
                      </div>
                    )}

                    <input
                      type="range"
                      min={100000}
                      max={3000000}
                      step={25000}
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-primary focus:outline-hidden"
                    />
                    <div className="flex justify-between text-[10px] text-text-faint font-semibold tracking-wide">
                      <span>$100K</span>
                      <span>$1.5M</span>
                      <span>$3.0M</span>
                    </div>
                  </div>

                  {/* Slider 2: Monthly Rent */}
                  <div className="space-y-2 relative group">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-bold font-body text-text-secondary dark:text-text-secondary flex items-center gap-1.5">
                        Expected Monthly Rental Income
                        <button onClick={() => toggleTooltip("rent")} className="text-text-faint hover:text-accent-primary transition-colors">
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-accent-primary bg-accent-primary-dim px-3 py-1 rounded-full border border-accent-primary/10 font-body">
                        {formatCurrency(monthlyRent)}
                      </span>
                    </div>

                    {activeTooltip === "rent" && (
                      <div className="absolute z-20 bg-slate-900 text-white dark:bg-[#131e33] border border-white/10 p-3 rounded-xl text-xs max-w-xs shadow-xl animate-fade-in">
                        Estimated gross monthly leasing rate generated by renting the asset in the current neighborhood.
                      </div>
                    )}

                    <input
                      type="range"
                      min={500}
                      max={15000}
                      step={100}
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-primary focus:outline-hidden"
                    />
                    <div className="flex justify-between text-[10px] text-text-faint font-semibold tracking-wide">
                      <span>$500/mo</span>
                      <span>$7.5K/mo</span>
                      <span>$15K/mo</span>
                    </div>
                  </div>

                  {/* Slider 3: Appreciation Rate */}
                  <div className="space-y-2 relative group">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-bold font-body text-text-secondary dark:text-text-secondary flex items-center gap-1.5">
                        Annual Capital Appreciation
                        <button onClick={() => toggleTooltip("appreciation")} className="text-text-faint hover:text-accent-primary transition-colors">
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-accent-primary bg-accent-primary-dim px-3 py-1 rounded-full border border-accent-primary/10 font-body">
                        {appreciationRate.toFixed(1)}%
                      </span>
                    </div>

                    {activeTooltip === "appreciation" && (
                      <div className="absolute z-20 bg-slate-900 text-white dark:bg-[#131e33] border border-white/10 p-3 rounded-xl text-xs max-w-xs shadow-xl animate-fade-in">
                        Estimated average annual growth rate of the property asset value based on historic area charts.
                      </div>
                    )}

                    <input
                      type="range"
                      min={1}
                      max={12}
                      step={0.1}
                      value={appreciationRate}
                      onChange={(e) => setAppreciationRate(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-primary focus:outline-hidden"
                    />
                    <div className="flex justify-between text-[10px] text-text-faint font-semibold tracking-wide">
                      <span>1.0% / yr</span>
                      <span>6.5% / yr</span>
                      <span>12.0% / yr</span>
                    </div>
                  </div>
                </div>

                {/* Investment Profile Tier Box */}
                <div className={cn("rounded-2xl p-4.5 border flex items-start gap-3.5 transition-all duration-300", investmentProfile.color)}>
                  <Sparkles className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block font-body">
                      Asset Profile: {investmentProfile.tier}
                    </span>
                    <p className="text-[11px] font-medium opacity-90 leading-normal mt-0.5">
                      {investmentProfile.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (Calculations Output) */}
              <div className="lg:col-span-5 bg-white/80 dark:bg-[#080d16]/80 border border-border-default/60 dark:border-white/5 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xs hover:border-accent-primary/25 transition-all duration-200">
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted dark:text-text-muted mb-4 border-b border-border-default/45 dark:border-white/5 pb-2">
                    Projection Summary (10 Years)
                  </h4>
                  
                  {/* Indicators Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-alt/75 dark:bg-[#131e33]/40 border border-border-default/20 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-semibold text-text-muted dark:text-text-muted mb-1 block">
                        Rental Yield
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-state-success font-body tracking-tight">
                        {grossRentalYield.toFixed(2)}%
                      </div>
                      <span className="text-[9px] text-text-faint mt-1">Gross Annualized</span>
                    </div>

                    <div className="bg-bg-alt/75 dark:bg-[#131e33]/40 border border-border-default/20 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-semibold text-text-muted dark:text-text-muted mb-1 block">
                        Total ROI Rate
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-accent-primary font-body tracking-tight">
                        {tenYearRoiRate.toFixed(1)}%
                      </div>
                      <span className="text-[9px] text-text-faint mt-1">Appreciation + Rent</span>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-text-secondary dark:text-text-secondary">
                      <span>Value Appreciation</span>
                      <span className="font-extrabold text-text-primary dark:text-white">
                        +{formatCurrency(tenYearAppreciationProfit)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-accent-primary h-full rounded-full transition-all duration-300" style={{ width: `${Math.min((tenYearAppreciationProfit / purchasePrice) * 100, 100)}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-text-secondary dark:text-text-secondary">
                      <span>Accumulated Rent</span>
                      <span className="font-extrabold text-text-primary dark:text-white">
                        +{formatCurrency(tenYearAccumulatedRent)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-state-success h-full rounded-full transition-all duration-300" style={{ width: `${Math.min((tenYearAccumulatedRent / purchasePrice) * 100, 100)}%` }} />
                    </div>
                  </div>

                  {/* Portfolio Sum */}
                  <div className="border-t border-border-default/50 dark:border-white/10 pt-4 flex justify-between items-center text-xs">
                    <span className="font-bold text-text-muted dark:text-text-secondary">Est. Portfolio Value (10-Yr):</span>
                    <span className="font-black text-text-primary dark:text-white text-base">
                      {formatCurrency(purchasePrice + tenYearTotalReturn)}
                    </span>
                  </div>
                </div>

                <div className="text-[9px] text-text-faint italic leading-relaxed flex items-start gap-1">
                  <Info className="h-3.5 w-3.5 text-accent-primary shrink-0 mt-0.5" />
                  Projections are simulated and exclude leverage factors, mortgage interest amortization, and general local vacancies.
                </div>
              </div>

            </div>
          </div>

          {/* 2. BOTTOM LEFT: COMMERCIAL ZONING REFERENCE */}
          <div className="relative overflow-hidden rounded-3xl border border-border-default/80 dark:border-white/10 bg-linear-to-br from-indigo-50/20 via-bg-surface to-slate-50/20 dark:from-[#0d1829]/90 dark:via-[#080d16]/95 dark:to-[#131e33]/90 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:border-accent-primary/25 group">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-accent-primary-dim border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-body text-text-primary dark:text-white">
                    Commercial Zoning Reference
                  </h3>
                  <p className="text-xs text-text-muted dark:text-text-secondary">
                    Review building parameters and permissible municipal code operations.
                  </p>
                </div>
              </div>

              {/* Zoning Selector Tabs */}
              <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-[#080d16] p-1.5 rounded-2xl">
                {Object.keys(ZONING_DATA).map((zoneId) => {
                  const item = ZONING_DATA[zoneId];
                  const IconComp = item.icon;
                  return (
                    <button
                      key={zoneId}
                      onClick={() => setSelectedZone(zoneId)}
                      className={cn(
                        "text-[10px] sm:text-xs font-bold py-2.5 px-1 rounded-xl transition-all duration-200 text-center flex flex-col items-center gap-1 font-body",
                        selectedZone === zoneId
                          ? "bg-white dark:bg-[#131e33] text-accent-primary shadow-sm border border-border-default/10 dark:border-white/5"
                          : "text-text-muted dark:text-text-secondary hover:text-text-primary dark:hover:text-white"
                      )}
                    >
                      <IconComp className="h-3.5 w-3.5 stroke-[1.8]" />
                      {item.code}
                    </button>
                  );
                })}
              </div>

              {/* Selected Zone Specs Card */}
              <div className="bg-white/40 dark:bg-[#080d16]/25 rounded-2xl p-5 border border-border-default/45 dark:border-white/5 space-y-4 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold font-body text-text-primary dark:text-white flex items-center gap-1.5">
                      <ActiveZoneIcon className={cn("h-4.5 w-4.5", activeZone.colorClass)} />
                      {activeZone.name}
                    </h4>
                    <p className="text-[10px] text-text-faint">Zone Identifier: {activeZone.code}</p>
                  </div>
                  <span className={cn("text-[9px] font-black uppercase tracking-wider border px-2.5 py-0.5 rounded-full", activeZone.badgeClass)}>
                    Zone Guidelines
                  </span>
                </div>

                <p className="text-xs text-text-muted dark:text-text-secondary leading-relaxed font-body">
                  {activeZone.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 border-y border-border-default/35 dark:border-white/5 py-3.5 text-xs">
                  <div>
                    <span className="text-[9px] text-text-faint font-semibold block uppercase tracking-wider">Height Limit</span>
                    <span className="font-extrabold text-text-secondary dark:text-white text-sm">{activeZone.maxHeight}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-text-faint font-semibold block uppercase tracking-wider">Floor Area Ratio</span>
                    <span className="font-extrabold text-text-secondary dark:text-white text-sm">{activeZone.maxFar}</span>
                  </div>
                </div>

                {/* Uses */}
                <div className="space-y-2">
                  <span className="text-[9px] text-text-faint font-semibold block uppercase tracking-wider">Permissible Operations</span>
                  <ul className="grid grid-cols-1 gap-1.5">
                    {activeZone.uses.map((use, idx) => (
                      <li key={idx} className="text-[11px] text-text-secondary dark:text-text-secondary flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-state-success shrink-0" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-[10px] text-text-faint flex items-start gap-1">
              <Info className="h-3.5 w-3.5 text-accent-primary shrink-0" />
              Guidelines reflect local municipal master plans and are subject to conditional variance reviews.
            </div>
          </div>

          {/* 3. BOTTOM RIGHT: CLOSING COST & TAX ESTIMATOR */}
          <div className="relative overflow-hidden rounded-3xl border border-border-default/80 dark:border-white/10 bg-linear-to-br from-indigo-50/20 via-bg-surface to-slate-50/20 dark:from-[#0d1829]/90 dark:via-[#080d16]/95 dark:to-[#131e33]/90 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:border-accent-primary/25 group">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-accent-primary-dim border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-body text-text-primary dark:text-white">
                    Acquisition & Closing Cost Checklist
                  </h3>
                  <p className="text-xs text-text-muted dark:text-text-secondary">
                    Review dynamic cost allocations linked directly to asset valuations.
                  </p>
                </div>
              </div>

              {/* Linked Notification Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-state-success">
                <span className="h-2 w-2 rounded-full bg-state-success animate-pulse" />
                Price Value: {formatCurrency(purchasePrice)}
              </div>

              {/* Connected Cost Breakdown */}
              <div className="bg-white/40 dark:bg-[#080d16]/25 rounded-2xl p-5 border border-border-default/45 dark:border-white/5 space-y-3 relative overflow-hidden">
                
                {/* Decorative barcode accent */}
                <div className="absolute top-0 right-0 w-24 h-full pointer-events-none opacity-[0.02] dark:opacity-[0.03]" style={{
                  backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px, transparent 4px, #000 4px, #000 6px, transparent 6px, transparent 10px)",
                  backgroundSize: "14px 100%"
                }} />

                <div className="flex justify-between items-center text-xs pb-2.5 border-b border-border-default/35 dark:border-white/5">
                  <span className="text-text-muted dark:text-text-secondary flex items-center gap-1">
                    Property Transfer Tax (1.5%)
                  </span>
                  <span className="font-extrabold text-text-primary dark:text-white">
                    {formatCurrency(transferTax)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pb-2.5 border-b border-border-default/35 dark:border-white/5">
                  <span className="text-text-muted dark:text-text-secondary">
                    Title Search & Registration (0.5%)
                  </span>
                  <span className="font-extrabold text-text-primary dark:text-white">
                    {formatCurrency(titleInsurance)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pb-2.5 border-b border-border-default/35 dark:border-white/5">
                  <span className="text-text-muted dark:text-text-secondary font-medium">
                    Legal & Escrow Services
                  </span>
                  <span className="font-extrabold text-text-primary dark:text-white">
                    {formatCurrency(legalEscrowFee)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-text-muted dark:text-text-secondary font-semibold">
                    Estimated Property Tax
                  </span>
                  <span className="font-extrabold text-accent-primary">
                    {formatCurrency(annualPropertyTax)} / yr
                  </span>
                </div>

                {/* Total box */}
                <div className="bg-accent-primary/5 dark:bg-accent-primary/10 border border-accent-primary/20 rounded-xl p-4.5 mt-4 flex justify-between items-center relative overflow-hidden">
                  <div>
                    <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider block font-body">
                      Estimated Closing Costs
                    </span>
                    <span className="text-[9px] text-text-muted dark:text-text-secondary">Consolidated closing payout</span>
                  </div>
                  <span className="text-lg sm:text-xl font-black text-accent-primary font-body tracking-tight">
                    {formatCurrency(totalClosingCosts)}
                  </span>
                </div>
              </div>

              {/* Connected Total Outlay Indicator */}
              <div className="bg-slate-100/70 dark:bg-[#131e33]/25 border border-border-default/35 dark:border-white/5 rounded-2xl p-4 flex justify-between items-center text-xs">
                <span className="font-bold text-text-secondary dark:text-text-secondary">Total Capital Required:</span>
                <span className="font-black text-text-primary dark:text-white text-base">
                  {formatCurrency(totalCapitalRequired)}
                </span>
              </div>
            </div>

            <div className="mt-6 text-[10px] text-text-faint flex items-start gap-1">
              <Info className="h-3.5 w-3.5 text-accent-primary shrink-0" />
              Calculations represent baseline rates. Bank loan processing, private appraisal, and physical site survey fees are extra.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
