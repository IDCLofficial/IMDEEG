import React, { Suspense } from "react";
import type { Metadata } from "next";
import Footer from "@/app/components/Footer";
import CTASection from "@/app/components/CTASection";
import PolicyRepositoryHeroSection from "./PolicyRepositoryHeroSection";
import PublicationsGrid from "./PublicationsGrid";
import { fetchPublications } from "./publications";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Policy Repository | IMDEEG",
  description:
    "Browse, view, and download official policies, frameworks, reports, and publications from the Imo State Ministry of Digital Economy and E-Governance.",
  keywords: [
    "IMDEEG",
    "policy repository",
    "Imo State policies",
    "digital economy policies",
    "e-governance publications",
    "government reports",
    "download policy documents",
  ],
  openGraph: {
    title: "Policy Repository | IMDEEG",
    description:
      "Browse, view, and download official policies and publications from IMDEEG.",
    url: "https://mdeeg.im.gov.ng/policy-repository",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Policy Repository | IMDEEG",
    description: "Official policies and publications from IMDEEG.",
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/policy-repository",
  },
};

async function PublicationsContent() {
  const result = await fetchPublications();
  return (
    <PublicationsGrid
      publications={result.items}
      categories={result.categories}
      error={result.error}
    />
  );
}

export default function PolicyRepositoryPage() {
  return (
    <main className="min-h-screen w-full bg-[#F7F9FA] flex flex-col">
      <PolicyRepositoryHeroSection
        title="Policy Repository"
        subtitle="Access, preview, and download official policy documents, frameworks, and reports guiding the Imo State Digital Economy and E-Governance agenda."
      />
      <section className="w-full max-w-7xl mx-auto py-12 h-[100vh] px-4">
        <Suspense
          fallback={
            <div className="flex justify-center py-10 text-gray-500">
              <p>Loading publications...</p>
            </div>
          }
        >
          <PublicationsContent />
        </Suspense>
      </section>
      <CTASection
        heading="Have a policy request?"
        subtext="Reach out to the ministry if you need an official publication you cannot find here."
        buttonLabel="Contact Us"
        buttonHref="/contact-us"
      />
      <Footer />
    </main>
  );
}
