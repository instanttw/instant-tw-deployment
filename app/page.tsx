import { Hero } from "@/components/sections/hero";
import { FeaturedPlugins } from "@/components/sections/featured-plugins";
import { ServicesOverview } from "@/components/sections/services-overview";
import { WPScanPromo } from "@/components/sections/wp-scan-promo";
import { Benefits } from "@/components/sections/benefits";
import { Testimonials } from "@/components/sections/testimonials";
import DebugTranslations from "./debug-translations";

export default function Home() {
  return (
    <>
      <DebugTranslations />
      <Hero />
      <FeaturedPlugins />
      <ServicesOverview />
      <WPScanPromo />
      <Benefits />
      <Testimonials />
    </>
  );
}
