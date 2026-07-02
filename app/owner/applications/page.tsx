import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OwnerApplicationsClient } from "./owner-applications-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant Applications | Owner Console",
  description: "Review tenancy and purchase applications for your listed properties.",
};

export default function OwnerApplicationsPage() {
  return (
    <DashboardShell allowedRoles={["owner"]}>
      <OwnerApplicationsClient />
    </DashboardShell>
  );
}
