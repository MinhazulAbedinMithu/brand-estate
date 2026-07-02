import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ReportsClient } from "./reports-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Reports | Brand Estate",
  description: "Assess compliance reports, resolve spam allegations, and suspend listings.",
};

export default function AdminReportsPage() {
  return (
    <DashboardShell allowedRoles={["admin", "super_admin"]}>
      <ReportsClient />
    </DashboardShell>
  );
}
