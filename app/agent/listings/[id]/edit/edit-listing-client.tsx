"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MapPin, CheckCircle2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { COUNTRIES, COUNTRY_CITIES } from "@/lib/constants";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { MockProperty, PropertyCategory, Currency } from "@/src/mocks/propertyTypes";
import { applyWatermark } from "@/lib/watermark";
import { VideoUploader } from "@/components/shared/video-uploader";

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
    country: property.country || "United States",
    zipCode: property.zipCode || "",
    lat: property._geo ? property._geo.lat.toString() : "40.7128",
    lng: property._geo ? property._geo.lng.toString() : "-74.0060",
    bedrooms: property.bedrooms ? property.bedrooms.toString() : "2",
    bathrooms: property.bathrooms ? property.bathrooms.toString() : "2",
    squareFeet: property.squareFeet ? property.squareFeet.toString() : "1200",
    yearBuilt: property.yearBuilt ? property.yearBuilt.toString() : "2020",
    amenities: property.amenities || [
      "Security System",
      "Elevator"
    ],
    images: property.images || [],
    videoTourUrl: property.videoTourUrl || "",
    virtualTourUrl: property.virtualTourUrl || "",
    neighborhoodNotes: property.neighborhoodNotes || "",

    // Policy configurations
    applicationFeeRequired: !!property.applicationFeeRequired,
    applicationFee: (property.applicationFee || "").toString(),
    depositRequired: !!property.depositRequired,
    depositAmount: (property.depositAmount || "").toString(),
    petsAllowed: !!property.petsAllowed,
    petAllowanceCharge: (property.petAllowanceCharge || "").toString(),

    // Outdoor Facilities configuration
    facility_hospital: (property as any).outdoorFacilities?.find((f: any) => f.facilityType === 'hospital')?.distance || "",
    facility_school: (property as any).outdoorFacilities?.find((f: any) => f.facilityType === 'school')?.distance || "",
    facility_supermarket: (property as any).outdoorFacilities?.find((f: any) => f.facilityType === 'supermarket')?.distance || "",
    facility_bank_atm: (property as any).outdoorFacilities?.find((f: any) => f.facilityType === 'bank_atm')?.distance || "",
    facility_bus_stop: (property as any).outdoorFacilities?.find((f: any) => f.facilityType === 'bus_stop')?.distance || "",
    facility_gym: (property as any).outdoorFacilities?.find((f: any) => f.facilityType === 'gym')?.distance || "",

    // Category specific details state:
    // Apartment
    aptFloorNumber: property.propertyCategory === "apartment" && "apartment" in property ? (property.apartment?.floorNumber || 1).toString() : "1",
    aptTotalFloors: property.propertyCategory === "apartment" && "apartment" in property ? (property.apartment?.totalBuildingFloors || 5).toString() : "5",
    aptMaintenanceFee: property.propertyCategory === "apartment" && "apartment" in property ? (property.apartment?.monthlyMaintenanceFee || 0).toString() : "0",
    aptHasElevator: property.propertyCategory === "apartment" && "apartment" in property ? !!property.apartment?.hasElevator : true,
    aptParkingSlot: property.propertyCategory === "apartment" && "apartment" in property ? (property.apartment?.parkingSlotNumber || "") : "",
    
    // House
    hseLotAcres: property.propertyCategory === "house" && "house" in property ? (property.house?.lotSizeAcres || 0.25).toString() : "0.25",
    hseLotSqFt: property.propertyCategory === "house" && "house" in property ? (property.house?.lotSizeSqFt || 10890).toString() : "10890",
    hseGarageSpaces: property.propertyCategory === "house" && "house" in property ? (property.house?.garageSpacesCount || 2).toString() : "2",
    hseRoofType: (property.propertyCategory === "house" && "house" in property ? (property.house?.roofType || "asphalt_shingle") : "asphalt_shingle") as string,
    hseFoundationType: (property.propertyCategory === "house" && "house" in property ? (property.house?.foundationType || "concrete_slab") : "concrete_slab") as string,
    hseHVAC: property.propertyCategory === "house" && "house" in property ? (property.house?.heatingCoolingSystem || "Central HVAC System") : "Central HVAC System",
    hseBackyardSqFt: property.propertyCategory === "house" && "house" in property ? (property.house?.backyardAreaSqFt || 1500).toString() : "1500",
    
    // RoomShare
    rmShareType: (property.propertyCategory === "room_share" && "roomShare" in property ? (property.roomShare?.roomType || "private") : "private") as string,
    rmBathType: (property.propertyCategory === "room_share" && "roomShare" in property ? (property.roomShare?.bathroomType || "common") : "common") as string,
    rmOccupants: property.propertyCategory === "room_share" && "roomShare" in property ? (property.roomShare?.currentOccupantsCount || 1).toString() : "1",
    rmGender: (property.propertyCategory === "room_share" && "roomShare" in property ? (property.roomShare?.preferredGender || "any") : "any") as string,
    rmUtilities: (property.propertyCategory === "room_share" && "roomShare" in property ? (property.roomShare?.utilitiesIncluded || []) : []) as string[],
    rmMinLease: property.propertyCategory === "room_share" && "roomShare" in property ? (property.roomShare?.minimumLeasePeriodMonths || 6).toString() : "6",
    
    // Commercial
    commZoning: (property.propertyCategory === "commercial" && "commercial" in property ? (property.commercial?.zoningCode || "office") : "office") as string,
    commLoadingDocks: property.propertyCategory === "commercial" && "commercial" in property ? (property.commercial?.loadingDocksCount || 0).toString() : "0",
    commCeilingHeight: property.propertyCategory === "commercial" && "commercial" in property ? (property.commercial?.ceilingHeightFt || 12).toString() : "12",
    commMinLeaseYears: property.propertyCategory === "commercial" && "commercial" in property ? (property.commercial?.minimumLeaseTermYears || 3).toString() : "3",
    commElectricCapacity: property.propertyCategory === "commercial" && "commercial" in property ? (property.commercial?.electricalCapacity || "200A / 3-Phase") : "200A / 3-Phase",
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

  const handleSaveChanges = async (status: "draft" | "active") => {
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      price: parseInt(form.price, 10) || 0,
      currency: form.currency,
      formattedAddress: form.address,
      city: form.city,
      state: form.state,
      country: form.country,
      zipCode: form.zipCode,
      latitude: parseFloat(form.lat),
      longitude: parseFloat(form.lng),
      squareFeet: parseInt(form.squareFeet, 10) || 0,
      bedrooms: parseInt(form.bedrooms, 10) || 0,
      bathrooms: parseFloat(form.bathrooms) || 0,
      yearBuilt: parseInt(form.yearBuilt, 10) || 2020,
      images: form.images,
      videoTourUrl: form.videoTourUrl || null,
      virtualTourUrl: form.virtualTourUrl || null,
      neighborhoodNotes: form.neighborhoodNotes || "",
      status: status === "active" ? "pending_approval" : "draft", // triggers re-review for agents
      amenities: form.amenities,

      // Policy configurations
      applicationFeeRequired: !!form.applicationFeeRequired,
      applicationFee: parseInt(form.applicationFee, 10) || 0,
      depositRequired: !!form.depositRequired,
      depositAmount: parseInt(form.depositAmount, 10) || 0,
      petsAllowed: !!form.petsAllowed,
      petAllowanceCharge: parseInt(form.petAllowanceCharge, 10) || 0,
      outdoorFacilities: [
        { facilityType: "hospital", distance: form.facility_hospital },
        { facilityType: "school", distance: form.facility_school },
        { facilityType: "supermarket", distance: form.facility_supermarket },
        { facilityType: "bank_atm", distance: form.facility_bank_atm },
        { facilityType: "bus_stop", distance: form.facility_bus_stop },
        { facilityType: "gym", distance: form.facility_gym }
      ].filter(f => !!f.distance) as any,
      
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
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.status === "success") {
        toast.success(`Listing updates saved successfully! 🚀`);
        router.push("/agent/listings");
      } else {
        toast.error("Failed to update listing", { description: result.message || "Could not save changes." });
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
        <Button render={<Link href="/agent/listings" />} size="icon-sm" variant="ghost" className="h-9 w-9 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg">
          <span className="flex items-center justify-center w-full h-full">
            <ArrowLeft className="h-4.5 w-4.5" />
          </span>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">Edit Listing</h1>
          <p className="text-xs text-text-muted font-medium font-body">Modify existing property details of &ldquo;{property.title}&rdquo;</p>
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
                isCompleted ? "bg-accent-primary/50" : "bg-border-default"
              )} />
              <span className={cn(
                "hidden sm:block text-[10px] font-bold tracking-tight transition-colors truncate",
                isActive ? "text-accent-primary" : "text-text-muted"
              )}>
                {ws.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Main form viewcard ── */}
      <div className="rounded-3xl border border-border-default bg-bg-surface p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Property Title *</label>
              <Input
                placeholder="e.g. Modern Minimalist Penthouse"
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Detailed Description *</label>
              <textarea
                placeholder="Write description detailing amenities, accessibility, and unique features..."
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                rows={5}
                className="w-full text-xs font-medium border bg-bg-base text-text-primary border-border-default rounded-2xl p-4 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Zoning Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(p => ({ ...p, category: e.target.value as PropertyCategory }))}
                  className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House / Villa</option>
                  <option value="room_share">Shared Room</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Valuta</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm(p => ({ ...p, currency: e.target.value as Currency }))}
                    className="h-10 w-full text-sm text-text-secondary bg-bg-base border border-border-default rounded-xl px-3 focus:outline-none focus:ring-1"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AED">AED (Dh)</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2">
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

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Country *</label>
                <CustomDropdown
                  value={form.country}
                  onChange={(country) => setForm(p => ({ ...p, country, city: "" }))}
                  options={COUNTRIES as unknown as string[]}
                  placeholder="Select Country..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">City *</label>
                <CustomDropdown
                  value={form.city}
                  onChange={(city) => setForm(p => ({ ...p, city }))}
                  options={COUNTRY_CITIES[form.country] || []}
                  placeholder={!form.country ? "Select Country First..." : "Select City..."}
                  disabled={!form.country}
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
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border-default bg-bg-alt/40 flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-15" />
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className="h-9 w-9 rounded-full bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary animate-pulse">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase mt-1">Geographic Coordinates Preview</span>
                <span className="text-[11px] font-mono text-text-secondary">Lat: {form.lat} · Lng: {form.lng}</span>
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
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block text-left">Neighborhood Notes</label>
              <textarea
                placeholder="Describe local neighborhood details, transit access, nearby schools, parks, or community vibes..."
                value={form.neighborhoodNotes}
                onChange={(e) => setForm(p => ({ ...p, neighborhoodNotes: e.target.value }))}
                rows={3}
                className="w-full text-sm border bg-bg-base text-text-primary border-border-default rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none font-medium"
              />
            </div>

            {/* ── Property Policies & Fees (Application Fee, Deposit, Pets) ── */}
            <div className="border-t border-border-default/50 pt-6 space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider block">Property Policies & Fee Configurations</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl border border-border-default/60 bg-bg-alt/20">
                {/* 1. Application Fee */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Application Fee Required?</label>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, applicationFeeRequired: !p.applicationFeeRequired }))}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0",
                        form.applicationFeeRequired ? "bg-accent-primary" : "bg-border-default"
                      )}
                    >
                      <span className={cn(
                        "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                        form.applicationFeeRequired && "translate-x-5"
                      )} />
                    </button>
                  </div>
                  {form.applicationFeeRequired && (
                    <div className="space-y-1.5 animate-fade-in text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">Application Fee Amount ($)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 50"
                        value={form.applicationFee}
                        onChange={(e) => setForm(p => ({ ...p, applicationFee: e.target.value }))}
                        className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Deposit Required */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Deposit Required?</label>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, depositRequired: !p.depositRequired }))}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0",
                        form.depositRequired ? "bg-accent-primary" : "bg-border-default"
                      )}
                    >
                      <span className={cn(
                        "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                        form.depositRequired && "translate-x-5"
                      )} />
                    </button>
                  </div>
                  {form.depositRequired && (
                    <div className="space-y-1.5 animate-fade-in text-left">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">Deposit Amount ($)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 1500"
                        value={form.depositAmount}
                        onChange={(e) => setForm(p => ({ ...p, depositAmount: e.target.value }))}
                        className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Pets Allowed */}
                <div className="space-y-3 sm:col-span-2 border-t border-border-default/40 pt-4 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Pets Allowed?</label>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, petsAllowed: !p.petsAllowed }))}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0",
                        form.petsAllowed ? "bg-accent-primary" : "bg-border-default"
                      )}
                    >
                      <span className={cn(
                        "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                        form.petsAllowed && "translate-x-5"
                      )} />
                    </button>
                  </div>
                  {form.petsAllowed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-left">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">Pet Allowance Monthly Charge ($)</label>
                        <Input
                          type="number"
                          placeholder="e.g. 50"
                          value={form.petAllowanceCharge}
                          onChange={(e) => setForm(p => ({ ...p, petAllowanceCharge: e.target.value }))}
                          className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Outdoor Facilities (Nearby Amenities) ── */}
            <div className="border-t border-border-default/50 pt-6 space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider block text-left">Outdoor Facilities (Nearby Distances)</h3>
              <p className="text-[11px] text-text-muted mt-0.5 text-left">Specify estimated distances to nearby public infrastructures (e.g. 2 kms, 800m, 1 km). Leave blank if not applicable.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl border border-border-default/60 bg-bg-alt/20 text-left">
                {/* 1. Hospital */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Hospital Distance</label>
                  <Input
                    placeholder="e.g. 2 kms"
                    value={form.facility_hospital}
                    onChange={(e) => setForm(p => ({ ...p, facility_hospital: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  />
                </div>

                {/* 2. School */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">School Distance</label>
                  <Input
                    placeholder="e.g. 8 kms"
                    value={form.facility_school}
                    onChange={(e) => setForm(p => ({ ...p, facility_school: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  />
                </div>

                {/* 3. Supermarket */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Supermarket Distance</label>
                  <Input
                    placeholder="e.g. 6 kms"
                    value={form.facility_supermarket}
                    onChange={(e) => setForm(p => ({ ...p, facility_supermarket: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  />
                </div>

                {/* 4. Bank ATM */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Bank ATM Distance</label>
                  <Input
                    placeholder="e.g. 1 km"
                    value={form.facility_bank_atm}
                    onChange={(e) => setForm(p => ({ ...p, facility_bank_atm: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  />
                </div>

                {/* 5. Bus Stop */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Bus Stop Distance</label>
                  <Input
                    placeholder="e.g. 2 kms"
                    value={form.facility_bus_stop}
                    onChange={(e) => setForm(p => ({ ...p, facility_bus_stop: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  />
                </div>

                {/* 6. Gym */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Gym Distance</label>
                  <Input
                    placeholder="e.g. 3 kms"
                    value={form.facility_gym}
                    onChange={(e) => setForm(p => ({ ...p, facility_gym: e.target.value }))}
                    className="h-10 border-border-default bg-bg-base text-text-primary text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* ── Category-Specific Attributes ── */}
            <div className="border-t border-border-default/50 pt-6 space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider block text-left">Category Specifications: {form.category.replace("_", " ")}</h3>
              
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
            <div className="space-y-3 pt-2 text-left">
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
                      {idx === 0 ? "Cover" : `Photo ${idx + 1}`}
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
                        let file = files[i];
                        try {
                          file = await applyWatermark(file);
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
            </div>

            <div className="border-t border-border-default/50 pt-6 space-y-4 text-left">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider block">Interactive Virtual Tours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <VideoUploader
                    value={form.videoTourUrl}
                    onChange={(val) => setForm(p => ({ ...p, videoTourUrl: val }))}
                    label="Interactive Video Tour"
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

        {/* STEP 5: Review */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-bg-alt/40 border border-border-default flex gap-4 items-start">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">Review Updates</h4>
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                  Please verify all configurations below. Confirming changes will update the listing preview in the agent catalog.
                </p>
              </div>
            </div>

            {/* Summary details list */}
            <div className="rounded-xl border border-border-default bg-bg-alt/30 p-5 space-y-4 text-xs font-medium">
              <div className="flex justify-between items-center py-1 border-b border-border-default">
                <span className="text-text-muted">Property Title</span>
                <span className="font-bold text-text-primary truncate max-w-[200px]">{form.title}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-default">
                <span className="text-text-muted">Zoning Category</span>
                <span className="font-bold text-text-primary capitalize">{form.category}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-default">
                <span className="text-text-muted">Financial Price</span>
                <span className="font-bold text-accent-primary font-mono">{form.currency} {Number(form.price).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-default">
                <span className="text-text-muted">Street Location</span>
                <span className="font-bold text-text-primary">{form.address}, {form.city}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-default">
                <span className="text-text-muted">Layout Metrics</span>
                <span className="font-bold text-text-primary">{form.bedrooms} Bed · {form.bathrooms} Bath · {form.squareFeet} sq ft</span>
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
        <div className="border-t border-border-default pt-5 flex justify-between gap-4">
          <Button
            type="button"
            disabled={step === 1 || loading}
            onClick={handleBack}
            variant="outline"
            className="h-10 rounded-xl border-border-default text-text-secondary hover:bg-bg-elevated"
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
                className="h-10 rounded-xl border-border-default text-text-secondary hover:bg-bg-elevated"
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
