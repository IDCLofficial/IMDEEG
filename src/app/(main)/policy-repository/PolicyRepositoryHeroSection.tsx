"use client";

import React from "react";
import { motion } from "framer-motion";
import { Title } from "@/app/components/Title";
import { SubsequentHero } from "@/app/components/Hero";

interface PolicyRepositoryHeroSectionProps {
  title: string;
  subtitle: string;
}

export default function PolicyRepositoryHeroSection({
  title,
  subtitle,
}: PolicyRepositoryHeroSectionProps) {
  return (
    <SubsequentHero className="bg-[url('/images/gradient.png')] bg-cover bg-center">
      <div className="relative z-10 flex justify-center">
        <Title label="Policy Repository" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <motion.h1
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg max-w-4xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-white/85 max-w-2xl text-sm md:text-base leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </SubsequentHero>
  );
}
