// Seeds the two Sanity singletons that had no Supabase source: aboutPage and
// activitiesPage. Their content lived hardcoded in the old Vite app's JSX, so
// the Supabase export/import never covered them.
//
// Safe to re-run — uses fixed _id values with createIfNotExists, so it will
// not overwrite edits made later in Studio.
//
// Run with: node --env-file=.env scripts/seed-pages.mjs

import { createClient } from "next-sanity";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

async function uploadLocalImage(relPath) {
  try {
    const buf = await readFile(path.resolve(process.cwd(), "public", relPath));
    const asset = await client.assets.upload("image", buf, { filename: path.basename(relPath) });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.warn(`  could not upload ${relPath}: ${err.message}`);
    return undefined;
  }
}

// Content carried over from the legacy Vite pages.
const weeklySchedule = [
  {
    _type: "scheduleItem",
    _key: "sunday",
    day: "Sunday",
    time: "3:00 PM prompt",
    title: "Sunday Fellowship",
    description: "Architecture Auditorium, UNEC",
  },
  {
    _type: "scheduleItem",
    _key: "wednesday",
    day: "Wednesday",
    time: "6:00 PM prompt",
    title: "Weekly Prayers",
    description: "Freedom Field (opposite Mariere Hostel)",
  },
  {
    _type: "scheduleItem",
    _key: "thursday",
    day: "Thursday",
    time: "5:00 PM prep · 6:00 PM main",
    title: "Bible Study",
    description: "Architecture Auditorium (opposite the Medical Centre)",
  },
];

const unitSeed = [
  {
    key: "evangelism",
    name: "Evangelism Unit",
    description: "Spreading the gospel and reaching out with the love of Christ.",
    image: "assets/evangelism_unit.jpg",
  },
  {
    key: "choral",
    name: "Choral Unit",
    description: "Lifting voices in worship and praise to glorify God.",
    image: "assets/choral_unit.jpg",
  },
  {
    key: "drama",
    name: "Drama & Creativity",
    description: "Expressing faith through creative arts and dramatic presentations.",
    image: "assets/drama_unit.jpg",
  },
  {
    key: "media",
    name: "Media & Publicity",
    description: "Capturing moments and sharing the fellowship story.",
    image: "assets/media_unit.jpg",
  },
];

async function main() {
  console.log("Uploading unit images...");
  const units = [];
  for (const u of unitSeed) {
    const image = await uploadLocalImage(u.image);
    units.push({
      _type: "unit",
      _key: u.key,
      name: u.name,
      description: u.description,
      ...(image ? { image } : {}),
    });
    console.log(`  ${u.name}`);
  }

  console.log("Seeding activitiesPage...");
  await client.createIfNotExists({
    _id: "activitiesPage",
    _type: "activitiesPage",
    weeklySchedule,
    units,
  });

  console.log("Seeding aboutPage...");
  await client.createIfNotExists({
    _id: "aboutPage",
    _type: "aboutPage",
    vision:
      "Children, youth and adults nurtured to Christian maturity, following Jesus and transforming Nigeria.",
    mission:
      "Upholding Scripture Union's commitment to reaching students and families through Bible engagement, so they become Christians of influence.",
    values: [
      {
        _type: "object",
        _key: "integrity",
        title: "Integrity",
        description: "Living honestly before God and one another.",
      },
      {
        _type: "object",
        _key: "stewardship",
        title: "Academic Stewardship",
        description: "Treating our studies as work done for God.",
      },
      {
        _type: "object",
        _key: "leadership",
        title: "Servant Leadership",
        description: "Leading by serving, as Christ did.",
      },
      {
        _type: "object",
        _key: "love",
        title: "Brotherly Love",
        description: "Caring for each other as family on campus.",
      },
    ],
  });

  console.log("\nDone. Both pages are now editable in Studio at /studio.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
