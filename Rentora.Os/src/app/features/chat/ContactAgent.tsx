import { useRef, useState } from "react";
import { Phone, Send } from "lucide-react";
import { BackButton, GlassCard } from "@/app/components";
import type { ChatMessage, NavState } from "@/app/types";

export function ContactAgent({ onNav }: { onNav: (nav: NavState) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "agent", text: "Hello! I'm Amara, your dedicated property manager for Skyline Apartments. How can I help you today?", time: "10:02 AM" },
    { id: "2", sender: "me", text: "Hi Amara! I wanted to follow up on my kitchen faucet leak report.", time: "10:05 AM" },
    { id: "3", sender: "agent", text: "Hi! I checked with the team — a plumber has been scheduled for tomorrow between 9 AM and 12 PM. You'll receive an SMS confirmation shortly.", time: "10:07 AM" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = { id: Date.now().toString(), sender: "me", text: input.trim(), time: "Now" };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now().toString() + "r", sender: "agent", text: "Thanks for reaching out! I'll look into that and get back to you shortly.", time: "Now" }]);
    }, 1200);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col" style={{ height: "calc(100vh - 80px)" }}>
      <BackButton onBack={() => onNav({ page: "dashboard" })} />

      {/* Agent Card */}
      <GlassCard className="p-5 mb-5 flex items-center gap-4 flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(147,51,234,0.3)]">
          AO
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white/90">Amara Osei</p>
          <p className="text-xs text-white/50">Property Manager · Skyline Apartments</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]" />
          <span className="text-xs text-teal-400">Online</span>
        </div>
        <a href="tel:+254712345678" className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-colors">
          <Phone className="w-4 h-4 text-white/60" />
        </a>
      </GlassCard>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "agent" && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                AO
              </div>
            )}
            <div className={`max-w-[75%] ${msg.sender === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "me"
                  ? "bg-gradient-to-br from-blue-500/80 to-purple-600/80 text-white rounded-br-sm"
                  : "bg-white/[0.05] border border-white/[0.08] text-white/90 rounded-bl-sm"
              }`}>
                {msg.text}
              </div>
              <span className="text-xs text-white/30 px-1">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-4 border-t border-white/[0.05]">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-110 active:scale-95 transition-transform disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </main>
  );
}
