import { defineField, defineType } from "sanity";

export default defineType({
  name: "weeklyPost",
  title: "Weekly Post",
  type: "document",
  fields: [
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "date", type: "date", initialValue: () => new Date().toISOString().slice(0, 10) }),
  ],
  preview: {
    select: { title: "date", media: "image" },
  },
});
