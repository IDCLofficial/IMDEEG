import Image from "next/image";
import ReadySection from "../ReadySection";
import Footer from "../../components/Footer";
import NewsHeroSection from "./NewsHeroSection";
import NewsBodySection from "./NewsBodySection";
import CTASection from "@/app/components/CTASection";
import SocialShareBar from "../SocialShareBar";
import { newsData } from "../newsData";
import { notFound } from "next/navigation";

interface NewsDetailPageProps {
  slug: string;
}

export default async function NewsDetailPage({ params }: { params: Promise<NewsDetailPageProps> }) {
  // Find the news item by slug or id
  const { slug } = await params;
  const news = newsData.find(
    (item) => item.slug === slug || item.id === slug
  );

  if (!news) {
    // Show a not found message or Next.js 404
    notFound();
  }

  // Optionally, get latest news (excluding the current one)
  const latestNews = newsData.filter((item) => item.id !== news.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      {/* Section 1: Hero + Body */}
      <section className="relative w-full pb-[180px]">
        <NewsHeroSection />
        <NewsBodySection>
          {/* Title & Meta */}
          <div className="relative z-10 w-full flex justify-center pb-2">
            <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
              <Image src={news.img} alt={news.title} width={900} height={400} className="object-cover w-full h-[260px] md:h-[320px]" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{news.title}</h1>
            <SocialShareBar date={news.date} />
          </div>
          {/* Main Content */}
          <div>
            <p className="text-gray-700 mb-6">{news.desc}</p>
            {/* You can add more fields/content here if available in newsData */}
          </div>
        </NewsBodySection>
      </section>
      {/* Section 2: Latest News */}
      <div className="w-full bg-[#181c23] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-white text-xl font-semibold mb-6">LATEST NEWS</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {latestNews.map((item) => (
              <div key={item.id} className="bg-[#232323] rounded-xl overflow-hidden flex-1 min-w-[220px] max-w-xs">
                <div className="relative w-full h-28">
                  <Image src={item.img} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-white text-xs font-semibold mb-2 line-clamp-2">{item.title}</div>
                  <div className="text-gray-400 text-[10px]">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Section 3: Footer */}
      <CTASection heading="Ready to Experience the New Imo?" subtext="Discover our vision for an inclusive, empowered, and connected state." buttonLabel="Contact Us" buttonHref="/contact-us"/>
      <Footer />
    </div>
  );
} 