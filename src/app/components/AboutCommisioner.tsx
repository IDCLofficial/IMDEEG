"use client"

import Image from "next/image";
import { AppLink } from "./AppLink";
import { motion } from "framer-motion";

interface AboutCommisionerProps {
    imgSrc: string;
    title: string;
}

export default function AboutCommisioner({imgSrc, title}: AboutCommisionerProps) {
  return (
    <section className="w-full bg-[#f3f8fa] py-12 md:py-20 flex justify-center">
        <motion.div 
        key={title}
        id={title}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
        className="flex flex-col md:flex-row items-center gap-8 md:gap-18 w-full px-4 md:px-[3rem]"
    >
            {/* Left: Commissioner Image */}
            <div className="bg-white rounded-xl shadow-lg p-2 flex-shrink-0 w-full md:w-auto flex justify-center">
                <div className="relative w-[220px] h-[240px] md:w-[300px] md:h-[340px] lg:w-[500px] lg:h-[360px]">
                    <Image
                    src={imgSrc}
                    alt="Commissioner"
                    fill
                    className="object-contain rounded-xl"
                    sizes="(max-width: 768px) 220px, 320px"
                    />
                </div>
            </div>
            {/* Right: Text Content */}
            <div className="flex-1 w-full md:w-auto mt-6 md:mt-0">
                <h2 className="text-xl md:text-2xl lg:text-[43px] font-bold text-dark-primary mb-4">{title}</h2>
                <p className="text-dark-primary-body text-base mb-4">
                    Dr. Chimezie Paulinus Amadi is the Commissioner for Digital Economy and E-Government in Imo State, Nigeria. Appointed by Governor Hope Uzodimma, he formerly worked with the Nigerian Communications Commission (NCC). He leads the Digital Imo Agenda (IDEA 2022–2026), which focuses on digital skills, infrastructure, advocacy, and partnerships.
                </p>
                <p className="text-dark-primary-body text-base mb-6 text-justify">
                    He launched SkillUpImo, aiming to train 100,000 youths in tech skills like software development and blockchain. His work promotes smart cities, digital governance, and youth empowerment. Dr. Amadi has received awards for leadership and innovation in public service.
                </p>
                <AppLink href="/about-us" label="Our Team" variant="primary" className="border-1 border-primary-green text-[15px] px-[2rem] py-[12px] rounded-[3.4px] font-medium"/>
            </div>
        </motion.div>
    </section>
  );
} 