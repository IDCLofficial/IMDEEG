import { IoSettingsOutline } from "react-icons/io5";
import { IoGitNetworkOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import Reveal from "../components/Reveal";

export const ObjectivesSection = () => {
    const objectives = [
        {
            icon: <IoSettingsOutline className="text-[2rem] text-primary-green"/>,
            title: "Technology",
            description: "To leverage technology to enhance public services, making them more efficient and accessible"
        },
        {
            icon: <IoGitNetworkOutline className="text-[2rem] text-primary-green"/>,
            title: "Opportunity",
            description: "To create and expand employment and entrepreneurship prospects for the people of Imo State."
        },
        {
            icon: <IoPeopleOutline className="text-[2rem] text-primary-green"/>,
            title: "People",
            description: "To provide the necessary services and support to meet the needs of the residents of Imo State"
        }
    ];

    const coreValues = [
        "Teamwork",
        "Innovation", 
        "Integrity",
        "Professionalism",
        "Excellency",
        "Commitment"
    ];

    const missionAndVision = [
        {
            title: "Vision",
            description: "To position Imo State as the leading Digital Economy State in Nigeria"
        },
        {
            title: "Mission",
            description: "To build smart cities and harness digital technology to drive governance, innovation, entrepreneurship, value creation, and prosperity for all Imolites"
        },
        {
            title: "Mandate",
            description: "To develop, adopt and adapt digital technology to create opportunities and economic prosperity for the people of Imo State"
        }
    ];

    return (
        <section className="w-full bg-white py-10 md:py-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col gap-24">
                <div>
                    <h2 className="text-2xl md:text-[43px] font-medium text-center mb-8">
                        Mission and Vision
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                        {missionAndVision.map((objective, index) => (
                            <Reveal key={index} variant="fadeUp" delay={index * 0.08}>
                                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 text-center w-full">
                                    <h3 className="font-medium text-lg md:text-[22px] mb-2 md:mb-3">
                                        {objective.title}
                                    </h3>
                                    <p className="text-dark-primary-body text-base md:text-[1rem]">
                                        {objective.description}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
                {/* IMDEEG's Objectives */}
                <div className="">
                    <h2 className="text-xl md:text-[43px] font-medium text-center mb-8">
                        IMDEEG&apos;s objectives
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {objectives.map((objective, index) => (
                            <Reveal key={index} variant="fadeUp" delay={index * 0.08}>
                                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 text-center w-full">
                                    <div className="flex items-center justify-center mb-4">
                                        {objective.icon}
                                    </div>
                                    <h3 className="font-medium text-lg md:text-[22px] mb-2 md:mb-3">
                                        {objective.title}
                                    </h3>
                                    <p className="text-dark-primary-body text-base md:text-[1rem]">
                                        {objective.description}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Our Core Values */}
                <div>
                    <h2 className="text-xl md:text-[43px] font-medium text-center mb-8">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
                        {coreValues.map((value, index) => (
                            <Reveal key={index} variant="fadeUp" delay={index * 0.08}>
                                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 text-center w-full">
                                    <span className="font-bold text-base md:text-lg text-[#000]">{value}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Mission and Vision */}
                
            </div>
        </section>
    );
}; 