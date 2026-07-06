import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { NewListingClient } from "./new-listing-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Listing | RealHoms",
  description: "Add a new real estate property listing using our 5-step wizard form.",
};

export default function CreateListingPage() {
  return (
    <DashboardShell allowedRoles={["agent"]}>
      <NewListingClient />
    </DashboardShell>
  );
}
