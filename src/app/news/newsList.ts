import { contentfulService } from "../../../lib/contentful";

export async function getNewsList(){
  const newsList = await contentfulService.getBlogsByMinistry(process.env.NEXT_PUBLIC_CONTENTFUL_MINISTRY_ID!);
  return newsList;
}