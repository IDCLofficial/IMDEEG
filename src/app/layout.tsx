import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PageTransitionWrapper from "@/app/components/PageTransitionWrapper";
import { Navbar } from "@/app/components/Navbar";
import Chatbot from "@/app/components/Chatbot";

const defaultTitle = 'Imo State Ministry of Digital Economy and E-Governance';
const defaultDescription = 'Driving digital transformation and e-governance in Imo State. We are committed to leveraging technology to improve governance, empower citizens, and create a digitally inclusive society for all Imolites.';
const siteUrl = 'https://mdeeg.im.gov.ng';

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: `%s | ${defaultTitle}`
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
    siteName: defaultTitle,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.png',
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
    images: ['/logo.png'],
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
  alternates: {
    canonical: siteUrl,
  },
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
      path: "../fonts/satoshi-cdnfonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/satoshi-cdnfonts/Satoshi-Medium.otf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../fonts/satoshi-cdnfonts/Satoshi-Italic.otf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../fonts/satoshi-cdnfonts/Satoshi-Bold.otf",
      weight: "500",
      style: "medium",
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
      <body
        className={`antialiased ${satoshiFont.className}`}
      >
        <Chatbot />
        <Navbar />
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </body>
    </html>
  );
}
