export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  messages: ChatMessage[];
}

export interface ChatResponseBody {
  reply: string;
}

export interface AIProviderRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface AIProviderResult {
  reply: string;
}

export interface AIProvider {
  createCompletion(input: AIProviderRequest): Promise<AIProviderResult>;
}
