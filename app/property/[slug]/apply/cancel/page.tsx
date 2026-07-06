import * as React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Canceled | RealHoms",
  description: "Your property tenancy application payment checkout was canceled.",
};

interface CancelPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ApplyCancelPage({ params }: CancelPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-[85vh] bg-bg-base text-text-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-border-default bg-bg-surface p-6 sm:p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-rose-500/5 blur-3xl" />

        <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-text-primary">
            Checkout Canceled
          </h1>
          <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">
            Card authorization aborted
          </p>
        </div>

        <p className="text-xs text-text-muted leading-relaxed max-w-sm mx-auto">
          You have exited the secure Stripe payment panel. Your credit card has not been charged, and no application has been submitted for this listing.
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <Link href={`/property/${slug}`} className="w-full">
            <Button className="w-full h-11 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold gap-1.5 shadow-md active:scale-98 transition-all">
              <ArrowLeft className="h-4 w-4" /> Try Applying Again
            </Button>
          </Link>
          <Link href="/properties" className="w-full">
            <Button variant="outline" className="w-full h-11 rounded-full border-border-default text-text-secondary text-xs font-bold gap-1.5">
              <Home className="h-4 w-4" /> Return to Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
