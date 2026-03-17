'use client';

import { useState, useRef, useEffect } from 'react';
import { cn, getThemeClasses } from '@/lib/utils';
import { Send, Bot, User, RefreshCw, X, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface NovaWidgetProps {
  theme: 'dark' | 'light';
  sessionId?: string;
  compact?: boolean;
}

export default function NovaWidget({ theme, sessionId = 'main', compact = false }: NovaWidgetProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isOpen, setIsOpen] = useState(!compact);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, sessionId }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'No response received.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Failed to reach Nova. Gateway may be offline.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Compact floating widget
  if (compact && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-violet-600 hover:bg-violet-700 rounded-full flex items-center justify-center shadow-lg z-40 transition-colors"
      >
        <MessageSquare className="w-5 h-5 text-white" />
      </button>
    );
  }

  if (compact && isOpen) {
    return (
      <div className={cn(
        "fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] rounded-xl border shadow-2xl z-40 flex flex-col overflow-hidden",
        classes.card
      )}>
        {/* Header */}
        <div className={cn("flex items-center justify-between px-4 py-3 border-b", classes.divider)}>
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-400" />
            <span className={cn("text-sm font-semibold", classes.heading)}>Chat with Nova</span>
          </div>
          <button onClick={() => setIsOpen(false)} className={cn("p-1 rounded", classes.hover)}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.length === 0 && (
            <p className={cn("text-xs text-center py-8", classes.muted)}>Send a message to start chatting with Nova</p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <span className="shrink-0 mt-0.5"><Bot className="w-3.5 h-3.5 text-violet-400" /></span>
              )}
              <div className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 text-xs",
                msg.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : isDark ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-800'
              )}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <span className="shrink-0 mt-0.5"><User className="w-3.5 h-3.5 text-neutral-400" /></span>
              )}
            </div>
          ))}
          {sending && (
            <div className="flex gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-500 mt-0.5" />
              <span className={cn("text-xs", classes.muted)}>Nova is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <div className={cn("p-3 border-t", classes.divider)}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Nova..."
              className={cn("flex-1 text-xs rounded-lg px-3 py-2 outline-none", classes.input)}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg px-3 py-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full (non-compact) mode
  return (
    <div className={cn("rounded-xl border flex flex-col h-[60vh]", classes.card)}>
      <div className={cn("px-4 py-3 border-b", classes.divider)}>
        <h3 className={cn("text-sm font-semibold flex items-center gap-2", classes.heading)}>
          <Bot className="w-4 h-4 text-violet-400" /> Chat with Nova
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className={cn("text-sm text-center py-8", classes.muted)}>Send a message to start chatting with Nova</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <span className="shrink-0 mt-0.5"><Bot className="w-4 h-4 text-violet-400" /></span>
            )}
            <div className={cn(
              "max-w-[75%] rounded-lg px-4 py-2.5 text-sm",
              msg.role === 'user'
                ? 'bg-violet-600 text-white'
                : isDark ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-800'
            )}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <span className="shrink-0 mt-0.5"><User className="w-4 h-4 text-neutral-400" /></span>
            )}
          </div>
        ))}
        {sending && (
          <div className="flex gap-3">
            <RefreshCw className="w-4 h-4 animate-spin text-neutral-500 mt-0.5" />
            <span className={cn("text-sm", classes.muted)}>Nova is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={cn("p-4 border-t", classes.divider)}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Nova..."
            className={cn("flex-1 text-sm rounded-lg px-4 py-2.5 outline-none", classes.input)}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg px-4 py-2.5 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
