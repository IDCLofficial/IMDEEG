import { NextRequest, NextResponse } from "next/server";
import { generateSupportReply, validateChatMessages } from "../../../../lib/chatbot/service";
import {
    classifySupportTicketIntent,
    createSupportTicket,
    extractContactFromText,
} from "../../../../lib/support/tickets";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const TICKET_THROTTLE_WINDOW_MS = 10 * 60_000;

const rateLimitStore = new Map<string, { count: number; windowStart: number }>();
const ticketThrottleStore = new Map<string, {
    lastCreatedAt: number;
    signature: string;
    ticketId: string;
    waMeLink?: string;
    deliveryMethod: "termii" | "wa_me_link";
}>();

function createTicketSignature(message: string, reason: "public_request" | "complex_issue"): string {
    return `${reason}:${message
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180)}`;
}

function getThrottledTicket(clientId: string, signature: string): {
    ticketId: string;
    waMeLink?: string;
    deliveryMethod: "termii" | "wa_me_link";
} | null {
    const entry = ticketThrottleStore.get(clientId);
    if (!entry) {
        return null;
    }

    const isExpired = Date.now() - entry.lastCreatedAt > TICKET_THROTTLE_WINDOW_MS;
    if (isExpired) {
        ticketThrottleStore.delete(clientId);
        return null;
    }

    if (entry.signature !== signature) {
        return null;
    }

    return {
        ticketId: entry.ticketId,
        waMeLink: entry.waMeLink,
        deliveryMethod: entry.deliveryMethod,
    };
}

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
            { error: "Too many chat requests. Please wait a minute and try again." },
            { status: 429 }
        );
    }

    try {
        const body = await req.json();
        const messages = validateChatMessages(body?.messages);

        const latestUserMessage = messages[messages.length - 1];
        const ticketIntent = classifySupportTicketIntent(latestUserMessage.content);

        if (ticketIntent.shouldCreateTicket) {
            const signature = createTicketSignature(latestUserMessage.content, ticketIntent.reason);
            const throttled = getThrottledTicket(clientId, signature);

            if (throttled) {
                if (throttled.deliveryMethod === "termii") {
                    return NextResponse.json({
                        reply: `A support ticket for this issue was already created recently. Your ticket ID is ${throttled.ticketId}. Please use that for follow-up.`,
                    });
                }

                return NextResponse.json({
                    reply: `A support ticket for this issue was already created recently. Your ticket ID is ${throttled.ticketId}. Please send it via WhatsApp here: ${throttled.waMeLink}.`,
                });
            }

            try {
                const contact = extractContactFromText(latestUserMessage.content);
                const ticket = await createSupportTicket({
                    source: "chat_assistant",
                    email: contact.email,
                    phone: contact.phone,
                    message: latestUserMessage.content,
                    metadata: {
                        channel: "website_chatbot",
                        clientId,
                        triggerReason: ticketIntent.reason,
                    },
                });

                ticketThrottleStore.set(clientId, {
                    lastCreatedAt: Date.now(),
                    signature,
                    ticketId: ticket.ticketId,
                    waMeLink: ticket.waMeLink,
                    deliveryMethod: ticket.deliveryMethod,
                });

                if (ticket.deliveryMethod === "termii") {
                    return NextResponse.json({
                        reply: `I have created a support ticket for your public request and sent it to the ministry via WhatsApp. Your ticket ID is ${ticket.ticketId}. Please keep this ID for follow-up.`,
                    });
                }

                return NextResponse.json({
                    reply: `I created a support ticket for your public request. Termii delivery is unavailable right now, so please tap this link to send it via WhatsApp: ${ticket.waMeLink} . Your ticket ID is ${ticket.ticketId}.`,
                });
            } catch {
                return NextResponse.json({
                    reply: "I understand this is a public request, but I could not submit a ticket right now. Please use the Contact Us form and try again in a moment.",
                });
            }
        }

        const reply = await generateSupportReply(messages);

        return NextResponse.json({ reply });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown server error";
        const status = message.toLowerCase().includes("invalid request") || message.toLowerCase().includes("latest message")
            ? 400
            : message.toLowerCase().includes("too many requests")
                ? 429
                : 500;

        return NextResponse.json(
            {
                error:
                    status === 500
                        ? "Chat service is currently unavailable. Please try again shortly."
                        : message,
            },
            { status }
        );
    }
}