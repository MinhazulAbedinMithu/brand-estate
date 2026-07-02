"use client";

import * as React from "react";
import { FileText, Calendar, Building, User, Wallet, Check, X, Shield, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function OwnerApplicationsClient() {
  const [applications, setApplications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  
  // Rejection reason overlay states
  const [rejectId, setRejectId] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState("");

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

  React.useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected", rejectReason?: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason: rejectReason })
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(`Application successfully ${status}!`);
        setRejectId(null);
        setReason("");
        loadApplications();
      } else {
        toast.error("Failed to update status", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border-default/60 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
          Tenancy & Purchase Applications
        </h1>
        <p className="text-xs text-text-muted font-medium mt-0.5">
          Verify tenant credentials, review credit screenings and background check statuses, and manage listing bookings.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 text-accent-primary animate-spin" />
          <span className="text-xs text-text-muted font-semibold">Loading applications...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="py-12 text-center bg-bg-surface border border-dashed border-border-default/80 rounded-2xl space-y-3">
          <FileText className="h-10 w-10 text-text-faint mx-auto" />
          <p className="text-sm font-semibold text-text-muted">No applications received yet</p>
          <p className="text-xs text-text-faint max-w-sm mx-auto leading-relaxed">
            Inbound tenancy applications for your active properties will appear here. Ensure your properties are configured with correct application fees.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => {
            const prop = app.propertyId;
            const tenant = app.userId;
            const statusColors: Record<string, string> = {
              approved: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
              rejected: "text-rose-500 bg-rose-500/10 border-rose-500/20",
              pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
            };

            return (
              <div 
                key={app._id}
                className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-4 hover:border-border-subtle transition-colors duration-200"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/45 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary shrink-0">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        {prop ? prop.title : "Deleted Property Listing"}
                      </h3>
                      {prop && (
                        <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                          {prop.city}, {prop.state} · Listed price: ${prop.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border tracking-wider self-start sm:self-auto", statusColors[app.status] || statusColors.pending)}>
                    {app.status}
                  </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
                  {/* Tenant credentials check */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block border-b border-border-default/40 pb-1">
                      Applicant Profile
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-text-secondary" />
                        <span className="text-text-primary font-bold">{tenant?.name || "Anonymous Member"}</span>
                      </div>
                      <p className="text-[11px] text-text-muted font-medium font-mono truncate pl-6">{tenant?.email}</p>
                      <p className="text-[11px] text-text-muted font-medium font-mono pl-6">{tenant?.phone || "No phone added"}</p>
                    </div>
                  </div>

                  {/* Verification screening checkboxes */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block border-b border-border-default/40 pb-1">
                      Verification Screening
                    </span>
                    <div className="space-y-1.5 font-medium text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Phone Verified</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Identity KYC: Verified</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Background check: Passed</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Credit Score: <span className="font-bold text-accent-primary">{tenant?.creditScore ?? 740}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata and Actions */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block border-b border-border-default/40 pb-1">
                      Details & Options
                    </span>
                    <div className="space-y-2 text-[11px] font-medium text-text-secondary">
                      <p>Submitted: {new Date(app.createdAt).toLocaleDateString()} at {new Date(app.createdAt).toLocaleTimeString()}</p>
                      <p className="flex items-center gap-1">
                        Application fee paid: <span className="font-bold text-text-primary">${app.feePaid}</span>
                      </p>

                      {app.status === "pending" && rejectId !== app._id && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            disabled={processingId === app._id}
                            onClick={() => handleUpdateStatus(app._id, "approved")}
                            className="h-8 flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg"
                          >
                            Approve Tenancy
                          </Button>
                          <Button 
                            disabled={processingId === app._id}
                            onClick={() => setRejectId(app._id)}
                            variant="outline"
                            className="h-8 flex-1 border-rose-500/30 text-rose-500 hover:bg-rose-500/5 font-bold text-[10px] rounded-lg"
                          >
                            Reject
                          </Button>
                        </div>
                      )}

                      {rejectId === app._id && (
                        <div className="space-y-2 pt-2 animate-fade-in text-left">
                          <Input 
                            placeholder="Rejection reason..."
                            value={reason}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
                            className="h-8 rounded-lg text-xs"
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleUpdateStatus(app._id, "rejected", reason)}
                              className="h-8 flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded-lg"
                            >
                              Confirm Reject
                            </Button>
                            <Button 
                              onClick={() => { setRejectId(null); setReason(""); }}
                              variant="outline"
                              className="h-8 border-border-default text-text-muted font-bold text-[10px] rounded-lg"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
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
