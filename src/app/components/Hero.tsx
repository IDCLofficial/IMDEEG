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
        <div className={`h-screen px-4 md:px-[3rem] flex flex-col justify-center bg-[url('/images/heroImage.png')] bg-cover bg-center`}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-0"></div>
            <div className="relative z-10 py-10">

                <motion.div 
                    key={title}
                    id={title}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-[60%] flex flex-col gap-4"
                >
                    <Title label={title}/>
                    <h1 className="text-2xl md:text-[3rem] font-bold text-white leading-tight">{caption}</h1>
                    <p className="text-[1rem] font-light leading-[1.5] text-white">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </div>
    )
}