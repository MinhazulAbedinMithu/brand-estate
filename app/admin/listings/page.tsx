import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ListingsManagementClient } from "./listings-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listing Management | RealHoms",
  description: "Evaluate property listings, review agent declarations, and verify listings.",
};

export default function AdminListingsPage() {
  return (
    <DashboardShell allowedRoles={["admin", "super_admin"]}>
      <ListingsManagementClient />
    </DashboardShell>
  );
}
