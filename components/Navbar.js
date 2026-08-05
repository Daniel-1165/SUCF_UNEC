"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiCalendar,
  FiImage,
  FiBookOpen,
  FiFileText,
  FiMail,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/", icon: <FiHome /> },
  { name: "About", path: "/about", icon: <FiInfo /> },
  { name: "Activities", path: "/activities", icon: <FiCalendar /> },
  { name: "Gallery", path: "/gallery", icon: <FiImage /> },
  { name: "Library", path: "/library", icon: <FiBookOpen /> },
  { name: "Articles", path: "/articles", icon: <FiFileText /> },
  { name: "News", path: "/news", icon: <FiFileText /> },
  { name: "Executives", path: "/executives", icon: <FiUsers /> },
  { name: "Contact", path: "/contact", icon: <FiMail /> },
];



export default function Navbar({ isSignedIn = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDarkPage = pathname.startsWith("/gallery");
  const navbarBg = isDarkPage
    ? scrolled
      ? "bg-black/90"
      : "bg-transparent"
    : scrolled
      ? "bg-white/90 shadow-sm"
      : "bg-transparent";

  const logoTitleColor = isDarkPage ? "text-white" : "text-emerald-600";
  const logoSubColor = isDarkPage ? "text-emerald-400" : "text-emerald-600";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md ${navbarBg} ${scrolled ? "py-2" : "py-5"}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex justify-between items-center gap-4 lg:gap-8">
        <Link href="/" className="flex items-center gap-2 md:gap-4 group shrink-0">
          <Image
            src="/assets/logo.png"
            alt="SUCF UNEC"
            width={48}
            height={48}
            className="h-9 md:h-12 w-auto transition-transform group-hover:scale-105"
            priority
          />
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span
                className={`text-lg md:text-xl font-black italic uppercase tracking-tighter leading-none font-heading ${logoTitleColor}`}
              >
                SUCF
              </span>
              <span className="text-lg md:text-xl font-black italic uppercase tracking-tighter leading-none font-heading bg-emerald-600 text-white px-1 ml-0.5 rounded-sm">
                UNEC
              </span>
            </div>
            <p
              className={`hidden lg:block text-[9px] tracking-[0.3em] font-black uppercase ${logoSubColor}`}
            >
              Unique Fellowship
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center justify-end flex-grow gap-4 lg:gap-8">
          <div className="flex items-center gap-3 lg:gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              const isHighlighted = link.name === "Gallery";

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative
                    ${
                      isHighlighted
                        ? `px-4 py-2 rounded-xl ${
                            isActive
                              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                              : isDarkPage
                                ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          }`
                        : `hover:text-emerald-500 ${
                            isActive
                              ? isDarkPage
                                ? "text-white"
                                : "text-emerald-600"
                              : isDarkPage
                                ? "text-gray-400"
                                : "text-gray-600"
                          }`
                    }`}
                >
                  {link.name}
                  {isActive && !isHighlighted && (
                    <motion.span
                      layoutId="navTab"
                      className="absolute -bottom-2 left-0 w-full h-[2px] bg-emerald-500"
                    />
                  )}
                </Link>
              );
            })}
          </div>
          {isSignedIn && (
            <Link
              href="/admin"
              className="flex items-center gap-2 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-emerald-100 text-emerald-900 rounded-lg hover:bg-emerald-200 transition-all"
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Admin
            </Link>
          )}
        </div>

        <button
          className={`md:hidden p-3 rounded-2xl transition-all shadow-sm active:scale-95 border
            ${
              isDarkPage
                ? "text-white bg-white/10 border-white/20 hover:bg-white/20"
                : "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
            }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-2xl flex flex-col h-[100dvh] overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="p-6 pb-4 shrink-0 relative z-10">
                <div className="flex justify-between items-center mb-6 px-1">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/logo.png"
                      alt="Logo"
                      width={36}
                      height={36}
                      className="h-9 w-auto drop-shadow-lg"
                    />
                    <div className="flex items-baseline">
                      <span className="text-base font-black italic uppercase tracking-tighter leading-none font-heading text-white">
                        SUCF
                      </span>
                      <span className="text-base font-black italic uppercase tracking-tighter leading-none font-heading bg-emerald-500 text-white px-1.5 ml-0.5 rounded-sm shadow-lg shadow-emerald-500/30">
                        UNEC
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
                    aria-label="Close menu"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4" />
              </div>

              <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar min-h-0 relative z-10">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="text-xl">{link.icon}</span>
                      <span className="text-sm font-bold uppercase tracking-widest">
                        {link.name}
                      </span>
                    </Link>
                  );
                })}

                {isSignedIn && (
                  <>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-emerald-400 hover:bg-emerald-400/10 transition-all border border-emerald-400/20 hover:border-emerald-400/40"
                    >
                      <span className="text-xl">
                        <FiSettings />
                      </span>
                      <span className="text-sm font-bold uppercase tracking-widest">Admin Panel</span>
                    </Link>
                  </>
                )}
              </div>

              <div className="p-6 bg-black/30 backdrop-blur-sm border-t border-white/10 relative z-10">
                <p className="text-center text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
                  SUCF UNEC &copy; {new Date().getFullYear()}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
