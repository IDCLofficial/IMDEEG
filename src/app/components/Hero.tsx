"use client"

import { Title } from "./Title";
import {motion} from "framer-motion";

interface HeroProps {
    title: string;
    caption: string;
    subtitle: string;
}

export const Hero = ({title, caption, subtitle}: HeroProps) => {
    return(
        <div className={`relative h-screen px-4 md:px-[3rem] flex flex-col justify-center bg-[url('/images/heroImg.jpg')] bg-fill bg-center`}>
            <div className="absolute inset-0 bg-black/50 z-0 h-full"></div>
            <div className="relative z-10 py-10 h-full flex flex-col justify-center">

                <motion.div 
                    key={title}
                    id={title}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-[75%] flex flex-col gap-2"
                >
                    <Title label={title}/>
                    <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">{caption}</h1>
                    <p className="text-[1rem] font-light leading-[1.5] text-white">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

import { ReactNode } from "react";

interface SubsequentHeroProps {
    children: ReactNode,
    className?: string;
}

export const SubsequentHero = ({ children, className }: SubsequentHeroProps) => {
    return (
        <div className="relative h-[60vh] md:h-[80vh] px-2 md:px-[3rem] py-8 md:py-10 flex flex-col justify-center bg-gradient-to-r from-green-900/20 via-black to-black">
            <div className={`absolute inset-0 bg-cover bg-center h-full z-0 ${className}`}></div>
            {children}
        </div>
    );
}