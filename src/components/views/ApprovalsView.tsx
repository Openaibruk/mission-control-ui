'use client';

import { cn, STATUS_COLORS, PRIORITY_COLORS, getThemeClasses, formatTimeAgo } from '@/lib/utils';
import { Task } from '@/lib/types';
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface ApprovalsViewProps {
  tasks: Task[];
  theme: 'dark' | 'light';
  loading?: boolean;
  onApprove?: (taskId: string) => void;
  onReject?: (taskId: string) => void;
}

export default function ApprovalsView({ tasks, theme, loading, onApprove, onReject }: ApprovalsViewProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);
  const pendingTasks = tasks.filter(t => t.status === 'approval_needed');

  if (loading) {
    return <div className="flex items-center justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-neutral-500" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={cn("text-lg font-semibold flex items-center gap-2", classes.heading)}>
          <ShieldCheck className="w-5 h-5" /> Pending Approvals
        </h2>
        <span className={cn("text-xs px-2 py-0.5 rounded-full", pendingTasks.length > 0 ? 'bg-amber-500/10 text-amber-400' : classes.badge)}>
          {pendingTasks.length} pending
        </span>
      </div>

      {pendingTasks.length === 0 ? (
        <div className={cn("rounded-xl border p-8 text-center", classes.card)}>
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className={cn("text-sm", classes.muted)}>All caught up! No tasks need approval.</p>
        </div>
      ) : (
        <div className={cn("rounded-xl border divide-y", classes.card, isDark ? "divide-neutral-800" : "divide-neutral-200")}>
          {pendingTasks.map((task) => (
            <div key={task.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className={cn("text-sm font-medium", classes.heading)}>{task.title}</h4>
                  {task.description && (
                    <p className={cn("text-xs mt-1 line-clamp-2", classes.muted)}>{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {task.agents && (
                      <span className={cn("text-xs", classes.muted)}>
                        {task.agents.avatar_emoji} {task.agents.name}
                      </span>
                    )}
                    <span className={cn("text-xs font-mono", PRIORITY_COLORS[task.priority] || classes.muted)}>P{task.priority}</span>
                    <span className={cn("text-xs", classes.muted)}>{formatTimeAgo(task.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onApprove?.(task.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => onReject?.(task.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
