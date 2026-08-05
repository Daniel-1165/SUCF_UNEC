"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiBook, FiArrowRight } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";

export default function BooksSection({ books = [] }) {
  return (
    <section className="section-py bg-white relative">
      <div className="page-container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="h2 text-neutral-900 mb-2">Recommended For You</h2>
            <p className="text-neutral-600 font-medium">Top picks for your spiritual growth.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {books.length > 0 ? (
            books.map((book, index) => {
              const fileUrl = book.fileUrl;
              return (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-100 transition-all group"
                >
                  {/* Book Image */}
                  <div className="w-full sm:w-40 h-48 sm:h-auto shrink-0 rounded-2xl overflow-hidden bg-slate-100 relative">
                    {book.coverImage ? (
                      <Image
                        src={urlFor(book.coverImage).width(320).height(400).url()}
                        alt={book.title}
                        fill
                        sizes="160px"
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
                        <FiBook size={40} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow flex flex-col justify-center py-2 pr-4">
                    <div className="mb-auto">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 block">
                        {book.semester || "Trending"}
                      </span>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-1 leading-tight">{book.title}</h3>
                      <p className="text-neutral-600 text-sm font-bold uppercase tracking-wider mb-4">
                        {book.author || "SUCF UNEC"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          download
                          className="text-neutral-900 font-bold text-sm flex items-center gap-2 group/link hover:text-emerald-600 transition-colors"
                        >
                          Read Now <FiArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <Link
                          href="/library"
                          className="text-neutral-600 font-bold text-sm flex items-center gap-2 hover:text-emerald-600 transition-colors"
                        >
                          View in Library <FiArrowRight />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
              <FiBook className="text-4xl text-slate-300 mx-auto mb-3" />
              <p className="text-neutral-800 font-medium italic">No recommended books found in the library yet.</p>
            </div>
          )}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
          >
            View Full Library <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
