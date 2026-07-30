import { randomUUID } from "crypto";

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
  whatsappMessageId?: string;
  deliveryMethod: "termii" | "wa_me_link";
  waMeLink: string;
  deliveryError?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_REQUEST_PATTERN = /\b(public request|support ticket|complaint|report\s+(an\s+)?issue|escalate|petition|official request|request to (the )?ministry)\b/i;

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

function formatTicketForWhatsApp(ticketId: string, payload: Required<Pick<CreateSupportTicketInput, "source" | "message">> & {
  name?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}): string {
  const lines = [
    "IMDEEG SUPPORT TICKET",
    `Ticket ID: ${ticketId}`,
    `Source: ${payload.source}`,
    `Created At: ${payload.createdAt}`,
    `Name: ${payload.name ?? "Not provided"}`,
    `Email: ${payload.email ?? "Not provided"}`,
    `Phone: ${payload.phone ?? "Not provided"}`,
    "Message:",
    payload.message,
  ];

  const metadataLines = formatMetadata(payload.metadata);
  if (metadataLines.length > 0) {
    lines.push("Metadata:");
    lines.push(...metadataLines);
  }

  return lines.join("\n");
}

function getRecipientDigits(): string {
  const recipient = process.env.WHATSAPP_TO_NUMBER;

  if (!recipient) {
    throw new Error("Missing WhatsApp recipient number. Set WHATSAPP_TO_NUMBER.");
  }

  const digits = recipient.replace(/[^\d]/g, "");
  if (digits.length < 10) {
    throw new Error("Invalid WHATSAPP_TO_NUMBER format.");
  }

  return digits;
}

function buildWaMeLink(recipientDigits: string, text: string): string {
  return `https://wa.me/${recipientDigits}?text=${encodeURIComponent(text)}`;
}

async function sendTermiiWhatsAppMessage(text: string, recipientDigits: string): Promise<string | undefined> {
  const apiKey = process.env.TERMII_API_KEY;
  const from = process.env.TERMII_SENDER_ID;
  const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";
  const channel = process.env.TERMII_CHANNEL || "whatsapp";

  if (!apiKey || !from) {
    throw new Error(
      "Termii is not configured. Set TERMII_API_KEY and TERMII_SENDER_ID to enable direct delivery."
    );
  }

  const response = await fetch(`${baseUrl}/api/sms/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: recipientDigits,
      from,
      sms: text.slice(0, 1600),
      type: "plain",
      channel,
      api_key: apiKey,
    }),
  });

  const rawBody = await response.text();
  let message = rawBody;
  let messageId: string | undefined;

  try {
    const parsed = JSON.parse(rawBody) as {
      message?: string;
      message_id?: string;
    };
    message = parsed.message || rawBody;
    messageId = parsed.message_id;
  } catch {
    // Termii can return plain text in some error paths.
  }

  if (!response.ok) {
    throw new Error(message || "Termii WhatsApp request failed.");
  }

  return messageId;
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

export function shouldCreatePublicRequestTicket(message: string): boolean {
  const cleaned = sanitizeText(message);
  return cleaned.length >= 20 && PUBLIC_REQUEST_PATTERN.test(cleaned);
}

export function extractContactFromText(message: string): { email?: string; phone?: string } {
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = message.match(/(?:\+?234|0)\d{10}/);

  return {
    email: sanitizeOptionalText(emailMatch?.[0]),
    phone: sanitizeOptionalText(phoneMatch?.[0]),
  };
}

export async function createSupportTicket(input: CreateSupportTicketInput): Promise<CreatedSupportTicket> {
  const valid = validateTicketInput(input);
  const createdAt = new Date().toISOString();
  const ticketId = createTicketId();
  const recipientDigits = getRecipientDigits();

  const whatsappPayload = formatTicketForWhatsApp(ticketId, {
    source: valid.source,
    name: valid.name,
    email: valid.email,
    phone: valid.phone,
    message: valid.message,
    createdAt,
    metadata: valid.metadata,
  });

  const waMeLink = buildWaMeLink(recipientDigits, whatsappPayload);

  try {
    const whatsappMessageId = await sendTermiiWhatsAppMessage(whatsappPayload, recipientDigits);

    return {
      ticketId,
      createdAt,
      whatsappMessageId,
      deliveryMethod: "termii",
      waMeLink,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Termii delivery failed.";

    return {
      ticketId,
      createdAt,
      deliveryMethod: "wa_me_link",
      waMeLink,
      deliveryError: message,
    };
  }
}
