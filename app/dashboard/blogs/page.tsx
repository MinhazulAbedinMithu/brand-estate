import * as React from "react";
import { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { UserBlogsClient } from "@/app/dashboard/blogs/user-blogs-client";

export const metadata: Metadata = {
  title: "My Blogs | Member Dashboard",
  description: "Write real estate guides, check reaction statistics, and manage your authored articles.",
};

export default function UserBlogsPage() {
  return (
    <DashboardShell allowedRoles={["auth_user"]}>
      <UserBlogsClient />
    </DashboardShell>
  );
}
