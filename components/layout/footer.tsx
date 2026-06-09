"use client";

import * as React from "react";
import Link from "next/link";
import {
  Send,
  Building,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

// Custom SVG Icons for Brands (not exported in this version of lucide-react)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);


export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log("Subscribed email:", email);
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-bg-alt dark:bg-linear-to-b dark:from-bg-surface dark:to-bg-base border-t border-border-default/30 transition-all duration-300">

      {/* 1. Upper Newsletter/CTA Strip */}
      <section className="bg-bg-alt/45 dark:bg-bg-surface/20 border-b border-border-default/15 py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
            <div className="max-w-xl">
              <h2 className="font-heading text-2xl sm:text-3xl text-text-primary mb-2">
                Stay updated with the latest listings
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Subscribe to our newsletter to receive curated property updates, market trends, and exclusive insights directly in your inbox.
              </p>
            </div>

            <div className="w-full lg:max-w-md shrink-0">
              {subscribed ? (
                <div className="flex items-center gap-3 bg-state-success/10 border border-state-success/35 text-state-success rounded-2xl p-4 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-semibold">
                    Thank you! You have successfully subscribed to our newsletter.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-text-muted" />
                    <Input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 pr-4 h-11 w-full rounded-full border-border-default dark:border-border-default/50 bg-bg-surface dark:bg-bg-elevated/40 text-sm focus-visible:ring-accent-primary"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-11 px-5 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white font-semibold flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Directory Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Col 1: Logo & Brand Identity */}
          <div className="space-y-5 lg:col-span-1">
            <Link
              href="/"
              className="font-heading text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2"
            >
              <Building className="h-6 w-6 text-accent-primary" />
              <span>{APP_NAME}</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              {APP_TAGLINE}. We offer premium properties and professional services connecting property buyers, renters, and agents worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-2.5">
              {[
                { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
                { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
                { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
                { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
              ].map((soc, idx) => {
                const IconComp = soc.icon;
                return (
                  <a
                    key={idx}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border-default/50 dark:border-border-default/30 bg-bg-surface dark:bg-bg-elevated/30 text-text-muted hover:text-accent-primary dark:hover:text-accent-primary hover:border-accent-primary/50 dark:hover:border-accent-primary/50 transition-all duration-200 shadow-xs"
                    aria-label={soc.label}
                  >
                    <IconComp className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-primary">
              Discover
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Buy Properties", href: "/properties?type=sale" },
                { label: "Rent Properties", href: "/properties?type=rent" },
                { label: "New Developments", href: "/developments" },
                { label: "Commercial Space", href: "/properties?type=commercial" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent-primary transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Agents & Partners */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-primary">
              Agents & Partners
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Find an Agent", href: "/agents" },
                { label: "Agent Workspace", href: "/agent/dashboard" },
                { label: "Partner Portal", href: "/partners" },
                { label: "Careers", href: "/careers" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent-primary transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-primary">
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Press Room", href: "/press" },
                { label: "Blog & Insights", href: "/blogs" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent-primary transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Support & Office */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-primary">
              Contact HQ
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="h-4.5 w-4.5 text-accent-primary shrink-0 mt-0.5" />
                <span>100 Blue Accent Way, Suite 500, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-accent-primary shrink-0" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-accent-primary shrink-0" />
                <span>support@brandestate.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Bottom Meta & Legal Bar */}
        <div className="mt-12 pt-8 border-t border-border-default/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>
            <p>© {new Date().getFullYear()} Brand Estate. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Settings", href: "/cookies" },
              { label: "Sitemap", href: "/sitemap" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-accent-primary hover:underline transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

    </footer>
  );
}
