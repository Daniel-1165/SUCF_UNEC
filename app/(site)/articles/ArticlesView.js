"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import { staggerContainer, staggerItem } from "@/lib/animations";

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
    <div className="min-h-screen bg-white font-sans pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="page-container">
        {/* Header — no eyebrow pill, no pulsing dot. */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 max-w-3xl"
        >
          <h1 className="h1 text-neutral-900">
            Inspiring <span>Articles</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Faith-building content, testimonies, and insights from our community.
          </p>
        </motion.header>

        {/* Category filter — same chips as the library page. */}
        <div className="mb-2 flex max-w-3xl gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Same editorial index as /news: hairline rows, small type. */}
        {filteredArticles.length === 0 ? (
          <p className="mt-6 max-w-3xl border-t border-neutral-100 py-16 text-sm text-neutral-500">
            No articles in this category yet.
          </p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-3xl divide-y divide-neutral-100 border-t border-neutral-100"
          >
            {filteredArticles.map((article) => (
              <motion.article key={article._id} variants={staggerItem}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="group flex gap-4 py-5 sm:gap-6 sm:py-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-neutral-500">
                      {formatDate(article.publishedAt)}
                      {article.category && (
                        <span> · {article.category}</span>
                      )}
                    </p>
                    <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-emerald-700 sm:text-base">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  {article.mainImage && (
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-20 sm:w-32">
                      <Image
                        src={urlFor(article.mainImage).width(320).height(200).url()}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 96px, 128px"
                        placeholder={article.mainImage.lqip ? "blur" : "empty"}
                        blurDataURL={article.mainImage.lqip}
                        className="object-cover"
                      />
                    </div>
                  )}
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
