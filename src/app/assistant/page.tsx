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

  useEffect(() => {
    const initialWelcome: ChatMessage = {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      content: `Namaste! I am your **DukaanAI Business Assistant** for **${dataset.storeName}**.\n\nI have analyzed your **${daysInPeriod} days of store transactions** (${startDate} to ${endDate}) across all **${dataset.products.length} products** and **${dataset.customers.length} buyers**.\n\nEvery answer is computed directly from your store records—zero hallucinated or guessed metrics. How can I help you grow your business today?`,
      groundedFacts: [
        { label: 'Store', value: dataset.storeName },
        { label: 'Time Window', value: `${startDate} to ${endDate}` },
        { label: 'Products Catalogued', value: `${dataset.products.length} Items` },
        { label: 'Orders Analyzed', value: `${dataset.orders.length}` },
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
    'What should I restock today?',
    'Which products generate the highest profit?',
    'Which customers have stopped returning?',
    'Which products are often bought together?',
    'Is offering a discount on oil a good idea?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-9.5rem)] bg-white rounded-[24px] border border-[#EBEBEF] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[#18181B] text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 text-[#FDE047] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold tracking-tight text-white">
                DukaanAI Business Assistant
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-[#10B981] border border-emerald-500/30 px-2 py-0.2 rounded-full font-semibold">
                Grounded Engine
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">
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
          className="text-[12px] text-zinc-400 hover:text-white flex items-center gap-1.5 font-medium hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-[#F9F9FB]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 max-w-3xl ${msg.sender === 'user' ? 'ml-auto justify-end' : ''}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`rounded-[20px] p-5 text-[13px] sm:text-[14px] space-y-3 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#18181B] text-white rounded-tr-xs'
                  : 'bg-white text-[#18181B] border border-[#EBEBEF] rounded-tl-xs'
              }`}
            >
              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

              {/* Grounded Fact Cards */}
              {msg.groundedFacts && msg.groundedFacts.length > 0 && (
                <div className="pt-2 border-t border-[#EBEBEF]">
                  <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    Verified Store Calculation Points:
                  </p>
                  <div className="grid grid-cols-2 gap-2 bg-[#F9F9FB] p-3 rounded-xl border border-[#EBEBEF]">
                    {msg.groundedFacts.map((fact, idx) => (
                      <div key={idx} className="text-[12px]">
                        <span className="text-[#71717A] font-medium">{fact.label}: </span>
                        <span className="font-bold text-[#18181B]">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up question suggestion chips */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 border-t border-[#EBEBEF] space-y-1.5">
                  <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">
                    Suggested Next Questions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-left text-[12px] font-semibold bg-[#F4F4F6] hover:bg-[#EBEBEF] text-[#18181B] border border-[#EBEBEF] px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                      >
                        <span>{q}</span>
                        <ArrowRight className="w-3 h-3 text-[#71717A]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Model & Timestamp Badge */}
              <div className="flex items-center justify-between text-[11px] text-[#A1A1AA] pt-1">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <span className="flex items-center gap-1 font-medium">
                    {msg.isFallback ? (
                      <span className="text-[#D97706] bg-[#FFFBEB] border border-[#FEF3C7] px-2 py-0.5 rounded-full">
                        Deterministic Grounded Engine
                      </span>
                    ) : (
                      <span className="text-[#059669] bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 rounded-full">
                        Gemini 3.6 Flash
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#EBEBEF] rounded-[20px] rounded-tl-xs p-4 flex items-center gap-2.5 text-[13px] text-[#71717A] font-medium">
              <div className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse"></div>
              <span>Querying store records and formulating grounded answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Quick Chips Bar */}
      <div className="px-5 py-2.5 bg-white border-t border-[#EBEBEF] flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider shrink-0 mr-1">
          Quick Prompts:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-[12px] font-semibold bg-[#F4F4F6] hover:bg-[#EBEBEF] text-[#18181B] border border-[#EBEBEF] px-3.5 py-1 rounded-full whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-[#EBEBEF] shrink-0">
        <div className="flex items-center gap-2 bg-[#F4F4F6] border border-[#EBEBEF] rounded-full px-4 py-1.5 focus-within:border-[#18181B] transition-colors">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask anything about sales, low stock, profits, discounts, or what to do today..."
            className="flex-1 bg-transparent text-[13px] sm:text-[14px] text-[#18181B] placeholder-[#A1A1AA] focus:outline-hidden py-1.5 font-medium"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputQuery.trim()}
            className="w-8 h-8 rounded-full bg-[#18181B] hover:bg-black text-white flex items-center justify-center disabled:opacity-30 transition-colors"
            aria-label="Send Query"
          >
            <Send className="w-3.5 h-3.5" />
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
        <div className="h-64 flex items-center justify-center text-[#71717A] text-sm font-medium">
          Loading DukaanAI Business Assistant...
        </div>
      }
    >
      <AssistantChatComponent />
    </Suspense>
  );
}
