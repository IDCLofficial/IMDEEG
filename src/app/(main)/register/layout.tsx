import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | SkillUp Imo Programs | IMDEEG",
  description: "Register for SkillUp Imo digital training programs. Get started on your digital transformation journey and acquire in-demand skills with free training.",
  keywords: [
    'SkillUp Imo registration',
    'digital training registration',
    'register for courses',
    'free digital training',
    'skill development',
    'training enrollment',
    'Imo State training',
  ],
  openGraph: {
    title: "Register | SkillUp Imo Programs | IMDEEG",
    description: "Register for free SkillUp Imo digital training programs and acquire in-demand digital skills",
    url: "https://mdeeg.im.gov.ng/register",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Register | SkillUp Imo Programs",
    description: "Register for free digital training with SkillUp Imo",
  },
  alternates: {
    canonical: "https://mdeeg.im.gov.ng/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
