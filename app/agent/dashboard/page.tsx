import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AgentDashboardClient } from "./agent-dashboard-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Console | RealHoms",
  description: "Monitor user inquiries, view page counts, and edit property specs.",
};

export default function AgentDashboardPage() {
  return (
    <DashboardShell allowedRoles={["agent"]}>
      <AgentDashboardClient />
    </DashboardShell>
  );
}
