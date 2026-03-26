'use client';

import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Feedback } from '@/lib/types';
import {
  MessageSquarePlus, AlertTriangle, Lightbulb, Wrench,
  Clock, CheckCircle2, Loader2, FolderOpen
} from 'lucide-react';

interface FeedbackStatsProps {
  feedback: Feedback[];
  theme: 'dark' | 'light';
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  acknowledged: { label: 'Acknowledged', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  project_created: { label: 'Project Created', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  done: { label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

const CATEGORY_CONFIG = {
  bug: { label: 'Bugs', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  feature: { label: 'Features', icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  improvement: { label: 'Improvements', icon: Wrench, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export function FeedbackStats({ feedback, theme }: FeedbackStatsProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const total = feedback.length;
  const statusCounts = Object.keys(STATUS_CONFIG).reduce((acc, status) => {
    acc[status] = feedback.filter(f => f.status === status).length;
    return acc;
  }, {} as Record<string, number>);
  const categoryCounts = Object.keys(CATEGORY_CONFIG).reduce((acc, cat) => {
    acc[cat] = feedback.filter(f => f.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const openItems = (statusCounts.pending || 0) + (statusCounts.acknowledged || 0);
  const inProgress = (statusCounts.in_progress || 0) + (statusCounts.project_created || 0);
  const resolved = statusCounts.done || 0;

  return (
    <div className="space-y-4 mb-6">
      {/* Top row: Total + Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total */}
        <div className={cn("rounded-xl border p-4", isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-neutral-200")}>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
            <span className={cn("text-xs font-medium uppercase", classes.subtle)}>Total</span>
          </div>
          <span className={cn("text-2xl font-bold", classes.heading)}>{total}</span>
        </div>

        {/* Open */}
        <div className={cn("rounded-xl border p-4", isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-neutral-200")}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className={cn("text-xs font-medium uppercase", classes.subtle)}>Open</span>
          </div>
          <span className={cn("text-2xl font-bold text-blue-400")}>{openItems}</span>
        </div>

        {/* In Progress */}
        <div className={cn("rounded-xl border p-4", isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-neutral-200")}>
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-4 h-4 text-amber-400" />
            <span className={cn("text-xs font-medium uppercase", classes.subtle)}>In Progress</span>
          </div>
          <span className="text-2xl font-bold text-amber-400">{inProgress}</span>
        </div>

        {/* Resolved */}
        <div className={cn("rounded-xl border p-4", isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-neutral-200")}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className={cn("text-xs font-medium uppercase", classes.subtle)}>Resolved</span>
          </div>
          <span className="text-2xl font-bold text-emerald-400">{resolved}</span>
        </div>
      </div>

      {/* Bottom row: Status breakdown + Category breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Status breakdown */}
        <div className={cn("rounded-xl border p-4", isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-neutral-200")}>
          <span className={cn("text-xs font-medium uppercase block mb-3", classes.subtle)}>By Status</span>
          <div className="space-y-2">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => {
              const count = statusCounts[key] || 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className={cn("text-xs w-24 shrink-0", config.color)}>{config.label}</span>
                  <div className={cn("flex-1 h-2 rounded-full overflow-hidden", isDark ? "bg-white/5" : "bg-neutral-100")}>
                    <div className={cn("h-full rounded-full transition-all duration-500", config.color.replace('text-', 'bg-'))} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={cn("text-xs w-6 text-right", classes.muted)}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className={cn("rounded-xl border p-4", isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-neutral-200")}>
          <span className={cn("text-xs font-medium uppercase block mb-3", classes.subtle)}>By Category</span>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
              const count = categoryCounts[key] || 0;
              const Icon = config.icon;
              return (
                <div key={key} className={cn("rounded-lg border p-3 text-center", config.bg)}>
                  <Icon className={cn("w-5 h-5 mx-auto mb-1", config.color)} />
                  <span className={cn("text-lg font-bold block", config.color)}>{count}</span>
                  <span className={cn("text-[10px] uppercase font-medium", config.color)}>{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
