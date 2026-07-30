import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | IMDEEG",
  description: "Get in touch with the Imo State Ministry of Digital Economy and E-Governance. Find our contact information, office locations, and reach out to our team.",
  keywords: [
    'contact IMDEEG',
    'Imo Ministry contact',
    'digital economy office',
    'e-governance contact',
    'Owerri office',
    'government contact',
  ],
  openGraph: {
    title: "Contact Us | IMDEEG",
    description: "Get in touch with IMDEEG - Contact information and office locations across Imo State",
    url: "https://mdeeg.im.gov.ng/contact-us",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | IMDEEG",
    description: "Get in touch with the Imo State Ministry of Digital Economy and E-Governance",
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/contact-us",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
