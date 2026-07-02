"use client";

import * as React from "react";
import { 
  Users, 
  Search, 
  Trash2, 
  ShieldAlert, 
  XCircle, 
  FileText, 
  Mail, 
  Calendar, 
  Eye, 
  SlidersHorizontal,
  Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import type { User, UserStatus } from "@/lib/types";
import { DocumentViewer } from "@/components/shared/document-viewer";
 
export function UsersClient() {
  const { getUsers, updateUserStatus, deleteUser, currentUser, updateUserNidStatus } = useAuth();
  
  const [users, setUsers] = React.useState<User[]>([]);
  const [showDocViewer, setShowDocViewer] = React.useState(false);
  const [showNidDocViewer, setShowNidDocViewer] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [inspectedUser, setInspectedUser] = React.useState<User | null>(null);

  // Image preview state
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(null);

  // Reject reason input states inside inspector drawer
  const [rejectType, setRejectType] = React.useState<'kyc' | 'nid' | 'background' | 'credit' | null>(null);
  const [rejectReasonText, setRejectReasonText] = React.useState("");

  // Admin document management states
  const [editingReportType, setEditingReportType] = React.useState<'background' | 'credit' | null>(null);
  const [editReportUrl, setEditReportUrl] = React.useState("");
  const [editCreditScore, setEditCreditScore] = React.useState<number | "">("");

  // Generic Document Viewer Modal State
  const [showGenericDocViewer, setShowGenericDocViewer] = React.useState(false);
  const [genericDocUrl, setGenericDocUrl] = React.useState("");
  const [genericDocTitle, setGenericDocTitle] = React.useState("");

  // Suspension reason dialog states
  const [showBanDialog, setShowBanDialog] = React.useState(false);
  const [banUserId, setBanUserId] = React.useState("");
  const [banUserName, setBanUserName] = React.useState("");
  const [banReason, setBanReason] = React.useState("");

  const refreshUsersList = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json.status === "success") {
        let allUsers: User[] = json.data || [];
        if (currentUser?.role === "admin") {
          // Admin can see and manage only agent and member (auth_user) users.
          // They cannot see other admin users or super admin users.
          allUsers = allUsers.filter(u => u.role !== "super_admin" && (u.role !== "admin" || u.id === currentUser.id));
        }
        setUsers(allUsers);
      }
    } catch (err) {
      console.error("Failed to load admin users", err);
    }
  }, [currentUser]);

  // Load users from db on mount
  React.useEffect(() => {
    refreshUsersList();
  }, [refreshUsersList]);

  // Search / filter logic
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const triggerSuspension = (userId: string, name: string, currentStatus: UserStatus) => {
    if (currentStatus === "suspended") {
      // Direct reactivation
      updateUserStatus(userId, "active");
      toast.success(`Account activated`, {
        description: `"${name}" account status has been reactivated.`,
      });
      refreshUsersList();
    } else {
      // Open suspension explanation dialog
      setBanUserId(userId);
      setBanUserName(name);
      setBanReason("");
      setShowBanDialog(true);
    }
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
    refreshUsersList();
  };

  const handleDeleteUser = (id: string, name: string) => {
    deleteUser(id);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (inspectedUser?.id === id) setInspectedUser(null);
    toast.success("User removed", { description: `"${name}" account deleted.` });
    refreshUsersList();
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
        toast.success(`Verification status updated successfully! 🚀`);
        
        // Refresh list
        await refreshUsersList();
        
        // Update inspected user if still open
        const usersRes = await fetch("/api/admin/users");
        const usersJson = await usersRes.json();
        if (usersJson.status === "success") {
          const freshUser = usersJson.data.find((u: any) => u.id === userId);
          if (freshUser) {
            setInspectedUser(freshUser);
          } else {
            setInspectedUser(null);
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

  const handleSaveReportLink = async (userId: string, type: 'background' | 'credit') => {
    try {
      const payload = {
        type,
        url: editReportUrl,
        ...(type === 'credit' && { score: editCreditScore === "" ? null : Number(editCreditScore) })
      };
      
      const res = await fetch(`/api/admin/users/${userId}/report-links`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(`Report link updated successfully!`);
        setEditingReportType(null);
        
        await refreshUsersList();
        
        // Update inspected user if still open
        const usersRes = await fetch("/api/admin/users");
        const usersJson = await usersRes.json();
        if (usersJson.status === "success") {
          const freshUser = usersJson.data.find((u: any) => u.id === userId);
          if (freshUser) setInspectedUser(freshUser);
        }
      } else {
        toast.error("Failed to update link", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error saving link");
    }
  };

  const handleBulkSuspend = () => {
    if (selectedIds.length === 0) return;
    
    // Bulk suspend with standard reason
    selectedIds.forEach((id) => {
      updateUserStatus(id, "suspended", "Administrative bulk action suspension.");
    });
    
    setSelectedIds([]);
    toast.success("Bulk action complete", {
      description: `Suspended ${selectedIds.length} selected users.`,
    });
    refreshUsersList();
  };

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <Users className="h-5 w-5 text-accent-primary" />
            Manage Users
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">
            Verify agent credentials, check log entries, and suspend or activate accounts.
          </p>
        </div>
        <div className="text-xs font-bold bg-bg-alt border border-border-default px-3.5 py-1.5 rounded-full text-text-secondary select-none">
          Total Accounts: <span className="text-text-primary">{users.length}</span>
        </div>
      </div>

      {/* ── Filter toolbar & bulk actions ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <Input
            placeholder="Search accounts by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-border-default bg-bg-surface text-sm text-text-primary placeholder:text-text-faint focus:ring-accent-primary rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Roles Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 text-xs font-bold text-text-secondary bg-bg-surface border border-border-default rounded-xl px-3 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="auth_user">Members</option>
            <option value="agent">Agents</option>
            {currentUser?.role !== "admin" && (
              <>
                <option value="admin">Admins</option>
                <option value="super_admin">Super Admins</option>
              </>
            )}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 text-xs font-bold text-text-secondary bg-bg-surface border border-border-default rounded-xl px-3 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending Review</option>
            <option value="unsubmitted">Unsubmitted Docs</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Bulk Action Button */}
          {selectedIds.length > 0 && (
            <Button
              onClick={handleBulkSuspend}
              size="sm"
              className="h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 gap-1.5 active:scale-95 transition-all"
            >
              <ShieldAlert className="h-4 w-4" />
              Suspend Selected ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* ── Accounts Table ── */}
      {filteredUsers.length === 0 ? (
        <div className="py-12 text-center text-text-muted text-xs font-bold">
          No user accounts found matching query parameters.
        </div>
      ) : (
        <div className="rounded-2xl border border-border-default bg-bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-default bg-bg-alt/50 text-text-secondary font-extrabold uppercase select-none">
                  <th className="py-4 px-5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-border-default bg-bg-base"
                    />
                  </th>
                  <th className="py-4 px-5">User Details</th>
                  <th className="py-4 px-5">Platform Role</th>
                  <th className="py-4 px-5">Security Status</th>
                  <th className="py-4 px-5">Joined Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default text-text-secondary font-medium">
                {filteredUsers.map((u) => {
                  const initials = u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                  const isChecked = selectedIds.includes(u.id);
                  const hasPendingVerification = u.kycStatus === 'pending' || u.backgroundReportStatus === 'pending' || u.creditReportStatus === 'pending' || u.nidStatus === 'pending';

                  return (
                    <tr key={u.id} className="hover:bg-bg-alt/20 transition-colors">
                      <td className="py-4 px-5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(u.id, e.target.checked)}
                          className="rounded border-border-default bg-bg-base"
                        />
                      </td>
                      
                      {/* Name / Avatar / Email */}
                      <td className="py-4 px-5 cursor-pointer" onClick={() => setInspectedUser(u)}>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8.5 w-8.5 border border-border-default relative">
                            <AvatarImage src={u.avatar} alt={u.name} />
                            <AvatarFallback className="bg-bg-elevated text-[10px] text-text-primary font-bold">
                              {initials}
                            </AvatarFallback>
                            {hasPendingVerification && (
                              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5" title="Pending Verifications">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-bg-base"></span>
                              </span>
                            )}
                          </Avatar>
                          <div>
                            <span className="font-bold text-text-primary flex items-center gap-2 hover:text-accent-primary transition-colors">
                              {u.name}
                            </span>
                            <span className="text-[10px] text-text-muted block mt-0.5">{u.email}</span>
                          </div>
                        </div>
                      </td>
 
                      {/* Role */}
                      <td className="py-4 px-5">
                        <span className={cn(
                          "text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                          u.role === "agent" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/20" :
                          u.role === "owner" ? "text-cyan-600 dark:text-cyan-400 bg-cyan-500/5 border-cyan-500/20" :
                          u.role === "admin" ? "text-violet-600 bg-violet-500/5 border border-violet-500/20 dark:text-violet-400" :
                          u.role === "super_admin" ? "text-amber-600 dark:text-amber-400 bg-amber-500/5 border-amber-500/20" :
                          "text-blue-600 dark:text-blue-400 bg-blue-500/5 border-blue-500/20"
                        )}>
                          {u.role === "auth_user" ? "Member" : u.role === "super_admin" ? "Super Admin" : u.role === "owner" ? "Owner" : u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className={cn(
                          "text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                          u.status === "active" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/20" :
                          u.status === "pending" ? "text-amber-600 dark:text-amber-400 bg-amber-500/5 border-amber-500/20" :
                          u.status === "unsubmitted" ? "text-text-muted bg-bg-alt border border-border-default" :
                          "text-rose-600 dark:text-rose-400 bg-rose-500/5 border-rose-500/20"
                        )}>
                          {u.status === "pending" ? "Pending Review" : u.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-text-muted">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => setInspectedUser(u)}
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg cursor-pointer"
                            title="Inspect details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => triggerSuspension(u.id, u.name, u.status)}
                            size="icon-sm"
                            variant="ghost"
                            className={cn(
                              "h-8 w-8 rounded-lg cursor-pointer",
                              u.status === "suspended"
                                ? "text-emerald-500 hover:text-white hover:bg-emerald-600"
                                : "text-text-muted hover:text-rose-500 hover:bg-bg-elevated"
                            )}
                            title={u.status === "suspended" ? "Reactivate account" : "Suspend account"}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg cursor-pointer"
                            title="Delete user account"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Slide-over account inspector drawer ── */}
      <Sheet open={!!inspectedUser} onOpenChange={(open) => !open && setInspectedUser(null)}>
        <SheetContent className="w-full sm:max-w-md bg-bg-surface border-l border-border-default text-text-primary flex flex-col justify-between p-6">
          <SheetHeader className="pb-4 border-b border-border-default">
            <SheetTitle className="text-text-primary text-left font-heading text-lg font-bold">User Account Inspector</SheetTitle>
            <SheetDescription className="text-left text-text-muted text-xs mt-0.5">
              Supervise credential documentation, status variables, and listings log.
            </SheetDescription>
          </SheetHeader>

          {inspectedUser && (
            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1 custom-scrollbar">
              
              {/* Account profile card */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-bg-alt border border-border-default">
                <Avatar className="h-16 w-16 border border-border-default mb-3">
                  <AvatarFallback className="bg-accent-primary text-white font-bold text-lg">
                    {inspectedUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-sm font-bold text-text-primary leading-tight">{inspectedUser.name}</h4>
                <span className="text-[10px] text-text-muted font-semibold block mt-1">{inspectedUser.email}</span>
              </div>

              {/* Legal Documentation Details (Agent / Owner) */}
              {(inspectedUser.role === "agent" || inspectedUser.role === "owner") && inspectedUser.legalDocs ? (
                <div className="space-y-3 p-4 rounded-xl border border-border-default bg-bg-alt/30">
                  <h5 className="text-[10px] font-bold text-text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-accent-primary" /> Submitted Credentials
                  </h5>
                  <div className="space-y-2 text-xs font-medium">
                    <div className="flex justify-between py-1.5 border-b border-border-default">
                      <span className="text-text-muted">{inspectedUser.role === "owner" ? "Land / Property ID" : "License Number"}</span>
                      <span className="font-mono font-bold text-text-primary">{inspectedUser.legalDocs.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border-default">
                      <span className="text-text-muted">{inspectedUser.role === "owner" ? "Business / Property" : "Agency / Brokerage"}</span>
                      <span className="font-bold text-text-primary">{inspectedUser.legalDocs.agencyName}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border-default">
                      <span className="text-text-muted">Document File</span>
                      <span 
                        onClick={() => setShowDocViewer(true)}
                        className="font-bold text-accent-primary flex items-center gap-1.5 cursor-pointer hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Document
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-text-muted">Submitted Date</span>
                      <span className="font-bold text-text-secondary">
                        {new Date(inspectedUser.legalDocs.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (inspectedUser.role === "agent" || inspectedUser.role === "owner") && (
                <div className="p-4 rounded-xl border border-dashed border-border-default bg-bg-alt/20 text-center text-xs text-text-muted font-bold">
                  No licensing documentation submitted yet.
                </div>
              )}

              {/* Identity & Verification Suite */}
              <div className="space-y-4 p-4 rounded-xl border border-border-default bg-bg-alt/30">
                <h5 className="text-[10px] font-bold text-text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-border-default/50 pb-2">
                  <Shield className="h-3.5 w-3.5 text-accent-primary" /> Verification Suite
                </h5>

                <div className="space-y-3.5 text-xs font-medium text-left">
                  {/* Email & Phone */}
                  <div className="flex justify-between items-center py-1 border-b border-border-default/50">
                    <span className="text-text-muted">Email Verified</span>
                    <span className={cn("font-bold uppercase text-[9px] px-2 py-0.5 rounded border", inspectedUser.isVerified ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" : "text-text-muted bg-bg-alt border-border-default")}>
                      {inspectedUser.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-border-default/50">
                    <span className="text-text-muted">Phone (OTP) Verified</span>
                    <span className={cn("font-bold uppercase text-[9px] px-2 py-0.5 rounded border", inspectedUser.phoneVerified ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" : "text-text-muted bg-bg-alt border-border-default")}>
                      {inspectedUser.phoneVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>

                  {/* KYC Section */}
                  <div className="space-y-2 py-1 border-b border-border-default/50">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">KYC Status</span>
                      <span className={cn("font-bold uppercase text-[9px] px-2 py-0.5 rounded border",
                        (inspectedUser.kycStatus || inspectedUser.nidStatus) === "verified" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                        (inspectedUser.kycStatus || inspectedUser.nidStatus) === "pending" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                        (inspectedUser.kycStatus || inspectedUser.nidStatus) === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" :
                        "text-text-muted bg-bg-alt border-border-default"
                      )}>
                        {inspectedUser.kycStatus || inspectedUser.nidStatus || "unsubmitted"}
                      </span>
                    </div>

                    {/* KYC Document 3-Photo Previews */}
                    {(inspectedUser.kycFrontUrl || inspectedUser.kycBackUrl || inspectedUser.kycSelfieUrl || inspectedUser.nidDocumentUrl) && (
                      <div className="space-y-2 pt-1.5">
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div>Doc Type: <span className="font-bold uppercase">{inspectedUser.kycDocType || "nid"}</span></div>
                          <div className="text-right">Doc No: <span className="font-mono font-bold">{inspectedUser.kycDocNumber || inspectedUser.nidCardNumber || "—"}</span></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <span className="text-[8px] text-text-muted uppercase text-center block">Front</span>
                            {inspectedUser.kycFrontUrl || inspectedUser.nidDocumentUrl ? (
                              <button
                                onClick={() => setPreviewImageUrl(inspectedUser.kycFrontUrl || inspectedUser.nidDocumentUrl || null)}
                                className="block w-full relative h-14 border border-border-default rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-zoom-in"
                              >
                                <img src={inspectedUser.kycFrontUrl || inspectedUser.nidDocumentUrl} alt="KYC Front" className="object-cover w-full h-full" />
                              </button>
                            ) : (
                              <div className="h-14 rounded-lg border border-border-default bg-bg-alt flex items-center justify-center text-[8px] text-text-muted">Missing</div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8px] text-text-muted uppercase text-center block">Back</span>
                            {inspectedUser.kycBackUrl ? (
                              <button
                                onClick={() => setPreviewImageUrl(inspectedUser.kycBackUrl || null)}
                                className="block w-full relative h-14 border border-border-default rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-zoom-in"
                              >
                                <img src={inspectedUser.kycBackUrl} alt="KYC Back" className="object-cover w-full h-full" />
                              </button>
                            ) : (
                              <div className="h-14 rounded-lg border border-border-default bg-bg-alt flex items-center justify-center text-[8px] text-text-muted">Missing</div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8px] text-text-muted uppercase text-center block">Selfie</span>
                            {inspectedUser.kycSelfieUrl ? (
                              <button
                                onClick={() => setPreviewImageUrl(inspectedUser.kycSelfieUrl || null)}
                                className="block w-full relative h-14 border border-border-default rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-zoom-in"
                              >
                                <img src={inspectedUser.kycSelfieUrl} alt="KYC Selfie" className="object-cover w-full h-full" />
                              </button>
                            ) : (
                              <div className="h-14 rounded-lg border border-border-default bg-bg-alt flex items-center justify-center text-[8px] text-text-muted">Missing</div>
                            )}
                          </div>
                        </div>

                        {/* Inline Actions */}
                        <div className="pt-2 mt-2 border-t border-border-default/50 space-y-2">
                          <div className="flex justify-between items-center text-[9px] text-text-muted text-left">
                            <span>Rejection attempts: <strong className="text-text-primary">{inspectedUser.kycRejectionsCount || 0} / 3</strong></span>
                          </div>
                          
                          {rejectType === 'kyc' ? (
                            <div className="space-y-2 text-left">
                              <label className="text-[9px] font-bold text-text-secondary uppercase">Rejection Reason *</label>
                              <textarea
                                placeholder="Reason..."
                                value={rejectReasonText}
                                onChange={(e) => setRejectReasonText(e.target.value)}
                                rows={2}
                                className="w-full text-[10px] border bg-bg-base text-text-primary border-border-default rounded-lg p-2 resize-none font-medium"
                              />
                              <div className="flex gap-1.5 justify-end">
                                <Button size="sm" variant="ghost" onClick={() => setRejectType(null)} className="h-6 text-[10px] rounded-lg font-bold">Cancel</Button>
                                <Button size="sm" onClick={() => handleVerificationDecision(inspectedUser.id, inspectedUser.kycStatus === 'pending' ? 'kyc' : 'nid', 'rejected', rejectReasonText)} disabled={!rejectReasonText.trim()} className="h-6 bg-rose-600 hover:bg-rose-500 text-white text-[10px] px-3 rounded-lg font-bold">Confirm</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-1.5 justify-end items-center">
                              <Button size="sm" onClick={() => handleVerificationDecision(inspectedUser.id, inspectedUser.kycStatus === 'pending' ? 'kyc' : 'nid', 'verified')} className="h-6 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/20 hover:border-transparent text-[9px] px-2 rounded-md font-bold">Approve</Button>
                              <Button size="sm" onClick={() => { setRejectType('kyc'); setRejectReasonText(""); }} className="h-6 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 hover:border-transparent text-[9px] px-2 rounded-md font-bold">Reject</Button>
                              <Button size="sm" onClick={() => handleVerificationDecision(inspectedUser.id, inspectedUser.kycStatus === 'pending' ? 'kyc' : 'nid', 'pending')} className="h-6 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white border border-amber-500/20 hover:border-transparent text-[9px] px-2 rounded-md font-bold">Pending</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Background Report */}
                  <div className="space-y-2 py-1 border-b border-border-default/50">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Background check</span>
                      <span className={cn("font-bold uppercase text-[9px] px-2 py-0.5 rounded border",
                        inspectedUser.backgroundReportStatus === "verified" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                        inspectedUser.backgroundReportStatus === "pending" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                        inspectedUser.backgroundReportStatus === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" :
                        "text-text-muted bg-bg-alt border-border-default"
                      )}>
                        {inspectedUser.backgroundReportStatus || "unsubmitted"}
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-text-muted truncate max-w-[150px] italic">Uploaded Background Check</span>
                        <div className="flex items-center gap-2">
                          {inspectedUser.backgroundReportUrl ? (
                            <button onClick={() => { setGenericDocTitle("Background Check Report"); setGenericDocUrl(inspectedUser.backgroundReportUrl || ""); setShowGenericDocViewer(true); }} className="text-[10px] text-accent-primary font-bold hover:underline shrink-0 cursor-pointer">
                              Preview PDF
                            </button>
                          ) : (
                            <span className="text-[10px] text-text-muted italic">Unsubmitted</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {inspectedUser.backgroundReportUrl && (
                      <div className="space-y-2">
                        
                        {/* Inline Actions */}
                        <div className="pt-2 border-t border-border-default/50 space-y-2">
                          <div className="flex justify-between items-center text-[9px] text-text-muted text-left">
                            <span>Rejection attempts: <strong className="text-text-primary">{inspectedUser.backgroundRejectionsCount || 0} / 3</strong></span>
                          </div>
                          
                          {rejectType === 'background' ? (
                            <div className="space-y-2 text-left">
                              <label className="text-[9px] font-bold text-text-secondary uppercase">Rejection Reason *</label>
                              <textarea
                                placeholder="Reason..."
                                value={rejectReasonText}
                                onChange={(e) => setRejectReasonText(e.target.value)}
                                rows={2}
                                className="w-full text-[10px] border bg-bg-base text-text-primary border-border-default rounded-lg p-2 resize-none font-medium"
                              />
                              <div className="flex gap-1.5 justify-end">
                                <Button size="sm" variant="ghost" onClick={() => setRejectType(null)} className="h-6 text-[10px] rounded-lg font-bold">Cancel</Button>
                                <Button size="sm" onClick={() => handleVerificationDecision(inspectedUser.id, 'background', 'rejected', rejectReasonText)} disabled={!rejectReasonText.trim()} className="h-6 bg-rose-600 hover:bg-rose-500 text-white text-[10px] px-3 rounded-lg font-bold">Confirm</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-1.5 justify-end items-center">
                              <Button size="sm" onClick={() => handleVerificationDecision(inspectedUser.id, 'background', 'verified')} className="h-6 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/20 hover:border-transparent text-[9px] px-2 rounded-md font-bold">Approve</Button>
                              <Button size="sm" onClick={() => { setRejectType('background'); setRejectReasonText(""); }} className="h-6 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 hover:border-transparent text-[9px] px-2 rounded-md font-bold">Reject</Button>
                              <Button size="sm" onClick={() => handleVerificationDecision(inspectedUser.id, 'background', 'pending')} className="h-6 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white border border-amber-500/20 hover:border-transparent text-[9px] px-2 rounded-md font-bold">Pending</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Credit Score Report */}
                  <div className="space-y-2 py-1">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Credit check</span>
                      <span className={cn("font-bold uppercase text-[9px] px-2 py-0.5 rounded border",
                        inspectedUser.creditReportStatus === "verified" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                        inspectedUser.creditReportStatus === "pending" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                        inspectedUser.creditReportStatus === "rejected" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" :
                        "text-text-muted bg-bg-alt border-border-default"
                      )}>
                        {inspectedUser.creditReportStatus || "unsubmitted"}
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-text-muted truncate max-w-[150px] italic">Uploaded Credit Report</span>
                          {inspectedUser.creditReportUrl && (
                            <span className="text-[9px] text-emerald-500 font-bold">Credit Score: {inspectedUser.creditScore || "—"}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {inspectedUser.creditReportUrl ? (
                            <button onClick={() => { setGenericDocTitle("Credit Score Report"); setGenericDocUrl(inspectedUser.creditReportUrl || ""); setShowGenericDocViewer(true); }} className="text-[10px] text-accent-primary font-bold hover:underline shrink-0 cursor-pointer">
                              Preview PDF
                            </button>
                          ) : (
                            <span className="text-[10px] text-text-muted italic">Unsubmitted</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {inspectedUser.creditReportUrl && (
                      <div className="space-y-2">
                        
                        {/* Inline Actions */}
                        <div className="pt-2 border-t border-border-default/50 space-y-2">
                          <div className="flex justify-between items-center text-[9px] text-text-muted text-left">
                            <span>Rejection attempts: <strong className="text-text-primary">{inspectedUser.creditRejectionsCount || 0} / 3</strong></span>
                          </div>
                          
                          {rejectType === 'credit' ? (
                            <div className="space-y-2 text-left">
                              <label className="text-[9px] font-bold text-text-secondary uppercase">Rejection Reason *</label>
                              <textarea
                                placeholder="Reason..."
                                value={rejectReasonText}
                                onChange={(e) => setRejectReasonText(e.target.value)}
                                rows={2}
                                className="w-full text-[10px] border bg-bg-base text-text-primary border-border-default rounded-lg p-2 resize-none font-medium"
                              />
                              <div className="flex gap-1.5 justify-end">
                                <Button size="sm" variant="ghost" onClick={() => setRejectType(null)} className="h-6 text-[10px] rounded-lg font-bold">Cancel</Button>
                                <Button size="sm" onClick={() => handleVerificationDecision(inspectedUser.id, 'credit', 'rejected', rejectReasonText)} disabled={!rejectReasonText.trim()} className="h-6 bg-rose-600 hover:bg-rose-500 text-white text-[10px] px-3 rounded-lg font-bold">Confirm</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-1.5 justify-end items-center">
                              <Button size="sm" onClick={() => handleVerificationDecision(inspectedUser.id, 'credit', 'verified')} className="h-6 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/20 hover:border-transparent text-[9px] px-2 rounded-md font-bold">Approve</Button>
                              <Button size="sm" onClick={() => { setRejectType('credit'); setRejectReasonText(""); }} className="h-6 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 hover:border-transparent text-[9px] px-2 rounded-md font-bold">Reject</Button>
                              <Button size="sm" onClick={() => handleVerificationDecision(inspectedUser.id, 'credit', 'pending')} className="h-6 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white border border-amber-500/20 hover:border-transparent text-[9px] px-2 rounded-md font-bold">Pending</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Suspension Reason log if suspended */}
              {inspectedUser.status === "suspended" && inspectedUser.suspendedReason && (
                <div className="space-y-2 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-left">
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Suspension Reason</span>
                  <p className="text-text-secondary leading-relaxed font-semibold italic">
                    &ldquo;{inspectedUser.suspendedReason}&rdquo;
                  </p>
                </div>
              )}

              {/* Account Details list */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-text-primary uppercase tracking-widest flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-accent-primary" /> System Details Logs
                </h5>
                <div className="space-y-3 font-medium text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-muted flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" /> Account ID</span>
                    <span className="font-mono font-bold text-text-secondary">{inspectedUser.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-muted flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 shrink-0" /> Registered Date</span>
                    <span className="font-bold text-text-secondary">{new Date(inspectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-muted flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5 shrink-0" /> Account Status</span>
                    <span className={cn("font-bold uppercase", 
                      inspectedUser.status === "active" ? "text-emerald-500" : 
                      inspectedUser.status === "pending" ? "text-amber-500" : 
                      inspectedUser.status === "unsubmitted" ? "text-slate-400" :
                      "text-rose-500"
                    )}>
                      {inspectedUser.status === "pending" ? "Pending Review" : inspectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Drawer moderation controls */}
          <div className="border-t border-border-default pt-4 space-y-2 mt-4 shrink-0">
            {inspectedUser && inspectedUser.role === "auth_user" && inspectedUser.nidStatus === "pending" && (
              <div className="flex gap-3">
                <Button
                  onClick={async () => {
                    const reason = prompt("Enter NID rejection reason:") || "Verification documents rejected.";
                    const res = await updateUserNidStatus(inspectedUser.id, "rejected", reason);
                    if (res.success) {
                      toast.error("NID Rejected", { description: `Identity docs for ${inspectedUser.name} rejected.` });
                      refreshUsersList();
                      setInspectedUser(null);
                    }
                  }}
                  className="flex-1 h-10 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer"
                >
                  Reject NID
                </Button>
                <Button
                  onClick={async () => {
                    const res = await updateUserNidStatus(inspectedUser.id, "verified");
                    if (res.success) {
                      toast.success("NID Approved", { description: `Identity docs for ${inspectedUser.name} verified.` });
                      refreshUsersList();
                      setInspectedUser(null);
                    }
                  }}
                  className="flex-1 h-10 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                >
                  Approve NID
                </Button>
              </div>
            )}
            <div className="flex gap-3">
              {inspectedUser && inspectedUser.status === "pending" && (
                <Button
                  onClick={() => {
                    updateUserStatus(inspectedUser.id, "active");
                    toast.success("Agent Approved", { description: `"${inspectedUser.name}" has been activated.` });
                    refreshUsersList();
                    setInspectedUser(null);
                  }}
                  className="flex-1 h-10 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                >
                  Approve Agent
                </Button>
              )}
              {inspectedUser && inspectedUser.status !== "suspended" && (
                <Button
                  onClick={() => {
                    triggerSuspension(inspectedUser.id, inspectedUser.name, inspectedUser.status);
                    setInspectedUser(null);
                  }}
                  className="flex-1 h-10 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer"
                >
                  Suspend Account
                </Button>
              )}
              {inspectedUser && inspectedUser.status === "suspended" && (
                <Button
                  onClick={() => {
                    triggerSuspension(inspectedUser.id, inspectedUser.name, inspectedUser.status);
                    setInspectedUser(null);
                  }}
                  className="flex-1 h-10 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                >
                  Reactivate Account
                </Button>
              )}
            </div>
            <Button
              onClick={() => setInspectedUser(null)}
              variant="outline"
              className="w-full h-10 rounded-xl border-border-default text-text-secondary cursor-pointer"
            >
              Close Inspector
            </Button>
          </div>
        </SheetContent>
      </Sheet>

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
      {inspectedUser && inspectedUser.legalDocs && (
        <DocumentViewer
          isOpen={showDocViewer}
          onClose={() => setShowDocViewer(false)}
          documentUrl={inspectedUser.legalDocs.documentUrl}
          agentName={inspectedUser.name}
          licenseNumber={inspectedUser.legalDocs.licenseNumber}
          agencyName={inspectedUser.legalDocs.agencyName}
        />
      )}

      {/* ── NID Document Viewer Modal ── */}
      {inspectedUser && inspectedUser.nidDocumentUrl && (
        <DocumentViewer
          isOpen={showNidDocViewer}
          onClose={() => setShowNidDocViewer(false)}
          documentUrl={inspectedUser.nidDocumentUrl}
          agentName={inspectedUser.name}
          licenseNumber={inspectedUser.nidCardNumber}
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
          agentName={inspectedUser?.name || "User"}
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
