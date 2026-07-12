import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminWithdrawalsClient } from "./withdrawals-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdrawal Requests Console | RealHoms",
  description: "Review and approve or reject user wallet withdrawal requests.",
};

export default function AdminWithdrawalsPage() {
  return (
    <DashboardShell allowedRoles={["admin", "super_admin"]}>
      <AdminWithdrawalsClient />
    </DashboardShell>
  );
}
