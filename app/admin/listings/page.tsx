import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ListingsManagementClient } from "./listings-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listing Management | Brand Estate",
  description: "Evaluate property listings, review agent declarations, and verify listings.",
};

export default function AdminListingsPage() {
  return (
    <DashboardShell allowedRoles={["admin"]}>
      <ListingsManagementClient />
    </DashboardShell>
  );
}
