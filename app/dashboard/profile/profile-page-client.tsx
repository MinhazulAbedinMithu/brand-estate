"use client";

import * as React from "react";
import { User, Shield, Bell, AlertTriangle, Key, Mail, Phone, FileText, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProfilePageClient() {
  const { currentUser } = useAuth();
  
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

  // Initials
  const initials = profileForm.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
    </div>
  );
}
