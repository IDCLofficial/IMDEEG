// Set NEXT_PUBLIC_SITE_URL to your live domain (no trailing slash), e.g. https://skillup.example.com
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

// Every public page. Add new pages here and they appear in both sitemaps.
export const PUBLIC_PAGES = [
  {
    path: "/",
    title: "Register for a course",
    description: "Skillup Imo registration form: choose a course and learning centre.",
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    path: "/sitemap",
    title: "Sitemap",
    description: "A list of all pages on this site.",
    changeFrequency: "monthly" as const,
    priority: 0.3,
  },
];
