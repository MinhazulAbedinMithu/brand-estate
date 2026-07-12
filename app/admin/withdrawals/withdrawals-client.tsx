"use client";

import * as React from "react";
import { Landmark, Check, X, RefreshCw, Loader2, AlertTriangle, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function AdminWithdrawalsClient() {
  const [withdrawals, setWithdrawals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  // Reject overlays
  const [rejectId, setRejectId] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  const loadRequests = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/withdrawals");
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success") {
          setWithdrawals(data.data || []);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load withdrawal requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleReview = async (id: string, status: "approved" | "rejected", reason?: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(`Withdrawal request successfully ${status}!`);
        setRejectId(null);
        setRejectReason("");
        loadRequests();
      } else {
        toast.error("Review action failed", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error");
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "agent": return "Agent";
      case "owner": return "Owner";
      default: return "Member";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "agent": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "owner": return "text-cyan-500 bg-cyan-500/10 border-cyan-500/20";
      default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border-default/60 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent-primary" />
            Withdrawal Approvals Console
          </h1>
          <p className="text-xs text-text-muted font-medium mt-0.5">
            Review inbound member payout requests, verify Stripe account routes, and release or reject transaction funds.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadRequests}
          className="h-9 w-9 p-0 rounded-full border-border-default cursor-pointer text-text-secondary hover:text-text-primary"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Grid statistics summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-bg-surface border-border-default/60 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Pending Queue</span>
              <span className="text-lg font-bold text-text-primary mt-0.5">
                {withdrawals.filter(w => w.status === "pending").length} requests
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main ledger list */}
      <Card className="bg-bg-surface border-border-default/60 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-accent-primary animate-spin" />
              <span className="text-xs text-text-muted font-semibold">Loading withdrawal queue...</span>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="py-16 text-center text-xs text-text-faint font-semibold border border-dashed border-border-default/60 rounded-2xl m-6">
              No withdrawal logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border-default/45 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase font-bold text-text-muted h-11 pl-6">User</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-text-muted h-11">Request Amount</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-text-muted h-11">Withdraw Fee (10%)</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-text-muted h-11">Net Payout</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-text-muted h-11">Stripe Destination</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-text-muted h-11">Status</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-text-muted h-11">Date</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-text-muted h-11 text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((w) => {
                    const absAmt = Math.abs(w.amount);
                    const netPayout = absAmt - w.fee;
                    const applicant = w.userId;
                    
                    const statusColors: Record<string, string> = {
                      completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                      pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                      rejected: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                    };

                    return (
                      <TableRow key={w.id} className="border-border-default/30 hover:bg-bg-alt/30 text-xs font-semibold">
                        {/* User info details */}
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-accent-primary-dim text-accent-primary flex items-center justify-center font-bold text-[10px] shrink-0 border border-border-default/50">
                              {applicant?.name ? applicant.name[0] : "U"}
                            </div>
                            <div>
                              <p className="font-bold text-text-primary flex items-center gap-1.5">
                                {applicant?.name || "Unknown"}
                                {applicant && (
                                  <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", getRoleColor(applicant.role))}>
                                    {getRoleLabel(applicant.role)}
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-text-muted font-medium font-mono mt-0.5">{applicant?.email}</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Amount parameters */}
                        <TableCell className="py-4 font-bold text-text-primary">
                          ${absAmt.toFixed(2)}
                        </TableCell>
                        <TableCell className="py-4 text-rose-400">
                          -${w.fee.toFixed(2)}
                        </TableCell>
                        <TableCell className="py-4 font-bold text-emerald-400">
                          ${netPayout.toFixed(2)}
                        </TableCell>

                        {/* Destination */}
                        <TableCell className="py-4 font-mono text-[10px] text-text-secondary">
                          {w.stripeAccountId}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-4">
                          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold border tracking-wider", statusColors[w.status] || statusColors.pending)}>
                            {w.status}
                          </span>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="py-4 font-mono text-[10px] text-text-muted">
                          {new Date(w.createdAt).toLocaleDateString()}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-4 pr-6 text-right">
                          {w.status === "pending" && rejectId !== w.id && (
                            <div className="flex gap-2 justify-end">
                              <Button 
                                disabled={processingId === w.id}
                                onClick={() => handleReview(w.id, "approved")}
                                className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Approve Payout
                              </Button>
                              <Button 
                                disabled={processingId === w.id}
                                onClick={() => setRejectId(w.id)}
                                variant="outline"
                                className="h-8 border-rose-500/30 text-rose-500 hover:bg-rose-500/5 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Reject
                              </Button>
                            </div>
                          )}

                          {rejectId === w.id && (
                            <div className="space-y-2 text-right inline-block max-w-[200px] animate-fade-in">
                              <Input 
                                placeholder="Rejection reason..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="h-8 rounded-lg text-xs"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  onClick={() => handleReview(w.id, "rejected", rejectReason)}
                                  disabled={processingId === w.id}
                                  className="h-8 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                                >
                                  Reject request
                                </Button>
                                <Button 
                                  onClick={() => { setRejectId(null); setRejectReason(""); }}
                                  variant="outline"
                                  className="h-8 border-border-default text-text-muted font-bold text-[10px] rounded-lg cursor-pointer"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
