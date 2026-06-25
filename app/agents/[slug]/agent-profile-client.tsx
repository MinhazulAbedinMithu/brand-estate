"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  Award,
  Briefcase,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Building2,
  TrendingUp,
  Users,
  Languages,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
} from "lucide-react";
import type { MockAgent } from "@/src/mocks/agentsMock";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────
// Star rating component
// ─────────────────────────────────────────────
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sz,
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
                ? "fill-amber-400/50 text-amber-400"
                : "fill-transparent text-border-default"
          )}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Contact form component
// ─────────────────────────────────────────────
function ContactForm({ agentName }: { agentName: string }) {
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Inquiry sent!", {
      description: `${agentName} will get back to you shortly.`,
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
        <div className="h-14 w-14 rounded-full bg-state-success/10 border border-state-success/20 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-state-success" />
        </div>
        <h4 className="text-[15px] font-bold text-text-primary">Message Sent!</h4>
        <p className="text-[13px] text-text-muted max-w-[200px]">
          {agentName} will reply to your inquiry within 24 hours.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
          className="text-[12px] font-semibold text-accent-primary hover:underline cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      {/* Name */}
      <div>
        <Input
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: "" })); }}
          className={cn(
            "h-10 rounded-xl text-[13px] border-border-default/70 bg-bg-elevated/50 placeholder:text-text-faint focus:ring-1 focus:ring-accent-primary/30 focus:border-accent-primary",
            errors.name && "border-state-error/60"
          )}
        />
        {errors.name && <p className="text-[11px] text-state-error mt-1 font-medium">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <Input
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: "" })); }}
          className={cn(
            "h-10 rounded-xl text-[13px] border-border-default/70 bg-bg-elevated/50 placeholder:text-text-faint focus:ring-1 focus:ring-accent-primary/30 focus:border-accent-primary",
            errors.email && "border-state-error/60"
          )}
        />
        {errors.email && <p className="text-[11px] text-state-error mt-1 font-medium">{errors.email}</p>}
      </div>

      {/* Phone (optional) */}
      <Input
        type="tel"
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
        className="h-10 rounded-xl text-[13px] border-border-default/70 bg-bg-elevated/50 placeholder:text-text-faint focus:ring-1 focus:ring-accent-primary/30 focus:border-accent-primary"
      />

      {/* Message */}
      <div>
        <textarea
          placeholder="I'm interested in..."
          value={form.message}
          onChange={(e) => { setForm(p => ({ ...p, message: e.target.value })); setErrors(p => ({ ...p, message: "" })); }}
          rows={4}
          className={cn(
            "w-full resize-none rounded-xl border text-[13px] px-3 py-2.5 bg-bg-elevated/50 text-text-primary placeholder:text-text-faint border-border-default/70 focus:outline-none focus:ring-1 focus:ring-accent-primary/30 focus:border-accent-primary transition-all duration-200",
            errors.message && "border-state-error/60"
          )}
        />
        {errors.message && <p className="text-[11px] text-state-error -mt-0.5 font-medium">{errors.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-semibold text-[13px] shadow-sm shadow-accent-primary/20 transition-all duration-200"
      >
        {submitting ? (
          <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Sending…</span>
        ) : (
          <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />Send Inquiry</span>
        )}
      </Button>
    </form>
  );
}

