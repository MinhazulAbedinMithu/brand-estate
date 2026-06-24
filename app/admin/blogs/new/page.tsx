import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminBlogCreateClient } from "./admin-blog-create-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Blog Post | Admin Console",
  description: "Compose and publish a new real estate blog post directly.",
};

export default function AdminBlogCreatePage() {
  return (
    <DashboardShell allowedRoles={["admin", "super_admin"]}>
      <AdminBlogCreateClient />
    </DashboardShell>
  );
}
