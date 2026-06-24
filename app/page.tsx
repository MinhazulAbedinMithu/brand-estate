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

export const metadata = {
  title: "Brand Estate — Premium Real Estate Portal",
  description: "Find your dream home, search luxury properties, rent high-end apartments, and connect with elite real estate agents.",
  openGraph: {
    title: "Brand Estate — Premium Real Estate Portal",
    description: "Find your dream home, search luxury properties, rent high-end apartments, and connect with elite real estate agents.",
    url: "https://brand-estate.com",
    siteName: "Brand Estate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Brand Estate — Premium Real Estate Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Estate — Premium Real Estate Portal",
    description: "Find your dream home, search luxury properties, rent high-end apartments, and connect with elite real estate agents.",
    images: ["/og-image.png"],
  },
};

export default async function Homepage() {
  await connectDB();
  
  const propertiesDocs = await Property.find({ status: "active" }).lean();
  
  // Convert Mongoose documents/dates/ObjectIds to plain JSON primitives
  const plainDocs = JSON.parse(JSON.stringify(propertiesDocs));
  
  const properties = plainDocs.map((p: IProperty) => ({
    ...p,
    id: p._id as unknown as string,
    ownerId: p.ownerId as unknown as string,
  })) as unknown as MockProperty[];

  return (
    <div className="bg-bg-base min-h-screen pb-16 overflow-hidden">

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
