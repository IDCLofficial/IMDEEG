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

export default function Home() {
  return (
    <div className="h-screen w-full bg-red-400">
      <Hero
        title="Imo State Ministry of Digital Economy and eGovernment" 
        caption="Driving Imo&apos;s Future with Innovation & Digital Power." 
        subtitle="The Imo State Ministry of Digital Economy and E-Government is committed to accelerating digital transformation across the state. We build a digitally empowered Imo through inclusive innovation, cutting-edge technology, and people-centered digital governance." 
      />
      <AboutSection 
        title="About Us"
        subtitle="Established in 2022, the Imo State Ministry of Digital Economy and E-Government (IMDEEG) is committed to accelerating digital transformation across the state. We build a digitally empowered Imo through inclusive innovation, cutting-edge technology, and people-centered digital governance."
        image1="/images/homeImage1.png"
        image2="/images/homeImage2.png"
      />
      <AboutCommisioner 
        imgSrc="/images/commissioner.png" 
        title="About The Commissioner" 
      />
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
