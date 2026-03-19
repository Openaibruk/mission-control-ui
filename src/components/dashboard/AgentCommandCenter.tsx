'use client';

import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Terminal, Zap, Send, ChevronRight, Activity, Bot, Shield, Code, BarChart3, Cpu } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface AgentStatus {
  name: string;
  role: string;
  status: 'active' | 'idle' | 'offline';
  currentTask?: string;
  lastActive?: string;
  emoji: string;
}

interface LogEntry {
  id: string;
  time: string;
  agent: string;
  action: string;
  type: 'task' | 'deploy' | 'alert' | 'info' | 'success';
}

// Agent status is loaded from Supabase, not hardcoded
const AGENT_EMOJIS: Record<string, string> = {
  Nova: '⚡', Henok: '🔨', Cinder: '🔍', Kiro: '🏗️', Nahom: '📈',
  Bini: '✍️', Lidya: '🎨', Amen: '📊', Forge: '⚒️', Onyx: '🛡️',
};

const INITIAL_LOGS: LogEntry[] = [];

const QUICK_COMMANDS = [
  { label: 'Refresh Graph', icon: Zap, action: 'refresh-graph' },
  { label: 'Scan Gateway', icon: Activity, action: 'scan-gateway' },
  { label: 'Run Audit', icon: Shield, action: 'run-audit' },
  { label: 'Deploy', icon: Code, action: 'deploy' },
  { label: 'Agent Status', icon: Bot, action: 'agent-status' },
  { label: 'Token Costs', icon: BarChart3, action: 'token-costs' },
];

