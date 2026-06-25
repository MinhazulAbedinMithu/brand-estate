"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building, Plus, ArrowLeft, ArrowRight, Check, MapPin, CheckCircle2, Trash, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useAuth } from "@/lib/auth-context";
import { ImageUploader } from "@/components/blog/image-uploader";
import { TagInput } from "@/components/blog/tag-input";

const WIZARD_STEPS = [
  { id: 1, name: "Basic Info", desc: "Title, description, category and price" },
  { id: 2, name: "Location", desc: "Address, city, region and maps" },
  { id: 3, name: "Details & Specs", desc: "Beds, baths, size and amenities" },
  { id: 4, name: "Media Assets", desc: "Drag-and-drop cover & gallery" },
  { id: 5, name: "SEO Settings", desc: "Optimize title, tags, and social cards" },
  { id: 6, name: "Review & Publish", desc: "Inspect summary and publish" },
];

const BEDROOM_OPTIONS = [
  { label: "Studio", value: "0" },
  { label: "1 Bed", value: "1" },
  { label: "2 Beds", value: "2" },
  { label: "3 Beds", value: "3" },
  { label: "4 Beds", value: "4" },
  { label: "5+ Beds", value: "5" },
];

const BATHROOM_OPTIONS = [
  { label: "1 Bath", value: "1" },
  { label: "1.5 Baths", value: "1.5" },
  { label: "2 Baths", value: "2" },
  { label: "2.5 Baths", value: "2.5" },
  { label: "3 Baths", value: "3" },
  { label: "4+ Baths", value: "4" },
];

