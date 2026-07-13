import { HeroSection } from "@/components/property/hero-section";
import { CategorySlider } from "@/components/property/category-slider";
import { FeaturedProperties } from "@/components/property/featured-properties";
import { WhyChooseUs } from "@/components/property/why-choose-us";
import { InvestmentCalculator } from "@/components/property/investment-calculator";
import { BlogsSection } from "@/components/shared/blogs-section";
import { CtaSection } from "@/components/property/cta-section";
import { connectDB } from "@/lib/db/mongoose";
import { Property, IProperty } from "@/lib/db/models/property.model";
import type { MockProperty } from "@/src/mocks/propertyTypes";
import { getAppUrl } from "@/lib/utils";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/seo-json-ld";
import { cookies } from "next/headers";

const appUrl = getAppUrl();

export const metadata = {
  title: "RealHoms — Premium Real Estate Portal",
  description: "Find your dream home, search luxury properties, rent high-end apartments, and connect with elite real estate agents.",
  openGraph: {
    title: "RealHoms — Premium Real Estate Portal",
    description: "Find your dream home, search luxury properties, rent high-end apartments, and connect with elite real estate agents.",
    url: appUrl,
    siteName: "RealHoms",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RealHoms — Premium Real Estate Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealHoms — Premium Real Estate Portal",
    description: "Find your dream home, search luxury properties, rent high-end apartments, and connect with elite real estate agents.",
    images: ["/og-image.png"],
  },
};

export default async function Homepage() {
  await connectDB();

  // Dynamic backfill migration for missing country field in legacy properties
  const countMissing = await Property.countDocuments({ country: { $exists: false } });
  if (countMissing > 0) {
    const cityCountryMap: Record<string, string> = {
      "New York": "United States",
      "Malibu": "United States",
      "Chicago": "United States",
      "Los Angeles": "United States",
      "East Hampton": "United States",
      "Austin": "United States",
      "Houston": "United States",
      "Shibuya": "Japan",
      "Dubai": "United Arab Emirates",
      "Berlin": "Germany",
      "London": "United Kingdom",
      "Sydney": "Australia",
      "Toronto": "Canada",
      "Melbourne": "Australia",
      "Paris": "France",
      "Singapore": "Singapore",
      "Mumbai": "India",
      "Dhaka": "Bangladesh"
    };

    const docsToUpdate = await Property.find({ country: { $exists: false } }).lean();
    for (const doc of docsToUpdate) {
      const resolved = cityCountryMap[doc.city] || "United States";
      await Property.updateOne({ _id: doc._id }, { $set: { country: resolved } });
    }
  }
  
  const cookieStore = await cookies();
  const userCity = cookieStore.get("user_city")?.value;
  const userCountry = cookieStore.get("user_country")?.value;

  const query: any = { status: "active" };
  const hasLocationFilter = !!(userCity || userCountry);

  if (userCity) {
    query.city = { $regex: new RegExp(`^${userCity}$`, "i") };
  }
  if (userCountry) {
    query.country = { $regex: new RegExp(`^${userCountry}$`, "i") };
  }

  let propertiesDocs = await Property.find(query).lean();

  // If no properties match the city, but they have country set, try matching only the country
  if (propertiesDocs.length === 0 && userCity && userCountry) {
    const countryQuery: any = {
      status: "active",
      country: { $regex: new RegExp(`^${userCountry}$`, "i") }
    };
    propertiesDocs = await Property.find(countryQuery).lean();
  }

  // Fall back to all active properties ONLY if the user has not selected any location
  if (propertiesDocs.length === 0 && !hasLocationFilter) {
    propertiesDocs = await Property.find({ status: "active" }).lean();
  }
  
  // Convert Mongoose documents/dates/ObjectIds to plain JSON primitives
  const plainDocs = JSON.parse(JSON.stringify(propertiesDocs));
  
  const properties = plainDocs.map((p: IProperty) => ({
    ...p,
    id: p._id as unknown as string,
    ownerId: p.ownerId as unknown as string,
  })) as unknown as MockProperty[];

  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <div className="bg-bg-base min-h-screen pb-16 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* 1. HERO SECTION */}
      <HeroSection properties={properties} />

      {/* 2. CATEGORY HORIZONTAL SLIDER */}
      <CategorySlider />

      {/* 3. FEATURED PROPERTIES GRID (using propertiesMock base/discriminator model) */}
      <FeaturedProperties properties={properties} />

      {/* 5. PROPERTY INVESTMENT & ROI CALCULATOR GRID */}
      <InvestmentCalculator />


      {/* 4. WHY CHOOSE BRAND ESTATE ASYMMETRICAL GRID */}
      <WhyChooseUs />


      {/* BLOGS AND INSIGHTS SECTION */}
      <BlogsSection />


      {/* 6. CALL TO ACTION SECTION */}
      <CtaSection />

    </div>
  );
}
