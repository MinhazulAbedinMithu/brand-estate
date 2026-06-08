"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { buildSearchUrl } from "@/lib/property-search-params";
import type { PropertySearchParams } from "@/lib/property-search-params";
import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  params: PropertySearchParams; // Used to reconstruct the URL
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, params, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  const makeHref = (p: number) => buildSearchUrl({ ...params, page: p });

  return (
    <nav
      className={cn("flex items-center justify-center gap-1.5", className)}
      aria-label="Pagination"
    >
      {/* Prev */}
      {page > 1 ? (
        <Link
          href={makeHref(page - 1)}
          className="flex items-center justify-center h-9 w-9 rounded-full border border-border-default/60 bg-bg-surface text-text-secondary hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-200"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex items-center justify-center h-9 w-9 rounded-full border border-border-default/30 bg-bg-elevated/50 text-text-faint cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex items-center justify-center h-9 w-9 text-text-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <Link
            key={p}
            href={makeHref(p as number)}
            className={cn(
              "flex items-center justify-center h-9 w-9 rounded-full text-sm font-semibold transition-all duration-200",
              p === page
                ? "bg-accent-primary text-white shadow-md shadow-accent-primary/25"
                : "border border-border-default/60 bg-bg-surface text-text-secondary hover:bg-accent-primary/10 hover:text-accent-primary hover:border-accent-primary/40"
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {page < totalPages ? (
        <Link
          href={makeHref(page + 1)}
          className="flex items-center justify-center h-9 w-9 rounded-full border border-border-default/60 bg-bg-surface text-text-secondary hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-200"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex items-center justify-center h-9 w-9 rounded-full border border-border-default/30 bg-bg-elevated/50 text-text-faint cursor-not-allowed">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
