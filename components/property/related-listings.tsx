import * as React from "react";
import { connectDB } from "@/lib/db/mongoose";
import { Property, IProperty } from "@/lib/db/models/property.model";
import { PropertyCard } from "./property-card";
import type { PropertyCategory, MockProperty } from "@/src/mocks/propertyTypes";
import { cn } from "@/lib/utils";

interface RelatedListingsProps {
  currentId: string;
  category: PropertyCategory;
  className?: string;
}

export async function RelatedListings({ currentId, category, className }: RelatedListingsProps) {
  await connectDB();
  
  // Exclude current listing, filter by category and active status
  const query: Record<string, unknown> = { status: "active", propertyCategory: category };
  if (currentId && currentId.length === 24) {
    query._id = { $ne: currentId };
  }

  const relatedDocs = await Property.find(query).limit(4).lean();

  const related = (relatedDocs as unknown as IProperty[]).map((p) => ({
    ...p,
    id: p._id.toString(),
    ownerId: p.ownerId.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  })) as unknown as MockProperty[];

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
