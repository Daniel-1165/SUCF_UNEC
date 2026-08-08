"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { gatedHref } from "@/lib/authLinks";

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
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Activities", path: "/activities" },
  { name: "Gallery", path: "/gallery" },
  { name: "Library", path: "/library" },
  { name: "Articles", path: "/articles" },
  { name: "News", path: "/news" },
  { name: "Executives", path: "/executives" },
  { name: "Contact", path: "/contact" },
];



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => {
        if (cancelled) return;
        setIsSignedIn(Boolean(d.isSignedIn));
        setIsAdmin(Boolean(d.isAdmin));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Gated destinations route through sign-in, but only for visitors who aren't
  // already signed in — otherwise Auth0 just bounces them straight back.
  const linkHref = (path) => (isSignedIn ? path : gatedHref(path));

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


  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md ${navbarBg} ${scrolled ? "py-2" : "py-5"}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex justify-between items-center gap-4 lg:gap-8">
        {/* The mark already reads "SUCF", so the wordmark drops it and tucks a
            slanted UNEC tab under the logo instead of repeating the name. */}
        <Link
          href="/"
          aria-label="SUCF UNEC — home"
          className="group flex shrink-0 flex-col items-center leading-none"
        >
          <Image
            src="/assets/logo.png"
            alt="SUCF UNEC"
            width={48}
            height={48}
            className="h-9 w-auto transition-transform duration-300 group-hover:scale-105 md:h-11"
            priority
          />
          <span className="-mt-0.5 -rotate-3 rounded-[3px] bg-emerald-700 px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-[0.22em] text-white shadow-sm transition-transform duration-300 group-hover:rotate-0 md:text-[10px]">
            UNEC
          </span>
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
                    href={linkHref(group.path)}
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
                              href={linkHref(item.path)}
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

          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-lg bg-neutral-900 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Admin
            </Link>
          )}
        </div>

        <button
          className={`md:hidden p-2 rounded-lg transition-colors active:scale-95 ${
            isDarkPage ? "text-white hover:bg-white/10" : "text-neutral-700 hover:bg-neutral-100"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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

            {/* Light sheet with plain text rows — the dark gradient drawer with
                icon chips and uppercase labels was doing far more than a menu
                needs to. */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="absolute top-0 right-0 bottom-0 flex h-[100dvh] w-[88%] max-w-[340px] flex-col overflow-hidden rounded-l-2xl bg-white text-neutral-900 shadow-xl"
            >
              <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4">
                <span className="text-lg font-semibold tracking-tight">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200"
                  aria-label="Close menu"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                <p className="mb-1 mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Explore
                </p>

                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      href={linkHref(link.path)}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between border-b border-neutral-100 py-3.5 transition-colors ${
                        isActive ? "text-emerald-700" : "text-neutral-900 hover:text-emerald-700"
                      }`}
                    >
                      <span className="text-[15px] font-medium">{link.name}</span>
                      <FiChevronRight className="text-neutral-300" size={16} />
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between border-b border-neutral-100 py-3.5 text-emerald-700 transition-colors"
                  >
                    <span className="text-[15px] font-medium">Admin</span>
                    <FiChevronRight className="text-neutral-300" size={16} />
                  </Link>
                )}
              </div>

              <div className="shrink-0 px-6 pb-7 pt-4">
                <p className="text-[11px] text-neutral-400">
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
