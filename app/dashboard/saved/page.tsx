import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SavedPageClient } from "./saved-page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Properties | Brand Estate",
  description: "Monitor and track details for your favorited real estate listings.",
};

export default function SavedPropertiesPage() {
  return (
    <DashboardShell allowedRoles={["auth_user"]}>
      <SavedPageClient />
    </DashboardShell>
  );
}
