"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookmark,
  FiCheck,
  FiChevronDown,
  FiFileText,
  FiHeart,
  FiList,
  FiShare2,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import PortableTextBody from "@/components/PortableTextBody";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const HERO_WIDTH = 1600;

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function calculateReadingTime(body) {
  if (!Array.isArray(body)) return 1;
  const wordsPerMinute = 200;
  const text = body
    .filter((block) => block._type === "block" && Array.isArray(block.children))
    .map((block) => block.children.map((child) => child.text).join(""))
    .join(" ");
  const noOfWords = text.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(noOfWords / wordsPerMinute));
}

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Portable Text has no heading index of its own, so the table of contents is
// derived from the body: every h2/h3 block becomes an entry, keyed by the
// block's _key so the renderer below can stamp the matching anchor id.
function extractHeadings(body) {
  if (!Array.isArray(body)) return [];
  const used = new Map();

  return body.reduce((acc, block) => {
    if (
      block._type !== "block" ||
      (block.style !== "h2" && block.style !== "h3") ||
      !Array.isArray(block.children)
    ) {
      return acc;
    }

    const text = block.children
      .map((child) => child.text || "")
      .join("")
      .trim();
    if (!text) return acc;

    const base = slugifyHeading(text) || "section";
    const seen = used.get(base) || 0;
    used.set(base, seen + 1);

    acc.push({
      key: block._key || `${base}-${acc.length}`,
      id: seen === 0 ? base : `${base}-${seen + 1}`,
      text,
      level: block.style,
    });
    return acc;
  }, []);
}

function initialsFrom(name) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return letters.toUpperCase() || "S";
}

