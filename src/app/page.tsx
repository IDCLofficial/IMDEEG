import { Hero } from "@/app/components/Hero";
import AboutSection from "@/app/components/AboutSection";
import AboutCommisioner from "@/app/components/AboutCommisioner";
import QuickLinks from "@/app/components/QuickLinks";
import LatestNews from "@/app/components/LatestNews";
import FeaturedPartners from "@/app/components/FeaturedPartners";
import Stats from "@/app/components/Stats";
import CTASection from "@/app/components/CTASection";
import Footer from "@/app/components/Footer";
import Advertisement from "@/app/components/Advertisement";
import DataSection from "@/app/components/DataSection";

export default function Home() {
  return (
    <div className="h-screen w-full bg-red-400">
      <Hero
        title="Imo State Ministry of Digital Economy and eGovernment" 
        caption="Driving Digital Transformation" 
        subtitle="Spearheading innovative solutions for a digitally empowered society. Leading the way in e-governance, connectivity, and tech-driven progress." 
      />
      <AboutSection 
        title="About Us"
        subtitle="The Imo State Ministry of Digital Economy and E-Government (IMDEEG) was established in 2022 under the leadership of His Excellency, Senator Hope Uzodinma, the Governor of Imo State.   The goal of the Ministry is to transform Imo State into a digitally empowered society and a knowledge-based economy.								"
        image1="/images/homeImage1.png"
        image2="/images/advert_flier.png"
      />
      <AboutCommisioner 
        imgSrc="/images/commissioner.png" 
        title="About The Commissioner" 
      />
      <DataSection />
      <section className="w-full flex flex-col gap-8">
        <QuickLinks />
        <Advertisement />
        <LatestNews />
      </section>
      <Stats />
      <FeaturedPartners />
      <CTASection 
        heading="Ready to Experience the New Imo?"
        subtext="Discover our vision for an inclusive, empowered, and connected state."
        buttonLabel="Contact Us"
        buttonHref="/contact-us"
      />
      <Footer/>
    </div>
  );
}
