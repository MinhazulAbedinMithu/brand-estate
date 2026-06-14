"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/** Routes that should NOT render the global Navbar and Footer */
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];
const DASHBOARD_PREFIXES = ["/dashboard", "/agent", "/admin", "/super-admin"];

/**
 * ConditionalLayout — renders Navbar + main + Footer for normal routes,
 * but renders children directly (no nav/footer) for auth and dashboard routes.
 */
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isDashboardRoute = DASHBOARD_PREFIXES.some(prefix => 
    pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (isAuthRoute || isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
