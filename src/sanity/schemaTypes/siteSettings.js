export const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    // Identity
    { name: "siteTitle", title: "Site Title", type: "string", initialValue: "Amandeep Singh" },
    { name: "heroHeadline", title: "Hero Headline", type: "string" },
    { name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 3 },

    // Your photo
    {
      name: "portrait",
      title: "Portrait Photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    },

    // About / summary
    { name: "summary", title: "Summary (CV)", type: "text", rows: 4 },
    { name: "about", title: "About (Long)", type: "blockContent" },

    // Contact + links
    {
      name: "contact",
      title: "Contact",
      type: "object",
      fields: [
        { name: "email", title: "Email", type: "string" },
        { name: "phone", title: "Phone", type: "string" },
        { name: "location", title: "Location", type: "string" },
        { name: "githubUrl", title: "GitHub URL", type: "url" },
        { name: "linkedinUrl", title: "LinkedIn URL", type: "url" },
      ],
    },

    // CV file/link
    { name: "cvUrl", title: "CV PDF URL", type: "url" },
    { name: "cvFile", title: "CV PDF (Upload)", type: "file" },

    // Education
    {
      name: "education",
      title: "Education",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "degree", title: "Degree", type: "string" },
            { name: "field", title: "Field", type: "string" },
            { name: "institution", title: "Institution", type: "string" },
            { name: "location", title: "Location", type: "string" },
            { name: "startYear", title: "Start Year", type: "number" },
            { name: "endYear", title: "End Year", type: "number" },
            { name: "notes", title: "Notes", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    },

    // Experience
    {
      name: "experience",
      title: "Experience",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "company", title: "Company", type: "string" },
            { name: "title", title: "Title", type: "string" },
            { name: "location", title: "Location", type: "string" },
            { name: "start", title: "Start (YYYY-MM)", type: "string" },
            { name: "end", title: "End (YYYY-MM)", type: "string" },
            { name: "current", title: "Current", type: "boolean", initialValue: false },
            { name: "highlights", title: "Highlights", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    },

    // Publications
    {
      name: "publications",
      title: "Publications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "citation", title: "Citation", type: "text" },
            { name: "year", title: "Year", type: "number" },
            { name: "link", title: "Link", type: "url" },
          ],
        },
      ],
    },

    // Awards + memberships
    { name: "awards", title: "Awards", type: "array", of: [{ type: "string" }] },
    { name: "memberships", title: "Memberships", type: "array", of: [{ type: "string" }] },

    // Skills (structured)
    {
      name: "skills",
      title: "Skills",
      type: "object",
      fields: [
        { name: "programming", title: "Programming", type: "array", of: [{ type: "string" }] },
        { name: "mlData", title: "ML / Data", type: "array", of: [{ type: "string" }] },
        { name: "tools", title: "Tools", type: "array", of: [{ type: "string" }] },
        { name: "actuarial", title: "Actuarial / Finance", type: "array", of: [{ type: "string" }] },
      ],
    },
  ],
};
