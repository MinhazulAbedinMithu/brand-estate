"use client";

import * as React from "react";
import Link from "next/link";
import { X, GitCompareArrows, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCompareItems,
  removeFromCompare,
  clearCompare,
  type CompareItem,
} from "@/lib/compare-store";

export function CompareBar() {
  const [items, setItems] = React.useState<CompareItem[]>([]);

  React.useEffect(() => {
    setItems(getCompareItems());
    const onchange = () => setItems(getCompareItems());
    window.addEventListener("comparechange", onchange);
    return () => window.removeEventListener("comparechange", onchange);
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border-default/60",
        "bg-bg-surface/95 backdrop-blur-xl shadow-2xl shadow-black/20",
        "animate-in slide-in-from-bottom-4 duration-300"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        {/* Icon */}
        <div className="hidden sm:flex items-center gap-2 text-accent-primary shrink-0">
          <GitCompareArrows className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Compare</span>
        </div>

        {/* Slots */}
        <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2.5 bg-bg-alt border border-border-default/60 rounded-xl px-3 py-2 shrink-0 min-w-0 max-w-[200px]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-9 w-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-text-primary truncate max-w-[100px]">
                  {item.title}
                </span>
                <span className="text-[10px] text-accent-primary font-bold">{item.price}</span>
              </div>
              <button
                onClick={() => removeFromCompare(item.id)}
                className="ml-auto shrink-0 p-0.5 rounded-full text-text-muted hover:text-state-error hover:bg-state-error/10 transition-colors"
                aria-label={`Remove ${item.title} from compare`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-[52px] w-[140px] shrink-0 rounded-xl border-2 border-dashed border-border-default/40 flex items-center justify-center"
            >
              <span className="text-[10px] text-text-faint font-medium">Add property</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted hover:text-state-error transition-colors font-semibold"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
          <Link
            href="/compare"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold",
              "bg-accent-primary hover:bg-accent-primary-hov text-white",
              "shadow-md shadow-accent-primary/20 transition-all active:scale-95",
              items.length < 2 ? "opacity-50 pointer-events-none" : ""
            )}
            aria-disabled={items.length < 2}
          >
            <GitCompareArrows className="h-4 w-4" />
            Compare ({items.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
