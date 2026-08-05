import { defineField, defineType } from "sanity";

export default defineType({
  name: "executive",
  title: "Executive",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "department", type: "string" }),
    defineField({ name: "photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers show first",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
