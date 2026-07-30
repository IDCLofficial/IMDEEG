"use client";

import {
  Bot,
  Copy,
  MessageCircleIcon,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  Trash2,
  User,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHAT_SUGGESTED_PROMPTS } from "../../../lib/chatbot/config";
import { chat, type ClientChatMessage } from "../../../lib/chat";

type MessageRole = "user" | "assistant";

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    0: { transcript: string };
  }>;
};

type SpeechRecognitionErrorEventLike = {
  error?: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type WindowWithSpeechRecognition = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

type UIMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  status: "sent" | "error";
  retryPrompt?: string;
};

const STORAGE_KEY = "imdeeg.chat.session.v1";
const MAX_INPUT_LENGTH = 1000;

function nowLabel(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function createWelcomeMessage(): UIMessage {
  return {
    id: `welcome-${Date.now()}`,
    role: "assistant",
    content: "Hello, I am the IMDEEG support assistant. Ask me anything about our programs, services, or contacts.",
    createdAt: Date.now(),
    status: "sent",
  };
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([createWelcomeMessage()]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceInputSupported, setIsVoiceInputSupported] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const requestAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as UIMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      setMessages([createWelcomeMessage()]);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const speechWindow = window as WindowWithSpeechRecognition;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setIsVoiceInputSupported(false);
      return;
    }

    setIsVoiceInputSupported(true);
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-NG";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        transcript += result[0]?.transcript || "";
      }

      if (transcript.trim()) {
        setInput((prev) => `${prev}${prev ? " " : ""}${transcript.trim()}`.slice(0, MAX_INPUT_LENGTH));
      }
    };

    recognition.onerror = (event) => {
      if (event.error && event.error !== "no-speech") {
        setActiveError("Voice input failed. Please type your message.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    function onEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestAbortRef.current?.abort();
        requestAbortRef.current = null;
        setIsTyping(false);
        recognitionRef.current?.stop();
        setIsListening(false);
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setInput("");
        setMessages([]);
        setActiveError(null);
        sessionStorage.removeItem(STORAGE_KEY);
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", onEsc);
    }

    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen]);

  const conversationHistory = useMemo<ClientChatMessage[]>(() => {
    return messages
      .filter((message) => message.status === "sent")
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));
  }, [messages]);

  const copyMessage = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // Clipboard may be blocked in some browsers.
    }
  }, []);

  const speakText = useCallback((text: string) => {
    if (!isVoiceOutputEnabled || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
    utterance.lang = "en-NG";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [isVoiceOutputEnabled]);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setActiveError("Voice input is not supported on this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setActiveError(null);
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setActiveError("Could not start voice input. Please try again.");
      setIsListening(false);
    }
  }, [isListening]);

  const runPrompt = useCallback(
    async (promptText: string) => {
      const trimmed = promptText.trim();
      if (!trimmed || isTyping) {
        return;
      }

      const prompt = trimmed.slice(0, MAX_INPUT_LENGTH);
      const userMessage: UIMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: prompt,
        createdAt: Date.now(),
        status: "sent",
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);
      setActiveError(null);
      const controller = new AbortController();
      requestAbortRef.current = controller;

      try {
        const reply = await chat([...conversationHistory, { role: "user", content: prompt }], {
          signal: controller.signal,
        });
        const assistantMessage: UIMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
          createdAt: Date.now(),
          status: "sent",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        speakText(reply);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        const message = error instanceof Error ? error.message : "Unable to send message right now.";
        setActiveError(message);

        const errorMessage: UIMessage = {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: message,
          createdAt: Date.now(),
          status: "error",
          retryPrompt: prompt,
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        requestAbortRef.current = null;
        setIsTyping(false);
      }
    },
    [conversationHistory, isTyping, speakText]
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setActiveError(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleCloseChat = useCallback(() => {
    requestAbortRef.current?.abort();
    requestAbortRef.current = null;
    setIsTyping(false);

    recognitionRef.current?.stop();
    setIsListening(false);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setInput("");
    clearConversation();
    setIsOpen(false);
  }, [clearConversation]);

  const isNearEmpty = messages.length <= 1;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      <div
        className={`fixed inset-0 bg-black/20 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseChat}
        aria-hidden="true"
      />

      <div className="relative">
        <button
          type="button"
          aria-label={isOpen ? "Close support assistant" : "Open support assistant"}
          className={`h-14 w-14 md:h-16 md:w-16 rounded-full shadow-xl border border-white/30 bg-[#119156] text-white flex items-center justify-center transition-all duration-300 ${
            isOpen ? "scale-95 opacity-0 pointer-events-none" : "scale-100 opacity-100"
          }`}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircleIcon size={26} />
        </button>

        <section
          role="dialog"
          aria-label="IMDEEG support assistant"
          className={`absolute bottom-0 right-0 w-[calc(100vw-2rem)] max-w-[390px] h-[75vh] max-h-[680px] bg-white rounded-2xl border border-[#119156]/20 shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 origin-bottom-right ${
            isOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-6 scale-95 pointer-events-none"
          }`}
        >
          <header className="bg-[#119156] text-white px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">IMDEEG Support</h2>
                <p className="text-sm text-white/85">Ask about our digital programs and services.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={isVoiceOutputEnabled ? "Disable voice output" : "Enable voice output"}
                  onClick={() => setIsVoiceOutputEnabled((prev) => !prev)}
                  className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
                >
                  {isVoiceOutputEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button
                  type="button"
                  aria-label="Clear conversation"
                  onClick={clearConversation}
                  className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Close support assistant"
                  onClick={handleCloseChat}
                  className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 bg-[#F8FBF9] space-y-3">
            {isNearEmpty && (
              <div className="rounded-xl border border-[#119156]/20 bg-white p-3">
                <p className="text-sm text-gray-700 mb-3">Try one of these prompts:</p>
                <div className="flex flex-wrap gap-2">
                  {CHAT_SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => runPrompt(prompt)}
                      className="text-xs px-3 py-2 rounded-full bg-[#119156]/10 text-[#119156] hover:bg-[#119156]/20"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                Conversation is empty. Start by asking a question.
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <article key={message.id} className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="h-8 w-8 rounded-full bg-[#119156]/15 text-[#119156] flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className={`group max-w-[82%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? "bg-[#119156] text-white rounded-br-md"
                          : message.status === "error"
                            ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-md"
                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                      }`}
                    >
                      {message.content}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                      <span>{nowLabel(message.createdAt)}</span>
                      <button
                        type="button"
                        aria-label="Copy message"
                        onClick={() => copyMessage(message.content)}
                        className="opacity-70 hover:opacity-100"
                      >
                        <Copy size={12} />
                      </button>

                      {message.status === "error" && message.retryPrompt && (
                        <button
                          type="button"
                          aria-label="Retry message"
                          onClick={() => runPrompt(message.retryPrompt as string)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <RefreshCw size={12} /> Retry
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="h-8 w-8 rounded-full bg-[#119156] text-white flex items-center justify-center shrink-0 mt-1">
                      <User size={16} />
                    </div>
                  )}
                </article>
              );
            })}

            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="h-8 w-8 rounded-full bg-[#119156]/15 text-[#119156] flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-3 py-2 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#119156] animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-[#119156] animate-pulse [animation-delay:120ms]" />
                  <span className="h-2 w-2 rounded-full bg-[#119156] animate-pulse [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-gray-200 bg-white p-3">
            {activeError && (
              <p className="text-xs text-red-600 mb-2" role="status" aria-live="polite">
                {activeError}
              </p>
            )}

            {isListening && (
              <p className="text-xs text-[#119156] mb-2" role="status" aria-live="polite">
                Listening... speak your message now.
              </p>
            )}

            <div className="flex items-end gap-2 rounded-xl border border-gray-300 px-3 py-2 focus-within:border-[#119156] focus-within:ring-2 focus-within:ring-[#119156]/20">
              <textarea
                ref={inputRef}
                aria-label="Type your message"
                placeholder="Ask IMDEEG support..."
                className="w-full resize-none outline-none text-sm max-h-28"
                value={input}
                rows={1}
                maxLength={MAX_INPUT_LENGTH}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void runPrompt(input);
                  }
                }}
              />
              <button
                type="button"
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                onClick={toggleListening}
                disabled={!isVoiceInputSupported || isTyping}
                className="h-9 w-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                type="button"
                aria-label="Send message"
                onClick={() => void runPrompt(input)}
                disabled={isTyping || !input.trim()}
                className="h-9 w-9 rounded-full bg-[#119156] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
