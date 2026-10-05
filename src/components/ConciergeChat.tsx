'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  ShieldCheck,
} from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function ConciergeChat() {
  const { isChatbotOpen, setIsChatbotOpen } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hello! Welcome to SEFRON Tech. How may I help you with product specs, order tracking, or warranty support today?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'Track my order',
    'GaN charger compatibility',
    'AirPods warranty details',
    'Return policy',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      let reply = 'Thank you for reaching out. Our support specialists are available 24/7 to assist with your order.';
      const lower = text.toLowerCase();

      if (lower.includes('track') || lower.includes('order')) {
        reply = 'You can track your order using the tracking number sent to your email (e.g. SFN-IND-XXXXXX) or check your order status directly in your order confirmation invoice.';
      } else if (lower.includes('gan') || lower.includes('charger')) {
        reply = 'Our GaN fast wall chargers support USB-PD 3.0 / PPS and will charge iPhones, Samsung Galaxy phones, iPads, and MacBooks at maximum certified speeds.';
      } else if (lower.includes('airpods') || lower.includes('earbuds') || lower.includes('audio')) {
        reply = 'All AirPods and audio gear sold on SEFRON Tech are 100% brand new, authentic manufacturer sealed units with 1-Year official warranty.';
      } else if (lower.includes('warranty') || lower.includes('return')) {
        reply = 'We provide an unconditional 1-Year Hardware Replacement Guarantee along with a 7-day hassle-free doorstep return policy.';
      }

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <aside className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="relative w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:scale-105 transition-all"
          aria-label="Toggle Concierge Chat"
        >
          {isChatbotOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
        </button>
      </aside>

      {/* Interactive Chat Window */}
      {isChatbotOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[380px] h-[500px] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm font-['Outfit']">SEFRON Support</span>
                <span className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Concierge Online
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChatbotOpen(false)}
              className="p-1 rounded-full text-blue-100 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Questions & Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-[10px] font-semibold whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
