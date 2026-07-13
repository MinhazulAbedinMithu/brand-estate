"use client";

import * as React from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}

export function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Reset search query when dropdown closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const finalOptions = React.useMemo(() => {
    if (value && !options.includes(value)) {
      return [value, ...options];
    }
    return options;
  }, [options, value]);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return finalOptions;
    return finalOptions.filter((opt) =>
      opt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [finalOptions, searchQuery]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-10 px-4 flex items-center justify-between text-left text-sm rounded-xl border transition-all duration-200 cursor-pointer bg-bg-base text-text-primary",
          isOpen
            ? "border-accent-primary ring-2 ring-accent-primary/20"
            : "border-border-default hover:border-border-default/80",
          disabled && "opacity-55 cursor-not-allowed bg-bg-alt/25"
        )}
      >
        <span className={cn("truncate", !value && "text-text-muted")}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-200 shrink-0",
            isOpen && "transform rotate-180 text-accent-primary"
          )}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-bg-surface border border-border-default/80 rounded-2xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top">
          {/* Search box if there are more than 5 options */}
          {finalOptions.length > 5 && (
            <div className="relative mb-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-8.5 pl-8.5 pr-3 text-xs bg-bg-alt/45 hover:bg-bg-alt focus:bg-bg-base border border-border-default/40 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-accent-primary/35 focus:border-accent-primary text-text-primary transition-all duration-150"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-[180px] overflow-y-auto scrollbar-thin space-y-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 flex items-center justify-between text-left text-xs rounded-lg transition-all duration-150 cursor-pointer",
                      isSelected
                        ? "bg-accent-primary/10 text-accent-primary font-semibold"
                        : "hover:bg-bg-alt text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <span className="truncate">{opt}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-accent-primary shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-[11px] text-text-muted">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
