import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EditListingClient } from "./edit-listing-client";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { Property, IProperty } from "@/lib/db/models/property.model";
import type { MockProperty } from "@/src/mocks/propertyTypes";

interface Props {
  params: Promise<{ id: string }>;
}

async function getPropertyData(id: string) {
  await connectDB();
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return null;
  }
  const prop = await Property.findById(id).lean() as IProperty | null;
  if (!prop) return null;

  const rawPropertyData = {
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
    outdoorFacilities: (prop as any).outdoorFacilities || [],
  };

  return JSON.parse(JSON.stringify(rawPropertyData)) as unknown as MockProperty;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyData(id);
  if (!property) return { title: "Edit Listing | RealHoms" };
  return {
    title: `Edit Listing: ${property.title} | RealHoms`,
    description: `Modify real estate property listing details for ${property.title}.`,
  };
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const property = await getPropertyData(id);
  if (!property) notFound();

  return (
    <DashboardShell allowedRoles={["owner"]}>
      <EditListingClient property={property} />
    </DashboardShell>
  );
}

