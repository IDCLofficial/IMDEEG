import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css"
import PageTransitionWrapper from "@/app/components/PageTransitionWrapper";
import { Navbar } from "@/app/components/Navbar";
import BootcampAdModal from "@/app/components/BootcampAdModal";
// import Chatbot from "@/app/components/Chatbot";
import Chatbot from "../components/Chatbot";
import { OrganizationSchema } from "@/app/components/StructuredData";
const defaultTitle = 'Imo State Ministry of Digital Economy & E-Governance (MDEEG)';
const brandName = 'Imo State Ministry of Digital Economy and E-Governance';
const defaultDescription = 'Official website of the Imo State Ministry of Digital Economy and E-Governance (MDEEG): e-government platforms, digital skills training through SkillUp Imo, and the Imo Digital Economy Agenda.';
const siteUrl = 'https://mdeeg.im.gov.ng';

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    // Page titles already carry the brand (e.g. "Events | IMDEEG"), so no suffix is appended.
    template: '%s'
  },
  description: defaultDescription,
  keywords: [
    'Imo State',
    'Nigeria',
    'Digital Economy',
    'E-Governance',
    'Government',
    'ICT',
    'Innovation',
    'Technology',
    'Digital Transformation',
    'SkillUp Imo',
    'Imo Digital Economy Agenda',
    'MDEEG',
    'E-Government',
    'Smart City',
    'Owerri',
    'South East Nigeria'
  ],
  authors: [{ name: 'Imo State Ministry of Digital Economy and E-Governance' }],
  creator: 'Imo Digital City Limited',
  publisher: 'Imo Digital City Limited',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: brandName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    creator: '@ImoDigitalCity',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#0033A0',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  other: {
    'msapplication-TileColor': '#0033A0',
  },
};

const satoshiFont = localFont({
  src: [
    {
      path: "../../fonts/satoshi-cdnfonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/satoshi-cdnfonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/satoshi-cdnfonts/Satoshi-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/satoshi-cdnfonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://pulse-track.onrender.com/tracker.min.js" data-key={process.env.PULSE_TRACK_KEY} async></script>
      </head>
      <body
        className={`antialiased ${satoshiFont.className}`}
      >
        <OrganizationSchema />
        {/*<BootcampAdModal />*/}
        <Navbar />
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
        <Chatbot />
      </body>
    </html>
  );
}
