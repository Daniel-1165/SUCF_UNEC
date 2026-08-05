"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiMapPin,
  FiClock,
  FiX,
  FiCalendar,
  FiShare2,
  FiInfo,
} from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";

// Combine the separate eventDate / eventTime fields from Sanity into a single Date.
function getEventDateTime(event) {
  if (!event?.eventDate) return null;
  const time = event.eventTime || "15:00";
  const date = new Date(`${event.eventDate}T${time}`);
  return isNaN(date.getTime()) ? null : date;
}

export default function CountdownTimer({ event }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const targetTime = getEventDateTime(event)?.getTime() ?? null;

  useEffect(() => {
    if (!targetTime) return;

    const tick = () => {
      const now = Date.now();
      const difference = targetTime - now;

      // Consider the service "live" from start time until 2 hours after.
      setIsLive(difference <= 0 && difference > -2 * 60 * 60 * 1000);

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  // No upcoming event scheduled yet — show a lightweight placeholder instead of crashing.
  if (!event) {
    return (
      <div className="section-py bg-white relative overflow-hidden">
        <div className="page-container relative z-10 text-center max-w-xl">
          <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full border border-emerald-100 mb-6">
            Upcoming Fellowship
          </div>
          <h2 className="h2 text-neutral-900 mb-4">
            No Service Scheduled Yet
          </h2>
          <p className="text-neutral-800 mb-8">
            Check back soon for our next gathering, or reach out and we&apos;ll let you know.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-wide hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-900/10"
          >
            Contact Us <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  const flyerUrl = event.flyer ? urlFor(event.flyer).width(900).height(1125).url() : null;

  return (
    <div className="py-20 md:pt-32 pb-0 bg-white relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="page-container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mx-auto">
          {/* LEFT: Flyer Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-5/12 mx-auto"
          >
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full border border-emerald-100">
                Upcoming Fellowship
              </div>
            </div>

            <div className="relative group cursor-pointer" onClick={() => setShowDetails(true)}>
              <div className="absolute inset-0 bg-emerald-900 rounded-2xl transform rotate-2 scale-[0.98] opacity-10 transition-all duration-500 group-hover:rotate-4 group-hover:scale-100"></div>

              <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] border border-slate-100 aspect-[4/5] flex items-center justify-center">
                {flyerUrl ? (
                  <>
                    <Image
                      src={flyerUrl}
                      alt={event.title || "Fellowship Flyer"}
                      fill
                      sizes="(max-width: 1024px) 90vw, 500px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-xl">
                        <FiInfo className="text-xl text-emerald-900" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                      🖼️
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
                      Tap for details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Content & Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-7/12 text-center lg:text-left"
          >
            <h2 className="h1 text-neutral-900 mb-6 font-heading">
              {event.title}
            </h2>

            {event.bibleReference && (
              <div className="mb-8 relative inline-flex items-center">
                <span className="absolute -left-2 top-0 text-3xl text-emerald-200 font-serif opacity-40">
                  &ldquo;
                </span>
                <p className="text-lg md:text-xl text-neutral-800 font-serif italic pl-4 pr-4">
                  {event.bibleReference}
                </p>
              </div>
            )}

            {isLive ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 flex flex-col items-center lg:items-start"
              >
                <div className="flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-red-600/20 animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span className="text-xl font-bold tracking-tight leading-none">
                    Fellowship is Live!
                  </span>
                </div>
                <p className="mt-4 text-neutral-800 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                  Join us now{event.location ? ` at ${event.location}` : ""}
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg mb-2 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <span className="text-xl md:text-3xl font-bold text-white tabular-nums relative z-10">
                        {String(item.value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="group cursor-pointer">
              <Link href="/contact" className="inline-flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-slate-200 text-slate-900 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <FiArrowRight className="text-xl" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    Need Directions?
                  </span>
                  <span className="block text-sm font-bold text-neutral-900 underline underline-offset-4 decoration-slate-200 group-hover:decoration-emerald-500 transition-all">
                    Get Location Info
                  </span>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Text Slider / Ticker */}
      <div className="w-full border-t border-b border-slate-100 bg-slate-50/50 py-4 mt-24 overflow-hidden relative flex">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50/50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50/50 to-transparent z-10"></div>

        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex items-center whitespace-nowrap"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center mx-8 flex-shrink-0">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                {event.location
                  ? `Join us at ${event.location} for a Life Changing Session in God's Presence`
                  : "Join us for a Life Changing Session in God's Presence"}
              </span>
              <span className="text-slate-300 ml-8">|</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative"
            >
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all backdrop-blur"
                aria-label="Close"
              >
                <FiX />
              </button>

              <div className="w-full md:w-1/2 bg-slate-100 h-64 md:h-auto relative overflow-hidden">
                {flyerUrl ? (
                  <Image src={flyerUrl} alt={event.title} fill sizes="50vw" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                    <FiCalendar className="text-6xl mb-4 opacity-30" />
                    <p className="font-bold uppercase text-xs tracking-widest">Weekly Service</p>
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                  Service Information
                </span>

                <h3 className="h3 text-neutral-900 mb-2">{event.title}</h3>
                {event.bibleReference && (
                  <p className="text-emerald-600 font-serif italic mb-6">{event.bibleReference}</p>
                )}

                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <FiClock />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">Schedule</p>
                      <p className="text-sm text-neutral-800">
                        {new Date(event.eventDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                        {event.eventTime ? ` • ${event.eventTime}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <FiMapPin />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">Venue</p>
                      <p className="text-sm text-neutral-800">{event.location || "Architecture Auditorium, UNEC"}</p>
                    </div>
                  </div>

                  {event.description && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-neutral-800 leading-relaxed text-sm">{event.description}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="flex-1 py-4 bg-slate-900 text-white rounded-xl text-center font-bold text-sm hover:bg-slate-800 transition-colors uppercase tracking-wide"
                  >
                    Get Directions
                  </Link>
                  <button className="px-5 py-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200 transition-colors" aria-label="Share">
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
