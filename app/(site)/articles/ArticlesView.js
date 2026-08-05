"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const CATEGORIES = ["All", "Faith", "Campus Life", "Testimonies", "Events", "Other"];

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticlesView({ articles }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="page-container">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Articles & Insights
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="h1 text-neutral-900 mb-4"
          >
            Inspiring <span>Articles</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-800 max-w-2xl mx-auto"
          >
            Explore faith-building content, testimonies, and insights from our community
          </motion.p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                selectedCategory === category
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-20">📝</div>
            <p className="text-neutral-600 font-bold uppercase tracking-wider text-sm">
              No articles found in this category
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredArticles.map((article) => (
              <motion.article
                key={article._id}
                variants={staggerItem}
                className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-row md:flex-col h-auto md:h-full border border-slate-50"
              >
                {/* Article Image */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="relative w-[130px] sm:w-[160px] md:w-full aspect-square md:aspect-[16/10] overflow-hidden bg-slate-100 shrink-0"
                >
                  {article.mainImage ? (
                    <Image
                      src={urlFor(article.mainImage).width(800).height(500).url()}
                      alt={article.title}
                      fill
                      sizes="(max-width: 767px) 150px, (max-width: 1023px) 50vw, 33vw"
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
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-500 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-full">
                      {article.category || "Article"}
                    </span>
                  </div>
                </Link>

                {/* Article Content */}
                <div className="p-4 sm:p-5 md:p-8 flex-1 flex flex-col justify-center md:justify-start overflow-hidden">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs md:text-sm text-neutral-600 mb-1 md:mb-3">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar size={12} className="text-emerald-500" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/articles/${article.slug}`}>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 mb-1 md:mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                      {article.title}
                    </h3>
                  </Link>

                  {/* Excerpt - ONLY if explicitly provided */}
                  {article.excerpt && (
                    <p className="text-sm text-neutral-800 mb-2 md:mb-4 line-clamp-2 flex-1 font-serif italic">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Read More Link */}
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-2 py-2 min-h-11 text-xs md:text-sm text-emerald-600 font-bold uppercase tracking-wider hover:gap-3 transition-all group"
                  >
                    Full Article
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
