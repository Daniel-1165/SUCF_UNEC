"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiFileText } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";

const ROTATE_MS = 9000;

function ReflectionPanel({ reflections }) {
  const [index, setIndex] = useState(0);
  const count = reflections.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [count]);

  const current = reflections[index];
  if (!current) return null;

  return (
    <div className="flex h-full flex-col justify-center rounded-xl border border-neutral-200 bg-neutral-50 p-6">
      {/* Crossfade in place. min-h keeps the panel from jumping as entries of
          different lengths swap in. */}
      <div className="relative min-h-[9rem]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={current._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
          >
            <p className="whitespace-pre-line text-sm leading-[1.8] text-neutral-700">
              {current.text}
            </p>
            {current.source && (
              <footer className="mt-3 text-[11px] text-neutral-500">— {current.source}</footer>
            )}
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-5 flex gap-1.5" aria-hidden="true">
          {reflections.map((r, i) => (
            <span
              key={r._id}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-neutral-700" : "w-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WeeklyPosts({ posts = [], reflections = [] }) {
  const hasPosts = posts && posts.length > 0;
  const hasReflections = reflections && reflections.length > 0;

  // Nothing to show at all — skip the section entirely.
  if (!hasPosts && !hasReflections) return null;

  return (
    <section className="section-py bg-white">
      <div className="page-container">
        <h2 className="mb-6 text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
          Weekly spotlight
        </h2>

        {/* Flyers left, rotating reflection right on desktop; stacked on mobile. */}
        <div className="grid gap-6 lg:grid-cols-12">
          {hasPosts && (
            <div
              className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
                hasReflections ? "lg:col-span-8" : "lg:col-span-12 lg:grid-cols-3"
              }`}
            >
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
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
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
          )}

          {hasReflections && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={hasPosts ? "lg:col-span-4" : "lg:col-span-12"}
            >
              <ReflectionPanel reflections={reflections} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
