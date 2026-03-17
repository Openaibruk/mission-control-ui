'use client';

import { cn, AGENT_STATUS_COLORS, getThemeClasses } from '@/lib/utils';
import { Agent } from '@/lib/types';

interface AgentGridProps {
  agents: Agent[];
  theme: 'dark' | 'light';
  onAgentClick?: (agent: Agent) => void;
}

export default function AgentGrid({ agents, theme, onAgentClick }: AgentGridProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  if (agents.length === 0) {
    return (
      <div className={cn("rounded-xl border p-6 text-center", classes.card)}>
        <p className={cn("text-sm", classes.muted)}>No agents configured</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onAgentClick?.(agent)}
          className={cn(
            "rounded-xl border p-4 text-left transition-colors",
            classes.card,
            isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{agent.avatar_emoji || '🤖'}</span>
            <div className="min-w-0 flex-1">
              <div className={cn("text-sm font-semibold truncate", classes.heading)}>{agent.name}</div>
              <div className={cn("text-xs truncate", classes.muted)}>{agent.department}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full capitalize flex items-center gap-1",
              agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
              agent.status === 'idle' ? 'bg-amber-500/10 text-amber-400' :
              'bg-neutral-500/10 text-neutral-400'
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", AGENT_STATUS_COLORS[agent.status] || 'bg-neutral-500')} />
              {agent.status}
            </span>
            <span className={cn("text-[10px]", classes.muted)}>{agent.role}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
