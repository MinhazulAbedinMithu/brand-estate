import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardClient } from "./dashboard-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Dashboard | Brand Estate",
  description: "Manage your saved listings, check inquiries, and customize your agent alert parameters.",
};

export default function UserDashboardPage() {
  return (
    <DashboardShell allowedRoles={["auth_user"]}>
      <DashboardClient />
    </DashboardShell>
  );
}
