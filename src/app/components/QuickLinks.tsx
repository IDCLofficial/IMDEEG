"use client"

import Image from "next/image";
import { motion } from "framer-motion";

const links = [
  {
    title: "Projects",
    desc: "See how we&apos;re digitally transforming Imo.",
    img: "/images/homeImage1.png",
    href: "/projects"
  },
  {
    title: "Events",
    desc: "Join upcoming tech summits & training programs.",
    img: "/images/homeImage2.png",
    href: "/events"
  },
  {
    title: "Media",
    desc: "Watch our journey in action.",
    img: "/images/heroImage.png",
    href: "/media"
  },
  {
    title: "About Us",
    desc: "Who we are and what we stand for.",
    img: "/images/gradient.png",
    href: "/about-us"
  },
];

export default function QuickLinks() {
  return (
    <motion.section 
      key="quick-links"
      id="quick-links"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false }}
      className="w-full p-4 md:p-8 py-10 md:py-16 bg-white"
    >
      <h2 className="text-dark-primary text-xl md:text-[3xl] lg:text-[43px] font-medium text-center mb-8 md:mb-12">Quick Links</h2>
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 px-0 md:px-4">
        {links.map((link, idx) => (
          <div key={link.title} className="bg-white flex flex-col items-center h-full relative">
            <div className="relative w-full h-[140px] md:h-[200px] z-0">
              <Image src={link.img} alt={link.title} fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between relative p-4 md:p-6 bg-white -mt-[30px] md:-mt-[30px] w-[90%] h-[120px] md:h-[180px] mx-auto shadow-md">
              <div>
                <h3 className={`text-dark-secondary text-base md:text-lg font-bold mb-2 ${idx === 0 ? 'underline underline-offset-4' : ''}`}>{link.title}</h3>
                <p className="text-dark-primary-body text-[1rem] mb-4 md:mb-6">{link.desc}</p>
              </div>
              <a href={link.href} className="self-end bg-green-700 hover:bg-green-800 text-white w-8 max-h-8 flex items-center justify-center transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
} 