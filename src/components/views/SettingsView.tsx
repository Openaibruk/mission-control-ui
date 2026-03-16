'use client';

import { Agent, AVAILABLE_MODELS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Settings, Globe, Users, Zap } from 'lucide-react';
import { useState } from 'react';

interface SettingsViewProps {
  agents: Agent[];
  theme: 'dark' | 'light';
  onUpdateAgent: (agent: Partial<Agent> & { id: string }) => void;
}

export function SettingsView({ agents, theme, onUpdateAgent }: SettingsViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [globalModel, setGlobalModel] = useState('google/gemini-3.1-pro-preview');
  const [saved, setSaved] = useState(false);

  const handleSaveGlobal = () => {
    // In a real implementation, this would call the OpenClaw API to change the default model
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <h2 className={cn("text-lg font-bold flex items-center gap-2", classes.heading)}>
        <Settings className="w-5 h-5 text-violet-400" /> Settings
      </h2>

      {/* Global Model */}
      <div className={cn("rounded-lg p-5", classes.card)}>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-blue-400" />
          <h3 className={cn("text-[14px] font-semibold", classes.heading)}>Default Model</h3>
        </div>
        <p className={cn("text-[12px] mb-3", classes.muted)}>
          This model is used for all agents unless overridden per-agent below. Changes take effect on next session.
        </p>
        <div className="flex gap-2">
          <select value={globalModel} onChange={(e) => setGlobalModel(e.target.value)}
            className={cn("flex-1 rounded-md px-4 py-2.5 text-[13px] outline-none", classes.inputBg)}>
            {AVAILABLE_MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.label} ({m.provider}) — {m.description}</option>
            ))}
          </select>
          <button onClick={handleSaveGlobal}
            className={cn("px-4 py-2 rounded-md text-[12px] font-medium transition-colors min-w-[80px]",
              saved ? "bg-emerald-600 text-white" : "bg-violet-600 hover:bg-violet-700 text-white")}>
            {saved ? '✓ Saved' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Per-Agent Model Override */}
      <div className={cn("rounded-lg p-5", classes.card)}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-violet-400" />
          <h3 className={cn("text-[14px] font-semibold", classes.heading)}>Agent Model Overrides</h3>
        </div>
        <p className={cn("text-[12px] mb-4", classes.muted)}>
          Override the model for specific agents. Leave blank to use the global default.
        </p>
        <div className="space-y-3">
          {agents.map(agent => (
            <div key={agent.id} className={cn("flex items-center gap-3 p-3 rounded-md", isDark ? "bg-white/[0.03]" : "bg-neutral-50")}>
              <div className="flex-1 min-w-0">
                <div className={cn("text-[12px] font-semibold", classes.heading)}>{agent.name}</div>
                <div className={cn("text-[10px]", classes.muted)}>{agent.role}</div>
              </div>
              <select defaultValue="" className={cn("w-48 rounded-md px-3 py-1.5 text-[11px] outline-none", classes.inputBg)}>
                <option value="">Use Default</option>
                {AVAILABLE_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className={cn("rounded-lg p-5", classes.card)}>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className={cn("text-[14px] font-semibold", classes.heading)}>System Info</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Runtime', value: 'OpenClaw Gateway' },
            { label: 'Host', value: 'Linux x64' },
            { label: 'Node', value: 'v22.22.1' },
            { label: 'Default Model', value: 'Gemini Pro' },
            { label: 'Backend', value: 'Supabase' },
            { label: 'Frontend', value: 'Next.js 16 + Vercel' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className={cn("text-[12px]", classes.muted)}>{item.label}</span>
              <span className={cn("text-[12px] font-medium", classes.heading)}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
