import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { UserBlogEditClient } from "./user-blog-edit-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Blog Post | User Dashboard",
  description: "Modify your drafted blog post details.",
};

interface EditProps {
  params: Promise<{ id: string }>;
}

export default async function UserBlogEditPage({ params }: EditProps) {
  const { id } = await params;
  return (
    <DashboardShell allowedRoles={["auth_user", "agent", "admin", "super_admin"]}>
      <UserBlogEditClient id={id} />
    </DashboardShell>
  );
}
