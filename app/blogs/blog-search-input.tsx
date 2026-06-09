"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function BlogSearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(defaultValue);

  // Sync state if default value changes (e.g. when filters are reset)
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    params.delete("page"); // Reset page
    router.push(`/blogs?${params.toString()}`);
  };

  const handleClear = () => {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/blogs?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search articles, topics, keywords..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-10 pr-10 py-3 rounded-full border border-border-default/80 bg-bg-surface text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10 transition-all font-body shadow-sm"
      />
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint">
        <Search className="h-4 w-4" />
      </div>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-primary transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
