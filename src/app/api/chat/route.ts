import { NextRequest, NextResponse } from "next/server";
import { generateSupportReply, validateChatMessages } from "../../../../lib/chatbot/service";

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