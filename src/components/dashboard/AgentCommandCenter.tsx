'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme, useThemeClasses } from '@/hooks/useTheme';
import { Terminal, Send, Clock, AlertCircle, CheckCircle, Info, Rocket } from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  agent: string;
  action: string;
  type: 'task' | 'deploy' | 'alert' | 'info' | 'success';
}

interface ActivityLog {
  id: string;
  agent_name: string;
  action: string;
  created_at: string;
}

const formatTimeGMT3 = (date: Date): string => {
  // GMT+3 is East Africa Time (EAT)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Africa/Addis_Ababa',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export function AgentCommandCenter() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [command, setCommand] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [executing, setExecuting] = useState(false);
  const { isDark } = useTheme();
  const classes = useThemeClasses(isDark);
  const { bg, card: cardStyle, divider: border } = classes;
  const text = cardStyle;
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial activity log
    fetch('/api/gateway-status')
      .then(res => res.json())
      .then(data => {
        if (data.activity) {
          const formattedLogs: LogEntry[] = data.activity.map((a: ActivityLog) => {
            const d = new Date(a.created_at);
            return {
              id: a.id,
              time: formatTimeGMT3(d),
              agent: (a.agent_name || 'Unknown').replace(/^@+/, ''),
              action: a.action,
              type: a.action.includes('✅') || a.action.includes('complete') ? 'success' as const
                : a.action.includes('deploy') ? 'deploy' as const
                : a.action.includes('❌') || a.action.includes('error') ? 'alert' as const
                : 'info' as const,
            };
          });
          setLogs(formattedLogs.slice(-50));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || executing) return;

    setExecuting(true);
    const now = new Date();
    const time = formatTimeGMT3(now);

    const cmdLog: LogEntry = {
      id: Date.now().toString(),
      time,
      agent: 'You',
      action: `→ ${command}`,
      type: 'info',
    };
    setLogs(prev => [...prev, cmdLog]);
    setCommand('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: command }),
      });
      const data = await response.json();
      
      const respLog: LogEntry = {
        id: (Date.now() + 1).toString(),
        time: formatTimeGMT3(new Date()),
        agent: 'Nova',
        action: data.message || 'Processed',
        type: 'success',
      };
      setLogs(prev => [...prev, respLog]);
    } catch (error) {
      const errorLog: LogEntry = {
        id: (Date.now() + 1).toString(),
        time: formatTimeGMT3(new Date()),
        agent: 'System',
        action: 'Command execution failed',
        type: 'alert',
      };
      setLogs(prev => [...prev, errorLog]);
    }
    setExecuting(false);
  };

  const logTypePrefix = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-3 h-3 text-emerald-400" />;
      case 'deploy': return <Rocket className="w-3 h-3 text-blue-400" />;
      case 'alert': return <AlertCircle className="w-3 h-3 text-red-400" />;
      default: return <Info className="w-3 h-3 text-neutral-500" />;
    }
  };

  const logTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'deploy': return 'text-blue-400';
      case 'alert': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className={`${bg} border ${border} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-4 h-4 text-cyan-400" />
        <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Agent Command Center</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 text-[9px] text-neutral-500">
          <Clock className="w-3 h-3" />
          <span>GMT+3</span>
        </div>
        <div 
          className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}
          title={isStreaming ? 'Streaming' : 'Paused'}
        />
      </div>

      <div className={`${bg} rounded-md border border-neutral-800/50 p-2 h-48 overflow-y-auto mb-3`}>
        {logs.length === 0 ? (
          <div className="text-neutral-500 text-[11px] text-center py-4">
            No activity yet. Run a command to get started.
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="flex gap-2 py-0.5 hover:bg-white/[0.02] px-1 rounded">
              <span className="text-neutral-600 shrink-0 text-[10px] font-mono">{log.time}</span>
              <span className="text-neutral-500 shrink-0">{logTypePrefix(log.type)}</span>
              <span className="text-neutral-400 shrink-0 w-14 text-[10px] truncate">{log.agent}</span>
              <span className={cn(logTypeColor(log.type), 'flex-1 text-[10px] truncate')}>{log.action}</span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={command}
          onChange={e => setCommand(e.target.value)}
          placeholder="Type a command..."
          className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded px-3 py-1.5 text-[11px] text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
          disabled={executing}
        />
        <button
          type="submit"
          disabled={executing || !command.trim()}
          className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
