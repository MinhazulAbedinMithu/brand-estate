import * as React from "react";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { Property, IProperty } from "@/lib/db/models/property.model";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertySpecs } from "@/components/property/property-specs";
import { PropertyPriceHistory } from "@/components/property/property-price-history";
import { AgentContactCard } from "@/components/property/agent-contact-card";
import { RelatedListings } from "@/components/property/related-listings";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Calendar,
  Compass,
  Check,
  Waves,
  Dumbbell,
  Car,
  Trees,
  Maximize,
  ArrowUpDown,
  ShieldCheck,
  Wind,
  Flame,
  Sofa,
  Heart,
  Accessibility,
  Sunset,
  Bell,
  Box
} from "lucide-react";
import { Metadata } from "next";
import type { MockProperty } from "@/src/mocks/propertyTypes";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  await connectDB();
  const prop = await Property.findOne({ slug: slug.toLowerCase() }).lean();

  if (!prop) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: prop.seo?.seoTitle || prop.title,
    description: prop.seo?.metaDescription || prop.description,
    openGraph: {
      title: prop.seo?.seoTitle || prop.title,
      description: prop.seo?.metaDescription || prop.description,
      images: [
        {
          url: prop.images[0],
          alt: prop.title,
        },
      ],
    },
  };
}

function getAmenityIcon(amenity: string) {
  const normalized = amenity.toLowerCase().trim();
  if (normalized.includes("pool") || normalized.includes("swim")) return Waves;
  if (normalized.includes("gym") || normalized.includes("fitness") || normalized.includes("center")) return Dumbbell;
  if (normalized.includes("parking")) return Car;
  if (normalized.includes("garden") || normalized.includes("yard")) return Trees;
  if (normalized.includes("balcony")) return Maximize;
  if (normalized.includes("elevator")) return ArrowUpDown;
  if (normalized.includes("security")) return ShieldCheck;
  if (normalized.includes("air cond") || normalized.includes("ac") || normalized.includes("conditioning")) return Wind;
  if (normalized.includes("heat") || normalized.includes("heating")) return Flame;
  if (normalized.includes("furnish") || normalized.includes("sofa")) return Sofa;
  if (normalized.includes("pet")) return Heart;
  if (normalized.includes("wheelchair") || normalized.includes("access")) return Accessibility;
  if (normalized.includes("rooftop") || normalized.includes("terrace")) return Sunset;
  if (normalized.includes("concierge")) return Bell;
  if (normalized.includes("storage")) return Box;
  
  return Check;
}

