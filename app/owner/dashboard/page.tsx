import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OwnerDashboardClient } from "./owner-dashboard-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Console | Brand Estate",
  description: "Monitor user inquiries, view page counts, and edit property specs.",
};

export default function OwnerDashboardPage() {
  return (
    <DashboardShell allowedRoles={["owner"]}>
      <OwnerDashboardClient />
    </DashboardShell>
  );
}
