"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Building,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  CheckCircle,
  XCircle,
  Eye,
  ShieldAlert
} from "lucide-react";
import { mockSignupsHistory } from "@/src/mocks/dashboardMock";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Demo data for recent registrations
const initialRegistrations = [
  { name: "Marcus Aurelius", email: "marcus@philosophy.org", role: "Agent", joined: "2026-06-14", status: "Active" },
  { name: "John Doe", email: "john@doe.com", role: "Member", joined: "2026-06-14", status: "Active" },
  { name: "Jane Smith", email: "jane@smith.com", role: "Member", joined: "2026-06-13", status: "Suspended" },
  { name: "Li Na", email: "lina@net.cn", role: "Agent", joined: "2026-06-12", status: "Active" },
];

export function AdminDashboardClient() {
  const [registrations, setRegistrations] = React.useState(initialRegistrations);
  const [pendingListings, setPendingListings] = React.useState(
    mockProperties.slice(4, 7).map(p => ({ ...p, status: "pending_approval" as const }))
  );

  const handleApproveListing = (id: string, title: string) => {
    setPendingListings(prev => prev.filter(p => p.id !== id));
    toast.success("Listing Approved", { description: `"${title}" has been successfully published.` });
  };

  const handleRejectListing = (id: string, title: string) => {
    setPendingListings(prev => prev.filter(p => p.id !== id));
    toast.error("Listing Rejected", { description: `"${title}" has been rejected and archived.` });
  };

  const stats = [
    { label: "Total Users", value: "1,240", change: "+18 this week", icon: Users, color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    { label: "Active Listings", value: "348", change: "+14 since yesterday", icon: Building, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { label: "Daily Inquiries", value: "89", change: "+5.4% conversion", icon: MessageSquare, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Pending Approvals", value: pendingListings.length, change: "Requires reviews", icon: ShieldAlert, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  ];

  return (
    <div className="space-y-8">
      
      {/* ── Page Header ── */}
      <div className="border-b border-slate-800/60 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
          Moderation Portal: <span className="text-accent-primary">Dashboard</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium font-body">Supervise platform activity, approve agent listings, and moderate user reports</p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800/60 bg-[#0A101C] p-5 sm:p-6 shadow-sm relative overflow-hidden group"
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

      {/* ── Line Chart for Registration ── */}
      <div className="rounded-2xl border border-slate-800/60 bg-[#0A101C] p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-heading text-base font-bold text-white">Platform Growth Trends</h3>
          <p className="text-xs text-slate-500 font-medium">Monthly signups of members and real estate agents</p>
        </div>
        <div className="h-72 sm:h-80 w-full pr-4 text-xs font-semibold text-slate-500">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockSignupsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.3} />
              <XAxis dataKey="month" stroke="#475569" strokeWidth={0.5} />
              <YAxis stroke="#475569" strokeWidth={0.5} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F1829",
                  borderColor: "#1E293B",
                  borderRadius: "12px",
                  color: "#F3F4F6",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Line type="monotone" dataKey="Users" stroke="#0067D2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Agents" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Double Columns Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Pending Listings Approval Queue */}
        <div className="rounded-2xl border border-slate-800/60 bg-[#0A101C] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-4">
              <h3 className="font-heading text-base font-bold text-white">Pending Approval Queue</h3>
              <Link href="/admin/listings" className="text-xs text-accent-primary font-bold hover:underline">
                View full queue
              </Link>
            </div>

            {pendingListings.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs font-bold flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
                <span>Approval queue completely cleared!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingListings.map((prop) => (
                  <div key={prop.id} className="p-3 rounded-xl bg-[#0F1829] border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="h-10 w-10 rounded-lg object-cover border border-slate-850 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate text-xs">{prop.title}</span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">{prop.city}, {prop.state}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        onClick={() => handleRejectListing(prop.id, prop.title)}
                        size="icon-sm"
                        variant="ghost"
                        className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-slate-800 rounded-lg"
                        title="Reject listing"
                      >
                        <XCircle className="h-4.5 w-4.5" />
                      </Button>
                      <Button
                        onClick={() => handleApproveListing(prop.id, prop.title)}
                        size="icon-sm"
                        className="h-8 w-8 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg flex items-center justify-center border border-emerald-500/20 hover:border-transparent transition-all"
                        title="Approve listing"
                      >
                        <CheckCircle className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="rounded-2xl border border-slate-800/60 bg-[#0A101C] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-4">
              <h3 className="font-heading text-base font-bold text-white">Recent Member Signups</h3>
              <Link href="/admin/users" className="text-xs text-accent-primary font-bold hover:underline">
                Manage all accounts
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/60 text-slate-500 font-extrabold uppercase select-none">
                    <th className="py-2.5 px-3">Name / Email</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-350 font-medium">
                  {registrations.map((user, idx) => (
                    <tr key={idx} className="hover:bg-[#0F1829]/20 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-white block">{user.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">{user.email}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {user.role}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                          user.status === "Active"
                            ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/20"
                            : "text-rose-400 bg-rose-500/5 border-rose-500/20"
                        )}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
