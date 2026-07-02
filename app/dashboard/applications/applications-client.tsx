"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, Calendar, Building, Wallet, Check, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function TenantApplicationsClient() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        const res = await fetch("/api/applications");
        const data = await res.json();
        if (data.status === "success") {
          setApplications(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-border-default/60 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
            My Applications
          </h1>
          <p className="text-xs text-text-muted font-medium mt-0.5">
            Track status, paid processing fees, and refund logs for your active property tenancy applications.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 text-accent-primary animate-spin" />
          <span className="text-xs text-text-muted font-semibold">Loading applications...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="py-12 text-center bg-bg-surface border border-dashed border-border-default/80 rounded-2xl space-y-3">
          <FileText className="h-10 w-10 text-text-faint mx-auto" />
          <p className="text-sm font-semibold text-text-muted">No applications found</p>
          <p className="text-xs text-text-faint leading-relaxed max-w-sm mx-auto">
            You haven't submitted any tenancy or reservation applications yet. Find properties in the search catalog and tap "Apply".
          </p>
          <Link href="/properties" className="inline-block mt-2">
            <Button className="h-9 bg-accent-primary text-white font-bold text-xs px-5 rounded-full">
              Explore Listings
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => {
            const prop = app.propertyId;
            const statusColors: Record<string, string> = {
              approved: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
              rejected: "text-rose-500 bg-rose-500/10 border-rose-500/20",
              pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
            };

            return (
              <div 
                key={app._id}
                className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm space-y-4 hover:border-border-subtle transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/40 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary shrink-0">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        {prop ? prop.title : "Property Listing Deleted"}
                      </h3>
                      {prop && (
                        <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                          {prop.city}, {prop.state}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border tracking-wider self-start sm:self-auto", statusColors[app.status] || statusColors.pending)}>
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-0.5">Submitted Date</span>
                    <span className="text-text-secondary flex items-center gap-1.5 mt-1 font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-0.5">Processing Fee</span>
                    <span className="text-text-primary font-bold flex items-center gap-1 mt-1">
                      <Wallet className="h-3.5 w-3.5 text-accent-primary" />
                      ${app.feePaid}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-0.5">Status Log</span>
                    <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                      {app.status === "pending" && "Under broker credentials screening check."}
                      {app.status === "approved" && "Congratulations! Your application has been approved."}
                      {app.status === "rejected" && (
                        <>
                          <span className="text-rose-400 font-bold block mb-0.5">Reason: {app.rejectionReason || "Broker selected another candidate."}</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Refunded ${app.feePaid} to Wallet Balance.
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
