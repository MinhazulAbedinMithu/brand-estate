import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { AgentProfileClient } from "./agent-profile-client";
import type { MockAgent } from "@/src/mocks/agentsMock";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  await connectDB();
  const agents = await User.find({ role: "agent", status: "active" }).select("slug").lean();
  return agents.map((a) => ({ slug: a.slug || "" })).filter((a) => a.slug !== "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const agent = await User.findOne({ role: "agent", slug }).lean();
  if (!agent) return { title: "Agent Not Found | Brand Estate" };
  return {
    title: `${agent.name} — ${agent.title || "Real Estate Agent"} | Brand Estate`,
    description: agent.bio?.slice(0, 160) || "",
    openGraph: {
      images: [agent.coverImage || ""],
    },
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const agentDoc = await User.findOne({ role: "agent", slug }).lean();
  if (!agentDoc) notFound();

  // Find related agents (same country, status active, exclude self)
  const relatedDocs = await User.find({
    role: "agent",
    status: "active",
    _id: { $ne: agentDoc._id },
    "location.country": agentDoc.location?.country || "",
  })
    .limit(3)
    .lean();

  const plainAgent = JSON.parse(JSON.stringify(agentDoc));
  const plainRelated = JSON.parse(JSON.stringify(relatedDocs));

  // Helper serialize
  const serializeAgent = (doc: any) => ({
    id: doc._id,
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
    reviews: doc.reviews?.map((r: any) => ({
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
  });

  const agent = serializeAgent(plainAgent) as unknown as MockAgent;
  const relatedAgents = plainRelated.map(serializeAgent) as unknown as MockAgent[];

  return <AgentProfileClient agent={agent} relatedAgents={relatedAgents} />;
}
