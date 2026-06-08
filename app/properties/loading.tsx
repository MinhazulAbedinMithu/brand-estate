import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
        {/* Header section skeleton */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>

        {/* Search layout skeleton */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar skeleton */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="rounded-2xl border border-border-default bg-bg-surface p-6 space-y-6">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-9 w-full rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main content grid skeleton */}
          <div className="flex-1 w-full space-y-6">
            {/* Sort bar skeleton */}
            <div className="flex items-center justify-between border-b border-border-default/50 pb-4">
              <Skeleton className="h-5 w-24 rounded-md" />
              <div className="flex gap-2.5">
                <Skeleton className="h-9 w-32 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
              </div>
            </div>

            {/* Grid skeleton (6 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-bg-surface border border-border-default/50 rounded-2xl overflow-hidden space-y-4 p-4 pb-6"
                >
                  <Skeleton className="aspect-4/3 w-full rounded-xl" />
                  <div className="space-y-2.5">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-24 rounded-md" />
                      <Skeleton className="h-5 w-12 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-3 w-32 rounded-md" />
                  </div>
                  <div className="flex justify-between pt-4 border-t border-border-default/30">
                    <Skeleton className="h-4 w-12 rounded-md" />
                    <Skeleton className="h-4 w-12 rounded-md" />
                    <Skeleton className="h-4 w-12 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
