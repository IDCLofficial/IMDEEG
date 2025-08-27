import NewsCard from "./NewsCard";
import { getNewsListByCategoryId, getNewsListByMinistry } from "./newsList";

export interface paramsProps{
  filter: string;
  id:string
}

export default async function NewsGrid({params}:{params:paramsProps}) {
  const filteredNewsList = await(() =>{
    if(params) return getNewsListByCategoryId(params.id, 1)
    return getNewsListByMinistry()
  })()
  
  if(filteredNewsList?.length === 0) return(
    <div className="text-center text-dark-primary-body">No news in this cateogry.</div>
  )
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {filteredNewsList?.map((item, idx) => (
        <NewsCard news={item} key={idx} />
      ))}
    </div>
  );
} 