"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight, FiClock } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsSection({ news = [] }) {
  if (!news || news.length === 0) return null;

  const [lead, ...rest] = news;

  return (
    <section className="section-py bg-white relative overflow-hidden">
      <div className="page-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-blue-600"></span>
              <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Updates</span>
            </div>
            <h2 className="h2 text-neutral-900">
              Latest <span className="italic font-serif">Fellowship</span> News
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-3 text-xs font-black text-neutral-600 uppercase tracking-widest hover:text-blue-600 transition-all group shrink-0"
          >
            See Full History <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News content grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-12 gap-12"
        >
          {/* Hero News (Overlay Style) */}
          <div className="lg:col-span-7">
            <Link
              href={`/news/${lead.slug}`}
              className="group relative block rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-2xl shadow-blue-900/10 transition-all duration-700 hover:-translate-y-2"
              // Card takes the image's own ratio, so nothing is cropped or
              // letterboxed no matter what shape gets uploaded later.
              style={{ aspectRatio: lead.mainImage?.aspectRatio || 16 / 10 }}
            >
              {lead.mainImage ? (
                <Image
                  src={urlFor(lead.mainImage).width(1200).url()}
                  alt={lead.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  placeholder={lead.mainImage.lqip ? "blur" : "empty"}
                  blurDataURL={lead.mainImage.lqip}
                  className="relative z-10 object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                  <FiClock size={80} />
                </div>
              )}

              {/* Gradient Overlay — must sit ABOVE the z-10 image, or it can't
                  darken it and the white text below becomes unreadable. */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/10"></div>

              {/* Overlay Text Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 z-30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    Top News
                  </span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    {formatDate(lead.publishedAt)}
                  </span>
                </div>
                <h3 className="h2 text-white mb-4 line-clamp-3 group-hover:text-blue-400 transition-colors">
                  {lead.title}
                </h3>
                <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                  Read Full Story <FiArrowRight />
                </div>
              </div>
            </Link>
          </div>

          {/* Small List Items (Timeline Style) */}
          {rest.length > 0 && (
            <div className="lg:col-span-5 flex flex-col justify-center space-y-12">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/40"></div>
                <h4 className="text-xs font-black text-neutral-600 uppercase tracking-[0.3em]">Latest Feed</h4>
              </div>
              <div className="relative pl-8 space-y-12 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                {rest.map((item) => (
                  <Link key={item._id} href={`/news/${item.slug}`} className="group relative block">
                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-slate-200 group-hover:bg-blue-600 group-hover:scale-125 transition-all"></div>

                    <div className="flex gap-6">
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 block">
                          {formatDate(item.publishedAt)}
                        </span>
                        <h5 className="text-lg font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors tracking-tight">
                          {item.title}
                        </h5>
                      </div>
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 shadow-sm relative">
                        {item.mainImage && (
                          <Image
                            src={urlFor(item.mainImage).width(160).height(160).url()}
                            alt={item.title}
                            fill
                            sizes="80px"
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
