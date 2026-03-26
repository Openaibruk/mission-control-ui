'use client';

import { cn, getThemeClasses } from '@/lib/utils';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

interface InsightsViewProps {
  theme: 'dark' | 'light';
}

export default function InsightsView({ theme }: InsightsViewProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  return (
    <div className="space-y-4">
      <h2 className={cn("text-lg font-semibold flex items-center gap-2", classes.heading)}>
        <TrendingUp className="w-5 h-5" /> Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={cn("rounded-xl border p-6", classes.card)}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className={cn("text-sm font-semibold", classes.heading)}>Task Completion Rate</h3>
          </div>
          <p className={cn("text-sm", classes.muted)}>Analytics coming soon. Track agent productivity and task throughput over time.</p>
        </div>
        <div className={cn("rounded-xl border p-6", classes.card)}>
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-violet-400" />
            <h3 className={cn("text-sm font-semibold", classes.heading)}>Agent Distribution</h3>
          </div>
          <p className={cn("text-sm", classes.muted)}>View how tasks are distributed across agents and departments.</p>
        </div>
        <div className={cn("rounded-xl border p-6", classes.card)}>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className={cn("text-sm font-semibold", classes.heading)}>System Health</h3>
          </div>
          <p className={cn("text-sm", classes.muted)}>Monitor gateway uptime, response times, and error rates.</p>
        </div>
        <div className={cn("rounded-xl border p-6", classes.card)}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className={cn("text-sm font-semibold", classes.heading)}>Cost Trends</h3>
          </div>
          <p className={cn("text-sm", classes.muted)}>Track token usage and API costs across all agents over time.</p>
        </div>
      </div>
    </div>
  );
}
