import React, { Suspense } from "react";
import MediaHeroSection from "./MediaHeroSection";
import MediaGalleryGrid from "./MediaGalleryGrid";
import Footer from "../../components/Footer";
import CTASection from "../../components/CTASection";
import getMedia from "./media";

export const dynamic = "force-dynamic";

async function MediaContent() {
  const media = await getMedia();
  return <MediaGalleryGrid items={media || { items: [], total: 0 }} />;
}

export default function MediaPage() {
  return (
    <main className="min-h-screen w-full bg-[#F7F9FA] flex flex-col">
      <MediaHeroSection
        title="Explore Our Gallery"
        subtitle="Discover how the Ministry of Youth Development and Talent Hunt empowers young people and nurtures talent for a brighter future."
        backgroundImage="/images/heroImage.png"
      />
      <section className="w-full max-w-7xl mx-auto py-12 px-4">
        <Suspense fallback={<div className="w-full flex justify-center py-8"><p className="text-gray-500">Loading gallery...</p></div>}>
          <MediaContent />
        </Suspense>
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
