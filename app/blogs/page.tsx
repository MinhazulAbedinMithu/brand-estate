import * as React from "react";
import { Metadata } from "next";
import { BlogsClient } from "./blogs-client";

export const metadata: Metadata = {
  title: "Real Estate Insights & Advice | RealHoms",
  description: "Browse articles, guides, and market reports on home buying, selling strategies, investment models, and lifestyle tips written by real estate professionals.",
  openGraph: {
    title: "Real Estate Insights & Advice | RealHoms",
    description: "Browse articles, guides, and market reports on home buying, selling strategies, investment models, and lifestyle tips written by real estate professionals.",
    url: "/blogs",
    siteName: "RealHoms",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Real Estate Insights & Advice | RealHoms",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Insights & Advice | RealHoms",
    description: "Browse articles, guides, and market reports on home buying, selling strategies, investment models, and lifestyle tips written by real estate professionals.",
    images: ["/og-image.png"],
  },
};

export default function BlogListingPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 text-accent-primary animate-spin rounded-full border-2 border-t-transparent border-accent-primary" />
        <p className="text-sm font-medium text-text-muted font-body">Loading insights...</p>
      </div>
    }>
      <BlogsClient />
    </React.Suspense>
  );
}
