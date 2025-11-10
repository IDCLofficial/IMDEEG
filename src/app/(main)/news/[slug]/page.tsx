import Image from "next/image";
import Footer from "@/app/components/Footer";
import NewsHeroSection from "./NewsHeroSection";
import NewsBodySection from "./NewsBodySection";
import CTASection from "@/app/components/CTASection";
import { getNewsBySlug, getNewsListByCategoryId } from "../newsList";
import { LatestNews } from "./LatestNews";
import { NewsPost } from "../../../../../lib/types";


export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  const latestNewsList = await getNewsListByCategoryId("2XfChLa0hKTuDeJOciEZTI", 1);
  const latestNews = latestNewsList.filter(item => item.fields.title !== news?.fields.title).slice(0, 3);

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">News Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      {/* Section 1: Hero + Body */}
      <section className="relative w-full pb-[180px]">
        <NewsHeroSection />
        <NewsBodySection news={news}/>
      </section>
      {/* Section 2: Latest News */}
      {latestNews.length !== 0 && <div className="w-full bg-[#181c23] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-white text-xl font-semibold mb-6">LATEST NEWS</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {latestNews.map((item, idx) => (
              <LatestNews key={idx} item={item as unknown as NewsPost}/>
            ))}
          </div>
        </div>
      </div>}
      {/* Section 3: Footer */}
      <CTASection 
        heading="Ready to Experience the New Imo?"
        subtext="Discover our vision for an inclusive, empowered, and connected state."
        buttonLabel="Contact Us"
        buttonHref="/contact-us"
      />
      <Footer />
    </div>
  );
} 