import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EditListingClient } from "./edit-listing-client";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockProperties } from "@/src/mocks/propertiesMock";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === id);
  if (!property) return { title: "Edit Listing | Brand Estate" };
  return {
    title: `Edit Listing: ${property.title} | Brand Estate`,
    description: `Modify real estate property listing details for ${property.title}.`,
  };
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === id);
  if (!property) notFound();

  return (
    <DashboardShell allowedRoles={["agent"]}>
      <EditListingClient property={property} />
    </DashboardShell>
  );
}
