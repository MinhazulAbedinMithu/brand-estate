import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AgentApplicationsClient } from "./agent-applications-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant Applications | Agent Console",
  description: "Review tenancy and purchase applications for your listed properties.",
};

export default function AgentApplicationsPage() {
  return (
    <DashboardShell allowedRoles={["agent"]}>
      <AgentApplicationsClient />
    </DashboardShell>
  );
}
