import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OwnerBlogCreateClient } from "./owner-blog-create-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Blog Post | Owner Workspace",
  description: "Compose and submit a new real estate blog post.",
};

export default function AgentBlogCreatePage() {
  return (
    <DashboardShell allowedRoles={["owner"]}>
      <OwnerBlogCreateClient />
    </DashboardShell>
  );
}
