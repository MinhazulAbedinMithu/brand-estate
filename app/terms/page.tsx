import * as React from "react";
import { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { SystemSetting } from "@/lib/db/models/system-setting.model";
import { DEFAULT_TERMS_OF_SERVICE } from "@/lib/db/legal-defaults";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service | Brand Estate",
  description: "Read the Terms of Service and user agreement policy guidelines for Brand Estate listing directory SaaS platform.",
  openGraph: {
    title: "Terms of Service | Brand Estate",
    description: "Read the Terms of Service and user agreement policy guidelines for Brand Estate listing directory SaaS platform.",
    url: "/terms",
    siteName: "Brand Estate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Terms of Service | Brand Estate",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Brand Estate",
    description: "Read the Terms of Service and user agreement policy guidelines for Brand Estate listing directory SaaS platform.",
    images: ["/og-image.png"],
  },
};

async function getTermsContent(): Promise<{ content: string; updatedAt: Date }> {
  try {
    await connectDB();
    const setting = await SystemSetting.findOne({ key: "termsOfService" }).lean();
    if (setting) {
      return {
        content: setting.value,
        updatedAt: setting.updatedAt || new Date(),
      };
    }
  } catch (err) {
    console.error("Failed to load Terms of Service settings from DB:", err);
  }
  return {
    content: DEFAULT_TERMS_OF_SERVICE,
    updatedAt: new Date("2026-07-02T20:13:50+06:00"),
  };
}

export default async function TermsOfServicePage() {
  const { content, updatedAt } = await getTermsContent();

  return (
    <LegalLayout
      title="Terms of Service"
      description="Please read these terms and conditions carefully before registering, uploading listings, or conducting inquiries on the Brand Estate SaaS platform."
      content={content}
      updatedAt={updatedAt}
    />
  );
}
