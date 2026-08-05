"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

const RENDER_WIDTH = 1200;

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
            sizes="(max-width: 768px) 100vw, 720px"
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

export default function PortableTextBody({ value, className }) {
  if (!value) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
