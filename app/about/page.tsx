import * as React from "react";
import { Metadata } from "next";
import { Sparkles, Target, Compass, Award, ShieldCheck, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Brand Estate",
  description: "Discover our real estate legacy, global operations milestones, and meet our executive team.",
};

const STATS = [
  { label: "Sales Volume", value: "$4.2B+", desc: "Total transactions closed" },
  { label: "Active Listings", value: "12,000+", desc: "Premium properties globally" },
  { label: "Licensed Agents", value: "850+", desc: "Professional local experts" },
  { label: "Client Satisfaction", value: "99.4%", desc: "Direct customer score" },
];

const TIMELINE = [
  { year: "2020", title: "BrandEstate Founded", desc: "Launched in New York City with a core directory catalog of 50 luxury listings." },
  { year: "2022", title: "Global Region Expansion", desc: "Added active regional directories for London, Tokyo, Singapore, and Dubai." },
  { year: "2024", title: "Agent SaaS Portal V2", desc: "Deployed advanced analytics dashboard consoles and multi-step listing wizard tools." },
  { year: "2026", title: "Generative AI Integration", desc: "Automated report moderation shadow-banning filters and dynamic calculators." },
];

const TEAM = [
  {
    name: "Elena Rodriguez",
    role: "Chief Executive Officer & Founder",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    bio: "Ex-Realtor executive with 15+ years experience directing residential portfolio transactions.",
  },
  {
    name: "Marcus Aurelius",
    role: "Head of Global Operations",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    bio: "Supervises directory expansion strategies and regional compliance protocols.",
  },
  {
    name: "Sophia Chen",
    role: "Principal Architecture Advisory",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    bio: "Coordinates architectural evaluations and luxury zoning reference guidelines.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-bg-base min-h-screen text-text-primary">
      
      {/* ── Section 1: Hero Banner ── */}
      <section className="relative overflow-hidden bg-bg-surface py-20 border-b border-border-default/45">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-25 dark:opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary-dim border border-accent-primary/10 text-[10px] font-bold text-accent-primary uppercase tracking-widest">
            <Sparkles className="h-3 w-3" /> Core Vision & Mission
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-text-primary tracking-tight leading-none">
            We Believe in Finding <span className="text-accent-primary">Home</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-body leading-relaxed">
            BrandEstate is a premier real estate SaaS directory platform bridging high-end properties with verified local agents to provide secure, transparent transactions.
          </p>
        </div>
      </section>

      {/* ── Section 2: Stats Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-border-default bg-bg-surface shadow-sm text-center space-y-1.5"
            >
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">{stat.label}</span>
              <span className="text-3xl font-extrabold font-heading text-accent-primary block">{stat.value}</span>
              <span className="text-xs text-text-secondary font-medium leading-relaxed block">{stat.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: History Timeline ── */}
      <section className="bg-bg-alt/30 border-y border-border-default/45 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading">Our Milestones Journey</h2>
            <p className="text-sm text-text-muted font-body">Charting the chronological growth of BrandEstate</p>
          </div>

          <div className="relative border-l border-border-default pl-6 ml-4 space-y-10 font-medium">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node */}
                <div className="absolute -left-10 top-1.5 h-8 w-8 rounded-full bg-bg-base border-2 border-accent-primary flex items-center justify-center text-xs font-bold text-accent-primary shadow-sm">
                  {item.year.slice(2)}
                </div>
                <div className="space-y-1.5 pl-2">
                  <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                    {item.title}
                    <span className="text-[10px] text-slate-400 font-mono font-bold">({item.year})</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Executive Team Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">Meet Our Executive Panel</h2>
          <p className="text-sm text-text-muted font-body">The leadership directing our global real estate directory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM.map((member, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border-default bg-bg-surface hover:border-accent-primary/20 hover:shadow-xl hover:shadow-accent-primary/2 transition-all duration-300"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="h-24 w-24 rounded-full object-cover border-2 border-border-default/60 group-hover:scale-102 transition-transform duration-300 mb-4 shadow"
              />
              <h4 className="text-base font-bold text-text-primary">{member.name}</h4>
              <span className="text-[11px] font-bold text-accent-primary uppercase tracking-wider block mt-1">
                {member.role}
              </span>
              <p className="text-xs text-text-secondary leading-relaxed font-body mt-3 max-w-xs">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
