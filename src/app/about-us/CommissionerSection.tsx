import Image from "next/image";
import { AppLink } from "../components/AppLink";

interface CommissionerSectionProps {
    imgSrc: string;
    altText: string;
    commissionerName: string;
    commissionerDescription: string;
}

export const CommissionerSection = ({ imgSrc, altText, commissionerName, commissionerDescription }: CommissionerSectionProps) => {
    return (
        <section className="w-full bg-gray-100 py-10 md:py-20">
            <div className="w-full mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-20 items-center">
                    {/* Left Section - Commissioner Profile Card */}
                    <div className="relative w-full lg:w-auto w-full md:max-w-md lg:max-w-none mx-auto">
                        <div className="relative rounded-xl overflow-hidden shadow-xl w-full h-[220px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px]">
                            <Image 
                                src={imgSrc}
                                alt={altText}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                    {/* Right Section - Text Content */}
                    <div className="w-full lg:w-auto space-y-4 md:space-y-6 flex flex-col items-start lg:items-start lg:text-left">
                        <div>
                            <h2 className="text-xl md:text-[43px] font-medium text-dark-primary leading-tight">
                                Hon. Commissioner <br/>
                                {commissionerName}
                            </h2>
                        </div>
                        <p className="text-dark-primary-body text-base md:text-[1rem] leading-normal text-justify md:text-left">
                            {commissionerDescription}
                        </p>
                        <AppLink label="Learn More" href="/about-us/team" variant="primary"/>
                    </div>
                </div>
            </div>
        </section>
    );
}; 