import NewsCard from "./NewsCard";
import { newsData } from "./newsData";

export default function NewsGrid() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {newsData.map((item) => (
        <NewsCard news={item} key={item.id} />
      ))}
    </div>
  );
} 