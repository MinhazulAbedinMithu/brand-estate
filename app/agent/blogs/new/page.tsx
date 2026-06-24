import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AgentBlogCreateClient } from "./agent-blog-create-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Blog Post | Agent Workspace",
  description: "Compose and submit a new real estate blog post.",
};

export default function AgentBlogCreatePage() {
  return (
    <DashboardShell allowedRoles={["agent"]}>
      <AgentBlogCreateClient />
    </DashboardShell>
  );
}
