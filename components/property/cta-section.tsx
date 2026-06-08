"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Mail } from "lucide-react";

export function CtaSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes beam-rotate-cta {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .border-beam-section {
            position: relative;
            padding: 2px;
            overflow: hidden;
            border-radius: 1.875rem; /* 30px */
            z-index: 0;
            background: var(--border-default);
            transition: all 0.3s ease;
          }
          .dark .border-beam-section {
            background: var(--border-default);
          }
          
          .border-beam-section::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
              from 0deg,
              transparent 70%,
              var(--accent-primary) 85%,
              #38bdf8 97%,
              transparent 100%
            );
            animation: beam-rotate-cta 8s linear infinite;
            pointer-events: none;
          }
          
          .border-beam-section:hover {
            box-shadow: 0 20px 40px -15px rgba(0, 103, 210, 0.12);
          }
          .dark .border-beam-section:hover {
            box-shadow: 0 20px 40px -15px rgba(29, 140, 255, 0.15);
          }
        `
      }} />

      <div className="border-beam-section shadow-md">
        <div className="relative rounded-[calc(1.875rem-2px)] overflow-hidden bg-bg-alt dark:bg-accent-navy text-text-primary dark:text-white py-16 px-6 sm:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 transition-colors duration-300">

          {/* Decorative glass bubbles */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-accent-primary/10 dark:bg-accent-primary/15 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-state-info/5 dark:bg-state-info/10 blur-3xl -z-10" />

          {/* Left Side Copy */}
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary/5 dark:bg-white/5 border border-accent-primary/10 dark:border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-wider text-accent-primary">
              <ShieldCheck className="h-4 w-4" />
              Join the Network
            </div>
            <h2 className="text-3xl sm:text-4xl text-text-primary dark:text-white font-heading font-extrabold leading-tight">
              Ready to List Your Property?
            </h2>
            <p className="text-text-muted dark:text-white/80 text-sm sm:text-base font-body leading-relaxed">
              Gain immediate exposure. Showcase your apartments, villas, and commercial spaces on our high-speed real estate SaaS platform connecting clients globally.
            </p>
          </div>

          {/* Right Side Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto items-center justify-center">

            {/* Button 1: Solid Premium Accent */}
            <Link
              href="/register?role=agent"
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-accent-primary hover:bg-accent-primary-hov rounded-full flex items-center justify-center gap-2 font-body shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
            >
              Get Started as Agent
              <ArrowUpRight className="h-4.5 w-4.5 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>

            {/* Button 2: Glassmorphic / Outlined dynamic color */}
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider text-text-primary dark:text-white bg-white hover:bg-bg-elevated border border-border-default dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:hover:border-white/40 rounded-full flex items-center justify-center gap-2 font-body shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group"
            >
              Contact Office
              <Mail className="h-4.5 w-4.5 text-text-primary/95 dark:text-white/90 group-hover:scale-110 transition-transform duration-200" />
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
