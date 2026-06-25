import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OwnerBlogEditClient } from "./owner-blog-edit-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Blog Post | Owner Workspace",
  description: "Modify your drafted or published blog post details.",
};

interface EditProps {
  params: Promise<{ id: string }>;
}

export default async function AgentBlogEditPage({ params }: EditProps) {
  const { id } = await params;
  return (
    <DashboardShell allowedRoles={["owner"]}>
      <OwnerBlogEditClient id={id} />
    </DashboardShell>
  );
}
