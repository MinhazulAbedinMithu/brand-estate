import * as React from "react";
import { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { SystemSetting } from "@/lib/db/models/system-setting.model";
import { DEFAULT_COOKIE_POLICY } from "@/lib/db/legal-defaults";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata: Metadata = {
  title: "Cookie Policy | RealHoms",
  description: "Read how RealHoms uses cookies, session authentications, and theme configurations to optimize your user experience.",
  openGraph: {
    title: "Cookie Policy | RealHoms",
    description: "Read how RealHoms uses cookies, session authentications, and theme configurations to optimize your user experience.",
    url: "/cookies",
    siteName: "RealHoms",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cookie Policy | RealHoms",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | RealHoms",
    description: "Read how RealHoms uses cookies, session authentications, and theme configurations to optimize your user experience.",
    images: ["/og-image.png"],
  },
};

async function getCookieContent(): Promise<{ content: string; updatedAt: Date }> {
  try {
    await connectDB();
    const setting = await SystemSetting.findOne({ key: "cookiePolicy" }).lean();
    if (setting) {
      return {
        content: setting.value,
        updatedAt: setting.updatedAt || new Date(),
      };
    }
  } catch (err) {
    console.error("Failed to load Cookie Policy settings from DB:", err);
  }
  return {
    content: DEFAULT_COOKIE_POLICY,
    updatedAt: new Date("2026-07-02T20:13:50+06:00"),
  };
}

export default async function CookiePolicyPage() {
  const { content, updatedAt } = await getCookieContent();

  return (
    <LegalLayout
      title="Cookie Policy"
      description="This document details the essential session cookies, analytical trackers, and preferences configurations active on our SaaS platform."
      content={content}
      updatedAt={updatedAt}
    />
  );
}
