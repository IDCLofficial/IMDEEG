import Image from "next/image";
import type { Metadata } from "next";
import Footer from "@/app/components/Footer";
import NewsHeroSection from "./NewsHeroSection";
import NewsBodySection from "./NewsBodySection";
import CTASection from "@/app/components/CTASection";
import { getNewsBySlug, getNewsListByCategoryId } from "../newsList";
import { LatestNews } from "./LatestNews";
import { NewsPost } from "../../../../../lib/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return { title: "News Not Found | IMDEEG" };
  }

  const title = news.fields.title;
  const description = news.fields.fullNews
    ? news.fields.fullNews.slice(0, 160).replace(/[#*_\n]/g, "").trim()
    : `Read about ${title} from the Imo State Ministry of Digital Economy and E-Governance.`;
  const imageUrl = news.fields.featuredImage?.fields?.file?.url
    ? `https:${news.fields.featuredImage.fields.file.url}`
    : "https://mdeeg.im.gov.ng/logo.png";

  return {
    title: `${title} | IMDEEG News`,
    description,
    openGraph: {
      title,
      description,
      url: `https://mdeeg.im.gov.ng/news/${slug}`,
      type: "article",
      publishedTime: news.sys.createdAt,
      modifiedTime: news.sys.updatedAt,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://mdeeg.im.gov.ng/news/${slug}`,
    },
  };
}


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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: news.fields.title,
            image: news.fields.featuredImage?.fields?.file?.url
              ? [`https:${news.fields.featuredImage.fields.file.url}`]
              : [],
            datePublished: news.sys.createdAt,
            dateModified: news.sys.updatedAt,
            author: {
              "@type": "Organization",
              name: "Imo State Ministry of Digital Economy and E-Governance",
              url: "https://mdeeg.im.gov.ng",
            },
            publisher: {
              "@type": "Organization",
              name: "IMDEEG",
              logo: {
                "@type": "ImageObject",
                url: "https://mdeeg.im.gov.ng/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://mdeeg.im.gov.ng/news/${slug}`,
            },
          }),
        }}
      />
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