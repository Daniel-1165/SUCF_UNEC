import { defineField, defineType } from "sanity";

export default defineType({
  name: "reflection",
  title: "Reflection",
  type: "document",
  description:
    "A short quote, proverb, scripture or word of advice. These rotate beside the weekly spotlight on the home page.",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 5,
      description: "Around 5–6 lines reads best. Longer entries still work but will look denser.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description:
        "Optional — a scripture reference (Jeremiah 29:13), a person's name, or leave blank.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear earlier in the rotation.",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Rotation order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "text", subtitle: "source" },
    prepare({ title, subtitle }) {
      return {
        title: title ? `${title.slice(0, 60)}${title.length > 60 ? "…" : ""}` : "Untitled",
        subtitle,
      };
    },
  },
});
