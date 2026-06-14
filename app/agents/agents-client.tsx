"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Building2,
  Award,
  TrendingUp,
  ChevronDown,
  Users,
  Filter,
  X,
} from "lucide-react";
import { agentsMock, type MockAgent } from "@/src/mocks/agentsMock";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─────────────────────────────────────────────
// Static filter options
// ─────────────────────────────────────────────
const SPECIALTIES = [
  "All Specialties",
  "Luxury Residential",
  "Commercial Properties",
  "Investment Properties",
  "Waterfront Properties",
  "Family Homes",
  "First-Time Buyers",
  "Off-Plan Investments",
  "Corporate Relocation",
];

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "listings", label: "Most Listings" },
  { value: "sales", label: "Most Sales" },
  { value: "experience", label: "Most Experienced" },
];

// ─────────────────────────────────────────────
// Star Rating display
// ─────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : half
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-transparent text-border-default"
              )}
            />
          );
        })}
      </div>
      <span className="text-[12px] font-bold text-text-primary">{rating.toFixed(1)}</span>
      <span className="text-[11px] text-text-faint">({count})</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Agent Card
// ─────────────────────────────────────────────
function AgentCard({ agent }: { agent: MockAgent }) {
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-border-default/60 bg-bg-surface hover:border-accent-primary/40 hover:shadow-xl hover:shadow-accent-primary/8 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover image */}
      <div className="relative h-36 overflow-hidden bg-bg-elevated">
        <img
          src={agent.coverImage}
          alt={`${agent.name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        {/* Listing count badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold border border-white/15">
          <Building2 className="h-3 w-3" />
          {agent.activeListings} Active
        </div>
      </div>

      {/* Avatar — bridging cover + content */}
      <div className="relative px-5">
        <div className="-mt-9 mb-3 relative z-10 w-fit">
          <div className="relative">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="h-[68px] w-[68px] rounded-2xl object-cover border-[3px] border-bg-surface shadow-lg"
            />
            {/* Verified badge */}
            <div className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-state-success flex items-center justify-center border-2 border-bg-surface">
              <Award className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-5 pb-5 gap-3">
        {/* Name + title */}
        <div>
          <h3 className="text-[15px] font-bold text-text-primary font-heading leading-tight group-hover:text-accent-primary transition-colors duration-200">
            {agent.name}
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{agent.title}</p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
          <MapPin className="h-3.5 w-3.5 text-accent-primary shrink-0" />
          <span className="truncate">{agent.location.city}, {agent.location.country}</span>
        </div>

        {/* Star rating */}
        <StarRating rating={agent.rating} count={agent.reviewCount} />

        {/* Stats strip */}
        <div className="flex gap-0 border border-border-default/60 rounded-xl overflow-hidden">
          {[
            { label: "Sales", value: agent.totalSales },
            { label: "Yrs Exp", value: agent.yearsExperience },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 px-1 bg-bg-elevated/40",
                i === 0 && "border-r border-border-default/60"
              )}
            >
              <span className="text-[14px] font-bold text-text-primary">{value}</span>
              <span className="text-[9px] font-semibold text-text-faint uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1.5">
          {agent.specializations.slice(0, 2).map((spec) => (
            <span
              key={spec}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-primary/8 text-accent-primary border border-accent-primary/15"
            >
              {spec}
            </span>
          ))}
          {agent.specializations.length > 2 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-bg-elevated text-text-faint border border-border-default/60">
              +{agent.specializations.length - 2}
            </span>
          )}
        </div>

        {/* CTA */}
        <div
          className="mt-auto pt-1 flex items-center justify-between text-[12px] font-bold text-accent-primary group-hover:text-accent-primary-hov transition-colors duration-200"
        >
          View Profile
          <svg className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────
// Trust stat bar
// ─────────────────────────────────────────────
const TRUST_STATS = [
  { icon: Users, label: "Verified Agents", value: "150+" },
  { icon: Star, label: "Avg Rating", value: "4.8★" },
  { icon: Building2, label: "Active Listings", value: "22k+" },
  { icon: TrendingUp, label: "Cities Covered", value: "40+" },
];

// ─────────────────────────────────────────────
// Main client page
// ─────────────────────────────────────────────
export function AgentsClientPage() {
  const [search, setSearch] = React.useState("");
  const [specialty, setSpecialty] = React.useState("All Specialties");
  const [sortBy, setSortBy] = React.useState("rating");
  const [showSortMenu, setShowSortMenu] = React.useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter + sort
  const filtered = React.useMemo(() => {
    let list = [...agentsMock];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.location.city.toLowerCase().includes(q) ||
          a.location.country.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.specializations.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (specialty !== "All Specialties") {
      list = list.filter((a) =>
        a.specializations.some((s) =>
          s.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    list.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "listings") return b.activeListings - a.activeListings;
      if (sortBy === "sales") return b.totalSales - a.totalSales;
      if (sortBy === "experience") return b.yearsExperience - a.yearsExperience;
      return 0;
    });

    return list;
  }, [search, specialty, sortBy]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort";

  return (
    <div className="min-h-screen bg-bg-base">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-accent-navy via-[#0A1628] to-[#0D1E3C] pt-24 pb-16">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent-primary/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-600/8 blur-[60px] pointer-events-none" />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/12 text-[11px] font-bold text-white/70 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
              Verified Network
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-heading text-center leading-[1.1] mb-4">
            Meet Our Expert{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#4DA6FF] to-[#0067D2]">
              Agents
            </span>
          </h1>
          <p className="text-center text-white/55 text-[15px] max-w-xl mx-auto leading-relaxed mb-10">
            Browse our global network of verified, top-rated real estate professionals — each with deep local expertise and a proven track record.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, city, specialty…"
                className="w-full pl-12 pr-5 h-14 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-[15px] font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary/50 transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5 text-white/60" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trust stats */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-2xl overflow-hidden border border-white/8 bg-white/4 backdrop-blur-sm">
            {TRUST_STATS.map(({ icon: Icon, label, value }, i) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-3 px-5 py-4",
                  i < TRUST_STATS.length - 1 && "border-r border-white/8 max-sm:border-r-0",
                  i === 1 && "max-sm:border-r border-white/8",
                  i >= 2 && "border-t border-white/8 sm:border-t-0"
                )}
              >
                <div className="h-9 w-9 rounded-xl bg-accent-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5 text-accent-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white font-heading leading-none">{value}</div>
                  <div className="text-[10px] text-white/45 font-semibold uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters + Results ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Specialty pills */}
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.slice(0, 5).map((s) => (
              <button
                key={s}
                onClick={() => setSpecialty(s === specialty ? "All Specialties" : s)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 cursor-pointer",
                  specialty === s
                    ? "bg-accent-primary text-white border-accent-primary shadow-sm shadow-accent-primary/25"
                    : "bg-bg-elevated/60 text-text-secondary border-border-default/70 hover:border-accent-primary/40 hover:text-accent-primary"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Results count + sort */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[13px] text-text-muted">
              <span className="font-bold text-text-primary">{filtered.length}</span> agents
            </span>

            {/* Sort dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border-default/70 bg-bg-elevated/50 text-[12px] font-semibold text-text-secondary hover:border-accent-primary/40 hover:text-text-primary transition-all duration-200 cursor-pointer"
              >
                <Filter className="h-3.5 w-3.5" />
                {sortLabel}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", showSortMenu && "rotate-180")} />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border-default/60 bg-bg-surface shadow-lg shadow-black/8 z-30 py-1 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                      className={cn(
                        "w-full text-left px-3.5 py-2 text-[12px] font-semibold transition-colors duration-150 cursor-pointer",
                        sortBy === opt.value
                          ? "bg-accent-primary/8 text-accent-primary"
                          : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agent grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-bg-elevated flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-text-faint" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No agents found</h3>
            <p className="text-text-muted text-sm max-w-xs mb-5">
              Try adjusting your search or specialty filter to find the right agent.
            </p>
            <Button
              onClick={() => { setSearch(""); setSpecialty("All Specialties"); }}
              variant="outline"
              className="rounded-xl text-[13px]"
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-accent-navy to-[#0A1E40] p-8 sm:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent-primary/10 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-600/10 blur-[50px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading mb-3">
              Are you a licensed agent?
            </h2>
            <p className="text-white/55 text-sm max-w-lg mx-auto mb-7">
              Join our verified network and reach thousands of active buyers and renters. Get your listings in front of the right audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button className="rounded-full px-6 h-11 bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-[13px] shadow-lg shadow-accent-primary/30">
                  Join as an Agent
                </Button>
              </Link>
              <Link href="/blogs">
                <Button variant="outline" className="rounded-full px-6 h-11 border-white/20 text-white hover:bg-white/8 font-semibold text-[13px]">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
