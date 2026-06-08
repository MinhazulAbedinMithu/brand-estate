import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No results found",
  message = "Try adjusting your search filters or browse all listings.",
  actionLabel,
  actionHref,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 text-center rounded-3xl border border-dashed border-border-default/60 bg-bg-alt/40",
        className
      )}
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-accent-primary-dim mb-5">
        {icon ?? <SearchX className="h-8 w-8 text-accent-primary" strokeWidth={1.5} />}
      </div>
      <h3 className="text-lg font-bold font-heading text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-muted font-body max-w-sm leading-relaxed">{message}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary text-white text-sm font-semibold hover:bg-accent-primary-hov hover:-translate-y-0.5 shadow-md hover:shadow-accent-primary/25 transition-all duration-200"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
