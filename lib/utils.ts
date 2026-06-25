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