export default async function PropertyDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  
  await connectDB();
  const prop = (await Property.findOne({ slug: slug.toLowerCase() }).lean()) as IProperty | null;

  if (!prop) {
    notFound();
  }

  // Map database document to MockProperty structure for child components
  const property = {
    id: prop._id.toString(),
    title: prop.title,
    slug: prop.slug,
    description: prop.description,
    transactionType: prop.transactionType,
    propertyCategory: prop.propertyCategory,
    price: prop.price,
    currency: prop.currency,
    taxHistory: prop.taxHistory || [],
    priceHistory: prop.priceHistory || [],
    formattedAddress: prop.formattedAddress,
    city: prop.city,
    state: prop.state,
    zipCode: prop.zipCode,
    _geo: prop._geo,
    neighborhoodNotes: prop.neighborhoodNotes || '',
    squareFeet: prop.squareFeet,
    squareMeters: prop.squareMeters,
    totalRooms: prop.totalRooms,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    yearBuilt: prop.yearBuilt,
    images: prop.images,
    videoTourUrl: prop.videoTourUrl,
    virtualTourUrl: prop.virtualTourUrl,
    status: prop.status,
    isFeatured: prop.isFeatured,
    ownerId: prop.ownerId.toString(),
    listerProfile: prop.listerProfile,
    seo: prop.seo,
    amenities: prop.amenities,
    apartment: prop.apartment,
    house: prop.house,
    roomShare: prop.roomShare,
    commercial: prop.commercial,
  } as unknown as MockProperty;

  // Format currency price
  const isRent = property.transactionType === "rent" || property.transactionType === "roommate_share";
  const symbol = property.currency === "USD" ? "$" : property.currency + " ";
  const formattedPrice = `${symbol}${property.price.toLocaleString()}${isRent ? "/mo" : ""}`;

  return (
    <div className="min-h-screen bg-bg-base">
      {/* SECTION A: Hero Gallery (Full Width) */}
      <PropertyGallery
        images={property.images}
        title={property.title}
        category={property.propertyCategory}
        transactionType={property.transactionType}
        videoTourUrl={property.videoTourUrl}
        virtualTourUrl={property.virtualTourUrl}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* SECTION B: Two-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-10">

            {/* Header / Title + Quick specs */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {property.isFeatured && (
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-full shadow-sm tracking-wider select-none uppercase">
                    Featured
                  </span>
                )}
                <span className="bg-bg-elevated border border-border-default/80 text-text-secondary text-[9px] font-bold px-3 py-1 rounded-full tracking-wider uppercase select-none">
                  {property.status.replace("_", " ")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-text-primary tracking-tight leading-tight">
                {property.title}
              </h1>

              {/* Location row */}
              <div className="flex items-center gap-2 text-sm text-text-secondary font-medium pt-1">
                <MapPin className="h-4.5 w-4.5 text-accent-primary shrink-0" />
                <span>{property.formattedAddress}</span>
              </div>

              {/* Quick Specs 4-columns grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border-default/45">
                {property.propertyCategory !== "commercial" && (
                  <>
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border-default/50 bg-bg-surface">
                      <Bed className="h-5 w-5 text-accent-primary shrink-0" />
                      <span className="text-xs font-semibold text-text-secondary">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border-default/50 bg-bg-surface">
                      <Bath className="h-5 w-5 text-accent-primary shrink-0" />
                      <span className="text-xs font-semibold text-text-secondary">{property.bathrooms} Bathrooms</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border-default/50 bg-bg-surface">
                  <Ruler className="h-5 w-5 text-accent-primary shrink-0 rotate-90" />
                  <span className="text-xs font-semibold text-text-secondary truncate">{property.squareFeet.toLocaleString()} sq ft</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border-default/50 bg-bg-surface">
                  <Calendar className="h-5 w-5 text-accent-primary shrink-0" />
                  <span className="text-xs font-semibold text-text-secondary">Built {property.yearBuilt}</span>
                </div>
              </div>
            </div>

            {/* Price Block */}
            <div className="p-6 rounded-2xl border border-border-default/60 bg-gradient-to-br from-bg-surface to-bg-alt/30 flex items-center justify-between gap-4 shadow-md shadow-accent-primary/2 hover:border-accent-primary/20 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Listing Price</span>
                <p className="text-3xl sm:text-4xl font-extrabold font-body text-accent-primary tracking-tight">
                  {formattedPrice}
                </p>
              </div>
              <div className="text-right space-y-1">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Estimated Value</span>
                <p className="text-lg font-bold text-text-primary mt-1 font-body">
                  {symbol}{(property.price * 1.02).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Description Block */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
                About this Property
              </h2>
              <div className="text-base text-text-secondary leading-relaxed font-body whitespace-pre-line space-y-4">
                {property.description}
              </div>

              {/* Neighborhood notes callout */}
              {property.neighborhoodNotes && (
                <div className="mt-6 rounded-2xl border border-accent-primary/20 bg-accent-primary-dim/30 p-5">
                  <h4 className="text-sm font-bold text-accent-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Compass className="h-4 w-4 animate-spin-slow" />
                    Neighborhood Notes
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed font-body font-medium">
                    {property.neighborhoodNotes}
                  </p>
                </div>
              )}

              {/* Amenities List */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="pt-6 border-t border-border-default/45 space-y-4">
                  <h3 className="text-lg font-bold font-heading text-text-primary">
                    Amenities & Facilities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity: string) => {
                      const AmenityIcon = getAmenityIcon(amenity);
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border-default/50 bg-bg-surface text-xs font-semibold text-text-secondary select-none"
                        >
                          <span className="h-4.5 w-4.5 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                            <AmenityIcon className="h-3 w-3" />
                          </span>
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Core Specs & Discriminator attributes table */}
            <PropertySpecs property={property} />

            {/* Location block with static map mockup */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
                Location
              </h2>
              <p className="text-sm text-text-secondary flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4 text-accent-primary shrink-0" />
                {property.formattedAddress}, {property.zipCode}
              </p>

              {/* Maps Mockup Display */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border-default/50 bg-bg-alt flex flex-col items-center justify-center p-6 shadow-inner group">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

                {/* Visual coordinate grids */}
                <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-border-subtle" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-border-subtle" />

                {/* Marker with pulse animation */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-primary/20 opacity-75" />
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent-primary text-white shadow-lg shadow-accent-primary/30">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <span className="bg-accent-navy/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-md shadow-md border border-white/10 uppercase tracking-wider backdrop-blur-sm whitespace-nowrap">
                    Lat: {property._geo.lat.toFixed(5)}, Lng: {property._geo.lng.toFixed(5)}
                  </span>
                </div>

                {/* External link indicator */}
                <div className="absolute bottom-4 right-4 z-10">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${property._geo.lat},${property._geo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-accent-primary hover:text-white text-accent-navy text-[11px] font-bold px-3.5 py-2 rounded-full border border-border-default/80 shadow-md transition-all active:scale-95"
                  >
                    Open Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Price & Tax history component */}
            <PropertyPriceHistory property={property} />

          </div>

          {/* Right Column / Sticky Sidebar (1/3 width) */}
          <div className="lg:sticky lg:top-24 space-y-6">

            {/* Agent Contact details card */}
            <AgentContactCard lister={property.listerProfile} propertyTitle={property.title} />

            {/* Quick facts card */}
            <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-4">
              <h4 className="font-body text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border-default pb-3">
                Listing Quick Facts
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-muted font-medium">Property Category</span>
                  <span className="font-bold text-text-primary capitalize">{property.propertyCategory.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-muted font-medium">Listing Status</span>
                  <span className="font-bold text-text-primary capitalize">{property.status.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-muted font-medium">Year Built</span>
                  <span className="font-bold text-text-primary">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-muted font-medium">Lister Type</span>
                  <span className="font-bold text-text-primary">Licensed Broker</span>
                </div>
              </div>
            </div>

            {/* Tags / Keywords list */}
            {property.seo?.keywords && property.seo.keywords.length > 0 && (
              <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-3">
                <h4 className="font-body text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border-default pb-3">
                  Property Tags
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {property.seo.keywords.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-accent-primary/8 text-accent-primary border border-accent-primary/15 text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors hover:bg-accent-primary/12"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* SECTION C: Related Listings (Full Width horizontal divider & grid) */}
        <RelatedListings
          currentId={property.id}
          category={property.propertyCategory}
          className="mt-16 pt-16 border-t border-border-default/45"
        />

      </div>
    </div>
  );
}
