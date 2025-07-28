import React from "react";
import MediaHeroSection from "./MediaHeroSection";
import MediaGalleryGrid from "./MediaGalleryGrid";
import Footer from "../components/Footer";
import CTASection from "../components/CTASection";
import { mediaData } from "./mediaData";

export default function MediaPage() {
  return (
    <main className="min-h-screen w-full bg-[#F7F9FA] flex flex-col">
      <MediaHeroSection
        title="Digital Stories of Impact"
        subtitle="Explore our gallery of photos, videos, and press releases capturing our journey toward a digitally empowered Imo State."
        backgroundImage="/images/heroImage.png"
      />
      <section className="w-full max-w-7xl mx-auto py-12 px-4">
        <MediaGalleryGrid items={mediaData} />
      </section>
      <CTASection 
        heading="Ready to Experience the New Imo?" 
        subtext="Discover our vision for an inclusive, empowered, and connected state." 
        buttonLabel="Contact Us" 
        buttonHref="/contact-us"
      />
      <Footer />
    </main>
  );
}
