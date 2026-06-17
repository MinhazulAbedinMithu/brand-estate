"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  labelInfo?: string;
  suggestions?: readonly string[] | string[];
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tags...",
  label,
  labelInfo,
  suggestions = [],
}: TagInputProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [typedValue, setTypedValue] = React.useState("");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Parse the parent comma-separated string value into tags list
  const parsedTags = React.useMemo(() => {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }, [value]);

  // Click outside listener to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePresetTag = (preset: string) => {
    const isSelected = parsedTags.includes(preset);
    let newTags: string[];
    if (isSelected) {
      newTags = parsedTags.filter((t) => t !== preset);
    } else {
      newTags = [...parsedTags, preset];
    }
    onChange(newTags.join(", "));
    setTypedValue("");
    inputRef.current?.focus();
  };

  const addCustomTag = (tag: string) => {
    const cleanVal = tag.trim();
    if (cleanVal && !parsedTags.includes(cleanVal)) {
      const updated = [...parsedTags, cleanVal];
      onChange(updated.join(", "));
    }
    setTypedValue("");
    inputRef.current?.focus();
  };

  const handleInputBlur = () => {
    const cleanVal = typedValue.trim();
    if (cleanVal) {
      if (!parsedTags.includes(cleanVal)) {
        const updated = [...parsedTags, cleanVal];
        onChange(updated.join(", "));
      }
      setTypedValue("");
    }
  };

  const filteredSuggestions = React.useMemo(() => {
    if (!suggestions || suggestions.length === 0) return [];
    const query = typedValue.trim().toLowerCase();
    if (!query) return suggestions;
    return suggestions.filter((tag) =>
      tag.toLowerCase().includes(query)
    );
  }, [typedValue, suggestions]);

  const showCustomAddOption = React.useMemo(() => {
    const cleanTyped = typedValue.trim();
    if (!cleanTyped) return false;
    return !parsedTags.some((tag) => tag.toLowerCase() === cleanTyped.toLowerCase());
  }, [typedValue, parsedTags]);

  const shouldShowDropdown = dropdownOpen && (filteredSuggestions.length > 0 || showCustomAddOption);

  return (
    <div ref={containerRef} className="relative space-y-1.5 w-full col-span-2">
      {label && (
        <label className="text-xs font-bold text-text-secondary block">
          {label} {labelInfo && <span className="text-text-muted">{labelInfo}</span>}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex flex-wrap gap-1.5 items-center pl-3.5 pr-10 py-1.5 min-h-[40px] rounded-xl border bg-bg-base text-text-primary outline-none transition-colors w-full cursor-text relative",
          dropdownOpen ? "border-accent-primary ring-1 ring-accent-primary" : "border-border-default hover:border-border-subtle"
        )}
      >
        {parsedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 bg-accent-primary/10 text-accent-primary text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0 border border-accent-primary/20"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePresetTag(tag);
              }}
              className="text-accent-primary/60 hover:text-accent-primary hover:bg-accent-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          placeholder={parsedTags.length === 0 ? placeholder : ""}
          value={typedValue}
          onFocus={() => setDropdownOpen(true)}
          onBlur={handleInputBlur}
          onChange={(e) => {
            const val = e.target.value;
            if (val.includes(",")) {
              const parts = val.split(",");
              const newTagsToAppend = parts
                .slice(0, -1)
                .map((p) => p.trim())
                .filter((p) => p.length > 0 && !parsedTags.includes(p));

              if (newTagsToAppend.length > 0) {
                const updated = [...parsedTags, ...newTagsToAppend];
                onChange(updated.join(", "));
              }
              setTypedValue(parts[parts.length - 1]);
            } else {
              setTypedValue(val);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const cleanVal = typedValue.trim();
              if (cleanVal) {
                if (!parsedTags.includes(cleanVal)) {
                  const updated = [...parsedTags, cleanVal];
                  onChange(updated.join(", "));
                }
                setTypedValue("");
              }
            } else if (e.key === "Backspace" && !typedValue && parsedTags.length > 0) {
              const updated = parsedTags.slice(0, -1);
              onChange(updated.join(", "));
            }
          }}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-text-primary text-sm h-7 focus:ring-0 focus:outline-none p-0"
        />

        {suggestions.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            className="absolute right-3 text-text-muted hover:text-text-secondary focus:outline-none cursor-pointer"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", dropdownOpen && "rotate-180")} />
          </button>
        )}
      </div>

      {shouldShowDropdown && (
        <div className="absolute top-full left-0 w-full mt-1.5 bg-bg-surface border border-border-default rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto custom-scrollbar p-2.5 space-y-1.5">
          {suggestions.length > 0 && (
            <span className="text-[10px] font-bold text-text-muted px-2 py-0.5 block uppercase tracking-wider">
              Select Suggested Values
            </span>
          )}

          <div className="grid grid-cols-2 gap-1.5 p-1">
            {showCustomAddOption && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addCustomTag(typedValue)}
                className="col-span-2 flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-left bg-accent-primary/5 hover:bg-accent-primary/10 text-accent-primary transition-colors cursor-pointer border border-dashed border-accent-primary/20"
              >
                <span className="text-lg leading-none font-bold">+</span>
                <span>Add custom entry &ldquo;{typedValue.trim()}&rdquo;</span>
              </button>
            )}

            {filteredSuggestions.length === 0 && !showCustomAddOption && (
              <span className="col-span-2 text-xs text-text-muted text-center py-2">
                No items found. Type and press enter to add one.
              </span>
            )}

            {filteredSuggestions.map((tag) => {
              const isSelected = parsedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => togglePresetTag(tag)}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer",
                    isSelected
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "hover:bg-bg-elevated text-text-secondary hover:text-text-primary"
                  )}
                >
                  <div className={cn(
                    "h-3.5 w-3.5 rounded border flex items-center justify-center transition-colors shrink-0",
                    isSelected
                      ? "border-accent-primary bg-accent-primary text-white"
                      : "border-border-default bg-bg-base"
                  )}>
                    {isSelected && <span className="text-[8px] font-extrabold leading-none">✓</span>}
                  </div>
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
