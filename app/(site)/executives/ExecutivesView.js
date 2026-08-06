"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import { staggerContainer, staggerItem } from "@/lib/animations";

function currentSession() {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed, 7 = August
  const year = now.getFullYear();
  return month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}

export default function ExecutivesView({ executives }) {
  return (
    <div className="min-h-screen bg-white font-sans pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="page-container">
        {/* Header — no eyebrow pill, no pulsing dot. */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 max-w-2xl"
        >
          <h1 className="h1 text-neutral-900">
            The <span>Council</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            The executives serving the fellowship for the {currentSession()} academic session.
          </p>
        </motion.header>

        {/* A plain portrait grid: photo, name, role. No floating avatars,
            no blur halos, no social buttons that never linked anywhere. */}
        {executives.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
          >
            {executives.map((exec) => (
              <motion.div key={exec._id} variants={staggerItem} className="flex flex-col">
                <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100">
                  {exec.photo ? (
                    <Image
                      src={urlFor(exec.photo).width(400).height(533).url()}
                      alt={exec.name || ""}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                      placeholder={exec.photo.lqip ? "blur" : "empty"}
                      blurDataURL={exec.photo.lqip}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-medium text-neutral-400">
                      {exec.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <h2 className="text-sm font-medium leading-snug text-neutral-900">{exec.name}</h2>
                {exec.role && (
                  <p className="mt-0.5 text-[11px] leading-snug text-neutral-500">{exec.role}</p>
                )}
                {exec.department && (
                  <p className="text-[11px] leading-snug text-neutral-500">{exec.department}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="border-t border-neutral-100 py-16 text-sm text-neutral-500">
            Executive profiles will be published here soon.
          </p>
        )}

        {/* Closing note — a hairline rule instead of a floating glass card. */}
        <div className="mt-16 border-t border-neutral-100 pt-8">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            &ldquo;Leading a generation to uphold righteous standards, excelling in spirit and in
            truth.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