export function NewListingClient() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const [syncTitle, setSyncTitle] = React.useState(true);
  const [syncDesc, setSyncDesc] = React.useState(true);
  const [syncKeywords, setSyncKeywords] = React.useState(true);

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
    coverImage: "",
    images: [] as string[], // gallery images
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogImageUrl: "",
    useCoverAsOg: true,
    videoTourUrl: "",
    virtualTourUrl: "",
    neighborhoodNotes: "",

    // Category specific details state:
    // Apartment
    aptFloorNumber: "1",
    aptTotalFloors: "5",
    aptMaintenanceFee: "0",
    aptHasElevator: true,
    aptParkingSlot: "",
    
    // House
    hseLotAcres: "0.25",
    hseLotSqFt: "10890",
    hseGarageSpaces: "2",
    hseRoofType: "asphalt_shingle",
    hseFoundationType: "concrete_slab",
    hseHVAC: "Central HVAC System",
    hseBackyardSqFt: "1500",
    
    // RoomShare
    rmShareType: "private",
    rmBathType: "common",
    rmOccupants: "1",
    rmGender: "any",
    rmUtilities: [] as string[], // wifi, gas, water, electricity, cable, trash
    rmMinLease: "6",
    
    // Commercial
    commZoning: "office",
    commLoadingDocks: "0",
    commCeilingHeight: "12",
    commMinLeaseYears: "3",
    commElectricCapacity: "200A / 3-Phase",
  });

  if (currentUser && currentUser.role === "owner" && currentUser.status !== "active") {
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
            <Button render={<Link href="/owner/submit-docs" />} className="bg-accent-primary text-white hover:bg-accent-primary-hov rounded-full px-6 h-10 font-bold cursor-pointer animate-fade-in">
              Submit Legal Documents
            </Button>
          ) : (
            <Button render={<Link href="/owner/dashboard" />} variant="outline" className="border-border-default text-text-secondary rounded-full px-6 h-10 font-bold cursor-pointer">
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
      const nextAmenities = current.includes(amenity)
        ? current.filter(a => a !== amenity)
        : [...current, amenity];
      return {
        ...prev,
        amenities: nextAmenities,
        seoKeywords: syncKeywords ? nextAmenities.join(", ") : prev.seoKeywords
      };
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
    } else if (step === 4) {
      if (!form.coverImage.trim()) {
        toast.error("Validation error", { description: "Please upload or link a Cover Image in Step 4 before proceeding." });
        return;
      }
    }
    
    setStep(s => Math.min(6, s + 1));
  };

  const handleBack = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const handlePublish = async (status: "active" | "draft") => {
    setLoading(true);
    
    // Construct request payload
    const payload = {
      title: form.title,
      description: form.description,
      transactionType: form.category === "room_share" ? "roommate_share" : (parseInt(form.price) < 25000 ? "rent" : "buy"),
      propertyCategory: form.category,
      price: parseInt(form.price, 10) || 0,
      currency: form.currency,
      formattedAddress: form.address,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      latitude: parseFloat(form.lat),
      longitude: parseFloat(form.lng),
      squareFeet: parseInt(form.squareFeet, 10) || 0,
      bedrooms: parseInt(form.bedrooms, 10) || 0,
      bathrooms: parseFloat(form.bathrooms) || 0,
      yearBuilt: parseInt(form.yearBuilt, 10) || 2020,
      images: [form.coverImage, ...form.images].filter(Boolean),
      status: status === "active" ? "pending_approval" : "draft", // for agent publishing
      videoTourUrl: form.videoTourUrl || null,
      virtualTourUrl: form.virtualTourUrl || null,
      neighborhoodNotes: form.neighborhoodNotes || "",
      seo: {
        seoTitle: form.seoTitle || form.title,
        metaDescription: form.seoDescription || form.description,
        ogImageUrl: form.useCoverAsOg ? form.coverImage : form.ogImageUrl,
        keywords: form.seoKeywords ? form.seoKeywords.split(",").map(k => k.trim()).filter(Boolean) : []
      },
      amenities: form.amenities,
      
      // Category specific
      apartment: form.category === "apartment" ? {
        floorNumber: parseInt(form.aptFloorNumber, 10) || 1,
        totalBuildingFloors: parseInt(form.aptTotalFloors, 10) || 1,
        monthlyMaintenanceFee: parseInt(form.aptMaintenanceFee, 10) || 0,
        hasElevator: !!form.aptHasElevator,
        parkingSlotNumber: form.aptParkingSlot || null
      } : undefined,
      house: form.category === "house" ? {
        lotSizeAcres: parseFloat(form.hseLotAcres) || 0,
        lotSizeSqFt: parseInt(form.hseLotSqFt, 10) || 0,
        garageSpacesCount: parseInt(form.hseGarageSpaces, 10) || 0,
        roofType: form.hseRoofType,
        foundationType: form.hseFoundationType,
        heatingCoolingSystem: form.hseHVAC,
        backyardAreaSqFt: parseInt(form.hseBackyardSqFt, 10) || 0
      } : undefined,
      roomShare: form.category === "room_share" ? {
        roomType: form.rmShareType,
        bathroomType: form.rmBathType,
        currentOccupantsCount: parseInt(form.rmOccupants, 10) || 0,
        preferredGender: form.rmGender,
        utilitiesIncluded: form.rmUtilities,
        minimumLeasePeriodMonths: parseInt(form.rmMinLease, 10) || 1
      } : undefined,
      commercial: form.category === "commercial" ? {
        zoningCode: form.commZoning,
        loadingDocksCount: parseInt(form.commLoadingDocks, 10) || 0,
        ceilingHeightFt: parseInt(form.commCeilingHeight, 10) || 0,
        minimumLeaseTermYears: parseInt(form.commMinLeaseYears, 10) || 1,
        electricalCapacity: form.commElectricCapacity
      } : undefined
    };

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        toast.success(status === "active" ? "Property listing submitted for review! 🚀" : "Draft listing saved.");
        router.push('/owner/listings');
      } else {
        toast.error("Submission failed", { description: result.message || "Could not list property." });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error", { description: "An unexpected network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      <div className="flex items-center gap-4 border-b border-border-default/60 pb-5">
        <Button render={<Link href="/owner/listings" />} size="icon-sm" variant="ghost" className="h-9 w-9 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg cursor-pointer">
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
      <div className="grid grid-cols-6 gap-2.5 sm:gap-4 select-none">
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
          <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest block font-mono">Step {step} of 6</span>
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
                onChange={(e) => {
                  const val = e.target.value;
                  setForm(p => ({
                    ...p,
                    title: val,
                    seoTitle: syncTitle ? val : p.seoTitle
                  }));
                }}
                className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Description & Narrative *</label>
              <textarea
                placeholder="Describe key selling points, layout features, and local neighborhood summaries..."
                value={form.description}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm(p => ({
                    ...p,
                    description: val,
                    seoDescription: syncDesc ? val.slice(0, 155) : p.seoDescription
                  }));
                }}
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
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((opt) => {
                    const isSelected = form.bedrooms === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, bedrooms: opt.value }))}
                        className={cn(
                          "h-10 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none",
                          isSelected
                            ? "bg-accent-primary border-accent-primary text-white shadow-md shadow-accent-primary/20 scale-[1.02]"
                            : "bg-bg-base border-border-default text-text-secondary hover:border-border-subtle"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Bathrooms</label>
                <div className="flex flex-wrap gap-2">
                  {BATHROOM_OPTIONS.map((opt) => {
                    const isSelected = form.bathrooms === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, bathrooms: opt.value }))}
                        className={cn(
                          "h-10 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none",
                          isSelected
                            ? "bg-accent-primary border-accent-primary text-white shadow-md shadow-accent-primary/20 scale-[1.02]"
                            : "bg-bg-base border-border-default text-text-secondary hover:border-border-subtle"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Neighborhood Notes</label>
              <textarea
                placeholder="Describe local neighborhood details, transit access, nearby schools, parks, or community vibes..."
                value={form.neighborhoodNotes}
                onChange={(e) => setForm(p => ({ ...p, neighborhoodNotes: e.target.value }))}
                rows={3}
                className="w-full text-sm border bg-bg-base text-text-primary border-border-default rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none font-medium"
              />
            </div>

            {/* ── Category-Specific Attributes ── */}
            <div className="border-t border-border-default/50 pt-6 space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider block">Category Specifications: {form.category.replace("_", " ")}</h3>
              
              {form.category === "apartment" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-left">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Floor Number *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 4"
                      value={form.aptFloorNumber}
                      onChange={(e) => setForm(p => ({ ...p, aptFloorNumber: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Building Floors *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 12"
                      value={form.aptTotalFloors}
                      onChange={(e) => setForm(p => ({ ...p, aptTotalFloors: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Monthly Maintenance Fee *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 250"
                      value={form.aptMaintenanceFee}
                      onChange={(e) => setForm(p => ({ ...p, aptMaintenanceFee: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Parking Slot Number</label>
                    <Input
                      placeholder="e.g. P-402 (leave blank if none)"
                      value={form.aptParkingSlot}
                      onChange={(e) => setForm(p => ({ ...p, aptParkingSlot: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="flex items-center justify-between col-span-2 p-3 bg-bg-alt/30 border border-border-default/45 rounded-xl">
                    <div className="space-y-0.5 text-left">
                      <span className="text-xs font-bold text-text-primary">Has Elevator</span>
                      <p className="text-[10px] text-text-muted">Is elevator service available in the building?</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, aptHasElevator: !p.aptHasElevator }))}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        form.aptHasElevator ? "bg-accent-primary" : "bg-border-default"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          form.aptHasElevator ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>
              )}

              {form.category === "house" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-left">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Lot Size (Acres) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 0.35"
                      value={form.hseLotAcres}
                      onChange={(e) => setForm(p => ({ ...p, hseLotAcres: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Lot Size (Sq Ft) *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 15240"
                      value={form.hseLotSqFt}
                      onChange={(e) => setForm(p => ({ ...p, hseLotSqFt: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Garage Spaces *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 2"
                      value={form.hseGarageSpaces}
                      onChange={(e) => setForm(p => ({ ...p, hseGarageSpaces: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Roof Type *</label>
                    <select
                      value={form.hseRoofType}
                      onChange={(e) => setForm(p => ({ ...p, hseRoofType: e.target.value }))}
                      className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                    >
                      <option value="asphalt_shingle">Asphalt Shingle</option>
                      <option value="metal">Metal</option>
                      <option value="clay_tile">Clay Tile</option>
                      <option value="flat">Flat</option>
                      <option value="slate">Slate</option>
                      <option value="wood_shake">Wood Shake</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Foundation Type *</label>
                    <select
                      value={form.hseFoundationType}
                      onChange={(e) => setForm(p => ({ ...p, hseFoundationType: e.target.value }))}
                      className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                    >
                      <option value="concrete_slab">Concrete Slab</option>
                      <option value="crawl_space">Crawl Space</option>
                      <option value="full_basement">Full Basement</option>
                      <option value="pier_and_beam">Pier & Beam</option>
                      <option value="stem_wall">Stem Wall</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">HVAC / Heating System *</label>
                    <Input
                      placeholder="e.g. Carrier Central HVAC"
                      value={form.hseHVAC}
                      onChange={(e) => setForm(p => ({ ...p, hseHVAC: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Backyard Area (Sq Ft) *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 2000"
                      value={form.hseBackyardSqFt}
                      onChange={(e) => setForm(p => ({ ...p, hseBackyardSqFt: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                </div>
              )}

              {form.category === "room_share" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-left">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Room Style *</label>
                    <select
                      value={form.rmShareType}
                      onChange={(e) => setForm(p => ({ ...p, rmShareType: e.target.value }))}
                      className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                    >
                      <option value="private">Private Room</option>
                      <option value="shared">Shared Room</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Bathroom Type *</label>
                    <select
                      value={form.rmBathType}
                      onChange={(e) => setForm(p => ({ ...p, rmBathType: e.target.value }))}
                      className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                    >
                      <option value="attached">Attached (Private)</option>
                      <option value="common">Common (Shared)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Current Roommates Count *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 2"
                      value={form.rmOccupants}
                      onChange={(e) => setForm(p => ({ ...p, rmOccupants: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Gender Preference *</label>
                    <select
                      value={form.rmGender}
                      onChange={(e) => setForm(p => ({ ...p, rmGender: e.target.value }))}
                      className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                    >
                      <option value="any">No Preference (Any)</option>
                      <option value="male">Male Only</option>
                      <option value="female">Female Only</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Min Lease Period (Months) *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 6"
                      value={form.rmMinLease}
                      onChange={(e) => setForm(p => ({ ...p, rmMinLease: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 col-span-2 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Utilities Included</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {["wifi", "gas", "water", "electricity", "cable", "trash"].map((util) => {
                        const isChecked = form.rmUtilities.includes(util);
                        return (
                          <button
                            key={util}
                            type="button"
                            onClick={() => {
                              setForm(p => {
                                const exists = p.rmUtilities.includes(util);
                                return {
                                  ...p,
                                  rmUtilities: exists
                                    ? p.rmUtilities.filter(u => u !== util)
                                    : [...p.rmUtilities, util]
                                };
                              });
                            }}
                            className={cn(
                              "p-2 border rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer",
                              isChecked
                                ? "bg-accent-primary/10 border-accent-primary/20 text-accent-primary"
                                : "bg-bg-base border-border-default text-text-secondary"
                            )}
                          >
                            <span className="capitalize">{util}</span>
                            {isChecked && <Check className="h-3 w-3 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {form.category === "commercial" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-left">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Zoning Classification *</label>
                    <select
                      value={form.commZoning}
                      onChange={(e) => setForm(p => ({ ...p, commZoning: e.target.value }))}
                      className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                    >
                      <option value="retail">Retail Space</option>
                      <option value="office">Office Space</option>
                      <option value="industrial">Industrial Space</option>
                      <option value="warehouse">Warehouse</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Loading Docks *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 2"
                      value={form.commLoadingDocks}
                      onChange={(e) => setForm(p => ({ ...p, commLoadingDocks: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Ceiling Height (Feet) *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 16"
                      value={form.commCeilingHeight}
                      onChange={(e) => setForm(p => ({ ...p, commCeilingHeight: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Min Lease term (Years) *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 3"
                      value={form.commMinLeaseYears}
                      onChange={(e) => setForm(p => ({ ...p, commMinLeaseYears: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2 text-left">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Electrical Capacity *</label>
                    <Input
                      placeholder="e.g. 400A / 3-Phase 480V"
                      value={form.commElectricCapacity}
                      onChange={(e) => setForm(p => ({ ...p, commElectricCapacity: e.target.value }))}
                      className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Media Assets */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1.5">
              <ImageUploader
                value={form.coverImage}
                onChange={(val) => setForm(p => ({
                  ...p,
                  coverImage: val,
                  ogImageUrl: p.useCoverAsOg ? val : p.ogImageUrl
                }))}
                label="Property Cover Image (Primary Display Photo)"
                required
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-text-secondary">Property Photo Gallery</label>
                <span className="text-[10px] text-text-muted font-bold">{form.images.length} {form.images.length === 1 ? 'photo' : 'photos'} added</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Render existing gallery images */}
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border-default group shadow-inner bg-bg-base">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase backdrop-blur-sm">
                      Photo {idx + 1}
                    </div>
                    {/* Delete trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
                        toast.success("Photo removed", { description: `Gallery photo ${idx + 1} deleted.` });
                      }}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer active:scale-95"
                      title="Delete Image"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {/* File adder cell */}
                <div 
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.multiple = true;
                    input.onchange = async (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (!files || files.length === 0) return;
                      
                      const loadingToastId = toast.loading(`Uploading ${files.length} photo(s) to storage...`);
                      const uploadedUrls: string[] = [];
                      let failedCount = 0;

                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        try {
                          const res = await fetch('/api/upload/presigned', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              filename: file.name,
                              contentType: file.type,
                              folder: 'listings/gallery'
                            })
                          });

                          if (!res.ok) throw new Error('Server upload permission denied.');
                          const data = await res.json();
                          if (data.status !== 'success' || !data.uploadUrl || !data.publicUrl) {
                            throw new Error(data.message || 'Invalid upload credentials.');
                          }

                          const { uploadUrl, publicUrl } = data;

                          const uploadRes = await fetch(uploadUrl, {
                            method: 'PUT',
                            headers: { 'Content-Type': file.type },
                            body: file
                          });

                          if (!uploadRes.ok) throw new Error('Cloud storage rejected upload.');
                          uploadedUrls.push(publicUrl);
                        } catch (err) {
                          console.error(`Failed to upload ${file.name}:`, err);
                          failedCount++;
                        }
                      }

                      toast.dismiss(loadingToastId);

                      if (uploadedUrls.length > 0) {
                        setForm(p => ({ ...p, images: [...p.images, ...uploadedUrls] }));
                        if (failedCount > 0) {
                          toast.warning(`Uploaded ${uploadedUrls.length} photos`, {
                            description: `Failed to upload ${failedCount} photos.`
                          });
                        } else {
                          toast.success("Photos added", { description: `Successfully uploaded ${uploadedUrls.length} photos to gallery.` });
                        }
                      } else {
                        toast.error("Upload failed", { description: "Failed to upload photos to storage." });
                      }
                    };
                    input.click();
                  }}
                  className="border-2 border-dashed border-border-default hover:border-accent-primary rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-bg-base transition-all aspect-video group hover:shadow-sm"
                >
                  <div className="h-7 w-7 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:scale-115 transition-transform">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary">Add Photo(s)</span>
                </div>
              </div>
              
              {/* Preseed Mock button to quickly populate with beautiful Unsplash listings images */}
              {form.images.length === 0 && (
                <div className="pt-1.5 text-left">
                  <button
                    type="button"
                    onClick={() => {
                      const mockPhotos = [
                        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                      ];
                      setForm(p => ({ ...p, images: mockPhotos }));
                      toast.info("Mock gallery populated", { description: "Added 4 premium real estate gallery photos." });
                    }}
                    className="text-[10px] text-accent-primary hover:underline font-bold cursor-pointer"
                  >
                    ⚡ Auto-populate with beautiful real estate demo photos
                  </button>
                </div>
              )}
            </div>

            {/* Video & Virtual Tours */}
            <div className="border-t border-border-default/50 pt-6 space-y-4 text-left">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider block">Interactive Virtual Tours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Video Tour URL</label>
                  <Input
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    value={form.videoTourUrl}
                    onChange={(e) => setForm(p => ({ ...p, videoTourUrl: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">3D Virtual Tour URL</label>
                  <Input
                    placeholder="e.g. https://my.matterport.com/show/?m=..."
                    value={form.virtualTourUrl}
                    onChange={(e) => setForm(p => ({ ...p, virtualTourUrl: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: SEO Settings */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in text-sm font-body">
            <div>
              <h4 className="text-sm font-bold text-text-primary font-heading flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-accent-primary" />
                SEO Search Engine Optimization
              </h4>
              <p className="text-[11px] text-text-muted mt-1 leading-normal font-medium">
                Brand Estate automates metadata mapping by default. Use the toggle switchboard below to override specific SEO and social parameters.
              </p>
            </div>

            {/* ─── Sync Control Switchboard ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-bg-alt/40 p-4 rounded-2xl border border-border-default/60">
              
              {/* Sync Title */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-surface border border-border-default shadow-xs text-left">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-text-primary block">Auto-Sync Title</span>
                  <p className="text-[9px] text-text-muted leading-tight">Use property title for search & social</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSyncTitle(prev => {
                      const nextVal = !prev;
                      if (nextVal) {
                        setForm(p => ({ ...p, seoTitle: p.title }));
                      }
                      return nextVal;
                    });
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none select-none",
                    syncTitle ? "bg-accent-primary" : "bg-border-default"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      syncTitle ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Sync Description */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-surface border border-border-default shadow-xs text-left">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-text-primary block">Auto-Sync Desc</span>
                  <p className="text-[9px] text-text-muted leading-tight">Use description for search engines</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSyncDesc(prev => {
                      const nextVal = !prev;
                      if (nextVal) {
                        setForm(p => ({ ...p, seoDescription: p.description.slice(0, 155) }));
                      }
                      return nextVal;
                    });
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none select-none",
                    syncDesc ? "bg-accent-primary" : "bg-border-default"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      syncDesc ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Sync Keywords */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-surface border border-border-default shadow-xs text-left">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-text-primary block">Auto-Sync Keywords</span>
                  <p className="text-[9px] text-text-muted leading-tight">Use amenities list for target keywords</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSyncKeywords(prev => {
                      const nextVal = !prev;
                      if (nextVal) {
                        setForm(p => ({ ...p, seoKeywords: p.amenities.join(", ") }));
                      }
                      return nextVal;
                    });
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none select-none",
                    syncKeywords ? "bg-accent-primary" : "bg-border-default"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      syncKeywords ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Sync OG Image */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-surface border border-border-default shadow-xs text-left">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-text-primary block">Sync Social Image</span>
                  <p className="text-[9px] text-text-muted leading-tight">Use cover photo for social preview</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm(p => {
                      const nextUseCoverAsOg = !p.useCoverAsOg;
                      const nextOgImageUrl = nextUseCoverAsOg
                        ? p.coverImage
                        : p.ogImageUrl;
                      return {
                        ...p,
                        useCoverAsOg: nextUseCoverAsOg,
                        ogImageUrl: nextOgImageUrl
                      };
                    });
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none select-none",
                    form.useCoverAsOg ? "bg-accent-primary" : "bg-border-default"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      form.useCoverAsOg ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

            </div>

            {/* ─── Google SERP Visual Preview ─── */}
            <div className="border border-border-default rounded-2xl p-5 bg-[#0F172A] text-left shadow-lg select-none space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Google Search Preview (Live)
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-normal truncate leading-tight">
                  brandestate.com/property/{(form.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")) || "listing-slug"}
                </div>
                <div className="text-[17px] text-[#8ab4f8] hover:underline font-normal font-sans leading-snug cursor-pointer truncate">
                  {form.seoTitle.trim() || form.title.trim() || "Untitled Property Listing"}
                </div>
                <div className="text-sm text-slate-300 leading-normal font-normal line-clamp-2 max-w-2xl font-sans">
                  {form.seoDescription.trim() || form.description.trim() || "No meta description has been specified. Search engines will automatically scrape the property details..."}
                </div>
              </div>
            </div>

            {/* ─── Custom SEO Overrides ─── */}
            <div className="space-y-4">
              
              {/* Custom Titles override */}
              {!syncTitle && (
                <div className="space-y-1.5 p-4 rounded-xl border border-border-default bg-bg-surface animate-fade-in text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-secondary">Custom SEO Meta Title</label>
                    <span className={cn(
                      "text-[10px] font-bold font-mono",
                      form.seoTitle.length >= 50 && form.seoTitle.length <= 60
                        ? "text-emerald-500"
                        : "text-text-muted"
                    )}>
                      {form.seoTitle.length}/60 chars
                    </span>
                  </div>
                  <Input
                    placeholder="Custom browser title tag override"
                    value={form.seoTitle}
                    onChange={(e) => setForm(p => ({ ...p, seoTitle: e.target.value.slice(0, 70) }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  />
                  <p className="text-[10px] text-text-muted leading-tight">
                    Recommended length is 50-60 characters. This appears as the clickable link in search engine results.
                  </p>
                </div>
              )}

              {/* Custom Description override */}
              {!syncDesc && (
                <div className="space-y-1.5 p-4 rounded-xl border border-border-default bg-bg-surface animate-fade-in text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-secondary">Custom Meta Description</label>
                    <span className={cn(
                      "text-[10px] font-bold font-mono",
                      form.seoDescription.length >= 150 && form.seoDescription.length <= 160
                        ? "text-emerald-500"
                        : "text-text-muted"
                    )}>
                      {form.seoDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    placeholder="Summarize key features, amenities, and layout advantages to drive search result clicks..."
                    value={form.seoDescription}
                    onChange={(e) => setForm(p => ({ ...p, seoDescription: e.target.value.slice(0, 200) }))}
                    rows={3}
                    className="w-full text-sm border bg-bg-base text-text-primary border-border-default rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none font-medium"
                  />
                  <p className="text-[10px] text-text-muted leading-tight">
                    Recommended length is 150-160 characters. This is displayed as the description snippet on SERP.
                  </p>
                </div>
              )}

              {/* Custom Keywords override */}
              {!syncKeywords && (
                <div className="p-4 rounded-xl border border-border-default bg-bg-surface animate-fade-in text-left">
                  <TagInput
                    value={form.seoKeywords}
                    onChange={(val) => setForm(p => ({ ...p, seoKeywords: val }))}
                    placeholder="Type keywords (e.g. luxury, penthouse, central park) and press comma or enter..."
                    label="Target Search Keywords"
                    labelInfo="(for search engine relevance indexing)"
                    suggestions={["luxury", "modern", "penthouse", "sea-view", "garden", "pool", "renovated", "investment", "near-subway", "quiet", "waterfront"]}
                  />
                </div>
              )}

              {/* Custom OG Image override */}
              {!form.useCoverAsOg && (
                <div className="p-4 rounded-xl border border-border-default bg-bg-surface animate-fade-in text-left">
                  <ImageUploader
                    value={form.ogImageUrl}
                    onChange={(val) => setForm(p => ({ ...p, ogImageUrl: val }))}
                    label="Custom OpenGraph Social Preview Image"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Review & Publish */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-bg-alt/40 border border-border-default flex gap-4 items-start">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">Listing Ready for Review</h4>
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed font-semibold">
                  Please review the details below. Once approved, the property listing will be published and indexable by search engine bots.
                </p>
              </div>
            </div>

            {/* Google Search Engine Preview Snippet */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Google Search Preview</label>
              <div className="border border-border-default bg-bg-base rounded-xl p-4.5 space-y-1.5 font-sans select-none shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-4.5 w-4.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-[9px] text-accent-primary font-bold">
                    BE
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-text-primary font-semibold leading-tight">Brand Estate</span>
                    <span className="text-[9px] text-text-muted leading-tight truncate max-w-[280px]">
                      https://brand-estate.com/property/{form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "new-listing"}
                    </span>
                  </div>
                </div>
                <h4 className="text-base font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug break-words">
                  {form.seoTitle || form.title || "Untitled Property Listing | Brand Estate"}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed break-words font-normal">
                  {form.seoDescription || form.description || "Add a meta description to preview search engine results here..."}
                </p>
              </div>
            </div>

            {/* Summary details list */}
            <div className="rounded-xl border border-border-default bg-bg-alt/30 p-5 space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-muted">Property Title</span>
                    <span className="font-bold text-text-primary truncate max-w-[180px]">{form.title}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-muted">Zoning Category</span>
                    <span className="font-bold text-text-primary capitalize">{form.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-muted">Financial Price</span>
                    <span className="font-bold text-accent-primary font-mono">{form.currency} {Number(form.price).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-muted">Street Location</span>
                    <span className="font-bold text-text-primary truncate max-w-[180px]">{form.address}, {form.city}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-muted">Layout Metrics</span>
                    <span className="font-bold text-text-primary">
                      {form.bedrooms === "0" ? "Studio" : `${form.bedrooms} Bed`} · {form.bathrooms} Bath · {form.squareFeet} sq ft
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-muted">Media Photos</span>
                    <span className="font-bold text-text-primary">
                      Cover + {form.images.length} gallery {form.images.length === 1 ? "photo" : "photos"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extra Interactive Assets & Notes */}
              {(form.videoTourUrl || form.virtualTourUrl || form.neighborhoodNotes) && (
                <div className="pt-4 border-t border-border-default space-y-2 text-left">
                  {form.videoTourUrl && (
                    <div className="flex justify-between items-center py-1 border-b border-border-default/45">
                      <span className="text-text-muted">Video Tour Link</span>
                      <span className="font-bold text-text-primary truncate max-w-[280px]">{form.videoTourUrl}</span>
                    </div>
                  )}
                  {form.virtualTourUrl && (
                    <div className="flex justify-between items-center py-1 border-b border-border-default/45">
                      <span className="text-text-muted">3D Virtual Tour Link</span>
                      <span className="font-bold text-text-primary truncate max-w-[280px]">{form.virtualTourUrl}</span>
                    </div>
                  )}
                  {form.neighborhoodNotes && (
                    <div className="py-1 text-left">
                      <span className="text-text-muted block mb-1">Neighborhood Notes</span>
                      <p className="text-text-secondary leading-relaxed bg-bg-alt/45 p-2.5 rounded-lg text-[11px] font-semibold whitespace-pre-line">{form.neighborhoodNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {form.seoKeywords && (
                <div className="pt-2 border-t border-border-default">
                  <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider mb-1">Target SEO Keywords</span>
                  <div className="flex flex-wrap gap-1">
                    {form.seoKeywords.split(",").map(k => k.trim()).filter(Boolean).map(k => (
                      <span key={k} className="bg-bg-elevated border border-border-default text-text-secondary text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border-default">
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
          
          {step < 6 ? (
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
