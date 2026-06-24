import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminBlogEditClient } from "./admin-blog-edit-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Blog Post | Admin Console",
  description: "Modify your drafted or published blog post details.",
};

interface EditProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: EditProps) {
  const { id } = await params;
  return (
    <DashboardShell allowedRoles={["admin", "super_admin"]}>
      <AdminBlogEditClient id={id} />
    </DashboardShell>
  );
}
