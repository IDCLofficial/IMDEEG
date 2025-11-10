"use client"

import { MessageCircleIcon, Send, X } from "lucide-react"
import Wave from "./wave"
import { useEffect, useRef, useState } from "react"
import { chat } from "../../../lib/chat"

type ChatMessage = {
  role: "user" | "bot"
  content: string
}

export default function Chatbot() {
  const [showChatBox, setShowChatBox] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Add greeting on mount
  useEffect(() => {
    setMessages([
      { role: "bot", content: "Hi Imolite, what would you like to know?" },
    ])
  }, [])

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    if (!message.trim()) return

    // add user message
    setMessages((prev) => [...prev, { role: "user", content: message }])
    const userMessage = message
    setMessage("")

    // send to backend
    setMessages((prev) => [...prev, { role: "bot", content: "Thinking..." }])
    const response = await chat(userMessage)
    // replace the "Thinking..." placeholder with the real response
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      if (last?.role === "bot" && last.content === "Thinking...") {
        const withoutLast = prev.slice(0, -1)
        return [...withoutLast, { role: "bot", content: response }]
      }
      return [...prev, { role: "bot", content: response }]
    })

    
  }

  return (
    <div className={`fixed h-screen w-full z-70`}> 
        <div className={`overlay absolute h-screen w-full bg-black/10 z-40 transition-all duration-100 ease-in ${showChatBox ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setShowChatBox(false)}></div>  
        <div className="fixed bottom-5 right-5 z-50">
            <div className="relative flex flex-col-reverse items-end gap-2 transition-all duration-100 ease-in">
                {/* Floating button */}
                {!showChatBox && <button
                className="p-2 relative z-[50] bg-blue-600 rounded-full h-[60px] w-[60px] cursor-pointer shadow-md flex justify-center items-center active:scale-105 transition-all ease-in-out"
                onClick={() => setShowChatBox(!showChatBox)}
                >
                <MessageCircleIcon
                    className={`text-white transition-all`}
                    size={30}
                />
                </button>}

                {/* Chat window */}
                <div
                className={`h-[450px] w-[300px] flex flex-col bg-white rounded-[10px] shadow transition-all ease-in-out ${
                    showChatBox
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                >
                    <button className="p-2 absolute top-2 right-2 z-[50] bg-blue-600 rounded-full h-[40px] w-[40px] cursor-pointer shadow-md flex justify-center items-center active:scale-105 transition-all ease-in-out" onClick={() => setShowChatBox(!showChatBox)}>
                        <X className="text-white" size={30}/>
                    </button>
                {/* Header */}
                <div className="h-[30%] flex flex-col justify-end bg-blue-600 p-3 rounded-b-[10%] rounded-t-[10px]">
                    <h1 className="text-white font-bold text-2xl flex items-center gap-1">
                    Hi there! <Wave className="inline align-middle" size={32} />
                    </h1>
                    <p className="text-white">How can I help you today?</p>
                </div>

                {/* Chat body */}
                <div
                    ref={chatBodyRef}
                    id="chatBody"
                    className="flex-1 overflow-y-auto p-2 py-3 space-y-2"
                >
                    {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-lg max-w-[80%] ${
                        m.role === "user"
                            ? "bg-blue-100 self-end ml-auto"
                            : m.content === "Thinking..."
                            ? "text-gray-400 self-start animate-pulse"
                            : "bg-gray-100 self-start"
                        }`}
                    >
                        {m.content}
                    </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-2 border-t border-gray-200">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-[10px] p-2">
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        className="w-full outline-0"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        className="rounded-full cursor-pointer flex justify-center items-center active:scale-105 transition-all ease-in-out"
                        onClick={handleSend}
                    >
                        <Send size={20} />
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}
