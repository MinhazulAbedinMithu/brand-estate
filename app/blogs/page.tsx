import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { BlogCard } from "@/components/shared/blog-card";
import { mockBlogPosts } from "@/src/mocks/blogPostsMock";
import { BlogSearchInput } from "./blog-search-input";

export const metadata: Metadata = {
  title: "Real Estate Insights & Advice | Brand Estate",
  description: "Browse articles, guides, and market reports on home buying, selling strategies, investment models, and lifestyle tips written by real estate professionals.",
};

const CATEGORIES = [
  { key: "all", label: "All Topics" },
  { key: "market-trends", label: "Market Trends" },
  { key: "buying-guide", label: "Buying Guide" },
  { key: "selling-guide", label: "Selling Guide" },
  { key: "investment", label: "Investment" },
  { key: "lifestyle", label: "Lifestyle" },
] as const;

interface BlogPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function BlogListingPage({ searchParams }: BlogPageProps) {
  const { q = "", category = "all" } = await searchParams;

  // Filter blog posts based on search query and category
  let filteredPosts = mockBlogPosts;

  if (category !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.category === category);
  }

  if (q.trim()) {
    const query = q.trim().toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Decorative Top Radial Highlight */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary-dim/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10 space-y-12">

        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-accent-primary/10 text-accent-primary dark:bg-dark-accent-primary/15 dark:text-dark-accent-primary border border-accent-primary/15 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <BookOpen className="h-3 w-3" />
            Brand Estate Blog
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-text-primary tracking-tight">
            Insights & Real Estate Resources
          </h1>
          <p className="text-sm sm:text-base text-text-secondary font-body leading-relaxed">
            Stay ahead of the curve with expert opinions, practical guides, and market-leading research.
          </p>
        </div>

        {/* Search and Category Filtering Row */}
        <div className="flex flex-col gap-6 items-center border-y border-border-default/45 py-6">
          {/* Search bar client component */}
          <BlogSearchInput defaultValue={q} />

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
            {CATEGORIES.map((cat) => {
              const isActive = category === cat.key;
              const linkParams = new URLSearchParams();
              if (cat.key !== "all") linkParams.set("category", cat.key);
              if (q) linkParams.set("q", q);

              const href = `/blogs${linkParams.toString() ? "?" + linkParams.toString() : ""}`;

              return (
                <Link
                  key={cat.key}
                  href={href}
                  className={classNameHelper(isActive)}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Results Info Bar */}
        {(q || category !== "all") && (
          <div className="flex items-center justify-between text-xs text-text-muted font-bold font-body">
            <span>
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
              {q && ` for "${q}"`}
              {category !== "all" && ` in ${CATEGORIES.find(c => c.key === category)?.label}`}
            </span>
            <Link
              href="/blogs"
              className="text-accent-primary hover:underline flex items-center gap-1 transition-all"
            >
              <RefreshCw className="h-3 w-3" /> Clear filters
            </Link>
          </div>
        )}

        {/* Blog Post Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-dashed border-border-default bg-bg-surface/50 max-w-xl mx-auto py-16">
            <div className="p-4 rounded-full bg-state-warning/10 text-state-warning mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold font-heading text-text-primary mb-2">
              No Articles Found
            </h3>
            <p className="text-sm text-text-secondary font-body mb-6 leading-relaxed max-w-xs">
              We couldn't find any posts matching your search criteria. Try adjusting your search query or filters.
            </p>
            <Link
              href="/blogs"
              className="bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold font-body px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-accent-primary/10"
            >
              Reset Search & Filters
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

function classNameHelper(isActive: boolean): string {
  return [
    "px-4 py-2 rounded-full text-xs font-semibold border font-body transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
    isActive
      ? "bg-accent-primary text-white border-accent-primary shadow-md shadow-accent-primary/20"
      : "bg-bg-elevated/40 text-text-secondary border-border-default hover:border-accent-primary/30 hover:bg-bg-elevated/85 hover:text-accent-primary"
  ].join(" ");
}
