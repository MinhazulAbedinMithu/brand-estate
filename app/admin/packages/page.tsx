import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminPackagesClient } from "./packages-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages Management | Brand Estate",
  description: "View and edit pricing packages configurations for real estate agents.",
};

export default function AdminPackagesPage() {
  return (
    <DashboardShell allowedRoles={["admin"]}>
      <AdminPackagesClient />
    </DashboardShell>
  );
}
