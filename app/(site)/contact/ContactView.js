"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FiPhone,
  FiMail,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiSend,
  FiMessageSquare,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  message: z.string().trim().min(1, "Message is required"),
});

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// Shared, legible input style — the old version used placeholder:opacity-20
// and text-emerald-600/40 labels, which made both nearly invisible on the
// pale card background. Plain neutral tones read clearly at every state.
const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10";
const labelClass = "text-xs font-medium text-neutral-600";

export default function ContactView() {
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: "", lastName: "", email: "", message: "" },
  });

  const onSubmit = async (data) => {
    setSubmitError(null);

    try {
      const templateParams = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        message: data.message,
        to_email: "sucfunec01@gmail.com",
      };

      const emailResponse = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      if (emailResponse.status !== 200) throw new Error("Email delivery failed");

      setIsSent(true);
      reset();
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError("Failed to send message. Please try again or use the links below.");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20">
      <div className="page-container">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-xl md:mb-14"
        >
          <h1 className="h1 text-neutral-900">
            Connect with <span className="italic">The Den.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Have questions about our activities or want to share a testimony? Reach out below.
          </p>
        </motion.header>

        <div className="grid gap-8 md:gap-12 lg:grid-cols-12">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5">
            <div className="space-y-4">
              <motion.a
                href="tel:07069753310"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-4 rounded-2xl bg-neutral-900 p-5 text-white transition-colors hover:bg-neutral-800 sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-xs text-white/50">Call / WhatsApp</p>
                  <p className="text-base font-semibold tracking-tight">07069753310</p>
                </div>
              </motion.a>

              <motion.a
                href="mailto:sucfunec01@gmail.com"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-5 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40 sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
                  <FiMail />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Email</p>
                  <p className="truncate text-base font-semibold tracking-tight text-neutral-900">
                    sucfunec01@gmail.com
                  </p>
                </div>
              </motion.a>

              {/* Socials */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-3 gap-3"
              >
                {[
                  { icon: <FiInstagram />, label: "Instagram", link: "https://www.instagram.com/sucf.unec/" },
                  { icon: <FiFacebook />, label: "Facebook", link: "https://www.facebook.com/sucfunec" },
                  { icon: <FiYoutube />, label: "YouTube", link: "https://www.youtube.com/@sucfunec" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 py-4 text-neutral-400 transition-colors hover:border-emerald-200 hover:text-emerald-700"
                  >
                    <span className="text-lg">{social.icon}</span>
                    <span className="text-[10px] font-medium">{social.label}</span>
                  </a>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {isSent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="flex flex-col items-center py-14 text-center"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-700">
                      <FiSend />
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-900">Message sent</h2>
                    <p className="mx-auto mt-2 max-w-xs text-sm text-neutral-600">
                      Thank you for reaching out — we&apos;ll get back to you shortly.
                    </p>
                    <button
                      onClick={() => setIsSent(false)}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
                        <FiMessageSquare />
                      </div>
                      <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                        Drop a message
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className={labelClass}>First name</label>
                          <input
                            type="text"
                            {...register("firstName")}
                            className={inputClass}
                            placeholder="Daniel"
                          />
                          {errors.firstName && (
                            <p className="text-xs text-red-600">{errors.firstName.message}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelClass}>Last name</label>
                          <input
                            type="text"
                            {...register("lastName")}
                            className={inputClass}
                            placeholder="Chime"
                          />
                          {errors.lastName && (
                            <p className="text-xs text-red-600">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClass}>Email address</label>
                        <input
                          type="email"
                          {...register("email")}
                          className={inputClass}
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClass}>Your message</label>
                        <textarea
                          {...register("message")}
                          rows="5"
                          className={`${inputClass} resize-none`}
                          placeholder="I would like to enquire about..."
                        ></textarea>
                        {errors.message && (
                          <p className="text-xs text-red-600">{errors.message.message}</p>
                        )}
                      </div>

                      {submitError && <p className="text-xs text-red-600">{submitError}</p>}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-medium text-white transition-colors ${
                          isSubmitting ? "cursor-not-allowed opacity-50" : "hover:bg-neutral-700"
                        }`}
                      >
                        {isSubmitting ? "Sending…" : "Send message"} <FiSend className="text-sm" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