function ActionButton({ label, onClick, pressed, active, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      {...(typeof pressed === "boolean" ? { "aria-pressed": pressed } : {})}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-[15px] transition-colors ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
      }`}
    >
      {children}
    </button>
  );
}

function ActionRow({ liked, bookmarked, copied, onLike, onBookmark, onShare }) {
  return (
    <>
      <ActionButton
        label={liked ? "Remove like" : "Like this article"}
        pressed={liked}
        active={liked}
        onClick={onLike}
      >
        <FiHeart className={liked ? "fill-current" : ""} aria-hidden="true" />
      </ActionButton>
      <ActionButton
        label={bookmarked ? "Remove bookmark" : "Bookmark this article"}
        pressed={bookmarked}
        active={bookmarked}
        onClick={onBookmark}
      >
        <FiBookmark className={bookmarked ? "fill-current" : ""} aria-hidden="true" />
      </ActionButton>
      <ActionButton
        label={copied ? "Link copied" : "Share this article"}
        active={copied}
        onClick={onShare}
      >
        {copied ? <FiCheck aria-hidden="true" /> : <FiShare2 aria-hidden="true" />}
      </ActionButton>
    </>
  );
}

function TocLinks({ headings, activeId, onNavigate }) {
  return (
    <ul className="space-y-0.5">
      {headings.map((heading) => (
        <li key={heading.key}>
          <a
            href={`#${heading.id}`}
            onClick={onNavigate}
            className={`block border-l-2 py-1.5 text-xs leading-snug transition-colors ${
              heading.level === "h3" ? "pl-6" : "pl-3"
            } ${
              activeId === heading.id
                ? "border-emerald-600 font-medium text-emerald-700"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
            }`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function ArticleDetailView({ article, relatedArticles }) {
  const related = relatedArticles || [];
  const readingTime = useMemo(() => calculateReadingTime(article.body), [article.body]);
  const headings = useMemo(() => extractHeadings(article.body), [article.body]);
  const showToc = headings.length >= 2;

  const [tocOpen, setTocOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Heading renderers stamp the same ids the table of contents links to.
  const bodyComponents = useMemo(() => {
    const ids = {};
    headings.forEach((heading) => {
      ids[heading.key] = heading.id;
    });

    return {
      block: {
        h2: ({ value, children }) => (
          <h2 id={ids[value?._key]} className="scroll-mt-28">
            {children}
          </h2>
        ),
        h3: ({ value, children }) => (
          <h3 id={ids[value?._key]} className="scroll-mt-28">
            {children}
          </h3>
        ),
      },
    };
  }, [headings]);

  useEffect(() => {
    if (!showToc) return undefined;
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings, showToc]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  // Decorative only — there is no backend behind like/bookmark, and sharing
  // uses the native share sheet with a clipboard copy as the fallback.
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
        return;
      } catch {
        // Share sheet dismissed — fall through to copying the link.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard unavailable (insecure context or denied permission).
    }
  };

  const actionProps = {
    liked,
    bookmarked,
    copied,
    onLike: () => setLiked((value) => !value),
    onBookmark: () => setBookmarked((value) => !value),
    onShare: handleShare,
  };

  const authorName = article.author || "SUCF UNEC";
  const heroRatio = article.mainImage?.aspectRatio || 16 / 9;

  return (
    <div className="min-h-screen bg-white pb-24 sm:pb-8">
      <div className="page-container pt-24 pb-14 sm:pt-28 md:pt-32">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-12"
        >
          <Link
            href="/articles"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 transition-colors hover:text-emerald-700"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            All articles
          </Link>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Main column — roughly 65% of the container, ~700px of measure */}
          <article className="w-full min-w-0 lg:col-span-8">
            <motion.header variants={fadeInUp} initial="hidden" animate="visible">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {article.category || "Article"}
                </span>
                <span className="rounded-full border border-neutral-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                  {readingTime} min read
                </span>
              </div>

              <h1 className="text-2xl font-semibold leading-[1.2] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {article.excerpt}
                </p>
              )}

              {/* Byline */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-200 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white"
                    aria-hidden="true"
                  >
                    {initialsFrom(authorName)}
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-neutral-900">{authorName}</p>
                    <p className="mt-0.5 text-xs text-neutral-600">
                      Contributor
                      {article.publishedAt && (
                        <>
                          <span aria-hidden="true"> · </span>
                          {formatDate(article.publishedAt)}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <ActionRow {...actionProps} />
                </div>
              </div>
            </motion.header>

            {article.mainImage && (
              <motion.figure
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
              >
                {/* Landscape uploads fill the column; portrait flyers letterbox
                    against the neutral backdrop instead of running off-screen. */}
                <Image
                  src={urlFor(article.mainImage).width(HERO_WIDTH).url()}
                  alt={article.title}
                  width={HERO_WIDTH}
                  height={Math.round(HERO_WIDTH / heroRatio)}
                  sizes="(max-width: 1024px) 100vw, 720px"
                  placeholder={article.mainImage.lqip ? "blur" : "empty"}
                  blurDataURL={article.mainImage.lqip}
                  priority
                  className="h-auto max-h-[70vh] w-full object-contain"
                />
              </motion.figure>
            )}

            {/* Collapsible table of contents — mobile and tablet only */}
            {showToc && (
              <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200 lg:hidden">
                <button
                  type="button"
                  onClick={() => setTocOpen((value) => !value)}
                  aria-expanded={tocOpen}
                  aria-controls="article-toc-mobile"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-900">
                    <FiList aria-hidden="true" />
                    On this page
                  </span>
                  <FiChevronDown
                    className={`shrink-0 text-neutral-600 transition-transform ${tocOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <nav
                  id="article-toc-mobile"
                  aria-label="Table of contents"
                  className={tocOpen ? "border-t border-neutral-200 px-4 py-3" : "hidden"}
                >
                  <TocLinks
                    headings={headings}
                    activeId={activeId}
                    onNavigate={() => setTocOpen(false)}
                  />
                </nav>
              </div>
            )}

            <div className="mt-10">
              <PortableTextBody
                value={article.body}
                className="article-body-content"
                components={bodyComponents}
              />
            </div>

            {/* CTA */}
            <div className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 sm:px-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Keep reading
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
                More writing from the fellowship
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
                Essays, reflections and study notes published by SUCF UNEC.
              </p>
              <Link
                href="/articles"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-700"
              >
                Browse all articles
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </article>

          {/* Sticky rail — table of contents, author card, share actions */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 space-y-6">
              {showToc && (
                <nav aria-label="Table of contents">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                    On this page
                  </p>
                  <TocLinks headings={headings} activeId={activeId} />
                </nav>
              )}

              <div className="rounded-2xl border border-neutral-200 p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white"
                    aria-hidden="true"
                  >
                    {initialsFrom(authorName)}
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-neutral-900">{authorName}</p>
                    <p className="mt-0.5 text-xs text-neutral-600">Contributor</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                  {readingTime} min read
                  {article.publishedAt && ` · ${formatDate(article.publishedAt)}`}
                </p>
                <div className="mt-4 flex items-center gap-2 border-t border-neutral-200 pt-4">
                  <ActionRow {...actionProps} />
                  <span className="ml-1 text-[11px] text-neutral-600">
                    {copied ? "Link copied" : "Share"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related grid */}
      {related.length > 0 && (
        <section className="border-t border-neutral-200">
          <div className="page-container py-14 sm:py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
                More to read
              </h2>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:text-emerald-700"
              >
                View all
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {related.map((item) => (
                <motion.article key={item._id} variants={staggerItem}>
                  <Link href={`/articles/${item.slug}`} className="group block">
                    <div className="mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                      {item.mainImage ? (
                        <Image
                          src={urlFor(item.mainImage).width(640).height(400).url()}
                          alt={item.title}
                          width={640}
                          height={400}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                          placeholder={item.mainImage.lqip ? "blur" : "empty"}
                          blurDataURL={item.mainImage.lqip}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-400">
                          <FiFileText size={24} aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {item.category || "Article"}
                    </p>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-emerald-700 sm:text-base">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                        {item.excerpt}
                      </p>
                    )}
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Bottom-anchored actions — phones only; wider screens get the byline
          row and the sticky rail instead */}
      <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:hidden">
        <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/95 px-2.5 py-2 shadow-lg backdrop-blur">
          <ActionRow {...actionProps} />
          <span className="px-1.5 text-[11px] font-medium text-neutral-600">
            {copied ? "Link copied" : `${readingTime} min`}
          </span>
        </div>
      </div>
    </div>
  );
}
