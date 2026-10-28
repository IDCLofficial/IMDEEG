import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
  // Old WordPress URLs that are still indexed. Permanent redirects keep their search value.
  // (Old article URLs at the site root are handled by src/app/(main)/[legacySlug]/page.tsx.)
  async redirects() {
    return [
      { source: "/skillup-imo", destination: "/skill-up", permanent: true },
      { source: "/skillup-imo/:path*", destination: "/skill-up", permanent: true },
      { source: "/success-stories", destination: "/skill-up", permanent: true },
      { source: "/sch-dashboard", destination: "/skill-up", permanent: true },
      { source: "/services", destination: "/about-us", permanent: true },
      { source: "/e-government", destination: "/about-us", permanent: true },
      { source: "/knowledge-management", destination: "/policy-repository", permanent: true },
      { source: "/gallery", destination: "/media", permanent: true },
      { source: "/announcements", destination: "/news", permanent: true },
      { source: "/tag/:path*", destination: "/news", permanent: true },
      { source: "/category/:path*", destination: "/news", permanent: true },
      { source: "/author/:path*", destination: "/news", permanent: true },
      { source: "/senator-hope-uzodinma/:path*", destination: "/news", permanent: true },
      { source: "/page/:path*", destination: "/news", permanent: true },
    ];
  },
};

export default nextConfig;
