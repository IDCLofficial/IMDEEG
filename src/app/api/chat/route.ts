import { NextRequest, NextResponse } from "next/server";
import { generateSupportReply, validateChatMessages } from "../../../../lib/chatbot/service";
import {
    classifySupportTicketIntent,
    createSupportTicket,
    extractContactFromText,
} from "../../../../lib/support/tickets";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

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
            const triggerReason = ticketIntent.reason === "public_request" ? "public_request" : "complex_issue";

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
                        triggerReason,
                    },
                });

                return NextResponse.json({
                    reply: `I have created a support ticket for your request. Ticket ID: ${ticket.ticketId}. The ministry has been emailed and will respond to ${ticket.email || "the email you provided"} at info@mdeeg.im.gov.ng. Please keep the ticket ID for reference.`,
                    ticketId: ticket.ticketId,
                    deliveryMethod: ticket.deliveryMethod,
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