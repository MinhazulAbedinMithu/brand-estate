import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ListingsClient } from "./listings-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Listings | Brand Estate",
  description: "Track status updates and pricing values for all listings created by you.",
};

export default function AgentListingsPage() {
  return (
    <DashboardShell allowedRoles={["agent"]}>
      <ListingsClient />
    </DashboardShell>
  );
}
