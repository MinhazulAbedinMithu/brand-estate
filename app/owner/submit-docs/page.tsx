import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OwnerSubmitDocsClient } from "./owner-submit-docs-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Legal Documents | RealHoms",
  description: "Verify your real estate owner credentials by submitting license and registration details.",
};

export default function SubmitDocsPage() {
  return (
    <DashboardShell allowedRoles={["owner"]}>
      <OwnerSubmitDocsClient />
    </DashboardShell>
  );
}
