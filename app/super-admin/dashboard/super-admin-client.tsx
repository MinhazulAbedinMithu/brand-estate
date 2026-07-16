"use client";

import * as React from "react";
import {
  ShieldCheck,
  Server,
  Database,
  Activity,
  RefreshCw,
  AlertCircle,
  FileText,
  Zap,
  Key,
  DollarSign,
  Coins,
  Building,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from "recharts";

type Timeframe = "daily" | "weekly" | "monthly" | "yearly";
type ActiveTab = "overview" | "payments" | "properties" | "users" | "audit" | "actions";

interface DataPayload {
  counters: {
    totalUsers: number;
    totalProperties: number;
    activeProperties: number;
    pendingProperties: number;
    totalInquiries: number;
    totalRevenue: number;
    totalDeposits: number;
    totalPayouts: number;
  };
  revenueSummary: Record<string, { revenue: number; deposits: number; payouts: number }>;
  timelines: Record<Timeframe, Array<{ name: string; revenue: number; deposits: number; payouts: number }>>;
  paymentLogs: Array<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    relatedUserName?: string;
    amount: number;
    fee: number;
    type: string;
    status: string;
    description: string;
    createdAt: string;
  }>;
  propertyLogs: Array<{
    id: string;
    title: string;
    category: string;
    type: string;
    price: number;
    status: string;
    views: number;
    ownerName: string;
    ownerEmail: string;
    createdAt: string;
  }>;
  userLogs: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  }>;
  auditLogs: Array<{
    id: string;
    actorName: string;
    actorRole: string;
    email: string;
    action: string;
    target: string;
    timestamp: string;
    ipAddress: string;
  }>;
}

