import * as React from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { AlertCircle } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-bg-base px-4">
      <div className="max-w-md w-full">
        <EmptyState
          title="Listing Not Found"
          message="We couldn't locate the property you're looking for. It might have been sold, rented, or removed from the catalog."
          actionLabel="Return to Property Search"
          actionHref="/properties"
          icon={<AlertCircle className="h-8 w-8 text-state-error" />}
          className="border-border-default bg-bg-surface shadow-lg rounded-3xl"
        />
      </div>
    </div>
  );
}
