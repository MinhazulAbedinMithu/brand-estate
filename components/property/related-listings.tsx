import * as React from "react";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { getRelatedListings } from "@/lib/property-filters";
import { PropertyCard } from "./property-card";
import type { PropertyCategory } from "@/src/mocks/propertyTypes";
import { cn } from "@/lib/utils";

interface RelatedListingsProps {
  currentId: string;
  category: PropertyCategory;
  className?: string;
}

export function RelatedListings({ currentId, category, className }: RelatedListingsProps) {
  const related = getRelatedListings(mockProperties, currentId, category, 4);

  if (related.length === 0) return null;

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-2xl font-bold font-heading text-text-primary">
          Related Properties
        </h3>
        <p className="text-sm text-text-muted mt-1 font-body">
          Similar listings in the same category that might interest you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            variant="grid"
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
}
