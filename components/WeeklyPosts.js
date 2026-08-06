"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";

export default function WeeklyPosts({ posts = [] }) {
  // If no posts, don't show the section at all.
  if (!posts || posts.length === 0) return null;

  return (
    <section className="section-py bg-white">
      <div className="page-container">
        <h2 className="mb-6 text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
          Weekly spotlight
        </h2>

        {/* Square corners: these are flyers, and rounding them crops the
            designed edge. No card chrome or hover lift either. */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative overflow-hidden bg-neutral-100"
              // Render at the image's real aspect ratio so any upload shape
              // (portrait flyer, square, wide banner) shows uncropped.
              style={{ aspectRatio: post.image?.aspectRatio || 4 / 5 }}
            >
              {post.image ? (
                <Image
                  src={urlFor(post.image).width(800).url()}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 90vw, 33vw"
                  placeholder={post.image.lqip ? "blur" : "empty"}
                  blurDataURL={post.image.lqip}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-300">
                  <FiFileText size={28} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
