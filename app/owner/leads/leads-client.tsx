"use client";

import * as React from "react";
import Link from "next/link";
import { Inbox, Search, Mail, Phone, Calendar, ArrowRight, MessageSquare, Send, CheckCircle2, Clock } from "lucide-react";
import { mockUserInquiries, MockDashboardInquiry } from "@/src/mocks/dashboardMock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LeadsClient() {
  const [inquiries, setInquiries] = React.useState(mockUserInquiries);
  const [selectedInqId, setSelectedInqId] = React.useState(mockUserInquiries[0]?.id || "");
  const [search, setSearch] = React.useState("");
  const [tab, setTab] = React.useState<"all" | "pending" | "replied" | "closed">("all");
  const [replyText, setReplyText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Active Selected Inquiry
  const selectedInq = React.useMemo(() => {
    return inquiries.find(i => i.id === selectedInqId) || inquiries[0];
  }, [inquiries, selectedInqId]);

  // Filters logic
  const filteredInquiries = React.useMemo(() => {
    return inquiries.filter(inq => {
      const matchesTab = tab === "all" || inq.status === tab;
      
      const q = search.toLowerCase().trim();
      const matchesSearch = !q ||
        inq.propertyTitle.toLowerCase().includes(q) ||
        inq.agentName.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [inquiries, tab, search]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("Validation error", { description: "Response message cannot be empty." });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setInquiries(prev => prev.map(i => {
        if (i.id === selectedInq.id) {
          return {
            ...i,
            status: "replied",
            replyMessage: replyText,
            replyDate: new Date().toISOString().split("T")[0]
          };
        }
        return i;
      }));
      setReplyText("");
      setSubmitting(false);
      toast.success("Reply dispatched", { description: "Response has been sent to the buyer." });
    }, 1200);
  };

  const handleCloseLead = (id: string) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: "closed" } : i));
    toast.success("Lead marked as closed", { description: "Discussion thread has been archived." });
  };

  // Stats calculation
  const stats = React.useMemo(() => {
    return {
      total: inquiries.length,
      unread: inquiries.filter(i => i.status === "pending").length,
      replied: inquiries.filter(i => i.status === "replied").length,
    };
  }, [inquiries]);

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <Inbox className="h-5 w-5 text-accent-primary" />
            Leads & Inquiries
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">Manage buyer interests and reply directly to property inquiries</p>
        </div>
        
        {/* Stats Strip */}
        <div className="flex gap-2.5">
          <div className="bg-bg-alt border border-border-default px-3.5 py-1.5 rounded-xl text-center min-w-[80px]">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Total</span>
            <span className="text-sm font-extrabold text-text-primary mt-0.5 block">{stats.total}</span>
          </div>
          <div className="bg-bg-alt border border-border-default px-3.5 py-1.5 rounded-xl text-center min-w-[80px]">
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block">Unread</span>
            <span className="text-sm font-extrabold text-rose-500 mt-0.5 block">{stats.unread}</span>
          </div>
          <div className="bg-bg-alt border border-border-default px-3.5 py-1.5 rounded-xl text-center min-w-[80px]">
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Replied</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{stats.replied}</span>
          </div>
        </div>
      </div>

      {/* ── Split-screen Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-border-default bg-bg-surface overflow-hidden shadow-xl min-h-[580px]">
        
        {/* LEFT COLUMN: Sidebar list (5 cols) */}
        <div className="lg:col-span-5 border-r border-border-default/60 flex flex-col justify-between bg-bg-surface">
          {/* Header search bar */}
          <div className="p-4 border-b border-border-default/60 space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9.5 border-border-default bg-bg-base text-xs text-text-primary placeholder:text-text-muted rounded-xl"
              />
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-1 bg-bg-alt border border-border-default p-0.5 rounded-lg">
              {(["all", "pending", "replied", "closed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition-all select-none cursor-pointer",
                    tab === t ? "bg-accent-primary text-white" : "text-text-muted hover:text-text-primary"
                  )}
                >
                  {t === "pending" ? "Unread" : t}
                </button>
              ))}
            </div>
          </div>

          {/* Leads scrollable listing */}
          <div className="flex-1 overflow-y-auto max-h-[480px] custom-scrollbar p-2 space-y-1">
            {filteredInquiries.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <span className="text-xs font-semibold text-text-muted">No matching inquiries found</span>
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const isSelected = selectedInq?.id === inq.id;
                return (
                  <button
                    key={inq.id}
                    onClick={() => { setSelectedInqId(inq.id); setReplyText(""); }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all flex gap-3 cursor-pointer",
                      isSelected
                        ? "bg-accent-primary/10 border-accent-primary/20 text-text-primary font-semibold"
                        : "bg-transparent border-transparent text-text-secondary hover:bg-bg-alt/40"
                    )}
                  >
                    <img
                      src={inq.propertyImage}
                      alt={inq.propertyTitle}
                      className="h-10 w-10 rounded-lg object-cover border border-border-default shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0",
                          inq.status === "pending" ? "text-rose-600 dark:text-rose-400 bg-rose-500/10" :
                          inq.status === "replied" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" :
                          "text-text-muted bg-border-default/20"
                        )}>
                          {inq.status === "pending" ? "Unread" : inq.status}
                        </span>
                        <span className="text-[10px] text-text-muted font-semibold">{inq.submittedDate}</span>
                      </div>
                      <h4 className={cn("text-xs font-bold truncate", isSelected ? "text-text-primary" : "text-text-secondary")}>
                        {inq.propertyTitle}
                      </h4>
                      <p className="text-[11px] text-text-muted truncate leading-snug">{inq.message}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Leads response conversation (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-bg-alt/20 p-5 sm:p-6 space-y-6">
          {selectedInq ? (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Top: Property link header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-default/60 pb-4 shrink-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Buyer Inquiry details</span>
                  <h3 className="text-sm sm:text-base font-bold text-text-primary leading-snug">
                    {selectedInq.propertyTitle}
                  </h3>
                </div>
                <Button render={<Link href={`/property/${selectedInq.propertyId}`} target="_blank" />} size="sm" variant="outline" className="h-8.5 rounded-lg border-border-default text-[11px] font-bold text-text-secondary hover:bg-bg-elevated cursor-pointer">
                  <span className="flex items-center gap-1.5 w-full justify-center">
                    View active listing <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Button>
              </div>

              {/* Middle: Dialogue thread */}
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 max-h-[320px] custom-scrollbar">
                {/* Buyer Message */}
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-bg-alt border border-border-default flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-text-muted" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-text-primary">Prospective Buyer</span>
                      <span className="text-[10px] text-text-muted font-semibold">{selectedInq.submittedDate}</span>
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-bg-base border border-border-default p-3.5 text-xs text-text-secondary leading-relaxed font-body">
                      {selectedInq.message}
                    </div>
                  </div>
                </div>

                {/* Agent Reply */}
                {selectedInq.replyMessage && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="h-8 w-8 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-accent-primary" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-text-primary">You (Owner Response)</span>
                        <span className="text-[10px] text-text-muted font-semibold">{selectedInq.replyDate}</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-accent-primary/5 border border-accent-primary/15 p-3.5 text-xs text-text-secondary leading-relaxed font-body">
                        {selectedInq.replyMessage}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom: Send response text area */}
              <div className="shrink-0 border-t border-border-default pt-4">
                {selectedInq.status === "closed" ? (
                  <div className="p-3.5 rounded-xl bg-bg-alt border border-border-default text-center text-text-muted text-xs font-bold">
                    This lead discussion has been closed and archived.
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="space-y-3">
                    <textarea
                      placeholder={selectedInq.replyMessage ? "Send a follow-up message..." : "Write your response response here..."}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      disabled={submitting}
                      className="w-full text-xs border bg-bg-base text-text-secondary border-border-default rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none font-body"
                    />
                    <div className="flex justify-between items-center gap-4">
                      <Button
                        type="button"
                        onClick={() => handleCloseLead(selectedInq.id)}
                        variant="ghost"
                        className="h-9 px-4 rounded-xl text-xs text-text-muted hover:text-text-primary hover:bg-bg-elevated cursor-pointer"
                      >
                        Archive Lead Thread
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="h-9 px-5 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {submitting ? "Sending..." : selectedInq.replyMessage ? "Follow up" : "Send Response"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-text-muted">
              <Inbox className="h-10 w-10 mb-2.5 opacity-60" />
              <span className="text-xs font-semibold">Select a lead from the sidebar inbox to read details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
