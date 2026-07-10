"use client";

import * as React from "react";
import { Heart, GitCompareArrows, Printer, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavourites } from "@/lib/favourites-store";
import { addToCompare, removeFromCompare, isInCompare } from "@/lib/compare-store";
import { toast } from "sonner";

interface PropertyDetailActionsProps {
  propertyId: string;
  propertyTitle: string;
  propertySlug: string;
  propertyImage: string;
  propertyPrice: string;
}

export function PropertyDetailActions({
  propertyId,
  propertyTitle,
  propertySlug,
  propertyImage,
  propertyPrice,
}: PropertyDetailActionsProps) {
  const { isSaved, toggle } = useFavourites();
  const [inCompare, setInCompare] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [savePending, setSavePending] = React.useState(false);

  // Sync compare state from localStorage
  React.useEffect(() => {
    setInCompare(isInCompare(propertyId));
    const onchange = () => setInCompare(isInCompare(propertyId));
    window.addEventListener("comparechange", onchange);
    return () => window.removeEventListener("comparechange", onchange);
  }, [propertyId]);

  const handleSave = async () => {
    if (savePending) return;
    setSavePending(true);
    await toggle(propertyId, propertyTitle);
    setSavePending(false);
  };

  const handleCompare = () => {
    if (inCompare) {
      removeFromCompare(propertyId);
      toast.success("Removed from compare");
    } else {
      const result = addToCompare({
        id: propertyId,
        slug: propertySlug,
        title: propertyTitle,
        image: propertyImage,
        price: propertyPrice,
      });
      if (!result.success) {
        toast.error("Compare limit reached", { description: result.message });
      } else {
        toast.success("Added to compare ⇄", {
          description: "Open the compare bar at the bottom to compare listings.",
        });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied!", { description: "Property URL copied to clipboard." });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const saved = isSaved(propertyId);

  const actions = [
    {
      id: "save",
      label: saved ? "Saved" : "Save",
      icon: Heart,
      iconClass: cn("h-4 w-4 transition-all duration-200", saved ? "fill-state-error text-state-error" : ""),
      onClick: handleSave,
      active: saved,
      activeClass: "border-state-error/30 text-state-error bg-state-error/5 hover:bg-state-error/10",
    },
    {
      id: "compare",
      label: inCompare ? "In Compare" : "Compare",
      icon: GitCompareArrows,
      iconClass: cn("h-4 w-4 transition-all duration-200", inCompare ? "text-accent-primary" : ""),
      onClick: handleCompare,
      active: inCompare,
      activeClass: "border-accent-primary/30 text-accent-primary bg-accent-primary/5 hover:bg-accent-primary/10",
    },
    {
      id: "print",
      label: "Print",
      icon: Printer,
      iconClass: "h-4 w-4",
      onClick: handlePrint,
      active: false,
      activeClass: "",
    },
    {
      id: "share",
      label: copied ? "Copied!" : "Share",
      icon: copied ? Check : Share2,
      iconClass: cn("h-4 w-4 transition-all duration-200", copied ? "text-state-success" : ""),
      onClick: handleShare,
      active: copied,
      activeClass: "border-state-success/30 text-state-success bg-state-success/5",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold",
              "border-border-default bg-bg-surface text-text-secondary",
              "hover:border-border-subtle hover:bg-bg-elevated hover:text-text-primary",
              "transition-all duration-200 active:scale-95 select-none",
              action.active && action.activeClass
            )}
          >
            <Icon className={action.iconClass} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
