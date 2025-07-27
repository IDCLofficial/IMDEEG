import { Title } from "../components/Title";
import { SubsequentHero } from "../components/Hero";

export default function UnitsHeroSection() {
  return (
    <SubsequentHero className="bg-[url('/images/gradient.png')]">
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <Title label="Departments"/>
        <h1 className="text-white text-3xl md:text-5xl font-bold text-center leading-tight">Departments Driving Our Digital Vision</h1>
      </div>
    </SubsequentHero>
  );
} 