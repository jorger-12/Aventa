import Hero from "./Hero/Hero";
import EventCarousel from "./EventCarousel/EventCarousel";
import BrowseCategories from "./BrowseCategories/BrowseCategories";
import FeaturedVendors from "./FeaturedVendors/FeaturedVendors";
import MarketplaceHighlights from "./MarketplaceHighlights/MarketplaceHighlights";
import PlannerCTA from "./PlannerCTA/PlannerCTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <EventCarousel />
      <BrowseCategories />
      <FeaturedVendors />
      <MarketplaceHighlights />
      <PlannerCTA />
    </main>
  );
}