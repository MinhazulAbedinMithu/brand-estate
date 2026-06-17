import * as React from "react";
import { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AgentBlogsClient } from "@/app/agent/blogs/agent-blogs-client";

export const metadata: Metadata = {
  title: "Blog Management | Agent Workspace",
  description: "Create real estate guides, analyze readers engagement and reactions, and draft marketing columns.",
};

export default function AgentBlogsPage() {
  return (
    <DashboardShell allowedRoles={["agent"]}>
      <AgentBlogsClient />
    </DashboardShell>
  );
}
