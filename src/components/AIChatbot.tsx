import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
  ExternalLink,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Zap,
  PhoneCall
} from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { sendChatMessageToAI } from '../services/aiChatService';
import { ChatMessage, SiteSettings } from '../types';

interface AIChatbotProps {
  settings: SiteSettings;
  onNavigate: (tab: string, slug?: string) => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ settings, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(DatabaseStore.getChatMessages());
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    DatabaseStore.saveChatMessage(userMsg);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiReply = await sendChatMessageToAI(text, newHistory);
      setMessages(prev => [...prev, aiReply]);
      DatabaseStore.saveChatMessage(aiReply);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    DatabaseStore.clearChat();
    const welcome = DatabaseStore.getChatMessages();
    setMessages(welcome);
  };

  const handleActionClick = (action: string, payload?: string) => {
    if (action === 'navigate' && payload) {
      const cleanPath = payload.replace(/^\//, '');
      const parts = cleanPath.split('/');
      if (parts.length > 1) {
        onNavigate(parts[0], parts[1]);
      } else {
        onNavigate(parts[0]);
      }
      setIsOpen(false);
    } else if (action === 'whatsapp') {
      const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
        "Hello SK Yadav, I was chatting with SK Assistant on your portfolio and would like to discuss a project."
      )}`;
      window.open(url, '_blank');
    } else if (action === 'email') {
      window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent("Project Inquiry via SK Assistant")}`;
    }
  };

  const suggestedQuestions = [
    'Can you build an e-commerce website?',
    'Tell me about the VicharManch project',
    'What are your pricing guidelines?',
    'How do we start a project together?',
    'Are you available for freelance work?'
  ];

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          id="ai-chatbot-trigger"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Chat with SK Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-600" />
          </div>
          <span className="text-sm font-medium pr-1">Ask SK Assistant</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          id="ai-chatbot-window"
          className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col bg-slate-900 border border-slate-800 text-slate-100 ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60 rounded-t-3xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-display">SK Assistant</h4>
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Powered by Gemini & Portfolio Live Context</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Clear Chat"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Collapse' : 'Expand'}
                aria-label="Toggle Expand"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Close"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.map((msg, i) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id || i}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2 ${isAssistant ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isAssistant
                          ? 'bg-slate-950/80 border border-slate-800/80 text-slate-200 rounded-tl-sm'
                          : 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Action Suggestion Buttons */}
                    {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            onClick={() => handleActionClick(act.action, act.payload)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/40 text-xs text-indigo-300 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3 opacity-60" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 p-2 text-xs">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex gap-1 items-center bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-400 ml-1.5">SK Assistant is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-[11px] text-slate-300 whitespace-nowrap border border-slate-700/60 transition-colors cursor-pointer shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 rounded-b-3xl">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask about projects, rates, stacks, or request a quote..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
              <span>Direct WhatsApp: +{settings.whatsappNumber}</span>
              <button
                onClick={() => handleActionClick('whatsapp')}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <PhoneCall className="w-2.5 h-2.5" />
                <span>Chat directly with SK Yadav</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
