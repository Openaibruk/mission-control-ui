'use client';

import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Radio, Waves, Zap, Clock, TrendingUp, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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

const INITIAL_EVENTS: PulseEvent[] = [
  { id: '1', time: '21:47:32', agent: 'Nova', action: 'Created project: Mission Control Live Dashboard', category: 'task', intensity: 3 },
  { id: '2', time: '21:47:33', agent: 'Nova', action: 'Created 8 tasks for MC Live Dashboard', category: 'task', intensity: 4 },
  { id: '3', time: '21:47:35', agent: 'Cinder', action: 'Started page audit — reading OverviewDashboard.tsx', category: 'task', intensity: 2 },
  { id: '4', time: '21:46:12', agent: 'Nova', action: 'Marketing Strategy project: 7/7 tasks complete', category: 'metric', intensity: 5 },
  { id: '5', time: '21:45:58', agent: 'Nova', action: 'Deleted duplicate Supabase project entry', category: 'task', intensity: 1 },
  { id: '6', time: '21:42:10', agent: 'Nova', action: 'Uploaded 4 deliverables to Google Drive folder', category: 'deploy', intensity: 3 },
  { id: '7', time: '21:38:22', agent: 'Nova', action: 'Fixed project visibility — set department=Marketing', category: 'task', intensity: 2 },
  { id: '8', time: '21:35:00', agent: 'Henok', action: 'Updated gateway scanner to use /health endpoint', category: 'task', intensity: 3 },
  { id: '9', time: '21:30:15', agent: 'Nova', action: 'Graph data refresh: 2,209 nodes, 4,286 edges', category: 'metric', intensity: 3 },
  { id: '10', time: '21:28:00', agent: 'Forge', action: 'Vercel build #86f65ca — deployment queued', category: 'deploy', intensity: 4 },
  { id: '11', time: '21:25:00', agent: 'Nova', action: 'Gateway cron job updated — 15min interval', category: 'deploy', intensity: 2 },
  { id: '12', time: '21:20:00', agent: 'Nova', action: 'Agent API endpoints live: neighbors + query', category: 'deploy', intensity: 4 },
  { id: '13', time: '21:15:00', agent: 'Nahom', action: 'Published customer acquisition strategy document', category: 'task', intensity: 3 },
  { id: '14', time: '21:10:00', agent: 'Amen', action: 'Published marketing automation plan — 10 automations', category: 'task', intensity: 3 },
  { id: '15', time: '21:05:00', agent: 'Bini', action: 'Completed marketing audit — 45+ files analyzed', category: 'metric', intensity: 5 },
];

const METRICS: Metric[] = [
  { label: 'Active Tasks', value: 12, change: +3, icon: Zap, color: 'text-emerald-400' },
  { label: 'Completed', value: 47, change: +8, icon: TrendingUp, color: 'text-blue-400' },
  { label: 'Deployments', value: 9, change: +2, icon: Radio, color: 'text-violet-400' },
  { label: 'Token Cost', value: '$2.37', change: 0, icon: BarChart3, color: 'text-amber-400' },
];

export function ActivityPulse() {
  const isDark = true;
  const [events, setEvents] = useState<PulseEvent[]>(INITIAL_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pulse, setPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate new events flowing in
  useEffect(() => {
    const newEvents = [
      { agent: 'Nova', action: 'Checking task status updates from Supabase...', category: 'task' as const, intensity: 1 },
      { agent: 'Cinder', action: 'Page audit: ActivityView.tsx — ✅ live data via realtime', category: 'task' as const, intensity: 2 },
      { agent: 'Cinder', action: 'Page audit: SettingsView.tsx — ⚠️ static config', category: 'alert' as const, intensity: 3 },
      { agent: 'Nova', action: 'Gateway status refresh: online ✅', category: 'metric' as const, intensity: 2 },
      { agent: 'Henok', action: 'Building Ethiopian calendar widget...', category: 'task' as const, intensity: 2 },
    ];

    const interval = setInterval(() => {
      const evt = newEvents[Math.floor(Math.random() * newEvents.length)];
      const now = new Date();
      const time = now.toTimeString().slice(0, 8);
      const newPulse: PulseEvent = {
        id: Date.now().toString(),
        time,
        ...evt,
      };
      setEvents(prev => [...prev.slice(-60), newPulse]);
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

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
