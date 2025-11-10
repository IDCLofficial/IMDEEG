import React from "react";
import ContactHeroSection from "./ContactHeroSection";
import ContactInfoSection from "./ContactInfoSection";
import ContactFormSection from "./ContactFormSection";
import ContactImageSection from "./ContactImageSection";
import ContactCTASection from "./ContactCTASection";
import Footer from "@/app/components/Footer";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col">
      <ContactHeroSection title="Contact Us" />
      <section className="w-full mx-auto py-8 md:py-20 px-4 md:px-12 flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col md:flex-row gap-8 relative">
            <div className="w-full md:w-[50%]">
              <ContactInfoSection />
            </div>
            <div className="w-full md:w-[40%] flex justify-center items-start static md:absolute md:right-0 md:z-5 mt-4 md:mt-0">
              <ContactFormSection />
            </div>
        </div>
        <ContactImageSection />
      </section>
      <ContactCTASection />
      <Footer />
    </main>
  );
}
