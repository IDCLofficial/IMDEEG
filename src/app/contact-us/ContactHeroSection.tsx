import React from "react";
import { SubsequentHero } from "../components/Hero";

interface ContactHeroSectionProps {
  title: string;
}

const ContactHeroSection: React.FC<ContactHeroSectionProps> = ({ title }) => (
  <SubsequentHero className="bg-[url('/images/gradient.png')]">
    <h1 className="text-white text-4xl md:text-5xl font-bold z-10 text-center">{title}</h1>
  </SubsequentHero>
);

export default ContactHeroSection; 