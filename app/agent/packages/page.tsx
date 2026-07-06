import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AgentPackagesClient } from "./packages-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Packages | RealHoms",
  description: "View and manage your listing subscription plan limits.",
};

export default function AgentPackagesPage() {
  return (
    <DashboardShell allowedRoles={["agent"]}>
      <AgentPackagesClient />
    </DashboardShell>
  );
}
