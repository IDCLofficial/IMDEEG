import { CHAT_LIMITS, CHAT_MODEL, CHAT_SYSTEM_PROMPT } from "./config";
import { GroqProvider } from "./providers/groq";
import type { ChatMessage } from "./types";

function sanitizeInput(text: string): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role,
      content: sanitizeInput(message.content).slice(0, CHAT_LIMITS.maxMessageLength),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-CHAT_LIMITS.maxMessages);
}

export function validateChatMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) {
    throw new Error("Invalid request payload. 'messages' must be an array.");
  }

  const typedMessages = messages as ChatMessage[];
  const cleaned = sanitizeMessages(typedMessages);

  if (cleaned.length === 0) {
    throw new Error("Please enter a message to continue.");
  }

  const last = cleaned[cleaned.length - 1];
  if (last.role !== "user") {
    throw new Error("The latest message must be from the user.");
  }

  return cleaned;
}

export async function generateSupportReply(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Server is missing GROQ_API_KEY configuration.");
  }

  const provider = new GroqProvider(apiKey);
  const completion = await provider.createCompletion({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: CHAT_SYSTEM_PROMPT,
      },
      ...messages,
    ],
    maxTokens: CHAT_LIMITS.maxOutputTokens,
    temperature: CHAT_LIMITS.temperature,
    timeoutMs: CHAT_LIMITS.requestTimeoutMs,
  });

  return completion.reply;
}
