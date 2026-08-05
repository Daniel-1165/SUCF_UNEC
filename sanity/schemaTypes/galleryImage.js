import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "caption", type: "string" }),
    defineField({
      name: "category",
      type: "string",
      options: { list: ["Events", "Worship", "Fellowship", "Outreach"] },
    }),
  ],
  preview: {
    select: { title: "caption", media: "image", subtitle: "category" },
  },
});
