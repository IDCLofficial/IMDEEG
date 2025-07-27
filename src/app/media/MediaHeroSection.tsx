import React from "react";
import SearchBar from "../components/SearchBar";
import { SubsequentHero } from "../components/Hero";

interface MediaHeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const MediaHeroSection: React.FC<MediaHeroSectionProps> = ({ title, subtitle, backgroundImage }) => {
  return (
    <SubsequentHero className="bg-[url('/images/gradient.png')]">
      <div className="relative z-10 w-full flex flex-col items-center justify-end gap-0 h-full px-4">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">{title}</h1>
        <p className="text-white text-base text-center max-w-2xl drop-shadow-lg">{subtitle}</p>
        <SearchBar
          placeholder="Search"
        />
      </div>
    </SubsequentHero>
  );
};

export default MediaHeroSection; 