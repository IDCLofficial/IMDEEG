import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates | IMDEEG",
  description: "Stay updated with the latest news, announcements, and updates from the Imo State Ministry of Digital Economy and E-Governance.",
  keywords: [
    'IMDEEG news',
    'digital economy news',
    'Imo State news',
    'government announcements',
    'ministry updates',
    'digital transformation news',
  ],
  openGraph: {
    title: "News & Updates | IMDEEG",
    description: "Latest news and updates from the Imo State Ministry of Digital Economy and E-Governance",
    url: "https://mdeeg.im.gov.ng/news",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "News & Updates | IMDEEG",
    description: "Latest news from IMDEEG",
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/news",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
