import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import EventCarousel from "./components/EventCarousel/EventCarousel";
import BrowseCategories from "./components/BrowseCategories/BrowseCategories";
import FeaturedVendors from "./components/FeaturedVendors/FeaturedVendors";
import MarketplaceHighlights from "./components/MarketplaceHighlights/MarketplaceHighlights";
import PlannerCTA from "./components/PlannerCTA/PlannerCTA";
import Footer from "./components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <EventCarousel />

        <BrowseCategories />

        <FeaturedVendors />

        <MarketplaceHighlights />

        <PlannerCTA />
      </main>

      <Footer />
    </>
  );
}