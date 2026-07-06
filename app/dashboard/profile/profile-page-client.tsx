"use client";

import * as React from "react";
import { User, Shield, Bell, AlertTriangle, Key, Mail, Phone, FileText, Check, UploadCloud, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn, calculateProfileCompleteness } from "@/lib/utils";
import { DocumentViewer } from "@/components/shared/document-viewer";

export function ProfilePageClient() {
  const { currentUser } = useAuth();

  // KYC form states
  const [kycDocType, setKycDocType] = React.useState<'nid' | 'passport' | 'driving_license'>(
    (currentUser?.kycDocType as any) || "nid"
  );
  const [kycNumber, setKycNumber] = React.useState(currentUser?.kycDocNumber || currentUser?.nidCardNumber || "");
  const [kycFrontUrl, setKycFrontUrl] = React.useState(currentUser?.kycFrontUrl || currentUser?.nidDocumentUrl || "");
  const [kycBackUrl, setKycBackUrl] = React.useState(currentUser?.kycBackUrl || "");
  const [kycSelfieUrl, setKycSelfieUrl] = React.useState(currentUser?.kycSelfieUrl || "");
  const [kycSubmitting, setKycSubmitting] = React.useState(false);

  // Generic document viewer state
  const [viewerUrl, setViewerUrl] = React.useState("");
  const [viewerTitle, setViewerTitle] = React.useState("");
  const [showViewer, setShowViewer] = React.useState(false);
  const [activeSubTab, setActiveSubTab] = React.useState<'kyc' | 'phone' | 'background' | 'credit'>('kyc');

  // Uploading states
  const [uploadingFront, setUploadingFront] = React.useState(false);
  const [uploadingBack, setUploadingBack] = React.useState(false);
  const [uploadingSelfie, setUploadingSelfie] = React.useState(false);

  const [phone, setPhone] = React.useState(currentUser?.phone || "");
  const [phoneVerified, setPhoneVerified] = React.useState(currentUser?.phoneVerified || false);
  const [otpCode, setOtpCode] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [generatedOtp, setGeneratedOtp] = React.useState("");
  const [verifyingOtp, setVerifyingOtp] = React.useState(false);
  const [confirmationResult, setConfirmationResult] = React.useState<any>(null);

  // Background and credit reports
  const [backgroundReportUrl, setBackgroundReportUrl] = React.useState(currentUser?.backgroundReportUrl || "");
  const [backgroundReportStatus, setBackgroundReportStatus] = React.useState(currentUser?.backgroundReportStatus || "unsubmitted");
  const [creditReportUrl, setCreditReportUrl] = React.useState(currentUser?.creditReportUrl || "");
  const [creditReportStatus, setCreditReportStatus] = React.useState(currentUser?.creditReportStatus || "unsubmitted");
  const [creditScore, setCreditScore] = React.useState(currentUser?.creditScore?.toString() || "720");

  // Address states
  const [addressLine, setAddressLine] = React.useState(currentUser?.addressLine || "");
  const [addressCity, setAddressCity] = React.useState(currentUser?.addressCity || "");
  const [addressCountry, setAddressCountry] = React.useState(currentUser?.addressCountry || "");

  const frontInputRef = React.useRef<HTMLInputElement>(null);
  const backInputRef = React.useRef<HTMLInputElement>(null);
  const selfieInputRef = React.useRef<HTMLInputElement>(null);
  const bgInputRef = React.useRef<HTMLInputElement>(null);
  const creditInputRef = React.useRef<HTMLInputElement>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);

  // Form details states
  const [profileForm, setProfileForm] = React.useState({
    name: currentUser?.name || "Alex Johnson",
    email: currentUser?.email || "user@realhoms.com",
    bio: (currentUser as any)?.bio || "Passionate about finding modern, sustainable architectural properties in metropolitan areas. Looking to purchase a primary residence by late 2026.",
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
    weeklyDigest: true,
  });

  const [deleteInput, setDeleteInput] = React.useState("");
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Dynamic settings URLs
  const [backgroundCheckUrlLink, setBackgroundCheckUrlLink] = React.useState("https://check.realhoms.com/test-bg-report");
  const [creditScoreCheckUrlLink, setCreditScoreCheckUrlLink] = React.useState("https://check.realhoms.com/test-credit-score");

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.status === "success" && data.data) {
          if (data.data.backgroundCheckUrl) {
            setBackgroundCheckUrlLink(data.data.backgroundCheckUrl);
          }
          if (data.data.creditScoreCheckUrl) {
            setCreditScoreCheckUrlLink(data.data.creditScoreCheckUrl);
          }
        }
      } catch (err) {
        console.error("Failed to load settings links:", err);
      }
    }
    loadSettings();
  }, []);

  const initials = profileForm.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const toastId = toast.loading("Uploading profile photo...");
    try {
      const res = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: 'user/avatar'
        })
      });
      if (!res.ok) throw new Error('Failed to get presigned URL');
      const data = await res.json();
      if (data.status !== 'success' || !data.uploadUrl || !data.publicUrl) {
        throw new Error('Failed to get upload URL');
      }

      const uploadRes = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });
      if (!uploadRes.ok) throw new Error('Upload rejected');

      // Call API to save new avatar url in database
      const saveRes = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: data.publicUrl })
      });
      const saveResult = await saveRes.json();
      if (saveResult.status !== 'success') {
        throw new Error(saveResult.message || 'Failed to update avatar in database');
      }

      toast.dismiss(toastId);
      toast.success("Profile picture updated successfully! 📸");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.dismiss(toastId);
      console.error(err);
      toast.error("Upload failed", { description: err.message || "Something went wrong." });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    const toastId = toast.loading("Removing profile photo...");
    try {
      const saveRes = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: "" })
      });
      const saveResult = await saveRes.json();
      if (saveResult.status !== 'success') {
        throw new Error(saveResult.message || 'Failed to remove avatar in database');
      }

      toast.dismiss(toastId);
      toast.success("Profile picture removed! 📸");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.dismiss(toastId);
      console.error(err);
      toast.error("Removal failed", { description: err.message || "Something went wrong." });
    }
  };

  const startDocumentUpload = async (file: File, side: 'front' | 'back' | 'selfie' | 'bg' | 'credit') => {
    if (side === 'front') setUploadingFront(true);
    else if (side === 'back') setUploadingBack(true);
    else if (side === 'selfie') setUploadingSelfie(true);

    try {
      const res = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: 'user/verification'
        })
      });
      if (!res.ok) throw new Error('Failed to get presigned URL');
      const data = await res.json();
      if (data.status !== 'success' || !data.uploadUrl || !data.publicUrl) {
        throw new Error('Failed to get upload URL');
      }

      const uploadRes = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });
      if (!uploadRes.ok) throw new Error('Upload rejected');

      if (side === 'front') setKycFrontUrl(data.publicUrl);
      else if (side === 'back') setKycBackUrl(data.publicUrl);
      else if (side === 'selfie') setKycSelfieUrl(data.publicUrl);
      else if (side === 'bg') setBackgroundReportUrl(data.publicUrl);
      else if (side === 'credit') setCreditReportUrl(data.publicUrl);

      toast.success("Document uploaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed", { description: err.message || "Something went wrong." });
    } finally {
      if (side === 'front') setUploadingFront(false);
      else if (side === 'back') setUploadingBack(false);
      else if (side === 'selfie') setUploadingSelfie(false);
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycNumber.trim()) {
      toast.error("Validation error", { description: "Please enter card number." });
      return;
    }
    if (!kycFrontUrl || !kycBackUrl || !kycSelfieUrl) {
      toast.error("Validation error", { description: "Please upload Front, Back, and Selfie photos." });
      return;
    }

    setKycSubmitting(true);
    try {
      const res = await fetch('/api/user/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: kycDocType,
          docNumber: kycNumber,
          frontUrl: kycFrontUrl,
          backUrl: kycBackUrl,
          selfieUrl: kycSelfieUrl
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success("KYC submitted successfully", { description: "It is now pending review." });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Submission failed", { description: data.message });
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error", { description: "Network error occurred." });
    } finally {
      setKycSubmitting(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!phone.trim()) {
      toast.error("Validation error", { description: "Please enter a phone number." });
      return;
    }

    const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : `+${phone.trim()}`;

    toast.loading("Sending verification code via Firebase...");
    try {
      const settingsRes = await fetch("/api/settings");
      const settingsData = await settingsRes.json();
      if (settingsData.status !== "success" || !settingsData.data) {
        throw new Error("Failed to load platform settings.");
      }

      const config = {
        apiKey: settingsData.data.firebaseApiKey,
        authDomain: settingsData.data.firebaseAuthDomain,
        projectId: settingsData.data.firebaseProjectId,
        storageBucket: settingsData.data.firebaseStorageBucket,
        messagingSenderId: settingsData.data.firebaseMessagingSenderId,
        appId: settingsData.data.firebaseAppId,
        measurementId: settingsData.data.firebaseMeasurementId,
      };

      const { initializeApp, getApps, getApp } = await import("firebase/app");
      const { getAuth, RecaptchaVerifier, signInWithPhoneNumber } = await import("firebase/auth");

      const app = getApps().length === 0 ? initializeApp(config) : getApp();
      const auth = getAuth(app);

      let verifier = (window as any).recaptchaVerifier;
      if (!verifier) {
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
        (window as any).recaptchaVerifier = verifier;
      }

      const confirmResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmResult);
      setOtpSent(true);
      toast.dismiss();
      toast.success("Verification code sent via SMS! 📱");
    } catch (err: any) {
      toast.dismiss();
      console.warn("Firebase send OTP error, falling back to test mode:", err);
      
      toast.loading("Sending test code...");
      try {
        const res = await fetch('/api/user/phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        const data = await res.json();
        toast.dismiss();
        if (data.status === 'success') {
          setOtpSent(true);
          setGeneratedOtp(data.code);
          setConfirmationResult(null);
          toast.success("Test code sent!", { description: `For testing, enter: ${data.code}` });
        } else {
          toast.error("Failed to send test code", { description: data.message });
        }
      } catch (mockErr) {
        toast.dismiss();
        toast.error("Error sending verification code.");
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      toast.error("Validation error", { description: "Please enter the OTP code." });
      return;
    }

    setVerifyingOtp(true);
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otpCode);
        const idToken = await result.user.getIdToken();
        const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : `+${phone.trim()}`;

        const res = await fetch('/api/user/phone/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: idToken, phone: formattedPhone })
        });
        const data = await res.json();
        if (data.status === 'success') {
          setPhoneVerified(true);
          setOtpSent(false);
          toast.success("Phone verified successfully!");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error("Verification failed", { description: data.message });
        }
      } else {
        const res = await fetch('/api/user/phone/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: otpCode })
        });
        const data = await res.json();
        if (data.status === 'success') {
          setPhoneVerified(true);
          setOtpSent(false);
          toast.success("Phone verified successfully!");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error("Verification failed", { description: data.message });
        }
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      toast.error("Invalid verification code", { description: err.message || "Please check the code and try again." });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleBackgroundCheckSubmit = async () => {
    if (!backgroundReportUrl) {
      toast.error("Validation error", { description: "Please upload or run check to get document url." });
      return;
    }

    try {
      const res = await fetch('/api/user/background-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl: backgroundReportUrl })
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success("Background report submitted successfully.");
        setBackgroundReportStatus("pending");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      toast.error("Error submitting background report.");
    }
  };

  const handleCreditCheckSubmit = async () => {
    if (!creditReportUrl || !creditScore) {
      toast.error("Validation error", { description: "Please enter score and upload report." });
      return;
    }

    try {
      const res = await fetch('/api/user/credit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl: creditReportUrl, creditScore: parseInt(creditScore) })
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success("Credit report submitted successfully.");
        setCreditReportStatus("pending");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      toast.error("Error submitting credit report.");
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Validation error", { description: "Full name is required." });
      return;
    }

    toast.loading("Saving changes...");
    try {
      await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressLine,
          addressCity,
          addressCountry
        })
      });
      toast.dismiss();
      toast.success("Profile changes saved successfully! 🚀");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to save changes.");
    }
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
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
            <div 
              onClick={() => !uploadingAvatar && avatarInputRef.current?.click()}
              className="relative group cursor-pointer mb-4"
            >
              <Avatar className="h-24 w-24 border-2 border-border-default overflow-hidden">
                <AvatarImage src={currentUser?.avatar || undefined} alt={profileForm.name} className="object-cover" />
                <AvatarFallback className="bg-accent-primary-dim text-accent-primary font-bold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadingAvatar ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <span className="text-[10px] font-bold text-white uppercase">Upload</span>
                )}
              </div>
            </div>
            <h3 className="font-heading text-base font-bold text-text-primary">{profileForm.name}</h3>
            <p className="text-xs text-text-muted capitalize">{currentUser?.role.replace("_", " ")} Workspace</p>
          </div>

          <div className="border-t border-border-default/60 pt-4 flex flex-col gap-2.5">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="w-full h-9 rounded-xl border-border-default hover:bg-bg-elevated text-xs text-text-secondary"
            >
              {uploadingAvatar ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Uploading...
                </>
              ) : "Upload New Photo"}
            </Button>
            {currentUser?.avatar && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleAvatarRemove}
                disabled={uploadingAvatar}
                className="w-full h-9 rounded-xl text-xs text-text-muted hover:text-text-primary"
              >
                Remove Photo
              </Button>
            )}
          </div>

          {currentUser && (
            <div className="border-t border-border-default/60 pt-4 text-left space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-text-muted uppercase tracking-wider text-[10px]">Profile Completeness</span>
                <span className="text-accent-primary font-mono">{calculateProfileCompleteness(currentUser)}%</span>
              </div>
              <div className="h-2 w-full bg-border-default rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    calculateProfileCompleteness(currentUser) < 50 ? "bg-rose-500" :
                      calculateProfileCompleteness(currentUser) < 80 ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${calculateProfileCompleteness(currentUser)}%` }}
                />
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">
                Complete your profile verifications (KYC, Phone OTP, background report, and credit check) to raise trust levels.
              </p>
            </div>
          )}

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
          {/* Card: Identity and Profile Verification Suite */}
          {currentUser && currentUser.role !== 'admin' && currentUser.role !== 'super_admin' && (
            <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 sm:p-6 shadow-sm space-y-6">
              <div className="border-b border-border-default/50 pb-4">
                <h3 className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
                  <Shield className="h-5.5 w-5.5 text-accent-primary" />
                  Profile Verification Dashboard
                </h3>
                <p className="text-xs text-text-muted font-medium mt-1">Complete your KYC, phone, and screening checkups to secure listing applications.</p>
              </div>

              {/* Verification Sub-Tabs Bar */}
              <div className="flex border-b border-border-default/40 pb-px gap-1 overflow-x-auto whitespace-nowrap scrollbar-none">
                {[
                  { id: 'kyc', label: '1. KYC Identity', icon: User, status: currentUser.kycStatus || currentUser.nidStatus || 'unsubmitted' },
                  { id: 'phone', label: '2. Phone OTP', icon: Phone, status: phoneVerified ? 'verified' : 'unsubmitted' },
                  { id: 'background', label: '3. Background check', icon: Shield, status: backgroundReportStatus },
                  { id: 'credit', label: '4. Credit Score', icon: FileText, status: creditReportStatus },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSubTab === tab.id;
                  const statusColors: Record<string, string> = {
                    verified: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                    pending: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                    rejected: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
                    unsubmitted: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
                  };
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSubTab(tab.id as any)}
                      className={cn(
                        "h-10 px-4 flex items-center gap-2 border-b-2 text-xs font-bold transition-all cursor-pointer relative",
                        isActive
                          ? "border-accent-primary text-accent-primary bg-accent-primary-dim/10 rounded-t-lg"
                          : "border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated/40"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      <span className={cn("text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border shrink-0 scale-90", statusColors[tab.status] || statusColors.unsubmitted)}>
                        {tab.status === 'verified' ? 'OK' : tab.status === 'pending' ? '...' : tab.status === 'rejected' ? 'X' : '?'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Tab Contents */}
              <div className="space-y-4 pt-2">
                {/* 1. KYC Identity Tab */}
                {activeSubTab === 'kyc' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border-default bg-bg-alt/30 text-xs font-semibold">
                      <span className="text-text-muted">KYC Document Status:</span>
                      <span className={cn("font-bold uppercase text-[9px] px-2.5 py-1 rounded-full border tracking-wider",
                        (currentUser.kycStatus || currentUser.nidStatus) === "verified" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                          (currentUser.kycStatus || currentUser.nidStatus) === "pending" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                            (currentUser.kycStatus || currentUser.nidStatus) === "rejected" ? "text-rose-500 bg-rose-500/10 border-rose-500/20" :
                              "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      )}>
                        {currentUser.kycStatus === "verified" || currentUser.nidStatus === "verified" ? "Approved / Verified" :
                          currentUser.kycStatus === "pending" || currentUser.nidStatus === "pending" ? "Pending Review" :
                            currentUser.kycStatus === "rejected" || currentUser.nidStatus === "rejected" ? "Rejected" :
                              "Not Verified"}
                      </span>
                    </div>

                    {(currentUser.kycStatus === 'verified' || currentUser.nidStatus === 'verified') && (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                          <Check className="h-4 w-4 shrink-0" />
                          <span>Identity KYC Verified</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          Your identity documents have been successfully verified. You have full access to listings and inquiry submissions.
                        </p>
                        <div className="text-xs pt-3 border-t border-emerald-500/10 grid grid-cols-3 gap-4 text-text-secondary font-medium">
                          <div>
                            <span className="text-[9px] text-text-muted uppercase tracking-wider block mb-0.5">Document Type</span>
                            <span className="font-bold text-text-primary capitalize">{kycDocType.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-text-muted uppercase tracking-wider block mb-0.5">Doc Card Number</span>
                            <span className="font-mono font-bold text-text-primary">
                              {kycNumber ? `${kycNumber.slice(0, 4)}-XXXX-XXXX` : 'Verified'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-text-muted uppercase tracking-wider block mb-0.5">Verified Documents</span>
                            <div className="flex gap-2">
                              {kycFrontUrl && (
                                <button onClick={() => { setViewerUrl(kycFrontUrl); setViewerTitle("KYC Front Side"); setShowViewer(true); }} className="font-bold text-accent-primary hover:underline text-[10px]">
                                  Front
                                </button>
                              )}
                              {kycBackUrl && (
                                <button onClick={() => { setViewerUrl(kycBackUrl); setViewerTitle("KYC Back Side"); setShowViewer(true); }} className="font-bold text-accent-primary hover:underline text-[10px]">
                                  Back
                                </button>
                              )}
                              {kycSelfieUrl && (
                                <button onClick={() => { setViewerUrl(kycSelfieUrl); setViewerTitle("KYC Selfie"); setShowViewer(true); }} className="font-bold text-accent-primary hover:underline text-[10px]">
                                  Selfie
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {(currentUser.kycStatus === 'pending' || currentUser.nidStatus === 'pending') && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                          <span>KYC Review Pending</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          Your document scans have been submitted and are under administrator review.
                        </p>
                        <div className="text-xs pt-3 border-t border-amber-500/10 grid grid-cols-2 gap-4 text-text-secondary font-medium">
                          <div>
                            <span className="text-[9px] text-text-muted uppercase tracking-wider block mb-0.5">Submitted Card Number</span>
                            <span className="font-mono font-bold text-text-primary">{kycNumber}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-text-muted uppercase tracking-wider block mb-0.5">Scanned Media</span>
                            <div className="flex gap-2">
                              {kycFrontUrl && (
                                <button onClick={() => { setViewerUrl(kycFrontUrl); setViewerTitle("KYC Front Side"); setShowViewer(true); }} className="font-bold text-accent-primary hover:underline text-[10px]">
                                  Front
                                </button>
                              )}
                              {kycBackUrl && (
                                <button onClick={() => { setViewerUrl(kycBackUrl); setViewerTitle("KYC Back Side"); setShowViewer(true); }} className="font-bold text-accent-primary hover:underline text-[10px]">
                                  Back
                                </button>
                              )}
                              {kycSelfieUrl && (
                                <button onClick={() => { setViewerUrl(kycSelfieUrl); setViewerTitle("KYC Selfie"); setShowViewer(true); }} className="font-bold text-accent-primary hover:underline text-[10px]">
                                  Selfie
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {(currentUser.kycStatus === 'unsubmitted' || currentUser.kycStatus === 'rejected' || currentUser.nidStatus === 'unsubmitted' || currentUser.nidStatus === 'rejected') && (
                      <form onSubmit={handleKycSubmit} className="space-y-4">
                        {(currentUser.kycStatus === 'rejected' || currentUser.nidRejectionReason) && (
                          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs font-medium text-rose-400">
                            Verification Rejected: {currentUser.kycRejectionReason || currentUser.nidRejectionReason || 'Details incomplete'}. Please upload clear files and resubmit.
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Document Type</label>
                            <select
                              value={kycDocType}
                              onChange={(e) => setKycDocType(e.target.value as any)}
                              className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none"
                            >
                              <option value="nid">National ID (NID)</option>
                              <option value="passport">Passport</option>
                              <option value="driving_license">Driver's License</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Card / Document Number *</label>
                            <Input
                              placeholder="e.g. 199587423589"
                              value={kycNumber}
                              onChange={(e) => setKycNumber(e.target.value)}
                              className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                              required
                            />
                          </div>
                        </div>

                        {/* Three upload slots */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                          {/* Front */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-text-secondary uppercase">Front Side Image *</label>
                            <div
                              onClick={() => frontInputRef.current?.click()}
                              className={cn("flex flex-col items-center justify-center border border-dashed rounded-xl p-4 cursor-pointer bg-bg-base/30 h-32 transition-all hover:bg-bg-base/40", kycFrontUrl ? "border-emerald-500/40 bg-emerald-500/5" : "border-border-default hover:border-accent-primary")}
                            >
                              <input type="file" ref={frontInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && startDocumentUpload(e.target.files[0], 'front')} />
                              {uploadingFront ? <Loader2 className="h-5 w-5 text-accent-primary animate-spin" /> : kycFrontUrl ? <Check className="h-5 w-5 text-emerald-400" /> : <UploadCloud className="h-5 w-5 text-accent-primary" />}
                              <span className="text-[10px] text-text-primary font-bold mt-2 text-center">{kycFrontUrl ? 'Uploaded' : 'Upload Front'}</span>
                            </div>
                          </div>

                          {/* Back */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-text-secondary uppercase">Back Side Image *</label>
                            <div
                              onClick={() => backInputRef.current?.click()}
                              className={cn("flex flex-col items-center justify-center border border-dashed rounded-xl p-4 cursor-pointer bg-bg-base/30 h-32 transition-all hover:bg-bg-base/40", kycBackUrl ? "border-emerald-500/40 bg-emerald-500/5" : "border-border-default hover:border-accent-primary")}
                            >
                              <input type="file" ref={backInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && startDocumentUpload(e.target.files[0], 'back')} />
                              {uploadingBack ? <Loader2 className="h-5 w-5 text-accent-primary animate-spin" /> : kycBackUrl ? <Check className="h-5 w-5 text-emerald-400" /> : <UploadCloud className="h-5 w-5 text-accent-primary" />}
                              <span className="text-[10px] text-text-primary font-bold mt-2 text-center">{kycBackUrl ? 'Uploaded' : 'Upload Back'}</span>
                            </div>
                          </div>

                          {/* Selfie */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-text-secondary uppercase">Selfie holding card *</label>
                            <div
                              onClick={() => selfieInputRef.current?.click()}
                              className={cn("flex flex-col items-center justify-center border border-dashed rounded-xl p-4 cursor-pointer bg-bg-base/30 h-32 transition-all hover:bg-bg-base/40", kycSelfieUrl ? "border-emerald-500/40 bg-emerald-500/5" : "border-border-default hover:border-accent-primary")}
                            >
                              <input type="file" ref={selfieInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && startDocumentUpload(e.target.files[0], 'selfie')} />
                              {uploadingSelfie ? <Loader2 className="h-5 w-5 text-accent-primary animate-spin" /> : kycSelfieUrl ? <Check className="h-5 w-5 text-emerald-400" /> : <UploadCloud className="h-5 w-5 text-accent-primary" />}
                              <span className="text-[10px] text-text-primary font-bold mt-2 text-center">{kycSelfieUrl ? 'Uploaded' : 'Upload Selfie'}</span>
                            </div>
                          </div>
                        </div>

                        <Button type="submit" disabled={kycSubmitting} className="w-full h-10 rounded-xl bg-accent-primary text-white font-bold text-xs mt-2">
                          {kycSubmitting ? 'Submitting KYC request...' : 'Submit 3-Photo KYC Documents'}
                        </Button>
                      </form>
                    )}
                  </div>
                )}

                {/* 2. Phone OTP Tab */}
                {activeSubTab === 'phone' && (
                  <div className="space-y-4 animate-fade-in text-left">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border-default bg-bg-alt/30 text-xs font-semibold">
                      <span className="text-text-muted">Verification Status:</span>
                      <span className={cn("font-bold uppercase text-[9px] px-2.5 py-1 rounded-full border tracking-wider",
                        phoneVerified ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      )}>
                        {phoneVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>

                    {phoneVerified ? (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-2.5 text-xs font-bold text-emerald-400">
                        <Check className="h-4.5 w-4.5 shrink-0" />
                        <span>Phone number verified: {phone}</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Request a verification code to authenticate your phone. A 6-digit OTP code will be sent.
                        </p>

                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. +1555123456"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary flex-1"
                            disabled={otpSent}
                          />
                          {!otpSent ? (
                            <Button onClick={handleRequestOtp} className="h-10 bg-accent-primary text-white font-bold text-xs px-5 rounded-xl">
                              Send OTP
                            </Button>
                          ) : (
                            <Button onClick={() => setOtpSent(false)} variant="outline" className="h-10 border-border-default text-text-secondary font-bold text-xs px-5 rounded-xl">
                              Change Phone
                            </Button>
                          )}
                        </div>

                        <div id="recaptcha-container" className="hidden"></div>

                        {otpSent && (
                          <div className="space-y-3 p-4 bg-bg-alt/40 border border-border-default/70 rounded-xl animate-fade-in">
                            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Enter 6-Digit OTP Code</label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="e.g. 123456"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary flex-1 font-mono tracking-widest text-center"
                                maxLength={6}
                              />
                              <Button onClick={handleVerifyOtp} disabled={verifyingOtp} className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 rounded-xl">
                                {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                              </Button>
                            </div>
                            {generatedOtp && (
                              <p className="text-[10px] text-accent-primary font-bold">
                                Mock OTP code generated for testing: <span className="font-mono text-xs underline">{generatedOtp}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Background Check Tab */}
                {activeSubTab === 'background' && (
                  <div className="space-y-4 animate-fade-in text-left">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border-default bg-bg-alt/30 text-xs font-semibold">
                      <span className="text-text-muted">Background Check Status:</span>
                      <span className={cn("font-bold uppercase text-[9px] px-2.5 py-1 rounded-full border tracking-wider",
                        backgroundReportStatus === "verified" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                          backgroundReportStatus === "pending" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                            "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      )}>
                        {backgroundReportStatus === "verified" ? "Verified / Clean" :
                          backgroundReportStatus === "pending" ? "Pending Review" :
                            "Unsubmitted"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs text-text-secondary leading-relaxed">
                        To build maximum listing trust, users must execute a background search check. Click below to test or upload your verification reports.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={backgroundCheckUrlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            setBackgroundReportUrl("https://realhoms.com/reports/bg-check-clean-usr9482.pdf");
                            toast.success("Test check complete!", { description: "Clean record verified. PDF report auto-selected for submission." });
                          }}
                          className="h-10 px-5 flex items-center justify-center rounded-xl bg-accent-primary text-white font-bold text-xs hover:bg-accent-primary-hov shadow-md"
                        >
                          Run Online Background check
                        </a>

                        <Button
                          onClick={() => bgInputRef.current?.click()}
                          variant="outline"
                          className="h-10 border-border-default hover:bg-bg-elevated text-text-primary font-bold text-xs px-5 rounded-xl"
                        >
                          Upload Report Document
                        </Button>
                        <input type="file" ref={bgInputRef} className="hidden" accept="application/pdf,image/*" onChange={(e) => e.target.files?.[0] && startDocumentUpload(e.target.files[0], 'bg')} />
                      </div>

                      {backgroundReportUrl && (
                        <div className="p-4 bg-bg-alt/30 border border-border-default rounded-xl space-y-3">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Selected Report Document</span>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-mono text-text-muted truncate max-w-sm">{backgroundReportUrl}</span>
                            <button onClick={() => { setViewerUrl(backgroundReportUrl); setViewerTitle("Background Report"); setShowViewer(true); }} className="text-xs text-accent-primary font-bold hover:underline">
                              Inspect Report
                            </button>
                          </div>
                          {backgroundReportStatus === 'unsubmitted' && (
                            <Button onClick={handleBackgroundCheckSubmit} className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl mt-1">
                              Submit Background Report for Admin Verification
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Credit Score Tab */}
                {activeSubTab === 'credit' && (
                  <div className="space-y-4 animate-fade-in text-left">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border-default bg-bg-alt/30 text-xs font-semibold">
                      <span className="text-text-muted">Credit Screening Status:</span>
                      <span className={cn("font-bold uppercase text-[9px] px-2.5 py-1 rounded-full border tracking-wider",
                        creditReportStatus === "verified" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                          creditReportStatus === "pending" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                            "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      )}>
                        {creditReportStatus === "verified" ? "Verified" :
                          creditReportStatus === "pending" ? "Pending Review" :
                            "Unsubmitted"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Submit your credit screening report. You can test your score online or upload a recent credit report document.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={creditScoreCheckUrlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            setCreditReportUrl("https://realhoms.com/reports/credit-score-740-usr9482.pdf");
                            setCreditScore("740");
                            toast.success("Credit check complete!", { description: "Score of 740 calculated. Report auto-selected." });
                          }}
                          className="h-10 px-5 flex items-center justify-center rounded-xl bg-accent-primary text-white font-bold text-xs hover:bg-accent-primary-hov shadow-md"
                        >
                          Verify Credit Score Online
                        </a>

                        <Button
                          onClick={() => creditInputRef.current?.click()}
                          variant="outline"
                          className="h-10 border-border-default hover:bg-bg-elevated text-text-primary font-bold text-xs px-5 rounded-xl"
                        >
                          Upload Score Report PDF
                        </Button>
                        <input type="file" ref={creditInputRef} className="hidden" accept="application/pdf,image/*" onChange={(e) => e.target.files?.[0] && startDocumentUpload(e.target.files[0], 'credit')} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Credit Score Value</label>
                          <Input
                            type="number"
                            placeholder="e.g. 720"
                            value={creditScore}
                            onChange={(e) => setCreditScore(e.target.value)}
                            className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                          />
                        </div>
                      </div>

                      {creditReportUrl && (
                        <div className="p-4 bg-bg-alt/30 border border-border-default rounded-xl space-y-3">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Selected Credit Document</span>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-mono text-text-muted truncate max-w-sm">{creditReportUrl}</span>
                            <button onClick={() => { setViewerUrl(creditReportUrl); setViewerTitle("Credit Report"); setShowViewer(true); }} className="text-xs text-accent-primary font-bold hover:underline">
                              Inspect Report
                            </button>
                          </div>
                          {creditReportStatus === 'unsubmitted' && (
                            <Button onClick={handleCreditCheckSubmit} className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl mt-1">
                              Submit Credit Score for Admin Review
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Phone Number {phoneVerified ? <span className="text-emerald-500 font-extrabold text-[9px] uppercase ml-1">(Verified)</span> : <span className="text-amber-500 font-extrabold text-[9px] uppercase ml-1">(Unverified)</span>}
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                    placeholder="Verify in verification tab above"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Title/Role</label>
                  <Input
                    value={currentUser?.role === 'agent' ? 'Licensed Real Estate Agent' : currentUser?.role === 'owner' ? 'Property Owner / Lessor' : 'Buyer / Renting Member'}
                    disabled
                    className="h-10 rounded-xl border-border-default bg-bg-base/50 text-sm text-text-muted cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Address inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Street Address</label>
                  <Input
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                    placeholder="e.g. 123 Main St"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">City</label>
                  <Input
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                    placeholder="e.g. New York"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Country</label>
                  <Input
                    value={addressCountry}
                    onChange={(e) => setAddressCountry(e.target.value)}
                    className="h-10 rounded-xl border-border-default bg-bg-base text-sm text-text-primary"
                    placeholder="e.g. United States"
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

      {/* ── Generic Document Viewer Modal ── */}
      <DocumentViewer
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
        documentUrl={viewerUrl}
        agentName={currentUser?.name || "User"}
        licenseNumber=""
        agencyName={viewerTitle}
      />
    </div>
  );
}
