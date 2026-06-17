"use client";

import * as React from "react";
import { Users, ShieldAlert, Sparkles, AlertTriangle, Key, Search, FileText, Check, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

interface RoleAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

// Mock accounts list for Super Admin Role panel
const initialAccounts: RoleAccount[] = [
  { id: "acc-01", name: "Alex Johnson", email: "user@brandestate.com", role: "auth_user", status: "Active" },
  { id: "acc-02", name: "Sarah Mitchell", email: "agent@brandestate.com", role: "agent", status: "Active" },
  { id: "acc-03", name: "David Chen", email: "admin@brandestate.com", role: "admin", status: "Active" },
  { id: "acc-04", name: "Elena Rodriguez", email: "superadmin@brandestate.com", role: "super_admin", status: "Active" },
  { id: "acc-05", name: "Michael Chang", email: "michael.c@gmail.com", role: "auth_user", status: "Active" },
];

const initialAuditTrail = [
  { id: "tr-01", user: "Sarah Mitchell", from: "auth_user", to: "agent", date: "2026-06-10", authorizedBy: "Elena Rodriguez", reason: "Verified licensed broker credentials." },
  { id: "tr-02", user: "David Chen", from: "agent", to: "admin", date: "2026-06-12", authorizedBy: "Elena Rodriguez", reason: "Assigned moderation team privileges." },
];

export function RolesClient() {
  const [accounts, setAccounts] = React.useState<RoleAccount[]>(initialAccounts);
  const [auditTrail, setAuditTrail] = React.useState(initialAuditTrail);
  const [search, setSearch] = React.useState("");
  const [selectedAcc, setSelectedAcc] = React.useState<RoleAccount | null>(null);
  
  // Modal State details
  const [modalOpen, setModalOpen] = React.useState(false);
  const [targetRole, setTargetRole] = React.useState<UserRole>("auth_user");
  const [changeReason, setChangeReason] = React.useState("");

  const filteredAccounts = React.useMemo(() => {
    return accounts.filter((u) => {
      const q = search.toLowerCase().trim();
      return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [accounts, search]);

  const handleOpenModal = (acc: typeof initialAccounts[0]) => {
    setSelectedAcc(acc);
    setTargetRole(acc.role);
    setChangeReason("");
    setModalOpen(true);
  };

  const handleRoleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAcc) return;
    if (!changeReason.trim()) {
      toast.error("Validation error", { description: "Please enter a justification reason." });
      return;
    }

    const { id, name, role: oldRole } = selectedAcc;

    // Apply change
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, role: targetRole } : a));

    // Append to audit trail
    const newAudit = {
      id: `tr-sub-${Date.now()}`,
      user: name,
      from: oldRole,
      to: targetRole,
      date: new Date().toISOString().split("T")[0],
      authorizedBy: "Elena Rodriguez",
      reason: changeReason.trim(),
    };
    setAuditTrail(prev => [newAudit, ...prev]);

    setModalOpen(false);
    toast.success("Account Role Modified", {
      description: `"${name}" has been updated to "${targetRole}".`,
    });
  };

  const roleLabelMap: Record<UserRole, string> = {
    guest: "Guest",
    auth_user: "Member",
    agent: "Agent",
    admin: "Admin",
    super_admin: "Super Admin",
  };

  const roleBadgeMap: Record<UserRole, string> = {
    guest: "text-slate-400 bg-slate-500/10 border-slate-500/20",
    auth_user: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    agent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    admin: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    super_admin: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="space-y-8">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Manage Roles
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">Supervise administrative privileges, assign moderator capabilities and audit adjustments</p>
        </div>
        <div className="text-xs font-bold bg-bg-alt border border-border-default px-3.5 py-1.5 rounded-full text-text-muted select-none">
          Operators Count: <span className="text-text-primary">{accounts.filter(a => a.role !== "auth_user").length} admins/agents</span>
        </div>
      </div>

      {/* ── Search Toolbar ── */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          placeholder="Search operator accounts by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 border-border-default bg-bg-surface text-sm text-text-primary placeholder:text-text-muted focus:ring-amber-500 rounded-xl"
        />
      </div>

      {/* ── Accounts Table Grid ── */}
      <div className="rounded-2xl border border-border-default/60 bg-bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-default/80 bg-bg-alt/50 text-text-muted font-extrabold uppercase select-none">
                <th className="py-4 px-5">Account Details</th>
                <th className="py-4 px-5">Active Privilege Role</th>
                <th className="py-4 px-5">Status Badge</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium">
              {filteredAccounts.map((acc) => {
                const initials = acc.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <tr key={acc.id} className="hover:bg-amber-500/2 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8.5 w-8.5 border border-border-default">
                          <AvatarFallback className="bg-bg-alt text-[10px] text-text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-bold text-text-primary block">{acc.name}</span>
                          <span className="text-[10px] text-text-muted block mt-0.5">{acc.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                        roleBadgeMap[acc.role]
                      )}>
                        {roleLabelMap[acc.role]}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border text-emerald-400 bg-emerald-500/5 border-emerald-500/20">
                        {acc.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      {acc.role === "super_admin" ? (
                        <span className="text-[10px] text-text-faint font-bold pr-2">Protected</span>
                      ) : (
                        <Button
                          onClick={() => handleOpenModal(acc)}
                          size="sm"
                          className="h-8.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/20 hover:border-transparent text-amber-400 hover:text-white font-bold text-[11px] px-3.5"
                        >
                          Modify Role
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Audit Trail Logs Section ── */}
      <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-heading text-base font-bold text-text-primary flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-amber-500" />
            Roles Adjustments History Trail
          </h3>
          <p className="text-xs text-text-muted font-medium">Archived log of system account credential updates</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-border-default/60 text-text-muted font-extrabold uppercase select-none">
                <th className="py-2 px-3">Modified User</th>
                <th className="py-2 px-3">Role Change Path</th>
                <th className="py-2 px-3">Authorized Operator</th>
                <th className="py-2 px-3">Audit Justification Reason</th>
                <th className="py-2 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium">
              {auditTrail.map((item) => (
                <tr key={item.id} className="hover:bg-amber-500/2 transition-colors">
                  <td className="py-3 px-3 font-bold text-text-primary">
                    {item.user}
                  </td>
                  <td className="py-3 px-3 font-bold text-text-secondary">
                    <span className="capitalize">{item.from.replace("_", " ")}</span>
                    <span className="text-text-faint px-1.5 font-bold">→</span>
                    <span className="capitalize text-amber-400">{item.to.replace("_", " ")}</span>
                  </td>
                  <td className="py-3 px-3 text-text-secondary font-bold">
                    {item.authorizedBy}
                  </td>
                  <td className="py-3 px-3 italic leading-relaxed text-text-muted max-w-[200px] truncate">
                    &ldquo;{item.reason}&rdquo;
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-text-muted">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Interactive Role Switcher Modal Dialog ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-bg-surface border-border-default text-text-primary rounded-2xl max-w-md">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-text-primary text-left font-heading font-bold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Modify Account Role
            </DialogTitle>
            <DialogDescription className="text-left text-text-muted text-xs">
              Change privileges for operator: <span className="font-bold text-text-secondary">{selectedAcc?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRoleChangeSubmit} className="space-y-4 my-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Target Role Level</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as UserRole)}
                className="h-10 w-full text-xs font-bold text-text-primary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="auth_user">Member (Regular Buyer)</option>
                <option value="agent">Real Estate Agent</option>
                <option value="admin">Moderation Admin</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Justification Reason *</label>
              <textarea
                placeholder="State the audit reason (e.g. verified brokerage license number, joined moderation support)..."
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                rows={3}
                className="w-full text-xs border bg-bg-base text-text-primary border-border-default rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none"
              />
            </div>

            <DialogFooter className="flex flex-row gap-3 mt-4">
              <Button
                type="button"
                onClick={() => setModalOpen(false)}
                variant="outline"
                className="flex-1 h-10 rounded-xl border-border-default text-text-primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold"
              >
                Update Role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
