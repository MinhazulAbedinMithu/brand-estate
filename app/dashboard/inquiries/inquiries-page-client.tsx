"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquare, Calendar, User, UserCheck, ArrowRight, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { mockUserInquiries, MockDashboardInquiry } from "@/src/mocks/dashboardMock";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function InquiriesPageClient() {
  const [inquiries, setInquiries] = React.useState(mockUserInquiries);
  const [filter, setFilter] = React.useState<"all" | "pending" | "replied" | "closed">("all");
  const [selectedInquiry, setSelectedInquiry] = React.useState<MockDashboardInquiry | null>(null);

  const filteredInquiries = React.useMemo(() => {
    if (filter === "all") return inquiries;
    return inquiries.filter(i => i.status === filter);
  }, [inquiries, filter]);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-accent-primary" />
            My Inquiries
          </h1>
          <p className="text-xs text-text-muted font-medium">Communicate with real estate agents regarding properties of interest</p>
        </div>
        <div className="flex gap-1.5 bg-bg-alt border border-border-default/80 p-1 rounded-xl">
          {(["all", "pending", "replied", "closed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all select-none",
                filter === t
                  ? "bg-accent-primary text-white"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Inquiries List/Table ── */}
      {filteredInquiries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border-default bg-bg-surface/40 p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center gap-4 mt-8">
          <div className="h-14 w-14 rounded-full bg-bg-alt flex items-center justify-center text-text-muted">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-base font-bold text-text-primary">No Inquiries Found</h3>
            <p className="text-xs text-text-muted max-w-xs font-medium">
              There are no inquiries matching your selected status filter. Send an inquiry from any listing detail page!
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-default bg-bg-alt/50 text-text-muted font-extrabold uppercase tracking-wider select-none">
                  <th className="py-4 px-5">Property</th>
                  <th className="py-4 px-5">Agent</th>
                  <th className="py-4 px-5">Sent Date</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-bg-alt/25 transition-colors">
                    {/* Property description info */}
                    <td className="py-4 px-5 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={inq.propertyImage}
                          alt={inq.propertyTitle}
                          className="h-10 w-10 rounded-lg object-cover border border-border-default shrink-0"
                        />
                        <span className="font-bold text-text-primary truncate block max-w-[180px] sm:max-w-xs">
                          {inq.propertyTitle}
                        </span>
                      </div>
                    </td>

                    {/* Agent metadata */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6.5 w-6.5 border border-border-default">
                          <AvatarImage src={inq.agentAvatar} alt={inq.agentName} />
                          <AvatarFallback className="bg-bg-alt text-[10px] text-text-primary">
                            {inq.agentName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-text-primary">{inq.agentName}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-text-muted">
                      {inq.submittedDate}
                    </td>

                    {/* Badge status */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border tracking-wider",
                        inq.status === "replied" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                        inq.status === "pending" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                        "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      )}>
                        {inq.status}
                      </span>
                    </td>

                    {/* Actions button */}
                    <td className="py-4 px-5 text-right">
                      <Button
                        onClick={() => setSelectedInquiry(inq)}
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg text-[11px] text-accent-primary hover:text-text-primary hover:bg-bg-elevated font-bold px-3.5"
                      >
                        Inspect Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Slide-over Inquiry Detail Drawer ── */}
      <Sheet open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <SheetContent className="w-full sm:max-w-md bg-bg-surface border-l border-border-default text-text-primary flex flex-col justify-between p-6">
          <SheetHeader className="pb-4 border-b border-border-default/60">
            <SheetTitle className="text-text-primary text-left font-heading text-lg font-bold">Inquiry Status Details</SheetTitle>
            <SheetDescription className="text-left text-text-muted text-xs mt-0.5">
              Review transaction and message dialogue with agent.
            </SheetDescription>
          </SheetHeader>

          {selectedInquiry && (
            <div className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar pr-1">
              {/* Property Details Pill */}
              <div className="p-3.5 rounded-2xl bg-bg-base border border-border-default flex gap-3">
                <img
                  src={selectedInquiry.propertyImage}
                  alt={selectedInquiry.propertyTitle}
                  className="h-14 w-14 rounded-xl object-cover shrink-0 border border-border-default"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider">Property Inquiry</span>
                  <h4 className="text-xs font-bold text-text-primary leading-snug truncate">{selectedInquiry.propertyTitle}</h4>
                  <Link
                    href={`/property/${selectedInquiry.propertyId}`}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-text-muted hover:text-text-primary transition-colors"
                  >
                    View active listing <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" /> Message Dialogue Thread
                </h5>

                {/* User Inquiry (Sender) */}
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-accent-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-text-primary">You</span>
                      <span className="text-[10px] text-text-muted font-semibold">{selectedInquiry.submittedDate}</span>
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-accent-primary/8 border border-accent-primary/15 p-3.5 text-xs text-text-primary leading-relaxed">
                      {selectedInquiry.message}
                    </div>
                  </div>
                </div>

                {/* Agent Reply (Receiver) */}
                {selectedInquiry.replyMessage ? (
                  <div className="flex gap-3 animate-fade-in">
                    <Avatar className="h-8 w-8 border border-border-default shrink-0">
                      <AvatarImage src={selectedInquiry.agentAvatar} alt={selectedInquiry.agentName} />
                      <AvatarFallback className="bg-bg-alt text-[10px] text-text-primary">
                        {selectedInquiry.agentName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-text-primary flex items-center gap-1">
                          {selectedInquiry.agentName}
                          <UserCheck className="h-3 w-3 text-emerald-400" />
                        </span>
                        <span className="text-[10px] text-text-muted font-semibold">{selectedInquiry.replyDate}</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-bg-base border border-border-default p-3.5 text-xs text-text-primary leading-relaxed">
                        {selectedInquiry.replyMessage}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-400 text-xs">
                    <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <h6 className="font-bold">Pending Agent Response</h6>
                      <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                        Sophia Chen has received your request. Verified agents typically reply within 24 business hours. You will receive an email alert once updated.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Close Action Panel */}
          <div className="border-t border-border-default/60 pt-4 flex gap-3 mt-4">
            <Button
              onClick={() => setSelectedInquiry(null)}
              variant="outline"
              className="flex-1 h-10 rounded-xl border-border-default hover:bg-bg-elevated text-text-primary"
            >
              Close Panel
            </Button>
            {selectedInquiry?.replyMessage && selectedInquiry.status !== "closed" && (
              <Button
                onClick={() => {
                  setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, status: "closed" } : i));
                  setSelectedInquiry(null);
                  toast.success("Inquiry closed", { description: "You have archived this discussion." });
                }}
                className="flex-1 h-10 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white font-bold"
              >
                Mark as Resolved
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
