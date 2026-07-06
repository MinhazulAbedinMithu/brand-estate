import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SuperAdminClient } from "./super-admin-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Console | RealHoms",
  description: "Super admin workspace console to evaluate security audit logs and invoke developer triggers.",
};

export default function SuperAdminDashboardPage() {
  return (
    <DashboardShell allowedRoles={["super_admin"]}>
      <SuperAdminClient />
    </DashboardShell>
  );
}
