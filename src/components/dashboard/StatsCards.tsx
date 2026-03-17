'use client';

import { cn, getThemeClasses } from '@/lib/utils';
import { ListTodo, Activity, CheckCircle2, Clock, Bot, ShieldAlert } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total_tasks: number;
    active_tasks: number;
    completed_tasks: number;
    avg_effort: number;
    active_agents: number;
    total_agents: number;
    approval_needed: number;
  };
  theme: 'dark' | 'light';
}

const CARDS = [
  { key: 'total_tasks', label: 'Total Tasks', icon: ListTodo, color: 'text-blue-400' },
  { key: 'active_tasks', label: 'Active', icon: Activity, color: 'text-violet-400' },
  { key: 'completed_tasks', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' },
  { key: 'avg_effort', label: 'Avg Effort', icon: Clock, color: 'text-amber-400', suffix: 'h' },
  { key: 'active_agents', label: 'Active Agents', icon: Bot, color: 'text-cyan-400' },
  { key: 'approval_needed', label: 'Approval Needed', icon: ShieldAlert, color: 'text-rose-400' },
] as const;

export default function StatsCards({ stats, theme }: StatsCardsProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key as keyof typeof stats] as number;
        return (
          <div key={card.key} className={cn("rounded-xl border p-3", classes.card)}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className={cn("w-3.5 h-3.5", card.color)} />
              <span className={cn("text-[10px] uppercase tracking-wide", classes.muted)}>{card.label}</span>
            </div>
            <span className={cn("text-xl font-bold", classes.heading)}>
              {value}{card.suffix || ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
