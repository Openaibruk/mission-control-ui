'use client';

import { useState, useEffect } from 'react';
import { Agent, Task } from '@/lib/types';
import { cn, getAvatar } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { AgentTriggerModal } from '@/components/shared/AgentTriggerModal';
import { Users, Play, Search, RefreshCw, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface LiveAgent extends Agent {
  currentTask?: string;
  lastActivity?: string;
  tasksCompleted?: number;
  tasksInProgress?: number;
}

interface LiveAgentsViewProps {
  agents: Agent[];
  tasks: Task[];
  loading?: boolean;
  theme: 'dark' | 'light';
}

export function LiveAgentsView({ agents, tasks, loading, theme }: LiveAgentsViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'idle' | 'offline'>('all');
  const [triggerAgent, setTriggerAgent] = useState<Agent | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLastRefresh(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  const liveAgents: LiveAgent[] = agents.map(agent => {
    const agentTasks = tasks.filter(t => t.assignees?.includes(agent.name));
    const inProgress = agentTasks.filter(t => t.status === 'in_progress');
    const completed = agentTasks.filter(t => t.status === 'done');
    const currentTask = inProgress.sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    )[0];
    return {
      ...agent,
      currentTask: currentTask?.title,
      lastActivity: currentTask?.updated_at || currentTask?.created_at,
      tasksCompleted: completed.length,
      tasksInProgress: inProgress.length,
    };
  });

  const filtered = liveAgents.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.role?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={cn("h-48 rounded-lg animate-pulse", classes.card)} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-xl font-bold flex items-center gap-2", isDark ? 'text-white' : 'text-neutral-900')}>
            <Users className="w-5 h-5 text-violet-500" />
            Live Agents
          </h1>
          <p className={cn("text-sm mt-1", classes.muted)}>
            Real-time agent status and quick actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("text-xs flex items-center gap-1", classes.muted)}>
            <RefreshCw className="w-3 h-3" />
            Last refresh: {lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Addis_Ababa' })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", classes.subtle)} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search agents..."
            className={cn("w-full pl-10 pr-4 py-2 rounded-lg text-sm", classes.inputBg)}
          />
        </div>
        {(['all', 'active', 'idle', 'offline'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              filterStatus === status
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : cn("border", classes.divider, classes.muted, "hover:border-violet-500/20")
            )}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1.5 opacity-60">
              ({status === 'all' ? agents.length : agents.filter(a => a.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(agent => (
          <div
            key={agent.id}
            className={cn(
              classes.card,
              "p-5 transition-all hover:border-violet-500/30 group"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-semibold text-sm">
                    {getAvatar(agent.name)}
                  </div>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2",
                    isDark ? 'border-[#111113]' : 'border-white',
                    agent.status === 'active' ? 'bg-emerald-500 animate-pulse' :
                    agent.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                  )} />
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm", isDark ? 'text-white' : 'text-neutral-900')}>
                    {agent.name}
                  </h3>
                  <p className={cn("text-xs", classes.muted)}>{agent.role || 'No role assigned'}</p>
                </div>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-medium",
                agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                agent.status === 'idle' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              )}>
                {agent.status}
              </span>
            </div>

            {/* Current Task */}
            <div className={cn("p-3 rounded-lg mb-3", isDark ? 'bg-neutral-800/50' : 'bg-neutral-100')}>
              {agent.currentTask ? (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] font-medium text-yellow-400 uppercase tracking-wider">Working on</span>
                  </div>
                  <p className={cn("text-sm", isDark ? 'text-neutral-200' : 'text-neutral-700')}>
                    {agent.currentTask}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className={cn("text-xs", classes.muted)}>No active task</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className={cn("text-xs", classes.muted)}>{agent.tasksCompleted} done</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-blue-400" />
                  <span className={cn("text-xs", classes.muted)}>{agent.tasksInProgress} active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setTriggerAgent(agent)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors"
              >
                <Play className="w-3 h-3" />
                Run Task
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={cn("col-span-full p-12 text-center rounded-lg", classes.card)}>
            <Users className={cn("w-8 h-8 mx-auto mb-3", classes.muted)} />
            <p className={cn("text-sm", classes.muted)}>No agents found matching your filters</p>
          </div>
        )}
      </div>

      {/* Agent Trigger Modal */}
      {triggerAgent && (
        <AgentTriggerModal
          agentName={triggerAgent.name}
          isOpen={!!triggerAgent}
          onClose={() => setTriggerAgent(null)}
          theme={theme}
        />
      )}
    </div>
  );
}
