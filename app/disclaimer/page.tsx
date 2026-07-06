import * as React from "react";
import { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { SystemSetting } from "@/lib/db/models/system-setting.model";
import { DEFAULT_DISCLAIMER } from "@/lib/db/legal-defaults";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata: Metadata = {
  title: "Platform Disclaimer | RealHoms",
  description: "Read the RealHoms platform disclaimer regarding real estate listing accuracies, investment projections, and third-party reports.",
  openGraph: {
    title: "Platform Disclaimer | RealHoms",
    description: "Read the RealHoms platform disclaimer regarding real estate listing accuracies, investment projections, and third-party reports.",
    url: "/disclaimer",
    siteName: "RealHoms",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Platform Disclaimer | RealHoms",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Disclaimer | RealHoms",
    description: "Read the RealHoms platform disclaimer regarding real estate listing accuracies, investment projections, and third-party reports.",
    images: ["/og-image.png"],
  },
};

async function getDisclaimerContent(): Promise<{ content: string; updatedAt: Date }> {
  try {
    await connectDB();
    const setting = await SystemSetting.findOne({ key: "disclaimer" }).lean();
    if (setting) {
      return {
        content: setting.value,
        updatedAt: setting.updatedAt || new Date(),
      };
    }
  } catch (err) {
    console.error("Failed to load Disclaimer settings from DB:", err);
  }
  return {
    content: DEFAULT_DISCLAIMER,
    updatedAt: new Date("2026-07-02T20:13:50+06:00"),
  };
}

export default async function DisclaimerPage() {
  const { content, updatedAt } = await getDisclaimerContent();

  return (
    <LegalLayout
      title="Platform Disclaimer"
      description="Important legal disclaimers explaining our role as a software platform directory and the limitations regarding listing facts, closing cost estimates, and financial projections."
      content={content}
      updatedAt={updatedAt}
    />
  );
}
