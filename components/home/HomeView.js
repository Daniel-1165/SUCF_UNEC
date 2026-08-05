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
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImageCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImageCount]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-neutral-900 bg-grid-pattern overflow-x-hidden font-sans">
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
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
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
                className="text-lg text-neutral-800 max-w-md font-medium leading-relaxed border-l-4 border-emerald-500 pl-4"
              >
                Experience a community where spiritual growth meets academic excellence. Welcome to the family.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2 w-full">
                <Link
                  href="/activities"
                  className="flex-1 sm:flex-none justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-wide hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-900/10 flex items-center gap-3"
                >
                  Join a Gathering <FiArrowRight />
                </Link>
              </motion.div>
            </motion.div>

            {/* Image/Carousel Section */}
            <div className="lg:col-span-6 w-full relative z-10">
              {/* Abstract Deco Elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />

              <div className="relative max-w-[500px] mx-auto lg:ml-auto lg:mr-0 aspect-[4/5] rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl shadow-slate-200 transform md:rotate-2 hover:rotate-0 transition-all duration-700 bg-slate-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
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
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
                  >
                    <Image
                      src={heroImages[currentSlide]}
                      alt="SUCF Moments"
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 500px"
                      className="object-cover pointer-events-none select-none"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Overlay Interface UI */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white/90 z-20">
                  <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider">
                    Highlights
                  </div>
                  <div className="flex gap-1">
                    {heroImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentSlide ? "w-8 bg-emerald-400" : "w-2 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Arrow Link */}
                <Link
                  href="/activities"
                  className="absolute bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full shadow-lg border border-white/50 flex items-center justify-center text-slate-900 hover:bg-emerald-600 hover:text-white transition-all z-20 group"
                >
                  <FiArrowRight className="text-xl group-hover:scale-110 transition-transform" />
                </Link>
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
