import { Metadata } from "next";
import { AgentsClientPage } from "./agents-client";

export const metadata: Metadata = {
  title: "Find Real Estate Agents | Brand Estate",
  description:
    "Browse our network of verified, top-rated real estate agents across New York, London, Dubai, Sydney, and more. Find the right expert for your property journey.",
};

export default function AgentsPage() {
  return <AgentsClientPage />;
}
