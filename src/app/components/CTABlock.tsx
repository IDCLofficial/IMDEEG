import React from "react";
import { AppLink } from "./AppLink";

interface CTABlockProps {
  heading: string;
  subtext?: string;
  buttonLabel: string;
  buttonHref: string;
}

export default function CTABlock({ heading, subtext, buttonLabel, buttonHref }: CTABlockProps) {
  return (
    <section className="w-full bg-white rounded-[12px] p-4 md:p-10 shadow-md mx-auto max-w-md md:max-w-6xl">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-6 w-full">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2 md:mb-4 leading-tight">{heading}</h2>
          {subtext && <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-0">{subtext}</p>}
        </div>
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          <AppLink 
            href={buttonHref} 
            label={buttonLabel} 
            variant="primary" 
            className="w-full md:w-auto max-w-xs text-base md:text-lg px-6 py-2 rounded font-medium flex justify-center"
          />
        </div>
      </div>
    </section>
  );
} 