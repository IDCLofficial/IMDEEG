import {
	FACEBOOK_FORUM_URL,
	INEC_REGISTRATION_URL,
	WHATSAPP_CHANNEL_URL,
} from "@/lib/links";
import { escapeHtml, getFirstName } from "@/lib/email/format";
import { buildWhatsAppGroupsHtml, buildWhatsAppGroupsText } from "./whatsapp-groups";

export { escapeHtml, getFirstName };
export { FACEBOOK_FORUM_URL, INEC_REGISTRATION_URL, WHATSAPP_CHANNEL_URL };

export const REGISTRATION_UPDATE_SUBJECT =
	"Action required: Complete your SkillUp Imo registration";

export function buildEditRegistrationUrl(siteUrl: string, registrationId: string) {
	const base = siteUrl.replace(/\/+$/, "");
	return `${base}/skill-up?id=${encodeURIComponent(registrationId)}`;
}

export function buildRegistrationUpdateHtml({
	firstName,
	editUrl,
	center,
}: {
	firstName: string;
	editUrl: string;
	center?: string;
}) {
	const safeFirstName = escapeHtml(firstName || "there");
	const whatsappGroups = buildWhatsAppGroupsHtml({ center });

	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${REGISTRATION_UPDATE_SUBJECT}</title>
  </head>
  <body style="margin: 0; padding: 24px 12px; background-color: #f6f7f9;">
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333333; line-height: 1.6; background: #ffffff; padding: 24px; border-radius: 8px;">
      <p>Dear ${safeFirstName},</p>

      <p>Thank you for being part of our previous registration process.</p>

      <p>We are reaching out to all previously registered participants to request that you complete four important steps to keep your information up to date and stay connected with our community.</p>

      <h3>1. Update Your Registration Details</h3>
      <p>Some information may have been missing during your initial registration. Kindly review and update your details using the link below.</p>
      <p><a href="${editUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Edit Your Registration</a></p>

      <h3>2. Register with INEC</h3>
      <p>We encourage you to complete your registration with the Independent National Electoral Commission (INEC) to ensure your participation in the electoral process.</p>
      <p><a href="${INEC_REGISTRATION_URL}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Register with INEC</a></p>

      <h3>3. Join Our Facebook Forum</h3>
      <p>Stay informed, connect with other members, participate in discussions, and receive important updates by joining our Facebook forum.</p>
      <p><a href="${FACEBOOK_FORUM_URL}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Join the Facebook Forum</a></p>

      ${whatsappGroups}

      <p>Please complete these steps as soon as possible. Your cooperation helps us maintain accurate records and build a more informed, connected, and engaged community.</p>

      <p>Thank you for your time and continued participation.</p>

      <p>Best regards,<br><strong>The Team</strong></p>
    </div>
  </body>
</html>`;
}

export function buildRegistrationUpdateText({
	firstName,
	editUrl,
	center,
}: {
	firstName: string;
	editUrl: string;
	center?: string;
}) {
	const name = firstName || "there";
	const whatsappGroups = buildWhatsAppGroupsText({ center });

	return `Dear ${name},

Thank you for being part of our previous registration process.

We are reaching out to all previously registered participants to request that you complete four important steps to keep your information up to date and stay connected with our community.

1. Update Your Registration Details
Some information may have been missing during your initial registration. Kindly review and update your details using the link below.
${editUrl}

2. Register with INEC
We encourage you to complete your registration with the Independent National Electoral Commission (INEC) to ensure your participation in the electoral process.
${INEC_REGISTRATION_URL}

3. Join Our Facebook Forum
Stay informed, connect with other members, participate in discussions, and receive important updates by joining our Facebook forum.
${FACEBOOK_FORUM_URL}

${whatsappGroups}

Please complete these steps as soon as possible. Your cooperation helps us maintain accurate records and build a more informed, connected, and engaged community.

Thank you for your time and continued participation.

Best regards,
The Team`;
}
