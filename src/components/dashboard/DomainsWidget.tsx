'use client';

import { useThemeClasses, useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Briefcase, LayoutDashboard, Monitor, Compass, Map } from 'lucide-react';

const DOMAINS = [
  {
    id: 'business-chipchip',
    name: 'ChipChip (Business)',
    icon: Briefcase,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    desc: 'Logistics, DataHub Analytics, Workflows'
  },
  {
    id: 'sys-mission-control',
    name: 'Mission Control',
    icon: LayoutDashboard,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    desc: 'Next.js UI, Vercel, Supabase Schema'
  },
  {
    id: 'sys-workspace',
    name: 'System Workspace',
    icon: Monitor,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    desc: 'OpenClaw Config, Skills, Cost Optimization'
  },
  {
    id: 'personal-explore',
    name: 'Personal & Explore',
    icon: Compass,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    desc: 'Job Finder, Obsidian Vault, Research'
  }
];

export function DomainsWidget() {
  const { isDark } = useTheme();
  const classes = useThemeClasses(isDark);

  return (
    <div className={cn("p-5 rounded-lg col-span-full", classes.card)}>
      <div className="flex items-center gap-2 mb-4">
        <Map className={cn("w-4 h-4", isDark ? "text-indigo-400" : "text-indigo-600")} />
        <h3 className={cn("text-[13px] font-semibold", classes.heading)}>Context Domains</h3>
        <span className={cn("text-[10px] ml-2 px-2 py-0.5 rounded-full", isDark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700")}>
          Workspace Boundaries
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DOMAINS.map(domain => {
          const Icon = domain.icon;
          return (
            <div key={domain.id} className={cn("p-3 rounded-md border transition-colors", domain.bg, domain.border, isDark ? "hover:bg-white/5" : "hover:bg-black/5")}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("w-4 h-4", domain.color)} />
                <span className={cn("text-[12px] font-bold", classes.heading)}>{domain.name}</span>
              </div>
              <p className={cn("text-[10px] leading-relaxed", classes.muted)}>
                {domain.desc}
              </p>
              <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <code className={cn("text-[9px] px-1.5 py-0.5 rounded font-mono", isDark ? "bg-black/30 text-neutral-400" : "bg-white/50 text-neutral-500")}>
                  {domain.id}.md
                </code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}