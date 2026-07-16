"use client";

import * as React from "react";
import { Upload, X, Loader2, Link as LinkIcon, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { applyWatermark } from "@/lib/watermark";

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  watermark?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label,
  required = false,
  watermark = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [mode, setMode] = React.useState<"upload" | "url">("upload");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const uploadFileToR2 = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(5);

      const response = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: 'images',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get presigned URL from server.');
      }

      const data = await response.json();
      if (data.status !== 'success' || !data.uploadUrl || !data.publicUrl) {
        throw new Error(data.message || 'Invalid upload credentials response.');
      }

      const { uploadUrl, publicUrl } = data;
      setUploadProgress(20);

      return new Promise<string | null>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 75) + 20; // scale 20% to 95%
            setUploadProgress(percentage);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 201) {
            setUploadProgress(100);
            resolve(publicUrl);
          } else {
            reject(new Error(`Storage server rejected upload with status ${xhr.status}.`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network connectivity issue during upload.'));
        };

        xhr.send(file);
      });
    } catch (error) {
      console.error('[ImageUploader R2 Upload Error]', error);
      toast.error('Image upload failed', {
        description: error instanceof Error ? error.message : 'Please check your connection and try again.',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (watermark) {
      file = await applyWatermark(file);
    }

    const publicUrl = await uploadFileToR2(file);
    if (publicUrl) {
      onChange(publicUrl);
      toast.success("Image uploaded successfully");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    let file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (watermark) {
      file = await applyWatermark(file);
    }

    const publicUrl = await uploadFileToR2(file);
    if (publicUrl) {
      onChange(publicUrl);
      toast.success("Image uploaded successfully");
    }
  };

  const clearImage = () => {
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
        
        {/* Toggle between upload and text link mode */}
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
            // Image Preview Card
            <div className="relative border border-border-default rounded-xl overflow-hidden bg-bg-surface group aspect-video flex items-center justify-center max-h-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={value} 
                alt={label} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-neutral-100 text-neutral-800 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Change Image"
                >
                  <Upload className="h-4 w-4 text-text-primary" />
                </button>
                <button
                  type="button"
                  onClick={clearImage}
                  className="bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Remove Image"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            // Upload Drag Drop Area
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
                    <span className="text-xs font-bold text-text-primary">Uploading image...</span>
                    <div className="w-24 bg-border-default h-1 rounded-full overflow-hidden mt-1 mx-auto">
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
                    <Upload className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-text-primary block">Click to upload or drag & drop</span>
                    <span className="text-[10px] text-text-muted">PNG, JPG or WEBP up to 5MB</span>
                  </div>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        // URL Input Box with minor preview
        <div className="space-y-2 w-full">
          <div className="relative flex items-center">
            <LinkIcon className="absolute left-3.5 h-4 w-4 text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Paste image URL link here..."
              value={value.startsWith("blob:") ? "" : value} // Clear preview of blob URLs in URL mode
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 pl-10 pr-10 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
            />
            {value && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute right-3.5 text-text-muted hover:text-text-secondary cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {value && !value.startsWith("blob:") && (
            <div className="relative border border-border-default rounded-xl overflow-hidden bg-bg-surface h-20 max-w-[160px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={value} 
                alt="URL Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
