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
  ShieldAlert,
  MoreVertical,
  Download,
  FileText
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
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/lib/types";
import { DocumentViewer } from "@/components/shared/document-viewer";
 
export function AdminDashboardClient() {
  const { getUsers, updateUserStatus } = useAuth();
  const [users, setUsers] = React.useState<User[]>([]);
  const [pendingListings, setPendingListings] = React.useState(
    mockProperties.slice(4, 7).map(p => ({ ...p, status: "pending_approval" as const }))
  );
 
  // Suspension reason dialog states
  const [showBanDialog, setShowBanDialog] = React.useState(false);
  const [banUserId, setBanUserId] = React.useState("");
  const [banUserName, setBanUserName] = React.useState("");
  const [banReason, setBanReason] = React.useState("");

  // Document Viewer Modal State
  const [showDocViewer, setShowDocViewer] = React.useState(false);
  const [selectedAgentForDoc, setSelectedAgentForDoc] = React.useState<User | null>(null);

  const handleViewDoc = (agent: User) => {
    setSelectedAgentForDoc(agent);
    setShowDocViewer(true);
  };

  const refreshList = React.useCallback(() => {
    setUsers(getUsers());
  }, [getUsers]);

  React.useEffect(() => {
    Promise.resolve().then(() => {
      refreshList();
    });
  }, [refreshList]);

  const handleApproveListing = (id: string, title: string) => {
    setPendingListings(prev => prev.filter(p => p.id !== id));
    toast.success("Listing Approved", { description: `"${title}" has been successfully published.` });
  };

  const handleRejectListing = (id: string, title: string) => {
    setPendingListings(prev => prev.filter(p => p.id !== id));
    toast.error("Listing Rejected", { description: `"${title}" has been rejected and archived.` });
  };

  const agentsWithDocs = React.useMemo(() => {
    return users.filter(u => u.role === "agent" && u.legalDocs);
  }, [users]);

  const triggerSuspension = (userId: string, name: string) => {
    setBanUserId(userId);
    setBanUserName(name);
    setBanReason("");
    setShowBanDialog(true);
  };

  const confirmSuspension = () => {
    if (!banReason.trim()) {
      toast.error("Explanation required", { description: "Please state why this account is being suspended." });
      return;
    }
    updateUserStatus(banUserId, "suspended", banReason.trim());
    toast.success("Account suspended", {
      description: `"${banUserName}" account has been suspended.`,
    });
    setShowBanDialog(false);
    refreshList();
  };

  const handleStatusChange = (userId: string, name: string, status: "active" | "pending" | "suspended") => {
    if (status === "suspended") {
      triggerSuspension(userId, name);
    } else {
      updateUserStatus(userId, status);
      toast.success("Status updated", {
        description: `"${name}" account status updated to ${status}.`,
      });
      refreshList();
    }
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
      <div className="border-b border-border-default pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
          Moderation Portal: <span className="text-accent-primary">Dashboard</span>
        </h1>
        <p className="text-xs text-text-muted font-medium font-body">Supervise platform activity, approve agent listings, and moderate user reports</p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">
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

      {/* ── Line Chart for Registration ── */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-heading text-base font-bold text-text-primary">Platform Growth Trends</h3>
          <p className="text-xs text-text-muted font-medium">Monthly signups of members and real estate agents</p>
        </div>
        <div className="h-72 sm:h-80 w-full pr-4 text-xs font-semibold text-text-muted">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockSignupsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" opacity={0.3} />
              <XAxis dataKey="month" stroke="var(--text-muted)" strokeWidth={0.5} />
              <YAxis stroke="var(--text-muted)" strokeWidth={0.5} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-alt)",
                  borderColor: "var(--border-default)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
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
        <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-default/50 pb-4">
              <h3 className="font-heading text-base font-bold text-text-primary">Pending Approval Queue</h3>
              <Link href="/admin/listings" className="text-xs text-accent-primary font-bold hover:underline">
                View full queue
              </Link>
            </div>

            {pendingListings.length === 0 ? (
              <div className="py-12 text-center text-text-muted text-xs font-bold flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
                <span>Approval queue completely cleared!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingListings.map((prop) => (
                  <div key={prop.id} className="p-3 rounded-xl bg-bg-base border border-border-default flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="h-10 w-10 rounded-lg object-cover border border-border-default shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-text-primary block truncate text-xs">{prop.title}</span>
                        <span className="text-[10px] text-text-muted font-semibold block mt-0.5">{prop.city}, {prop.state}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        onClick={() => handleRejectListing(prop.id, prop.title)}
                        size="icon-sm"
                        variant="ghost"
                        className="h-8 w-8 text-text-muted hover:text-rose-500 hover:bg-bg-elevated rounded-lg cursor-pointer"
                        title="Reject listing"
                      >
                        <XCircle className="h-4.5 w-4.5" />
                      </Button>
                      <Button
                        onClick={() => handleApproveListing(prop.id, prop.title)}
                        size="icon-sm"
                        className="h-8 w-8 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white rounded-lg flex items-center justify-center border border-emerald-500/20 hover:border-transparent transition-all cursor-pointer"
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

        {/* Agent Credentials Verification Table */}
        <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-default/50 pb-4">
              <h3 className="font-heading text-base font-bold text-text-primary">Agent Credentials Verification</h3>
              <Link href="/admin/users" className="text-xs text-accent-primary font-bold hover:underline">
                Manage all accounts
              </Link>
            </div>
 
            <div className="overflow-x-auto">
              {agentsWithDocs.length === 0 ? (
                <div className="py-12 text-center text-text-muted text-xs font-bold flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-text-faint" />
                  <span>No agent credential submissions found.</span>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border-default text-text-muted font-extrabold uppercase select-none">
                      <th className="py-2.5 px-3">Agent</th>
                      <th className="py-2.5 px-3">Credentials</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium">
                    {agentsWithDocs.map((agent) => (
                      <tr key={agent.id} className="hover:bg-bg-alt/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-text-primary block">{agent.name}</span>
                          <span className="text-[10px] text-text-muted font-semibold block mt-0.5">{agent.email}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="space-y-0.5">
                            <span className="font-bold text-text-primary block">{agent.legalDocs?.agencyName}</span>
                            <span className="text-[10px] text-text-muted font-mono flex items-center gap-1.5 mt-0.5">
                              Lic: {agent.legalDocs?.licenseNumber}
                              {agent.legalDocs?.documentUrl && (
                                <button
                                  onClick={() => handleViewDoc(agent)}
                                  className="text-accent-primary hover:underline font-bold text-[9px] uppercase cursor-pointer"
                                  title="Open submitted credentials"
                                >
                                  (View Doc)
                                </button>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                            agent.status === "active" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/20" :
                            agent.status === "pending" ? "text-amber-600 dark:text-amber-400 bg-amber-500/5 border-amber-500/20" :
                            agent.status === "unsubmitted" ? "text-text-muted bg-bg-alt border border-border-default" :
                            "text-rose-600 dark:text-rose-400 bg-rose-500/5 border-rose-500/20"
                          )}>
                            {agent.status === "pending" ? "Pending Review" : agent.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-text-primary rounded-lg cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            } />
                            <DropdownMenuContent align="end" className="w-44 bg-bg-surface border border-border-default rounded-xl p-1 shadow-2xl">
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(agent.id, agent.name, "active")}
                                className="rounded-lg text-xs font-semibold py-2 px-2.5 cursor-pointer hover:bg-bg-alt flex items-center justify-between text-emerald-600 dark:text-emerald-400"
                              >
                                Activate Account
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(agent.id, agent.name, "pending")}
                                className="rounded-lg text-xs font-semibold py-2 px-2.5 cursor-pointer hover:bg-bg-alt flex items-center justify-between text-amber-600 dark:text-amber-400"
                              >
                                Mark Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(agent.id, agent.name, "suspended")}
                                className="rounded-lg text-xs font-semibold py-2 px-2.5 cursor-pointer hover:bg-bg-alt flex items-center justify-between text-rose-600 dark:text-rose-450"
                              >
                                Suspend Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
 
      </div>

      {/* ── Custom Suspension Dialog ── */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="max-w-md bg-bg-surface border-border-default text-text-primary rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-4 border-b border-border-default">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-3">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <DialogTitle className="text-text-primary text-lg font-bold font-heading">Suspend Account</DialogTitle>
            <DialogDescription className="text-text-muted text-xs mt-1">
              Specify the reason why &ldquo;{banUserName}&rdquo; is being suspended.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Reason for Suspension *
              </label>
              <textarea
                placeholder="e.g. Failure to submit verified real estate license registration documentation."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
                className="w-full text-sm border bg-bg-base text-text-primary border-border-default rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none font-medium"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowBanDialog(false)}
              variant="outline"
              className="flex-1 h-10 rounded-xl border-border-default text-text-secondary cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSuspension}
              disabled={!banReason.trim()}
              className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Suspend Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
 
      {/* ── Document Viewer Modal ── */}
      {selectedAgentForDoc && selectedAgentForDoc.legalDocs && (
        <DocumentViewer
          isOpen={showDocViewer}
          onClose={() => {
            setShowDocViewer(false);
            setSelectedAgentForDoc(null);
          }}
          documentUrl={selectedAgentForDoc.legalDocs.documentUrl}
          agentName={selectedAgentForDoc.name}
          licenseNumber={selectedAgentForDoc.legalDocs.licenseNumber}
          agencyName={selectedAgentForDoc.legalDocs.agencyName}
        />
      )}
 
    </div>
  );
}
