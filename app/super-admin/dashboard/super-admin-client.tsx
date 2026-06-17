"use client";

import * as React from "react";
import { ShieldCheck, Server, Database, Activity, RefreshCw, AlertCircle, FileText, Zap, Key } from "lucide-react";
import { mockAuditLogs } from "@/src/mocks/dashboardMock";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SuperAdminClient() {
  const [logs, setLogs] = React.useState(mockAuditLogs);
  const [flushing, setFlushing] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);

  const handleFlushCache = () => {
    setFlushing(true);
    setTimeout(() => {
      setFlushing(false);
      // Append a mock audit log
      const newLog = {
        id: `aud-sub-${Date.now()}`,
        actorName: "Elena Rodriguez",
        actorRole: "super_admin" as const,
        action: "Flushed Redis Cache",
        target: "Global buffer caches",
        timestamp: new Date().toISOString(),
        ipAddress: "192.168.1.45",
      };
      setLogs(prev => [newLog, ...prev]);
      toast.success("Cache flushed", { description: "Cleared 1,480 cached keys successfully." });
    }, 1200);
  };

  const handleResetDemo = () => {
    setResetting(true);
    setTimeout(() => {
      setResetting(false);
      toast.success("Mock Data Restored", { description: "Reset database tables to system defaults." });
    }, 1500);
  };

  const metrics = [
    { label: "Platform Users", value: "1,240", sub: "Active members" },
    { label: "Broker Agents", value: "48", sub: "Licensed listers" },
    { label: "Active Listings", value: "348", sub: "Searchable properties" },
    { label: "Inquiries Logs", value: "4,902", sub: "Dispatched interests" },
    { label: "System Admins", value: "4", sub: "Moderation managers" },
    { label: "Platform Regions", value: "8 countries", sub: "Live markets" },
  ];

  return (
    <div className="space-y-8">
      
      {/* ── Page Header ── */}
      <div className="border-b border-border-default/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-amber-500 shadow-sm" />
            Super Admin Console
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">Global operations control, database health metrics and security audit trail</p>
        </div>
        
        {/* System Health Strip with gold borders */}
        <div className="flex flex-wrap items-center gap-3 bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-xl backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <Server className="h-3.5 w-3.5" />
            <span>Web: OK</span>
          </div>
          <span className="text-border-default">|</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <Database className="h-3.5 w-3.5" />
            <span>DB: ONLINE</span>
          </div>
          <span className="text-border-default">|</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Uptime: 99.98%</span>
          </div>
        </div>
      </div>

      {/* ── Platform metrics cards (6 grid) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {metrics.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-border-default/60 bg-bg-surface hover:border-amber-500/25 transition-all">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">{item.label}</span>
            <span className="text-xl font-extrabold font-heading text-text-primary mt-1.5 block">{item.value}</span>
            <span className="text-[10px] text-text-secondary font-semibold block mt-0.5">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* ── Audit Trail & Console Actions split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Audit Logs Table (2/3 width) */}
        <div className="lg:col-span-2 rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border-default/50 pb-4">
            <h3 className="font-heading text-base font-bold text-text-primary flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-amber-500" />
              Security Audit Logs
            </h3>
            <span className="text-[10px] font-bold text-text-muted uppercase">Live trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-border-default/60 text-text-muted font-extrabold uppercase select-none">
                  <th className="py-2.5 px-3">Operator</th>
                  <th className="py-2.5 px-3">Operation Action</th>
                  <th className="py-2.5 px-3">Target Entity</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-text-secondary font-medium font-body">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-amber-500/2 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-text-primary block">{log.actorName}</span>
                      <span className="text-[9px] text-text-muted uppercase block mt-0.5">{log.actorRole}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-amber-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-3 truncate max-w-[150px] sm:max-w-xs text-text-primary">
                      {log.target}
                    </td>
                    <td className="py-3 px-3 text-text-muted font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global developer actions (1/3 width) */}
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-border-default/50 pb-4">
              <h3 className="font-heading text-base font-bold text-text-primary flex items-center gap-2">
                <Zap className="h-4.5 w-4.5 text-amber-500" />
                Console Panel Actions
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Global system commands triggers</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-bg-alt border border-border-default flex items-start gap-2.5 text-xs text-text-secondary">
                <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Flushing the cache or resetting demo tables directly modifies platform mock indices. Use with care.
                </span>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleFlushCache}
                  disabled={flushing}
                  className="w-full h-11 rounded-xl bg-bg-base hover:bg-bg-elevated border border-border-default hover:border-border-subtle text-text-secondary hover:text-text-primary font-bold gap-2"
                >
                  <RefreshCw className={cn("h-4 w-4 text-amber-500", flushing && "animate-spin")} />
                  {flushing ? "Flushing Cache..." : "Flush Global Cache"}
                </Button>

                <Button
                  onClick={handleResetDemo}
                  disabled={resetting}
                  className="w-full h-11 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/25 hover:border-transparent text-amber-400 hover:text-white font-bold gap-2 transition-all duration-200"
                >
                  <Key className="h-4 w-4" />
                  {resetting ? "Resetting Database..." : "Reset Platform Defaults"}
                </Button>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center text-text-faint font-bold select-none border-t border-border-default/60 pt-4 mt-6">
            PLATFORM CONSOLE V2.6.14
          </div>
        </div>

      </div>

    </div>
  );
}
