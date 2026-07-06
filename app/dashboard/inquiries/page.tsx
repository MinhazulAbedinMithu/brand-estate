import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { InquiriesPageClient } from "./inquiries-page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Inquiries | RealHoms",
  description: "Track property inquiries and reviews from verified agents.",
};

export default function MyInquiriesPage() {
  return (
    <DashboardShell allowedRoles={["auth_user"]}>
      <InquiriesPageClient />
    </DashboardShell>
  );
}