export function SuperAdminClient() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("overview");
  const [timeframe, setTimeframe] = React.useState<Timeframe>("monthly");
  const [data, setData] = React.useState<DataPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [flushing, setFlushing] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);

  const fetchAnalytics = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics/super-admin");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setData(json.data);
        }
      } else {
        toast.error("Failed to load Super Admin Analytics");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred loading platform metrics.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleFlushCache = async () => {
    setFlushing(true);
    try {
      const res = await fetch("/api/super-admin/flush-cache", { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        toast.success("Cache cleared successfully", { description: json.message });
        fetchAnalytics(); // Refresh logs
      } else {
        toast.error("Cache flush failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server.");
    } finally {
      setFlushing(false);
    }
  };

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/super-admin/reset-db", { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        toast.success("Platform database restored", { description: json.message });
        fetchAnalytics(); // Reload database logs
      } else {
        toast.error("Database reset failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error resetting database defaults.");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
        <p className="text-xs text-text-muted font-bold font-heading">Assembling Platform Console Metrics...</p>
      </div>
    );
  }

  const counters = data?.counters || {
    totalUsers: 0,
    totalProperties: 0,
    activeProperties: 0,
    pendingProperties: 0,
    totalInquiries: 0,
    totalRevenue: 0,
    totalDeposits: 0,
    totalPayouts: 0,
  };

  const chartData = data?.timelines[timeframe] || [];

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="border-b border-border-default/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-amber-500 shadow-sm" />
            Super Admin Console
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">
            Platform operations center, multi-timeframe revenue dashboard, database log audits
          </p>
        </div>

        {/* System Health Strip */}
        <div className="flex flex-wrap items-center gap-3 bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-xl backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <Server className="h-3.5 w-3.5" />
            <span>Web: OK</span>
          </div>
          <span className="text-border-default">|</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <Database className="h-3.5 w-3.5" />
            <span>DB: ONLINE</span>
          </div>
          <span className="text-border-default">|</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Uptime: 99.98%</span>
          </div>
        </div>
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl border border-border-default bg-bg-surface/50 text-xs font-semibold">
        {[
          { id: "overview", label: "Dashboard Overview", icon: Layers },
          { id: "payments", label: "Payments & Revenue", icon: DollarSign },
          { id: "properties", label: "Properties Log", icon: Building },
          { id: "users", label: "Users Log", icon: Users },
          { id: "audit", label: "Security Audit Trails", icon: FileText },
          { id: "actions", label: "Console Actions", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-lg transition-all cursor-pointer",
                activeTab === tab.id
                  ? "bg-bg-surface text-amber-500 border border-border-default shadow-sm font-bold"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-alt/30"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Renderer ── */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Counters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Platform Revenue",
                value: `$${counters.totalRevenue.toFixed(2)}`,
                desc: "10% withdrawal processing fee",
                icon: Coins,
                color: "text-amber-500 bg-amber-500/10",
              },
              {
                label: "Total Deposits",
                value: `$${counters.totalDeposits.toFixed(2)}`,
                desc: "Stripe wallet transactions",
                icon: DollarSign,
                color: "text-emerald-500 bg-emerald-500/10",
              },
              {
                label: "Listed Properties",
                value: counters.totalProperties,
                desc: `${counters.activeProperties} active, ${counters.pendingProperties} pending`,
                icon: Building,
                color: "text-blue-500 bg-blue-500/10",
              },
              {
                label: "Registered Users",
                value: counters.totalUsers,
                desc: "Total platform accounts",
                icon: Users,
                color: "text-purple-500 bg-purple-500/10",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl border border-border-default bg-bg-surface space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">
                      {stat.label}
                    </span>
                    <span className={cn("p-2 rounded-lg", stat.color)}>
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-extrabold font-heading text-text-primary block">
                      {stat.value}
                    </span>
                    <span className="text-[10px] text-text-secondary font-medium leading-relaxed block">
                      {stat.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Quick Chart */}
            <div className="lg:col-span-2 rounded-2xl border border-border-default bg-bg-surface p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-default/50 pb-3">
                <h3 className="font-heading text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-amber-500" /> Platform Transaction Trends
                </h3>
                <span className="text-[10px] font-bold text-text-muted uppercase">Past 12 Months</span>
              </div>
              <div className="h-72 w-full text-xs font-semibold">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.timelines.monthly || []}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border-default/40" />
                    <XAxis dataKey="name" className="fill-text-muted" />
                    <YAxis className="fill-text-muted" />
                    <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px" }} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" name="Revenue (Fees)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="deposits" name="Deposits" stroke="#10b981" fillOpacity={0.05} fill="#10b981" />
                    <Area type="monotone" dataKey="payouts" name="Payouts" stroke="#3b82f6" fillOpacity={0.05} fill="#3b82f6" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Audit / Uptime Card */}
            <div className="rounded-2xl border border-border-default bg-bg-surface p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h4 className="font-heading text-sm font-bold text-text-primary border-b border-border-default/50 pb-3">
                  Developer Health Summary
                </h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between py-1.5 border-b border-border-default/30">
                    <span>Active Users Logged</span>
                    <span className="text-text-primary font-bold">{counters.totalUsers} accounts</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border-default/30">
                    <span>Total Search Index</span>
                    <span className="text-text-primary font-bold">{counters.totalProperties} properties</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border-default/30">
                    <span>Platform Revenue Accumulation</span>
                    <span className="text-amber-500 font-bold">${counters.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border-default/30">
                    <span>Security Audit Events Tracked</span>
                    <span className="text-text-primary font-bold">{data?.auditLogs.length || 0} alerts</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("audit")}
                className="w-full py-2.5 rounded-xl border border-border-default hover:border-border-subtle bg-bg-base hover:bg-bg-elevated text-xs font-bold text-text-secondary hover:text-text-primary flex items-center justify-center gap-1 mt-4 transition-colors"
              >
                Inspect Audit Trails <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYMENTS & REVENUE TAB */}
      {activeTab === "payments" && (
        <div className="space-y-6">
          {/* Revenue Summaries Card */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/50 pb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-text-primary">
                  Payments & Platform Revenue
                </h3>
                <p className="text-xs text-text-muted">Multi-timeframe earnings and system transactional tracking</p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg border border-border-default bg-bg-base text-[11px] font-bold">
                {([
                  { id: "daily", label: "Daily" },
                  { id: "weekly", label: "Weekly" },
                  { id: "monthly", label: "Monthly" },
                  { id: "yearly", label: "Yearly" },
                ] as const).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimeframe(t.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-md transition-all cursor-pointer",
                      timeframe === t.id
                        ? "bg-bg-surface text-amber-500 shadow-xs font-extrabold"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeframe Card Stats */}
            {data?.revenueSummary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-bg-alt/30 p-4 rounded-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">
                    {timeframe.toUpperCase()} REVENUE (FEES)
                  </span>
                  <span className="text-xl font-extrabold text-amber-500 block">
                    ${data.revenueSummary[timeframe]?.revenue.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">
                    {timeframe.toUpperCase()} DEPOSITS
                  </span>
                  <span className="text-xl font-extrabold text-emerald-500 block">
                    ${data.revenueSummary[timeframe]?.deposits.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">
                    {timeframe.toUpperCase()} PAYOUTS (NET)
                  </span>
                  <span className="text-xl font-extrabold text-blue-500 block">
                    ${data.revenueSummary[timeframe]?.payouts.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            )}

            {/* Main Recharts Graph */}
            <div className="h-80 w-full text-xs font-semibold pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border-default/40" />
                  <XAxis dataKey="name" className="fill-text-muted" />
                  <YAxis className="fill-text-muted" />
                  <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Platform Revenue" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="deposits" name="User Deposits" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="payouts" name="Net Payouts" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Logs Ledger */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 space-y-4">
            <h3 className="font-heading text-sm font-bold text-text-primary border-b border-border-default/50 pb-3">
              Platform Transaction Ledger
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-border-default/60 text-text-muted font-bold uppercase select-none">
                    <th className="py-2.5 px-3">User Account</th>
                    <th className="py-2.5 px-3">Transaction Type</th>
                    <th className="py-2.5 px-3">Gross Amount</th>
                    <th className="py-2.5 px-3">Platform Fee</th>
                    <th className="py-2.5 px-3">Transaction Description</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium font-body">
                  {data?.paymentLogs && data.paymentLogs.length > 0 ? (
                    data.paymentLogs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-bg-alt/30">
                        <td className="py-3 px-3">
                          <span className="font-bold text-text-primary block">{tx.userName}</span>
                          <span className="text-[9px] text-text-muted block mt-0.5">{tx.userEmail}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                              tx.type === "deposit" && "text-emerald-400 bg-emerald-500/10",
                              tx.type === "withdraw" && "text-blue-400 bg-blue-500/10",
                              tx.type.includes("transfer") && "text-purple-400 bg-purple-500/10",
                              tx.type.includes("refund") && "text-rose-400 bg-rose-500/10"
                            )}
                          >
                            {tx.type.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-text-primary">
                          {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 font-mono text-text-muted">
                          ${tx.fee.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 truncate max-w-xs text-text-secondary">
                          {tx.description}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={cn(
                              "inline-block w-2 h-2 rounded-full mr-1.5",
                              tx.status === "completed" && "bg-emerald-500",
                              tx.status === "pending" && "bg-amber-500",
                              tx.status === "rejected" && "bg-rose-500"
                            )}
                          />
                          <span className="capitalize text-[10px] font-bold text-text-primary">{tx.status}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-text-muted font-bold font-body">
                        No transactions recorded on this platform.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROPERTIES LOG TAB */}
      {activeTab === "properties" && (
        <div className="rounded-2xl border border-border-default bg-bg-surface p-5 space-y-4">
          <div className="border-b border-border-default/50 pb-3">
            <h3 className="font-heading text-base font-bold text-text-primary">
              Platform Listed Properties Logs
            </h3>
            <p className="text-xs text-text-muted">Tracks listed assets types, prices, views, and owner statuses</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-border-default/60 text-text-muted font-bold uppercase select-none">
                  <th className="py-2.5 px-3">Property Listing</th>
                  <th className="py-2.5 px-3">Lister Profile</th>
                  <th className="py-2.5 px-3">Category / Action</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Views</th>
                  <th className="py-2.5 px-3 text-right">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium font-body">
                {data?.propertyLogs && data.propertyLogs.length > 0 ? (
                  data.propertyLogs.map((p) => (
                    <tr key={p.id} className="hover:bg-bg-alt/30">
                      <td className="py-3 px-3">
                        <span className="font-bold text-text-primary block">{p.title}</span>
                        <span className="text-[9px] text-text-muted font-mono block mt-0.5">{p.id}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-text-primary block">{p.ownerName}</span>
                        <span className="text-[9px] text-text-muted block mt-0.5">{p.ownerEmail}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="capitalize block">{p.category}</span>
                        <span className="text-[9px] text-text-muted uppercase block mt-0.5">{p.type}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-text-primary">
                        ${p.price.toLocaleString()} USD
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {p.views}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase inline-block",
                            p.status === "active" && "text-emerald-400 bg-emerald-500/10",
                            p.status === "pending_approval" && "text-amber-400 bg-amber-500/10",
                            p.status === "rejected" && "text-rose-400 bg-rose-500/10",
                            p.status === "sold" && "text-blue-400 bg-blue-500/10",
                            p.status === "rented" && "text-purple-400 bg-purple-500/10"
                          )}
                        >
                          {p.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-text-muted font-bold font-body">
                      No property listings recorded on the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. USERS LOG TAB */}
      {activeTab === "users" && (
        <div className="rounded-2xl border border-border-default bg-bg-surface p-5 space-y-4">
          <div className="border-b border-border-default/50 pb-3">
            <h3 className="font-heading text-base font-bold text-text-primary">
              Platform Registered Users Registry
            </h3>
            <p className="text-xs text-text-muted font-body">Manage roles authorization and monitor user registry dates</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-border-default/60 text-text-muted font-bold uppercase select-none">
                  <th className="py-2.5 px-3">Member Details</th>
                  <th className="py-2.5 px-3">System Role</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                  <th className="py-2.5 px-3 text-right">Status Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium font-body">
                {data?.userLogs && data.userLogs.length > 0 ? (
                  data.userLogs.map((u) => (
                    <tr key={u.id} className="hover:bg-bg-alt/30">
                      <td className="py-3 px-3">
                        <span className="font-bold text-text-primary block">{u.name}</span>
                        <span className="text-[9px] text-text-muted block mt-0.5">{u.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase inline-block",
                            u.role === "super_admin" && "text-red-400 bg-red-500/10 border border-red-500/25",
                            u.role === "admin" && "text-amber-400 bg-amber-500/10",
                            u.role === "agent" && "text-blue-400 bg-blue-500/10",
                            u.role === "owner" && "text-purple-400 bg-purple-500/10",
                            u.role === "auth_user" && "text-text-secondary bg-bg-alt"
                          )}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-text-muted font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                            u.status === "active" && "text-emerald-400 bg-emerald-500/10",
                            u.status === "pending" && "text-amber-400 bg-amber-500/10",
                            u.status === "suspended" && "text-rose-400 bg-rose-500/10",
                            u.status === "unsubmitted" && "text-text-muted bg-bg-alt/50"
                          )}
                        >
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-text-muted font-bold font-body">
                      No user accounts in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SECURITY AUDIT LOGS TAB */}
      {activeTab === "audit" && (
        <div className="rounded-2xl border border-border-default bg-bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-default/50 pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-text-primary">
                Security Audit Trails
              </h3>
              <p className="text-xs text-text-muted">Immutable events registry tracking operators actions and IP signatures</p>
            </div>
            <span className="text-[10px] font-bold text-text-muted bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20">
              Live Trail
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-border-default/60 text-text-muted font-bold uppercase select-none">
                  <th className="py-2.5 px-3">Operator</th>
                  <th className="py-2.5 px-3">Audit Action</th>
                  <th className="py-2.5 px-3">Operational Details</th>
                  <th className="py-2.5 px-3">IP Signature</th>
                  <th className="py-2.5 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium font-body">
                {data?.auditLogs && data.auditLogs.length > 0 ? (
                  data.auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-amber-500/2">
                      <td className="py-3 px-3">
                        <span className="font-bold text-text-primary block">{log.actorName}</span>
                        <span className="text-[9px] text-text-muted uppercase block mt-0.5">
                          {log.actorRole.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-amber-400">
                        {log.action}
                      </td>
                      <td className="py-3 px-3 truncate max-w-xs text-text-primary">
                        {log.target}
                      </td>
                      <td className="py-3 px-3 font-mono text-text-muted">
                        {log.ipAddress}
                      </td>
                      <td className="py-3 px-3 text-right text-text-muted font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-text-muted font-bold font-body">
                      No security audit events recorded in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. CONSOLE ACTIONS TAB */}
      {activeTab === "actions" && (
        <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-6">
          <div className="border-b border-border-default/50 pb-4">
            <h3 className="font-heading text-base font-bold text-text-primary flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Console Panel Actions
            </h3>
            <p className="text-xs text-text-muted mt-0.5">Global system administrative command triggers</p>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-alt border border-border-default flex items-start gap-2.5 text-xs text-text-secondary font-medium">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Triggering developer overrides (flushing cached models, rebuilding database collections, resetting settings files) directly mutates operational indicators and appends an entry to the security audit trails. Use with caution.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {/* Flush Cache Action */}
            <div className="p-5 rounded-2xl border border-border-default/80 bg-bg-base/30 space-y-3">
              <h4 className="font-heading text-xs font-bold text-text-primary uppercase tracking-wider">
                Buffer Cache Cleanup
              </h4>
              <p className="text-[11px] text-text-muted leading-relaxed font-body">
                Wipes the global cached Redis keys and forces re-evaluation of database queries across active route templates.
              </p>
              <Button
                onClick={handleFlushCache}
                disabled={flushing}
                className="w-full h-11 rounded-xl bg-bg-base hover:bg-bg-elevated border border-border-default hover:border-border-subtle text-text-secondary hover:text-text-primary font-bold gap-2 mt-4 cursor-pointer"
              >
                <RefreshCw className={cn("h-4 w-4 text-amber-500", flushing && "animate-spin")} />
                {flushing ? "Flushing Cache..." : "Flush Global Cache"}
              </Button>
            </div>

            {/* Reset Database Action */}
            <div className="p-5 rounded-2xl border border-border-default/80 bg-bg-base/30 space-y-3">
              <h4 className="font-heading text-xs font-bold text-rose-400 uppercase tracking-wider">
                Full Database Reset
              </h4>
              <p className="text-[11px] text-text-muted leading-relaxed font-body">
                Destroys property listings, inquires, wallet transactions ledger entries and resets platform parameters to standard seeded templates.
              </p>
              <Button
                onClick={handleResetDemo}
                disabled={resetting}
                className="w-full h-11 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/25 hover:border-transparent text-amber-400 hover:text-white font-bold gap-2 mt-4 transition-all duration-200 cursor-pointer"
              >
                <Key className="h-4 w-4" />
                {resetting ? "Resetting Database..." : "Reset Platform Defaults"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
