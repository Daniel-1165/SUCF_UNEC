"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiDownload, FiBook, FiSearch } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function LibraryView({ books }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(books.map((b) => b.semester).filter(Boolean)));
    return ["All", ...unique];
  }, [books]);

  const filteredBooks = books.filter((book) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (book.title?.toLowerCase() || "").includes(term) ||
      (book.author?.toLowerCase() || "").includes(term);

    const matchesCategory = selectedCategory === "All" || book.semester === selectedCategory;

    return matchesSearch && matchesCategory;
  });


  return (
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-white font-sans">
      <div className="page-container">
        {/* Header & Search Section */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
            <div>
              <h1 className="h1 text-neutral-900">
                Discover <span>Knowledge.</span>
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                {books.length} {books.length === 1 ? "book" : "books"} to borrow and read.
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-72 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-neutral-400 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search title or author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>
          </div>

          {/* Categories */}
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.header>

        {/* One grid, no separate "Recommended" block. Two competing lists of the
            same ten books added choice-friction without adding information. */}
        <section>
          {(searchTerm || selectedCategory !== "All") && (
            <p className="mb-5 text-xs text-neutral-500">
              {filteredBooks.length} {filteredBooks.length === 1 ? "result" : "results"}
            </p>
          )}

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7"
          >
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <motion.div layout variants={staggerItem} key={book._id} className="group flex flex-col">
                  <div className="relative mb-2 aspect-[3/4] overflow-hidden rounded-md bg-neutral-100">
                    {book.coverImage ? (
                      <Image
                        src={urlFor(book.coverImage).width(260).height(347).url()}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 12vw, (min-width: 1024px) 15vw, (min-width: 640px) 22vw, 30vw"
                        placeholder={book.coverImage.lqip ? "blur" : "empty"}
                        blurDataURL={book.coverImage.lqip}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-300">
                        <FiBook size={18} />
                      </div>
                    )}

                    {book.fileUrl && (
                      <div className="absolute inset-0 flex items-end justify-center bg-black/30 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <a
                          href={book.fileUrl}
                          download={book.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-[11px] font-medium text-neutral-900 transition-colors hover:bg-emerald-700 hover:text-white"
                        >
                          <FiDownload size={12} /> Get
                        </a>
                      </div>
                    )}
                  </div>

                  <h3 className="line-clamp-2 text-xs font-medium leading-snug text-neutral-900 transition-colors group-hover:text-emerald-700">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-neutral-500">{book.author}</p>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-sm text-neutral-500">No books match your search.</p>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
