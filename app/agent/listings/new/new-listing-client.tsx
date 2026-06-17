"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building, Plus, ArrowLeft, ArrowRight, Check, MapPin, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useAuth } from "@/lib/auth-context";

const WIZARD_STEPS = [
  { id: 1, name: "Basic Info", desc: "Title, description, category and price" },
  { id: 2, name: "Location", desc: "Address, city, region and maps" },
  { id: 3, name: "Details & Specs", desc: "Beds, baths, size and amenities" },
  { id: 4, name: "Media Assets", desc: "Drag-and-drop images mockup" },
  { id: 5, name: "Review & Publish", desc: "Inspect summary and publish" },
];

export function NewListingClient() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // Form parameters state
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    category: "apartment",
    price: "",
    currency: "USD",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    lat: "40.7128",
    lng: "-74.0060",
    bedrooms: "2",
    bathrooms: "2",
    squareFeet: "1200",
    yearBuilt: "2020",
    amenities: [] as string[],
    images: [] as string[],
  });

  if (currentUser && currentUser.role === "agent" && currentUser.status !== "active") {
    return (
      <div className="max-w-xl mx-auto py-12 px-6 rounded-2xl border border-border-default bg-bg-surface text-center space-y-6 my-8 shadow-sm animate-fade-in">
        <div className="h-16 w-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <Building className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold font-heading text-text-primary">Listing Capabilities Locked</h1>
          <p className="text-sm text-text-secondary font-medium leading-relaxed">
            {currentUser.status === "unsubmitted"
              ? "You must submit your legal documents and verify your credentials before you can create property listings on the platform."
              : "Your legal documents have been submitted and are currently pending administrator review. You will be notified once approved."}
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          {currentUser.status === "unsubmitted" ? (
            <Button render={<Link href="/agent/submit-docs" />} className="bg-accent-primary text-white hover:bg-accent-primary-hov rounded-full px-6 h-10 font-bold cursor-pointer animate-fade-in">
              Submit Legal Documents
            </Button>
          ) : (
            <Button render={<Link href="/agent/dashboard" />} variant="outline" className="border-border-default text-text-secondary rounded-full px-6 h-10 font-bold cursor-pointer">
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>
    );
  }

  const availableAmenities = [
    "Swimming Pool",
    "Fitness Gym",
    "Private Garden",
    "Security System",
    "Underground Parking",
    "Rooftop Terrace",
    "Elevator",
    "Smart Home Integration"
  ];

  const handleAmenityToggle = (amenity: string) => {
    setForm(prev => {
      const current = prev.amenities;
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!form.title.trim() || !form.description.trim() || !form.price.trim()) {
        toast.error("Validation error", { description: "Please fill in title, description, and price." });
        return;
      }
    } else if (step === 2) {
      if (!form.address.trim() || !form.city.trim() || !form.state.trim()) {
        toast.error("Validation error", { description: "Address, city, and state/region are required." });
        return;
      }
    }
    
    setStep(s => Math.min(5, s + 1));
  };

  const handleBack = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const handlePublish = (status: "active" | "draft") => {
    setLoading(true);
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: status === "active" ? "Publishing property listing..." : "Saving draft listing...",
        success: () => {
          setLoading(false);
          router.push("/agent/listings");
          return status === "active"
            ? "Property listed successfully! It is now active on the public catalog. 🚀"
            : "Listing saved as draft. You can edit and approve it later.";
        },
        error: "Failed to create listing."
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      <div className="flex items-center gap-4 border-b border-border-default/60 pb-5">
        <Button render={<Link href="/agent/listings" />} size="icon-sm" variant="ghost" className="h-9 w-9 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg cursor-pointer">
          <span className="flex items-center justify-center w-full h-full">
            <ArrowLeft className="h-4.5 w-4.5" />
          </span>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">Create New Listing</h1>
          <p className="text-xs text-text-muted font-medium font-body">Publish new property listings onto the public search catalog</p>
        </div>
      </div>

      {/* ── Wizard Progress Bar ── */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-4 select-none">
        {WIZARD_STEPS.map((ws) => {
          const isCompleted = ws.id < step;
          const isActive = ws.id === step;
          
          return (
            <div key={ws.id} className="space-y-2">
              <div className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                isCompleted ? "bg-accent-primary" :
                isActive ? "bg-accent-primary/50 shadow-[0_0_8px_rgba(0,103,210,0.4)]" :
                "bg-border-default"
              )} />
              <span className={cn(
                "hidden md:block text-[10px] font-bold uppercase tracking-wider",
                isActive ? "text-accent-primary" : "text-text-faint"
              )}>
                Step {ws.id}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Active Wizard Panel Card ── */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-8 shadow-xl space-y-6">
        <div>
          <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest block font-mono">Step {step} of 5</span>
          <h2 className="text-base sm:text-lg font-bold text-text-primary mt-1">{WIZARD_STEPS[step - 1].name}</h2>
          <p className="text-xs text-text-muted font-semibold font-body mt-0.5">{WIZARD_STEPS[step - 1].desc}</p>
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Property Listing Title *</label>
              <Input
                placeholder="e.g. Modern Penthouse with Panoramic Views"
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Description & Narrative *</label>
              <textarea
                placeholder="Describe key selling points, layout features, and local neighborhood summaries..."
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                rows={5}
                className="w-full text-sm border bg-bg-base text-text-primary border-border-default rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                  className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">Detached House</option>
                  <option value="room_share">Shared Room</option>
                  <option value="commercial">Commercial Space</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm(p => ({ ...p, currency: e.target.value }))}
                  className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AED">AED (Dh)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Price (numeric) *</label>
                <Input
                  type="number"
                  placeholder="e.g. 850000"
                  value={form.price}
                  onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Street Address *</label>
              <Input
                placeholder="e.g. 742 Evergreen Terrace"
                value={form.address}
                onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))}
                className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">City *</label>
                <Input
                  placeholder="e.g. New York"
                  value={form.city}
                  onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">State / Region *</label>
                <Input
                  placeholder="e.g. NY"
                  value={form.state}
                  onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Zip / Postal Code</label>
                <Input
                  placeholder="e.g. 10001"
                  value={form.zipCode}
                  onChange={(e) => setForm(p => ({ ...p, zipCode: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Latitude Coord</label>
                <Input
                  value={form.lat}
                  onChange={(e) => setForm(p => ({ ...p, lat: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Longitude Coord</label>
                <Input
                  value={form.lng}
                  onChange={(e) => setForm(p => ({ ...p, lng: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Static Maps Mockup preview */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border-default bg-bg-alt/40 flex flex-col items-center justify-center p-6 text-center select-none shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-15" />
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className="h-9 w-9 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary animate-pulse">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase mt-1">Geographic Coordinates Preview</span>
                <span className="text-[11px] font-mono text-text-secondary font-semibold">Lat: {form.lat} · Lng: {form.lng}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Details */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Bedrooms</label>
                <Input
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => setForm(p => ({ ...p, bedrooms: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Bathrooms</label>
                <Input
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => setForm(p => ({ ...p, bathrooms: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Size (sq ft)</label>
                <Input
                  type="number"
                  value={form.squareFeet}
                  onChange={(e) => setForm(p => ({ ...p, squareFeet: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Year Built</label>
                <Input
                  type="number"
                  value={form.yearBuilt}
                  onChange={(e) => setForm(p => ({ ...p, yearBuilt: e.target.value }))}
                  className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Amenities & Features</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => {
                  const isChecked = form.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer select-none",
                        isChecked
                          ? "bg-accent-primary/8 border-accent-primary/20 text-accent-primary"
                          : "bg-bg-base border-border-default text-text-secondary hover:border-border-subtle"
                      )}
                    >
                      <span>{amenity}</span>
                      {isChecked && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Media Mock */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="border-2 border-dashed border-border-default rounded-2xl p-8 bg-bg-alt/30 text-center flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-border-subtle transition-colors">
              <div className="h-12 w-12 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-text-primary">Drag and drop photos here</h4>
                <p className="text-[10px] text-text-muted leading-normal max-w-xs font-semibold">
                  Support JPEG, PNG, or WebP. Aspect ratio 4:3 recommended. Limit 10MB per file.
                </p>
              </div>
              <Button size="sm" variant="outline" className="h-8 rounded-xl border-border-default hover:bg-bg-elevated text-xs text-text-secondary px-4 mt-2">
                Browse Files
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80"
              ].map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border-default group shadow-inner">
                  <img src={img} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase backdrop-blur-sm">
                    {idx === 0 ? "Cover" : `Photo ${idx + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Review */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-bg-alt/40 border border-border-default flex gap-4 items-start">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">Listing Ready for Review</h4>
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed font-semibold">
                  Please confirm that the pricing details and address details listed below are correct before submitting to administration reviewers.
                </p>
              </div>
            </div>

            {/* Summary details list */}
            <div className="rounded-xl border border-border-default bg-bg-alt/30 p-5 space-y-4 text-xs font-medium">
              <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                <span className="text-text-muted">Property Title</span>
                <span className="font-bold text-text-primary truncate max-w-[200px]">{form.title}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                <span className="text-text-muted">Zoning Category</span>
                <span className="font-bold text-text-primary capitalize">{form.category}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                <span className="text-text-muted">Financial Price</span>
                <span className="font-bold text-accent-primary font-mono">{form.currency} {Number(form.price).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                <span className="text-text-muted">Street Location</span>
                <span className="font-bold text-text-primary">{form.address}, {form.city}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                <span className="text-text-muted">Layout Metrics</span>
                <span className="font-bold text-text-primary">{form.bedrooms} Bed · {form.bathrooms} Bath · {form.squareFeet} sq ft</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.amenities.map(a => (
                  <span key={a} className="bg-accent-primary/8 text-accent-primary border border-accent-primary/15 text-[9px] font-bold px-2 py-0.5 rounded-md">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="border-t border-border-default pt-5 flex justify-between gap-4">
          <Button
            type="button"
            disabled={step === 1 || loading}
            onClick={handleBack}
            variant="outline"
            className="h-10 rounded-xl border-border-default text-text-secondary hover:bg-bg-elevated cursor-pointer"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          
          {step < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-6 cursor-pointer"
            >
              Next Step <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={loading}
                onClick={() => handlePublish("draft")}
                variant="outline"
                className="h-10 rounded-xl border-border-default text-text-secondary hover:bg-bg-elevated cursor-pointer"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={() => handlePublish("active")}
                className="h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-6 cursor-pointer"
              >
                Publish Listing
              </Button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
