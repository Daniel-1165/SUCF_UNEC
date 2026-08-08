import { notFound } from "next/navigation";
import { getNewsBySlug, getNews } from "@/lib/sanity/queries";
import { shareMetadata } from "@/lib/shareMeta";
import NewsDetailView from "./NewsDetailView";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return { title: "News Not Found" };
  }

  return shareMetadata({
    title: news.title,
    description: news.excerpt,
    image: news.mainImage,
    path: `/news/${news.slug}`,
    publishedAt: news.publishedAt,
  });
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const allNews = await getNews();
  const relatedNews = allNews.filter((item) => item._id !== news._id).slice(0, 3);

  return <NewsDetailView news={news} relatedNews={relatedNews} />;
}
