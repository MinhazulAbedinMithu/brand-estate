import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RolesClient } from "./roles-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Role Management | RealHoms",
  description: "Super admin workspace to adjust operator privileges and review role audit logs.",
};

export default function SuperAdminRolesPage() {
  return (
    <DashboardShell allowedRoles={["super_admin"]}>
      <RolesClient />
    </DashboardShell>
  );
}
