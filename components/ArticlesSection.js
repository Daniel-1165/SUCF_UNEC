"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticlesSection({ articles = [] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="section-py bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="page-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Featured Content</span>
            </div>
            <h2 className="h2 text-neutral-900">
              Latest <span>Articles</span>
            </h2>
            <p className="text-neutral-800 mt-2">Inspiring stories and faith-building insights</p>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 group"
          >
            View All Articles
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-row md:flex-col h-auto md:h-full border border-slate-50"
            >
              {/* Article Image */}
              <Link
                href={`/articles/${article.slug}`}
                className="relative w-[120px] sm:w-[150px] md:w-full aspect-square md:aspect-[16/10] overflow-hidden bg-slate-100 shrink-0"
              >
                {article.mainImage ? (
                  <Image
                    src={urlFor(article.mainImage).width(600).height(375).url()}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 150px, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <FiUser size={24} className="md:hidden" />
                    <FiUser size={48} className="hidden md:block" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"></div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-500 text-white text-[8px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                    {article.category || "Article"}
                  </span>
                </div>
              </Link>

              {/* Article Content */}
              <div className="p-4 sm:p-6 md:p-6 flex-1 flex flex-col justify-center md:justify-start overflow-hidden">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1 md:mb-2">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar size={10} className="text-emerald-500" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>

                {/* Title */}
                <Link href={`/articles/${article.slug}`}>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 mb-1 md:mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                    {article.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-[10px] md:text-[13px] leading-relaxed text-neutral-800 mb-2 md:mb-4 line-clamp-2 flex-1 font-serif italic">
                    {article.excerpt}
                  </p>
                )}

                {/* Read More Link */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:gap-3 transition-all group"
                >
                  Full Story
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
