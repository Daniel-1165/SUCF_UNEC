"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiMapPin, FiClock, FiX, FiCalendar } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";
import { fadeInUp } from "@/lib/animations";

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
      <div className="section-py border-y border-neutral-200 bg-neutral-50 relative overflow-hidden">
        <div className="page-container relative z-10 mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
            No service scheduled yet
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Check back soon for our next gathering, or reach out and we&apos;ll let you know.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Contact us <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  const flyerUrl = event.flyer ? urlFor(event.flyer).width(900).height(1125).url() : null;

  const countdownUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    // Tinted band with hairline edges so this reads as its own section rather
    // than continuing the white hero above it.
    <div className="border-y border-neutral-200 bg-neutral-50">
      <div className="page-container section-py">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Flyer — a plain framed image that opens the detail modal */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              aria-label={`View details for ${event.title || "this fellowship"}`}
              className="relative mx-auto block aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300 sm:max-w-sm lg:max-w-none"
            >
              {flyerUrl ? (
                <Image
                  src={flyerUrl}
                  alt={event.title || "Fellowship flyer"}
                  fill
                  sizes="(max-width: 1024px) 90vw, 400px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full flex-col items-center justify-center gap-2 text-neutral-500">
                  <FiCalendar className="text-2xl" />
                  <span className="text-xs font-medium">Tap for details</span>
                </span>
              )}
            </button>
          </motion.div>

          {/* Content & countdown */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
              {event.title}
            </h2>

            {event.bibleReference && (
              <p className="mt-2 text-sm italic leading-relaxed text-neutral-600">
                {event.bibleReference}
              </p>
            )}

            {isLive ? (
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                  Fellowship is live
                </span>
                <p className="mt-3 text-xs text-neutral-500">
                  Join us now{event.location ? ` at ${event.location}` : ""}.
                </p>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-3">
                {countdownUnits.map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white sm:h-14 sm:w-14">
                      {/* tabular-nums keeps the digits from jittering as they tick */}
                      <span className="text-base font-semibold tabular-nums text-neutral-900 sm:text-lg">
                        {String(item.value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="mt-2 text-[11px] text-neutral-500">{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Get directions <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Quiet invitation strip — replaces the old scrolling ticker */}
      <div className="border-t border-neutral-200">
        <p className="page-container py-4 text-center text-xs text-neutral-600">
          {event.location
            ? `Join us at ${event.location} for a life-changing session in God's presence.`
            : "Join us for a life-changing session in God's presence."}
        </p>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={event.title || "Service information"}
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white md:flex-row"
            >
              <button
                onClick={() => setShowDetails(false)}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur transition-colors hover:text-neutral-900"
                aria-label="Close event details"
              >
                <FiX />
              </button>

              <div className="relative h-56 w-full shrink-0 overflow-hidden bg-neutral-100 md:h-auto md:w-1/2">
                {flyerUrl ? (
                  <Image
                    src={flyerUrl}
                    alt={event.title || "Fellowship flyer"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center text-neutral-500">
                    <FiCalendar className="text-2xl" />
                    <p className="text-xs font-medium">Weekly service</p>
                  </div>
                )}
              </div>

              <div className="w-full overflow-y-auto p-5 sm:p-6 md:w-1/2 md:p-8">
                <h3 className="text-base font-semibold tracking-tight text-neutral-900">
                  {event.title}
                </h3>
                {event.bibleReference && (
                  <p className="mt-1.5 text-sm italic text-neutral-600">{event.bibleReference}</p>
                )}

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <FiClock className="mt-0.5 shrink-0 text-emerald-700" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Schedule</p>
                      <p className="mt-0.5 text-sm text-neutral-600">
                        {new Date(event.eventDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                        {event.eventTime ? ` • ${event.eventTime}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiMapPin className="mt-0.5 shrink-0 text-emerald-700" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Venue</p>
                      <p className="mt-0.5 text-sm text-neutral-600">
                        {event.location || "Architecture Auditorium, UNEC"}
                      </p>
                    </div>
                  </div>

                  {event.description && (
                    <p className="border-t border-neutral-200 pt-4 text-sm leading-relaxed text-neutral-600">
                      {event.description}
                    </p>
                  )}
                </div>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  Get directions <FiArrowRight />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
