"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  Eye,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Phone,
  Mail,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { mockUserInquiries, mockSavedPriceTrends } from "@/src/mocks/dashboardMock";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export function DashboardClient() {
  const { currentUser } = useAuth();
  const [savedProperties, setSavedProperties] = React.useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = React.useState(true);

  React.useEffect(() => {
    async function loadSaved() {
      try {
        setLoadingSaved(true);
        const response = await fetch("/api/users/me/saved");
        const result = await response.json();
        if (result.status === "success") {
          setSavedProperties(result.data || []);
        }
      } catch (err) {
        console.error("Failed to load saved properties:", err);
      } finally {
        setLoadingSaved(false);
      }
    }
    loadSaved();
  }, []);

  const recentSavedProperties = React.useMemo(() => {
    return savedProperties.slice(0, 3);
  }, [savedProperties]);
  
  // Custom Greeting based on time
  const greeting = React.useMemo(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good morning";
    if (hrs < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const stats = [
    {
      label: "Saved Properties",
      value: savedProperties.length.toString(),
      change: "+1 new this week",
      icon: Heart,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      label: "Active Inquiries",
      value: mockUserInquiries.filter(i => i.status === "pending" || i.status === "replied").length,
      change: "2 inquiries replied",
      icon: MessageSquare,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Properties Viewed",
      value: "14",
      change: "+4 views past 48h",
      icon: Eye,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Profile Completeness",
      value: "85%",
      change: "Verify email to reach 100%",
      icon: UserCheck,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-accent-primary/20 via-accent-primary/5 to-bg-surface border border-border-default/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="space-y-2 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
            {greeting}, <span className="text-accent-primary">{currentUser?.name}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium max-w-xl">
            Welcome back to your BrandEstate panel. You have <span className="text-text-primary font-bold">1 unread reply</span> from agent Sophia Chen regarding your Manhattan Penthouse inquiry.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 relative z-10">
          <Button render={<Link href="/properties" />} size="sm" className="h-10 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-5">
            Browse Properties
          </Button>
          <Button render={<Link href="/dashboard/profile" />} size="sm" variant="outline" className="h-10 rounded-full border-border-default hover:bg-bg-elevated text-text-primary px-5">
            Complete Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm hover:border-border-subtle transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest block">
                    {stat.label}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary">
                    {stat.value}
                  </span>
                </div>
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-[11px] text-text-secondary mt-4 font-semibold flex items-center gap-1">
                <span className="text-accent-primary">●</span> {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Chart & Summary Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Market Value / Saved Portfolio Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-default/50 pb-4">
            <div>
              <h3 className="font-heading text-base font-bold text-text-primary flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent-primary" />
                Saved Properties Value Trends
              </h3>
              <p className="text-xs text-text-muted font-medium">Average valuation updates for your saved listings</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Average Saved Price</span>
              <span className="text-lg font-extrabold text-accent-primary">$940,000</span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pr-4 text-xs font-semibold text-text-muted">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSavedPriceTrends}>
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0067D2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0067D2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--text-muted)" strokeWidth={0.5} />
                <YAxis
                  stroke="var(--text-muted)"
                  strokeWidth={0.5}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-default)",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                  }}
                  formatter={(v) => [`$${Number(v).toLocaleString()}`, "Valuation"]}
                />
                <Area
                  type="monotone"
                  dataKey="Average Price ($)"
                  stroke="#0067D2"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#chartGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inquiry Activity Stream */}
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-default/50 pb-4">
              <h3 className="font-heading text-base font-bold text-text-primary flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent-primary" />
                Recent Inquiries
              </h3>
              <Link href="/dashboard/inquiries" className="text-xs text-accent-primary font-bold hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3.5">
              {mockUserInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-3 rounded-xl bg-bg-base border border-border-default/50 flex items-start gap-3 hover:border-border-default transition-colors"
                >
                  <img
                    src={inq.propertyImage}
                    alt={inq.propertyTitle}
                    className="h-12 w-12 rounded-lg object-cover shrink-0 border border-border-default"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-text-muted font-semibold">{inq.submittedDate}</span>
                      <span className={cn(
                        "text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border tracking-wider",
                        inq.status === "replied" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                        inq.status === "pending" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                        "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      )}>
                        {inq.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-text-primary truncate">{inq.propertyTitle}</h4>
                    <p className="text-[11px] text-text-secondary truncate font-medium">{inq.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button render={<Link href="/dashboard/inquiries" />} variant="ghost" className="w-full text-xs font-bold text-accent-primary hover:text-text-primary hover:bg-bg-elevated mt-4 rounded-xl">
            <span className="flex items-center justify-center gap-1.5 w-full">
              Check reply details <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Button>
        </div>
      </div>

      {/* ── Saved Properties Preview ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
            <Heart className="h-4.5 w-4.5 text-accent-primary" />
            Recently Saved Properties
          </h3>
          <Link href="/dashboard/saved" className="text-xs text-accent-primary font-bold hover:underline flex items-center gap-1">
            Manage Saved <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingSaved ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col bg-bg-surface border border-border-default/60 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video w-full bg-bg-alt shrink-0" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-bg-alt rounded w-1/3" />
                  <div className="h-4 bg-bg-alt rounded w-3/4" />
                  <div className="h-3 bg-bg-alt rounded w-1/2" />
                </div>
              </div>
            ))
          ) : recentSavedProperties.length === 0 ? (
            <div className="col-span-full py-8 text-center bg-bg-alt/50 border border-dashed border-border-default/80 rounded-2xl">
              <p className="text-sm font-semibold text-text-muted">No saved properties yet</p>
              <Link href="/properties" className="text-xs text-accent-primary font-bold hover:underline mt-1 inline-block">
                Browse properties
              </Link>
            </div>
          ) : (
            recentSavedProperties.map((property) => {
              const isRent = property.transactionType === "rent" || property.transactionType === "roommate_share";
            const symbol = property.currency === "USD" ? "$" : property.currency + " ";
            const price = `${symbol}${property.price.toLocaleString()}${isRent ? "/mo" : ""}`;

            return (
              <div
                key={property.id}
                className="group flex flex-col bg-bg-surface border border-border-default/60 rounded-2xl overflow-hidden hover:border-border-subtle transition-all duration-300"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-bg-alt shrink-0">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-bg-base to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-accent-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {property.propertyCategory}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-base font-extrabold text-accent-primary tracking-tight block">
                      {price}
                    </span>
                    <h4 className="text-sm font-bold text-text-primary truncate leading-snug">{property.title}</h4>
                    <p className="text-xs text-text-muted flex items-center gap-1 font-semibold truncate pt-1">
                      <MapPin className="h-3.5 w-3.5 text-accent-primary shrink-0" />
                      {property.city}, {property.state}
                    </p>
                  </div>
                  <div className="border-t border-border-default/60 pt-3 flex items-center justify-between text-xs text-text-secondary font-medium">
                    <span>{property.bedrooms} Bed · {property.bathrooms} Bath</span>
                    <Link href={`/property/${property.slug}`} className="text-accent-primary font-bold hover:underline inline-flex items-center gap-1">
                      View details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
}
