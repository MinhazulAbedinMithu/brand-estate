import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { UserBlogCreateClient } from "./user-blog-create-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Blog Post | User Dashboard",
  description: "Compose and submit a new real estate blog post.",
};

export default function UserBlogCreatePage() {
  return (
    <DashboardShell allowedRoles={["auth_user", "agent", "admin", "super_admin"]}>
      <UserBlogCreateClient />
    </DashboardShell>
  );
}
