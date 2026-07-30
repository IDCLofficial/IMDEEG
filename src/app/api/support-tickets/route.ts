import { NextRequest, NextResponse } from "next/server";
import { createSupportTicket } from "../../../../lib/support/tickets";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

function getClientId(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const existing = rateLimitStore.get(clientId);

  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(clientId, { count: 1, windowStart: now });
    return false;
  }

  existing.count += 1;
  rateLimitStore.set(clientId, existing);
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  const clientId = getClientId(req);

  if (isRateLimited(clientId)) {
    return NextResponse.json(
      { error: "Too many support requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const ticket = await createSupportTicket({
      source: "contact_form",
      name: body?.name,
      email: body?.email,
      phone: body?.phone,
      message: body?.message,
      metadata: {
        channel: "public_contact_form",
      },
    });

    return NextResponse.json({
      message: "Your request has been submitted successfully.",
      ticketId: ticket.ticketId,
      createdAt: ticket.createdAt,
      deliveryMethod: ticket.deliveryMethod,
      waMeLink: ticket.waMeLink,
      deliveryError: ticket.deliveryError,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    const normalized = message.toLowerCase();
    const status =
      normalized.includes("required") ||
      normalized.includes("invalid") ||
      normalized.includes("short") ||
      normalized.includes("long")
        ? 400
        : normalized.includes("termii") ||
            normalized.includes("device not found") ||
            normalized.includes("whatsapp")
          ? 502
        : normalized.includes("too many")
          ? 429
          : 500;

    return NextResponse.json(
      {
        error:
          status === 500
            ? "Unable to submit your request right now. Please try again shortly."
            : message,
      },
      { status }
    );
  }
}
