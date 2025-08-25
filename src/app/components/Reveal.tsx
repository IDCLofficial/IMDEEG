"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  variant?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight";
  className?: string;
}

const variantsMap: Record<NonNullable<RevealProps["variant"]>, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
};

export default function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  variant = "fadeUp",
  className,
}: RevealProps) {
  const variants = variantsMap[variant];
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
