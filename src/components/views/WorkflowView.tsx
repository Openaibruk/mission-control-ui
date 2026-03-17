'use client';

import { cn, getThemeClasses } from '@/lib/utils';
import { GitBranch, Play, Pause, Clock, Zap } from 'lucide-react';

interface WorkflowViewProps {
  theme: 'dark' | 'light';
}

export default function WorkflowView({ theme }: WorkflowViewProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  return (
    <div className="space-y-4">
      <h2 className={cn("text-lg font-semibold flex items-center gap-2", classes.heading)}>
        <GitBranch className="w-5 h-5" /> Workflows
      </h2>
      <div className={cn("rounded-xl border p-8 text-center", classes.card)}>
        <GitBranch className={cn("w-10 h-10 mx-auto mb-3", classes.muted)} />
        <p className={cn("text-sm font-medium mb-1", classes.heading)}>Workflow Automation</p>
        <p className={cn("text-xs", classes.muted)}>Configure automated workflows, triggers, and agent coordination patterns.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={cn("rounded-xl border p-4", classes.card)}>
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-emerald-400" />
            <span className={cn("text-sm font-medium", classes.heading)}>Active Workflows</span>
          </div>
          <span className={cn("text-2xl font-bold", classes.heading)}>0</span>
        </div>
        <div className={cn("rounded-xl border p-4", classes.card)}>
          <div className="flex items-center gap-2 mb-2">
            <Pause className="w-4 h-4 text-amber-400" />
            <span className={cn("text-sm font-medium", classes.heading)}>Paused</span>
          </div>
          <span className={cn("text-2xl font-bold", classes.heading)}>0</span>
        </div>
        <div className={cn("rounded-xl border p-4", classes.card)}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className={cn("text-sm font-medium", classes.heading)}>Scheduled</span>
          </div>
          <span className={cn("text-2xl font-bold", classes.heading)}>0</span>
        </div>
      </div>
    </div>
  );
}
