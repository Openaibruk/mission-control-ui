'use client';

import { cn, getThemeClasses, formatTimeAgo } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, AlertTriangle, Lightbulb, Wrench, RefreshCw } from 'lucide-react';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'improvement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'project_created' | 'fixed' | 'done';
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  acknowledged: { label: 'Acknowledged', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  project_created: { label: 'Project Created', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  fixed: { label: 'Fixed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  done: { label: 'Done', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  bug: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
  feature: <Lightbulb className="w-3.5 h-3.5 text-amber-400" />,
  improvement: <Wrench className="w-3.5 h-3.5 text-blue-400" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-blue-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

const STATUS_ORDER = ['submitted', 'acknowledged', 'in_progress', 'project_created', 'fixed', 'done'];

interface FeedbackTabProps {
  theme: 'dark' | 'light';
}

export default function FeedbackTab({ theme }: FeedbackTabProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = useCallback(async () => {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setFeedback(data.feedback || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  if (loading) {
    return <div className="flex items-center justify-center py-8"><RefreshCw className="w-5 h-5 animate-spin text-neutral-500" /></div>;
  }

  return (
    <div className={cn("rounded-xl border p-4", classes.card)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn("text-sm font-semibold flex items-center gap-2", classes.heading)}>
          <MessageSquare className="w-4 h-4" /> Feedback
        </h3>
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded", classes.badge)}>{feedback.length}</span>
      </div>

      {feedback.length === 0 ? (
        <p className={cn("text-sm", classes.muted)}>No feedback submitted yet</p>
      ) : (
        <div className="space-y-3">
          {feedback.slice(0, 10).map((item) => {
            const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.submitted;
            const statusIndex = STATUS_ORDER.indexOf(item.status);
            return (
              <div key={item.id} className={cn("rounded-lg border p-3", isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50")}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {CATEGORY_ICONS[item.category]}
                    <span className={cn("text-sm font-medium", classes.heading)}>{item.title}</span>
                  </div>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border", statusConfig.color)}>
                    {statusConfig.label}
                  </span>
                </div>
                {item.description && (
                  <p className={cn("text-xs mb-2 line-clamp-2", classes.muted)}>{item.description}</p>
                )}
                {/* Status progress bar */}
                <div className="flex items-center gap-0.5 mb-2">
                  {STATUS_ORDER.map((s, i) => (
                    <div
                      key={s}
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        i <= statusIndex
                          ? s === 'done' ? 'bg-green-500' :
                            s === 'fixed' ? 'bg-emerald-500' :
                            s === 'project_created' ? 'bg-cyan-500' :
                            s === 'in_progress' ? 'bg-amber-500' :
                            s === 'acknowledged' ? 'bg-violet-500' :
                            'bg-blue-500'
                          : isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                      )}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("text-[10px] font-mono", PRIORITY_COLORS[item.priority])}>{item.priority}</span>
                  <span className={cn("text-[10px]", classes.muted)}>{formatTimeAgo(item.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
