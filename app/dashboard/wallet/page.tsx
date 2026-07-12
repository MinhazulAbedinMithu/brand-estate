import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { WalletClient } from "./wallet-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wallet | RealHoms",
  description: "Deposit funds using Stripe, review transaction history, and request withdrawals.",
};

export default function WalletPage() {
  return (
    <DashboardShell allowedRoles={["auth_user", "agent", "owner"]}>
      <WalletClient />
    </DashboardShell>
  );
}
