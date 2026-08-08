"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiBook } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";
import { gatedHref } from "@/lib/authLinks";

export default function BooksSection({ books = [] }) {
  return (
    <section className="section-py bg-white relative">
      <div className="page-container">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
            From the library
          </h2>
          <Link
            href={gatedHref("/library")}
            className="shrink-0 text-xs font-medium text-neutral-600 transition-colors hover:text-emerald-700"
          >
            View all
          </Link>
        </div>

        {/* A shelf of covers: the cover is the content, so the cards lose their
            borders, blurbs and per-item buttons. Title and author only. */}
        {books.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-8"
          >
            {/* Eight covers fill one row at lg and two rows at sm. Below sm the
                grid is three wide, so the last two are hidden to leave two
                complete rows of three rather than a stranded partial row. */}
            {books.map((book, index) => (
              <Link
                key={book._id}
                href={gatedHref("/library")}
                className={`group block ${index >= 6 ? "hidden sm:block" : ""}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-neutral-100">
                  {book.coverImage ? (
                    <Image
                      src={urlFor(book.coverImage).width(240).height(320).url()}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 110px"
                      placeholder={book.coverImage.lqip ? "blur" : "empty"}
                      blurDataURL={book.coverImage.lqip}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-300">
                      <FiBook size={20} />
                    </div>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-medium leading-snug text-neutral-900 transition-colors group-hover:text-emerald-700">
                  {book.title}
                </p>
                {book.author && (
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-neutral-500">{book.author}</p>
                )}
              </Link>
            ))}
          </motion.div>
        ) : (
          <p className="py-10 text-center text-sm text-neutral-500">
            No books in the library yet.
          </p>
        )}
      </div>
    </section>
  );
}
