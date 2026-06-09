import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

const CATEGORY_DETAILS: Record<
  BlogPost["category"],
  { label: string; colors: string }
> = {
  "buying-guide": {
    label: "Buying Guide",
    colors: "bg-accent-primary/10 text-accent-primary border-accent-primary/20 dark:bg-dark-accent-primary/15 dark:text-dark-accent-primary dark:border-dark-accent-primary/30",
  },
  "selling-guide": {
    label: "Selling Guide",
    colors: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30",
  },
  "investment": {
    label: "Investment",
    colors: "bg-state-success/10 text-state-success border-state-success/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
  },
  "market-trends": {
    label: "Market Trends",
    colors: "bg-state-info/10 text-state-info border-state-info/20 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30",
  },
  "lifestyle": {
    label: "Lifestyle",
    colors: "bg-state-warning/10 text-state-warning border-state-warning/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
  },
};

export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  const categoryInfo = CATEGORY_DETAILS[post.category];

  // Format published date
  const publishDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      className={cn(
        "group flex flex-col bg-bg-surface border border-border-default/45 rounded-2xl overflow-hidden",
        "hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent-primary/5 hover:border-accent-primary/25 transition-all duration-300",
        className
      )}
    >
      {/* Thumbnail Anchor */}
      <Link href={`/blogs/${post.slug}`} className="relative aspect-16/10 w-full overflow-hidden bg-bg-elevated block">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle Overlay Mask */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />

        {/* Floating Category Badge */}
        <span
          className={cn(
            "absolute top-4 left-4 text-[10px] font-bold border px-3 py-1 rounded-full uppercase tracking-wider select-none backdrop-blur-md",
            categoryInfo.colors
          )}
        >
          {categoryInfo.label}
        </span>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          {/* Post Meta (Date & Read Time) */}
          <div className="flex items-center gap-4 text-xs text-text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent-primary/75" />
              {publishDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-accent-primary/75" />
              {post.readTimeMinutes} min read
            </span>
          </div>

          {/* Post Title */}
          <h3 className="text-text-primary text-base sm:text-lg font-bold font-body line-clamp-2 leading-snug group-hover:text-accent-primary transition-colors duration-200">
            <Link href={`/blogs/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-text-secondary text-xs sm:text-sm font-body line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Footer: Author Info & Read Link */}
        <div className="flex items-center justify-between pt-4 border-t border-border-default/45 mt-2">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-7 w-7 rounded-full border border-border-default object-cover"
            />
            <span className="text-xs font-bold text-text-primary">
              {post.author.name}
            </span>
          </div>

          {/* Read Arrow CTA */}
          <Link
            href={`/blogs/${post.slug}`}
            className="flex items-center gap-1.5 text-xs font-extrabold text-accent-primary hover:text-accent-primary-hov group/btn transition-colors duration-200"
          >
            Read Post
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
