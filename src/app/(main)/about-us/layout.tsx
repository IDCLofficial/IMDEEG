import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About IMDEEG | Imo Ministry of Digital Economy and E-Governance",
  description: "Learn about the Imo State Ministry of Digital Economy and E-Governance, our mission, vision, organizational structure, and leadership team committed to digital transformation.",
  keywords: [
    'Imo Ministry',
    'Digital Economy',
    'E-Governance',
    'Digital transformation',
    'Government innovation',
    'digital services',
    'commissioner',
    'departments',
  ],
  openGraph: {
    title: "About IMDEEG | Imo Ministry of Digital Economy and E-Governance",
    description: "Learn about our mission to drive digital transformation and e-governance in Imo State",
    url: "https://mdeeg.im.gov.ng/about-us",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "IMDEEG Ministry Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About IMDEEG",
    description: "Imo Ministry of Digital Economy and E-Governance",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/about-us",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
