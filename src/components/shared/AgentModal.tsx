'use client';

import { cn, AGENT_STATUS_COLORS, getThemeClasses } from '@/lib/utils';
import { Agent } from '@/lib/types';
import { X, Bot } from 'lucide-react';

interface AgentModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export default function AgentModal({ agent, isOpen, onClose, theme }: AgentModalProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-lg rounded-xl border shadow-2xl", classes.card)}>
        <div className={cn("flex items-center justify-between px-5 py-4 border-b", classes.divider)}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{agent.avatar_emoji || '🤖'}</span>
            <h3 className={cn("text-sm font-semibold", classes.heading)}>{agent.name}</h3>
          </div>
          <button onClick={onClose} className={cn("p-1 rounded", classes.hover)}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Info label="Department" value={agent.department} classes={classes} />
            <Info label="Role" value={agent.role} classes={classes} />
            <Info label="Status" value={
              <span className={cn(
                "inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full capitalize",
                agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                agent.status === 'idle' ? 'bg-amber-500/10 text-amber-400' :
                'bg-neutral-500/10 text-neutral-400'
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", AGENT_STATUS_COLORS[agent.status])} />
                {agent.status}
              </span>
            } classes={classes} />
            <Info label="Tasks Completed" value={agent.tasks_completed?.toString() || '0'} classes={classes} />
            <Info label="Budget Spent" value={`$${(agent.budget_spent_usd || 0).toFixed(2)}`} classes={classes} />
            <Info label="Budget Monthly" value={`$${(agent.budget_monthly_usd || 0).toFixed(2)}`} classes={classes} />
            <Info label="Org Level" value={(agent.org_level || 0).toString()} classes={classes} />
          </div>
          {agent.goals && agent.goals.length > 0 && (
            <div>
              <div className={cn("text-xs font-semibold mb-1.5", classes.heading)}>Goals</div>
              <ul className="space-y-1">
                {agent.goals.map((goal, i) => (
                  <li key={i} className={cn("text-xs", classes.text)}>• {goal}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, classes }: { label: string; value: React.ReactNode; classes: ReturnType<typeof getThemeClasses> }) {
  return (
    <div>
      <div className={cn("text-[10px] uppercase tracking-wide mb-0.5", classes.muted)}>{label}</div>
      <div className={cn("text-sm", classes.text)}>{value}</div>
    </div>
  );
}
