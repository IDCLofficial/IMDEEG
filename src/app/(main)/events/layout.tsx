import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | IMDEEG",
  description: "Discover upcoming events, workshops, seminars, and conferences organized by the Imo State Ministry of Digital Economy and E-Governance.",
  keywords: [
    'IMDEEG events',
    'digital economy events',
    'workshops',
    'seminars',
    'conferences',
    'training events',
    'Imo State events',
  ],
  openGraph: {
    title: "Events | IMDEEG",
    description: "Upcoming events and workshops from the Imo State Ministry of Digital Economy and E-Governance",
    url: "https://mdeeg.im.gov.ng/events",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Events | IMDEEG",
    description: "Upcoming events and workshops from IMDEEG",
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
