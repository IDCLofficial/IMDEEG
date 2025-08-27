import Image from "next/image";
import React from "react";
import SocialShareBar from "../SocialShareBar";
import { NewsPost } from "../../../../lib/types";
import MarkdownRenderer from "./MarkdownRenderer";

interface NewsBodySectionProps {
  news: NewsPost;
}

const NewsBodySection: React.FC<NewsBodySectionProps> = ({ news }) => (
  <section className="-mt-[150px] w-full mx-auto max-w-3xl z-20 relative">
    <div className="bg-white mx-auto rounded-xl shadow-lg p-8">
      <div className="relative z-10 w-full flex justify-center pb-2">
        <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
          <Image 
            src={`https:${String(news.fields?.featuredImage?.fields?.file?.url)}`} 
            alt={news.fields.title} 
            width={900} 
            height={400} 
            className="object-cover w-full h-[260px] md:h-[320px]" 
            priority
          />
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{news?.fields?.title}</h1>
        <SocialShareBar date={news?.sys?.createdAt} url={`https://mdeeg.vercel.app/news/${news?.fields.slug}`}/>
      </div>
      <MarkdownRenderer content={news?.fields?.fullNews} />
    </div>
  </section>
);

export default NewsBodySection; 