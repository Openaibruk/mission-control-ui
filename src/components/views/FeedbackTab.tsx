'use client';

import { useState, useEffect } from 'react';
import { cn, timeAgo } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Feedback } from '@/lib/types';
import {
  MessageSquarePlus, AlertTriangle, Lightbulb, Wrench,
  Clock, ExternalLink, Loader2
} from 'lucide-react';

interface FeedbackTabProps {
  theme: 'dark' | 'light';
  limit?: number;
  onViewAll?: () => void;
}

const STATUS_BADGE = {
  pending: { label: 'Pending', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  acknowledged: { label: 'Acknowledged', color: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  project_created: { label: 'Project', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  done: { label: 'Done', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
} as const;

const CATEGORY_ICON = {
  bug: <AlertTriangle className="w-3 h-3 text-red-400" />,
  feature: <Lightbulb className="w-3 h-3 text-amber-400" />,
  improvement: <Wrench className="w-3 h-3 text-emerald-400" />,
} as const;

export default function FeedbackTab({ theme, limit = 5, onViewAll }: FeedbackTabProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/feedback');
        const data = await res.json();
        if (!cancelled) setFeedback((data.feedback || []).slice(0, limit));
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [limit]);

  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={cn("rounded-lg p-3 animate-pulse", classes.card)}>
            <div className={cn("h-3 w-2/3 rounded mb-2", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
            <div className={cn("h-2 w-1/3 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
          </div>
        ))}
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className={cn("text-center py-8", classes.muted)}>
        <MessageSquarePlus className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-xs">No feedback yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {feedback.map((item) => {
        const status = STATUS_BADGE[item.status];
        return (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              isDark ? "hover:bg-white/[0.03]" : "hover:bg-neutral-50"
            )}
          >
            {/* Category */}
            <div className="shrink-0">{CATEGORY_ICON[item.category]}</div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-medium truncate", classes.heading)}>
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn("text-[10px]", classes.subtle)}>{timeAgo(item.created_at)}</span>
              </div>
            </div>

            {/* Status badge */}
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded border shrink-0", status.color)}>
              {status.label}
            </span>
          </div>
        );
      })}

      {feedback.length >= limit && onViewAll && (
        <button
          onClick={onViewAll}
          className={cn(
            "w-full text-center text-[11px] py-2 rounded-lg transition-colors flex items-center justify-center gap-1",
            isDark ? "text-neutral-400 hover:text-neutral-300 hover:bg-white/5" : "text-neutral-500 hover:text-neutral-600 hover:bg-neutral-50"
          )}
        >
          View all feedback <ExternalLink className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
