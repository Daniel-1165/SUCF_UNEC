"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight, FiClock } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";
import { gatedHref } from "@/lib/authLinks";

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
        {/* Section Header — centred, no eyebrow label */}
        <div className="mb-8 text-center">
          <h2 className="h2 text-neutral-900">
            Latest <span className="italic font-serif">Fellowship</span> News
          </h2>
          <Link
            href={gatedHref("/news")}
            className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-neutral-500 transition-colors hover:text-emerald-700 group"
          >
            See full history <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News content grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-12 gap-8 lg:gap-10"
        >
          {/* Hero News (Overlay Style) */}
          <div className="lg:col-span-6">
            {/* Caption sits under the image rather than over it — the dark
                gradient that used to make overlaid text readable was dulling
                the photo itself. */}
            <Link href={gatedHref(`/news/${lead.slug}`)} className="group block">
              {/* Height-capped so the lead frame stays in proportion with the
                  story list beside it — a tall source crop used to tower over it. */}
              <div
                className="relative max-h-[15rem] overflow-hidden rounded-2xl bg-neutral-100 sm:max-h-[18rem] lg:max-h-[17rem]"
                style={{ aspectRatio: Math.max(lead.mainImage?.aspectRatio || 16 / 10, 16 / 10) }}
              >
                {lead.mainImage ? (
                  <Image
                    src={urlFor(lead.mainImage).width(1200).url()}
                    alt={lead.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    placeholder={lead.mainImage.lqip ? "blur" : "empty"}
                    blurDataURL={lead.mainImage.lqip}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-50 text-neutral-300">
                    <FiClock size={40} />
                  </div>
                )}
              </div>

              <p className="mt-4 text-[11px] text-neutral-500">{formatDate(lead.publishedAt)}</p>
              <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-emerald-700 sm:text-lg">
                {lead.title}
              </h3>
            </Link>
          </div>

          {/* Secondary stories — a plain rule-separated list, no timeline rail,
              no "Latest Feed" label, no grayscale-to-colour trick. */}
          {rest.length > 0 && (
            <div className="lg:col-span-6">
              <div className="divide-y divide-neutral-100 border-t border-neutral-100">
                {rest.map((item) => (
                  <Link
                    key={item._id}
                    href={gatedHref(`/news/${item.slug}`)}
                    className="group flex gap-4 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-neutral-500">{formatDate(item.publishedAt)}</p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-emerald-700">
                        {item.title}
                      </h3>
                    </div>
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-neutral-100">
                      {item.mainImage && (
                        <Image
                          src={urlFor(item.mainImage).width(120).height(120).url()}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
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
