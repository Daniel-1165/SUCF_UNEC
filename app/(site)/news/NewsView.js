"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import { staggerContainer, staggerItem } from "@/lib/animations";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsView({ news }) {
  return (
    <div className="min-h-screen bg-white font-sans pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="page-container">
        {/* Header — no eyebrow pill, no pulsing dot. The page title is enough. */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 max-w-3xl"
        >
          <h1 className="h1 text-neutral-900">
            Fellowship <span>News</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Announcements and updates from the community.
          </p>
        </motion.header>

        {/* A newspaper index: hairline-separated rows, date above title, small
            thumbnail on the right. No cards, no shadows, no badges. */}
        {news.length === 0 ? (
          <p className="max-w-3xl border-t border-neutral-100 py-16 text-sm text-neutral-500">
            No news has been published yet.
          </p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl divide-y divide-neutral-100 border-t border-neutral-100"
          >
            {news.map((item) => (
              <motion.article key={item._id} variants={staggerItem}>
                <Link
                  href={`/news/${item.slug}`}
                  className="group flex gap-4 py-5 sm:gap-6 sm:py-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-neutral-500">
                      {formatDate(item.publishedAt)}
                    </p>
                    <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-emerald-700 sm:text-base">
                      {item.title}
                    </h2>
                    {item.excerpt && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                        {item.excerpt}
                      </p>
                    )}
                  </div>

                  {item.mainImage && (
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-20 sm:w-32">
                      <Image
                        src={urlFor(item.mainImage).width(320).height(200).url()}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 96px, 128px"
                        placeholder={item.mainImage.lqip ? "blur" : "empty"}
                        blurDataURL={item.mainImage.lqip}
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
