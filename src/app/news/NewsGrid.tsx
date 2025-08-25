import NewsCard from "./NewsCard";
import { NewsPost } from "../../../lib/types";

export default async function NewsGrid({newsList}: {newsList: NewsPost[]}) {
  if(newsList.length === 0) return(
    <div className="text-center text-dark-primary-body">There is no News available at this time, please check again later.</div>
  )
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {newsList.map((item, idx) => (
        <NewsCard news={item} key={idx} />
      ))}
    </div>
  );
} 