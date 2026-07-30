import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Economy Data & Statistics | IMDEEG",
  description: "Explore comprehensive data on SkillUp Imo training programs, participant statistics, and broadband infrastructure across all 27 Local Government Areas in Imo State.",
  keywords: [
    'SkillUp Imo data',
    'digital training statistics',
    'broadband infrastructure',
    'Imo State LGA data',
    'training participants',
    'gender distribution',
    'course enrollment',
    'digital literacy',
  ],
  openGraph: {
    title: "Digital Economy Data & Statistics | IMDEEG",
    description: "Explore comprehensive data on SkillUp Imo training programs, participant statistics, and broadband infrastructure across all 27 LGAs in Imo State.",
    url: "https://mdeeg.im.gov.ng/data",
    type: "website",
    images: [
      {
        url: "/images/data-hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Digital Economy Data Visualization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Economy Data & Statistics | IMDEEG",
    description: "Comprehensive data on SkillUp Imo programs and broadband infrastructure across Imo State",
    images: ["/images/data-hero-bg.jpg"],
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/data",
  },
};

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
