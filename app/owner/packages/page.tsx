import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OwnerPackagesClient } from "./packages-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Packages | Brand Estate",
  description: "View and manage your listing subscription plan limits.",
};

export default function OwnerPackagesPage() {
  return (
    <DashboardShell allowedRoles={["owner"]}>
      <OwnerPackagesClient />
    </DashboardShell>
  );
}
