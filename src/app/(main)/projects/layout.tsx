import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | IMDEEG",
  description: "Discover ongoing projects and initiatives by the Imo State Ministry of Digital Economy and E-Governance aimed at digital transformation and citizen empowerment.",
  keywords: [
    'IMDEEG projects',
    'digital initiatives',
    'government projects',
    'digital transformation projects',
    'innovation projects',
    'Imo State initiatives',
  ],
  openGraph: {
    title: "Projects | IMDEEG",
    description: "Ongoing digital transformation and e-governance projects in Imo State",
    url: "https://mdeeg.im.gov.ng/projects",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Projects | IMDEEG",
    description: "Digital initiatives and projects by IMDEEG",
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
