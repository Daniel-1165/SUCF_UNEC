"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FiX, FiZoomIn, FiImage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";

// Deterministic-ish masonry span pattern, mirrors the legacy procedural layout.
function getSpanClass(index) {
  const pattern = index % 10;
  if (pattern === 0) return "md:col-span-2 md:row-span-2";
  if (pattern === 3) return "md:col-span-1 md:row-span-2";
  if (pattern === 6) return "md:col-span-2 md:row-span-1";
  return "md:col-span-1 md:row-span-1";
}

export default function GalleryView({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(images.map((img) => img.category).filter(Boolean))
    );
    return ["All", ...unique];
  }, [images]);

  const displayImages =
    filter === "All" ? images : images.filter((img) => img.category === filter);

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 relative selection:bg-emerald-500 selection:text-white">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="page-container relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-900/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Visual Chronicles
            </motion.div>
            <h1 className="h1 mb-4">
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                Gallery
              </span>
              .
            </h1>
            <p className="text-gray-400 max-w-md text-lg font-medium">
              Capturing the spirit of fellowship, worship, and student life at SUCF UNEC.
            </p>
          </div>

          {/* Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                    filter === cat
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-[250px] grid-flow-dense"
        >
          <AnimatePresence mode="popLayout">
            {displayImages.map((img, index) => {
              const spanClass = getSpanClass(index);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={img._id}
                  onClick={() => setSelectedImage(img)}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/5 hover:border-emerald-500/50 transition-all duration-500 ${spanClass}`}
                >
                  {/* Image only — no overlaid caption. A small zoom icon on
                      hover is enough to signal it opens; the caption lives in
                      the lightbox sidebar instead. */}
                  <div className="absolute inset-0">
                    {img.image && (
                      <Image
                        src={urlFor(img.image).width(900).url()}
                        alt={img.caption || "Gallery image"}
                        fill
                        sizes="(min-width: 768px) 25vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

                  <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                    <FiZoomIn size={16} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {displayImages.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-white/10 rounded-[3rem]">
            <FiImage className="text-6xl text-white/20 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No images found</h3>
            <p className="text-gray-500">Try selecting a different category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <FiX size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-7xl w-full max-h-[90vh] flex flex-col md:flex-row bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-2xl border border-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Full Image */}
              <div className="flex-grow relative bg-black/50 flex items-center justify-center p-4 min-h-[50vh]">
                {selectedImage.image && (
                  <Image
                    src={urlFor(selectedImage.image).width(1600).url()}
                    alt={selectedImage.caption || "Gallery image"}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                )}
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-80 bg-[#111] p-8 shrink-0 border-l border-white/5 flex flex-col justify-center">
                <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                  {selectedImage.category || "Gallery Item"}
                </span>
                <h3 className="h3 text-white italic leading-none mb-6">
                  {selectedImage.caption || "Moment"}
                </h3>
                <div className="h-1 w-12 bg-emerald-600 rounded-full mb-6" />
                <p className="text-gray-400 text-sm leading-relaxed">
                  Captured moment from our fellowship life. We cherish every opportunity to
                  gather in His name.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
