'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Info,
  Calendar,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ChatMessage } from '@/types';
import { resolveDateRange } from '@/lib/analytics/engine';

function AssistantChatComponent() {
  const searchParams = useSearchParams();
  const { dataset, timeRange } = useStore();
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { startDate, endDate, daysInPeriod } = resolveDateRange(dataset.orders, timeRange);

  // Initialize with welcoming grounded greeting
  useEffect(() => {
    const initialWelcome: ChatMessage = {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      content: `Namaste! I am your **DukaanAI Business Assistant** for **${dataset.storeName}**.\n\nI have analyzed your **${daysInPeriod} days of store transactions** (${startDate} to ${endDate}) across all **${dataset.products.length} products** and **${dataset.customers.length} buyers**.\n\nEvery answer I give is computed directly from your store data—no guessed or made-up numbers. How can I help you grow your shop today?`,
      groundedFacts: [
        { label: 'Store', value: dataset.storeName },
        { label: 'Time Window', value: `${startDate} to ${endDate}` },
        { label: 'Products', value: `${dataset.products.length} Items` },
        { label: 'Total Orders', value: `${dataset.orders.length}` },
      ],
      suggestedFollowUps: [
        'Why are my sales lower this week?',
        'What should I restock today?',
        'Which products give the highest profit?',
        'Is offering a discount on oil a good idea?',
      ],
      isFallback: false,
    };
    setMessages([initialWelcome]);

    // Check if query was passed in URL params
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [dataset, timeRange, searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          timeRange,
          customDataset: dataset,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI assistant');
      }

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        content: `I encountered an unexpected issue processing that question. Please try asking again or check your data filters.`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        isFallback: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sampleQuestions = [
    'Why are my sales lower this week?',
    'Which products should I restock?',
    'What should I focus on today?',
    'Which products generate the highest profit?',
    'Which customers have stopped returning?',
    'Which products are often bought together?',
    'Is offering a discount on oil a good idea?',
    'Show me products with falling sales.',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Chat Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-white">DukaanAI Business Assistant</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                Grounded Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Analyzing: {startDate} to {endDate} • {dataset.storeName}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const initialWelcome: ChatMessage = {
              id: `msg-${Date.now()}`,
              sender: 'assistant',
              timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              content: `Chat session reset. You are exploring **${dataset.storeName}** data for the last **${daysInPeriod} days**. What would you like to know?`,
              suggestedFollowUps: [
                'Why did my sales decline?',
                'Which products should I restock today?',
                'What should I focus on today?',
              ],
            };
            setMessages([initialWelcome]);
          }}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1 hover:underline"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto justify-end' : ''}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm space-y-3 leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
              }`}
            >
              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

              {/* Grounded Fact Cards */}
              {msg.groundedFacts && msg.groundedFacts.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Store Calculation Points:
                  </p>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {msg.groundedFacts.map((fact, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="text-slate-500 font-medium">{fact.label}: </span>
                        <span className="font-bold text-slate-900">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up question suggestion chips */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Suggested Next Questions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-left text-[11px] bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 hover:border-sky-300 px-2.5 py-1 rounded-md transition-all flex items-center gap-1"
                      >
                        <span>{q}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-sky-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Model & Timestamp Badge */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <span className="flex items-center gap-1">
                    {msg.isFallback ? (
                      <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-mono">
                        Deterministic Grounded Engine (Offline)
                      </span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                        Gemini 2.5 Flash Grounded
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
              <span>Querying authoritative analytics engine and formulating grounded answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Quick Chips Bar */}
      <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Quick Prompts:
        </span>
        {sampleQuestions.slice(0, 5).map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-[11px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-all shadow-2xs hover:border-slate-300 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-transparent transition-all">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask anything about sales, low stock, profits, discounts, or what to do today..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden py-1.5"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputQuery.trim()}
            className="p-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-40 disabled:hover:bg-sky-600 transition-all shadow-xs"
            aria-label="Send Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          Loading DukaanAI Business Assistant...
        </div>
      }
    >
      <AssistantChatComponent />
    </Suspense>
  );
}
