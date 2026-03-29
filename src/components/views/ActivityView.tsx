'use client';

import { Activity, Agent } from '@/lib/types';
import { cn, timeAgo, getAvatar } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Activity as ActivityIcon, Filter, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

interface ActivityViewProps {
  activities: Activity[];
  agents: Agent[];
  loading?: boolean;
  theme: 'dark' | 'light';
}

export function ActivityView({ activities, agents, loading, theme }: ActivityViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const agentNames = useMemo(() => {
    const names = new Set(activities.map(a => a.agent_name));
    return Array.from(names).sort();
  }, [activities]);

  const filtered = useMemo(() => {
    let list = activities;
    if (filter !== 'all') {
      list = list.filter(a => a.agent_name === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.action.toLowerCase().includes(q) || a.agent_name.toLowerCase().includes(q));
    }
    return [...list].reverse();
  }, [activities, filter, searchQuery]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={cn("rounded-lg p-3 animate-pulse flex gap-3", classes.card)}>
            <div className={cn("w-8 h-8 rounded-full", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
            <div className="flex-1"><div className={cn("h-4 w-3/4 rounded mb-1", isDark ? "bg-neutral-700" : "bg-neutral-200")} /><div className={cn("h-3 w-1/2 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} /></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className={cn("text-[14px] font-semibold flex items-center gap-2", classes.heading)}>
          <ActivityIcon className="w-4 h-4 text-violet-400" /> Activity Log ({filtered.length})
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className={cn("absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5", classes.muted)} />
            <input 
              type="text" 
              placeholder="Search activity..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("w-full text-[11px] rounded-md pl-8 pr-3 py-1.5 outline-none transition-colors", classes.inputBg)}
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className={cn("text-[11px] rounded-md px-3 py-1.5 outline-none shrink-0", classes.inputBg)}>
            <option value="all">All Agents</option>
            {agentNames.map(name => <option key={name} value={name}>@{name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length > 0 ? filtered.map((act) => (
          <div key={act.id} className={cn("rounded-lg p-3 flex items-start gap-3 transition-colors", classes.card, isDark ? "hover:bg-white/[0.02]" : "hover:bg-neutral-50")}>
            <img src={getAvatar(act.agent_name)} alt={act.agent_name} className="w-8 h-8 rounded-full border border-neutral-700 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("text-[12px] font-semibold", classes.heading)}>@{act.agent_name}</span>
                <span className={cn("text-[10px]", classes.subtle)}>{timeAgo(act.created_at)}</span>
              </div>
              <p className={cn("text-[12px] mt-0.5", classes.muted)}>{act.action}</p>
            </div>
          </div>
        )) : (
          <div className={cn("text-center py-12", classes.muted)}>No activity found</div>
        )}
      </div>
    </div>
  );
}
