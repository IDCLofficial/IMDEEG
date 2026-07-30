export type ClientChatMessage = {
    role: "user" | "assistant";
    content: string;
};

type ChatApiResponse = {
    reply?: string;
    error?: string;
};

type ChatOptions = {
    signal?: AbortSignal;
};

export async function chat(messages: ClientChatMessage[], options?: ChatOptions): Promise<string> {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        signal: options?.signal,
    });

    const data = (await response.json()) as ChatApiResponse;

    if (!response.ok) {
        throw new Error(data.error || "Unable to get response from chatbot.");
    }

    return data.reply || "No response generated.";
}
