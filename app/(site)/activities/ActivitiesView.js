"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiCompass, FiX } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";

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
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 zeni-mesh-gradient">
      {/* Map Modal */}
      {mapUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setMapUrl(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl h-[60vh] relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMapUrl(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:bg-emerald-500 hover:text-white transition-all"
            >
              <FiX />
            </button>
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={mapUrl}
              className="w-full h-full"
              title="Directions Map"
            ></iframe>
          </motion.div>
        </div>
      )}

      <header className="page-container mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="section-tag mb-8"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Weekly Gatherings
        </motion.div>

        <h1 className="h1 text-neutral-900 mb-8">
          Join Our <span className="italic">Fellowship.</span>
        </h1>

        <p className="text-neutral-800 text-xl font-medium leading-relaxed mb-12 max-w-2xl">
          We gather weekly to grow, pray, and sharpen one another. Every student is welcome to the
          Den.
        </p>
      </header>

      {weeklySchedule.length > 0 ? (
        <div className="page-container grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
          {weeklySchedule.map((event, index) => (
            <motion.div
              key={`${event.day}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="zeni-card h-full flex flex-col relative z-10 overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F9F7] flex items-center justify-center">
                  <span className="text-5xl">{DAY_STYLE[event.day]?.icon || "📅"}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>

                <div className="p-10 flex-grow flex flex-col">
                  <h2 className="h3 text-neutral-900 mb-1">{event.day}</h2>
                  <h3 className="text-lg font-bold text-emerald-600 mb-8 uppercase tracking-widest">
                    {event.title}
                  </h3>

                  <div className="space-y-6 mb-10 flex-grow">
                    <div className="flex items-center gap-4 text-neutral-900">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F9F7] flex items-center justify-center text-emerald-600">
                        <FiClock className="text-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-0.5">
                          Time
                        </p>
                        <p className="font-bold">{event.time}</p>
                      </div>
                    </div>

                    {event.description && (
                      <div className="flex items-center gap-4 text-neutral-900">
                        <div className="w-10 h-10 rounded-xl bg-[#F5F9F7] flex items-center justify-center text-emerald-600">
                          <FiMapPin className="text-xl" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-0.5">
                            Details
                          </p>
                          <p className="font-bold text-sm leading-tight">{event.description}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {getDirectionsUrl(event.day) && (
                    <button
                      onClick={() => handleDirection(event.day)}
                      className="w-full py-5 rounded-[1.5rem] bg-[#00211F] text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/10"
                    >
                      Get Directions <FiCompass className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="page-container mb-32 text-center">
          <p className="text-neutral-800 font-medium">
            Our weekly schedule will be published here soon.
          </p>
        </div>
      )}

      {/* Units Section */}
      <div className="page-container mb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-tag mb-8"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Fellowship Units
        </motion.div>

        <h2 className="h2 text-neutral-900 mb-6">
          Serve in <span className="italic">Unity.</span>
        </h2>

        <p className="text-neutral-800 text-lg font-medium leading-relaxed mb-16 max-w-2xl">
          Join one of our dynamic units and use your gifts to advance the Kingdom on campus.
        </p>

        {units.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {units.map((unit, index) => (
              <motion.div
                key={unit.name || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                className="group relative"
              >
                <div className="zeni-card h-full flex flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F9F7]">
                    {unit.image ? (
                      <Image
                        src={urlFor(unit.image).width(600).height(450).url()}
                        alt={unit.name}
                        width={600}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-200 text-4xl font-black">
                        {unit.name?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {unit.name}
                    </h3>
                    <p className="text-neutral-800 text-sm leading-relaxed font-medium">
                      {unit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-800 font-medium">
            Fellowship units will be listed here soon.
          </p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="page-container"
      >
        <div className="bg-[#00211F] p-10 md:p-16 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase">
                Weekly Note
              </span>
            </div>
            <h2 className="h2 text-white mb-6">
              More than just <br />
              <span className="text-emerald-400 italic">Gatherings.</span>
            </h2>
            <p className="text-white/70 text-lg font-medium leading-relaxed">
              We also have other weekly wing activities and special programs throughout the
              semester. Connect with us to stay updated.
            </p>
          </div>

          <Link
            href="/contact"
            className="bg-emerald-500 text-[#00211F] px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shrink-0 relative z-10 shadow-2xl shadow-emerald-500/20"
          >
            Contact Wing Reps
          </Link>

          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        </div>
      </motion.div>
    </div>
  );
}
