'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Agent } from '@/lib/types';
import {
  Monitor, Coffee, FileText, Bug, Zap, Loader2, CheckCircle2,
  AlertCircle, Wifi, WifiOff, MessageSquare, Send
} from 'lucide-react';

interface OfficeViewProps {
  theme: 'dark' | 'light';
  agents: Agent[];
  gatewayStatus: { connected: boolean; status: string };
}

type AgentStatus = 'idle' | 'working' | 'researching' | 'executing' | 'syncing' | 'error';

interface OfficeAgent {
  id: string;
  name: string;
  emoji: string;
  status: AgentStatus;
  department: string;
  task: string;
  lastActive: string;
}

const STATUS_CONFIG: Record<AgentStatus, { label: string; color: string; icon: React.ReactNode; area: string }> = {
  idle: { label: 'Idle', color: 'bg-gray-500/20 text-gray-400', icon: <Coffee className="w-3 h-3" />, area: 'Lounge' },
  working: { label: 'Working', color: 'bg-emerald-500/20 text-emerald-400', icon: <Monitor className="w-3 h-3" />, area: 'Desks' },
  researching: { label: 'Researching', color: 'bg-blue-500/20 text-blue-400', icon: <FileText className="w-3 h-3" />, area: 'Library' },
  executing: { label: 'Executing', color: 'bg-violet-500/20 text-violet-400', icon: <Zap className="w-3 h-3" />, area: 'Workshop' },
  syncing: { label: 'Syncing', color: 'bg-amber-500/20 text-amber-400', icon: <Loader2 className="w-3 h-3 animate-spin" />, area: 'Server Room' },
  error: { label: 'Error', color: 'bg-red-500/20 text-red-400', icon: <AlertCircle className="w-3 h-3" />, area: 'Bug Zone' },
};

const OFFICE_AREAS = [
  { id: 'lounge', name: 'Lounge', x: 0, y: 0, w: 3, h: 2, emoji: '🛋️', bg: 'from-gray-800/50 to-gray-900/50' },
  { id: 'desks', name: 'Workstations', x: 3, y: 0, w: 4, h: 2, emoji: '💻', bg: 'from-emerald-900/30 to-gray-900/50' },
  { id: 'library', name: 'Research Lab', x: 7, y: 0, w: 3, h: 2, emoji: '📚', bg: 'from-blue-900/30 to-gray-900/50' },
  { id: 'workshop', name: 'Workshop', x: 0, y: 2, w: 3, h: 2, emoji: '🔧', bg: 'from-violet-900/30 to-gray-900/50' },
  { id: 'server', name: 'Server Room', x: 3, y: 2, w: 4, h: 2, emoji: '🖥️', bg: 'from-amber-900/30 to-gray-900/50' },
  { id: 'bugzone', name: 'Bug Zone', x: 7, y: 2, w: 3, h: 2, emoji: '🐛', bg: 'from-red-900/30 to-gray-900/50' },
];