// ─────────────────────────────────────────────
// Review card
// ─────────────────────────────────────────────
function ReviewCard({ review }: { review: MockAgent["reviews"][0] }) {
  return (
    <div className="p-5 rounded-2xl border border-border-default/60 bg-bg-surface hover:border-border-subtle transition-all duration-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-linear-to-br from-accent-primary to-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          {review.reviewerAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-text-primary truncate">{review.reviewerName}</div>
          <div className="text-[10px] text-text-faint">{review.propertyType}</div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarRating rating={review.rating} />
          <span className="text-[10px] text-text-faint">{new Date(review.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
        </div>
      </div>
      <p className="text-[13px] text-text-secondary leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Rating distribution bar
// ─────────────────────────────────────────────
function RatingBreakdown({ reviews }: { reviews: MockAgent["reviews"] }) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: total > 0 ? (reviews.filter((r) => r.rating === star).length / total) * 100 : 0,
  }));

  return (
    <div className="space-y-1.5">
      {counts.map(({ star, count, pct }) => (
        <div key={star} className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold text-text-muted w-3 shrink-0">{star}</span>
          <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
          <div className="flex-1 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-text-faint w-4 text-right shrink-0">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main client page
// ─────────────────────────────────────────────
export function AgentProfileClient({ agent, relatedAgents = [] }: { agent: MockAgent; relatedAgents?: MockAgent[] }) {
  const { isLoading, currentUser } = useAuth();
  const router = useRouter();

  const isNidVerified = currentUser
    ? (currentUser.role !== 'auth_user' || currentUser.nidStatus === 'verified')
    : false;

  const [saved, setSaved] = React.useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-4 text-text-primary">
        <Loader2 className="h-10 w-10 text-accent-primary animate-spin" />
        <p className="text-sm font-semibold text-text-muted">Loading profile details...</p>
      </div>
    );
  }

  // Related agents (passed from props)

  const avgRating = agent.reviews.reduce((sum, r) => sum + r.rating, 0) / agent.reviews.length;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: agent.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-bg-base relative">
      {/* ── Hero banner ─────────────────────────────────── */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={agent.coverImage}
          alt="Agent cover"
          className={cn("w-full h-full object-cover", !isNidVerified && "blur-md select-none pointer-events-none")}
        />
        <div className="absolute inset-0 bg-linear-to-t from-accent-navy/90 via-accent-navy/50 to-transparent" />

        {/* Back button */}
        <Link
          href="/agents"
          className="absolute top-5 left-4 sm:left-8 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-white text-[12px] font-semibold hover:bg-black/60 transition-all duration-200 z-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Agents
        </Link>

        {/* Action buttons */}
        <div className="absolute top-5 right-4 sm:right-8 flex items-center gap-2 z-10">
          <button
            onClick={() => { setSaved(!saved); toast.success(saved ? "Removed from saved" : "Agent saved!"); }}
            className={cn(
              "h-9 w-9 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-200 cursor-pointer",
              saved
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                : "bg-black/40 border-white/15 text-white hover:bg-black/60"
            )}
            aria-label="Save agent"
          >
            <Heart className={cn("h-4 w-4", saved && "fill-rose-400")} />
          </button>
          <button
            onClick={handleShare}
            className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-white flex items-center justify-center hover:bg-black/60 transition-all duration-200 cursor-pointer"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Page content ──────────────────────────────────── */}
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative", !isNidVerified && "blur-md select-none pointer-events-none")}>
        {/* Agent identity row */}
        <div className="relative -mt-16 sm:-mt-20 mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative shrink-0 w-28 sm:w-36 h-28 sm:h-36">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="h-full w-full rounded-3xl object-cover border-4 border-bg-base shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-state-success flex items-center justify-center border-2 border-bg-base shadow">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Name + meta */}
          <div className="flex-1 pb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-primary/8 border border-accent-primary/15 text-[10px] font-bold text-accent-primary uppercase tracking-wider mb-2">
              <Award className="h-2.5 w-2.5" /> Verified Agent
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-heading leading-tight">
              {agent.name}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">{agent.title}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
                <MapPin className="h-3.5 w-3.5 text-accent-primary" />
                {agent.location.city}, {agent.location.country}
              </div>
              <div className="flex items-center gap-1.5">
                <StarRating rating={agent.rating} />
                <span className="text-[13px] font-bold text-text-primary">{agent.rating.toFixed(1)}</span>
                <span className="text-[12px] text-text-faint">({agent.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex gap-2 pb-2">
            <a href={`tel:${agent.phone}`}>
              <Button variant="outline" className="rounded-xl h-10 px-4 text-[13px] font-semibold border-border-default/80 gap-2">
                <Phone className="h-4 w-4 text-accent-primary" />
                Call
              </Button>
            </a>
            <a href={`mailto:${agent.email}`}>
              <Button variant="outline" className="rounded-xl h-10 px-4 text-[13px] font-semibold border-border-default/80 gap-2">
                <Mail className="h-4 w-4 text-accent-primary" />
                Email
              </Button>
            </a>
          </div>
        </div>

        {/* ── Main two-column layout ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Building2, label: "Active Listings", value: agent.activeListings },
                { icon: TrendingUp, label: "Total Sales", value: agent.totalSales },
                { icon: Briefcase, label: "Years Active", value: agent.yearsExperience },
                { icon: Users, label: "Total Volume", value: agent.totalVolume },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border-default/60 bg-bg-surface text-center"
                >
                  <Icon className="h-5 w-5 text-accent-primary mb-2" />
                  <div className="text-xl font-bold text-text-primary font-heading leading-none">{value}</div>
                  <div className="text-[10px] font-semibold text-text-faint uppercase tracking-wider mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* About */}
            <div>
              <h2 className="text-xl font-bold text-text-primary font-heading mb-4">About</h2>
              <p className="text-[14px] text-text-secondary leading-[1.8]">{agent.bio}</p>
            </div>

            {/* Specializations + Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-accent-primary" />
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {agent.specializations.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-accent-primary/8 text-accent-primary border border-accent-primary/15">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Languages className="h-4 w-4 text-accent-primary" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {agent.languages.map((l) => (
                    <span key={l} className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-bg-elevated border border-border-default/70 text-text-secondary">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-accent-primary" />
                Certifications & Licenses
              </h3>
              <div className="space-y-2">
                {agent.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-2.5 text-[13px] text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-state-success shrink-0" />
                    {cert}
                  </div>
                ))}
                <div className="flex items-center gap-2.5 text-[12px] text-text-faint mt-1">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  License: <span className="font-mono text-text-muted">{agent.licenseNumber}</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-text-primary font-heading">
                  Client Reviews
                </h2>
                <span className="text-[12px] text-text-faint">{agent.reviewCount} total reviews</span>
              </div>

              {/* Rating summary */}
              <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl border border-border-default/60 bg-bg-elevated/40 mb-5">
                <div className="flex flex-col items-center justify-center text-center shrink-0">
                  <div className="text-5xl font-bold text-text-primary font-heading">{avgRating.toFixed(1)}</div>
                  <StarRating rating={avgRating} size="lg" />
                  <div className="text-[11px] text-text-faint mt-1">{agent.reviews.length} reviews</div>
                </div>
                <div className="flex-1">
                  <RatingBreakdown reviews={agent.reviews} />
                </div>
              </div>

              {/* Review cards */}
              <div className="grid grid-cols-1 gap-4">
                {agent.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — sticky sidebar */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Contact card */}
            <div className="p-5 rounded-2xl border border-border-default/60 bg-bg-surface shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-default/50">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="h-11 w-11 rounded-xl object-cover"
                />
                <div>
                  <div className="text-[14px] font-bold text-text-primary">{agent.name}</div>
                  <div className="text-[11px] text-text-muted">{agent.title}</div>
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-text-primary mb-4">Send a Message</h3>
              <ContactForm agentName={agent.name.split(" ")[0]} />
            </div>

            {/* Quick contact info */}
            <div className="p-4 rounded-2xl border border-border-default/60 bg-bg-surface space-y-3">
              <h4 className="text-[13px] font-bold text-text-secondary uppercase tracking-wider">Contact Info</h4>
              <a
                href={`tel:${agent.phone}`}
                className="flex items-center gap-3 text-[13px] text-text-secondary hover:text-accent-primary transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-accent-primary/8 flex items-center justify-center group-hover:bg-accent-primary/15 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-accent-primary" />
                </div>
                {agent.phone}
              </a>
              <a
                href={`mailto:${agent.email}`}
                className="flex items-center gap-3 text-[13px] text-text-secondary hover:text-accent-primary transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-accent-primary/8 flex items-center justify-center group-hover:bg-accent-primary/15 transition-colors">
                  <Mail className="h-3.5 w-3.5 text-accent-primary" />
                </div>
                {agent.email}
              </a>
              <div className="flex items-center gap-3 text-[13px] text-text-secondary">
                <div className="h-8 w-8 rounded-lg bg-accent-primary/8 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-accent-primary" />
                </div>
                {agent.location.city}, {agent.location.country}
              </div>
            </div>

            {/* Social links */}
            {agent.socialLinks.length > 0 && (
              <div className="p-4 rounded-2xl border border-border-default/60 bg-bg-surface">
                <h4 className="text-[13px] font-bold text-text-secondary uppercase tracking-wider mb-3">Social Profiles</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.socialLinks.map(({ platform }) => (
                    <span
                      key={platform}
                      className="px-3 py-1.5 rounded-full text-[11px] font-semibold border border-border-default/70 bg-bg-elevated text-text-secondary hover:text-accent-primary hover:border-accent-primary/40 transition-colors cursor-pointer"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Agents ───────────────────────────── */}
        {relatedAgents.length > 0 && (
          <div className="pb-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-text-primary font-heading">Other Agents in {agent.location.country}</h2>
              <Link href="/agents" className="text-[12px] font-semibold text-accent-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedAgents.map((a) => (
                <Link
                  key={a.id}
                  href={`/agents/${a.slug}`}
                  className="group flex items-center gap-3.5 p-4 rounded-2xl border border-border-default/60 bg-bg-surface hover:border-accent-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <img
                    src={a.avatar}
                    alt={a.name}
                    className="h-12 w-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-primary transition-colors truncate">{a.name}</div>
                    <div className="text-[11px] text-text-muted truncate">{a.title}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold text-text-primary">{a.rating}</span>
                      <span className="text-[10px] text-text-faint">({a.reviewCount})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isNidVerified && (
        <div className="absolute inset-x-0 bottom-0 top-24 z-30 flex items-center justify-center p-4 sm:p-8 bg-bg-base/30 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-3xl border border-border-default/80 bg-bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="h-14 w-14 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mx-auto shadow-sm">
              <svg className="h-7 w-7 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">Identity Verification Required</h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                To protect our agents and owners, detailed contact info, experience metrics, client reviews, and direct inquiries are locked behind National ID verification.
              </p>
            </div>

            <div className="pt-2">
              {currentUser ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-accent-primary/5 border border-accent-primary/10 text-left">
                    <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest block mb-0.5">Verification Status</span>
                    <span className="text-xs font-semibold text-text-primary capitalize">
                      {currentUser.nidStatus === 'pending' ? 'Verification Pending Admin Review' : 
                       currentUser.nidStatus === 'rejected' ? 'Verification Rejected (Resubmission Needed)' : 
                       'Unverified (Action Required)'}
                    </span>
                  </div>
                  <Link href="/dashboard/profile" className="block">
                    <Button className="w-full h-11 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold text-xs shadow-lg shadow-accent-primary/20 cursor-pointer">
                      Submit NID Documentation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full h-11 rounded-xl border-border-default text-text-secondary font-bold text-xs cursor-pointer">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button className="w-full h-11 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold text-xs shadow-lg shadow-accent-primary/20 cursor-pointer">
                      Register Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
