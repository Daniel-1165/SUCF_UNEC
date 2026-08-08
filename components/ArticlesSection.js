"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";
import { gatedHref } from "@/lib/authLinks";

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
    <section className="section-py bg-white relative">
      <div className="page-container">
        {/* Section Header — no eyebrow pill; the section speaks for itself */}
        <div className="mb-10">
          <h2 className="h2 text-neutral-900">
            Latest <span>Articles</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-600">Inspiring stories and faith-building insights</p>
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
              className="group bg-white rounded-xl overflow-hidden shadow-none hover:border-neutral-200 transition-colors duration-300 flex flex-row md:flex-col h-auto md:h-full border border-neutral-100"
            >
              {/* Article Image */}
              <Link
                href={gatedHref(`/articles/${article.slug}`)}
                className="relative w-[120px] sm:w-[150px] md:w-full aspect-square md:aspect-[16/10] overflow-hidden bg-slate-100 shrink-0"
              >
                {article.mainImage ? (
                  <Image
                    src={urlFor(article.mainImage).width(600).height(375).url()}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 150px, 33vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <FiUser size={24} className="md:hidden" />
                    <FiUser size={48} className="hidden md:block" />
                  </div>
                )}
                <div className="absolute inset-0 hidden"></div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-white/90 text-neutral-700 text-[10px] font-medium rounded-full">
                    {article.category || "Article"}
                  </span>
                </div>
              </Link>

              {/* Article Content */}
              <div className="p-4 sm:p-6 md:p-6 flex-1 flex flex-col justify-center md:justify-start overflow-hidden">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-[11px] text-neutral-500 mb-1 md:mb-2">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar size={10} className="text-emerald-500" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>

                {/* Title */}
                <Link href={gatedHref(`/articles/${article.slug}`)}>
                  <h3 className="text-sm md:text-base font-semibold text-neutral-900 mb-1 md:mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight tracking-tight">
                    {article.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-xs leading-relaxed text-neutral-600 mb-2 md:mb-4 line-clamp-2 flex-1">
                    {article.excerpt}
                  </p>
                )}

                {/* Read More Link */}
                <Link
                  href={gatedHref(`/articles/${article.slug}`)}
                  className="inline-flex items-center gap-2 text-[11px] font-medium text-emerald-700 hover:gap-3 transition-all group"
                >
                  Full Story
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={gatedHref("/articles")}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            View all articles <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
