import type { Metadata } from "next";
import { COURSES } from "@/lib/constants";

const siteUrl = "https://mdeeg.im.gov.ng";
const title = "SkillUp Imo Digital Skills Training Registration | MDEEG";
const description =
	"Register for SkillUp Imo, the digital skills training programme of the Imo State Ministry of Digital Economy and E-Governance. Courses include AI Prompt Engineering, Graphic Design, Digital Marketing and Data Analysis.";

export const metadata: Metadata = {
	title,
	description,
	keywords: [
		"SkillUp Imo",
		"SkillUpImo registration",
		"digital skills training Imo State",
		"SkillUp Imo courses",
		"MDEEG",
	],
	alternates: { canonical: `${siteUrl}/skill-up` },
	openGraph: {
		title,
		description,
		url: `${siteUrl}/skill-up`,
		type: "website",
		images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
	},
	twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
};

// One Course entry per course listed on the page (COURSES is the same list the page renders).
const provider = {
	"@type": "Organization",
	name: "Imo State Ministry of Digital Economy and E-Governance",
	sameAs: siteUrl,
};
const courseListJsonLd = {
	"@context": "https://schema.org",
	"@type": "ItemList",
	name: "SkillUp Imo courses",
	itemListElement: COURSES.map((name, i) => ({
		"@type": "ListItem",
		position: i + 1,
		item: {
			"@type": "Course",
			name,
			description: `${name} training in the SkillUp Imo digital skills programme of the Imo State Ministry of Digital Economy and E-Governance.`,
			url: `${siteUrl}/skill-up`,
			provider,
		},
	})),
};

export default function SkillUpLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListJsonLd).replace(/</g, "\\u003c") }}
			/>
			{children}
		</>
	);
}
