"use client";

import * as React from "react";
import { Video, Upload, X, Loader2, Link as LinkIcon, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { applyVideoWatermark } from "@/lib/watermark";

interface VideoUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
}

export function VideoUploader({
  value,
  onChange,
  label,
  required = false,
}: VideoUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [mode, setMode] = React.useState<"upload" | "url">("upload");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateAndUpload = async (file: File) => {
    // 1. Basic Type Validation
    if (!file.type.startsWith("video/")) {
      toast.error("Invalid file format", { description: "Please upload a valid video file." });
      return;
    }

    // 2. Size Validation (Max 70MB)
    const MAX_SIZE_BYTES = 70 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File is too large", { description: "Maximum allowed video size is 70MB." });
      return;
    }

    // 3. Duration Validation & Watermarking (Max 2 Minutes)
    let watermarkedFile = file;
    try {
      setIsUploading(true);
      setUploadProgress(2);

      const duration = await new Promise<number>((resolve, reject) => {
        const videoElement = document.createElement("video");
        videoElement.preload = "metadata";
        
        const objectUrl = URL.createObjectURL(file);
        
        videoElement.onloadedmetadata = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(videoElement.duration);
        };
        
        videoElement.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Failed to load video metadata."));
        };
        
        videoElement.src = objectUrl;
      });

      if (duration > 120) {
        toast.error("Video is too long", { description: "Maximum video duration allowed is 2 minutes." });
        setIsUploading(false);
        return;
      }

      // Apply watermark client-side using MediaRecorder
      setUploadProgress(5);
      watermarkedFile = await applyVideoWatermark(file, (pct) => {
        // scale watermarking progress from 5% to 40%
        const watermarkProgress = Math.round(5 + (pct * 0.35));
        setUploadProgress(watermarkProgress);
      });
    } catch (err) {
      console.error("[Video Metadata Verification Failed]", err);
      toast.error("Validation error", { description: "Could not read video length metadata." });
      setIsUploading(false);
      return;
    }

    // 4. Cloud Upload via Presigned URL
    try {
      setUploadProgress(42);
      
      const response = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: watermarkedFile.name,
          contentType: watermarkedFile.type,
          folder: "listings/videos",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch presigned URL.");
      }

      const data = await response.json();
      if (data.status !== "success" || !data.uploadUrl || !data.publicUrl) {
        throw new Error(data.message || "Invalid presigned response.");
      }

      const { uploadUrl, publicUrl } = data;
      setUploadProgress(45);

      const uploadedUrl = await new Promise<string | null>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", watermarkedFile.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            // scale upload progress from 45% to 95%
            const pct = Math.round((event.loaded / event.total) * 50) + 45;
            setUploadProgress(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 201) {
            setUploadProgress(100);
            resolve(publicUrl);
          } else {
            reject(new Error(`Server returned status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network connection error during upload."));
        };

        xhr.send(watermarkedFile);
      });

      if (uploadedUrl) {
        onChange(uploadedUrl);
        toast.success("Video uploaded successfully");
      }
    } catch (err) {
      console.error("[Video R2 Upload Error]", err);
      toast.error("Video upload failed", {
        description: err instanceof Error ? err.message : "Please verify your connectivity and try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await validateAndUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await validateAndUpload(file);
  };

  const clearVideo = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-text-secondary">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        
        {/* Toggle Mode */}
        <div className="flex bg-bg-elevated border border-border-default/50 rounded-lg p-0.5 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={cn(
              "px-2 py-0.5 rounded cursor-pointer transition-colors",
              mode === "upload" 
                ? "bg-bg-surface text-accent-primary shadow-sm" 
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "px-2 py-0.5 rounded cursor-pointer transition-colors",
              mode === "url" 
                ? "bg-bg-surface text-accent-primary shadow-sm" 
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            URL Link
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="w-full">
          {value ? (
            /* Video Preview Player Box */
            <div className="relative border border-border-default rounded-xl overflow-hidden bg-bg-surface group aspect-video flex flex-col items-center justify-center max-h-56">
              <video 
                src={value} 
                controls 
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-neutral-100 text-neutral-800 p-2 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Change Video"
                >
                  <Upload className="h-3.5 w-3.5 text-text-primary" />
                </button>
                <button
                  type="button"
                  onClick={clearVideo}
                  className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Remove Video"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Drag Drop Area */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed border-border-default hover:border-accent-primary rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-bg-base transition-all h-36 relative overflow-hidden group hover:shadow-md",
                isUploading && "pointer-events-none"
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-2.5 text-center">
                  <Loader2 className="h-7 w-7 text-accent-primary animate-spin" />
                  <div>
                    <span className="text-xs font-bold text-text-primary">Uploading video...</span>
                    <div className="w-28 bg-border-default h-1 rounded-full overflow-hidden mt-1 mx-auto">
                      <div 
                        className="bg-accent-primary h-full transition-all duration-200" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-9 w-9 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
                    <Video className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-text-primary block">Click to upload or drag & drop video</span>
                    <span className="text-[10px] text-text-muted">MP4, WebM or OGG up to 70MB (max 2 min)</span>
                  </div>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        /* URL Input Box */
        <div className="space-y-2 w-full">
          <div className="relative flex items-center">
            <LinkIcon className="absolute left-3.5 h-4 w-4 text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Paste video tour URL link here..."
              value={value.startsWith("blob:") || value.includes("listings/videos") ? "" : value} // Clear preview of upload URLs in URL mode
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 pl-10 pr-10 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
            />
            {value && (
              <button
                type="button"
                onClick={clearVideo}
                className="absolute right-3.5 text-text-muted hover:text-text-secondary cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {value && !value.includes("listings/videos") && (
            <div className="text-[10px] text-text-muted font-medium text-left">
              External Video Link Preview: <span className="font-bold text-text-secondary underline break-all">{value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
