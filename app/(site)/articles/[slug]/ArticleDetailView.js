"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiCalendar, FiClock, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import PortableTextBody from "@/components/PortableTextBody";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function calculateReadingTime(body) {
  if (!Array.isArray(body)) return 1;
  const wordsPerMinute = 200;
  const text = body
    .filter((block) => block._type === "block" && Array.isArray(block.children))
    .map((block) => block.children.map((child) => child.text).join(""))
    .join(" ");
  const noOfWords = text.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(noOfWords / wordsPerMinute));
}

export default function ArticleDetailView({ article, relatedArticles }) {
  const readingTime = calculateReadingTime(article.body);

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="page-container">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 md:mb-12"
        >
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-emerald-600 font-bold text-xs uppercase tracking-[0.25em] transition-all group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Explore Articles
          </Link>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-y-12 lg:gap-20">
          {/* Main Content - 70% */}
          <article className="lg:col-span-8 w-full">
            <header className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  {article.category || "Article"}
                </span>
              </div>

              <h1 className="h1 text-neutral-900 mb-4 md:mb-8">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-neutral-600 mb-8 md:mb-12">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest">
                      By {article.author}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {readingTime} min read
                  </span>
                </div>
              </div>

              {/* Featured Image - Centered and Prominent */}
              {article.mainImage && (
                <div className="w-full h-auto max-h-[50vh] md:max-h-[60vh] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 mb-8 md:mb-12">
                  <img
                    src={urlFor(article.mainImage).width(1200).url()}
                    alt={article.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <PortableTextBody value={article.body} className="article-body-content" />
          </article>

          {/* Sidebar - 30% */}
          <aside className="lg:col-span-4 space-y-12">
            {relatedArticles.length > 0 && (
              <div className="sticky top-32">
                <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-widest mb-8">
                  More to read
                </h3>
                <div className="grid gap-8">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related._id}
                      href={`/articles/${related.slug}`}
                      className="group block"
                    >
                      <div className="aspect-video rounded-2xl overflow-hidden bg-slate-50 mb-4 border border-slate-100">
                        {related.mainImage ? (
                          <Image
                            src={urlFor(related.mainImage).width(600).height(340).url()}
                            alt={related.title}
                            width={600}
                            height={340}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <FiFileText size={32} />
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">
                        {related.category || "Article"}
                      </span>
                      <h4 className="text-lg font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                        {related.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