export function OfficeView({ theme, agents, gatewayStatus }: OfficeViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [officeAgents, setOfficeAgents] = useState<OfficeAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<OfficeAgent | null>(null);
  const [chatInput, setChatInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  // Map Supabase agents to office agents
  useEffect(() => {
    const mapped: OfficeAgent[] = agents.map(a => {
      const statuses: AgentStatus[] = ['idle', 'working', 'researching', 'executing'];
      const status = a.status === 'active' ? statuses[Math.floor(Math.random() * statuses.length)] : 'idle';
      return {
        id: a.id,
        name: a.name,
        emoji: a.avatar_emoji || '🤖',
        status,
        department: a.department || 'General',
        task: a.role || 'Standing by',
        lastActive: a.last_active_at,
      };
    });
    setOfficeAgents(mapped);
  }, [agents]);

  // Connect to Gateway WebSocket for live status
  useEffect(() => {
    const wsUrl = `ws://${window.location.hostname}:3201`;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'agent_status') {
            setOfficeAgents(prev => prev.map(a =>
              a.id === data.agentId ? { ...a, status: data.status, task: data.task } : a
            ));
          }
        } catch {}
      };
      ws.onerror = () => {};
      return () => ws.close();
    } catch {}
  }, []);

  const getAgentsInArea = (areaId: string) => {
    const areaStatusMap: Record<string, AgentStatus[]> = {
      lounge: ['idle'],
      desks: ['working'],
      library: ['researching'],
      workshop: ['executing'],
      server: ['syncing'],
      bugzone: ['error'],
    };
    const statuses = areaStatusMap[areaId] || [];
    return officeAgents.filter(a => statuses.includes(a.status));
  };

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || !selectedAgent) return;
    setChatInput('');
    // In production, this would send via the Gateway
  }, [chatInput, selectedAgent]);

  return (
    <div className="flex h-full">
      {/* Main Office Floor Plan */}
      <div className="flex-1 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={cn("text-lg font-semibold", classes.heading)}>🏢 Virtual Office</h2>
            <p className={cn("text-xs", classes.muted)}>
              {officeAgents.filter(a => a.status !== 'idle').length} agents active • {officeAgents.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            {gatewayStatus.connected ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Wifi className="w-3 h-3" /> Gateway Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-red-400">
                <WifiOff className="w-3 h-3" /> Disconnected
              </span>
            )}
          </div>
        </div>

        {/* Floor Plan Grid */}
        <div className="grid grid-cols-10 grid-rows-4 gap-2" style={{ minHeight: '400px' }}>
          {OFFICE_AREAS.map(area => {
            const areaAgents = getAgentsInArea(area.id);
            return (
              <div
                key={area.id}
                className={cn(
                  "rounded-xl border p-3 bg-gradient-to-br relative overflow-hidden transition-all hover:scale-[1.02]",
                  isDark ? "border-white/5" : "border-gray-200",
                  area.bg
                )}
                style={{
                  gridColumn: `${area.x + 1} / span ${area.w}`,
                  gridRow: `${area.y + 1} / span ${area.h}`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-lg">{area.emoji}</span>
                  <span className={cn("text-xs font-medium", classes.heading)}>{area.name}</span>
                  <span className={cn("text-[10px] ml-auto", classes.muted)}>{areaAgents.length}</span>
                </div>

                {/* Agent Avatars in this area */}
                <div className="flex flex-wrap gap-2">
                  {areaAgents.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all hover:scale-110",
                        selectedAgent?.id === agent.id && "ring-2 ring-violet-500"
                      )}
                    >
                      <div className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
                        {agent.emoji}
                      </div>
                      <span className={cn("text-[9px] truncate max-w-[60px]", classes.muted)}>
                        {agent.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Legend */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {(Object.entries(STATUS_CONFIG) as [AgentStatus, typeof STATUS_CONFIG[AgentStatus]][]).map(([key, config]) => (
            <span key={key} className={cn("flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border", config.color)}>
              {config.icon} {config.label}
            </span>
          ))}
        </div>
      </div>

      {/* Agent Detail Panel */}
      {selectedAgent && (
        <div className={cn("w-80 border-l p-4 overflow-y-auto", isDark ? "border-white/5 bg-black/20" : "border-gray-200 bg-gray-50")}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{selectedAgent.emoji}</span>
              <div>
                <h3 className={cn("font-semibold text-sm", classes.heading)}>{selectedAgent.name}</h3>
                <p className={cn("text-xs", classes.muted)}>{selectedAgent.department}</p>
              </div>
            </div>
            <button onClick={() => setSelectedAgent(null)} className={cn("text-xs", classes.muted)}>✕</button>
          </div>

          <div className={cn("rounded-lg p-3 mb-3 border", isDark ? "border-white/5 bg-white/3" : "border-gray-200 bg-white")}>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] border", STATUS_CONFIG[selectedAgent.status].color)}>
                {STATUS_CONFIG[selectedAgent.status].icon} {STATUS_CONFIG[selectedAgent.status].label}
              </span>
            </div>
            <p className={cn("text-xs", classes.muted)}>Current task:</p>
            <p className={cn("text-sm mt-1", classes.heading)}>{selectedAgent.task}</p>
          </div>

          {/* Quick Chat */}
          <div className={cn("rounded-lg border p-3", isDark ? "border-white/5" : "border-gray-200")}>
            <div className="flex items-center gap-1 mb-2">
              <MessageSquare className="w-3 h-3" />
              <span className={cn("text-xs font-medium", classes.heading)}>Chat with {selectedAgent.name}</span>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Send a message..."
                className={cn("flex-1 text-xs px-2 py-1.5 rounded border outline-none", isDark ? "bg-white/5 border-white/10 text-white placeholder:text-neutral-500" : "bg-white border-gray-200")}
              />
              <button
                onClick={handleSendMessage}
                className="p-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
