export const project = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 } },
    { name: "summary", title: "Summary", type: "text", rows: 3 },

    {
      name: "mainImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    },

    { name: "content", title: "Detailed Description", type: "blockContent" },

    { name: "techStack", title: "Tech Stack", type: "array", of: [{ type: "string" }], options: { layout: "tags" } },
    { name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } },

    { name: "githubUrl", title: "GitHub URL", type: "url" },
    { name: "liveUrl", title: "Site URL", type: "url" },

    { name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: false },
    { name: "publishedAt", title: "Published At", type: "datetime" },
  ],
};
