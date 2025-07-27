import SearchBar from "../components/SearchBar";
import { SubsequentHero } from "../components/Hero";

export default function NewsHeroSection() {
  return (
    <SubsequentHero className="bg-[url('/images/projectsHero.png')]">
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 w-full h-full px-4 md:px-0">
        <h1 className="text-white text-3xl md:text-[3rem] md:text-5xl font-bold text-center leading-tight">Empowering Imo’s Digital Future</h1>
        <div className="w-full mt-2 flex justify-center">
          <SearchBar placeholder="Search" />
        </div>
      </div>
      </SubsequentHero>
  );
} 