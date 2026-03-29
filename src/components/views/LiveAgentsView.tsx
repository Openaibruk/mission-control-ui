'use client';

import { useState, useEffect } from 'react';
import { Agent, Task, Activity } from '@/lib/types';
import { cn, getAvatar, getAgentStatusInfo } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { AgentTriggerModal } from '@/components/shared/AgentTriggerModal';
import { Users, Play, Search, RefreshCw, Clock, CheckCircle2, AlertCircle, Zap, DollarSign, Activity as ActivityIcon } from 'lucide-react';

interface LiveAgent extends Agent {
  currentTask?: string;
  lastActivityDate?: Date;
  tasksCompleted?: number;
  tasksInProgress?: number;
  computedStatus?: string;
  statusColor?: string;
}

interface LiveAgentsViewProps {
  agents: Agent[];
  tasks: Task[];
  activities?: Activity[];
  loading?: boolean;
  theme: 'dark' | 'light';
}

export function LiveAgentsView({ agents, tasks, activities = [], loading, theme }: LiveAgentsViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'idle' | 'offline'>('all');
  const [triggerAgent, setTriggerAgent] = useState<Agent | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const [tokenCosts, setTokenCosts] = useState<any>(null);

  useEffect(() => {
    fetch('/api/token-costs')
      .then(res => res.json())
      .then(data => setTokenCosts(data))
      .catch(console.error);

    const interval = setInterval(() => setLastRefresh(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  const liveAgents: LiveAgent[] = agents.map(agent => {
    const agentTasks = tasks.filter(t => (t.assignees || []).some(a => a?.replace(/^@+/, '') === agent.name));
    const agentActivities = activities.filter(a => a.agent_name?.replace(/^@+/, '') === agent.name);
    
    const inProgress = agentTasks.filter(t => t.status === 'in_progress');
    const completed = agentTasks.filter(t => t.status === 'done');
    const inbox = agentTasks.filter(t => t.status === 'inbox');
    const currentTask = inProgress.sort((a, b) =>
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    )[0];

    // Find latest activity
    let lastDate: Date | null = null;
    if (currentTask?.updated_at) lastDate = new Date(currentTask.updated_at);
    if (agentActivities.length > 0) {
      const latestAct = new Date(agentActivities[0].created_at);
      if (!lastDate || latestAct > lastDate) lastDate = latestAct;
    }

    const statusInfo = getAgentStatusInfo(lastDate);
    const computedStatus = lastDate && (new Date().getTime() - lastDate.getTime()) < 600000 ? 'active' : lastDate && (new Date().getTime() - lastDate.getTime()) < 3600000 ? 'idle' : 'offline';

    return {
      ...agent,
      currentTask: currentTask?.title,
      lastActivityDate: lastDate || undefined,
      computedStatus,
      statusColor: statusInfo.color,
      tasksCompleted: completed.length,
      tasksInProgress: inProgress.length + inbox.length,
    };
  });

  const filtered = liveAgents.filter(a => {
    if (filterStatus !== 'all' && a.computedStatus !== filterStatus) return false;
    if (search && !(a.name || '').toLowerCase().includes(search.toLowerCase()) && !(a.role || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Calculate top level metrics
  const activeTaskCount = tasks.filter(t => t.status === 'in_progress' || t.status === 'assigned').length;

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto flex gap-6">
        <div className="flex-1 animate-pulse space-y-4">
          <div className={cn("h-32 rounded-xl mb-6", classes.card)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={cn("h-48 rounded-lg", classes.card)} />
            ))}
          </div>
        </div>
        <div className={cn("w-80 h-[80vh] rounded-xl animate-pulse hidden lg:block", classes.card)} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn("text-xl font-bold flex items-center gap-2", isDark ? 'text-white' : 'text-neutral-900')}>
              <Users className="w-5 h-5 text-violet-500" />
              Live Agents
            </h1>
            <p className={cn("text-sm mt-1", classes.muted)}>Real-time agent status and metrics</p>
          </div>
          <div className={cn("text-xs flex items-center gap-1", classes.muted)}>
            <RefreshCw className="w-3 h-3" />
            Last refresh: {lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Real-time Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={cn("p-4 rounded-xl border flex items-center gap-4", isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200')}>
            <div className="p-3 bg-violet-500/10 rounded-lg text-violet-500"><Users className="w-5 h-5" /></div>
            <div>
              <div className={cn("text-xs font-medium", classes.muted)}>Online Agents</div>
              <div className={cn("text-xl font-bold", isDark ? 'text-white' : 'text-neutral-900')}>
                {liveAgents.filter(a => a.computedStatus === 'active').length} <span className={cn("text-sm font-normal", classes.muted)}>/{liveAgents.length}</span>
              </div>
            </div>
          </div>
          <div className={cn("p-4 rounded-xl border flex items-center gap-4", isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200')}>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><AlertCircle className="w-5 h-5" /></div>
            <div>
              <div className={cn("text-xs font-medium", classes.muted)}>Active Tasks</div>
              <div className={cn("text-xl font-bold", isDark ? 'text-white' : 'text-neutral-900')}>{activeTaskCount}</div>
            </div>
          </div>
          <div className={cn("p-4 rounded-xl border flex items-center gap-4", isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200')}>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500"><Zap className="w-5 h-5" /></div>
            <div>
              <div className={cn("text-xs font-medium", classes.muted)}>Tokens Used</div>
              <div className={cn("text-xl font-bold", isDark ? 'text-white' : 'text-neutral-900')}>
                {tokenCosts?.summary?.totalTokens ? (tokenCosts.summary.totalTokens / 1000000).toFixed(1) + 'M' : '0'}
              </div>
            </div>
          </div>
          <div className={cn("p-4 rounded-xl border flex items-center gap-4", isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200')}>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500"><DollarSign className="w-5 h-5" /></div>
            <div>
              <div className={cn("text-xs font-medium", classes.muted)}>Est. Cost</div>
              <div className={cn("text-xl font-bold text-emerald-500")}>
                ${tokenCosts?.summary?.totalCost ? tokenCosts.summary.totalCost.toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-xs">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", classes.subtle)} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..."
              className={cn("w-full pl-10 pr-4 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-violet-500/50 outline-none transition-all", isDark ? 'bg-neutral-900/50 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900')} />
          </div>
          {(['all', 'active', 'idle', 'offline'] as const).map(status => (
            <button key={status} onClick={() => setFilterStatus(status)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                filterStatus === status ? 'bg-violet-500 text-white shadow-sm'
                  : cn("border", isDark ? 'border-neutral-800 text-neutral-400 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'))}>
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1.5 opacity-60">({status === 'all' ? liveAgents.length : liveAgents.filter(a => a.computedStatus === status).length})</span>
            </button>
          ))}
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(agent => (
            <div key={agent.id} className={cn("rounded-xl border p-5 transition-all hover:border-violet-500/50 group",
              isDark ? 'bg-neutral-900/40 border-neutral-800/80' : 'bg-white border-neutral-200')}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={getAvatar(agent.name)} alt={agent.name || 'Agent'} className="w-10 h-10 rounded-full border border-neutral-700 object-cover" />
                    <div className={cn("absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2",
                      isDark ? 'border-neutral-900' : 'border-white',
                      agent.computedStatus === 'active' ? 'bg-emerald-500 animate-pulse' : agent.computedStatus === 'idle' ? 'bg-yellow-500' : 'bg-red-500')} />
                  </div>
                  <div>
                    <h3 className={cn("font-semibold text-sm", isDark ? 'text-white' : 'text-neutral-900')}>{agent.name || 'Unknown'}</h3>
                    <p className={cn("text-[11px]", isDark ? 'text-neutral-500' : 'text-neutral-400')}>{agent.role || 'No role assigned'}</p>
                  </div>
                </div>
                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                  agent.computedStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  agent.computedStatus === 'idle' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20')}>
                  {agent.computedStatus || 'unknown'}
                </span>
              </div>

              <div className={cn("p-3 rounded-lg mb-4 h-16 flex items-center", isDark ? 'bg-neutral-800/50' : 'bg-neutral-50 border border-neutral-100')}>
                {agent.currentTask ? (
                  <div className="w-full">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Clock className="w-3 h-3 text-violet-400" />
                      <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Current Task</span>
                    </div>
                    <p className={cn("text-[13px] font-medium truncate", isDark ? 'text-neutral-200' : 'text-neutral-700')}>{agent.currentTask}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className={cn("text-xs font-medium", isDark ? 'text-neutral-400' : 'text-neutral-500')}>Standby Mode</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className={cn("text-xs font-semibold", isDark ? 'text-neutral-300' : 'text-neutral-700')}>{agent.tasksCompleted || 0} <span className={cn("font-normal", classes.muted)}>done</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <span className={cn("text-xs font-semibold", isDark ? 'text-neutral-300' : 'text-neutral-700')}>{agent.tasksInProgress || 0} <span className={cn("font-normal", classes.muted)}>active</span></span>
                  </div>
                </div>
                <button onClick={() => setTriggerAgent(agent)}
                  className="p-2 rounded-lg bg-violet-500/10 text-violet-500 hover:bg-violet-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className={cn("col-span-full p-12 text-center rounded-xl", isDark ? 'bg-neutral-900/50 border border-neutral-800' : 'bg-white border border-neutral-200')}>
              <Users className="w-10 h-10 mx-auto mb-3 text-neutral-400" />
              <p className="text-sm font-medium text-neutral-500">No agents found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Streaming Execution Logs Sidebar */}
      <div className={cn("w-full lg:w-80 flex flex-col rounded-xl border overflow-hidden", isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200')}>
        <div className={cn("p-4 border-b flex items-center justify-between", isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-100 bg-neutral-50')}>
          <div className="flex items-center gap-2">
            <ActivityIcon className="w-4 h-4 text-emerald-500" />
            <h2 className={cn("text-sm font-bold", isDark ? 'text-white' : 'text-neutral-900')}>Live Stream Logs</h2>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll font-mono text-xs">
          {activities.slice(0, 20).map((activity, idx) => (
            <div key={activity.id || idx} className="flex gap-3 animate-in slide-in-from-right-2 duration-300">
              <div className="w-10 text-neutral-500 shrink-0">
                {new Date(activity.created_at).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-violet-400 shrink-0">@{activity.agent_name.replace(/^@+/, '')}</span>
                <span className={cn("ml-2 break-words", isDark ? 'text-neutral-300' : 'text-neutral-700')}>
                  {activity.action}
                </span>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center p-4 text-neutral-500 font-sans text-sm">Waiting for agent activity...</div>
          )}
        </div>
      </div>

      {triggerAgent && (
        <AgentTriggerModal agentName={triggerAgent.name} isOpen={!!triggerAgent} onClose={() => setTriggerAgent(null)} theme={theme} />
      )}
    </div>
  );
}
