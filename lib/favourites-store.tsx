"use client";

import * as React from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────

interface FavouritesContextValue {
  savedIds: Set<string>;
  isLoading: boolean;
  isSaved: (propertyId: string) => boolean;
  toggle: (propertyId: string, propertyTitle?: string) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────

const FavouritesContext = React.createContext<FavouritesContextValue>({
  savedIds: new Set(),
  isLoading: true,
  isSaved: () => false,
  toggle: async () => {},
});

// ─── Provider ─────────────────────────────────────────────

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await fetch("/api/users/me/saved", { cache: "no-store" });
        if (res.status === 401) {
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        if (data.status === "success" && Array.isArray(data.data)) {
          setSavedIds(new Set(data.data.map((p: { id: string }) => p.id)));
        }
      } catch {
        // silently ignore
      } finally {
        setIsLoading(false);
      }
    }
    fetchSaved();
  }, []);

  const isSaved = React.useCallback(
    (propertyId: string) => savedIds.has(propertyId),
    [savedIds]
  );

  const toggle = React.useCallback(
    async (propertyId: string, propertyTitle?: string) => {
      const alreadySaved = savedIds.has(propertyId);

      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (alreadySaved) next.delete(propertyId);
        else next.add(propertyId);
        return next;
      });

      try {
        let res: Response;
        if (alreadySaved) {
          res = await fetch(`/api/users/me/saved/${propertyId}`, { method: "DELETE" });
        } else {
          res = await fetch("/api/users/me/saved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ propertyId }),
          });
        }

        if (res.status === 401) {
          // Revert
          setSavedIds((prev) => {
            const next = new Set(prev);
            if (alreadySaved) next.add(propertyId);
            else next.delete(propertyId);
            return next;
          });
          toast.error("Sign in to save properties", {
            description: "Create a free account to save and manage your favourite listings.",
            action: {
              label: "Sign In",
              onClick: () => {
                window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
              },
            },
          });
          return;
        }

        const data = await res.json();
        if (data.status !== "success") throw new Error(data.message || "Failed");

        if (alreadySaved) {
          toast.success("Removed from saved", {
            description: propertyTitle ? `"${propertyTitle}" removed from your saved list.` : undefined,
          });
        } else {
          toast.success("Saved to favourites ❤️", {
            description: propertyTitle ? `"${propertyTitle}" added to your saved list.` : undefined,
            action: {
              label: "View Saved",
              onClick: () => { window.location.href = "/dashboard/saved"; },
            },
          });
        }
      } catch {
        // Revert
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (alreadySaved) next.add(propertyId);
          else next.delete(propertyId);
          return next;
        });
        toast.error("Something went wrong", {
          description: "Could not update saved status. Please try again.",
        });
      }
    },
    [savedIds]
  );

  const value = React.useMemo(
    () => ({ savedIds, isLoading, isSaved, toggle }),
    [savedIds, isLoading, isSaved, toggle]
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  return React.useContext(FavouritesContext);
}
