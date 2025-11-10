import NewsHeroSection from "./NewsHeroSection";
import NewsSidebar from "./NewsSidebar";
import NewsGrid from "./NewsGrid";
import Footer from "@/app/components/Footer";
import CTASection from "@/app/components/CTASection";
import { fetchBlogTitlesAndSlugs, getCategories } from "./newsList";
import { Category } from "../../../../lib/types";
import { paramsProps } from "./NewsGrid";
import { Suspense } from "react";
import Loading from "../loading";

export default async function NewsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const fetchCategories = await getCategories();
  const categories = [{ fields: { category_name: "All" }, sys:{id:""} }, ...fetchCategories]
  const titlesAndSlugs = await fetchBlogTitlesAndSlugs();

  return (
    <div className="bg-white">
      <NewsHeroSection newsList={titlesAndSlugs} />
      <div className="w-full max-w-[100%] mx-auto flex flex-col lg:flex-row gap-4 md:gap-8 px-2 md:px-8 py-8 md:py-20">
        <NewsSidebar categories={categories as unknown as Category[]} />
        <div className="flex-1">
          <Suspense fallback={<Loading />}>
            <NewsGrid params={params as unknown as paramsProps}/>
          </Suspense>
        </div>
      </div>
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
