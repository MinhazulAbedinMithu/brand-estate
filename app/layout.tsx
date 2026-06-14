import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalLayout } from "@/components/layout/conditional-layout";

// ── Headings: Playfair Display ──────────────────────────
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});

// ── Body / UI text: Montserrat ───────────────────────────
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brand Estate — Find Your Perfect Property",
    template: "%s | Brand Estate",
  },
  description:
    "Brand Estate is a premium real estate platform connecting buyers, renters, sellers, and agents. Search thousands of properties and find your perfect home.",
  keywords: ["real estate", "property", "homes for sale", "rent", "agents"],
  openGraph: {
    type: "website",
    siteName: "Brand Estate",
    title: "Brand Estate — Find Your Perfect Property",
    description:
      "Search thousands of properties and find your perfect home with Brand Estate.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('brand-estate-theme') || 'system';
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (theme === 'system') {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-bg-base text-text-primary transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            {/* ConditionalLayout shows/hides Navbar+Footer based on route */}
            <ConditionalLayout>{children}</ConditionalLayout>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
