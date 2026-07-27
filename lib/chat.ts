export type ClientChatMessage = {
    role: "user" | "assistant";
    content: string;
};

type ChatApiResponse = {
    reply?: string;
    error?: string;
};

export async function chat(messages: ClientChatMessage[]): Promise<string> {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
    });

    const data = (await response.json()) as ChatApiResponse;

    if (!response.ok) {
        throw new Error(data.error || "Unable to get response from chatbot.");
    }

    return data.reply || "No response generated.";
}
