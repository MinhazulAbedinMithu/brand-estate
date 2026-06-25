import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { User, IUser } from "@/lib/db/models/user.model";
import { AgentProfileClient } from "./agent-profile-client";
import type { MockAgent } from "@/src/mocks/agentsMock";
import { getAgentSchema } from "@/lib/seo-json-ld";

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
  
  const title = `${agent.name} — ${agent.title || "Real Estate Agent"} | Brand Estate`;
  const description = agent.bio?.slice(0, 160) || `Meet ${agent.name}, professional real estate agent at Brand Estate.`;
  const image = agent.avatar || agent.coverImage || "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/agents/${slug}`,
      siteName: "Brand Estate",
      type: "profile",
      images: [
        {
          url: image,
          alt: agent.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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
  const serializeAgent = (doc: IUser) => ({
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
  });

  const agent = serializeAgent(plainAgent) as unknown as MockAgent;
  const relatedAgents = plainRelated.map(serializeAgent) as unknown as MockAgent[];
  const jsonLd = getAgentSchema(agent);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <AgentProfileClient agent={agent} relatedAgents={relatedAgents} />
    </>
  );
}
