import { Hero } from "@/app/components/Hero";
import Reveal from "@/app/components/Reveal";
import AboutSection from "@/app/components/AboutSection";
import AboutCommisioner from "@/app/components/AboutCommisioner";
import QuickLinks from "@/app/components/QuickLinks";
import LatestNews from "@/app/components/LatestNews";
import FeaturedPartners from "@/app/components/FeaturedPartners";
import Stats from "@/app/components/Stats";
import CTASection from "@/app/components/CTASection";
import Footer from "@/app/components/Footer";
import Advertisement from "@/app/components/Advertisement";
import { getNewsList } from "./news/newsList";
import { NewsPost } from "../../lib/types";
import { Suspense } from "react";

export default async function Home() {
  const newsList = await getNewsList();
  return (
    <div className="h-screen w-full bg-red-400">
      <Hero
        title="Imo State Ministry of Digital Economy and eGovernment" 
        caption="Driving Digital Transformation" 
        subtitle="Positioning Imo as Nigeria’s leading digital economy state by deploying e‑government platforms, building smart city infrastructure, and expanding connectivity across communities. Through SkillUp Imo, we equip youths and entrepreneurs with in‑demand digital skills, creating jobs, powering startups, and delivering faster, more transparent public services for all Imolites." 
      />
      <Reveal variant="fadeUp" delay={0.1}>
        <AboutSection 
          title="About Us"
          subtitle="The Imo State Ministry of Digital Economy and E-Government (IMDEEG) was established in 2022 under the leadership of His Excellency, Senator Hope Uzodinma, the Governor of Imo State. The goal of the Ministry is to transform Imo State into a digitally empowered society and a knowledge-based economy."
          image1="/images/homeImage1.png"
          image2="/images/advert_flier.png"
        />
      </Reveal>
      <Reveal variant="fadeUp" delay={0.2}>
        <AboutCommisioner 
          imgSrc="/images/commissioner.png" 
          title="About The Commissioner" 
        />
      </Reveal>
      <Reveal variant="fadeUp" delay={0.25}>
        <section className="w-full flex flex-col gap-8">
          <QuickLinks />
          <Advertisement />
          <Suspense fallback={<div>Loading...</div>}>
            <LatestNews
              title="Latest News"
            />
          </Suspense>
        </section>
      </Reveal>
      <Reveal variant="fadeUp" delay={0.35}>
        <Stats />
      </Reveal>
      <Reveal variant="fadeUp" delay={0.45}>
        <FeaturedPartners />
      </Reveal>
      <Reveal variant="fadeUp" delay={0.5}>
        <CTASection 
          heading="Ready to Experience the New Imo?"
          subtext="Discover our vision for an inclusive, empowered, and connected state."
          buttonLabel="Contact Us"
          buttonHref="/contact-us"
        />
      </Reveal>
      <Reveal variant="fadeIn" delay={0.55}>
        <Footer/>
      </Reveal>
    </div>
  );
}
