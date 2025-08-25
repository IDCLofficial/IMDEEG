import { contentfulService } from '../../../lib/contentful';
import Image from 'next/image';
import Link from 'next/link';

export interface LatestNewsProps {
  title: string; // The Latest News
  subtitle?: string; // small paragraph under heading
}

export default async function LatestNews({ title, subtitle }: LatestNewsProps) {
  const latest = await contentfulService.getBlogsByMinistry(process.env.NEXT_PUBLIC_CONTENTFUL_MINISTRY_ID!); 
  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-3 text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.slice(0, 3).map((post) => (
            <article key={post.sys.id} className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 overflow-hidden">
              <div className="relative aspect-[16/10] w-full">
                <Image src={`https:${post.fields.featuredImage?.fields.file.url}`} alt={post.fields.title} fill sizes="(min-width:1024px) 400px, 100vw" className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-[18px] font-extrabold text-gray-900 leading-snug">
                  {post.fields.title}
                </h3>
                <div className="mt-2 text-xs text-gray-500">
                  {post.sys.createdAt} • {post.fields.category.fields.category_name}
                </div>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">{post.fields.content.content[0].content[0].value}</p>
                <div className="mt-4">
                  <Link href={`/news/${post.sys.id}`} className="text-red-600 font-semibold hover:underline">
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
