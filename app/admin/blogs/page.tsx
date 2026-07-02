import * as React from "react";
import { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminBlogsClient } from "@/app/admin/blogs/admin-blogs-client";

export const metadata: Metadata = {
  title: "Blog Moderation Queue | Admin Workspace",
  description: "Review user and agent submitted blogs, manage published listings, and draft administrative notices.",
};

export default function AdminBlogsPage() {
  return (
    <DashboardShell allowedRoles={["admin", "super_admin"]}>
      <AdminBlogsClient />
    </DashboardShell>
  );
}
