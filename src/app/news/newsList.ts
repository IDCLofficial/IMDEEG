import { contentfulService } from "../../../lib/contentful";

export async function getNewsListByMinistry(){
  const newsList = await contentfulService.getBlogsByMinistry(process.env.NEXT_PUBLIC_CONTENTFUL_MINISTRY_ID!);
  return newsList;
}

export async function getNewsBySlug(slug:string){
  const news = await contentfulService.getBlogBySlug(slug);
  return news;
}

export async function getCategories(){
  const categories = await contentfulService.getCategories();
  return categories;
}

export async function getNewsListByCategoryId(id:string, page:number){
  const newsList = await contentfulService.getBlogsByCategoryId(id, process.env.NEXT_PUBLIC_CONTENTFUL_MINISTRY_ID!, page)
  return newsList
}

export async function fetchBlogTitlesAndSlugs(){
  const titlesAndSlugs = await contentfulService.getBlogTitlesAndSlugsByMinistryId(process.env.NEXT_PUBLIC_CONTENTFUL_MINISTRY_ID!);
  return titlesAndSlugs;
}