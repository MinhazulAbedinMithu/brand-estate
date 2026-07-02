import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAppUrl(): string {
  // 1. Explicit override — set NEXT_PUBLIC_APP_URL in Vercel env vars for production
  if (
    process.env.NEXT_PUBLIC_APP_URL &&
    !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
  ) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // 2. Vercel stable production hostname (auto-set, doesn't change between deploys)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // 3. Vercel per-deployment URL (changes each deploy — works but not canonical)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // 4. Local dev
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  // 5. Final hardcoded production fallback
  return "https://brandestate.vercel.app";
}

import type { User } from './types';

export function calculateProfileCompleteness(user: User | null): number {
  if (!user) return 0;
  let score = 0;
  
  // 1. Email verified (15%)
  if (user.isVerified) score += 15;
  
  // 2. Phone verified (15%)
  if (user.phoneVerified) score += 15;
  
  // 3. KYC Docs (25% total: 10% if pending, 25% if verified)
  const isKycVerified = user.kycStatus === 'verified' || user.nidStatus === 'verified';
  const isKycPending = user.kycStatus === 'pending' || user.nidStatus === 'pending';
  if (isKycVerified) {
    score += 25;
  } else if (isKycPending) {
    score += 10;
  }
  
  // 4. Background Report (15% total: 5% if pending, 15% if verified)
  if (user.backgroundReportStatus === 'verified') {
    score += 15;
  } else if (user.backgroundReportStatus === 'pending') {
    score += 5;
  }
  
  // 5. Credit Score Report (15% total: 5% if pending, 15% if verified)
  if (user.creditReportStatus === 'verified') {
    score += 15;
  } else if (user.creditReportStatus === 'pending') {
    score += 5;
  }
  
  // 6. Address added (15% total: 5% per field addressLine, addressCity, addressCountry)
  if (user.addressLine && user.addressLine.trim()) score += 5;
  if (user.addressCity && user.addressCity.trim()) score += 5;
  if (user.addressCountry && user.addressCountry.trim()) score += 5;
  
  return score;
}


