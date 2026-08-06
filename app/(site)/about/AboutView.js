"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiUsers, FiAward, FiTarget, FiArrowRight, FiBookOpen } from "react-icons/fi";
import { urlFor } from "@/lib/sanity/image";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import GPACalculator from "@/components/GPACalculator";

function AnthemSection() {
  return (
    <section className="section-py bg-white">
      <div className="page-container max-w-3xl">
        <h2 className="mb-6 text-center text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
          The Anthem
        </h2>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 text-center sm:p-10"
        >
          <div className="space-y-5 text-sm leading-relaxed text-neutral-600">
            <p>
              <span className="font-medium text-neutral-900">SUCF the Unique Family</span>
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
              <span className="font-medium text-neutral-900">Jesus the answer, He is the way</span>
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

// One quiet card shape for vision, mission and each value.
function PillarCard({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-emerald-700">
        <Icon />
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold tracking-tight text-neutral-900 sm:text-base">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{children}</p>
      </div>
    </motion.div>
  );
}

export default function AboutView({ aboutPage, executives = [] }) {
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const vision = aboutPage?.vision;
  const mission = aboutPage?.mission;
  const values = aboutPage?.values || [];

  return (
    <div className="min-h-screen bg-white pb-12 pt-24 sm:pb-16 sm:pt-28 md:pb-20 md:pt-32">
      {/* Header */}
      <section className="page-container">
        <div className="max-w-2xl">
          <h1 className="h1 text-neutral-900">Upholding Standards.</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Scripture Union Campus Fellowship (SUCF) UNEC is a non-denominational family committed
            to raising balanced Christian students who excel both spiritually and academically.
          </p>
        </div>
      </section>

      <AnthemSection />

      {/* CGPA calculator entry point */}
      <section id="cgpa-calculator" className="page-container flex justify-center pb-4">
        <button
          type="button"
          onClick={() => setIsCalcOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          <FiBookOpen />
          Calculate your CGPA
        </button>
      </section>

      {/* Vision / Mission / Values */}
      <section className="page-container section-py">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2664&auto=format&fit=crop"
              alt="Fellowship gathering"
              className="aspect-[4/3] w-full object-cover lg:aspect-square"
            />
          </motion.div>

          <div className="space-y-4">
            <PillarCard icon={FiTarget} title="Our Vision">
              {vision || "Our vision statement will be shared here soon."}
            </PillarCard>

            <PillarCard icon={FiUsers} title="Our Mission" delay={0.05}>
              {mission || "Our mission statement will be shared here soon."}
            </PillarCard>

            {values.length > 0 ? (
              values.map((value, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                return (
                  <PillarCard
                    key={value.title || i}
                    icon={Icon}
                    title={value.title}
                    delay={0.1 + i * 0.05}
                  >
                    {value.description}
                  </PillarCard>
                );
              })
            ) : (
              <PillarCard icon={FiAward} title="Core Values" delay={0.1}>
                Our core values will be shared here soon.
              </PillarCard>
            )}
          </div>
        </div>
      </section>

      {/* Leadership preview */}
      <section className="page-container section-py">
        <div className="mb-8 max-w-xl">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
            The Leadership
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Meet the team leading SUCF UNEC this academic session.
          </p>
        </div>

        {executives.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
          >
            {executives.map((exec) => (
              <motion.div
                key={exec._id}
                variants={staggerItem}
                className="flex flex-col items-center text-center"
              >
                <div className="h-20 w-20 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 sm:h-24 sm:w-24">
                  {exec.photo ? (
                    <Image
                      src={urlFor(exec.photo).width(320).height(320).url()}
                      alt={exec.name}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-base font-medium text-neutral-500">
                      {exec.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="mt-3 whitespace-pre-line text-sm font-medium leading-snug text-neutral-900">
                  {exec.name}
                </h3>
                <p className="mt-1 text-[11px] text-neutral-500">{exec.role}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-sm text-neutral-600">Leadership profiles will be published soon.</p>
        )}

        <div className="mt-10">
          <Link
            href="/executives"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-medium text-neutral-900 transition-colors hover:border-emerald-700 hover:text-emerald-700"
          >
            View the full executive council <FiArrowRight />
          </Link>
        </div>
      </section>

      <GPACalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
}
