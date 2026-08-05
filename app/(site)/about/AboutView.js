"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiUsers, FiAward, FiTarget, FiArrowRight, FiBookOpen } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";
import { staggerContainer, staggerItem } from "@/lib/animations";
import GPACalculator from "@/components/GPACalculator";

function AnthemSection() {
  return (
    <section className="section-py bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full mx-auto px-4 sm:px-6 max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.3em]">
              Our Heritage
            </span>
          </div>
          <h2 className="h2 font-serif text-neutral-900 mb-6">
            The Anthem.
          </h2>
          <div className="w-24 h-1 bg-amber-500/30 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-100 p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200/50 relative"
        >
          <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
          <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />
          <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl" />
          <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />

          <div className="space-y-8 font-serif text-lg md:text-2xl leading-relaxed text-neutral-800 italic">
            <p>
              <span className="text-neutral-900 font-bold not-italic">SUCF the Unique Family</span>
              <br />
              We are marching on by His grace
              <br />
              Following Jesus the author of our faith
              <br />
              And the owner of our soul
            </p>
            <p>
              We shall follow till we all see Him
              <br />
              There is no time to sleep on the way
            </p>
            <p>
              <span className="text-neutral-900 font-bold not-italic">
                Jesus the answer, He is the way
              </span>
              <br />
              Jesus the truth and the life
              <br />
              We shall follow righteousness
              <br />
              We shall follow holiness
              <br />
              Without which no eye shall see Him
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const VALUE_ICONS = [FiTarget, FiUsers, FiAward];

export default function AboutView({ aboutPage, executives }) {
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const vision = aboutPage?.vision;
  const mission = aboutPage?.mission;
  const values = aboutPage?.values || [];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 zeni-mesh-gradient">
      {/* Header */}
      <section className="page-container mb-32">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-8"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Our Story
          </motion.div>

          <h1 className="h1 text-neutral-900 mb-10">
            Upholding <br />
            <span className="italic">Standards.</span>
          </h1>

          <p className="text-neutral-800 text-xl font-medium leading-relaxed max-w-2xl">
            Scripture Union Campus Fellowship (SUCF) UNEC is a vibrant non-denominational family
            committed to raising balanced Christian students who excel both spiritually and
            academically.
          </p>
        </div>
      </section>

      <AnthemSection />

      {/* Academic Growth & CGPA Section - Simple Button */}
      <section
        id="cgpa-calculator"
        className="page-container py-8 flex justify-center"
      >
        <button
          onClick={() => setIsCalcOpen(true)}
          className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <FiBookOpen className="text-lg" />
          Calculate Your CGPA
        </button>
      </section>

      {/* Vision / Mission / Values Section */}
      <section className="page-container mb-40">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="zeni-card overflow-hidden aspect-square md:aspect-video lg:aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2664&auto=format&fit=crop"
                alt="Fellowship Group"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00211F]/60 via-transparent to-transparent" />

              <div className="absolute bottom-10 left-10 right-10">
                <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] mb-2">
                  The Den
                </p>
                <p className="text-white text-3xl font-bold italic leading-none">
                  Holy Ground.
                </p>
              </div>
            </motion.div>

            {/* Decorative floating card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-10 -right-6 md:-right-10 zeni-card p-8 max-w-[280px] hidden md:block bg-white/90 backdrop-blur-xl border-emerald-100 shadow-2xl"
            >
              <p className="text-neutral-900 text-sm font-medium leading-relaxed italic">
                &ldquo;A sanctuary for spiritual growth and intellectual transformation in
                UNEC.&rdquo;
              </p>
            </motion.div>
          </div>

          <div className="space-y-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="zeni-card p-8 flex gap-8 items-start hover:bg-white transition-all group"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                <FiTarget />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 tracking-tight">
                  Our Vision
                </h3>
                <p className="text-neutral-800 font-medium leading-relaxed">
                  {vision || "Our vision statement will be shared here soon."}
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="zeni-card p-8 flex gap-8 items-start hover:bg-white transition-all group"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                <FiUsers />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 tracking-tight">
                  Our Mission
                </h3>
                <p className="text-neutral-800 font-medium leading-relaxed">
                  {mission || "Our mission statement will be shared here soon."}
                </p>
              </div>
            </motion.div>

            {/* Values */}
            {values.length > 0 ? (
              values.map((value, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                return (
                  <motion.div
                    key={value.title || i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="zeni-card p-8 flex gap-8 items-start hover:bg-white transition-all group"
                  >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-3 tracking-tight">
                        {value.title}
                      </h3>
                      <p className="text-neutral-800 font-medium leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="zeni-card p-8 flex gap-8 items-start"
              >
                <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl shrink-0">
                  <FiAward />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 tracking-tight">
                    Core Values
                  </h3>
                  <p className="text-neutral-800 font-medium leading-relaxed">
                    Our core values will be shared here soon.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Leadership Section Preview */}
      <section className="page-container section-py text-center">
        <div className="mb-24 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-6"
          >
            Standard Bearers
          </motion.div>
          <h2 className="h2 text-neutral-900 mb-8">
            The <span className="italic">Leadership.</span>
          </h2>
          <p className="text-neutral-800 text-lg font-medium">
            Meet the team leading SUCF UNEC this academic session.
          </p>
        </div>

        {executives.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {executives.map((exec) => (
              <motion.div
                key={exec._id}
                variants={staggerItem}
                className="zeni-card p-8 flex flex-col group items-center text-center"
              >
                <div className="relative mb-8 pt-4">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                  <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-[#F5F9F7] shadow-xl relative z-10 group-hover:border-emerald-50 transition-all">
                    {exec.photo ? (
                      <Image
                        src={urlFor(exec.photo).width(320).height(320).url()}
                        alt={exec.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300 text-3xl font-black">
                        {exec.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-neutral-900 mb-1 tracking-tight leading-tight whitespace-pre-line group-hover:text-emerald-600 transition-colors">
                    {exec.name}
                  </h3>
                  <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">
                    {exec.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-neutral-800 font-medium">
            Leadership profiles will be published soon.
          </p>
        )}

        <div className="mt-20">
          <Link href="/executives" className="inline-flex items-center gap-4 group">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
              View Full Executive Council
            </span>
            <div className="w-12 h-12 zeni-card flex items-center justify-center text-xl group-hover:bg-[#00211F] group-hover:text-white transition-all transform group-hover:translate-x-2">
              <FiArrowRight />
            </div>
          </Link>
        </div>
      </section>

      <GPACalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
}
