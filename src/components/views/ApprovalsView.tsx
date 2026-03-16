'use client';

import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { CheckCircle2, XCircle, Check, X } from 'lucide-react';

interface ApprovalsViewProps {
  pendingTasks: Task[];
  onApprove: (id: string, title: string, approved: boolean) => void;
  loading?: boolean;
  theme: 'dark' | 'light';
}

export function ApprovalsView({ pendingTasks, onApprove, loading, theme }: ApprovalsViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={cn("border rounded-lg p-4 animate-pulse", classes.card)}>
            <div className={cn("h-5 w-3/4 rounded mb-2", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
            <div className={cn("h-4 w-full rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
          </div>
        ))}
      </div>
    );
  }

  if (pendingTasks.length === 0) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className={cn("flex flex-col items-center justify-center py-16 text-center", classes.card)}>
          <CheckCircle2 className={cn("w-10 h-10 mb-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
          <div className={cn("text-[14px] font-medium", classes.heading)}>All clear</div>
          <div className={cn("text-[12px] mt-1", classes.muted)}>No pending approvals.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-4">
      {pendingTasks.map((task) => (
        <div 
          key={task.id} 
          className={cn(
            "border rounded-lg p-4 transition-all",
            classes.card,
            classes.hoverCard
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <div className={cn("text-[13px] font-semibold mb-1", classes.heading)}>
                {task.title}
              </div>
              {task.description && (
                <div className={cn("text-[11px]", classes.muted)}>
                  {task.description}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 shrink-0">
              <button 
                onClick={() => onApprove(task.id, task.title, true)}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors min-h-[36px]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
              <button 
                onClick={() => onApprove(task.id, task.title, false)}
                className="flex items-center space-x-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-md text-[11px] font-medium border border-red-500/20 transition-colors min-h-[36px]"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}