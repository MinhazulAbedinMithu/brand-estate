"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Heart, Share2, Video, Play, Compass, X, ChevronLeft, ChevronRight, GitCompareArrows, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFavourites } from "@/lib/favourites-store";
import { addToCompare, removeFromCompare, isInCompare } from "@/lib/compare-store";
import { toast } from "sonner";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  category: string;
  transactionType: string;
  videoTourUrl: string | null;
  virtualTourUrl: string | null;
  propertyId?: string;
  propertySlug?: string;
  propertyPrice?: string;
}

export function PropertyGallery({
  images,
  title,
  category,
  transactionType,
  videoTourUrl,
  virtualTourUrl,
  propertyId,
  propertySlug,
  propertyPrice,
}: PropertyGalleryProps) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [isCopied, setIsCopied] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);
  const [virtualOpen, setVirtualOpen] = React.useState(false);
  const [inCompare, setInCompare] = React.useState(false);
  const { isSaved, toggle } = useFavourites();

  const saved = propertyId ? isSaved(propertyId) : false;

  React.useEffect(() => {
    if (!propertyId) return;
    setInCompare(isInCompare(propertyId));
    const onchange = () => setInCompare(isInCompare(propertyId));
    window.addEventListener("comparechange", onchange);
    return () => window.removeEventListener("comparechange", onchange);
  }, [propertyId]);

  const handleSave = () => {
    if (!propertyId) return;
    toggle(propertyId, title);
  };

  const handleCompare = () => {
    if (!propertyId || !propertySlug) return;
    if (inCompare) {
      removeFromCompare(propertyId);
      toast.success("Removed from compare");
    } else {
      const result = addToCompare({
        id: propertyId,
        slug: propertySlug,
        title,
        image: images[0] ?? "",
        price: propertyPrice ?? "",
      });
      if (!result.success) {
        toast.error("Compare limit reached", { description: result.message });
      } else {
        toast.success("Added to compare ⇄");
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Helper to extract clean youtube/vimeo embed URLs or render as-is
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="relative w-full bg-accent-navy select-none">
      {/* Primary Display */}
      <div className="relative h-[45vh] sm:h-[60vh] w-full overflow-hidden flex items-center justify-center">
        {images.length > 0 ? (
          <img
            src={images[activeIdx]}
            alt={`${title} - Gallery Image ${activeIdx + 1}`}
            className="h-full w-full object-cover transition-all duration-700 ease-in-out"
          />
        ) : (
          <div className="h-full w-full bg-bg-elevated flex items-center justify-center">
            <span className="text-text-muted">No images available</span>
          </div>
        )}

        {/* Dark subtle overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges (Left) */}
        <div className="absolute top-5 left-5 flex gap-2 z-10">
          <span className="bg-white/90 backdrop-blur-md text-accent-navy text-[11px] px-3.5 py-1 rounded-full font-bold uppercase tracking-wider shadow">
            {category.replace("_", " ")}
          </span>
          <span className="bg-accent-primary text-white text-[11px] px-3.5 py-1 rounded-full font-bold uppercase tracking-wider shadow">
            {transactionType.replace("_", " ")}
          </span>
        </div>

        {/* Top Actions (Right) */}
        <div className="absolute top-5 right-5 flex gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white hover:bg-black/60 hover:text-white transition-all shadow-md active:scale-95"
            aria-label="Share property"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          {isCopied && (
            <div className="absolute top-12 right-0 bg-accent-navy border border-border-default/20 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg animate-fade-in whitespace-nowrap">
              Link Copied!
            </div>
          )}

          {propertyId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCompare}
              className={cn(
                "h-10 w-10 rounded-full backdrop-blur-md border transition-all shadow-md active:scale-95",
                inCompare
                  ? "bg-accent-primary/30 border-accent-primary/50 text-accent-primary hover:bg-accent-primary/40 hover:text-accent-primary"
                  : "bg-black/40 border-white/15 text-white hover:bg-black/60 hover:text-white"
              )}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            >
              <GitCompareArrows className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.print()}
            className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white hover:bg-black/60 hover:text-white transition-all shadow-md active:scale-95"
            aria-label="Print property"
          >
            <Printer className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={cn(
              "h-10 w-10 rounded-full backdrop-blur-md border transition-all shadow-md active:scale-95",
              saved
                ? "bg-state-error/20 border-state-error/40 text-state-error hover:bg-state-error/30 hover:text-state-error"
                : "bg-black/40 border-white/15 text-white hover:bg-black/60 hover:text-white"
            )}
            aria-label={saved ? "Saved to favourites" : "Save to favourites"}
          >
            <Heart className={cn("h-4 w-4 transition-all", saved ? "fill-state-error" : "")} />
          </Button>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-black/50 transition-all z-10 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-black/50 transition-all z-10 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Media Tour Overlays (Bottom) */}
        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end gap-4 z-10">
          <div className="flex gap-2">
            {virtualTourUrl && (
              <Button
                onClick={() => setVirtualOpen(true)}
                className="bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                <Compass className="h-4 w-4 animate-spin-slow" />
                3D Virtual Tour
              </Button>
            )}

            {videoTourUrl && (
              <Button
                onClick={() => setVideoOpen(true)}
                className="bg-white/95 text-accent-navy hover:bg-white hover:text-accent-primary text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                <Play className="h-4 w-4 fill-current" />
                Video Tour
              </Button>
            )}
          </div>

          <div className="bg-black/50 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-inner">
            {activeIdx + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="w-full bg-accent-navy/95 border-b border-border-default/10 py-3.5 px-4">
          <div className="max-w-7xl mx-auto flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "relative aspect-4/3 w-20 sm:w-28 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200",
                  idx === activeIdx
                    ? "border-accent-primary scale-95 opacity-100 shadow-lg shadow-accent-primary/20"
                    : "border-transparent opacity-65 hover:opacity-90 hover:scale-95"
                )}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoTourUrl && (
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-border-default/10 rounded-3xl">
            <DialogHeader className="sr-only">
              <DialogTitle>Video Tour</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video w-full">
              <iframe
                src={getEmbedUrl(videoTourUrl)}
                title="Property Video Tour"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Virtual Tour Modal */}
      {virtualTourUrl && (
        <Dialog open={virtualOpen} onOpenChange={setVirtualOpen}>
          <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black border-border-default/10 rounded-3xl">
            <DialogHeader className="sr-only">
              <DialogTitle>3D Virtual Tour</DialogTitle>
            </DialogHeader>
            <div className="relative h-[65vh] w-full bg-accent-navy">
              <iframe
                src={virtualTourUrl}
                title="Property 3D Virtual Tour"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
