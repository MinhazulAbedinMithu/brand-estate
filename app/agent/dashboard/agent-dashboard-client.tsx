"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  TrendingUp,
  Inbox,
  Eye,
  PlusCircle,
  ArrowRight,
  MessageSquare,
  BadgeAlert,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { mockUserInquiries, mockViewsHistory } from "@/src/mocks/dashboardMock";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";

// Filter mock properties listed by agent (or general properties for demo)
const agentProperties = mockProperties.slice(0, 4);

export function AgentDashboardClient() {
  const { currentUser } = useAuth();
  
  const stats = [
    {
      label: "Active Listings",
      value: "8",
      change: "+2 new listings",
      icon: Building2,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Total Views",
      value: "1,890",
      change: "+12.4% vs last month",
      icon: Eye,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Unread Leads",
      value: "3",
      change: "Response time ~12h",
      icon: Inbox,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      label: "Closed Deals",
      value: "12",
      change: "Target: 15 this quarter",
      icon: TrendingUp,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Agent Workspace: <span className="text-accent-primary">Overview</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage properties, track leads performance, and analyze platform visibility</p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/agent/listings/new" />} size="sm" className="h-10 rounded-full bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-5">
            <span className="flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Create Listing</span>
          </Button>
          <Button render={<Link href="/agent/leads" />} size="sm" variant="outline" className="h-10 rounded-full border-slate-800 hover:bg-slate-800 text-slate-200 px-5">
            View Leads
          </Button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800/60 bg-[#0A101C] p-5 sm:p-6 shadow-sm hover:border-slate-700/60 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    {stat.label}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                    {stat.value}
                  </span>
                </div>
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 font-semibold flex items-center gap-1">
                <span className="text-accent-primary">●</span> {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Recharts Analytics Chart ── */}
      <div className="rounded-2xl border border-slate-800/60 bg-[#0A101C] p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-heading text-base font-bold text-white">Listing Performance Stats</h3>
          <p className="text-xs text-slate-500 font-medium">Property page views vs client inquiry conversions (leads)</p>
        </div>
        <div className="h-72 sm:h-80 w-full pr-4 text-xs font-semibold text-slate-500">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockViewsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.3} />
              <XAxis dataKey="name" stroke="#475569" strokeWidth={0.5} />
              <YAxis yAxisId="left" stroke="#475569" strokeWidth={0.5} label={{ value: 'Views count', angle: -90, position: 'insideLeft', offset: -5 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#475569" strokeWidth={0.5} label={{ value: 'Leads count', angle: 90, position: 'insideRight', offset: -5 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F1829",
                  borderColor: "#1E293B",
                  borderRadius: "12px",
                  color: "#F3F4F6",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar yAxisId="left" dataKey="views" name="Page Views" fill="#0067D2" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="leads" name="User Leads" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Two Column Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Listings Visibility Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/60 bg-[#0A101C] p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-4">
              <h3 className="font-heading text-base font-bold text-white">Popular Listings</h3>
              <Link href="/agent/listings" className="text-xs text-accent-primary font-bold hover:underline">
                Manage listings
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/60 text-slate-500 font-extrabold uppercase">
                    <th className="py-2.5 px-3">Listing Details</th>
                    <th className="py-2.5 px-3">Views</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-350 font-medium">
                  {agentProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-[#0F1829]/20 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="h-8 w-8 rounded-md object-cover border border-slate-850"
                          />
                          <span className="font-bold text-white truncate max-w-[150px] sm:max-w-xs block">
                            {prop.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-400">
                        {(prop.price / 800 + 120).toFixed(0)}
                      </td>
                      <td className="py-3 px-3 capitalize">
                        {prop.transactionType.replace("_", " ")}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                          {prop.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lead inquiries sidebar summary */}
        <div className="rounded-2xl border border-slate-800/60 bg-[#0A101C] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-4">
              <h3 className="font-heading text-base font-bold text-white">Active Leads Inbox</h3>
              <Link href="/agent/leads" className="text-xs text-accent-primary font-bold hover:underline">
                Open inbox
              </Link>
            </div>

            <div className="space-y-3">
              {mockUserInquiries.slice(0, 3).map((inq) => (
                <div key={inq.id} className="p-3 rounded-xl bg-[#0F1829] border border-slate-800 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">Buyer Inquiry</span>
                    <span className={cn(
                      "text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border tracking-wider",
                      inq.status === "pending" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                    )}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">&ldquo;{inq.message}&rdquo;</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-800/40">
                    <span>Inq #{inq.id}</span>
                    <span>{inq.submittedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button render={<Link href="/agent/leads" />} variant="ghost" className="w-full text-xs font-bold text-accent-primary hover:text-white hover:bg-slate-800/50 mt-4 rounded-xl">
            <span className="flex items-center justify-center gap-1.5 w-full">
              Review and reply all <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
