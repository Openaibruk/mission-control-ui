'use client';

import { useState, useEffect, useMemo } from 'react';
import { cn, timeAgo } from '@/lib/utils';
import { useTheme, useThemeClasses } from '@/hooks/useTheme';
import { Activity as ActivityIcon, TrendingUp, Users } from 'lucide-react';
import { Activity } from '@/lib/types';

interface PulseEvent {
  id: string;
  time: string;
  agent: string;
  action: string;
  category: 'task' | 'deploy' | 'message' | 'metric' | 'alert';
  intensity: number;
}

interface Metric {
  label: string;
  value: string;
  icon: any;
  color: string;
}

export function ActivityPulse({ activities = [] }: { activities?: Activity[] }) {
  const { isDark } = useTheme();
  const { bg } = useThemeClasses(isDark);

  const categorizeAction = (action: string): 'task' | 'deploy' | 'message' | 'metric' | 'alert' => {
    const lower = action?.toLowerCase() || '';
    if (lower.includes('deploy') || lower.includes('release')) return 'deploy';
    if (lower.includes('error') || lower.includes('fail') || lower.includes('❌')) return 'alert';
    if (lower.includes('chat') || lower.includes('message')) return 'message';
    if (lower.includes('metric') || lower.includes('analytics')) return 'metric';
    return 'task';
  };

  const categorizeIntensity = (action: string): number => {
    const lower = action?.toLowerCase() || '';
    if (lower.includes('error') || lower.includes('fail')) return 5;
    if (lower.includes('deploy') || lower.includes('release')) return 4;
    if (lower.includes('complete') || lower.includes('✅')) return 3;
    if (lower.includes('start') || lower.includes('running')) return 2;
    return 1;
  };

  const events = useMemo(() => {
    return activities.slice(-15).map(a => ({
      id: a.id,
      time: new Date(a.created_at).toISOString(),
      agent: (a.agent_name || 'Unknown').replace(/^@+/, ''),
      action: a.action,
      category: categorizeAction(a.action),
      intensity: categorizeIntensity(a.action),
    }));
  }, [activities]);

  const METRICS: Metric[] = [
    { label: 'Activity', value: events.length.toString(), icon: ActivityIcon, color: 'text-cyan-400' },
    { label: 'Intensity', value: Math.max(...events.map(e => e.intensity), 1).toString(), icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Agents', value: new Set(events.map(e => e.agent)).size.toString(), icon: Users, color: 'text-purple-400' },
  ];

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 5: return 'bg-red-500';
      case 4: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 2: return 'bg-blue-500';
      default: return 'bg-neutral-500';
    }
  };

  const intensityBars = (intensity: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`w-1 h-2 rounded ${i <= intensity ? getIntensityColor(intensity) : 'bg-neutral-700'}`}
        />
      ))}
    </div>
  );

  return (
    <div className={`${bg} rounded-lg p-4 h-full flex flex-col`}>
      <div className="flex items-center gap-2 mb-3">
        <ActivityIcon className="w-4 h-4 text-cyan-400" />
        <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Activity Pulse</span>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {METRICS.map(m => (
            <div key={m.label} className="flex items-center gap-1 text-[9px] text-neutral-500">
              <m.icon className={`w-3 h-3 ${m.color}`} />
              <span>{m.label}: {m.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1 flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-neutral-500 text-[10px] text-center py-4">No events found.</div>
        ) : (
          events.map((evt, i) => (
            <div
              key={evt.id}
              className={cn(
                'flex items-center gap-2 py-1 px-2 rounded text-[10px]',
                i === events.length - 1 && 'ring-1 ring-cyan-500/20 bg-cyan-900/10' // Highlight newest
              )}
            >
              <span className="text-[9px] text-neutral-500 font-mono shrink-0 mt-0.5 w-12 text-right">
                {timeAgo(evt.time)}
              </span>
              <span className="text-[9px] text-neutral-300 font-semibold shrink-0 w-12 truncate">
                {evt.agent}
              </span>
              <span className="text-[10px] text-neutral-400 flex-1 leading-tight truncate" title={evt.action}>
                {evt.action}
              </span>
              {intensityBars(evt.intensity)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}