import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { UsersClient } from "./users-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | Brand Estate",
  description: "Admin panel to manage roles, inspect user logs, and suspend or activate accounts.",
};

export default function AdminUsersPage() {
  return (
    <DashboardShell allowedRoles={["admin"]}>
      <UsersClient />
    </DashboardShell>
  );
}
