import { defineType, defineArrayMember } from "sanity";

// Shared rich-text body used by both `article` and `news`.
// Editors can mix formatted text with images placed anywhere between
// paragraphs — each image carries its own alt text and caption.
export default defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (r) =>
                  r.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Describes the image for screen readers and search engines.",
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
          description: "Optional text shown beneath the image.",
        },
      ],
      preview: {
        select: { title: "caption", subtitle: "alt", media: "asset" },
      },
    }),
  ],
});
