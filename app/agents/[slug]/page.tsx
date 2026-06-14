import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAgentBySlug, agentsMock } from "@/src/mocks/agentsMock";
import { AgentProfileClient } from "./agent-profile-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return agentsMock.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);
  if (!agent) return { title: "Agent Not Found | Brand Estate" };
  return {
    title: `${agent.name} — ${agent.title} | Brand Estate`,
    description: agent.bio.slice(0, 160),
    openGraph: {
      images: [agent.coverImage],
    },
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);
  if (!agent) notFound();
  return <AgentProfileClient agent={agent} />;
}
