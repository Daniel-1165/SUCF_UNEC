import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles } from "@/lib/sanity/queries";
import ArticleDetailView from "./ArticleDetailView";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
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
