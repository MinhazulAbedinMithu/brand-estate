"use client";

import * as React from "react";
import { AlertOctagon, ShieldAlert, CheckCircle, Trash2, Eye, ShieldAlert as WarnIcon, XCircle, UserCheck } from "lucide-react";
import { mockPlatformReports, MockPlatformReport } from "@/src/mocks/dashboardMock";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ReportsClient() {
  const [reports, setReports] = React.useState(mockPlatformReports);
  const [tab, setTab] = React.useState<"open" | "reviewing" | "resolved" | "all">("open");
  const [selectedReport, setSelectedReport] = React.useState<MockPlatformReport | null>(null);

  const filteredReports = React.useMemo(() => {
    return reports.filter((rep) => {
      if (tab === "all") return true;
      return rep.status === tab;
    });
  }, [reports, tab]);

  const handleDismissReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" } : r));
    setSelectedReport(null);
    toast.success("Report dismissed", { description: "The dispute was flagged as invalid." });
  };

  const handleWarnUser = (id: string, name: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" } : r));
    setSelectedReport(null);
    toast.warning("Warning dispatched", { description: `A policy compliance warning was emailed to ${name}.` });
  };

  const handleRemoveEntity = (id: string, type: string, name: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" } : r));
    setSelectedReport(null);
    toast.error("Content deleted", {
      description: `The reported ${type} "${name}" was removed from the active registers.`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-rose-500 animate-pulse" />
            User Reports
          </h1>
          <p className="text-xs text-slate-500 font-medium font-body">Supervise platform policy violations, user complaints and fraud reports</p>
        </div>
        <div className="flex bg-[#0F1829] border border-slate-800/80 p-0.5 rounded-xl">
          {(["open", "reviewing", "resolved", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all select-none",
                tab === t ? "bg-accent-primary text-white" : "text-slate-500 hover:text-white"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Reports Table Grid ── */}
      {filteredReports.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs font-bold flex flex-col items-center gap-2">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
          <span>All reports are fully resolved. No open alerts!</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/60 bg-[#0A101C] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#0F1829]/50 text-slate-400 font-extrabold uppercase select-none">
                  <th className="py-4 px-5">Reporter Name</th>
                  <th className="py-4 px-5">Flagged Item</th>
                  <th className="py-4 px-5">Reason</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Submitted Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-350 font-medium">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#0F1829]/20 transition-colors">
                    {/* Reporter */}
                    <td className="py-4 px-5">
                      <span className="font-bold text-white block">{rep.reporterName}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{rep.reporterEmail}</span>
                    </td>

                    {/* Reported Target */}
                    <td className="py-4 px-5 cursor-pointer" onClick={() => setSelectedReport(rep)}>
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block hover:text-accent-primary transition-colors">
                          {rep.reportedEntityName}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          Type: {rep.entityType}
                        </span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-5 text-slate-300">
                      {rep.reason}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border tracking-wider",
                        rep.status === "open" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" :
                        rep.status === "reviewing" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                        "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      )}>
                        {rep.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-slate-400">
                      {rep.submittedDate}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right">
                      <Button
                        onClick={() => setSelectedReport(rep)}
                        size="icon-sm"
                        variant="ghost"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg"
                        title="Evaluate dispute"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Slide-over report inspector drawer ── */}
      <Sheet open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <SheetContent className="w-full sm:max-w-md bg-[#0A101C] border-l border-slate-800 text-slate-200 flex flex-col justify-between p-6">
          <SheetHeader className="pb-4 border-b border-slate-800/60">
            <SheetTitle className="text-white text-left font-heading text-lg font-bold">Reported Violation Dispute</SheetTitle>
            <SheetDescription className="text-left text-slate-500 text-xs mt-0.5">
              Evaluate policy violation details and select appropriate resolutions.
            </SheetDescription>
          </SheetHeader>

          {selectedReport && (
            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1 custom-scrollbar">
              
              {/* Flag details summary */}
              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest block">Dispute details</span>
                <div className="text-xs font-bold text-white leading-tight">Reason: {selectedReport.reason}</div>
                <div className="text-[10px] text-slate-500">Submitted by: {selectedReport.reporterName}</div>
              </div>

              {/* Targets detail block */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Flagged Entity</span>
                <div className="p-3.5 rounded-xl bg-[#0F1829] border border-slate-800">
                  <div className="text-xs font-bold text-white">{selectedReport.reportedEntityName}</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">Entity ID: {selectedReport.reportedEntityId}</div>
                  <div className="text-[9px] font-bold text-accent-primary uppercase tracking-wider block mt-1">
                    Class: {selectedReport.entityType}
                  </div>
                </div>
              </div>

              {/* Message complaint details */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Dispute description</span>
                <p className="text-xs text-slate-400 leading-relaxed font-body">{selectedReport.details}</p>
              </div>

            </div>
          )}

          {/* Dispute resolution options panel */}
          <div className="border-t border-slate-800/60 pt-4 space-y-2 mt-4 shrink-0">
            {selectedReport && selectedReport.status !== "resolved" && (
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleDismissReport(selectedReport.id)}
                  variant="outline"
                  className="h-10 rounded-xl border-slate-800 text-[11px] font-bold text-slate-300"
                >
                  Dismiss Flag
                </Button>
                <Button
                  onClick={() => handleWarnUser(selectedReport.id, selectedReport.reporterName)}
                  variant="outline"
                  className="h-10 rounded-xl border-amber-600/30 text-amber-400 hover:bg-amber-600 hover:text-white text-[11px] font-bold"
                >
                  Warn Lister
                </Button>
                <Button
                  onClick={() => handleRemoveEntity(selectedReport.id, selectedReport.entityType, selectedReport.reportedEntityName)}
                  className="h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold"
                >
                  Delete Item
                </Button>
              </div>
            )}
            <Button
              onClick={() => setSelectedReport(null)}
              variant="ghost"
              className="w-full h-10 rounded-xl text-slate-500 hover:text-white"
            >
              Close inspector
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}
