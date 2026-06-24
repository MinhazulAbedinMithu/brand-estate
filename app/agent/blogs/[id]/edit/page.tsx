import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AgentBlogEditClient } from "./agent-blog-edit-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Blog Post | Agent Workspace",
  description: "Modify your drafted or published blog post details.",
};

interface EditProps {
  params: Promise<{ id: string }>;
}

export default async function AgentBlogEditPage({ params }: EditProps) {
  const { id } = await params;
  return (
    <DashboardShell allowedRoles={["agent"]}>
      <AgentBlogEditClient id={id} />
    </DashboardShell>
  );
}
