import { createClient } from "next-sanity";

// Falls back to a placeholder so the app can boot before the real Sanity
// project exists — queries just come back empty until NEXT_PUBLIC_SANITY_PROJECT_ID
// is set in .env, instead of the whole site crashing at module load.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
