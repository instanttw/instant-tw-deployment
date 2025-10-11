import { Hero } from "@/components/sections/hero";
import { FeaturedPlugins } from "@/components/sections/featured-plugins";
import { ServicesOverview } from "@/components/sections/services-overview";
import { WPScanPromo } from "@/components/sections/wp-scan-promo";
import { Benefits } from "@/components/sections/benefits";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq-section";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedPlugins />
      <ServicesOverview />
      <WPScanPromo />
      <Benefits />
      <Testimonials />
      <FAQSection />
    </>
  );
}
