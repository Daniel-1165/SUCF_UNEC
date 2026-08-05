"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";

export default function WeeklyPosts({ posts = [] }) {
  // If no posts, don't show the section at all.
  if (!posts || posts.length === 0) return null;

  return (
    <section className="section-py bg-emerald-50/30 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="page-container relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-[10px] mb-2 block">
              Spiritual Nourishment
            </span>
            <h2 className="h2 text-neutral-900">
              Weekly <span>Spotlight.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="zeni-card bg-white overflow-hidden group relative flex flex-col"
              // Render at the image's real aspect ratio so any upload shape
              // (portrait flyer, square, wide banner) shows uncropped.
              style={{ aspectRatio: post.image?.aspectRatio || 4 / 5 }}
            >
              {post.image ? (
                <Image
                  src={urlFor(post.image).width(800).url()}
                  alt="Weekly Post"
                  fill
                  sizes="(max-width: 768px) 90vw, 33vw"
                  placeholder={post.image.lqip ? "blur" : "empty"}
                  blurDataURL={post.image.lqip}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <FiFileText size={48} />
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
