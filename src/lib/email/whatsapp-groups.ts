import {
	INEC_REGISTRATION_URL,
	FACEBOOK_FORUM_URL,
	WHATSAPP_CHANNEL_URL,
	WHATSAPP_GROUPS,
} from "@/lib/links";

export const CENTRES_MAP: Record<string, keyof typeof WHATSAPP_GROUPS> = {
	// Exact centre names from the form enum (src/lib/constants.ts)
	"IDCL": "idcl",
	"Alvan Ikoku Federal University of Education": "alvan",
	"Imo State University": "imsu",
	"Federal University of Technology Owerri": "futo",
	// All remaining centres share the "other" group
};

// Resolve a centre name to its WhatsApp group key (default: other)
export function resolveWhatsAppGroupKey(center?: string): keyof typeof WHATSAPP_GROUPS {
	if (!center) return "other";
	const mapped = CENTRES_MAP[String(center).trim()];
	return mapped ?? "other";
}

// Build HTML for the WhatsApp groups section
export function buildWhatsAppGroupsHtml({ center }: { center?: string }) {
	const key = resolveWhatsAppGroupKey(center);
	const groupUrl = WHATSAPP_GROUPS[key];
	const isPersonalised = key !== "other";

	const centerDisplay = isPersonalised
		? `${center} Center`
		: "Other Learning Centers";

	return `<h3>3. Join Your Learning Center WhatsApp Group</h3>

      <p>Further information about the SkillUp Imo Cohort 5 program will be passed
      through our WhatsApp communities. Locate the link to your learning center
      WhatsApp group below and join it to get more information about the next step
      to take:</p>

      <p><strong>${centerDisplay}:</strong></p>
      <p><a href="${groupUrl}" style="display: inline-block; background: #128c7e; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: 600;">
      Join ${centerDisplay} WhatsApp Group</a></p>

      <ol style="padding-left: 20px; margin: 16px 0 0;">
        <li>IDCL CENTER: https://chat.whatsapp.com/KqoKob6TTVf4KJclnO1EbR</li>
        <li>ALVAN CENTER: https://chat.whatsapp.com/D619WnvNRm2KKS5LinhNBv</li>
        <li>IMSU CENTER: https://chat.whatsapp.com/DpFp1LYgJG83tpe759MEUe</li>
        <li>FUTO CENTER: https://chat.whatsapp.com/H2E2c4PX0MSDKIIrEj8UZx</li>
        <li>OTHER LEARNING CENTERS (UAES, UNION CREST, KOMU, AMIGBO, etc.): Join your group using this link: https://chat.whatsapp.com/LUuXSy3mpII1u8UJtpg4XZ</li>
      </ol>

      <p>Finally, every applicant across all learning centers should join our official
      WhatsApp Channel using this link:</p>
      <p><a href="${WHATSAPP_CHANNEL_URL}" style="display: inline-block; background: #128c7e; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: 600;">
      Join our Official WhatsApp Channel</a></p>`;
}

// Build plain-text version
export function buildWhatsAppGroupsText({ center }: { center?: string }) {
	const key = resolveWhatsAppGroupKey(center);
	const groupUrl = WHATSAPP_GROUPS[key];
	const isPersonalised = key !== "other";

	const centerDisplay = isPersonalised ? `${center} Center` : "Other Learning Centers";

	const lines: string[] = [];
	lines.push("Dear applicant,");
	lines.push("");
	lines.push("Further information about the SkillUp Imo Cohort 5 program will be passed");
	lines.push("through our WhatsApp communities. Locate the link to your learning center");
	lines.push("WhatsApp group below and join it to get more information about the next step");
	lines.push("to take:");
	lines.push("");
	lines.push(`Your learning center: ${centerDisplay}`);
	lines.push(`Join your group: ${groupUrl}`);
	lines.push("");
	lines.push("All learning center groups:");
	lines.push("1. IDCL CENTER: https://chat.whatsapp.com/KqoKob6TTVf4KJclnO1EbR");
	lines.push("2. ALVAN CENTER: https://chat.whatsapp.com/D619WnvNRm2KKS5LinhNBv");
	lines.push("3. IMSU CENTER: https://chat.whatsapp.com/DpFp1LYgJG83tpe759MEUe");
	lines.push("4. FUTO CENTER: https://chat.whatsapp.com/H2E2c4PX0MSDKIIrEj8UZx");
	lines.push("5. OTHER LEARNING CENTERS (UAES, UNION CREST, KOMU, AMIGBO, etc.): Join your group using this link: https://chat.whatsapp.com/LUuXSy3mpII1u8UJtpg4XZ");
	lines.push("");
	lines.push("Finally, every applicant across all learning centers should join our official");
	lines.push("WhatsApp Channel using this link:");
	lines.push(`${WHATSAPP_CHANNEL_URL}`);
	lines.push("");
	lines.push("Thank you for your time and continued participation.");
	lines.push("Best regards,");
	lines.push("The Team");

	return lines.join("\n");
}