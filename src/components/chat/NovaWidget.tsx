'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { cn, getAvatar } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Send, MessageCircle } from 'lucide-react';

interface ChatMessage {
  agent: string;
  text: string;
}

interface NovaWidgetProps {
  theme: 'dark' | 'light';
}

export function NovaWidget({ theme }: NovaWidgetProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamingText, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const clearChat = () => {
    setChatHistory([]);
    setStreamingText('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || typing) return;

    const userMessage = message.trim();
    setMessage('');
    setTyping(true);
    setStreamingText('');

    // Add user message to chat
    setChatHistory(prev => [...prev, { agent: 'Bruk', text: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText = data.text;
                setStreamingText(fullText);
              }
              if (data.done) {
                setChatHistory(prev => [...prev, { agent: 'Nova', text: fullText }]);
                setStreamingText('');
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatHistory(prev => [...prev, { agent: 'Nova', text: 'Sorry, something went wrong.' }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className={cn(
          "mb-3 md:mb-4 w-[280px] sm:w-[320px] md:w-[360px] h-[340px] sm:h-[400px] md:h-[460px] flex flex-col shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-200",
          classes.card
        )}>
          {/* Header */}
          <div className={cn("px-4 py-3 border-b flex items-center justify-between shrink-0", classes.divider)}>
            <div className="flex items-center space-x-2">
              <img 
                src={getAvatar('Nova')} 
                alt="Nova"
                className="w-6 h-6 rounded-full" 
              />
              <span className={cn("text-[13px] font-semibold", classes.heading)}>Nova</span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={clearChat}
                className={cn(
                  "p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[28px] min-h-[28px] flex items-center justify-center transition-colors",
                  classes.muted
                )}
                title="Clear chat"
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className={cn(
                  "p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[28px] min-h-[28px] flex items-center justify-center transition-colors",
                  classes.muted
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
            {chatHistory.length === 0 && !typing && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className={cn("w-8 h-8 mb-2", classes.muted)} />
                <p className={cn("text-[12px]", classes.muted)}>
                  Hi! I&apos;m Nova. Ask me to create tasks, check stats, or help with your workflow.
                </p>
              </div>
            )}

            {chatHistory.map((msg, idx) => {
              const isUser = msg.agent === 'Bruk';
              return (
                <div 
                  key={idx} 
                  className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
                >
                  <span className={cn("text-[9px] font-medium mb-1", isUser ? "text-violet-400" : "text-emerald-500")}>
                    {isUser ? 'You' : msg.agent}
                  </span>
                  <div className={cn(
                    "px-3 py-2 rounded-xl max-w-[85%] text-[12px]",
                    isUser 
                      ? "bg-violet-600 text-white rounded-tr-none" 
                      : isDark 
                        ? "bg-neutral-800 text-neutral-200 rounded-tl-none" 
                        : "bg-neutral-100 text-neutral-800 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {(typing || streamingText) && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-medium mb-1 text-emerald-500">Nova</span>
                <div className={cn(
                  "px-3 py-2 rounded-xl max-w-[85%] text-[12px]",
                  isDark 
                    ? "bg-neutral-800 text-neutral-200 rounded-tl-none" 
                    : "bg-neutral-100 text-neutral-800 rounded-tl-none"
                )}>
                  {streamingText ? (
                    <span className="text-emerald-400">
                      {streamingText}
                      <span className="animate-pulse">▊</span>
                    </span>
                  ) : (
                    <span className="text-emerald-400">
                      typing
                      <span className="animate-pulse">...</span>
                    </span>
                  )}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className={cn("p-3 border-t shrink-0", classes.divider)}>
            <form onSubmit={handleSubmit} className="flex items-center relative">
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Talk to Nova..."
                disabled={typing}
                className={cn(
                  "w-full rounded-md pl-4 pr-10 py-2.5 text-[12px] outline-none transition-colors",
                  classes.inputBg,
                  typing && "opacity-50"
                )}
              />
              <button 
                type="submit" 
                disabled={!message.trim() || typing}
                className="absolute right-2 text-violet-500 hover:text-violet-400 disabled:opacity-50 disabled:cursor-not-allowed min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform min-w-[48px] min-h-[48px]"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-5 md:w-6 h-5 md:h-6 text-white" />
        ) : (
          <MessageCircle className="w-5 md:w-6 h-5 md:h-6 text-white" />
        )}
      </button>
    </div>
  );
}