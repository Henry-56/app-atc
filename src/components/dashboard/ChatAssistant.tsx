'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/data-store';
import { getAssistantResponse } from '@/lib/intelligence-engine';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente inteligente. ¿En qué puedo ayudarte hoy con el análisis de tu tienda?' }
  ]);
  const { metrics } = useData();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAssistantResponse(userMessage, metrics);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 600);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">Store Assistant</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Sparkles size={8} /> IA Dashboard Activada
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex gap-3 max-w-[85%]",
                  m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    m.role === 'user' ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600"
                  )}>
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregunta algo sobre tu tienda..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1.5 p-1.5 bg-primary text-white rounded-xl hover:brightness-110 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
