'use client';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PageTransitionWrapper from "@/app/components/PageTransitionWrapper";
import { Navbar } from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";



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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body
        className={`antialiased ${satoshiFont.className}`}
      >
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </body>
    </html>
  );
}
