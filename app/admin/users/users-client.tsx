"use client";

import * as React from "react";
import { Users, Search, SlidersHorizontal, Trash2, ShieldAlert, CheckCircle2, MoreVertical, XCircle, FileText, Mail, Calendar, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock user listings for admin workspace
const initialUsers = [
  { id: "usr-01", name: "Alex Johnson", email: "user@brandestate.com", role: "Member", joined: "2026-05-10", status: "Active", listingsCount: 0, inquiriesCount: 3, avatar: "" },
  { id: "usr-02", name: "Sarah Mitchell", email: "agent@brandestate.com", role: "Agent", joined: "2026-04-12", status: "Active", listingsCount: 8, inquiriesCount: 12, avatar: "" },
  { id: "usr-03", name: "Jane Doe", email: "jane@doe.com", role: "Member", joined: "2026-06-02", status: "Suspended", listingsCount: 0, inquiriesCount: 1, avatar: "" },
  { id: "usr-04", name: "Michael Chang", email: "michael.c@gmail.com", role: "Member", joined: "2026-06-11", status: "Active", listingsCount: 0, inquiriesCount: 4, avatar: "" },
  { id: "usr-05", name: "David Miller", email: "david.miller@estate.com", role: "Agent", joined: "2026-03-24", status: "Active", listingsCount: 6, inquiriesCount: 9, avatar: "" },
  { id: "usr-06", name: "Sophia Chen", email: "sophia@brandestate.com", role: "Agent", joined: "2026-05-01", status: "Active", listingsCount: 5, inquiriesCount: 8, avatar: "" },
];

export function UsersClient() {
  const [users, setUsers] = React.useState(initialUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [inspectedUser, setInspectedUser] = React.useState<typeof initialUsers[0] | null>(null);

  // Search / filter logic
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
      
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

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

  const toggleSuspension = (id: string, name: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Active" ? "Suspended" : "Active";
          toast.success(`Account status modified`, {
            description: `"${name}" is now marked as ${nextStatus.toLowerCase()}.`,
          });
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (inspectedUser?.id === id) setInspectedUser(null);
    toast.success("User removed", { description: `"${name}" account deleted.` });
  };

  const handleBulkSuspend = () => {
    if (selectedIds.length === 0) return;
    setUsers((prev) =>
      prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: "Suspended" } : u))
    );
    setSelectedIds([]);
    toast.success("Bulk action complete", {
      description: `Suspended ${selectedIds.length} selected users.`,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-accent-primary" />
            Manage Users
          </h1>
          <p className="text-xs text-slate-500 font-medium font-body">Monitor, configure roles and suspend platform user accounts</p>
        </div>
        <div className="text-xs font-bold bg-[#0F1829] border border-slate-800 px-3.5 py-1.5 rounded-full text-slate-400 select-none">
          Total Accounts: <span className="text-white">{users.length}</span>
        </div>
      </div>

      {/* ── Filter toolbar & bulk actions ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search accounts by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-slate-800 bg-[#0A101C] text-sm text-slate-200 placeholder:text-slate-500 focus:ring-accent-primary rounded-xl"
          />
        </div>

        {/* Roles Filter dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 text-xs font-bold text-slate-350 bg-[#0A101C] border border-slate-800 rounded-xl px-3 focus:outline-none focus:ring-1"
          >
            <option value="all">All Roles</option>
            <option value="member">Members</option>
            <option value="agent">Agents</option>
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
        <div className="py-12 text-center text-slate-500 text-xs font-bold">
          No user accounts found matching query parameters.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/60 bg-[#0A101C] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#0F1829]/50 text-slate-400 font-extrabold uppercase select-none">
                  <th className="py-4 px-5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-900"
                    />
                  </th>
                  <th className="py-4 px-5">User Details</th>
                  <th className="py-4 px-5">Platform Role</th>
                  <th className="py-4 px-5">Security Status</th>
                  <th className="py-4 px-5">Joined Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-350 font-medium">
                {filteredUsers.map((u) => {
                  const initials = u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                  const isChecked = selectedIds.includes(u.id);

                  return (
                    <tr key={u.id} className="hover:bg-[#0F1829]/20 transition-colors">
                      <td className="py-4 px-5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(u.id, e.target.checked)}
                          className="rounded border-slate-800 bg-slate-900"
                        />
                      </td>
                      
                      {/* Name / Avatar / Email */}
                      <td className="py-4 px-5 cursor-pointer" onClick={() => setInspectedUser(u)}>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8.5 w-8.5 border border-slate-700">
                            <AvatarImage src={u.avatar} alt={u.name} />
                            <AvatarFallback className="bg-slate-800 text-[10px] text-white">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-bold text-white block hover:text-accent-primary transition-colors">
                              {u.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-5">
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                          u.role === "Agent"
                            ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/20"
                            : "text-blue-400 bg-blue-500/5 border-blue-500/20"
                        )}>
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                          u.status === "Active"
                            ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/20"
                            : "text-rose-400 bg-rose-500/5 border-rose-500/20"
                        )}>
                          {u.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-slate-400">
                        {u.joined}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => setInspectedUser(u)}
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg"
                            title="Inspect details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => toggleSuspension(u.id, u.name)}
                            size="icon-sm"
                            variant="ghost"
                            className={cn(
                              "h-8 w-8 rounded-lg",
                              u.status === "Active"
                                ? "text-slate-400 hover:text-rose-400 hover:bg-slate-850"
                                : "text-emerald-400 hover:text-white hover:bg-emerald-600"
                            )}
                            title={u.status === "Active" ? "Suspend user" : "Activate user"}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg"
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
        <SheetContent className="w-full sm:max-w-md bg-[#0A101C] border-l border-slate-800 text-slate-200 flex flex-col justify-between p-6">
          <SheetHeader className="pb-4 border-b border-slate-800/60">
            <SheetTitle className="text-white text-left font-heading text-lg font-bold">User Account Inspector</SheetTitle>
            <SheetDescription className="text-left text-slate-500 text-xs mt-0.5">
              Supervise role variables, security logs, and listings count.
            </SheetDescription>
          </SheetHeader>

          {inspectedUser && (
            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1 custom-scrollbar">
              
              {/* Account profile card */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#0F1829] border border-slate-805">
                <Avatar className="h-16 w-16 border border-slate-700 mb-3">
                  <AvatarFallback className="bg-accent-primary text-white font-bold text-lg">
                    {inspectedUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-sm font-bold text-white leading-tight">{inspectedUser.name}</h4>
                <span className="text-[10px] text-slate-500 font-semibold block mt-1">{inspectedUser.email}</span>
              </div>

              {/* Account stats */}
              <div className="grid grid-cols-2 gap-3.5 text-center">
                <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/30">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Properties listed</span>
                  <span className="text-sm font-extrabold text-white mt-1 block">{inspectedUser.listingsCount}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/30">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Inquiries submitted</span>
                  <span className="text-sm font-extrabold text-white mt-1 block">{inspectedUser.inquiriesCount}</span>
                </div>
              </div>

              {/* Account Details list */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-accent-primary" /> System Details Logs
                </h5>
                <div className="space-y-3 font-medium text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-850">
                    <span className="text-slate-500 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" /> Email Verified</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-850">
                    <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 shrink-0" /> Registered Date</span>
                    <span className="font-bold text-slate-350">{inspectedUser.joined}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-850">
                    <span className="text-slate-500 flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5 shrink-0" /> Account Status</span>
                    <span className={cn("font-bold uppercase", inspectedUser.status === "Active" ? "text-emerald-400" : "text-rose-400")}>
                      {inspectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Drawer moderation controls */}
          <div className="border-t border-slate-800/60 pt-4 flex gap-3 mt-4">
            <Button
              onClick={() => setInspectedUser(null)}
              variant="outline"
              className="flex-1 h-10 rounded-xl border-slate-800 text-slate-200"
            >
              Close
            </Button>
            {inspectedUser && (
              <Button
                onClick={() => {
                  toggleSuspension(inspectedUser.id, inspectedUser.name);
                  setInspectedUser(null);
                }}
                className={cn(
                  "flex-1 h-10 rounded-xl font-bold text-white",
                  inspectedUser.status === "Active" ? "bg-rose-600 hover:bg-rose-500" : "bg-emerald-600 hover:bg-emerald-500"
                )}
              >
                {inspectedUser.status === "Active" ? "Suspend Account" : "Activate Account"}
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
    </div>
  );
}
