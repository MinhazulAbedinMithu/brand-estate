import * as React from "react";
import { Metadata } from "next";
import { BlogsClient } from "./blogs-client";

export const metadata: Metadata = {
  title: "Real Estate Insights & Advice | Brand Estate",
  description: "Browse articles, guides, and market reports on home buying, selling strategies, investment models, and lifestyle tips written by real estate professionals.",
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
