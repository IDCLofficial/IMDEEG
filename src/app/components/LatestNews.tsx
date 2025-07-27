"use client"
import Image from "next/image";
import { AppLink } from "./AppLink";
import { motion } from "framer-motion";

const news = [
  {
    title: "SKILLUP IMO COHORT 5 GRADUATION CEREMONY COMPLETED",
    desc: "Over 5,000 trained in cybersecurity, UI/UX, AI — May 2025",
    date: "30th May 2025",
    img: "/images/homeImage1.png"
  },
  {
    title: "SKILLUP IMO COHORT 5 GRADUATION CEREMONY COMPLETED",
    desc: "Over 5,000 trained in cybersecurity, UI/UX, AI — May 2025",
    date: "30th May 2025",
    img: "/images/homeImage1.png"
  },
  {
    title: "SKILLUP IMO COHORT 5 GRADUATION CEREMONY COMPLETED",
    desc: "Over 5,000 trained in cybersecurity, UI/UX, AI — May 2025",
    date: "30th May 2025",
    img: "/images/homeImage1.png"
  },
];

export default function LatestNews() {
  return (
    <motion.section 
      key="latest-news"
      id="latest-news"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false }}
      className="w-full px-4 md:px-8 py-10 md:py-16 bg-white"
    >
      <h2 className="text-dark-primary text-xl md:text-3xl lg:text-[43px] font-medium text-center mb-8 md:mb-10">Latest News</h2>
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-0 md:px-4 mb-8">
        {news.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="relative w-full h-[140px] md:h-[180px]">
              <Image src={item.img} alt={item.title} fill className="object-cover" />
            </div>
            <div className="p-4 md:p-5 flex-1 flex flex-col">
              <h3 className="text-dark-secondary text-base font-bold mb-2 uppercase leading-snug">{item.title}</h3>
              <p className="text-dark-primary-body text-base mb-2 md:mb-4">{item.desc}</p>
              <span className="text-dark-tertiary text-xs md:text-[15px] font-bold mt-auto">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <AppLink href="/news" label="See More" variant="primary" className="border-1 border-primary-green text-[15px] px-[2rem] py-[12px] rounded-[3.4px] font-medium"/>
      </div>
    </motion.section>
  );
} 