"use client"

import React from "react";
import SearchBar from "../components/SearchBar";
import { SubsequentHero } from "../components/Hero";
import { motion } from "framer-motion";
import { Title } from "../components/Title";

interface MediaHeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const MediaHeroSection: React.FC<MediaHeroSectionProps> = ({ title, subtitle }) => {
  return (
    <SubsequentHero
      className={`bg-[url('/images/gradient.png')] bg-cover bg-center`}
    >
      <div className="relative z-10 flex justify-center">
        <Title label="Gallery" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
        <motion.h1
          className="text-white text-3xl md:4xl lg:text-5xl font-bold drop-shadow-lg"
          initial={{ opacity: 1 }}
          animate={{}}
        >
          {title.split(" ").map((word, wordIdx, arr) => (
            <span key={wordIdx} style={{ display: "inline-block", whiteSpace: "pre" }}>
              {word.split("").map((char, charIdx) => (
                <motion.span
                  key={charIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.04 * (arr.slice(0, wordIdx).join(" ").length + wordIdx + charIdx) }}
                  style={{ display: "inline-block" }}
                >
                  {char}
                </motion.span>
              ))}
              {wordIdx < arr.length - 1 && (
                <motion.span
                  key={`space-${wordIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.04 * (arr.slice(0, wordIdx + 1).join(" ").length + wordIdx) }}
                  style={{ display: "inline-block" }}
                >
                  {"\u00A0"}
                </motion.span>
              )}
            </span>
          ))}
        </motion.h1>
      </div>
    </SubsequentHero>
  );
};

export default MediaHeroSection; 