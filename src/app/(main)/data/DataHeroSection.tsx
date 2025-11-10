'use client';

export function DataHeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#119156] to-[#22C55E] text-white py-20 h-[800px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Digital Economy Data Portal
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Explore comprehensive data on our digital transformation initiatives, 
          training programs, and participant statistics across Imo State.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <button 
            onClick={() => scrollToSection('data-stats')}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/30 transition-all duration-200 cursor-pointer"
          >
            📊 Real-time Statistics
          </button>
          <button 
            onClick={() => scrollToSection('data-search')}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/30 transition-all duration-200 cursor-pointer"
          >
            🔍 Advanced Search
          </button>
          <button 
            onClick={() => scrollToSection('data-table')}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/30 transition-all duration-200 cursor-pointer"
          >
            📍 LGA Breakdown
          </button>
          <button 
            onClick={() => scrollToSection('data-stats')}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/30 transition-all duration-200 cursor-pointer"
          >
            🎓 Course Analytics
          </button>
        </div>
      </div>
    </section>
  );
} 