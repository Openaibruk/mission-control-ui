'use client';

import { MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackButtonProps {
  onClick: () => void;
  theme: 'dark' | 'light';
}

export default function FeedbackButton({ onClick, theme }: FeedbackButtonProps) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-md transition-colors border",
        isDark
          ? "border-neutral-700 hover:bg-white/5 text-neutral-300"
          : "border-neutral-300 hover:bg-neutral-50 text-neutral-600"
      )}
    >
      <MessageSquarePlus className="w-3.5 h-3.5" />
      <span>Feedback</span>
    </button>
  );
}
