import Image from "next/image";
import Link from "next/link";
import { NewsPost } from "../../../lib/types";


export default function NewsCard({ news }: { news: NewsPost }) {
  return (
    <Link href={`/news/${news.fields.title}`} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <Image src={`https:${String(news.fields.featuredImage?.fields.file.url)}` || ""} alt={news.fields.title} width={1280} height={1280} className="object-cover h-full w-full object-[50%_20%]" />
        <span className="absolute
         top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded font-semibold">{news.fields.category.fields.category_name}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{news.fields.title}</h3>
        <p className="text-dark-primary-body mb-4 line-clamp-2">{news.fields?.content.content[0].content[0].value}</p>
        <span className="text-gray-500 text-xs mt-auto">{new Date(news.sys.createdAt).toDateString()}</span>
      </div>
    </Link>
  );
} 