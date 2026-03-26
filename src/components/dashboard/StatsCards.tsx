'use client';

import { Inbox, PlayCircle, CheckCircle2, BarChart2 } from 'lucide-react';
import { cn, getStatusBorderColor } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { DashboardStats } from '@/lib/types';

interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
  theme: 'dark' | 'light';
}

const statItems = [
  { key: 'total', label: 'Total', colorKey: 'total', icon: Inbox },
  { key: 'active', label: 'Active', colorKey: 'active', icon: PlayCircle },
  { key: 'done', label: 'Done', colorKey: 'done', icon: CheckCircle2 },
  { key: 'rate', label: 'Rate', colorKey: 'rate', icon: BarChart2, suffix: '%' },
];

function getStatColor(key: string): string {
  switch (key) {
    case 'total': return 'bg-emerald-500/10 text-emerald-500';
    case 'active': return 'bg-amber-500/10 text-amber-500';
    case 'done': return 'bg-violet-500/10 text-violet-500';
    case 'rate': return 'bg-blue-500/10 text-blue-500';
    default: return 'bg-neutral-500/10 text-neutral-500';
  }
}

export function StatsCards({ stats, loading, theme }: StatsCardsProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const getValue = (key: string): string => {
    if (key === 'rate') return `${stats.rate}%`;
    return String(stats[key as keyof DashboardStats] || 0);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={cn("flex flex-col p-4 rounded-lg animate-pulse", classes.card)}>
            <div className={cn("h-3 w-12 rounded mb-3", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
            <div className={cn("h-8 w-16 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const color = getStatColor(item.colorKey);
        
        return (
          <div 
            key={item.key} 
            className={cn(
              "flex flex-col p-4 rounded-lg transition-all hover:scale-[1.02]",
              classes.card,
              "border-l-4",
              getStatusBorderColor(item.colorKey)
            )}
          >
            <div className={cn("text-[10px] uppercase font-semibold mb-2", color)}>
              {item.label}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl md:text-3xl font-bold">
                {getValue(item.key)}
              </div>
              <Icon className={cn("w-5 h-5", color)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}