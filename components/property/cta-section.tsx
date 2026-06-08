"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Self-contained premium conic border animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes rotate-border {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .glow-border-btn {
            position: relative;
            padding: 1.5px;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            z-index: 0;
          }
          .glow-border-btn::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
              from 0deg,
              transparent 20%,
              #1d8cff 40%,
              #0067d2 60%,
              transparent 80%,
              #1d8cff 100%
            );
            animation: rotate-border 4s linear infinite;
          }
          .glow-border-btn::after {
            content: '';
            position: absolute;
            z-index: -1;
            left: 1.5px;
            top: 1.5px;
            width: calc(100% - 3px);
            height: calc(100% - 3px);
            background: #010611;
            border-radius: 9999px;
            transition: background 0.3s ease;
          }
          .glow-border-btn:hover::after {
            background: #0d1829;
          }
          
          /* Success variant (for contact) */
          .glow-border-success {
            position: relative;
            padding: 1.5px;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            z-index: 0;
          }
          .glow-border-success::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
              from 0deg,
              transparent 20%,
              #16a34a 40%,
              #22c55e 60%,
              transparent 80%,
              #16a34a 100%
            );
            animation: rotate-border 4s linear infinite;
          }
          .glow-border-success::after {
            content: '';
            position: absolute;
            z-index: -1;
            left: 1.5px;
            top: 1.5px;
            width: calc(100% - 3px);
            height: calc(100% - 3px);
            background: #010611;
            border-radius: 9999px;
            transition: background 0.3s ease;
          }
          .glow-border-success:hover::after {
            background: #0b2214;
          }
        `
      }} />

      <div className="relative rounded-3xl overflow-hidden bg-accent-navy text-white py-16 px-6 sm:px-12 lg:px-16 shadow-2xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
        
        {/* Decorative glass bubbles */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-accent-primary/15 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-state-info/10 blur-3xl -z-10" />
        
        {/* Left Side Copy */}
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-wider text-accent-primary">
            <ShieldCheck className="h-4 w-4" />
            Join the Network
          </div>
          <h2 className="text-3xl sm:text-4xl text-white font-heading font-extrabold leading-tight">
            Ready to List Your Property?
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-body leading-relaxed">
            Gain immediate exposure. Showcase your apartments, villas, and commercial spaces on our high-speed real estate SaaS platform connecting clients globally.
          </p>
        </div>

        {/* Right Side Buttons (With Conic Animated Borders) */}
        <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto items-center justify-center">
          
          {/* Button 1: Conic Animated Primary Border */}
          <div className="glow-border-btn w-full sm:w-auto group">
            <Link 
              href="/register?role=agent"
              className="relative z-10 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 font-body"
            >
              Get Started as Agent
              <ArrowUpRight className="h-4.5 w-4.5 text-accent-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Button 2: Conic Animated Success Border */}
          <div className="glow-border-success w-full sm:w-auto group">
            <Link 
              href="/contact"
              className="relative z-10 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 font-body"
            >
              Contact Office
              <Mail className="h-4.5 w-4.5 text-state-success group-hover:scale-110 transition-transform duration-200" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
