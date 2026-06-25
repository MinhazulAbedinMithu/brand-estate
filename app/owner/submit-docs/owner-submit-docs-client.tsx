"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, UploadCloud, CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export function OwnerSubmitDocsClient() {
  const router = useRouter();
  const { currentUser, submitLegalDocs } = useAuth();
  
  const [license, setLicense] = React.useState("");
  const [agency, setAgency] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = React.useState("");
  
  // Progress states
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [uploadComplete, setUploadComplete] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-redirect if already active or pending
  React.useEffect(() => {
    if (currentUser && currentUser.status === "active") {
      toast.info("Account already active", { description: "Your credentials have already been verified." });
      router.push("/owner/dashboard");
    }
  }, [currentUser, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      startR2Upload(selectedFile);
    }
  };

  const startR2Upload = async (selectedFile: File) => {
    setUploading(true);
    setProgress(5);
    setUploadComplete(false);
    setUploadedUrl("");

    try {
      const res = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
          folder: 'owners/documents'
        })
      });

      if (!res.ok) throw new Error('Authorization or server permission error.');
      const data = await res.json();
      if (data.status !== 'success' || !data.uploadUrl || !data.publicUrl) {
        throw new Error(data.message || 'Failed to acquire upload parameters.');
      }

      const { uploadUrl, publicUrl } = data;
      setProgress(20);

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', selectedFile.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 75) + 20; // 20% to 95%
          setProgress(percentage);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setProgress(100);
          setUploading(false);
          setUploadComplete(true);
          setUploadedUrl(publicUrl);
          toast.success("Document uploaded successfully", { description: "File is ready for verification submission." });
        } else {
          setUploading(false);
          toast.error("Upload failed", { description: `R2 endpoint rejected the file with status: ${xhr.status}` });
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        toast.error("Upload failed", { description: "Network error occurred during document upload." });
      };

      xhr.send(selectedFile);
    } catch (err) {
      console.error('[Document R2 Upload Error]', err);
      setUploading(false);
      toast.error("Upload failed", { description: err instanceof Error ? err.message : "Error uploading document to storage." });
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!license.trim() || !agency.trim() || !uploadComplete || !file || !uploadedUrl) {
      toast.error("Form incomplete", { description: "Please complete all fields and upload verification documentation." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitLegalDocs(license, agency, uploadedUrl);
      if (res.success) {
        toast.success("Documents submitted!", {
          description: "Your registration status is now pending administrator approval.",
        });
        router.push("/owner/dashboard");
      } else {
        toast.error("Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting documents");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-border-default pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
          Verify Owner Credentials
        </h1>
        <p className="text-xs text-text-muted font-medium font-body mt-1">
          Submit official land or property documentation to unlock property creation capabilities on the network.
        </p>
      </div>

      {/* Info Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-xs text-text-secondary flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-text-primary">Mandatory Review Period</p>
          <p className="leading-relaxed font-medium">
            After clicking submit, your account status will enter a <span className="text-amber-500 font-bold">Pending Review</span> state. Administrators will audit the files within 24 hours. Property listings remain locked until active approval.
          </p>
        </div>
      </div>

      {/* Submission Card Form */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* License */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Land / Property Document Number *
            </label>
            <Input
              placeholder="e.g. LAND-99881-22A"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
              required
            />
          </div>

          {/* Agency */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Property Address / Owner Entity Name *
            </label>
            <Input
              placeholder="e.g. 742 Evergreen Terrace / Springfield Holdings"
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
              required
            />
          </div>

          {/* File Upload Dropzone */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Ownership Documentation (PDF/Image) *
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,image/png,image/jpeg"
              className="hidden"
            />

            {!file ? (
              <div 
                onClick={triggerFileSelect}
                className="border-2 border-dashed border-border-default hover:border-accent-primary rounded-2xl p-8 bg-bg-alt/40 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-text-primary">Click to select files</h4>
                  <p className="text-[10px] text-text-muted leading-normal max-w-xs font-semibold">
                    Support PDF, JPG, or PNG files up to 10MB.
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-border-default rounded-2xl p-4 bg-bg-alt/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-xl bg-accent-primary-dim text-accent-primary flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-text-primary truncate">{file.name}</p>
                    <p className="text-[10px] text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {uploading && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-accent-primary font-bold">{progress}%</span>
                      <Loader2 className="h-4.5 w-4.5 text-accent-primary animate-spin" />
                    </div>
                  )}
                  {uploadComplete && (
                    <div className="flex items-center gap-1.5 text-state-success">
                      <span className="text-[10px] font-bold">Uploaded</span>
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {uploading && (
              <div className="h-1.5 w-full rounded-full bg-bg-elevated overflow-hidden mt-1">
                <div 
                  className="h-full rounded-full bg-accent-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Submit Control */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={submitting || !license.trim() || !agency.trim() || !uploadComplete}
              className="w-full h-11 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold text-[13px] shadow-sm transition-all duration-200"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting files...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Submit for Approval
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>

        </form>
      </div>

    </div>
  );
}
