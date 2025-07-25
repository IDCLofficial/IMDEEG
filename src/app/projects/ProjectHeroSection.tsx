import Image from "next/image";

export default function ProjectHeroSection() {
  return (
    <section className="relative w-full h-[350px] md:h-[400px] flex items-center justify-center bg-[url('/images/projectsHero.png')] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold text-center px-4">Empowering Imo’s Digital Future</h1>
      </div>
    </section>
  );
} 