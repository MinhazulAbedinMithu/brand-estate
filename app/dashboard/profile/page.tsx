import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfilePageClient } from "./profile-page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings | Brand Estate",
  description: "Configure your personal information, notification flags, and account security details.",
};

export default function ProfileSettingsPage() {
  return (
    <DashboardShell allowedRoles={["auth_user"]}>
      <ProfilePageClient />
    </DashboardShell>
  );
}
