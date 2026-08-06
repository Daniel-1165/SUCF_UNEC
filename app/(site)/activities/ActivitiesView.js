"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiCompass, FiX } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";
import { staggerContainer, staggerItem } from "@/lib/animations";

const DAY_STYLE = {
  Sunday: { icon: "✝️" },
  Wednesday: { icon: "🔥" },
  Thursday: { icon: "📖" },
};

// Convenience "Get Directions" links, keyed by day name. Not CMS content —
// just a static map-modal helper mirroring the legacy site's behavior.
function getDirectionsUrl(day) {
  if (day === "Sunday" || day === "Thursday") {
    return "https://maps.google.com/maps?saddr=UNEC+Gate,+Enugu&daddr=Department+of+Architecture,+University+of+Nigeria,+Enugu+Campus&output=embed";
  }
  if (day === "Wednesday") {
    return "https://maps.google.com/maps?q=Freedom+Field+UNEC&output=embed";
  }
  return null;
}

export default function ActivitiesView({ weeklySchedule, units }) {
  const [mapUrl, setMapUrl] = useState(null);

  const handleDirection = (day) => {
    const url = getDirectionsUrl(day);
    if (url) setMapUrl(url);
  };

  return (
    <div className="min-h-screen bg-white font-sans pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      {/* Map Modal — same behaviour, quieter chrome */}
      {mapUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4"
          onClick={() => setMapUrl(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Directions map"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative h-[60vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-200 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMapUrl(null)}
              aria-label="Close map"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:text-emerald-700"
            >
              <FiX size={16} />
            </button>
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={mapUrl}
              className="h-full w-full"
              title="Directions Map"
            ></iframe>
          </motion.div>
        </div>
      )}

      <div className="page-container">
        {/* Header — no eyebrow pill, no pulsing dot. */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 max-w-2xl"
        >
          <h1 className="h1 text-neutral-900">
            Join Our <span>Fellowship</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            We gather weekly to grow, pray, and sharpen one another. Every student is welcome to the
            Den.
          </p>
        </motion.header>

        {/* Weekly schedule */}
        {weeklySchedule.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {weeklySchedule.map((event, index) => (
              <motion.div key={`${event.day}-${index}`} variants={staggerItem}>
                <div className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-5">
                  <span
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-50 text-2xl"
                    aria-hidden="true"
                  >
                    {DAY_STYLE[event.day]?.icon || "📅"}
                  </span>

                  <h3 className="text-base font-semibold tracking-tight text-neutral-900">
                    {event.day}
                  </h3>
                  {event.title && (
                    <p className="mt-0.5 text-xs font-medium text-emerald-700">{event.title}</p>
                  )}

                  <div className="mt-4 flex-1 space-y-2.5">
                    {event.time && (
                      <div className="flex items-start gap-2.5">
                        <FiClock size={14} className="mt-0.5 shrink-0 text-neutral-400" />
                        <p className="text-xs text-neutral-600">{event.time}</p>
                      </div>
                    )}

                    {event.description && (
                      <div className="flex items-start gap-2.5">
                        <FiMapPin size={14} className="mt-0.5 shrink-0 text-neutral-400" />
                        <p className="text-xs leading-relaxed text-neutral-600">
                          {event.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {getDirectionsUrl(event.day) && (
                    <button
                      onClick={() => handleDirection(event.day)}
                      className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-xs font-medium text-neutral-900 transition-colors hover:border-emerald-700 hover:text-emerald-700"
                    >
                      Get Directions <FiCompass size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="mb-16 border-t border-neutral-100 py-16 text-sm text-neutral-500">
            Our weekly schedule will be published here soon.
          </p>
        )}

        {/* Units */}
        <div className="mb-16">
          <div className="mb-6 max-w-2xl">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
              Serve in Unity
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Join one of our units and use your gifts to advance the Kingdom on campus.
            </p>
          </div>

          {units.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4"
            >
              {units.map((unit, index) => (
                <motion.div
                  key={unit.name || index}
                  variants={staggerItem}
                  className="group flex flex-col"
                >
                  <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                    {unit.image ? (
                      <Image
                        src={urlFor(unit.image).width(480).height(360).url()}
                        alt={unit.name || ""}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-medium text-neutral-400">
                        {unit.name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-medium leading-snug text-neutral-900">{unit.name}</h3>
                  {unit.description && (
                    <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                      {unit.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-sm text-neutral-500">Fellowship units will be listed here soon.</p>
          )}
        </div>

        {/* Closing note — a plain bordered panel instead of the dark, blurred,
            glowing slab it used to be. */}
        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
              More than just gatherings
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              We also have other weekly wing activities and special programs throughout the
              semester. Connect with us to stay updated.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Contact Wing Reps
          </Link>
        </div>
      </div>
    </div>
  );
}
