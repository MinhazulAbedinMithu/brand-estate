import * as React from "react";
import { PaymentSuccessClient } from "./success-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Received | RealHoms",
  description: "Your tenancy application fee payment has been successfully authorized.",
};

interface SuccessPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export default async function ApplySuccessPage({ params, searchParams }: SuccessPageProps) {
  const { slug } = await params;
  const { session_id } = await searchParams;

  return (
    <PaymentSuccessClient slug={slug} sessionId={session_id || ""} />
  );
}
