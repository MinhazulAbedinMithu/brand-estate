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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-rose-500 animate-pulse" />
            User Reports
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">Supervise platform policy violations, user complaints and fraud reports</p>
        </div>
        <div className="flex bg-bg-surface border border-border-default p-0.5 rounded-xl">
          {(["open", "reviewing", "resolved", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all select-none",
                tab === t ? "bg-accent-primary text-white" : "text-text-muted hover:text-text-primary"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Reports Table Grid ── */}
      {filteredReports.length === 0 ? (
        <div className="py-12 text-center text-text-muted text-xs font-bold flex flex-col items-center gap-2">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
          <span>All reports are fully resolved. No open alerts!</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-default bg-bg-alt/50 text-text-muted font-extrabold uppercase select-none">
                  <th className="py-4 px-5">Reporter Name</th>
                  <th className="py-4 px-5">Flagged Item</th>
                  <th className="py-4 px-5">Reason</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Submitted Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/60 text-text-secondary font-medium">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-bg-alt/20 transition-colors">
                    {/* Reporter */}
                    <td className="py-4 px-5">
                      <span className="font-bold text-text-primary block">{rep.reporterName}</span>
                      <span className="text-[10px] text-text-muted block mt-0.5">{rep.reporterEmail}</span>
                    </td>

                    {/* Reported Target */}
                    <td className="py-4 px-5 cursor-pointer" onClick={() => setSelectedReport(rep)}>
                      <div className="space-y-0.5">
                        <span className="font-bold text-text-primary block hover:text-accent-primary transition-colors">
                          {rep.reportedEntityName}
                        </span>
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
                          Type: {rep.entityType}
                        </span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-5 text-text-secondary">
                      {rep.reason}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border tracking-wider",
                        rep.status === "open" ? "text-rose-450 bg-rose-500/10 border-rose-500/20" :
                        rep.status === "reviewing" ? "text-state-warning bg-state-warning/10 border-state-warning/20" :
                        "text-text-muted bg-text-muted/10 border-border-default"
                      )}>
                        {rep.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-text-muted">
                      {rep.submittedDate}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right">
                      <Button
                        onClick={() => setSelectedReport(rep)}
                        size="icon-sm"
                        variant="ghost"
                        className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg"
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
        <SheetContent className="w-full sm:max-w-md bg-bg-surface border-l border-border-default text-text-secondary flex flex-col justify-between p-6">
          <SheetHeader className="pb-4 border-b border-border-default/60">
            <SheetTitle className="text-text-primary text-left font-heading text-lg font-bold">Reported Violation Dispute</SheetTitle>
            <SheetDescription className="text-left text-text-muted text-xs mt-0.5">
              Evaluate policy violation details and select appropriate resolutions.
            </SheetDescription>
          </SheetHeader>

          {selectedReport && (
            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1 custom-scrollbar">
              
              {/* Flag details summary */}
              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <span className="text-[9px] font-bold text-rose-450 uppercase tracking-widest block">Dispute details</span>
                <div className="text-xs font-bold text-text-primary leading-tight">Reason: {selectedReport.reason}</div>
                <div className="text-[10px] text-text-muted">Submitted by: {selectedReport.reporterName}</div>
              </div>

              {/* Targets detail block */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Flagged Entity</span>
                <div className="p-3.5 rounded-xl bg-bg-alt border border-border-default">
                  <div className="text-xs font-bold text-text-primary">{selectedReport.reportedEntityName}</div>
                  <div className="text-[10px] text-text-muted mt-1 font-mono">Entity ID: {selectedReport.reportedEntityId}</div>
                  <div className="text-[9px] font-bold text-accent-primary uppercase tracking-wider block mt-1">
                    Class: {selectedReport.entityType}
                  </div>
                </div>
              </div>

              {/* Message complaint details */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Dispute description</span>
                <p className="text-xs text-text-secondary leading-relaxed font-body">{selectedReport.details}</p>
              </div>

            </div>
          )}

          {/* Dispute resolution options panel */}
          <div className="border-t border-border-default/60 pt-4 space-y-2 mt-4 shrink-0">
            {selectedReport && selectedReport.status !== "resolved" && (
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleDismissReport(selectedReport.id)}
                  variant="outline"
                  className="h-10 rounded-xl border-border-default text-[11px] font-bold text-text-secondary"
                >
                  Dismiss Flag
                </Button>
                <Button
                  onClick={() => handleWarnUser(selectedReport.id, selectedReport.reporterName)}
                  variant="outline"
                  className="h-10 rounded-xl border-amber-600/30 text-amber-500 hover:bg-amber-600 hover:text-white text-[11px] font-bold"
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
              className="w-full h-10 rounded-xl text-text-muted hover:text-text-primary"
            >
              Close inspector
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}
