import { Metadata } from "next";
import { AgentsClientPage } from "./agents-client";

import { connectDB } from "@/lib/db/mongoose";
import { User, IUser } from "@/lib/db/models/user.model";
import type { MockAgent } from "@/src/mocks/agentsMock";

export const metadata: Metadata = {
  title: "Find Real Estate Agents | Brand Estate",
  description:
    "Browse our network of verified, top-rated real estate agents across New York, London, Dubai, Sydney, and more. Find the right expert for your property journey.",
  openGraph: {
    title: "Find Real Estate Agents | Brand Estate",
    description:
      "Browse our network of verified, top-rated real estate agents across New York, London, Dubai, Sydney, and more. Find the right expert for your property journey.",
    url: "/agents",
    siteName: "Brand Estate",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Find Real Estate Agents | Brand Estate",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Real Estate Agents | Brand Estate",
    description:
      "Browse our network of verified, top-rated real estate agents across New York, London, Dubai, Sydney, and more. Find the right expert for your property journey.",
    images: ["/og-image.jpg"],
  },
};

export default async function AgentsPage() {
  await connectDB();
  const agentsDocs = await User.find({ role: "agent", status: "active" }).lean();
  const plainDocs = JSON.parse(JSON.stringify(agentsDocs));

  // Serialize documents for client component
  const agents = plainDocs.map((doc: IUser) => ({
    id: doc._id as unknown as string,
    name: doc.name,
    slug: doc.slug || "",
    email: doc.email,
    phone: doc.phone || "",
    avatar: doc.avatar || "",
    coverImage: doc.coverImage || "",
    title: doc.title || "Real Estate Agent",
    bio: doc.bio || "",
    location: doc.location ? {
      city: doc.location.city || "",
      state: doc.location.state || "",
      country: doc.location.country || "",
    } : { city: "", state: "", country: "" },
    specializations: doc.specializations || [],
    languages: doc.languages || [],
    licenseNumber: doc.legalDocs?.licenseNumber || "",
    yearsExperience: doc.yearsExperience ?? 0,
    activeListings: doc.activeListings ?? 0,
    totalSales: doc.totalSales ?? 0,
    totalVolume: doc.totalVolume || "$0M+",
    rating: doc.rating ?? 0,
    reviewCount: doc.reviewCount ?? 0,
    reviews: doc.reviews?.map((r: {
      id?: string;
      reviewerName?: string;
      reviewerAvatar?: string;
      rating?: number;
      comment?: string;
      date?: string;
      propertyType?: string;
    }) => ({
      id: r.id || "",
      reviewerName: r.reviewerName || "",
      reviewerAvatar: r.reviewerAvatar || "",
      rating: r.rating || 5,
      comment: r.comment || "",
      date: r.date || "",
      propertyType: r.propertyType || "",
    })) || [],
    socialLinks: doc.socialLinks || [],
    certifications: doc.certifications || [],
    joinedAt: doc.createdAt || new Date().toISOString(),
    listingIds: [],
  })) as unknown as MockAgent[];

  return <AgentsClientPage agents={agents} />;
}
