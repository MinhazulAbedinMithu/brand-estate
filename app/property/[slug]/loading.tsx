import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-bg-base animate-pulse">
      {/* Gallery Skeleton */}
      <Skeleton className="h-[45vh] sm:h-[60vh] w-full" />

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & specs */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-12 w-[85%] rounded-xl" />
              <Skeleton className="h-8 w-[60%] rounded-lg" />
              <div className="flex gap-4 pt-4 border-t border-border-default/30">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4.5 w-28 rounded-md" />
              </div>
            </div>

            {/* Price Box */}
            <Skeleton className="h-24 w-full rounded-2xl" />

            {/* Description */}
            <div className="space-y-4">
              <Skeleton className="h-7 w-48 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-[98%] rounded-md" />
                <Skeleton className="h-4 w-[95%] rounded-md" />
                <Skeleton className="h-4 w-[97%] rounded-md" />
                <Skeleton className="h-4 w-[60%] rounded-md" />
              </div>
              {/* Callout */}
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>

            {/* General Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Skeleton className="h-6 w-36 rounded-md" />
                <Skeleton className="h-48 w-full rounded-2xl" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-36 rounded-md" />
                <Skeleton className="h-48 w-full rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Right Column Sticky Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Contact Card Skeleton */}
            <div className="border border-border-default bg-bg-surface rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-4 border-b border-border-default pb-5">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pb-2 border-b border-border-default">
                <Skeleton className="h-10 rounded-full" />
                <Skeleton className="h-10 rounded-full" />
              </div>
              <div className="space-y-4 pt-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-full" />
              </div>
            </div>

            {/* Quick facts skeleton */}
            <div className="border border-border-default bg-bg-surface rounded-2xl p-6 space-y-4">
              <Skeleton className="h-4 w-28 rounded-md" />
              <div className="space-y-3">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
