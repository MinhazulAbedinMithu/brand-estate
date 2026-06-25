import * as React from "react";
import { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OwnerBlogsClient } from "@/app/owner/blogs/owner-blogs-client";

export const metadata: Metadata = {
  title: "Blog Management | Owner Workspace",
  description: "Create real estate guides, analyze readers engagement and reactions, and draft marketing columns.",
};

export default function OwnerBlogsPage() {
  return (
    <DashboardShell allowedRoles={["owner"]}>
      <OwnerBlogsClient />
    </DashboardShell>
  );
}
