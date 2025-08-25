import { AboutUsHero } from "./AboutUsHero";
import { AboutSection } from "./AboutSection";
import { ObjectivesSection } from "./ObjectivesSection";
import { CommissionerSection } from "./CommissionerSection";
import { StructuresSection } from "./StructuresSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import TeamGridSection from "./TeamGridSection";

const teamMembers = [
    {
        name: "Hon. Chimezie Amadi",
        position: "Honourable Commissioner",
        imgSrc: "/images/commissioner.png"
    },
    {
        name:"Igwe Violet Chibuzo",
        position:"Permanent Secretary",
        imgSrc: "/images/permSec.jpg"
    }
];

export default function AboutUs() {
    return (
        <div className="h-screen">
            <Reveal variant="fadeUp">
                <AboutUsHero ministryName="Ministry of Digital Economy E-Government" />
            </Reveal>
            <Reveal variant="fadeUp" delay={0.1}>
                <AboutSection 
                    aboutText="The Imo State Ministry of Digital Economy and E-Government (IMDEEG) was established in 2022 under the leadership of His Excellency, Senator Hope Uzodinma, the Governor of Imo State. The goal of the Ministry is to transform Imo State into a digitally empowered society and a knowledge-based economy." 
                    imgSrc="/images/aboutSectionCard.jpg" 
                    altText="Ministry of Digital Economy and E-Government conference event" 
                />
            </Reveal>
            <Reveal variant="fadeUp" delay={0.15}>
                <CommissionerSection 
                    imgSrc="/images/commissioner2.png" 
                    altText="Hon. Commissioner Dr. Chimezie Amadi" 
                    commissionerName="Dr. Chimezie Amadi" 
                    commissionerDescription="As Commissioner for Digital Economy and E-Government, Dr. Chimezie Amadi is a seasoned leader and policy advocate dedicated to bridging the digital divide. Under his direction, IMDEEG has empowered thousands of citizens through tech training and expanded digital services across Imo State."
                />
            </Reveal>
            <Reveal variant="fadeUp" delay={0.2}>
                <ObjectivesSection />
            </Reveal>
            <Reveal variant="fadeUp" delay={0.25}>
                <TeamGridSection members={teamMembers} />
            </Reveal>
            <Reveal variant="fadeUp" delay={0.25}>
                <StructuresSection 
                    imgSrc="/images/building.png"
                />
            </Reveal>
            <Reveal variant="fadeUp" delay={0.3}>
                <CTASection 
                    heading="Join our mission to make Imo the digital heart of Nigeria"
                    buttonLabel="See Our Projects"
                    buttonHref="/projects"
                />
            </Reveal>
            <Reveal variant="fadeUp" delay={0.35}>
                <Footer />
            </Reveal>
        </div>
    )
}