import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminDashboardClient } from "./admin-dashboard-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Brand Estate",
  description: "Monitor user activities, evaluate listed properties and resolve moderation flags.",
};

export default function AdminDashboardPage() {
  return (
    <DashboardShell allowedRoles={["admin", "super_admin"]}>
      <AdminDashboardClient />
    </DashboardShell>
  );
}
