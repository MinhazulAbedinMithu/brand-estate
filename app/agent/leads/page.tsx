import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LeadsClient } from "./leads-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads Inbox | RealHoms",
  description: "Review and respond directly to property buyer inquiries and message history.",
};

export default function AgentLeadsPage() {
  return (
    <DashboardShell allowedRoles={["agent"]}>
      <LeadsClient />
    </DashboardShell>
  );
}
