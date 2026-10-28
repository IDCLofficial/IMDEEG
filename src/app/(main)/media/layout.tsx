import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media & Resources | IMDEEG",
  description: "Access media resources, photos, videos, and publications from the Imo State Ministry of Digital Economy and E-Governance.",
  keywords: [
    'IMDEEG media',
    'digital resources',
    'ministry photos',
    'ministry videos',
    'publications',
    'press releases',
  ],
  openGraph: {
    title: "Media & Resources | IMDEEG",
    description: "Media resources and publications from the Imo State Ministry of Digital Economy and E-Governance",
    url: "https://mdeeg.im.gov.ng/media",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary",
    title: "Media & Resources | IMDEEG",
    description: "Media and resources from IMDEEG",
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/media",
  },
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
