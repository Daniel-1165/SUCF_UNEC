import { defineField, defineType } from "sanity";

export default defineType({
  name: "activitiesPage",
  title: "Activities Page",
  type: "document",
  fields: [
    defineField({
      name: "weeklySchedule",
      title: "Weekly Schedule",
      type: "array",
      of: [
        {
          type: "object",
          name: "scheduleItem",
          fields: [
            { name: "day", type: "string" },
            { name: "time", type: "string" },
            { name: "title", type: "string" },
            { name: "description", type: "text", rows: 2 },
          ],
          preview: {
            select: { title: "day", subtitle: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "units",
      title: "Ministry Units",
      type: "array",
      of: [
        {
          type: "object",
          name: "unit",
          fields: [
            { name: "name", type: "string" },
            { name: "description", type: "text", rows: 2 },
            { name: "image", type: "image", options: { hotspot: true } },
          ],
          preview: {
            select: { title: "name", media: "image" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Activities Page" };
    },
  },
});
