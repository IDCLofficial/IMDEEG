"use client"
import SearchBar from "@/app/components/SearchBar";
import { useState } from "react";
import Link from "next/link";
import { SubsequentHero } from "@/app/components/Hero";
import { Title } from "@/app/components/Title";

export default function NewsHeroSection({newsList}:{newsList:{ title: string; slug: string } []}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<{ title: string; slug: string } []>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered: { title: string; slug: string } [] = newsList?.filter(item =>
      item?.title.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered.map(item => ({ title: item?.title, slug: item?.slug })));
    setShowDropdown(true);
  };

  const handleSearch = (query: string) => {
    // Optional submit behavior when user presses enter or clicks search
    // For now, ensure dropdown shows current filtered results
    if (!query.trim()) {
      setShowDropdown(false);
      return;
    }
    setShowDropdown(true);
  };

  return (
    <SubsequentHero className="bg-[url('/images/gradient.png')] bg-cover bg-center">
      <div className="relative z-10 flex justify-center">
        <Title label="News" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 md:px-0">
        <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold text-center leading-tight">
          Stay Up to Date
        </h1>
        <div className="w-full flex flex-col items-center justify-center relative max-w-xl mx-auto">
          <div className="w-full relative">
            <SearchBar placeholder="Search" value={searchQuery} onChange={handleChange} onSearch={handleSearch} />
            {showDropdown && (
              <div className="absolute left-0 right-0 top-[70%] mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-60 overflow-y-auto w-full">
                {results.length > 0 ? (
                  results.map((item, idx) => (
                    <Link href={`/news/${item.slug}`} key={idx} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex flex-col border-b last:border-b-0">
                      <span className="font-semibold text-gray-800 text-base">{item.title}</span>
                      {/* <span className="text-xs text-gray-500">{item.slug}</span> */}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">No news found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SubsequentHero>
  );
}