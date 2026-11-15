export const escapeHtml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

/**
 * Takes the first word of a full name and presents it in title case.
 * All-caps records such as "OBILOR QUEENDALINE" become "Obilor".
 */
export function getFirstName(fullName: string | null | undefined) {
	const first = String(fullName ?? "")
		.trim()
		.split(/\s+/)[0];

	if (!first) return "there";

	if (first === first.toUpperCase()) {
		return first
			.toLowerCase()
			.replace(/(^|[-'])(\p{L})/gu, (_match, separator, letter) =>
				`${separator}${String(letter).toUpperCase()}`,
			);
	}

	return first.charAt(0).toUpperCase() + first.slice(1);
}

export function maskEmail(email: string) {
	const [localPart, domain] = String(email).trim().split("@");
	if (!localPart || !domain) return "***";
	return `${localPart.slice(0, 1)}***@${domain}`;
}
