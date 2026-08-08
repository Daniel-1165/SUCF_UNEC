import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles } from "@/lib/sanity/queries";
import { shareMetadata } from "@/lib/shareMeta";
import ArticleDetailView from "./ArticleDetailView";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return shareMetadata({
    title: article.title,
    description: article.excerpt,
    image: article.mainImage,
    path: `/articles/${article.slug}`,
    publishedAt: article.publishedAt,
    author: article.author,
  });
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, article._id);

  return <ArticleDetailView article={article} relatedArticles={relatedArticles} />;
}
