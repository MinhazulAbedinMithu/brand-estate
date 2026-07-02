import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { TenantApplicationsClient } from "@/app/dashboard/applications/applications-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Applications | Brand Estate",
  description: "Track your property tenancy and purchase applications.",
};

export default function MyApplicationsPage() {
  return (
    <DashboardShell allowedRoles={["auth_user"]}>
      <TenantApplicationsClient />
    </DashboardShell>
  );
}
