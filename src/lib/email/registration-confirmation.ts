import { Resend } from "resend";
import { FACEBOOK_FORUM_URL, INEC_REGISTRATION_URL, WHATSAPP_CHANNEL_URL } from "@/lib/links";
import { escapeHtml, getFirstName } from "@/lib/email/format";
import { buildWhatsAppGroupsHtml, buildWhatsAppGroupsText } from "./whatsapp-groups";

export const REGISTRATION_CONFIRMATION_SUBJECT =
	"Your SkillUp Imo registration is confirmed";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SEND_TIMEOUT_MS = 15_000;

export function buildRegistrationConfirmationHtml({
	firstName,
	reference,
	center,
}: {
	firstName: string;
	reference: string;
	center?: string;
}) {
	const safeFirstName = escapeHtml(firstName || "there");
	const safeReference = escapeHtml(reference);
	const whatsappGroups = buildWhatsAppGroupsHtml({ center });

	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${REGISTRATION_CONFIRMATION_SUBJECT}</title>
  </head>
  <body style="margin: 0; padding: 24px 12px; background-color: #f6f7f9;">
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333333; line-height: 1.6; background: #ffffff; padding: 24px; border-radius: 8px;">
      <p>Dear ${safeFirstName},</p>

      <p>Your registration with SkillUp Imo has been confirmed.</p>

      <p style="padding: 14px 16px; background: #eff8f2; color: #087744; font-size: 18px; font-weight: 700; border-radius: 6px;">
        Reference: ${safeReference}
      </p>

      <p>Please complete these three important steps to stay connected with our community.</p>

      <h3>1. Register with INEC</h3>
      <p>Complete your registration with the Independent National Electoral Commission (INEC) to ensure your participation in the electoral process.</p>
      <p><a href="${INEC_REGISTRATION_URL}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Register with INEC</a></p>

      <h3>2. Join Our Facebook Forum</h3>
      <p>Stay informed, connect with other members, participate in discussions, and receive important updates by joining our Facebook forum.</p>
      <p><a href="${FACEBOOK_FORUM_URL}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Join the Facebook Forum</a></p>

      ${whatsappGroups}

      <p>Thank you for your time and continued participation.</p>

      <p>Best regards,<br><strong>The Team</strong></p>
    </div>
  </body>
</html>`;
}

export function buildRegistrationConfirmationText({
	firstName,
	reference,
	center,
}: {
	firstName: string;
	reference: string;
	center?: string;
}) {
	const name = firstName || "there";
	const whatsappGroups = buildWhatsAppGroupsText({ center });

	return `Dear ${name},

Your registration with SkillUp Imo has been confirmed.

Reference: ${reference}

Please complete these three important steps to stay connected with our community.

1. Register with INEC
Complete your registration with the Independent National Electoral Commission (INEC) to ensure your participation in the electoral process.
${INEC_REGISTRATION_URL}

2. Join Our Facebook Forum
Stay informed, connect with other members, participate in discussions, and receive important updates by joining our Facebook forum.
${FACEBOOK_FORUM_URL}

${whatsappGroups}

Thank you for your time and continued participation.

Best regards,
The Team`;
}

export type ConfirmationSendResult =
	| { ok: true; id?: string }
	| { ok: false; skipped?: boolean; error: string };

export async function sendRegistrationConfirmation({
	id,
	fullName,
	email,
	reference,
	center,
}: {
	id: string;
	fullName: string;
	email: string;
	reference: string;
	center?: string;
}): Promise<ConfirmationSendResult> {
	const apiKey = process.env.RESEND_API_KEY?.trim();
	if (!apiKey) {
		return {
			ok: false,
			skipped: true,
			error: "RESEND_API_KEY is not set.",
		};
	}

	const from =
		process.env.EMAIL_FROM?.trim() ||
		"SkillUp Imo <no-reply@mdeeg.im.gov.ng>";
	const replyTo =
		process.env.EMAIL_REPLY_TO?.trim() || "contact@mdeeg.im.gov.ng";
	const firstName = getFirstName(fullName);

	const payload = {
		from,
		to: email,
		subject: REGISTRATION_CONFIRMATION_SUBJECT,
		html: buildRegistrationConfirmationHtml({ firstName, reference, center }),
		text: buildRegistrationConfirmationText({ firstName, reference, center }),
		replyTo,
		tags: [{ name: "campaign", value: "registration-confirmation" }],
	};

	const resend = new Resend(apiKey);

	for (let attempt = 0; attempt < 2; attempt += 1) {
		const result = await resend.emails.send(payload, {
			idempotencyKey: `registration-confirmation-${id}`,
			// Never let a stalled Resend request hold a background task open.
			signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
		});

		if (!result.error) {
			return { ok: true, id: result.data?.id };
		}

		if (result.error.statusCode === 429 && attempt === 0) {
			await sleep(1000);
			continue;
		}

		return {
			ok: false,
			error: result.error.message || "Resend rejected the confirmation email.",
		};
	}

	return { ok: false, error: "Resend rate limit reached." };
}
