"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building, ArrowLeft, ArrowRight, Check, MapPin, UploadCloud, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MockProperty } from "@/src/mocks/propertyTypes";

interface EditListingClientProps {
  property: MockProperty;
}

const WIZARD_STEPS = [
  { id: 1, name: "Basic Info", desc: "Title, description, category and price" },
  { id: 2, name: "Location", desc: "Address, city, region and maps" },
  { id: 3, name: "Details & Specs", desc: "Beds, baths, size and amenities" },
  { id: 4, name: "Media Assets", desc: "Drag-and-drop images mockup" },
  { id: 5, name: "Review & Save", desc: "Inspect summary and save updates" },
];

export function EditListingClient({ property }: EditListingClientProps) {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // Form parameters state initialized with listing data
  const [form, setForm] = React.useState({
    title: property.title || "",
    description: property.description || "",
    category: property.propertyCategory || "apartment",
    price: property.price ? property.price.toString() : "",
    currency: property.currency || "USD",
    address: property.formattedAddress || "",
    city: property.city || "",
    state: property.state || "",
    zipCode: property.zipCode || "",
    lat: property._geo ? property._geo.lat.toString() : "40.7128",
    lng: property._geo ? property._geo.lng.toString() : "-74.0060",
    bedrooms: property.bedrooms ? property.bedrooms.toString() : "2",
    bathrooms: property.bathrooms ? property.bathrooms.toString() : "2",
    squareFeet: property.squareFeet ? property.squareFeet.toString() : "1200",
    yearBuilt: property.yearBuilt ? property.yearBuilt.toString() : "2020",
    amenities: (property as any).amenities || [
      "Security System",
      "Elevator"
    ],
    images: property.images || [],
  });

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
        return { ...prev, amenities: current.filter((a: string) => a !== amenity) };
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
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveChanges = (status: "draft" | "active") => {
    setLoading(true);

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Saving listing modifications...",
        success: () => {
          setLoading(false);
          router.push("/agent/listings");
          return `Listing updates saved successfully as ${status === "active" ? "active" : "draft"}! 🚀`;
        },
        error: "Failed to update listing."
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      <div className="flex items-center gap-4 border-b border-slate-800/60 pb-5">
        <Button render={<Link href="/agent/listings" />} size="icon-sm" variant="ghost" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
          <span className="flex items-center justify-center w-full h-full">
            <ArrowLeft className="h-4.5 w-4.5" />
          </span>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">Edit Listing</h1>
          <p className="text-xs text-slate-500 font-medium font-body">Modify existing property details of "{property.title}"</p>
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
                "h-1.5 sm:h-2 w-full rounded-full transition-all duration-300",
                isActive ? "bg-accent-primary shadow-[0_0_8px_rgba(0,103,210,0.4)]" :
                isCompleted ? "bg-accent-primary/50" : "bg-slate-800"
              )} />
              <span className={cn(
                "hidden sm:block text-[10px] font-bold tracking-tight transition-colors truncate",
                isActive ? "text-accent-primary" : "text-slate-500"
              )}>
                {ws.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Main form viewcard ── */}
      <div className="rounded-3xl border border-slate-800/60 bg-[#0A101C] p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Property Title *</label>
              <Input
                placeholder="e.g. Modern Minimalist Penthouse"
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Detailed Description *</label>
              <textarea
                placeholder="Write description detailing amenities, accessibility, and unique features..."
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                rows={5}
                className="w-full text-xs font-medium border bg-[#0F1829] text-slate-200 border-slate-850 rounded-2xl p-4 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zoning Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(p => ({ ...p, category: e.target.value as any }))}
                  className="h-10 w-full text-sm text-slate-250 bg-[#0F1829] border border-slate-850 rounded-xl px-3 focus:outline-none focus:ring-1"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House / Villa</option>
                  <option value="room_share">Shared Room</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valuta</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm(p => ({ ...p, currency: e.target.value as any }))}
                    className="h-10 w-full text-sm text-slate-250 bg-[#0F1829] border border-slate-850 rounded-xl px-3 focus:outline-none focus:ring-1"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AED">AED (Dh)</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Price (numeric) *</label>
                  <Input
                    type="number"
                    placeholder="e.g. 850000"
                    value={form.price}
                    onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))}
                    className="h-10 border-slate-855 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Street Address *</label>
              <Input
                placeholder="e.g. 742 Evergreen Terrace"
                value={form.address}
                onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))}
                className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">City *</label>
                <Input
                  placeholder="e.g. New York"
                  value={form.city}
                  onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))}
                  className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">State / Region *</label>
                <Input
                  placeholder="e.g. NY"
                  value={form.state}
                  onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))}
                  className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zip / Postal Code</label>
                <Input
                  placeholder="e.g. 10001"
                  value={form.zipCode}
                  onChange={(e) => setForm(p => ({ ...p, zipCode: e.target.value }))}
                  className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Latitude Coord</label>
                <Input
                  value={form.lat}
                  onChange={(e) => setForm(p => ({ ...p, lat: e.target.value }))}
                  className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Longitude Coord</label>
                <Input
                  value={form.lng}
                  onChange={(e) => setForm(p => ({ ...p, lng: e.target.value }))}
                  className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Static Maps Mockup preview */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40" />
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className="h-9 w-9 rounded-full bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary animate-pulse">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Geographic Coordinates Preview</span>
                <span className="text-[11px] font-mono text-slate-500">Lat: {form.lat} · Lng: {form.lng}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Details */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bedrooms</label>
                <Input
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => setForm(p => ({ ...p, bedrooms: e.target.value }))}
                  className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bathrooms</label>
                <Input
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => setForm(p => ({ ...p, bathrooms: e.target.value }))}
                  className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Size (sq ft)</label>
                <Input
                  type="number"
                  value={form.squareFeet}
                  onChange={(e) => setForm(p => ({ ...p, squareFeet: e.target.value }))}
                  className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Year Built</label>
                <Input
                  type="number"
                  value={form.yearBuilt}
                  onChange={(e) => setForm(p => ({ ...p, yearBuilt: e.target.value }))}
                  className="h-10 border-slate-850 bg-[#0F1829] text-slate-200 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Amenities & Features</label>
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
                          : "bg-[#0F1829] border-slate-855 text-slate-400 hover:border-slate-800"
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
            <div className="border-2 border-dashed border-slate-800/80 rounded-2xl p-8 bg-[#0F1829]/10 text-center flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-slate-700/80 transition-colors">
              <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Drag and drop photos here</h4>
                <p className="text-[10px] text-slate-500 leading-normal max-w-xs font-medium">
                  Support JPEG, PNG, or WebP. Aspect ratio 4:3 recommended. Limit 10MB per file.
                </p>
              </div>
              <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-800 hover:bg-slate-800 text-xs text-slate-350 px-4 mt-2">
                Browse Files
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {form.images.slice(0, 3).map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 group shadow-inner">
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
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex gap-4 items-start">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Review Updates</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Please verify all configurations below. Confirming changes will update the listing preview in the agent catalog.
                </p>
              </div>
            </div>

            {/* Summary details list */}
            <div className="rounded-xl border border-slate-800 bg-[#0F1829]/35 p-5 space-y-4 text-xs font-medium">
              <div className="flex justify-between items-center py-1 border-b border-slate-850">
                <span className="text-slate-500">Property Title</span>
                <span className="font-bold text-white truncate max-w-[200px]">{form.title}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-850">
                <span className="text-slate-500">Zoning Category</span>
                <span className="font-bold text-white capitalize">{form.category}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-850">
                <span className="text-slate-500">Financial Price</span>
                <span className="font-bold text-accent-primary font-mono">{form.currency} {Number(form.price).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-850">
                <span className="text-slate-500">Street Location</span>
                <span className="font-bold text-white">{form.address}, {form.city}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-850">
                <span className="text-slate-500">Layout Metrics</span>
                <span className="font-bold text-white">{form.bedrooms} Bed · {form.bathrooms} Bath · {form.squareFeet} sq ft</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.amenities.map((a: string) => (
                  <span key={a} className="bg-accent-primary/8 text-accent-primary border border-accent-primary/15 text-[9px] font-bold px-2 py-0.5 rounded-md">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="border-t border-slate-800/60 pt-5 flex justify-between gap-4">
          <Button
            type="button"
            disabled={step === 1 || loading}
            onClick={handleBack}
            variant="outline"
            className="h-10 rounded-xl border-slate-800 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          
          {step < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-6"
            >
              Next Step <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={loading}
                onClick={() => handleSaveChanges("draft")}
                variant="outline"
                className="h-10 rounded-xl border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={() => handleSaveChanges("active")}
                className="h-10 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hov font-bold px-6"
              >
                Save Updates
              </Button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
