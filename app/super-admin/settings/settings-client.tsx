"use client";

import * as React from "react";
import { Settings, Globe, AlertTriangle, FileText, Plus, Trash2, Zap, Key, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MarkdownEditor } from "@/components/blog/markdown-editor";

export function SettingsClient() {
  const [generalSettings, setGeneralSettings] = React.useState({
    appName: "BrandEstate",
    supportEmail: "support@brandestate.com",
    supportUrl: "https://support.brandestate.com",
  });

  const [verificationLinks, setVerificationLinks] = React.useState({
    backgroundCheckUrl: "https://check.brandestate.com/test-bg-report",
    creditScoreCheckUrl: "https://check.brandestate.com/test-credit-score",
  });

  const [legalContents, setLegalContents] = React.useState({
    termsOfService: "",
    privacyPolicy: "",
    cookiePolicy: "",
    disclaimer: "",
  });
  const [activeLegalTab, setActiveLegalTab] = React.useState<"termsOfService" | "privacyPolicy" | "cookiePolicy" | "disclaimer">("termsOfService");
  const [isSavingLegal, setIsSavingLegal] = React.useState(false);

  const [credentials, setCredentials] = React.useState({
    resendApiKey: "",
    resendFromEmail: "",
    stripePublishableKey: "",
    stripeSecretKey: "",
    stripeWebhookSecret: "",
    firebaseApiKey: "",
    firebaseAuthDomain: "",
    firebaseProjectId: "",
    firebaseStorageBucket: "",
    firebaseMessagingSenderId: "",
    firebaseAppId: "",
    firebaseMeasurementId: "",
  });

  const [showKeys, setShowKeys] = React.useState({
    resendApiKey: false,
    stripeSecretKey: false,
    stripeWebhookSecret: false,
    firebaseApiKey: false,
  });

  const [isSavingCredentials, setIsSavingCredentials] = React.useState(false);

  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.status === "success" && data.data) {
          setVerificationLinks({
            backgroundCheckUrl: data.data.backgroundCheckUrl || "",
            creditScoreCheckUrl: data.data.creditScoreCheckUrl || "",
          });
          setLegalContents({
            termsOfService: data.data.termsOfService || "",
            privacyPolicy: data.data.privacyPolicy || "",
            cookiePolicy: data.data.cookiePolicy || "",
            disclaimer: data.data.disclaimer || "",
          });
          setCredentials({
            resendApiKey: data.data.resendApiKey || "",
            resendFromEmail: data.data.resendFromEmail || "",
            stripePublishableKey: data.data.stripePublishableKey || "",
            stripeSecretKey: data.data.stripeSecretKey || "",
            stripeWebhookSecret: data.data.stripeWebhookSecret || "",
            firebaseApiKey: data.data.firebaseApiKey || "",
            firebaseAuthDomain: data.data.firebaseAuthDomain || "",
            firebaseProjectId: data.data.firebaseProjectId || "",
            firebaseStorageBucket: data.data.firebaseStorageBucket || "",
            firebaseMessagingSenderId: data.data.firebaseMessagingSenderId || "",
            firebaseAppId: data.data.firebaseAppId || "",
            firebaseMeasurementId: data.data.firebaseMeasurementId || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings links:", err);
      }
    }
    fetchSettings();
  }, []);

  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationLinks),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Verification links updated successfully! 🚀");
      } else {
        toast.error("Failed to save links", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving verification links");
    }
  };

  const handleSaveLegal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLegal(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          termsOfService: legalContents.termsOfService,
          privacyPolicy: legalContents.privacyPolicy,
          cookiePolicy: legalContents.cookiePolicy,
          disclaimer: legalContents.disclaimer,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Legal policies saved successfully! ⚖️");
      } else {
        toast.error("Failed to save legal policies", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving legal policies");
    } finally {
      setIsSavingLegal(false);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCredentials(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("API credentials saved successfully! 🚀");
      } else {
        toast.error("Failed to save credentials", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving API credentials");
    } finally {
      setIsSavingCredentials(false);
    }
  };

  const [flags, setFlags] = React.useState({
    enableAgents: true,
    enableBlog: true,
    maintenanceMode: false,
    googleOAuth: true,
    investmentCalculator: true,
  });

  const [regions, setRegions] = React.useState([
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SG", name: "Singapore" },
  ]);

  const [newRegionCode, setNewRegionCode] = React.useState("");
  const [newRegionName, setNewRegionName] = React.useState("");

  const handleToggleFlag = (key: keyof typeof flags) => {
    setFlags(prev => {
      const nextVal = !prev[key];
      toast.success(`Flag modified`, {
        description: `"${key.replace(/[A-Z]/g, " $&")}" feature is now ${nextVal ? "enabled" : "disabled"}.`
      });
      return { ...prev, [key]: nextVal };
    });
  };

  const handleAddRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionCode.trim() || !newRegionName.trim()) {
      toast.error("Validation error", { description: "Please enter both country code and country name." });
      return;
    }
    const code = newRegionCode.trim().toUpperCase();
    if (regions.some(r => r.code === code)) {
      toast.error("Validation error", { description: "Region country code already exists." });
      return;
    }

    setRegions(prev => [...prev, { code, name: newRegionName.trim() }]);
    setNewRegionCode("");
    setNewRegionName("");
    toast.success("Region Added", { description: `Successfully added "${newRegionName}".` });
  };

  const handleRemoveRegion = (code: string, name: string) => {
    setRegions(prev => prev.filter(r => r.code !== code));
    toast.success("Region Removed", { description: `"${name}" was deleted from active regions.` });
  };

  const handleGeneralSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: "Saving system settings...",
        success: "Platform parameters updated successfully!",
        error: "Failed to update configuration."
      }
    );
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* ── Page Header ── */}
      <div className="border-b border-border-default/60 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
          <Settings className="h-5 w-5 text-amber-500" />
          Platform Configurations
        </h1>
        <p className="text-xs text-text-muted font-medium font-body">Modify system flags, manage target regional directories and adjust variables</p>
      </div>

      {/* ── Main settings grids ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Feature Flags & Toggles */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: Feature Flags */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-default/50 pb-3 flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-amber-500" /> System Feature Flags
            </h3>
            <div className="space-y-4">
              {[
                {
                  key: "enableAgents",
                  label: "Enable Agents Registry & Directory",
                  desc: "Allow public agents directory routing and custom agent profiles.",
                },
                {
                  key: "enableBlog",
                  label: "Enable Blogs & Market News Articles",
                  desc: "Renders article listings and reader subpages for estate analysis.",
                },
                {
                  key: "googleOAuth",
                  label: "Enable Google OAuth Provider login",
                  desc: "Permit mockup OAuth login redirects.",
                },
                {
                  key: "investmentCalculator",
                  label: "Enable zoning-projections investment calculator",
                  desc: "Toggle visibility of asset yield projections cards.",
                },
                {
                  key: "maintenanceMode",
                  label: "Global Platform Maintenance Mode",
                  desc: "Force public site routes to redirect to a lock page.",
                },
              ].map((flag) => (
                <div
                  key={flag.key}
                  className="flex items-start justify-between gap-4 p-3.5 rounded-xl hover:bg-bg-alt/40 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-text-primary block">{flag.label}</span>
                    <span className="text-[11px] text-text-muted font-medium leading-relaxed block">{flag.desc}</span>
                  </div>
                  <button
                    onClick={() => handleToggleFlag(flag.key as keyof typeof flags)}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative shrink-0 focus:outline-none select-none cursor-pointer",
                      flags[flag.key as keyof typeof flags]
                        ? flag.key === "maintenanceMode" ? "bg-rose-500" : "bg-amber-500"
                        : "bg-border-default"
                    )}
                  >
                    <span className={cn(
                      "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                      flags[flag.key as keyof typeof flags] && "translate-x-5"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: General Configuration Info */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-default/50 pb-3">
              App Parameters
            </h3>
            <form onSubmit={handleGeneralSave} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Application Name</label>
                  <Input
                    value={generalSettings.appName}
                    onChange={(e) => setGeneralSettings(p => ({ ...p, appName: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Contact Support Email</label>
                  <Input
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings(p => ({ ...p, supportEmail: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Support Portal URL</label>
                <Input
                  value={generalSettings.supportUrl}
                  onChange={(e) => setGeneralSettings(p => ({ ...p, supportUrl: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 shadow">
                  Save Settings General
                </Button>
              </div>
            </form>
          </div>

          {/* Card 3: Verification Check URLs */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-default/50 pb-3 flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-amber-500" /> Verification Check URLs
            </h3>
            <form onSubmit={handleSaveLinks} className="space-y-4 text-xs font-medium">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Background check test URL</label>
                <Input
                  value={verificationLinks.backgroundCheckUrl}
                  onChange={(e) => setVerificationLinks(p => ({ ...p, backgroundCheckUrl: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Credit score test URL</label>
                <Input
                  value={verificationLinks.creditScoreCheckUrl}
                  onChange={(e) => setVerificationLinks(p => ({ ...p, creditScoreCheckUrl: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 shadow">
                  Save Verification Links
                </Button>
              </div>
            </form>
          </div>

          {/* Card 4: API Credentials Manager */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-default/50 pb-3 flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-amber-500" /> API Credentials Manager
            </h3>
            
            <form onSubmit={handleSaveCredentials} className="space-y-6 text-xs font-medium">
              {/* Resend Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-l-2 border-amber-500 pl-2">
                  Resend Email Config
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Resend API Key</label>
                    <div className="relative">
                      <Input
                        type={showKeys.resendApiKey ? "text" : "password"}
                        value={credentials.resendApiKey}
                        onChange={(e) => setCredentials(p => ({ ...p, resendApiKey: e.target.value }))}
                        className="h-10 border-border-default bg-bg-base text-text-primary text-sm pr-10 font-mono"
                        placeholder="re_..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys(p => ({ ...p, resendApiKey: !p.resendApiKey }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                      >
                        {showKeys.resendApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Sender From Email</label>
                    <Input
                      value={credentials.resendFromEmail}
                      onChange={(e) => setCredentials(p => ({ ...p, resendFromEmail: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm font-mono"
                      placeholder="Brand Estate <onboarding@resend.dev>"
                    />
                  </div>
                </div>
              </div>

              {/* Stripe Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-l-2 border-amber-500 pl-2">
                  Stripe Payments Config
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Stripe Publishable Key</label>
                    <Input
                      value={credentials.stripePublishableKey}
                      onChange={(e) => setCredentials(p => ({ ...p, stripePublishableKey: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm font-mono"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Stripe Secret Key</label>
                      <div className="relative">
                        <Input
                          type={showKeys.stripeSecretKey ? "text" : "password"}
                          value={credentials.stripeSecretKey}
                          onChange={(e) => setCredentials(p => ({ ...p, stripeSecretKey: e.target.value }))}
                          className="h-10 border-border-default bg-bg-base text-text-primary text-sm pr-10 font-mono"
                          placeholder="sk_test_..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowKeys(p => ({ ...p, stripeSecretKey: !p.stripeSecretKey }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                        >
                          {showKeys.stripeSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Stripe Webhook Secret</label>
                      <div className="relative">
                        <Input
                          type={showKeys.stripeWebhookSecret ? "text" : "password"}
                          value={credentials.stripeWebhookSecret}
                          onChange={(e) => setCredentials(p => ({ ...p, stripeWebhookSecret: e.target.value }))}
                          className="h-10 border-border-default bg-bg-base text-text-primary text-sm pr-10 font-mono"
                          placeholder="whsec_..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowKeys(p => ({ ...p, stripeWebhookSecret: !p.stripeWebhookSecret }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                        >
                          {showKeys.stripeWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* Firebase Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-l-2 border-amber-500 pl-2">
                  Firebase Web App Config
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Firebase API Key</label>
                      <div className="relative">
                        <Input
                          type={showKeys.firebaseApiKey ? "text" : "password"}
                          value={credentials.firebaseApiKey}
                          onChange={(e) => setCredentials(p => ({ ...p, firebaseApiKey: e.target.value }))}
                          className="h-10 border-border-default bg-bg-base text-text-primary text-sm pr-10 font-mono"
                          placeholder="AIzaSy..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowKeys(p => ({ ...p, firebaseApiKey: !p.firebaseApiKey }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                        >
                          {showKeys.firebaseApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Auth Domain</label>
                      <Input
                        value={credentials.firebaseAuthDomain}
                        onChange={(e) => setCredentials(p => ({ ...p, firebaseAuthDomain: e.target.value }))}
                        className="h-10 border-border-default bg-bg-base text-text-primary text-sm font-mono"
                        placeholder="...firebaseapp.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Project ID</label>
                      <Input
                        value={credentials.firebaseProjectId}
                        onChange={(e) => setCredentials(p => ({ ...p, firebaseProjectId: e.target.value }))}
                        className="h-10 border-border-default bg-bg-base text-text-primary text-sm font-mono"
                        placeholder="Project ID"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Storage Bucket</label>
                      <Input
                        value={credentials.firebaseStorageBucket}
                        onChange={(e) => setCredentials(p => ({ ...p, firebaseStorageBucket: e.target.value }))}
                        className="h-10 border-border-default bg-bg-base text-text-primary text-sm font-mono"
                        placeholder="...firebasestorage.app"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Messaging Sender ID</label>
                      <Input
                        value={credentials.firebaseMessagingSenderId}
                        onChange={(e) => setCredentials(p => ({ ...p, firebaseMessagingSenderId: e.target.value }))}
                        className="h-10 border-border-default bg-bg-base text-text-primary text-sm font-mono"
                        placeholder="Messaging Sender ID"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">App ID</label>
                      <Input
                        value={credentials.firebaseAppId}
                        onChange={(e) => setCredentials(p => ({ ...p, firebaseAppId: e.target.value }))}
                        className="h-10 border-border-default bg-bg-base text-text-primary text-sm font-mono"
                        placeholder="1:..."
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Measurement ID</label>
                      <Input
                        value={credentials.firebaseMeasurementId}
                        onChange={(e) => setCredentials(p => ({ ...p, firebaseMeasurementId: e.target.value }))}
                        className="h-10 border-border-default bg-bg-base text-text-primary text-sm font-mono"
                        placeholder="G-..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSavingCredentials}
                  className="h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 shadow disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="h-4 w-4" />
                  {isSavingCredentials ? "Saving Credentials..." : "Save API Credentials"}
                </Button>
              </div>
            </form>
          </div>

          {/* Card 5: Legal Policies & Disclaimers Content Manager */}

          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            <div className="border-b border-border-default/50 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-heading text-base font-bold text-text-primary flex items-center gap-2">

                <FileText className="h-4.5 w-4.5 text-amber-500" /> Legal Policies Manager
              </h3>
              
              {/* Document Selector Pills */}
              <div className="flex flex-wrap gap-1 p-0.5 rounded-lg border border-border-default bg-bg-elevated/40 text-[10px] sm:text-xs font-semibold">
                {([
                  { id: "termsOfService", label: "Terms of Service" },
                  { id: "privacyPolicy", label: "Privacy Policy" },
                  { id: "cookiePolicy", label: "Cookie Policy" },
                  { id: "disclaimer", label: "Disclaimer" },
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveLegalTab(tab.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                      activeLegalTab === tab.id
                        ? "bg-bg-surface text-accent-primary shadow-xs font-bold"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveLegal} className="space-y-4">
              <MarkdownEditor
                value={legalContents[activeLegalTab]}
                onChange={(val) => setLegalContents(prev => ({ ...prev, [activeLegalTab]: val }))}
                placeholder={`Draft your ${activeLegalTab.replace(/([A-Z])/g, " $1").toLowerCase()} content in Markdown...`}
                label={`Markdown Editor — ${activeLegalTab.replace(/([A-Z])/g, " $1")}`}
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSavingLegal}
                  className="h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 shadow disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  {isSavingLegal ? "Saving Content..." : `Save ${activeLegalTab.replace(/([A-Z])/g, " $1")}`}
                </Button>
              </div>
            </form>
          </div>

        </div>


        {/* RIGHT COLUMN: Country Regions manager */}
        <div className="space-y-8">
          
          {/* Card: Active Regions */}
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-default/50 pb-3 flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-amber-500" /> Active Directories
            </h3>
            
            {/* Regions list */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {regions.map((reg) => (
                <div
                  key={reg.code}
                  className="p-3 rounded-xl bg-bg-base border border-border-default flex items-center justify-between text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] font-bold text-text-muted bg-bg-alt border border-border-default px-1.5 py-0.5 rounded">
                      {reg.code}
                    </span>
                    <span className="text-text-primary">{reg.name}</span>
                  </div>
                  <Button
                    onClick={() => handleRemoveRegion(reg.code, reg.name)}
                    size="icon-sm"
                    variant="ghost"
                    className="h-7 w-7 text-text-muted hover:text-rose-500 hover:bg-bg-elevated rounded"
                    title="Remove region"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Region form */}
            <form onSubmit={handleAddRegion} className="space-y-3.5 pt-4 border-t border-border-default/60 text-xs font-medium">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Add Region Directory</span>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Code (e.g. CA)"
                  value={newRegionCode}
                  onChange={(e) => setNewRegionCode(e.target.value)}
                  className="h-9 border-border-default bg-bg-base text-xs uppercase"
                  maxLength={3}
                />
                <Input
                  placeholder="Name (e.g. Canada)"
                  value={newRegionName}
                  onChange={(e) => setNewRegionName(e.target.value)}
                  className="h-9 border-border-default bg-bg-base text-xs col-span-2"
                />
              </div>
              <Button type="submit" size="sm" className="w-full h-9 rounded-xl bg-bg-base hover:bg-bg-elevated text-text-secondary hover:text-text-primary font-bold border border-border-default hover:border-border-subtle flex items-center justify-center gap-1 mt-1">
                <Plus className="h-4 w-4" /> Add Region
              </Button>
            </form>
          </div>

          {/* Card: Danger Zone */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 sm:p-6 shadow-sm space-y-3.5">
            <h4 className="font-heading text-xs font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" /> Danger System Zone
            </h4>
            <p className="text-[10px] text-text-muted leading-relaxed font-body">
              Forced cleanup and diagnostics procedures directly wipe local database settings parameters. Use with developer authorization.
            </p>
            <div className="flex flex-col gap-2 pt-1.5">
              <Button
                onClick={() => {
                  toast.success("Cache clean completed");
                }}
                size="sm"
                variant="outline"
                className="w-full h-9 rounded-xl border-rose-600/30 text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-bold"
              >
                Clear Redis Buffers
              </Button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
