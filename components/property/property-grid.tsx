import * as React from "react";
import { PropertyCard } from "./property-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { MockProperty } from "@/src/mocks/propertyTypes";
import type { ViewMode } from "@/lib/property-search-params";
import { cn } from "@/lib/utils";

interface PropertyGridProps {
  properties: MockProperty[];
  view?: ViewMode;
  className?: string;
}

export function PropertyGrid({ properties, view = "grid", className }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties match your search"
        message="Try broadening your search — remove some filters, adjust the price range, or search a different city."
        actionLabel="Clear All Filters"
        actionHref="/properties"
        className={className}
      />
    );
  }

  if (view === "list") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} variant="list" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6",
        className
      )}
    >
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} variant="grid" />
      ))}
    </div>
  );
}
