"use client";

import * as React from "react";
import { Settings, ToggleLeft, ToggleRight, Globe, AlertTriangle, Building, FileText, CheckCircle2, Plus, Trash2, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.status === "success" && data.data) {
          setVerificationLinks({
            backgroundCheckUrl: data.data.backgroundCheckUrl || "https://check.brandestate.com/test-bg-report",
            creditScoreCheckUrl: data.data.creditScoreCheckUrl || "https://check.brandestate.com/test-credit-score",
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
