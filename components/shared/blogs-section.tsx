import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogCard } from "./blog-card";
import { mockBlogPosts } from "@/src/mocks/blogPostsMock";

export function BlogsSection() {
  // Take the latest 3 posts for the homepage grid
  const displayedPosts = mockBlogPosts.slice(0, 3);

  return (
    <section className="relative py-16 md:py-24 bg-bg-alt/30 border-y border-border-default/40">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary-dim/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-accent-primary/10 text-accent-primary dark:bg-dark-accent-primary/15 dark:text-dark-accent-primary border border-accent-primary/15 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <BookOpen className="h-3 w-3" />
              Insights & Advice
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-text-primary tracking-tight">
              Stay Informed
            </h2>
            <p className="text-sm sm:text-base text-text-secondary font-body leading-relaxed">
              Discover tips, market analyses, and expert strategies from top real estate professionals to help you make smarter property decisions.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 bg-accent-primary text-white text-xs sm:text-sm font-bold font-body px-6 py-3 rounded-full hover:bg-accent-primary-hov hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-accent-primary/20 cursor-pointer"
            >
              Explore All Articles
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

      </div>
    </section>
  );
}
