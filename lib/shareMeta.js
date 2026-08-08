import { urlFor } from "@/lib/sanity/image";

// Canonical site origin. Share previews need absolute image URLs, so this has to
// be right in production — set APP_BASE_URL on the deployment.
export const siteUrl = (
  process.env.APP_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://sucf-unec.vercel.app"
).replace(/\/$/, "");

// 1200x630 is what WhatsApp, Facebook, X and LinkedIn all crop to.
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * Builds Open Graph + Twitter metadata for a Sanity document so that sharing a
 * link shows the story's own image instead of a bare title.
 */
export function shareMetadata({ title, description, image, path, publishedAt, author, type = "article" }) {
  const url = `${siteUrl}${path}`;

  const images = image
    ? [
        {
          url: urlFor(image).width(OG_WIDTH).height(OG_HEIGHT).fit("crop").url(),
          width: OG_WIDTH,
          height: OG_HEIGHT,
          alt: title,
        },
      ]
    : [{ url: `${siteUrl}/assets/logo.png`, alt: "SUCF UNEC" }];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: "SUCF UNEC",
      images,
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(author ? { authors: [author] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}
