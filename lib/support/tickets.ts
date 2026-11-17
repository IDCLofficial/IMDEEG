import { randomUUID } from "crypto";
import { Resend } from "resend";

export type SupportTicketSource = "contact_form" | "chat_assistant";

export type CreateSupportTicketInput = {
  source: SupportTicketSource;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

export type CreatedSupportTicket = {
  ticketId: string;
  createdAt: string;
  deliveryMethod: "email";
  deliveryError?: string;
  email?: string;
  // Phone and email are kept in metadata since we no longer send WhatsApp
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_REQUEST_PATTERN = /\b(public request|support ticket|complaint|report\s+(an\s+)?issue|escalate|petition|official request|request to (the )?ministry)\b/i;
const COMPLEX_ISSUE_PATTERNS: RegExp[] = [
  /\b(not working|isn't working|cannot|can't|unable to|failed|failure|error|bug|issue|problem|stuck|crash|broken|denied|blocked|not loading)\b/i,
  /\b(login|register|registration|portal|dashboard|payment|verification|otp|certificate|data|course|training|application|account)\b/i,
  /\b(since|for\s+\d+\s*(day|days|hour|hours|week|weeks)|multiple\s+times|repeatedly|urgent|immediately|asap|deadline|important)\b/i,
];

function sanitizeText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeOptionalText(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const cleaned = sanitizeText(value);
  return cleaned.length > 0 ? cleaned : undefined;
}

function normalizePhoneNumber(value?: string): string | undefined {
  const cleaned = sanitizeOptionalText(value);
  if (!cleaned) {
    return undefined;
  }

  const digits = cleaned.replace(/[^\d]/g, "");
  if (!digits) {
    return undefined;
  }

  // Nigeria local formats -> E.164 digits without plus for provider compatibility.
  if (digits.length === 10) {
    return `234${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    return `234${digits.slice(1)}`;
  }

  if (digits.length === 13 && digits.startsWith("234")) {
    return digits;
  }

  return digits;
}

function isValidEmail(value?: string): boolean {
  return !!value && EMAIL_PATTERN.test(value);
}

function createTicketId(): string {
  const now = new Date();
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `IMDEEG-${yyyymmdd}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function formatMetadata(metadata?: Record<string, string | number | boolean | null | undefined>): string[] {
  if (!metadata) {
    return [];
  }

  return Object.entries(metadata)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value ?? "null"}`);
}

export async function createSupportTicket(input: CreateSupportTicketInput): Promise<CreatedSupportTicket> {
  const valid = validateTicketInput(input);
  const createdAt = new Date().toISOString();
  const ticketId = createTicketId();

  // Build the email body
  const metadataLines = formatMetadata(valid.metadata);
  const metaSection = metadataLines.length > 0 ? `\n\nMetadata:\n${metadataLines.join("\n")}` : "";

  const bodyText = `IMDEEG SUPPORT TICKET

Ticket ID: ${ticketId}
Source: ${valid.source}
Created At: ${createdAt}
Name: ${valid.name ?? "Not provided"}
Email: ${valid.email ?? "Not provided"}
Phone: ${valid.phone ?? "Not provided"}
Message:
${valid.message}
${metaSection}

--
This is an automated support ticket from the IMDEEG Contact Us form or Chatbot.
Please reply to ${valid.email ?? "the sender's email"} to follow up.

For questions about this ticket, contact the ministry at info@mdeeg.im.gov.ng.`;

  // Determine the recipient email address for the ministry
  const supportEmail = process.env.SUPPORT_TICKET_EMAIL?.trim() || "contact@mdeeg.im.gov.ng";

  // Send the email via Resend
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const broadcastSecret = process.env.EMAIL_BROADCAST_SECRET?.trim();

  let deliveryError: string | undefined;

  if (!resendApiKey || !broadcastSecret) {
    deliveryError = "Email not configured. Set RESEND_API_KEY and EMAIL_BROADCAST_SECRET.";
  } else {
    try {
      const resend = new Resend(resendApiKey);

      const { from } = {
        from: process.env.EMAIL_FROM?.trim() || "IMDEEG Support <no-reply@mdeeg.im.gov.ng>",
      };

      const { data, error } = await resend.emails.send({
        from,
        to: supportEmail,
        replyTo: valid.email,
        subject: `[${ticketId}] Contact form / Chatbot support ticket`,
        text: bodyText,
      });

      if (error) {
        deliveryError = error.message || "Resend sendMail failed.";
      }
    } catch (err) {
      deliveryError = err instanceof Error ? err.message : "Unknown email delivery error.";
    }
  }

  return {
    ticketId,
    createdAt,
    deliveryMethod: "email",
    deliveryError,
    email: valid.email,
  };
}

function validateTicketInput(input: CreateSupportTicketInput): {
  source: SupportTicketSource;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
} {
  const source = input.source;
  if (source !== "contact_form" && source !== "chat_assistant") {
    throw new Error("Invalid ticket source.");
  }

  const name = sanitizeOptionalText(input.name);
  const email = sanitizeOptionalText(input.email);
  const phone = sanitizeOptionalText(input.phone);
  const message = sanitizeText(input.message || "");

  if (!message) {
    throw new Error("Ticket message is required.");
  }

  if (message.length < 10) {
    throw new Error("Ticket message is too short.");
  }

  if (message.length > 1500) {
    throw new Error("Ticket message is too long.");
  }

  if (email && !isValidEmail(email)) {
    throw new Error("Please provide a valid email address.");
  }

  if (source === "contact_form") {
    if (!name) {
      throw new Error("Name is required for contact form tickets.");
    }

    if (!email) {
      throw new Error("Email is required for contact form tickets.");
    }

    // Phone is no longer required for contact_form; email handles the reply path.
  }

  return {
    source,
    name,
    email,
    phone,
    message,
    metadata: input.metadata,
  };
}

function shouldCreatePublicRequestTicket(message: string): boolean {
  const cleaned = sanitizeText(message);
  return cleaned.length >= 20 && PUBLIC_REQUEST_PATTERN.test(cleaned);
}

function scoreComplexIssue(message: string): number {
  const cleaned = sanitizeText(message);
  if (cleaned.length < 30) {
    return 0;
  }

  let score = 0;

  if (COMPLEX_ISSUE_PATTERNS[0].test(cleaned)) {
    score += 2;
  }

  if (COMPLEX_ISSUE_PATTERNS[1].test(cleaned)) {
    score += 1;
  }

  if (COMPLEX_ISSUE_PATTERNS[2].test(cleaned)) {
    score += 1;
  }

  if (cleaned.length >= 120) {
    score += 1;
  }

  return score;
}

export function classifySupportTicketIntent(message: string): {
  shouldCreateTicket: boolean;
  reason: "public_request" | "complex_issue" | "none";
} {
  const cleaned = sanitizeText(message);

  if (shouldCreatePublicRequestTicket(cleaned)) {
    return {
      shouldCreateTicket: true,
      reason: "public_request",
    };
  }

  const issueScore = scoreComplexIssue(cleaned);
  if (issueScore >= 3) {
    return {
      shouldCreateTicket: true,
      reason: "complex_issue",
    };
  }

  return {
    shouldCreateTicket: false,
    reason: "none",
  };
}

export function extractContactFromText(message: string): { email?: string; phone?: string } {
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = message.match(/(?:\+?234|0)\d{10}/);

  return {
    email: sanitizeOptionalText(emailMatch?.[0]),
    phone: sanitizeOptionalText(phoneMatch?.[0]),
  };
}