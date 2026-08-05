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
  FiChevronDown,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Desktop nav: nine links read as clutter, so related destinations are grouped
// behind two dropdowns. Mobile keeps every link visible — a drawer has the room.
const navGroups = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Activities", path: "/activities" },
  { name: "Gallery", path: "/gallery" },
  {
    name: "Resources",
    items: [
      { name: "Articles", path: "/articles", blurb: "Faith and campus writing" },
      { name: "Library", path: "/library", blurb: "Books to borrow and read" },
      { name: "News", path: "/news", blurb: "Fellowship announcements" },
    ],
  },
  {
    name: "More",
    items: [
      { name: "Executives", path: "/executives", blurb: "Who leads the fellowship" },
      { name: "Contact", path: "/contact", blurb: "Reach the team" },
    ],
  },
];

// Flat list for the mobile drawer.
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



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Resolved client-side so the public pages can stay statically rendered.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth-state")
      .then((r) => (r.ok ? r.json() : { isSignedIn: false }))
      .then((d) => {
        if (!cancelled) setIsSignedIn(Boolean(d.isSignedIn));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Close any open dropdown when the route changes or Escape is pressed.
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isDarkPage = pathname.startsWith("/gallery");
  const navbarBg = isDarkPage
    ? scrolled
      ? "bg-black/90"
      : "bg-transparent"
    : scrolled
      ? "bg-white/90 shadow-sm"
      : "bg-transparent";

  const logoTitleColor = isDarkPage ? "text-white" : "text-neutral-900";
  const logoSubColor = isDarkPage ? "text-white/50" : "text-neutral-500";

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
            <span
              className={`text-base md:text-lg font-semibold tracking-tight leading-none ${logoTitleColor}`}
            >
              SUCF <span className="text-emerald-700">UNEC</span>
            </span>
            <p
              className={`hidden lg:block mt-1 text-[10px] tracking-[0.18em] font-medium uppercase ${logoSubColor}`}
            >
              Unique Fellowship
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center justify-end flex-grow gap-2 lg:gap-4">
          <div className="flex items-center gap-1">
            {navGroups.map((group) => {
              const linkBase = isDarkPage
                ? "text-white/70 hover:text-white"
                : "text-neutral-600 hover:text-neutral-900";
              const activeText = isDarkPage ? "text-white" : "text-neutral-900";

              if (!group.items) {
                const isActive = pathname === group.path;
                return (
                  <Link
                    key={group.name}
                    href={group.path}
                    className={`relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                      isActive ? activeText : linkBase
                    }`}
                  >
                    {group.name}
                    {isActive && (
                      <motion.span
                        layoutId="navTab"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-emerald-700"
                      />
                    )}
                  </Link>
                );
              }

              const isActive = group.items.some((i) => pathname.startsWith(i.path));
              const isOpenMenu = openMenu === group.name;

              return (
                <div
                  key={group.name}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(group.name)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenMenu(isOpenMenu ? null : group.name)}
                    aria-expanded={isOpenMenu}
                    aria-haspopup="true"
                    className={`relative flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                      isActive || isOpenMenu ? activeText : linkBase
                    }`}
                  >
                    {group.name}
                    <FiChevronDown
                      className={`text-xs transition-transform duration-200 ${
                        isOpenMenu ? "rotate-180" : ""
                      }`}
                    />
                    {isActive && (
                      <motion.span
                        layoutId="navTab"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-emerald-700"
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpenMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full w-64 pt-2"
                      >
                        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg shadow-neutral-900/5">
                          {group.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.path}
                              onClick={() => setOpenMenu(null)}
                              className={`block rounded-lg px-3 py-2.5 transition-colors ${
                                pathname.startsWith(item.path)
                                  ? "bg-neutral-50"
                                  : "hover:bg-neutral-50"
                              }`}
                            >
                              <span className="block text-[13px] font-medium text-neutral-900">
                                {item.name}
                              </span>
                              <span className="mt-0.5 block text-[11px] text-neutral-500">
                                {item.blurb}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {isSignedIn && (
            <Link
              href="/admin"
              className="rounded-lg bg-neutral-900 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Admin
            </Link>
          )}
        </div>

        <button
          className={`md:hidden p-2.5 rounded-xl transition-all shadow-sm active:scale-95 border
            ${
              isDarkPage
                ? "text-white bg-white/10 border-white/20 hover:bg-white/20"
                : "text-neutral-700 bg-neutral-100 border-neutral-200 hover:bg-neutral-200"
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
