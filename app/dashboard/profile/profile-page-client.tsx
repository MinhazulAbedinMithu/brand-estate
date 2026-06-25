"use client";

import * as React from "react";
import { User, Shield, Bell, AlertTriangle, Key, Mail, Phone, FileText, Check, UploadCloud, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DocumentViewer } from "@/components/shared/document-viewer";

export function ProfilePageClient() {
  const { currentUser, submitNidDocs } = useAuth();
  
  // NID form states
  const [nidNumber, setNidNumber] = React.useState(currentUser?.nidCardNumber || "");
  const [nidFile, setNidFile] = React.useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = React.useState(currentUser?.nidDocumentUrl || "");
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [uploadComplete, setUploadComplete] = React.useState(!!currentUser?.nidDocumentUrl);
  const [nidSubmitting, setNidSubmitting] = React.useState(false);
  const [showNidDocViewer, setShowNidDocViewer] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Form details states
  const [profileForm, setProfileForm] = React.useState({
    name: currentUser?.name || "Alex Johnson",
    email: currentUser?.email || "user@brandestate.com",
    phone: currentUser?.phone || "+1 (555) 234-5678",
    bio: "Passionate about finding modern, sustainable architectural properties in metropolitan areas. Looking to purchase a primary residence by late 2026.",
  });

  // Password fields state
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Preferences states
  const [preferences, setPreferences] = React.useState({
    emailReply: true,
    marketing: false,
    priceAlert: true,
    weeklyDigest: fontStyleExists(), // Check utility fallback
  });

  function fontStyleExists() {
    return true;
  }

  const [deleteInput, setDeleteInput] = React.useState("");
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const initials = profileForm.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setNidFile(selectedFile);
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
          folder: 'buyers/nid'
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
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          setUploading(false);
          setUploadComplete(true);
          setUploadedUrl(publicUrl);
          toast.success("Document uploaded successfully", { description: "File is ready for NID verification submission." });
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
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setUploading(false);
      toast.error("Upload failed", { description: error.message || "An unexpected error occurred." });
    }
  };

  const handleNidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nidNumber.trim()) {
      toast.error("Form error", { description: "Please enter your NID Card Number." });
      return;
    }
    if (!uploadedUrl) {
      toast.error("Form error", { description: "Please upload your NID document (PDF or Image)." });
      return;
    }

    setNidSubmitting(true);
    try {
      const res = await submitNidDocs(nidNumber, uploadedUrl);
      if (res.success) {
        toast.success("NID Submitted", { description: "Your identity details are now pending review." });
      } else {
        toast.error("Submission failed", { description: "Could not submit your identity details." });
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      toast.error("Submission error", { description: error.message || "Something went wrong." });
    } finally {
      setNidSubmitting(false);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Validation error", { description: "Full name is required." });
      return;
    }
    
    toast.promise(
      new Promise((r) => setTimeout(r, 1000)),
      {
        loading: "Saving profile changes...",
        success: "Profile updated successfully! 🚀",
        error: "Failed to update profile."
      }
    );
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Validation error", { description: "All password fields are required." });
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Validation error", { description: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Validation error", { description: "New passwords do not match." });
      return;
    }

    toast.promise(
      new Promise((r) => setTimeout(r, 1200)),
      {
        loading: "Updating account password...",
        success: () => {
          setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          return "Password updated successfully! Keep it secure. 🔒";
        },
        error: "Failed to update password."
      }
    );
  };

  const handleDeleteAccount = () => {
    if (deleteInput !== "DELETE") {
      toast.error("Confirmation error", { description: "Please type DELETE to confirm account removal." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDeleteOpen(false);
      toast.success("Account deleted", { description: "Your profile details have been erased from our mockup registers." });
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="border-b border-border-default/60 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
          <User className="h-5 w-5 text-accent-primary" />
          Profile Settings
        </h1>
        <p className="text-xs text-text-muted font-medium">Update public profile info and configure marketing preferences</p>
      </div>

      {/* ── Grid split layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Photo upload and quick info */}
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm space-y-6 text-center">
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer mb-4">
              <Avatar className="h-24 w-24 border-2 border-border-default">
                <AvatarFallback className="bg-accent-primary-dim text-accent-primary font-bold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-white uppercase">Upload</span>
              </div>
            </div>
            <h3 className="font-heading text-base font-bold text-text-primary">{profileForm.name}</h3>
            <p className="text-xs text-text-muted capitalize">{currentUser?.role.replace("_", " ")} Workspace</p>
          </div>

          <div className="border-t border-border-default/60 pt-4 flex flex-col gap-2.5">
            <Button size="sm" variant="outline" className="w-full h-9 rounded-xl border-border-default hover:bg-bg-elevated text-xs text-text-secondary">
              Upload New Photo
            </Button>
            <Button size="sm" variant="ghost" className="w-full h-9 rounded-xl text-xs text-text-muted hover:text-text-primary">
              Remove Photo
            </Button>
          </div>

          <div className="border-t border-border-default/60 pt-4 text-left space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Security Level</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl">
              <Shield className="h-4 w-4 shrink-0" />
              <span>Two-Factor Authentication Active</span>
            </div>
          </div>
        </div>

        {/* Right Side: Settings Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card: Identity Verification (NID) - ONLY FOR BUYERS */}
          {currentUser?.role === 'auth_user' && (
            <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
              <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-default/50 pb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent-primary" />
                National ID (NID) Verification
              </h3>

              {/* Status Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border-default bg-bg-alt/30 text-xs font-semibold">
                <span className="text-text-muted">Verification Status:</span>
                <span className={cn("font-bold uppercase text-[9px] px-2.5 py-1 rounded-full border tracking-wider",
                  currentUser.nidStatus === "verified" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                  currentUser.nidStatus === "pending" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                  currentUser.nidStatus === "rejected" ? "text-rose-500 bg-rose-500/10 border-rose-500/20" :
                  "text-slate-400 bg-slate-500/10 border-slate-500/20"
                )}>
                  {currentUser.nidStatus === "verified" ? "Approved / Verified" :
                   currentUser.nidStatus === "pending" ? "Pending Review" :
                   currentUser.nidStatus === "rejected" ? "Rejected" :
                   "Not Verified"}
                </span>
              </div>

              {currentUser.nidStatus === 'verified' && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Identity Verified via NID</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Your identity has been successfully verified. You now have full access to agent details, lister profiles, and inquiry forms.
                  </p>
                  <div className="text-xs pt-3 border-t border-emerald-500/10 grid grid-cols-2 gap-4 text-text-secondary font-medium">
                    <div>
                      <span className="text-[9px] text-text-muted uppercase tracking-wider block mb-0.5">NID Card Number</span>
                      <span className="font-mono font-bold text-text-primary">
                        {currentUser.nidCardNumber ? `${currentUser.nidCardNumber.slice(0, 4)}-XXXX-XXXX` : 'Verified'}
                      </span>
                    </div>
                    {currentUser.nidDocumentUrl && (
                      <div>
                        <span className="text-[9px] text-text-muted uppercase tracking-wider block mb-0.5">Verified Document</span>
                        <button 
                          onClick={() => setShowNidDocViewer(true)}
                          className="font-bold text-accent-primary hover:underline flex items-center gap-1 text-[11px]"
                        >
                          View Uploaded NID
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentUser.nidStatus === 'pending' && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span>Verification Pending Review</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Your National ID (NID) details have been submitted. Our administrators are currently reviewing your document. This is typically processed within 24 hours.
                  </p>
                  <div className="text-xs pt-3 border-t border-amber-500/10 grid grid-cols-2 gap-4 text-text-secondary font-medium">
                    <div>
                      <span className="text-[9px] text-text-muted uppercase tracking-wider block mb-0.5">Submitted NID Number</span>
                      <span className="font-mono font-bold text-text-primary">{currentUser.nidCardNumber}</span>
                    </div>
                    {currentUser.nidDocumentUrl && (
                      <div>
                        <span className="text-[9px] text-text-muted uppercase tracking-wider block mb-0.5">Submitted Document</span>
                        <button 
                          onClick={() => setShowNidDocViewer(true)}
                          className="font-bold text-accent-primary hover:underline flex items-center gap-1 text-[11px]"
                        >
                          View Uploaded NID
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(currentUser.nidStatus === 'unsubmitted' || currentUser.nidStatus === 'rejected') && (
                <div className="space-y-4">
                  {currentUser.nidStatus === 'rejected' && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>Verification Rejected</span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Rejection Reason: <span className="font-semibold text-rose-300">{currentUser.nidRejectionReason || 'No reason specified'}</span>. Please verify your details and upload a clear document image to resubmit.
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-text-secondary leading-relaxed">
                    To unlock agent listings, contact information, and property inquiry submissions, please provide your National ID details.
                  </p>

                  <form onSubmit={handleNidSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">NID Card Number <span className="text-rose-500">*</span></label>
                      <Input
                        placeholder="e.g. 19954712896541"
                        value={nidNumber}
                        onChange={(e) => setNidNumber(e.target.value)}
                        className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">NID Document (PDF/Image) <span className="text-rose-500">*</span></label>
                      <div className="flex flex-col gap-2">
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className={cn(
                            "flex flex-col items-center justify-center border border-dashed rounded-xl p-5 cursor-pointer bg-bg-base/30 transition-all hover:bg-bg-base/50",
                            uploadComplete ? "border-emerald-500/40 bg-emerald-500/5" : "border-border-default hover:border-accent-primary"
                          )}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*,application/pdf"
                          />
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="h-6 w-6 text-accent-primary animate-spin" />
                              <span className="text-[10px] text-text-secondary font-medium">Uploading document ({progress}%)</span>
                            </div>
                          ) : uploadComplete ? (
                            <div className="flex flex-col items-center gap-1.5">
                              <Check className="h-6 w-6 text-emerald-400" />
                              <span className="text-xs font-bold text-text-primary">NID Document Uploaded</span>
                              <span className="text-[9px] text-text-muted truncate max-w-xs">{nidFile?.name || "Uploaded document"}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <UploadCloud className="h-6 w-6 text-accent-primary" />
                              <span className="text-xs font-bold text-text-primary">Drag & drop or click to upload NID document</span>
                              <span className="text-[9px] text-text-muted">Accepts JPEG, PNG, or PDF formats</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={nidSubmitting || uploading}
                      className="w-full h-10 rounded-xl bg-accent-primary hover:bg-accent-primary/95 text-white font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      {nidSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting verification request...</span>
                        </>
                      ) : (
                        <span>Submit NID for Verification</span>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Card 1: Personal Details */}
          <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-default/50 pb-3">
              Personal Information
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Full Name</label>
                  <Input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Email Address (Read-only)</label>
                  <Input
                    value={profileForm.email}
                    disabled
                    className="h-10 rounded-xl border-border-default bg-bg-base/50 text-sm text-text-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Phone Number</label>
                  <Input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Title/Role</label>
                  <Input
                    value="Buyer / Platform Member"
                    disabled
                    className="h-10 rounded-xl border-border-default bg-bg-base/50 text-sm text-text-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Biography / Purchase Summary</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full text-sm border bg-bg-base text-text-primary border-border-default rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-6">
                  Save General Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Card 2: Password Reset */}
          <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-default/50 pb-3 flex items-center gap-2">
              <Key className="h-4 w-4 text-accent-primary" /> Update Password
            </h3>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Current Password</label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                  className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">New Password</label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                    placeholder="Re-type password"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-6">
                  Reset Password
                </Button>
              </div>
            </form>
          </div>

          {/* Card 3: Notifications Preference */}
          <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-default/50 pb-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent-primary" /> Notification Settings
            </h3>
            <div className="space-y-4">
              {[
                {
                  key: "emailReply",
                  label: "Inquiry Reply Updates",
                  desc: "Send me immediate email updates once an agent responds to my property submissions",
                },
                {
                  key: "priceAlert",
                  label: "Saved Property Price Alerts",
                  desc: "Notify me if any of my favorited properties drop in listed price or change status",
                },
                {
                  key: "marketing",
                  label: "Marketing Promotions & Recommendations",
                  desc: "Send me customized newsletters showing top luxury houses in my local regions",
                },
              ].map((pref) => (
                <div key={pref.key} className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-bg-alt/40 transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <label className="text-xs font-bold text-text-primary block">{pref.label}</label>
                    <span className="text-[11px] text-text-muted font-medium leading-relaxed block">{pref.desc}</span>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, [pref.key]: !p[pref.key as keyof typeof p] }))}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative shrink-0 focus:outline-none",
                      preferences[pref.key as keyof typeof preferences] ? "bg-accent-primary" : "bg-border-default"
                    )}
                  >
                    <span className={cn(
                      "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                      preferences[pref.key as keyof typeof preferences] && "translate-x-5"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Danger Zone */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-base font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" /> Danger Zone
            </h3>
            <p className="text-xs text-text-secondary max-w-xl leading-relaxed">
              Permanently delete your account and remove all saved parameters, inquiries history, and user settings. This operation is non-reversible.
            </p>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger render={
                <Button className="h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold px-6">
                  Delete My Account
                </Button>
              } />
              <DialogContent className="bg-bg-surface border-border-default text-text-primary rounded-2xl max-w-md">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-text-primary text-left font-heading font-bold text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-rose-500" />
                    Are you absolutely sure?
                  </DialogTitle>
                  <DialogDescription className="text-left text-text-muted text-xs leading-relaxed">
                    This will permanently delete your database records and wipe your profile session settings. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3.5 my-4">
                  <p className="text-xs text-text-secondary">
                    To confirm, please type <span className="font-bold text-text-primary select-all bg-bg-base border border-border-default px-1.5 py-0.5 rounded font-mono">DELETE</span> below:
                  </p>
                  <Input
                    placeholder="Type DELETE"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    className="h-10 rounded-xl border-border-default bg-bg-base text-sm focus:ring-rose-500"
                  />
                </div>

                <DialogFooter className="flex flex-row gap-3 mt-4">
                  <Button
                    onClick={() => { setDeleteOpen(false); setDeleteInput(""); }}
                    variant="outline"
                    className="flex-1 h-10 rounded-xl border-border-default text-text-primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deleteInput !== "DELETE" || loading}
                    className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                  >
                    {loading ? "Deleting..." : "Confirm Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

        </div>

      </div>

      {/* ── NID Document Viewer Modal ── */}
      {currentUser && currentUser.nidDocumentUrl && (
        <DocumentViewer
          isOpen={showNidDocViewer}
          onClose={() => setShowNidDocViewer(false)}
          documentUrl={currentUser.nidDocumentUrl}
          agentName={currentUser.name}
          licenseNumber={currentUser.nidCardNumber}
          agencyName="Buyer NID Card"
        />
      )}
    </div>
  );
}
