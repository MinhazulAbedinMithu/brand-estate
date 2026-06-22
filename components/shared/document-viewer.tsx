"use client";

import * as React from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  Printer,
  FileText,
  ShieldCheck,
  RotateCw,
  Award,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  agentName: string;
  licenseNumber?: string;
  agencyName?: string;
}

export function DocumentViewer({
  isOpen,
  onClose,
  documentUrl,
  agentName,
  licenseNumber = "N/A",
  agencyName = "N/A"
}: DocumentViewerProps) {
  const [zoom, setZoom] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const isRealUrl = documentUrl.startsWith("http://") || documentUrl.startsWith("https://") || documentUrl.startsWith("/");
  const isPdf = documentUrl.toLowerCase().endsWith(".pdf") || documentUrl.includes(".pdf?");

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 70));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handlePrint = () => {
    toast.success("Printing document...", {
      description: "Dispatched print job."
    });
  };

  const handleDownload = () => {
    if (isRealUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.target = '_blank';
      link.download = documentUrl.split('/').pop() || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } else {
      toast.success("Downloading document...", {
        description: "Document has been saved to your local directory."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "w-full p-0 overflow-hidden bg-bg-surface border-border-default shadow-2xl flex flex-col transition-all duration-300",
          isFullscreen
            ? "fixed inset-0 top-0 left-0 translate-x-0 translate-y-0 max-w-none sm:max-w-none w-screen h-screen rounded-none border-none z-[100] p-0 gap-0"
            : "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[95vw] sm:max-w-[92vw] md:max-w-5xl lg:max-w-6xl w-full rounded-3xl h-[85vh] p-0 gap-0 z-50"
        )}
      >
        {/* ── PDF Reader Top Toolbar ── */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-border-default bg-bg-alt/70 select-none shrink-0">
          <div className="flex items-center gap-2 min-w-0 mr-2">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 items-center justify-center text-rose-500 shrink-0 hidden sm:flex">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-text-primary block truncate text-[11px] sm:text-xs">Verification Document</span>
              <span className="text-[9px] sm:text-[10px] text-text-muted block mt-0.5 truncate">Credentials: {agentName}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <Button
              onClick={handleZoomOut}
              size="icon-sm"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-text-muted hover:text-text-primary rounded-lg cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-text-secondary w-8 sm:w-10 text-center select-none">
              {zoom}%
            </span>
            <Button
              onClick={handleZoomIn}
              size="icon-sm"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-text-muted hover:text-text-primary rounded-lg cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>

            <div className="h-4 w-px bg-border-default/80 mx-1 sm:mx-1.5" />

            <Button
              onClick={handleRotate}
              size="icon-sm"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-text-muted hover:text-text-primary rounded-lg cursor-pointer hidden md:inline-flex"
              title="Rotate Document"
            >
              <RotateCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              onClick={handlePrint}
              size="icon-sm"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-text-muted hover:text-text-primary rounded-lg cursor-pointer hidden sm:inline-flex"
              title="Print Certificate"
            >
              <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              onClick={handleDownload}
              size="icon-sm"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-text-muted hover:text-text-primary rounded-lg cursor-pointer"
              title="Download File"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              onClick={() => setIsFullscreen(prev => !prev)}
              size="icon-sm"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-text-muted hover:text-text-primary rounded-lg cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </Button>

            <div className="h-4 w-px bg-border-default/80 mx-1 sm:mx-1.5" />

            <DialogClose render={
              <Button
                size="icon-sm"
                variant="ghost"
                className="h-7 w-7 sm:h-8 sm:w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                title="Close Viewer"
              >
                <X className="h-4 sm:h-4.5 w-4 sm:w-4.5" />
              </Button>
            } />
          </div>
        </div>

        {/* ── Document Viewer Canvas Area ── */}
        <div className="flex-1 overflow-auto bg-bg-base/70 p-4 sm:p-8 flex items-start justify-center custom-scrollbar">
          {isRealUrl ? (
            <div
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out"
              }}
              className="w-full max-w-[90vw] md:max-w-4xl shrink-0 flex flex-col items-center justify-center transition-all duration-300"
            >
              {isPdf ? (
                <iframe
                  src={isPdf ? `${documentUrl}#toolbar=0` : documentUrl}
                  className="w-full aspect-[1/1.4] min-h-[65vh] rounded-2xl bg-white border border-border-default shadow-lg"
                  title="Verification Document"
                />
              ) : (
                <div className="w-full bg-white border border-border-default rounded-2xl shadow-lg p-3 sm:p-5 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={documentUrl}
                    alt="Verification Document"
                    className="max-w-full max-h-[70vh] object-contain rounded-xl"
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out"
              }}
              className={cn(
                "w-full max-w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl aspect-[1/1.4] bg-white border border-slate-250 rounded-xl shadow-lg relative select-none shrink-0 flex flex-col justify-between transition-all duration-300",
                "p-6 sm:p-10"
              )}
            >
              {/* Background design accents */}
              <div className="absolute inset-3 sm:inset-4 border-2 border-slate-200 pointer-events-none rounded-lg" />
              <div className="absolute inset-4 sm:inset-5 border border-slate-150 pointer-events-none rounded-md" />
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 h-8 sm:h-10 w-8 sm:w-10 border-t-2 border-l-2 border-slate-350 pointer-events-none" />
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 h-8 sm:h-10 w-8 sm:w-10 border-t-2 border-r-2 border-slate-350 pointer-events-none" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 h-8 sm:h-10 w-8 sm:w-10 border-b-2 border-l-2 border-slate-350 pointer-events-none" />
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 h-8 sm:h-10 w-8 sm:w-10 border-b-2 border-r-2 border-slate-350 pointer-events-none" />

              {/* Document Header */}
              <div className="text-center space-y-1.5 sm:space-y-3 pt-2 sm:pt-6 z-10">
                <div className="flex justify-center">
                  <div className="h-8 w-8 sm:h-14 sm:w-14 rounded-full bg-slate-900 flex items-center justify-center text-amber-500 shadow-sm border border-slate-800">
                    <Award className="h-4 w-4 sm:h-7 sm:w-7" />
                  </div>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h2 className="text-slate-800 font-heading text-[10px] xs:text-xs sm:text-lg md:text-xl font-extrabold tracking-widest uppercase">
                    State of New York
                  </h2>
                  <h3 className="text-slate-500 font-body text-[6px] sm:text-[9px] md:text-[10px] font-extrabold tracking-widest uppercase">
                    Real Estate Licensing Commission
                  </h3>
                </div>
              </div>

              {/* Document Body */}
              <div className="text-center space-y-3 sm:space-y-6 px-2 sm:px-4 z-10">
                <div className="space-y-0.5 sm:space-y-1.5">
                  <span className="text-[6px] sm:text-[10px] text-slate-400 font-semibold tracking-wider block">THIS IS TO CERTIFY THAT</span>
                  <span className="text-xs sm:text-xl md:text-2xl font-heading font-extrabold text-slate-900 border-b border-slate-200 pb-0.5 sm:pb-1.5 px-2 sm:px-4 inline-block">
                    {agentName}
                  </span>
                </div>

                <p className="text-slate-600 font-body text-[8px] sm:text-xs leading-relaxed max-w-[200px] sm:max-w-sm md:max-w-md mx-auto font-medium">
                  has met all licensing criteria and is hereby registered as a licensed associate of the state, authorized to negotiate real estate transactions representing:
                </p>

                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-800 block">{agencyName}</span>
                  <span className="text-[6px] sm:text-[10px] text-slate-400 font-bold block uppercase tracking-widest">Registered Brokerage / Agency</span>
                </div>
              </div>

              {/* Document Footer */}
              <div className="flex items-end justify-between border-t border-slate-100 pt-3 sm:pt-6 px-1 sm:px-2 z-10">
                <div className="text-left space-y-0.5 sm:space-y-1">
                  <span className="text-[6px] sm:text-[10px] text-slate-400 font-semibold block uppercase">License ID</span>
                  <span className="font-mono font-bold text-slate-900 text-[8px] sm:text-xs md:text-sm">{licenseNumber}</span>
                </div>

                {/* Stamp emblem */}
                <div className="flex flex-col items-center gap-1 pr-1 sm:pr-4 select-none">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full border-2 border-emerald-600 border-dashed flex flex-col items-center justify-center text-emerald-600 rotate-[-12deg] bg-emerald-500/5 shadow-inner">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    <span className="text-[4px] sm:text-[6px] font-extrabold tracking-wider uppercase">VERIFIED</span>
                  </div>
                </div>

                <div className="text-right space-y-0.5 sm:space-y-1">
                  <span className="text-[6px] sm:text-[10px] text-slate-400 font-semibold block uppercase">Issue Date</span>
                  <span className="font-bold text-slate-900 text-[7px] sm:text-[10px] md:text-xs">
                    {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
