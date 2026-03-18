'use client';

import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Radio, Waves, Zap, Clock, TrendingUp, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface PulseEvent {
  id: string;
  time: string;
  agent: string;
  action: string;
  category: 'task' | 'deploy' | 'message' | 'metric' | 'alert';
  intensity: number; // 1-5
}

interface Metric {
  label: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

function categorizeAction(action: string): PulseEvent['category'] {
  const lower = action.toLowerCase();
  if (lower.includes('deploy') || lower.includes('upload') || lower.includes('push') || lower.includes('vercel')) return 'deploy';
  if (lower.includes('metric') || lower.includes('complete') || lower.includes('task')) return 'metric';
  if (lower.includes('error') || lower.includes('fail') || lower.includes('broken')) return 'alert';
  if (lower.includes('message') || lower.includes('chat')) return 'message';
  return 'task';
}

function categorizeIntensity(action: string): number {
  const lower = action.toLowerCase();
  if (lower.includes('project') || lower.includes('complete') || lower.includes('deploy')) return 4;
  if (lower.includes('created') || lower.includes('fixed') || lower.includes('updated')) return 3;
  if (lower.includes('checked') || lower.includes('review')) return 2;
  return 1;
}

function stripAt(name: string): string {
  return name.replace(/^@+/, '');
}

// Metrics are computed from events, not hardcoded

export function ActivityPulse() {
  const isDark = true;
  const [events, setEvents] = useState<PulseEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pulse, setPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real activities from Supabase
  const loadActivities = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        const mapped: PulseEvent[] = data.map((a: any) => {
          const date = new Date(a.created_at);
          return {
            id: a.id,
            time: date.toTimeString().slice(0, 8),
            agent: stripAt(a.agent_name || 'Unknown'),
            action: a.action,
            category: categorizeAction(a.action),
            intensity: categorizeIntensity(a.action),
          };
        });
        setEvents(mapped);
      }
    } catch (e) {
      console.error('Failed to load activities:', e);
    }
  }, []);

  useEffect(() => {
    loadActivities();
    // Poll for new activities every 30s
    const interval = setInterval(() => {
      loadActivities();
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadActivities]);

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'task': return 'border-l-blue-500 bg-blue-500/5';
      case 'deploy': return 'border-l-violet-500 bg-violet-500/5';
      case 'message': return 'border-l-cyan-500 bg-cyan-500/5';
      case 'metric': return 'border-l-emerald-500 bg-emerald-500/5';
      case 'alert': return 'border-l-amber-500 bg-amber-500/5';
      default: return 'border-l-neutral-500 bg-neutral-500/5';
    }
  };

  const intensityBars = (level: number) => (
    <div className="flex items-end gap-px h-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={cn(
          'w-0.5 rounded-sm',
          i <= level ? 'bg-emerald-400' : 'bg-neutral-800'
        )} style={{ height: `${4 + i * 2}px` }} />
      ))}
    </div>
  );

  const filtered = selectedCategory === 'all' ? events : events.filter(e => e.category === selectedCategory);

  // Compute real metrics from events
  const deployCount = events.filter(e => e.category === 'deploy').length;
  const taskCount = events.filter(e => e.category === 'task').length;
  const todayEvents = events.filter(e => {
    const now = new Date();
    const eventDate = new Date();
    const [h, m, s] = e.time.split(':').map(Number);
    eventDate.setHours(h, m, s);
    return (now.getTime() - eventDate.getTime()) < 86400000;
  }).length;

  const METRICS: Metric[] = [
    { label: 'Active Tasks', value: taskCount, change: 0, icon: Zap, color: 'text-emerald-400' },
    { label: 'Today\'s Events', value: todayEvents, change: 0, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Deploys', value: deployCount, change: 0, icon: Radio, color: 'text-violet-400' },
    { label: 'Total Logged', value: events.length, change: 0, icon: BarChart3, color: 'text-amber-400' },
  ];

  return (
    <div className="rounded-lg border border-neutral-800/50 bg-neutral-900/50 overflow-hidden">
      {/* Header with pulse indicator */}
      <div className="p-4 border-b border-neutral-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Waves className={cn('w-4 h-4 text-cyan-400 transition-all', pulse && 'scale-125')} />
              {pulse && (
                <span className="absolute inset-0 w-4 h-4 rounded-full bg-cyan-400 animate-ping opacity-30" />
              )}
            </div>
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Activity Pulse</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', pulse ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-400/50')} />
            <span className="text-[9px] text-neutral-500">LIVE</span>
            <span className="text-[9px] text-neutral-600 ml-1">{events.length} events</span>
          </div>
        </div>
      </div>

      {/* Live metrics */}
      <div className="px-4 py-3 border-b border-neutral-800/50 grid grid-cols-4 gap-3">
        {METRICS.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Icon className={cn('w-3 h-3', m.color)} />
                <span className={cn('text-[14px] font-bold', m.color)}>{m.value}</span>
              </div>
              <div className="text-[8px] text-neutral-500 mt-0.5">{m.label}</div>
              {m.change !== 0 && (
                <div className={cn('text-[8px] flex items-center justify-center gap-0.5 mt-0.5',
                  m.change > 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {m.change > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                  {Math.abs(m.change)} today
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Category filter */}
      <div className="px-4 py-2 border-b border-neutral-800/50 flex gap-1">
        {['all', 'task', 'deploy', 'metric', 'alert'].map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={cn('text-[9px] px-2 py-1 rounded capitalize transition-colors',
              selectedCategory === cat ? 'bg-cyan-500/20 text-cyan-400' : 'text-neutral-500 hover:text-neutral-300')}>
            {cat}
          </button>
        ))}
      </div>

      {/* Event stream */}
      <div ref={containerRef} className="p-3 h-[280px] overflow-y-auto custom-scrollbar space-y-1">
        {[...filtered].reverse().map((evt, i) => (
          <div key={evt.id} className={cn(
            'flex items-start gap-2 px-2 py-1.5 rounded-md border-l-2 transition-all',
            categoryColor(evt.category),
            i === 0 && 'ring-1 ring-cyan-500/20'
          )}>
            <span className="text-[9px] text-neutral-600 font-mono shrink-0 mt-0.5">{evt.time.slice(0, 5)}</span>
            <span className="text-[9px] text-neutral-300 font-semibold shrink-0 w-10">{evt.agent}</span>
            <span className="text-[10px] text-neutral-400 flex-1 leading-tight">{evt.action}</span>
            {intensityBars(evt.intensity)}
          </div>
        ))}
      </div>

      {/* Pulse wave animation */}
      <div className="px-4 py-2 border-t border-neutral-800/50 flex items-center gap-2">
        <div className="flex-1 h-6 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 24" preserveAspectRatio="none">
            <path
              d="M0,12 Q20,12 40,12 T80,12 T120,12 T160,12 T200,12 T240,12 T280,12 T320,12 T360,12 T400,12"
              className="fill-none stroke-cyan-500/30 stroke-[1.5]"
            />
            <path
              d={`M0,12 ${Array.from({ length: 20 }, (_, i) => {
                const x = i * 20;
                const active = i === Math.floor(Date.now() / 600) % 20;
                return `L${x},${active ? 4 : 12} L${x + 10},${active ? 20 : 12}`;
              }).join(' ')}`}
              className="fill-none stroke-cyan-400/60 stroke-[1.5]"
            />
          </svg>
        </div>
        <span className="text-[8px] text-neutral-600">pulse</span>
      </div>
    </div>
  );
}