export function AgentCommandCenter() {
  const isDark = true;
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [command, setCommand] = useState('');
  const [executing, setExecuting] = useState(false);
  const [agentList, setAgentList] = useState<AgentStatus[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Load real agents from Supabase
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const { data: agents } = await supabase.from('agents').select('*');
        const { data: tasks } = await supabase.from('tasks').select('id,status,assignees').in('status', ['in_progress', 'assigned', 'review']);
        if (agents) {
          const mapped: AgentStatus[] = agents.map((a: any) => {
            const name = (a.name || '').replace(/^@+/, '');
            const hasActiveTask = tasks?.some((t: any) => t.assignees?.some((as: string) => as.replace(/^@+/, '') === name));
            return {
              name,
              role: a.role || 'Agent',
              status: hasActiveTask ? 'active' : (a.status || 'offline') as 'active' | 'idle' | 'offline',
              emoji: AGENT_EMOJIS[name] || '🤖',
              currentTask: hasActiveTask ? 'Working on tasks' : undefined,
            };
          });
          setAgentList(mapped);
        }
      } catch (e) {
        console.error('Failed to load agents:', e);
      }
    };
    loadAgents();
    const interval = setInterval(loadAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load real activities from Supabase
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (data) {
          const mapped: LogEntry[] = data.map((a: any) => {
            const d = new Date(a.created_at);
            return {
              id: a.id,
              time: d.toTimeString().slice(0, 5),
              agent: (a.agent_name || 'Unknown').replace(/^@+/, ''),
              action: a.action,
              type: a.action.includes('✅') || a.action.includes('complete') ? 'success' as const
                : a.action.includes('deploy') ? 'deploy' as const
                : a.action.includes('❌') || a.action.includes('error') ? 'alert' as const
                : 'task' as const,
            };
          });
          setLogs(mapped);
        }
      } catch (e) {
        console.error('Failed to load activities:', e);
      }
    };
    loadActivities();
    // Refresh every 30s
    const interval = setInterval(loadActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const executeCommand = useCallback(async (cmd: string) => {
    if (!cmd.trim()) return;
    setExecuting(true);
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const cmdLog: LogEntry = {
      id: Date.now().toString(),
      time,
      agent: 'You',
      action: `→ ${cmd}`,
      type: 'info',
    };
    setLogs(prev => [...prev, cmdLog]);

    // Simulate response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'refresh-graph': 'Nova: Graph data refreshed — 2,209 nodes, 4,286 edges',
        'scan-gateway': 'Nova: Gateway status scanned — Online, Paperclip — Online',
        'run-audit': 'Cinder: Audit in progress — checking all pages for stale data',
        'deploy': 'Forge: Triggering Vercel deployment for mission-control-ui...',
        'agent-status': `Nova: ${agentList.filter(a => a.status === 'active').length} active, ${agentList.filter(a => a.status === 'idle').length} idle, ${agentList.filter(a => a.status === 'offline').length} offline`,
        'token-costs': 'Nova: Total $2.37, 3,530 calls, 6 models — cheapest: mimo-v2-pro ($0/token)',
      };

      const response = responses[cmd] || `Nova: Command "${cmd}" received — processing...`;
      const respLog: LogEntry = {
        id: (Date.now() + 1).toString(),
        time: `${now.getHours().toString().padStart(2, '0')}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
        agent: 'Nova',
        action: response,
        type: 'success',
      };
      setLogs(prev => [...prev, respLog]);
      setExecuting(false);
    }, 800);

    setCommand('');
  }, [agentList]);

  const logTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'text-blue-400';
      case 'deploy': return 'text-violet-400';
      case 'alert': return 'text-red-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-neutral-400';
    }
  };

  const logTypePrefix = (type: string) => {
    switch (type) {
      case 'task': return '📋';
      case 'deploy': return '🚀';
      case 'alert': return '⚠️';
      case 'success': return '✅';
      default: return '▸';
    }
  };

  const activeCount = agentList.filter(a => a.status === 'active').length;
  const idleCount = agentList.filter(a => a.status === 'idle').length;

  return (
    <div className="rounded-lg border border-neutral-800/50 bg-neutral-900/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Agent Command Center</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-neutral-400">{activeCount} active</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[10px] text-neutral-400">{idleCount} idle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent status bar */}
      <div className="px-4 py-3 border-b border-neutral-800/50 overflow-x-auto">
        <div className="flex gap-2">
          {agentList.map(agent => (
            <div key={agent.name} className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] whitespace-nowrap transition-all',
              agent.status === 'active' ? 'bg-emerald-500/10 border border-emerald-500/20' :
              agent.status === 'idle' ? 'bg-amber-500/10 border border-amber-500/20' :
              'bg-neutral-800/50 border border-neutral-800 opacity-50'
            )}>
              <span className="text-[11px]">{agent.emoji}</span>
              <span className="font-medium text-neutral-300">{agent.name}</span>
              <span className={cn(
                'w-1.5 h-1.5 rounded-full',
                agent.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                agent.status === 'idle' ? 'bg-amber-400' : 'bg-neutral-600'
              )} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick commands */}
      <div className="px-4 py-2 border-b border-neutral-800/50 flex gap-1.5 flex-wrap">
        {QUICK_COMMANDS.map(cmd => {
          const Icon = cmd.icon;
          return (
            <button key={cmd.action} onClick={() => executeCommand(cmd.action)}
              className="flex items-center gap-1 px-2 py-1 rounded text-[9px] bg-neutral-800/60 hover:bg-emerald-500/20 text-neutral-400 hover:text-emerald-400 transition-colors">
              <Icon className="w-3 h-3" />
              {cmd.label}
            </button>
          );
        })}
      </div>

      {/* Log output */}
      <div className="p-3 h-[260px] overflow-y-auto custom-scrollbar font-mono text-[10px]">
        <div className="text-emerald-500/60 mb-2">// Agent Command Center — type a command or use quick actions</div>
        {logs.map(log => (
          <div key={log.id} className="flex gap-2 py-0.5 hover:bg-white/[0.02] px-1 rounded">
            <span className="text-neutral-600 shrink-0">{log.time}</span>
            <span className="text-neutral-500 shrink-0">{logTypePrefix(log.type)}</span>
            <span className="text-neutral-300 font-semibold shrink-0 w-14">{log.agent}</span>
            <span className={cn(logTypeColor(log.type), 'flex-1')}>{log.action}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Command input */}
      <div className="px-4 py-3 border-t border-neutral-800/50 flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
        <input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && executeCommand(command)}
          placeholder="Type a command... (e.g., refresh-graph, scan-gateway, deploy)"
          className="flex-1 bg-transparent text-[11px] text-neutral-200 placeholder-neutral-600 outline-none font-mono"
          disabled={executing}
        />
        <button onClick={() => executeCommand(command)}
          className={cn(
            'p-1.5 rounded transition-colors',
            executing ? 'text-neutral-600' : 'text-emerald-400 hover:bg-emerald-500/20'
          )}>
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
