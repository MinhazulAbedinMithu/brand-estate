import { HeroSection } from "@/components/property/hero-section";
import { CategorySlider } from "@/components/property/category-slider";
import { FeaturedProperties } from "@/components/property/featured-properties";
import { WhyChooseUs } from "@/components/property/why-choose-us";
import { CtaSection } from "@/components/property/cta-section";

export const metadata = {
  title: "Brand Estate — Premium Real Estate Portal",
  description: "Find your dream home, search luxury properties, rent high-end apartments, and connect with elite real estate agents.",
};

export default function Homepage() {
  return (
    <div className="bg-bg-base min-h-screen pb-16 space-y-16 sm:space-y-24 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CATEGORY HORIZONTAL SLIDER */}
      <CategorySlider />

      {/* 3. FEATURED PROPERTIES GRID (using propertiesMock base/discriminator model) */}
      <FeaturedProperties />

      {/* 4. WHY CHOOSE BRAND ESTATE ASYMMETRICAL GRID */}
      <WhyChooseUs />

      {/* 5. CALL TO ACTION SECTION */}
      <CtaSection />

    </div>
  );
}
