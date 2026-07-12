"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Wallet, ArrowDownCircle, ArrowUpCircle, RefreshCw, Landmark, AlertCircle, Loader2, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function WalletClient() {
  const { currentUser, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const [depositAmount, setDepositAmount] = React.useState<string>("");
  const [selectedQuickAmount, setSelectedQuickAmount] = React.useState<number | null>(null);
  
  const [withdrawOpen, setWithdrawOpen] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [stripeAccount, setStripeAccount] = React.useState("");
  const [withdrawing, setWithdrawing] = React.useState(false);

  const [loadingTx, setLoadingTx] = React.useState(true);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [depositing, setDepositing] = React.useState(false);

  // Quick deposit selections
  const QUICK_AMOUNTS = [50, 100, 250, 500];

  const fetchTransactions = React.useCallback(async () => {
    try {
      setLoadingTx(true);
      const res = await fetch("/api/payment/transactions");
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success") {
          setTransactions(data.data || []);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load transactions.");
    } finally {
      setLoadingTx(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTransactions();
    refreshUser();

    // Handle redirect alerts
    const sessionId = searchParams.get("session_id");
    const depositStatus = searchParams.get("deposit");
    
    if (sessionId && depositStatus === "success") {
      const verifyDeposit = async () => {
        try {
          const res = await fetch(`/api/payment/deposit/verify?session_id=${sessionId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === "success") {
              toast.success("Deposit credited successfully! 🎉");
              refreshUser();
              fetchTransactions();
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      verifyDeposit();
    } else if (depositStatus === "cancelled") {
      toast.error("Deposit checkout was cancelled.");
    }
  }, [searchParams, refreshUser, fetchTransactions]);

  const handleQuickAmountSelect = (amount: number) => {
    setSelectedQuickAmount(amount);
    setDepositAmount(amount.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDepositAmount(val);
    setSelectedQuickAmount(null);
  };

  const handleDeposit = async () => {
    const numericAmount = parseFloat(depositAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid deposit amount." });
      return;
    }

    setDepositing(true);
    try {
      const res = await fetch("/api/payment/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount }),
      });
      const data = await res.json();
      if (data.status === "success" && data.url) {
        toast.success("Redirecting to Stripe checkout...");
        window.location.href = data.url;
      } else {
        toast.error("Initialization Failed", { description: data.message });
        setDepositing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error");
      setDepositing(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(withdrawAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid withdrawal amount." });
      return;
    }

    const currentBalance = currentUser?.walletBalance ?? 0;
    if (currentBalance < numericAmount) {
      toast.error("Insufficient Balance", { description: `Your wallet balance is $${currentBalance.toFixed(2)}.` });
      return;
    }

    if (!stripeAccount.trim()) {
      toast.error("Stripe Account Required", { description: "Please input a valid Stripe destination account ID." });
      return;
    }

    setWithdrawing(true);
    try {
      const res = await fetch("/api/payment/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount, stripeAccountId: stripeAccount }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Withdrawal request submitted successfully! 💸");
        setWithdrawOpen(false);
        setWithdrawAmount("");
        setStripeAccount("");
        refreshUser();
        fetchTransactions();
      } else {
        toast.error("Request Failed", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error");
    } finally {
      setWithdrawing(false);
    }
  };

  // Payout calculation variables
  const numericWithdraw = parseFloat(withdrawAmount) || 0;
  const fee = numericWithdraw * 0.10;
  const netPayout = numericWithdraw - fee;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-border-default/60 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
            My Wallet Dashboard
          </h1>
          <p className="text-xs text-text-muted font-medium mt-0.5">
            Manage your wallet balances, deposit money using Stripe, and request payouts.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { fetchTransactions(); refreshUser(); }}
          className="h-9 w-9 p-0 rounded-full border-border-default cursor-pointer text-text-secondary hover:text-text-primary"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <Card className="bg-bg-surface border-border-default/60 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-accent-primary/5 to-transparent pointer-events-none" />
          <CardHeader className="pb-2">
            <CardDescription className="text-text-muted text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-accent-primary" />
              Available Balance
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight mt-1">
              ${(currentUser?.walletBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-[10px] text-text-faint font-semibold">
              Instant balance funding used for processing property application fees.
            </p>
          </CardContent>
        </Card>

        {/* Deposit Card */}
        <Card className="bg-bg-surface border-border-default/60 shadow-sm md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
              <ArrowDownCircle className="h-4.5 w-4.5 text-emerald-500" />
              Deposit Funds to Wallet
            </CardTitle>
            <CardDescription className="text-[10px] text-text-muted">
              Select or type an amount in USD. Payments are processed securely via Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Amounts Grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {QUICK_AMOUNTS.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  onClick={() => handleQuickAmountSelect(amt)}
                  className={cn(
                    "h-9 rounded-xl border-border-default text-xs font-bold cursor-pointer transition-all",
                    selectedQuickAmount === amt 
                      ? "bg-accent-primary/10 border-accent-primary text-accent-primary" 
                      : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  )}
                >
                  ${amt}
                </Button>
              ))}
            </div>

            {/* Custom input & Submit */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">$</span>
                <Input
                  type="number"
                  placeholder="Custom amount..."
                  value={depositAmount}
                  onChange={handleCustomAmountChange}
                  className="pl-7 h-10 rounded-xl border-border-default bg-bg-surface/50 text-xs font-bold focus:border-accent-primary"
                />
              </div>
              <Button
                onClick={handleDeposit}
                disabled={depositing || !depositAmount}
                className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 active:scale-98 transition-all"
              >
                {depositing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Pending...
                  </>
                ) : (
                  <>
                    Deposit Funds
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal and Ledger Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdraw Panel */}
        <Card className="bg-bg-surface border-border-default/60 shadow-sm h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
              <ArrowUpCircle className="h-4.5 w-4.5 text-amber-500" />
              Wallet Withdrawal Requests
            </CardTitle>
            <CardDescription className="text-[10px] text-text-muted">
              Transfer funds from your wallet to a Stripe bank account (10% fee applies).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 bg-accent-primary-dim/30 border border-accent-primary/15 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-text-secondary font-semibold">
                <span>Withdrawal Fee</span>
                <span className="font-bold text-text-primary">10.0%</span>
              </div>
              <div className="text-[10px] text-text-muted leading-relaxed">
                A 10% fee is deducted from the payout amount. Payout request requires Admin review before processing to Stripe.
              </div>
            </div>

            <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
              <DialogTrigger render={
                <Button className="w-full h-10 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold gap-1 cursor-pointer">
                  Request Withdrawal
                </Button>
              } />
              <DialogContent className="bg-bg-surface border-border-default text-text-primary rounded-2xl max-w-sm">
                <form onSubmit={handleWithdrawSubmit}>
                  <DialogHeader>
                    <DialogTitle className="text-text-primary font-heading font-bold text-left text-base flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-accent-primary" />
                      Request Wallet Payout
                    </DialogTitle>
                    <DialogDescription className="text-left text-text-muted text-xs leading-relaxed">
                      Confirm withdrawal parameters. Reserved funds will be locked until approval.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 my-4">
                    {/* Amount Input */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Amount to Withdraw (USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">$</span>
                        <Input
                          type="number"
                          placeholder="e.g. 100"
                          required
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="pl-6.5 h-10 rounded-xl border-border-default bg-bg-surface/50 text-xs font-bold focus:border-accent-primary"
                        />
                      </div>
                    </div>

                    {/* Stripe Account ID */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Destination Stripe Account ID</label>
                      <Input
                        placeholder="e.g. acct_1Hj..."
                        required
                        value={stripeAccount}
                        onChange={(e) => setStripeAccount(e.target.value)}
                        className="h-10 rounded-xl border-border-default bg-bg-surface/50 text-xs font-mono font-bold focus:border-accent-primary"
                      />
                    </div>

                    {/* Breakdown */}
                    {numericWithdraw > 0 && (
                      <div className="p-3 bg-bg-alt/50 border border-border-default/60 rounded-xl space-y-2 text-xs font-semibold text-left">
                        <div className="flex justify-between items-center text-text-secondary">
                          <span>Request Amount:</span>
                          <span>${numericWithdraw.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-rose-400">
                          <span>Processing Fee (10%):</span>
                          <span>-${fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-400 border-t border-border-default/40 pt-1.5 font-bold">
                          <span>Net Stripe Payout:</span>
                          <span>${netPayout > 0 ? netPayout.toFixed(2) : "0.00"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter className="flex flex-row gap-3 mt-4">
                    <Button
                      type="button"
                      onClick={() => setWithdrawOpen(false)}
                      variant="outline"
                      className="flex-1 h-10 rounded-xl border-border-default text-text-secondary cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={withdrawing || !withdrawAmount || !stripeAccount}
                      className="flex-1 h-10 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white font-bold text-xs active:scale-98 transition-all"
                    >
                      {withdrawing ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                        </span>
                      ) : (
                        "Confirm Request"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Transactions ledger */}
        <Card className="bg-bg-surface border-border-default/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                <ArrowRightLeft className="h-4.5 w-4.5 text-accent-primary" />
                Transaction Ledger
              </CardTitle>
              <CardDescription className="text-[10px] text-text-muted mt-0.5">
                Detailed transaction records including deposits, application transfers, and withdrawals.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loadingTx ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="h-6 w-6 text-accent-primary animate-spin" />
                <span className="text-[11px] text-text-muted font-semibold">Loading transactions...</span>
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-10 text-center text-xs text-text-faint font-semibold border border-dashed border-border-default/60 rounded-2xl">
                No transactions recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border-default/45 hover:bg-transparent">
                      <TableHead className="text-[10px] uppercase font-bold text-text-muted h-9">Type</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-text-muted h-9">Description</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-text-muted h-9">Amount</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-text-muted h-9">Status</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-text-muted h-9 text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => {
                      const isNegative = tx.amount < 0;
                      const absAmount = Math.abs(tx.amount);
                      
                      const typeBadges: Record<string, { label: string; class: string }> = {
                        deposit: { label: "Deposit", class: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
                        withdraw: { label: "Withdraw", class: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
                        transfer_send: { label: "Paid Fee", class: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
                        transfer_receive: { label: "Received Fee", class: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
                        refund_send: { label: "Refund Paid", class: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
                        refund_receive: { label: "Refund Recv", class: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
                      };

                      const statusBadges: Record<string, { label: string; class: string }> = {
                        completed: { label: "Completed", class: "text-emerald-400 bg-emerald-500/10" },
                        pending: { label: "Pending", class: "text-amber-400 bg-amber-500/10" },
                        rejected: { label: "Rejected", class: "text-rose-400 bg-rose-500/10" },
                      };

                      const typeInfo = typeBadges[tx.type] || { label: tx.type, class: "text-text-muted bg-bg-alt" };
                      const statusInfo = statusBadges[tx.status] || { label: tx.status, class: "text-text-muted bg-bg-alt" };

                      return (
                        <TableRow key={tx.id} className="border-border-default/30 hover:bg-bg-alt/30 text-xs font-semibold">
                          <TableCell className="py-2.5">
                            <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 block w-fit", typeInfo.class)}>
                              {typeInfo.label}
                            </span>
                          </TableCell>
                          <TableCell className="py-2.5 max-w-[200px] truncate text-text-secondary">
                            {tx.description}
                          </TableCell>
                          <TableCell className={cn("py-2.5 font-bold", isNegative ? "text-rose-400" : "text-emerald-400")}>
                            {isNegative ? "-" : "+"}${absAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <span className={cn("px-1.5 py-0.5 rounded-md text-[9px] font-bold", statusInfo.class)}>
                              {statusInfo.label}
                            </span>
                          </TableCell>
                          <TableCell className="py-2.5 text-right font-mono text-[10px] text-text-muted">
                            {new Date(tx.createdAt).toLocaleDateString()}
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
    </div>
  );
}
