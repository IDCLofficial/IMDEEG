import React from "react";
import CTABlock from "@/app/components/CTABlock";

const ContactCTASection = () => (
  <div className="w-full bg-[#222F36] py-12 px-4 flex justify-center items-center">
    <div className="w-full max-w-5xl">
      <CTABlock
        heading="Ready to Experience the New Imo?"
        subtext="Discover our vision for an inclusive, empowered, and connected state."
        buttonLabel="Contact Us"
        buttonHref="/contact-us"
      />
    </div>
  </div>
);

export default ContactCTASection; 