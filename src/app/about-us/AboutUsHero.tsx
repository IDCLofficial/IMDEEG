import { SubsequentHero } from "../components/Hero";
import { Title } from "../components/Title";

interface AboutUsHeroProps {
    ministryName: string;
}

export const AboutUsHero = ({ ministryName }: AboutUsHeroProps) => {
    return (
        <SubsequentHero className="bg-[url('/images/gradient.png')]">
            {/* Navigation Highlight */}
            <div className="relative z-10 flex justify-center">
                <Title label="About Us" />
            </div>
            <div className="relative z-10 flex justify-center mt-4">
                <div className="w-full md:w-[60%] flex flex-col items-center text-center">
                    <h1 className="text-2xl md:text-[3rem] font-bold text-white leading-tight">
                        Our Story - {ministryName}
                    </h1>
                </div>
            </div>
        </SubsequentHero>
    );
}; 