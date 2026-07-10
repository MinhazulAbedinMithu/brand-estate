import type { Metadata } from "next";
import { ComparePageClient } from "./compare-page-client";

export const metadata: Metadata = {
  title: "Compare Properties",
  description: "Side-by-side comparison of selected properties. Compare features, pricing, size, and amenities at a glance.",
};

export default function ComparePage() {
  return <ComparePageClient />;
}
