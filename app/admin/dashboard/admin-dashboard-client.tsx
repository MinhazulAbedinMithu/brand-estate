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
import type { User, AdminStats } from "@/lib/types";
import type { MockProperty } from "@/src/mocks/propertyTypes";
import { DocumentViewer } from "@/components/shared/document-viewer";
 
export function AdminDashboardClient() {
  const { getUsers, updateUserStatus, updateUserNidStatus } = useAuth();
  const [users, setUsers] = React.useState<User[]>([]);
  const [pendingListings, setPendingListings] = React.useState<MockProperty[]>([]);
  const [analytics, setAnalytics] = React.useState<AdminStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Verification links management
  const [backgroundCheckUrl, setBackgroundCheckUrl] = React.useState("https://check.realhoms.com/test-bg-report");
  const [creditScoreCheckUrl, setCreditScoreCheckUrl] = React.useState("https://check.realhoms.com/test-credit-score");
  const [savingSettings, setSavingSettings] = React.useState(false);

  // Verification Inspector Modal States
  const [showInspector, setShowInspector] = React.useState(false);
  const [selectedUserForInspector, setSelectedUserForInspector] = React.useState<User | null>(null);
  const [rejectType, setRejectType] = React.useState<'kyc' | 'nid' | 'background' | 'credit' | null>(null);
  const [rejectReasonText, setRejectReasonText] = React.useState("");
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(null);
 
  // Suspension reason dialog states
  const [showBanDialog, setShowBanDialog] = React.useState(false);
  const [banUserId, setBanUserId] = React.useState("");
  const [banUserName, setBanUserName] = React.useState("");
  const [banReason, setBanReason] = React.useState("");

  // NID rejection dialog states
  const [showNidRejectDialog, setShowNidRejectDialog] = React.useState(false);
  const [nidRejectUserId, setNidRejectUserId] = React.useState("");
  const [nidRejectUserName, setNidRejectUserName] = React.useState("");
  const [nidRejectReason, setNidRejectReason] = React.useState("");

  // Document Viewer Modal State
  const [showDocViewer, setShowDocViewer] = React.useState(false);
  const [selectedAgentForDoc, setSelectedAgentForDoc] = React.useState<User | null>(null);

  // NID Document Viewer Modal State
  const [showNidDocViewer, setShowNidDocViewer] = React.useState(false);
  const [selectedUserForNid, setSelectedUserForNid] = React.useState<User | null>(null);

  // Generic Document Viewer Modal State
  const [showGenericDocViewer, setShowGenericDocViewer] = React.useState(false);
  const [genericDocUrl, setGenericDocUrl] = React.useState("");
  const [genericDocTitle, setGenericDocTitle] = React.useState("");

  const handleViewDoc = (agent: User) => {
    setSelectedAgentForDoc(agent);
    setShowDocViewer(true);
  };

  const handleViewNid = (user: User) => {
    setSelectedUserForNid(user);
    setShowNidDocViewer(true);
  };

  const handleApproveNid = async (userId: string, userName: string) => {
    try {
      const res = await updateUserNidStatus(userId, "verified");
      if (res.success) {
        toast.success("NID Approved", {
          description: `Identity documents for ${userName} have been verified.`
        });
        refreshList();
      } else {
        toast.error("Failed to approve NID");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during NID approval.");
    }
  };

  const handleTriggerNidReject = (userId: string, userName: string) => {
    setNidRejectUserId(userId);
    setNidRejectUserName(userName);
    setNidRejectReason("");
    setShowNidRejectDialog(true);
  };

  const confirmNidRejection = async () => {
    if (!nidRejectReason.trim()) {
      toast.error("Reason required", { description: "Please explain why you are rejecting this NID." });
      return;
    }
    try {
      const res = await updateUserNidStatus(nidRejectUserId, "rejected", nidRejectReason.trim());
      if (res.success) {
        toast.error("NID Rejected", {
          description: `Identity documents for ${nidRejectUserName} have been rejected.`
        });
        setShowNidRejectDialog(false);
        refreshList();
      } else {
        toast.error("Failed to reject NID");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during NID rejection.");
    }
  };

  const refreshList = React.useCallback(() => {
    setUsers(getUsers());
  }, [getUsers]);

  const loadDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsRes, pendingRes, settingsRes] = await Promise.all([
        fetch("/api/analytics/admin"),
        fetch("/api/properties?status=pending_approval&limit=5"),
        fetch("/api/settings")
      ]);
      const analyticsJson = await analyticsRes.json();
      const pendingJson = await pendingRes.json();
      const settingsJson = await settingsRes.json();

      if (analyticsJson.status === "success") {
        setAnalytics(analyticsJson.data);
      }
      if (pendingJson.status === "success") {
        setPendingListings(pendingJson.data || []);
      }
      if (settingsJson.status === "success" && settingsJson.data) {
        setBackgroundCheckUrl(settingsJson.data.backgroundCheckUrl || "https://check.realhoms.com/test-bg-report");
        setCreditScoreCheckUrl(settingsJson.data.creditScoreCheckUrl || "https://check.realhoms.com/test-credit-score");
      }
    } catch (err) {
      console.error("Failed to load admin dashboard statistics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundCheckUrl, creditScoreCheckUrl }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Verification check links updated successfully! 🚀");
      } else {
        toast.error("Failed to save links", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving verification links");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleVerificationDecision = async (userId: string, type: 'kyc' | 'nid' | 'background' | 'credit', status: 'verified' | 'rejected' | 'pending', reason?: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/verification-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, status, reason })
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(`Verification ${status === 'verified' ? 'approved' : 'rejected'} successfully! 🚀`);
        
        // Refresh users list
        const usersRes = await fetch("/api/admin/users");
        const usersJson = await usersRes.json();
        if (usersJson.status === "success") {
          const freshUsers = usersJson.data || [];
          setUsers(freshUsers);
          
          // Update selected user in inspector
          const updatedUser = freshUsers.find((u: any) => u.id === userId);
          if (updatedUser) {
            setSelectedUserForInspector(updatedUser);
          } else {
            setShowInspector(false);
          }
        }
      } else {
        toast.error("Failed to update status", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error submitting decision");
    }
  };

  React.useEffect(() => {
    Promise.resolve().then(() => {
      refreshList();
      loadDashboardData();
    });
  }, [refreshList, loadDashboardData]);

  const handleApproveListing = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" })
      });
      const result = await response.json();
      if (result.status === "success") {
        setPendingListings(prev => prev.filter(p => p.id !== id));
        toast.success("Listing Approved", { description: `"${title}" has been successfully published.` });
        loadDashboardData();
      } else {
        toast.error("Failed to approve listing", { description: result.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error approving listing");
    }
  };

  const handleRejectListing = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      });
      const result = await response.json();
      if (result.status === "success") {
        setPendingListings(prev => prev.filter(p => p.id !== id));
        toast.error("Listing Rejected", { description: `"${title}" has been rejected.` });
        loadDashboardData();
      } else {
        toast.error("Failed to reject listing", { description: result.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error rejecting listing");
    }
  };

  const agentsWithDocs = React.useMemo(() => {
    return users.filter(u => (u.role === "agent" || u.role === "owner") && u.legalDocs);
  }, [users]);

  const pendingVerificationUsers = React.useMemo(() => {
    return users.filter(u => 
      u.nidStatus === "pending" ||
      u.kycStatus === "pending" ||
      u.backgroundReportStatus === "pending" ||
      u.creditReportStatus === "pending"
    );
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

  const stats = React.useMemo(() => {
    if (!analytics) {
      return [
        { label: "Total Users", value: "...", change: "—", icon: Users, color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
        { label: "Active Listings", value: "...", change: "—", icon: Building, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
        { label: "Daily Inquiries", value: "...", change: "—", icon: MessageSquare, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
        { label: "Pending Approvals", value: "...", change: "Requires reviews", icon: ShieldAlert, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
      ];
    }
    const s = analytics.stats;
    return [
      { label: "Total Users", value: s.totalUsers.toLocaleString(), change: "Registered accounts", icon: Users, color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
      { label: "Active Listings", value: s.activeListings.toLocaleString(), change: "Public discoverable listings", icon: Building, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
      { label: "Daily Inquiries", value: s.dailyInquiries.toLocaleString(), change: "leads in last 24h", icon: MessageSquare, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
      { label: "Pending Approvals", value: s.pendingApprovals.toString(), change: "Needs evaluation", icon: ShieldAlert, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    ];
  }, [analytics]);

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
            <LineChart data={analytics?.signupsHistory || []}>
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
              <h3 className="font-heading text-base font-bold text-text-primary">Credentials Verification Queue</h3>
              <Link href="/admin/users" className="text-xs text-accent-primary font-bold hover:underline">
                Manage all accounts
              </Link>
            </div>
 
            <div className="overflow-x-auto">
              {agentsWithDocs.length === 0 ? (
                <div className="py-12 text-center text-text-muted text-xs font-bold flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-text-faint" />
                  <span>No credential submissions found.</span>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border-default text-text-muted font-extrabold uppercase select-none">
                      <th className="py-2.5 px-3">User</th>
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
                          <span className="text-[10px] text-text-muted font-semibold block mt-0.5">
                            {agent.email}
                            <span className={cn(
                              "ml-2 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider border",
                              agent.role === "agent" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-cyan-500 bg-cyan-500/10 border-cyan-500/20"
                            )}>
                              {agent.role}
                            </span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="space-y-0.5">
                            <span className="font-bold text-text-primary block">{agent.legalDocs?.agencyName}</span>
                            <span className="text-[10px] text-text-muted font-mono flex items-center gap-1.5 mt-0.5">
                              {agent.role === "owner" ? "Doc ID: " : "Lic: "}{agent.legalDocs?.licenseNumber}
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

      {/* ── Verification & Screening Console ── */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default/50 pb-4">
            <div>
              <h3 className="font-heading text-base font-bold text-text-primary">Verification & Screening Queue</h3>
              <p className="text-xs text-text-muted font-medium mt-0.5">Audit identity documents, background check clearances, and credit history details for all platform roles.</p>
            </div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-bg-alt px-2.5 py-1 rounded-lg border border-border-default shrink-0">
              Pending: {pendingVerificationUsers.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            {pendingVerificationUsers.length === 0 ? (
              <div className="py-12 text-center text-text-muted text-xs font-bold flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
                <span>All verification checks cleared!</span>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-default text-text-muted font-extrabold uppercase select-none">
                    <th className="py-2.5 px-3">User Account</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">KYC Status</th>
                    <th className="py-2.5 px-3">Background check</th>
                    <th className="py-2.5 px-3">Credit score</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium">
                  {pendingVerificationUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-bg-alt/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-text-primary block">{user.name}</span>
                        <span className="text-[10px] text-text-muted block">{user.email}</span>
                      </td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-bold">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full border",
                          user.role === "agent" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                          user.role === "owner" ? "text-sky-500 bg-sky-500/5 border-sky-500/10" :
                          "text-amber-500 bg-amber-500/5 border-amber-500/10"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={cn(
                          "font-bold uppercase text-[9px] px-2 py-0.5 rounded-md border",
                          user.kycStatus === "verified" || user.nidStatus === "verified" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                          user.kycStatus === "pending" || user.nidStatus === "pending" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                          user.kycStatus === "rejected" || user.nidStatus === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" :
                          "text-text-muted bg-bg-alt border-border-default"
                        )}>
                          {user.kycStatus === "verified" || user.nidStatus === "verified" ? "KYC Approved" :
                           user.kycStatus === "pending" || user.nidStatus === "pending" ? "KYC Pending" :
                           user.kycStatus === "rejected" || user.nidStatus === "rejected" ? "KYC Rejected" :
                           "Unsubmitted"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={cn(
                          "font-bold uppercase text-[9px] px-2 py-0.5 rounded-md border",
                          user.backgroundReportStatus === "verified" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                          user.backgroundReportStatus === "pending" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                          user.backgroundReportStatus === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" :
                          "text-text-muted bg-bg-alt border-border-default"
                        )}>
                          {user.backgroundReportStatus === "verified" ? "BG Clean" :
                           user.backgroundReportStatus === "pending" ? "BG Pending" :
                           user.backgroundReportStatus === "rejected" ? "BG Rejected" :
                           "Unsubmitted"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={cn(
                          "font-bold uppercase text-[9px] px-2 py-0.5 rounded-md border",
                          user.creditReportStatus === "verified" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                          user.creditReportStatus === "pending" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                          user.creditReportStatus === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" :
                          "text-text-muted bg-bg-alt border-border-default"
                        )}>
                          {user.creditReportStatus === "verified" ? `Credit Ok (${user.creditScore || "—"})` :
                           user.creditReportStatus === "pending" ? "Credit Pending" :
                           user.creditReportStatus === "rejected" ? "Credit Rejected" :
                           "Unsubmitted"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Button
                          onClick={() => {
                            setSelectedUserForInspector(user);
                            setShowInspector(true);
                          }}
                          size="sm"
                          className="h-8 bg-accent-primary hover:bg-accent-primary-hov text-white font-bold text-[10px] px-3.5 rounded-xl shadow-sm transition-all"
                        >
                          Review Verifications
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Verification Check URLs Management ── */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border-default/50 pb-4">
            <h3 className="font-heading text-base font-bold text-text-primary">Verification Check URLs</h3>
            <p className="text-xs text-text-muted font-medium mt-0.5">Customize the links users navigate to for completing their background search and credit screening tests.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-semibold">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Background Search Link</label>
                <input
                  type="url"
                  required
                  value={backgroundCheckUrl}
                  onChange={(e) => setBackgroundCheckUrl(e.target.value)}
                  placeholder="https://check.realhoms.com/test-bg-report"
                  className="w-full h-10 px-3.5 border bg-bg-base text-text-primary border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Credit Screening Link</label>
                <input
                  type="url"
                  required
                  value={creditScoreCheckUrl}
                  onChange={(e) => setCreditScoreCheckUrl(e.target.value)}
                  placeholder="https://check.realhoms.com/test-credit-score"
                  className="w-full h-10 px-3.5 border bg-bg-base text-text-primary border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={savingSettings}
                className="h-10 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white font-bold px-6 shadow-md transition-all active:scale-98"
              >
                {savingSettings ? "Saving Settings..." : "Save Verification Links"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Verification & Screening Inspector Dialog ── */}
      <Dialog open={showInspector} onOpenChange={setShowInspector}>
        <DialogContent className="max-w-2xl bg-bg-surface border-border-default text-text-primary rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
          <DialogHeader className="border-b border-border-default pb-4">
            <DialogTitle className="text-text-primary text-lg font-bold font-heading flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent-primary" />
              Audit User Verification Center
            </DialogTitle>
            <DialogDescription className="text-text-muted text-xs mt-1">
              Verify credentials and review identity/screening uploads for {selectedUserForInspector?.name}.
            </DialogDescription>
          </DialogHeader>

          {selectedUserForInspector && (
            <div className="space-y-6 py-4">
              {/* User overview quick stats */}
              <div className="p-4 bg-bg-alt/30 border border-border-default rounded-2xl flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-text-primary block text-sm">{selectedUserForInspector.name}</span>
                  <span className="text-text-muted block mt-0.5">{selectedUserForInspector.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Account Role</span>
                  <span className="font-bold text-accent-primary uppercase mt-0.5 block">{selectedUserForInspector.role}</span>
                </div>
              </div>

              {/* Module 1: Phone OTP Status */}
              <div className="p-4 border border-border-default rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">1. Phone (OTP) Verification</h4>
                  <span className={cn(
                    "font-bold uppercase text-[9px] px-2 py-0.5 rounded-full border",
                    selectedUserForInspector.phoneVerified ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" : "text-text-muted bg-bg-alt border-border-default"
                  )}>
                    {selectedUserForInspector.phoneVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary text-left">
                  Phone number: <span className="font-mono font-bold text-text-primary">{selectedUserForInspector.phone || "Not provided"}</span>
                </p>
              </div>

              {/* Module 2: KYC Identity Documents (Front, Back, Selfie) */}
              <div className="p-4 border border-border-default rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border-default/50 pb-2">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">2. KYC Identity Verification</h4>
                  <span className={cn(
                    "font-bold uppercase text-[9px] px-2 py-0.5 rounded-full border",
                    selectedUserForInspector.kycStatus === "verified" || selectedUserForInspector.nidStatus === "verified" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                    selectedUserForInspector.kycStatus === "pending" || selectedUserForInspector.nidStatus === "pending" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                    selectedUserForInspector.kycStatus === "rejected" || selectedUserForInspector.nidStatus === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" :
                    "text-text-muted bg-bg-alt border-border-default"
                  )}>
                    KYC: {selectedUserForInspector.kycStatus || selectedUserForInspector.nidStatus || "unsubmitted"}
                  </span>
                </div>

                {selectedUserForInspector.kycFrontUrl || selectedUserForInspector.kycBackUrl || selectedUserForInspector.kycSelfieUrl || selectedUserForInspector.nidDocumentUrl ? (
                  <div className="space-y-4 text-xs font-medium">
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase">Document Type</span>
                        <span className="font-bold text-text-primary block mt-0.5 uppercase">{selectedUserForInspector.kycDocType || "nid"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase">Document Number</span>
                        <span className="font-mono font-bold text-text-primary block mt-0.5">{selectedUserForInspector.kycDocNumber || selectedUserForInspector.nidCardNumber || "—"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1 text-center">
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Front side</span>
                        {selectedUserForInspector.kycFrontUrl || selectedUserForInspector.nidDocumentUrl ? (
                          <button
                            onClick={() => setPreviewImageUrl(selectedUserForInspector.kycFrontUrl || selectedUserForInspector.nidDocumentUrl || null)}
                            className="block w-full relative h-28 border border-border-default rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-zoom-in"
                          >
                            <img src={selectedUserForInspector.kycFrontUrl || selectedUserForInspector.nidDocumentUrl} alt="Front Document" className="object-cover w-full h-full" />
                          </button>
                        ) : (
                          <div className="h-28 rounded-xl border border-border-default bg-bg-alt flex items-center justify-center text-[10px] text-text-muted">Missing</div>
                        )}
                      </div>
                      <div className="space-y-1 text-center">
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Back side</span>
                        {selectedUserForInspector.kycBackUrl ? (
                          <button
                            onClick={() => setPreviewImageUrl(selectedUserForInspector.kycBackUrl || null)}
                            className="block w-full relative h-28 border border-border-default rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-zoom-in"
                          >
                            <img src={selectedUserForInspector.kycBackUrl} alt="Back Document" className="object-cover w-full h-full" />
                          </button>
                        ) : (
                          <div className="h-28 rounded-xl border border-border-default bg-bg-alt flex items-center justify-center text-[10px] text-text-muted">Missing</div>
                        )}
                      </div>
                      <div className="space-y-1 text-center">
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Selfie with document</span>
                        {selectedUserForInspector.kycSelfieUrl ? (
                          <button
                            onClick={() => setPreviewImageUrl(selectedUserForInspector.kycSelfieUrl || null)}
                            className="block w-full relative h-28 border border-border-default rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-zoom-in"
                          >
                            <img src={selectedUserForInspector.kycSelfieUrl} alt="Selfie document" className="object-cover w-full h-full" />
                          </button>
                        ) : (
                          <div className="h-28 rounded-xl border border-border-default bg-bg-alt flex items-center justify-center text-[10px] text-text-muted">Missing</div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-text-muted mt-2 border-t border-border-default/30 pt-2 text-left">
                      <span>Rejection attempts: <strong className="text-text-primary">{selectedUserForInspector.kycRejectionsCount || 0} / 3</strong></span>
                    </div>

                    <div className="space-y-3.5 pt-2 border-t border-border-default/50">
                      {rejectType === 'kyc' ? (
                        <div className="space-y-2 text-left">
                          <label className="text-[10px] font-bold text-text-secondary uppercase">Rejection Reason *</label>
                          <textarea
                            placeholder="Describe the issue with the uploads (e.g. Blurry photo holding document)"
                            value={rejectReasonText}
                            onChange={(e) => setRejectReasonText(e.target.value)}
                            rows={2}
                            className="w-full text-xs border bg-bg-base text-text-primary border-border-default rounded-xl p-2.5 resize-none font-medium"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => setRejectType(null)} className="h-8 text-xs rounded-xl font-bold cursor-pointer">Cancel</Button>
                            <Button size="sm" onClick={() => handleVerificationDecision(selectedUserForInspector.id, selectedUserForInspector.kycStatus === 'pending' ? 'kyc' : 'nid', 'rejected', rejectReasonText)} disabled={!rejectReasonText.trim()} className="h-8 bg-rose-600 hover:bg-rose-500 text-white text-xs px-4 rounded-xl font-bold">Confirm Rejection</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end items-center">
                          <span className="text-[10px] text-text-muted font-bold mr-1">Actions:</span>
                          <Button size="sm" onClick={() => handleVerificationDecision(selectedUserForInspector.id, selectedUserForInspector.kycStatus === 'pending' ? 'kyc' : 'nid', 'verified')} className="h-7 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-transparent text-[10px] px-2.5 rounded-lg font-bold">Approve</Button>
                          <Button size="sm" onClick={() => { setRejectType('kyc'); setRejectReasonText(""); }} className="h-7 bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-450 hover:text-white border border-rose-500/20 hover:border-transparent text-[10px] px-2.5 rounded-lg font-bold">Reject</Button>
                          <Button size="sm" onClick={() => handleVerificationDecision(selectedUserForInspector.id, selectedUserForInspector.kycStatus === 'pending' ? 'kyc' : 'nid', 'pending')} className="h-7 bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-white border border-amber-500/20 hover:border-transparent text-[10px] px-2.5 rounded-lg font-bold">Pending</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic text-left">No KYC document uploads submitted yet.</p>
                )}
              </div>

              {/* Module 3: Background Report check */}
              <div className="p-4 border border-border-default rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border-default/50 pb-2">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">3. Background Check Report</h4>
                  <span className={cn(
                    "font-bold uppercase text-[9px] px-2 py-0.5 rounded-full border",
                    selectedUserForInspector.backgroundReportStatus === "verified" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                    selectedUserForInspector.backgroundReportStatus === "pending" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                    selectedUserForInspector.backgroundReportStatus === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" :
                    "text-text-muted bg-bg-alt border-border-default"
                  )}>
                    Background: {selectedUserForInspector.backgroundReportStatus || "unsubmitted"}
                  </span>
                </div>

                {selectedUserForInspector.backgroundReportUrl ? (
                  <div className="space-y-4 text-xs font-medium">
                    <div className="flex items-center justify-between gap-4 p-3 bg-bg-base border border-border-default rounded-xl">
                      <span className="text-[11px] font-mono text-text-muted truncate max-w-sm italic">Uploaded Background Check Report</span>
                      <button onClick={() => { setGenericDocTitle("Background Check Report"); setGenericDocUrl(selectedUserForInspector.backgroundReportUrl || ""); setShowGenericDocViewer(true); }} className="text-xs text-accent-primary font-bold hover:underline shrink-0 cursor-pointer">
                        Preview Document
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-text-muted mt-2 border-t border-border-default/30 pt-2 text-left">
                      <span>Rejection attempts: <strong className="text-text-primary">{selectedUserForInspector.backgroundRejectionsCount || 0} / 3</strong></span>
                    </div>

                    <div className="space-y-3.5 pt-2 border-t border-border-default/50">
                      {rejectType === 'background' ? (
                        <div className="space-y-2 text-left">
                          <label className="text-[10px] font-bold text-text-secondary uppercase">Rejection Reason *</label>
                          <textarea
                            placeholder="Describe the issue with the background report (e.g. Expired report date)"
                            value={rejectReasonText}
                            onChange={(e) => setRejectReasonText(e.target.value)}
                            rows={2}
                            className="w-full text-xs border bg-bg-base text-text-primary border-border-default rounded-xl p-2.5 resize-none font-medium"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => setRejectType(null)} className="h-8 text-xs rounded-xl font-bold cursor-pointer">Cancel</Button>
                            <Button size="sm" onClick={() => handleVerificationDecision(selectedUserForInspector.id, 'background', 'rejected', rejectReasonText)} disabled={!rejectReasonText.trim()} className="h-8 bg-rose-600 hover:bg-rose-500 text-white text-xs px-4 rounded-xl font-bold">Confirm Rejection</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end items-center">
                          <span className="text-[10px] text-text-muted font-bold mr-1">Actions:</span>
                          <Button size="sm" onClick={() => handleVerificationDecision(selectedUserForInspector.id, 'background', 'verified')} className="h-7 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-transparent text-[10px] px-2.5 rounded-lg font-bold">Approve</Button>
                          <Button size="sm" onClick={() => { setRejectType('background'); setRejectReasonText(""); }} className="h-7 bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-450 hover:text-white border border-rose-500/20 hover:border-transparent text-[10px] px-2.5 rounded-lg font-bold">Reject</Button>
                          <Button size="sm" onClick={() => handleVerificationDecision(selectedUserForInspector.id, 'background', 'pending')} className="h-7 bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-white border border-amber-500/20 hover:border-transparent text-[10px] px-2.5 rounded-lg font-bold">Pending</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic text-left">No background check document uploads submitted yet.</p>
                )}
              </div>

              {/* Module 4: Credit Score Report check */}
              <div className="p-4 border border-border-default rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border-default/50 pb-2">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">4. Credit Score Report Check</h4>
                  <span className={cn(
                    "font-bold uppercase text-[9px] px-2 py-0.5 rounded-full border",
                    selectedUserForInspector.creditReportStatus === "verified" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                    selectedUserForInspector.creditReportStatus === "pending" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                    selectedUserForInspector.creditReportStatus === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" :
                    "text-text-muted bg-bg-alt border-border-default"
                  )}>
                    Credit Score: {selectedUserForInspector.creditReportStatus || "unsubmitted"}
                  </span>
                </div>

                {selectedUserForInspector.creditReportUrl ? (
                  <div className="space-y-4 text-xs font-medium">
                    <div className="grid grid-cols-2 gap-4 items-center text-left">
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase">Reported Credit Score</span>
                        <span className="font-extrabold text-sm text-emerald-500 block mt-0.5">{selectedUserForInspector.creditScore || "—"}</span>
                      </div>
                      <div className="text-right flex flex-col justify-end items-end">
                        <span className="block text-[10px] text-text-muted italic mb-0.5">Uploaded Credit Report</span>
                        <button onClick={() => { setGenericDocTitle("Credit Score Report"); setGenericDocUrl(selectedUserForInspector.creditReportUrl || ""); setShowGenericDocViewer(true); }} className="text-xs text-accent-primary font-bold hover:underline cursor-pointer">
                          Preview Document
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-text-muted mt-2 border-t border-border-default/30 pt-2 text-left">
                      <span>Rejection attempts: <strong className="text-text-primary">{selectedUserForInspector.creditRejectionsCount || 0} / 3</strong></span>
                    </div>

                    <div className="space-y-3.5 pt-2 border-t border-border-default/50">
                      {rejectType === 'credit' ? (
                        <div className="space-y-2 text-left">
                          <label className="text-[10px] font-bold text-text-secondary uppercase">Rejection Reason *</label>
                          <textarea
                            placeholder="Describe the issue with the credit report (e.g. Reported score discrepancy)"
                            value={rejectReasonText}
                            onChange={(e) => setRejectReasonText(e.target.value)}
                            rows={2}
                            className="w-full text-xs border bg-bg-base text-text-primary border-border-default rounded-xl p-2.5 resize-none font-medium"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => setRejectType(null)} className="h-8 text-xs rounded-xl font-bold cursor-pointer">Cancel</Button>
                            <Button size="sm" onClick={() => handleVerificationDecision(selectedUserForInspector.id, 'credit', 'rejected', rejectReasonText)} disabled={!rejectReasonText.trim()} className="h-8 bg-rose-600 hover:bg-rose-500 text-white text-xs px-4 rounded-xl font-bold">Confirm Rejection</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end items-center">
                          <span className="text-[10px] text-text-muted font-bold mr-1">Actions:</span>
                          <Button size="sm" onClick={() => handleVerificationDecision(selectedUserForInspector.id, 'credit', 'verified')} className="h-7 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-transparent text-[10px] px-2.5 rounded-lg font-bold">Approve</Button>
                          <Button size="sm" onClick={() => { setRejectType('credit'); setRejectReasonText(""); }} className="h-7 bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-450 hover:text-white border border-rose-500/20 hover:border-transparent text-[10px] px-2.5 rounded-lg font-bold">Reject</Button>
                          <Button size="sm" onClick={() => handleVerificationDecision(selectedUserForInspector.id, 'credit', 'pending')} className="h-7 bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-white border border-amber-500/20 hover:border-transparent text-[10px] px-2.5 rounded-lg font-bold">Pending</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic text-left">No credit score report document uploads submitted yet.</p>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-border-default pt-4 flex justify-end">
            <Button onClick={() => setShowInspector(false)} className="h-10 rounded-xl bg-bg-base hover:bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary font-bold text-xs px-6 cursor-pointer">
              Close Audit Center
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* ── Custom NID Rejection Dialog ── */}
      <Dialog open={showNidRejectDialog} onOpenChange={setShowNidRejectDialog}>
        <DialogContent className="max-w-md bg-bg-surface border-border-default text-text-primary rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-4 border-b border-border-default">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-3">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <DialogTitle className="text-text-primary text-lg font-bold font-heading">Reject NID Submission</DialogTitle>
            <DialogDescription className="text-text-muted text-xs mt-1">
              Specify the reason why &ldquo;{nidRejectUserName}&rdquo;&apos;s NID submission is being rejected.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Reason for Rejection *
              </label>
              <textarea
                placeholder="e.g. NID image is blurry, name does not match profile, etc."
                value={nidRejectReason}
                onChange={(e) => setNidRejectReason(e.target.value)}
                rows={4}
                className="w-full text-sm border bg-bg-base text-text-primary border-border-default rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none font-medium"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowNidRejectDialog(false)}
              variant="outline"
              className="flex-1 h-10 rounded-xl border-border-default text-text-secondary cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmNidRejection}
              disabled={!nidRejectReason.trim()}
              className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Reject NID
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── NID Document Viewer Modal ── */}
      {selectedUserForNid && selectedUserForNid.nidDocumentUrl && (
        <DocumentViewer
          isOpen={showNidDocViewer}
          onClose={() => {
            setShowNidDocViewer(false);
            setSelectedUserForNid(null);
          }}
          documentUrl={selectedUserForNid.nidDocumentUrl}
          agentName={selectedUserForNid.name}
          licenseNumber={selectedUserForNid.nidCardNumber}
          agencyName="Buyer NID Card"
        />
      )}

      {/* ── Generic Document Viewer Modal ── */}
      {genericDocUrl && (
        <DocumentViewer
          isOpen={showGenericDocViewer}
          onClose={() => {
            setShowGenericDocViewer(false);
            setGenericDocUrl("");
          }}
          documentUrl={genericDocUrl}
          agentName={selectedUserForInspector?.name || "User"}
          agencyName={genericDocTitle}
        />
      )}
      {/* ── Image Preview Dialog ── */}
      <Dialog open={!!previewImageUrl} onOpenChange={(open) => !open && setPreviewImageUrl(null)}>
        <DialogContent className="max-w-3xl bg-black/95 border-none p-0 text-white rounded-2xl overflow-hidden flex flex-col items-center justify-center">
          <div className="relative w-full h-[70vh] flex items-center justify-center p-4">
            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt="Document Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
          </div>
          <div className="bg-bg-surface w-full py-3 px-4 border-t border-border-default/20 flex justify-end">
            <Button
              onClick={() => setPreviewImageUrl(null)}
              className="h-9 px-4 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold"
            >
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
