"use client";

import { motion } from "framer-motion";

export default function AnthemSection() {
  return (
    <section className="section-py bg-white">
      <div className="mx-auto w-full max-w-2xl px-4 text-center sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl"
        >
          The Anthem
        </motion.h2>

        {/* No corner brackets: at mobile padding they overlapped the lyrics.
            Verses get real breathing room instead — these are sung lines, so
            each one wants to sit on its own. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="space-y-7 text-sm leading-[2.1] text-neutral-700 sm:text-base"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
