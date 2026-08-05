"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiBookOpen, FiHeart, FiGlobe, FiLifeBuoy } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import CountdownTimer from "@/components/CountdownTimer";
import AnthemSection from "@/components/AnthemSection";
import WeeklyPosts from "@/components/WeeklyPosts";
import ArticlesSection from "@/components/ArticlesSection";
import BooksSection from "@/components/BooksSection";
import NewsSection from "@/components/NewsSection";

// Local static assets — kept as static files (not Sanity-driven) per the old heroImages array.
const heroImages = [
  "/assets/carousel/weekly_activities_schedule.jpg",
  "/assets/carousel/carousel_event_1.jpg",
  "/assets/carousel/carousel_event_2.jpg",
  "/assets/carousel/carousel_event_3.jpg",
  "/assets/carousel/weekly_prayers.jpg",
  "/assets/carousel/bible_study.jpg",
  "/assets/carousel/group_photo.jpg",
];

const pillars = [
  { icon: <FiBookOpen />, title: "Bible Study" },
  { icon: <FiHeart />, title: "Prayer" },
  { icon: <FiGlobe />, title: "Evangelism" },
  { icon: <FiLifeBuoy />, title: "Righteousness" },
];

export default function HomeView({ event, weeklyPosts, articles, news, books, galleryImages }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImageCount = heroImages.length;
  const nextSlide = (currentSlide + 1) % heroImageCount;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImageCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImageCount]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="page-container">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-6 flex flex-col items-start text-left space-y-6 md:space-y-8 z-20 w-full"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm"
              >
                <span className="bg-emerald-700 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  New
                </span>
                <span className="text-xs font-medium text-neutral-800">Academic Session {currentYear}</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="h1 text-neutral-900"
              >
                The{" "}
                <span className="inline-block decoration-4 decoration-emerald-200 underline-offset-4">
                  Unique
                </span>{" "}
                <br />
                Fellowship <br />
                on Campus.
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-base text-neutral-600 max-w-md leading-relaxed"
              >
                Experience a community where spiritual growth meets academic excellence. Welcome to the family.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2 w-full">
                <Link
                  href="/activities"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  Join a Gathering <FiArrowRight />
                </Link>
              </motion.div>
            </motion.div>

            {/* Image/Carousel Section — a main card with the next slide peeking
                above it, so the queue is visible rather than hidden. Slides move
                top-to-bottom: the preview card descends into the main frame. */}
            <div className="lg:col-span-6 w-full relative z-10">
              <div className="relative mx-auto max-w-[460px] lg:ml-auto lg:mr-0 pt-14">
                {/* Peek card — shows what's coming next */}
                <div className="absolute right-6 top-0 z-20 h-32 w-44 overflow-hidden rounded-2xl border border-white bg-neutral-100 shadow-lg shadow-neutral-900/10 sm:h-36 sm:w-52">
                  {heroImages.map((src, idx) => (
                    <Image
                      key={`peek-${src}`}
                      src={src}
                      alt=""
                      fill
                      sizes="208px"
                      className={`object-cover transition-opacity duration-500 ${
                        idx === nextSlide ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-neutral-700 backdrop-blur">
                    Up next
                  </span>
                </div>

                {/* Main frame */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-xl shadow-neutral-900/5">
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset }) => {
                      const swipeThreshold = 50;
                      if (offset.x > swipeThreshold) {
                        setCurrentSlide((prev) => (prev - 1 + heroImageCount) % heroImageCount);
                      } else if (offset.x < -swipeThreshold) {
                        setCurrentSlide((prev) => (prev + 1) % heroImageCount);
                      }
                    }}
                    className="absolute inset-0 z-10 h-full w-full cursor-grab active:cursor-grabbing"
                  >
                    {/* Each slide descends into place and the outgoing one continues
                        downward, giving a single top-to-bottom direction of travel. */}
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={currentSlide}
                        initial={{ y: "-100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={heroImages[currentSlide]}
                          alt=""
                          fill
                          priority
                          sizes="(max-width: 1024px) 90vw, 460px"
                          className="object-cover pointer-events-none select-none"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  {/* Progress ticks */}
                  <div className="absolute bottom-5 left-5 z-20 flex gap-1">
                    {heroImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  <Link
                    href="/activities"
                    aria-label="See our activities"
                    className="absolute bottom-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md backdrop-blur transition-colors hover:bg-emerald-700 hover:text-white"
                  >
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CountdownTimer event={event} />

      <AnthemSection />

      {/* Mission Section: The Four Pillars */}
      <section className="section-py bg-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="page-container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 relative">
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-4 block relative z-10">
              Our Mandate
            </span>
            <h2 className="h2 text-neutral-900 mb-6 relative z-10">The Four Pillars</h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {pillars.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group transition-all hover:border-emerald-500/30"
              >
                <div className="text-4xl lg:text-5xl mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-neutral-900">{item.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WeeklyPosts posts={weeklyPosts} />

      <ArticlesSection articles={articles} />

      <BooksSection books={books} />

      <NewsSection news={news} />

      {/* Gallery Strip */}
      <section className="section-py overflow-hidden bg-white">
        <div className="page-container mb-10 flex justify-between items-center">
          <h2 className="h2 text-neutral-900">Captured Moments</h2>
          <Link
            href="/gallery"
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"
          >
            <FiArrowRight />
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto px-6 pb-10 no-scrollbar snap-x">
          {galleryImages && galleryImages.length > 0 ? (
            galleryImages.map((img) => (
              <div
                key={img._id}
                className="min-w-[200px] md:min-w-[250px] aspect-square rounded-2xl overflow-hidden snap-center shadow-lg border-4 border-white relative"
              >
                <Image
                  src={urlFor(img.image).width(400).height(400).url()}
                  alt={img.caption || "Gallery"}
                  fill
                  sizes="250px"
                  className="object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))
          ) : (
            <p className="text-neutral-600 px-6">Gallery photos coming soon.</p>
          )}
        </div>
      </section>
    </div>
  );
}
