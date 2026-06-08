"use client";

import * as React from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  currentLocation: string;
  isLoading: boolean;
  onClick: () => void;
}

export function LocationSelector({
  currentLocation,
  isLoading,
  onClick,
}: LocationSelectorProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="group flex items-center gap-1.5 h-9 px-2.5 sm:px-4 rounded-full border border-border-default/60 bg-bg-elevated/40 hover:bg-bg-elevated/80 hover:border-border-default hover:text-text-primary text-xs font-semibold text-text-secondary transition-all duration-300 shadow-xs hover:shadow-sm cursor-pointer"
      aria-label="Select location"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-primary" />
      ) : (
        <MapPin className="h-3.5 w-3.5 text-accent-primary animate-pulse transition-transform duration-300 group-hover:scale-110" />
      )}
      <span className="hidden sm:inline max-w-[100px] sm:max-w-[130px] truncate tracking-wide font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
        {isLoading ? "Locating..." : currentLocation || "Select Location"}
      </span>
    </Button>
  );
}
