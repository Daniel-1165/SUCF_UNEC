"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

const RENDER_WIDTH = 960;

const components = {
  types: {
    // Images placed between paragraphs in Sanity Studio. Height is derived
    // from the asset's real aspectRatio, so any upload ratio (portrait flyer,
    // wide banner, square photo) renders undistorted without hard-coding.
    image: ({ value }) => {
      if (!value?.asset) return null;
      const ratio = value.aspectRatio || 16 / 9;
      const height = Math.round(RENDER_WIDTH / ratio);

      return (
        <figure>
          <Image
            src={urlFor(value).width(RENDER_WIDTH).url()}
            alt={value.alt || value.caption || ""}
            width={RENDER_WIDTH}
            height={height}
            sizes="(max-width: 640px) 90vw, 480px"
            placeholder={value.lqip ? "blur" : "empty"}
            blurDataURL={value.lqip}
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

// Callers may pass extra Portable Text component overrides (e.g. heading
// renderers that add anchor ids for a table of contents). They are merged on
// top of the defaults above, so the shared image/link renderers keep working
// even when a page only overrides `block`.
function mergeComponents(overrides) {
  if (!overrides) return components;
  return {
    ...components,
    ...overrides,
    types: { ...components.types, ...overrides.types },
    marks: { ...components.marks, ...overrides.marks },
  };
}

export default function PortableTextBody({ value, className, components: overrides }) {
  if (!value) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={mergeComponents(overrides)} />
    </div>
  );
}
