import { defineField, defineType } from "sanity";

export default defineType({
  name: "book",
  title: "Library Book",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "author", type: "string" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "semester", type: "string" }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "file", type: "file", title: "PDF File" }),
  ],
  preview: {
    select: { title: "title", subtitle: "author", media: "coverImage" },
  },
});
