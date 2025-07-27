import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  news: {
    img: string;
    title: string;
    desc: string;
    date: string;
    badge: string;
  };
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/1`} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <Image src={news.img} alt={news.title} fill className="object-cover" />
        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded font-semibold">{news.badge}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{news.title}</h3>
        <p className="text-dark-primary-body mb-4 line-clamp-2">{news.desc}</p>
        <span className="text-gray-500 text-xs mt-auto">{news.date}</span>
      </div>
    </Link>
  );
} 