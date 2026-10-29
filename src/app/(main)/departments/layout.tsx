import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Departments & Units | IMDEEG",
  description: "Explore the various departments and units within the Imo State Ministry of Digital Economy and E-Governance, each dedicated to specific aspects of digital transformation.",
  keywords: [
    'IMDEEG departments',
    'ministry units',
    'government departments',
    'digital services',
    'e-governance units',
    'ICT departments',
  ],
  openGraph: {
    title: "Departments & Units | IMDEEG",
    description: "Organizational departments and units driving digital transformation in Imo State",
    url: "https://mdeeg.im.gov.ng/departments",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary",
    title: "Departments & Units | IMDEEG",
    description: "Explore IMDEEG departments and organizational units",
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/departments",
  },
};

export default function DepartmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
