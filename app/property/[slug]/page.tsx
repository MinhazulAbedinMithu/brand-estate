import * as React from "react";
import { notFound } from "next/navigation";
import { mockProperties } from "@/src/mocks/propertiesMock";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertySpecs } from "@/components/property/property-specs";
import { PropertyPriceHistory } from "@/components/property/property-price-history";
import { AgentContactCard } from "@/components/property/agent-contact-card";
import { RelatedListings } from "@/components/property/related-listings";
import { MapPin, Bed, Bath, Square, Calendar, Eye, Heart, Share2, Compass, AlertCircle } from "lucide-react";
import { Metadata } from "next";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = mockProperties.find((p) => p.slug === slug);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: property.seo.seoTitle || property.title,
    description: property.seo.metaDescription || property.description,
    openGraph: {
      title: property.seo.seoTitle || property.title,
      description: property.seo.metaDescription || property.description,
      images: [
        {
          url: property.images[0],
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const property = mockProperties.find((p) => p.slug === slug);

  if (!property) {
    notFound();
  }

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
                  <span className="bg-state-warning/10 text-state-warning border border-state-warning/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Featured Property
                  </span>
                )}
                <span className="bg-bg-elevated border border-border-default/80 text-text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider capitalize">
                  {property.status.replace("_", " ")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-text-primary tracking-tight leading-tight">
                {property.title}
              </h1>

              {/* Quick Specs horizontal row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-text-secondary font-medium pt-2 border-t border-border-default/45">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-accent-primary" />
                  {property.city}, {property.state}
                </span>
                {property.propertyCategory !== "commercial" && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4 text-accent-primary" />
                      {property.bedrooms} Bed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4 text-accent-primary" />
                      {property.bathrooms} Bath
                    </span>
                  </>
                )}
                <span className="flex items-center gap-1.5">
                  <Square className="h-4 w-4 text-accent-primary" />
                  {property.squareFeet.toLocaleString()} sq ft ({property.squareMeters.toLocaleString()} m²)
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent-primary" />
                  Built {property.yearBuilt}
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="p-6 rounded-2xl border border-border-default bg-bg-surface flex items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Listing Price</span>
                <p className="text-3xl sm:text-4xl font-extrabold font-heading text-accent-primary">
                  {formattedPrice}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Estimated Value</span>
                <p className="text-lg font-bold text-text-primary mt-1">
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
            </div>

            {/* Core Specs & Discriminator attributes table */}
            <PropertySpecs property={property} />

            {/* Location block with static map mockup */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
                Location
              </h2>
              <p className="text-sm text-text-secondary flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4 text-accent-primaryshrink-0" />
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
