"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, Bot, Sparkles, AlertCircle } from "lucide-react";
import type { BranchSlug } from "./EligibilityFunnel";
import { sendMessageToGemini } from "@/app/actions/chatActions";

/* ── WHATSAPP NUMBERS PER STATE (Fallback) ──────────────────────────────────────────── */
const FALLBACK_WA_NUMBERS: Record<string, string> = {
  abuja:   "+2347078387777",
  lagos:   "+2349065652920",
  kano:    "+2348085537624",
  kwara:   "",
  yola:    "+2349136881719",
  benue:   "+2347037382530",
  ogun:    "",
  lokoja:  "",
  calabar: "",
  minna:   "+2348020772033",
  ibadan:  "+2347031631941",
  ekiti:   "",
  bauchi:  "+2349032899612",
  kaduna:  "+2348141735416",
};

interface Message {
  sender: "user" | "bot";
  text: string;
  time: string;
}

interface WhatsAppWidgetProps {
  selectedBranch?: string;
  branches?: any[];
}

export default function WhatsAppWidget({ selectedBranch = "abuja", branches = [] }: WhatsAppWidgetProps) {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [jiggle, setJiggle] = useState(false);
  const [prevBranch, setPrevBranch] = useState<string>(selectedBranch);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I'm Ada, your TrustBricks Advisor. I can help you figure out how to release up to 25% of your RSA balance for a home. Ask me anything, or connect with a human advisor on WhatsApp anytime!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Initial Widget entry delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Show welcome toast after widget appears
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowToast(true), 1200);
    const t2 = setTimeout(() => setShowToast(false), 6000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [visible]);

  // Jiggle when branch changes
  useEffect(() => {
    if (selectedBranch !== prevBranch) {
      setPrevBranch(selectedBranch);
      setJiggle(true);
      setShowToast(true);
      const t = setTimeout(() => setJiggle(false), 500);
      const t2 = setTimeout(() => setShowToast(false), 5000);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [selectedBranch, prevBranch]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = { sender: "user", text: textToSend, time: userTime };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setIsLoading(true);

    // Format history for Gemini API
    // Mapping: bot -> model, user -> user
    const chatHistory = [...messages, newMsg].map(m => ({
      role: m.sender === "bot" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.text }]
    }));

    const result = await sendMessageToGemini(chatHistory);
    
    const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, {
      sender: "bot",
      text: result.text,
      time: botTime
    }]);
    setIsLoading(false);
  };

  const currentBranch = branches.find(b => (b.id || b.slug) === selectedBranch) || branches[0];
  const cityName = currentBranch?.city || "Head";

  const getWhatsAppURL = () => {
    const number = currentBranch?.whatsapp?.replace(/[^0-9]/g, '') || "2348030000000";
    // Generate a beautiful summarized transcript to pass to WhatsApp
    const transcript = messages
      .map(m => `${m.sender === "user" ? "Me" : "Ada"}: ${m.text}`)
      .join("\n\n");
    
    const intro = `Hi! I was just chatting with Ada on your site about the PenCom mortgage scheme. Here is our conversation:\n\n${transcript}\n\nCan I speak with a live officer to continue?`;
    return `https://wa.me/${number}?text=${encodeURIComponent(intro)}`;
  };

  const quickReplies = [
    "Am I eligible?",
    "How to release 25% RSA?",
    "Which PFAs are supported?",
  ];

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-3 font-sans">
          
          {/* ── CHATBOX WINDOW ── */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-[90vw] sm:w-[400px] h-[550px] rounded-3xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-[0_20px_50px_rgba(16,25,43,0.15)] flex flex-col overflow-hidden relative"
              >
                {/* Custom Gradient Background glow inside chat */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--color-clay-500)]/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="bg-[var(--color-ink-700)] p-4 text-white flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-ink-600)] flex items-center justify-center border border-white/10">
                        <Bot className="w-5 h-5 text-[var(--color-clay-500)]" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--color-moss)] border-2 border-[var(--color-ink-700)] rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                        Ada <span className="text-[10px] bg-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] px-2 py-0.5 rounded-full font-black uppercase">AI Advisor - {cityName}</span>
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-muted)]">TrustBricks Mortgage Assistant</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-[var(--color-card)]/10 transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5 text-[var(--color-text-muted)] hover:text-white" />
                  </button>
                </div>

                {/* Messages Box */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-mortar-50)]/60">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          msg.sender === "user"
                            ? "bg-[var(--color-ink-700)] text-white rounded-tr-none"
                            : "bg-[var(--color-card)] text-[var(--color-text-heading)] border border-[var(--color-border)] rounded-tl-none"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <span className={`block text-[9px] mt-1 text-right ${msg.sender === "user" ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[var(--color-mortar-400)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-[var(--color-mortar-400)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-[var(--color-mortar-400)] rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick replies */}
                <div className="p-2 bg-[var(--color-mortar-50)] border-t border-[var(--color-border)] flex gap-2 overflow-x-auto scrollbar-none z-10">
                  {quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(reply)}
                      className="whitespace-nowrap px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full text-xs font-bold text-[var(--color-text-body)] hover:border-[var(--color-clay-500)] hover:text-[var(--color-clay-500)] transition-all shadow-sm"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Bottom Input Area */}
                <div className="p-3 bg-[var(--color-card)] border-t border-[var(--color-border)] flex flex-col gap-2.5 z-10">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-clay-500)] text-base text-[var(--color-text-heading)] bg-[var(--color-mortar-50)]/60"
                    />
                    <button
                      onClick={() => handleSendMessage(inputText)}
                      className="p-2.5 bg-[var(--color-ink-700)] hover:bg-[var(--color-clay-500)] text-white rounded-xl transition-colors shadow-sm"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Route to WhatsApp Banner */}
                  <a
                    href={getWhatsAppURL()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors tracking-wide uppercase"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                    Continue with Advisor on WhatsApp
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── TOAST NOTIFICATION ── */}
          <AnimatePresence>
            {showToast && !isOpen && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, x: 20, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                onClick={() => { setIsOpen(true); setShowToast(false); }}
                className="max-w-[240px] rounded-2xl px-4 py-3 text-sm shadow-xl cursor-pointer hover:shadow-2xl transition-shadow bg-[var(--color-card)] border border-[var(--color-border)]"
              >
                <p className="font-bold text-xs mb-0.5 text-[var(--color-text-heading)] flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-[var(--color-clay-500)]" />
                  Chat Customer Service
                </p>
                <a
                  href={`https://wa.me/${branches.find(b => b.slug === selectedBranch)?.whatsapp || "+2348030000000"}?text=${encodeURIComponent(
                    "Hello TrustBricks! I am interested in the PenCom RSA mortgage."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--color-text-muted)] leading-normal hover:text-[var(--color-clay-500)] transition-colors"
                >
                  Ask me anything about PenCom RSA mortgages!
                </a>
                {/* Triangle */}
                <div aria-hidden="true" className="absolute -bottom-2 right-[26px] w-4 h-2 overflow-hidden">
                  <div className="w-3 h-3 rotate-45 translate-x-0.5 -translate-y-1.5 border-r border-b bg-[var(--color-card)] border-[var(--color-border)]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── MAIN FLOATING ACTION BUTTON ── */}
          {!isOpen && (
            <motion.button
              key="chat-button"
              onClick={() => setIsOpen(true)}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                jiggle
                  ? {
                      scale: 1,
                      opacity: 1,
                      rotate: [0, -8, 8, -5, 5, 0],
                      transition: { rotate: { duration: 0.45, ease: "easeInOut" } },
                    }
                  : { scale: 1, opacity: 1 }
              }
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl relative"
              style={{
                backgroundColor: "var(--color-ink-700)",
                boxShadow: "0 8px 32px rgba(16,25,43,0.3)",
                border: "2px solid rgba(184,80,46,0.3)",
              }}
              aria-label="Open AI Advisor Chat"
            >
              {/* Outer pulsing ring */}
              <span className="absolute inset-0 rounded-full border border-[var(--color-clay-500)]/45 animate-ping opacity-75" />
              
              <MessageSquare className="w-6 h-6 text-white" />
              
              {/* Mini brand indicator logo */}
              <div className="absolute -top-1 -right-1 bg-[#25D366] p-1 rounded-full border-2 border-[var(--color-ink-700)]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </div>
            </motion.button>
          )}

        </div>
      )}
    </AnimatePresence>
  );
}
