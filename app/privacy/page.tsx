import * as React from "react";
import { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { SystemSetting } from "@/lib/db/models/system-setting.model";
import { DEFAULT_PRIVACY_POLICY } from "@/lib/db/legal-defaults";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | Brand Estate",
  description: "Learn how Brand Estate collects, processes, stores, and safeguards your identity documentation (NID/KYC) and personal details.",
  openGraph: {
    title: "Privacy Policy | Brand Estate",
    description: "Learn how Brand Estate collects, processes, stores, and safeguards your identity documentation (NID/KYC) and personal details.",
    url: "/privacy",
    siteName: "Brand Estate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy | Brand Estate",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Brand Estate",
    description: "Learn how Brand Estate collects, processes, stores, and safeguards your identity documentation (NID/KYC) and personal details.",
    images: ["/og-image.png"],
  },
};

async function getPrivacyContent(): Promise<{ content: string; updatedAt: Date }> {
  try {
    await connectDB();
    const setting = await SystemSetting.findOne({ key: "privacyPolicy" }).lean();
    if (setting) {
      return {
        content: setting.value,
        updatedAt: setting.updatedAt || new Date(),
      };
    }
  } catch (err) {
    console.error("Failed to load Privacy Policy settings from DB:", err);
  }
  return {
    content: DEFAULT_PRIVACY_POLICY,
    updatedAt: new Date("2026-07-02T20:13:50+06:00"),
  };
}

export default async function PrivacyPolicyPage() {
  const { content, updatedAt } = await getPrivacyContent();

  return (
    <LegalLayout
      title="Privacy Policy"
      description="This policy outlines how Brand Estate processes and secures your sensitive files, credentials validation profiles, and listings analytics data."
      content={content}
      updatedAt={updatedAt}
    />
  );
}
