import { defineField, defineType } from "sanity";

export default defineType({
  name: "fellowshipEvent",
  title: "Fellowship Event",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "eventDate", type: "date", validation: (r) => r.required() }),
    defineField({ name: "eventTime", type: "string", description: 'e.g. "5:00 PM"' }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "bibleReference", type: "string" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "flyer", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "title", subtitle: "eventDate", media: "flyer" },
  },
});
