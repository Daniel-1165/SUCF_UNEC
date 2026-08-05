"use client";

import Image from "next/image";
import { FiLinkedin, FiUsers, FiInstagram, FiTwitter } from "react-icons/fi";
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
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 zeni-mesh-gradient relative">
      <div className="w-full mx-auto px-4 sm:px-6 text-center mb-24 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-tag mb-6"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          The Servants
        </motion.div>

        <h1 className="h1 text-neutral-900 mb-8">
          The <span className="italic">Council.</span>
        </h1>

        <p className="text-neutral-800 text-xl font-medium leading-relaxed">
          Standard bearers and visionaries upholding righteous standards for the{" "}
          {currentSession()} academic session.
        </p>
      </div>

      {executives.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="page-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
        >
          {executives.map((exec) => (
            <motion.div key={exec._id} variants={staggerItem} className="relative group pt-16">
              <div className="zeni-card h-full p-8 pt-32 text-center group-hover:bg-white transition-all duration-500 relative">
                {/* Avatar - Floating above/within the card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-700 opacity-0 group-hover:opacity-100" />
                    <div className="w-44 h-44 rounded-full overflow-hidden border-8 border-[#F5F9F7] shadow-2xl relative z-10 group-hover:border-emerald-50 transition-all duration-500">
                      {exec.photo ? (
                        <Image
                          src={urlFor(exec.photo).width(352).height(352).url()}
                          alt={exec.name}
                          width={176}
                          height={176}
                          className="w-full h-full object-cover transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300 text-4xl font-black">
                          {exec.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
                      {exec.name}
                    </h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                      {exec.role}
                    </p>
                    <div className="h-px w-8 bg-emerald-100 mx-auto group-hover:w-12 transition-all" />
                  </div>

                  <p className="text-xs text-neutral-800 font-bold uppercase tracking-widest mb-8">
                    {exec.department}
                  </p>

                  {/* Social Icons */}
                  <div className="mt-auto flex justify-center gap-4">
                    {[FiInstagram, FiLinkedin, FiTwitter].map((Icon, i) => (
                      <span
                        key={i}
                        className="w-10 h-10 rounded-xl bg-[#F5F9F7] text-emerald-900/40 flex items-center justify-center shadow-sm"
                      >
                        <Icon className="text-lg" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="w-full mx-auto px-4 sm:px-6 max-w-2xl text-center">
          <div className="zeni-card p-12 flex flex-col items-center gap-4">
            <FiUsers className="text-4xl text-emerald-300" />
            <p className="text-neutral-800 font-medium">
              Executive profiles will be published here soon.
            </p>
          </div>
        </div>
      )}

      {/* Note Section */}
      <div className="page-container mt-32 text-center">
        <div className="zeni-card p-10 md:p-12 bg-white/40 backdrop-blur-md border-emerald-100/50 max-w-4xl mx-auto">
          <p className="text-neutral-800 text-lg font-medium leading-relaxed italic">
            &ldquo;Leading a generation to uphold righteous standards, excelling in spirit and in
            truth.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
