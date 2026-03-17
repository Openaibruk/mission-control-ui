'use client';

import { cn, getThemeClasses, formatTimeAgo } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, AlertTriangle, Lightbulb, Wrench, RefreshCw, CheckCircle } from 'lucide-react';

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
  bug: <AlertTriangle className="w-4 h-4 text-red-400" />,
  feature: <Lightbulb className="w-4 h-4 text-amber-400" />,
  improvement: <Wrench className="w-4 h-4 text-blue-400" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-blue-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

const STATUS_ORDER = ['submitted', 'acknowledged', 'in_progress', 'project_created', 'fixed', 'done'];

interface FeedbackViewProps {
  theme: 'dark' | 'light';
}

export default function FeedbackView({ theme }: FeedbackViewProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchFeedback();
    } catch {
      // silent
    }
  };

  const filtered = filter === 'all' ? feedback : feedback.filter(f => f.status === filter);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-neutral-500" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={cn("text-lg font-semibold flex items-center gap-2", classes.heading)}>
          <MessageSquare className="w-5 h-5" /> Feedback
        </h2>
        <span className={cn("text-xs", classes.muted)}>{feedback.length} total</span>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={cn("px-3 py-1 rounded-lg text-xs border transition-colors",
            filter === 'all'
              ? 'border-violet-500 bg-violet-500/10 text-violet-400'
              : isDark ? 'border-neutral-700 hover:bg-white/5 text-neutral-400' : 'border-neutral-300 hover:bg-neutral-50 text-neutral-600'
          )}
        >
          All
        </button>
        {STATUS_ORDER.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn("px-3 py-1 rounded-lg text-xs border transition-colors",
                filter === s ? cfg.color : isDark ? 'border-neutral-700 hover:bg-white/5 text-neutral-400' : 'border-neutral-300 hover:bg-neutral-50 text-neutral-600'
              )}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Feedback List */}
      {filtered.length === 0 ? (
        <div className={cn("rounded-xl border p-8 text-center", classes.card)}>
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className={cn("text-sm", classes.muted)}>
            {filter === 'all' ? 'No feedback submitted yet' : `No ${STATUS_CONFIG[filter]?.label.toLowerCase()} feedback`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.submitted;
            const statusIndex = STATUS_ORDER.indexOf(item.status);
            return (
              <div key={item.id} className={cn("rounded-xl border p-4", classes.card)}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[item.category]}
                    <h4 className={cn("text-sm font-medium", classes.heading)}>{item.title}</h4>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border shrink-0", statusConfig.color)}>
                    {statusConfig.label}
                  </span>
                </div>

                {item.description && (
                  <p className={cn("text-xs mb-3", classes.muted)}>{item.description}</p>
                )}

                {/* Status Progress */}
                <div className="flex items-center gap-0.5 mb-2">
                  {STATUS_ORDER.map((s, i) => (
                    <div
                      key={s}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors",
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
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[10px] font-mono uppercase", PRIORITY_COLORS[item.priority])}>{item.priority}</span>
                    <span className={cn("text-[10px]", classes.muted)}>created {formatTimeAgo(item.created_at)}</span>
                  </div>
                  {/* Status Update Buttons */}
                  <div className="flex gap-1">
                    {statusIndex < STATUS_ORDER.length - 1 && (
                      <button
                        onClick={() => updateStatus(item.id, STATUS_ORDER[statusIndex + 1])}
                        className="text-[10px] px-2 py-0.5 rounded bg-violet-600/10 text-violet-400 hover:bg-violet-600/20 transition-colors"
                      >
                        → {STATUS_CONFIG[STATUS_ORDER[statusIndex + 1]].label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
