import UnitsHeroSection from "./UnitsHeroSection";
import UnitsTabsSection from "./UnitsTabsSection";
import UnitsCTASection from "./UnitsCTASection";
import Footer from "../components/Footer";
import CTASection from "../components/CTASection";

export default function UnitsPage() {
  return (
    <div className="bg-white">
      <UnitsHeroSection />
      <UnitsTabsSection />
      <CTASection heading="Join our mission to make Imo the digital heart of Nigeria" buttonLabel="Contact Us" buttonHref="/contact-us"/>
      <Footer />
    </div>
  );
}
