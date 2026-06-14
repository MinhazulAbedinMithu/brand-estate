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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Inbox className="h-5 w-5 text-accent-primary" />
            Leads & Inquiries
          </h1>
          <p className="text-xs text-slate-500 font-medium font-body">Manage buyer interests and reply directly to property inquiries</p>
        </div>
        
        {/* Stats Strip */}
        <div className="flex gap-2.5">
          <div className="bg-[#0F1829] border border-slate-800 px-3.5 py-1.5 rounded-xl text-center min-w-[80px]">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Total</span>
            <span className="text-sm font-extrabold text-white mt-0.5 block">{stats.total}</span>
          </div>
          <div className="bg-[#0F1829] border border-slate-800 px-3.5 py-1.5 rounded-xl text-center min-w-[80px]">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block text-rose-400">Unread</span>
            <span className="text-sm font-extrabold text-rose-400 mt-0.5 block">{stats.unread}</span>
          </div>
          <div className="bg-[#0F1829] border border-slate-800 px-3.5 py-1.5 rounded-xl text-center min-w-[80px]">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block text-emerald-400">Replied</span>
            <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">{stats.replied}</span>
          </div>
        </div>
      </div>

      {/* ── Split-screen Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-800/60 bg-[#0A101C] overflow-hidden shadow-xl min-h-[580px]">
        
        {/* LEFT COLUMN: Sidebar list (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800/60 flex flex-col justify-between bg-[#0A101C]/80">
          {/* Header search bar */}
          <div className="p-4 border-b border-slate-800/60 space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9.5 border-slate-850 bg-[#0F1829] text-xs text-slate-200 placeholder:text-slate-500 rounded-xl"
              />
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-1 bg-slate-900 border border-slate-800/60 p-0.5 rounded-lg">
              {(["all", "pending", "replied", "closed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition-all select-none",
                    tab === t ? "bg-accent-primary text-white" : "text-slate-500 hover:text-white"
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
                <span className="text-xs font-semibold text-slate-500">No matching inquiries found</span>
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
                        ? "bg-accent-primary/10 border-accent-primary/20 text-white"
                        : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900/40"
                    )}
                  >
                    <img
                      src={inq.propertyImage}
                      alt={inq.propertyTitle}
                      className="h-10 w-10 rounded-lg object-cover border border-slate-850 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0",
                          inq.status === "pending" ? "text-rose-400 bg-rose-500/10" :
                          inq.status === "replied" ? "text-emerald-400 bg-emerald-500/10" :
                          "text-slate-500 bg-slate-500/10"
                        )}>
                          {inq.status === "pending" ? "Unread" : inq.status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">{inq.submittedDate}</span>
                      </div>
                      <h4 className={cn("text-xs font-bold truncate", isSelected ? "text-white" : "text-slate-300")}>
                        {inq.propertyTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate leading-snug">{inq.message}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Leads response conversation (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#080D16]/40 p-5 sm:p-6 space-y-6">
          {selectedInq ? (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Top: Property link header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-4 shrink-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Buyer Inquiry details</span>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {selectedInq.propertyTitle}
                  </h3>
                </div>
                <Button render={<Link href={`/property/${selectedInq.propertyId}`} target="_blank" />} size="sm" variant="outline" className="h-8.5 rounded-lg border-slate-800 text-[11px] font-bold text-slate-350 hover:bg-slate-800">
                  <span className="flex items-center gap-1.5 w-full justify-center">
                    View active listing <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Button>
              </div>

              {/* Middle: Dialogue thread */}
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 max-h-[320px] custom-scrollbar">
                {/* Buyer Message */}
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">Prospective Buyer</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{selectedInq.submittedDate}</span>
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-[#0F1829] border border-slate-805 p-3.5 text-xs text-slate-200 leading-relaxed font-body">
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
                        <span className="text-xs font-bold text-white">You (Agent Response)</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{selectedInq.replyDate}</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-accent-primary/5 border border-accent-primary/15 p-3.5 text-xs text-slate-200 leading-relaxed font-body">
                        {selectedInq.replyMessage}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom: Send response text area */}
              <div className="shrink-0 border-t border-slate-800/60 pt-4">
                {selectedInq.status === "closed" ? (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs font-bold">
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
                      className="w-full text-xs border bg-[#0F1829]/50 text-slate-200 border-slate-850 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none font-body"
                    />
                    <div className="flex justify-between items-center gap-4">
                      <Button
                        type="button"
                        onClick={() => handleCloseLead(selectedInq.id)}
                        variant="ghost"
                        className="h-9 px-4 rounded-xl text-xs text-slate-500 hover:text-white hover:bg-slate-800/40"
                      >
                        Archive Lead Thread
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="h-9 px-5 rounded-xl bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold gap-1.5 active:scale-[0.98] transition-all"
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
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Inbox className="h-10 w-10 mb-2.5 opacity-60" />
              <span className="text-xs font-semibold">Select a lead from the sidebar inbox to read details</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
