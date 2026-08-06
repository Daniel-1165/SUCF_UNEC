import { client } from "./client";

const FETCH_OPTS = { next: { revalidate: 60 } };

// Sanity fetches can fail (no project configured yet, network hiccup, etc).
// Swallow errors and return an empty fallback so pages render gracefully
// instead of crashing the whole route.
async function safeFetch(query, params, fallback) {
  try {
    return await client.fetch(query, params, FETCH_OPTS);
  } catch (err) {
    console.error("Sanity fetch failed:", err.message);
    return fallback;
  }
}

export function getNews() {
  return safeFetch(
    `*[_type == "news"] | order(publishedAt desc){
      _id, title, "slug": slug.current, excerpt, mainImage{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip}, publishedAt
    }`,
    {},
    []
  );
}

export function getNewsBySlug(slug) {
  return safeFetch(
    `*[_type == "news" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, excerpt, mainImage{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip}, body[]{
        ...,
        _type == "image" => {
          ...,
          "aspectRatio": asset->metadata.dimensions.aspectRatio,
          "lqip": asset->metadata.lqip
        }
      }, publishedAt
    }`,
    { slug },
    null
  );
}

export function getArticles() {
  return safeFetch(
    `*[_type == "article"] | order(publishedAt desc){
      _id, title, "slug": slug.current, excerpt, author, category, mainImage{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip}, publishedAt
    }`,
    {},
    []
  );
}

export function getArticleBySlug(slug) {
  return safeFetch(
    `*[_type == "article" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, excerpt, author, category, mainImage{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip}, body[]{
        ...,
        _type == "image" => {
          ...,
          "aspectRatio": asset->metadata.dimensions.aspectRatio,
          "lqip": asset->metadata.lqip
        }
      }, publishedAt
    }`,
    { slug },
    null
  );
}

export function getRelatedArticles(category, excludeId) {
  return safeFetch(
    `*[_type == "article" && category == $category && _id != $excludeId] | order(publishedAt desc)[0...3]{
      _id, title, "slug": slug.current, excerpt, mainImage{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip}, category
    }`,
    { category, excludeId },
    []
  );
}

export function getBooks() {
  return safeFetch(
    `*[_type == "book"] | order(title asc){
      _id, title, author, description, semester, coverImage{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip},
      "fileUrl": file.asset->url,
      "fileName": file.asset->originalFilename
    }`,
    {},
    []
  );
}

export function getGalleryImages() {
  return safeFetch(
    `*[_type == "galleryImage"] | order(_createdAt desc){
      _id, image{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip}, caption, category
    }`,
    {},
    []
  );
}

export function getExecutives() {
  return safeFetch(
    `*[_type == "executive"] | order(order asc){
      _id, name, role, department, photo{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip}
    }`,
    {},
    []
  );
}

export function getUpcomingFellowshipEvent() {
  return safeFetch(
    `*[_type == "fellowshipEvent" && eventDate >= now()] | order(eventDate asc)[0]{
      _id, title, eventDate, eventTime, location, bibleReference, description, flyer{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip}
    }`,
    {},
    null
  );
}

export function getWeeklyPosts() {
  return safeFetch(
    `*[_type == "weeklyPost"] | order(date desc){ _id, image{..., "aspectRatio": asset->metadata.dimensions.aspectRatio, "lqip": asset->metadata.lqip}, date }`,
    {},
    []
  );
}

export function getReflections() {
  return safeFetch(
    `*[_type == "reflection"] | order(order asc, _createdAt asc){ _id, text, source }`,
    {},
    []
  );
}

export function getAboutPage() {
  return safeFetch(`*[_type == "aboutPage"][0]{ vision, mission, values }`, {}, null);
}

export function getActivitiesPage() {
  return safeFetch(
    `*[_type == "activitiesPage"][0]{ weeklySchedule, units }`,
    {},
    null
  );
}
