"use client";

import Image from "next/image";
import Link from "next/link";
import { BiChevronDown } from "react-icons/bi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Category } from "../../../lib/types";

type Popular = {
  title: string;
  img?: string;
  badge: { fields: { category_name: string } };
  desc: unknown;
};

export default function NewsSidebar({
  categories,
  popularNews,
  selectedFilter,
}: {
  categories: Category[];
  popularNews: Popular[];
  selectedFilter: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setFilter = (key: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("filter", key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-[#F9F9F9] p-2 md:p-4 mb-8 md:mb-0">
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium text-base md:text-[18px]">Popular</span>
          <BiChevronDown className="text-gray-500 text-[18px] cursor-pointer" />
        </div>
        <div className="flex flex-col gap-2 mt-4" id="dropdown">
          {categories.map((cat) => (
            <button
              key={cat.fields.category_name}
              onClick={() => setFilter(cat.fields.category_name)}
              className={`w-full flex justify-between items-center text-left text-gray-700 text-xs md:text-[15px] px-1 py-1 rounded ${
                selectedFilter === cat.fields.category_name.toLocaleLowerCase() && "bg-primary-green text-white"
              }`}
              aria-pressed={selectedFilter === cat.fields.category_name}
            >
              <span>{cat.fields.category_name}</span>
              <span>{cat.fields.category_name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6 md:mb-8 max-md:hidden">
        <h3 className="font-medium text-base md:text-[18px] mb-2 md:mb-4">CATEGORIES</h3>
        <ul className="space-y-1 md:space-y-2">
          {categories.map((cat) => (
            <li key={cat.fields.category_name} className="flex justify-between text-gray-700 text-xs md:text-[15px]">
              <button
                onClick={() => setFilter(cat.fields.category_name)}
                className={`flex justify-between w-full text-left px-1 py-1 rounded ${
                  selectedFilter === cat.fields.category_name.toLocaleLowerCase() ? "bg-primary-green font-medium text-white/90" : "hover:bg-white/70"
                }`}
                aria-pressed={selectedFilter === cat.fields.category_name.toLocaleLowerCase()}
              >
                <span>{cat.fields.category_name}</span>
                {/* <span>{cat.fields.category_name}</span> */}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="max-md:hidden">
        <h3 className="font-medium text-base md:text-[18px] mb-2 md:mb-4">POPULAR NEWS</h3>
        <ul className="space-y-2 md:space-y-4">
          {popularNews.map((news, idx) => (
            <li key={idx} className="flex gap-2 md:gap-3 items-center">
              <Link href={`/news/${news.title}`} className="flex gap-2 md:gap-3 items-center">
                <div className="w-[50px] h-[50px] relative rounded overflow-hidden flex-shrink-0">
                  <Image src={`https:${news.img}` || ""} alt={news.title} width={100} height={100} className="object-cover w-full h-full" />
                </div>
                <div>
                  <div className="text-xs md:text-[14px] font-medium leading-tight line-clamp-2">{news.title}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{news.badge?.fields?.category_name}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}