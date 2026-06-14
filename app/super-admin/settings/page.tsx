import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsClient } from "./settings-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Settings | Brand Estate",
  description: "Super admin workspace to customize system flags, toggle features, and configure active regional directories.",
};

export default function SuperAdminSettingsPage() {
  return (
    <DashboardShell allowedRoles={["super_admin"]}>
      <SettingsClient />
    </DashboardShell>
  );
}
