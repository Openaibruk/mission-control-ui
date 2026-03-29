'use client';

import { Agent, AVAILABLE_MODELS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Settings, Globe, Users, Zap, CheckCircle2, AlertCircle, Loader2, RefreshCw, Server, Cpu, HardDrive, Clock, Key, Briefcase, SlidersHorizontal, Save } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface SettingsViewProps {
  agents: Agent[];
  theme: 'dark' | 'light';
  onUpdateAgent: (agent: Partial<Agent> & { id: string }) => void;
}

interface SettingsData {
  apiKeys: {
    openai: string;
    anthropic: string;
    supabase: string;
  };
  workspace: {
    name: string;
    timezone: string;
    retentionDays: number;
  };
  agentDefaults: {
    maxTokens: number;
    temperature: number;
    systemPrompt: string;
  };
}

interface GatewayStatusResponse {
  connected: boolean;
  status: string;
  health?: Record<string, unknown>;
  uptime?: number;
}

interface GatewayLiveResponse {
  vps?: {
    status: string;
    uptime: number;
    cpu: number;
    memory: { total: number; used: number; percent: number };
    disk: { percent: number };
    load: string;
  };
  gateway?: {
    status: string;
    uptime: number;
    sessions: number;
  };
}

function formatUptime(seconds: number): string {
  if (!seconds) return 'N/A';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function SettingsView({ agents, theme, onUpdateAgent }: SettingsViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [globalModel, setGlobalModel] = useState('');
  const [activeModel, setActiveModel] = useState('');
  const [savingGlobalModel, setSavingGlobalModel] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatusResponse | null>(null);
  const [gatewayLive, setGatewayLive] = useState<GatewayLiveResponse | null>(null);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Fetch model
  useEffect(() => {
    async function fetchModel() {
      try {
        const res = await fetch('/api/model');
        if (res.ok) {
          const data = await res.json();
          setActiveModel(data.activeModel);
          setGlobalModel(data.activeModel);
        }
      } catch {
        // silent
      } finally {
        setLoadingModel(false);
      }
    }
    fetchModel();
  }, []);

  // Fetch gateway status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const [statusRes, liveRes] = await Promise.all([
          fetch('/api/gateway-status').catch(() => null),
          fetch('/api/gateway-live').catch(() => null),
        ]);
        if (statusRes?.ok) setGatewayStatus(await statusRes.json());
        if (liveRes?.ok) setGatewayLive(await liveRes.json());
      } catch {
        // silent
      }
    }
    fetchStatus();
    const timer = setInterval(fetchStatus, 30000);
    return () => clearInterval(timer);
  }, []);

  // Fetch API Settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          setSettings(await res.json());
        }
      } catch {
        showToast('error', 'Failed to load advanced settings');
      } finally {
        setLoadingSettings(false);
      }
    }
    fetchSettings();
  }, [showToast]);

  const handleSaveGlobal = async () => {
    if (!globalModel || globalModel === activeModel) return;
    setSavingGlobalModel(true);
    try {
      const res = await fetch('/api/model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: globalModel }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveModel(globalModel);
        showToast('success', `Model switched to ${globalModel}. Gateway restarting...`);
      } else {
        showToast('error', data.error || 'Failed to update model');
      }
    } catch {
      showToast('error', 'Network error — could not reach API');
    } finally {
      setSavingGlobalModel(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('success', 'Workspace settings saved successfully.');
      } else {
        showToast('error', 'Failed to save settings.');
      }
    } catch {
      showToast('error', 'Network error — could not reach API');
    } finally {
      setSavingSettings(false);
    }
  };

  const updateSettingsField = (section: keyof SettingsData, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };

  const gwUp = gatewayStatus?.connected || gatewayLive?.gateway?.status === 'online';
  const gwUptime = gatewayLive?.gateway?.uptime || gatewayStatus?.uptime || 0;
  const gwSessions = gatewayLive?.gateway?.sessions ?? null;
  const vpsMemory = gatewayLive?.vps?.memory;
  const vpsCpu = gatewayLive?.vps?.cpu;
  const vpsDisk = gatewayLive?.vps?.disk;
  const vpsUptime = gatewayLive?.vps?.uptime || 0;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-[13px] font-medium transition-all animate-in slide-in-from-top-2",
          toast.type === 'success' ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className={cn("text-lg font-bold flex items-center gap-2", classes.heading)}>
          <Settings className="w-5 h-5 text-violet-400" /> System Settings
        </h2>
        <button
          onClick={handleSaveSettings}
          disabled={savingSettings || loadingSettings || !settings}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Settings
        </button>
      </div>

      {/* Global Model */}
      <div className={cn("rounded-lg p-5", classes.card)}>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-blue-400" />
          <h3 className={cn("text-[14px] font-semibold", classes.heading)}>Default Model</h3>
          {!loadingModel && activeModel && (
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-500 font-medium">{activeModel}</span>
            </div>
          )}
        </div>
        <p className={cn("text-[12px] mb-4 flex-1", classes.muted)}>
          Changes are written to <code className="text-[11px] px-1 py-0.5 rounded bg-black/20">openclaw.json</code> and gateway restarts automatically.
        </p>
        {loadingModel ? (
          <div className="flex items-center gap-2 text-[12px] text-violet-400 mt-auto">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading model...
          </div>
        ) : (
          <div className="flex gap-2 mt-auto">
            <select
              value={globalModel}
              onChange={(e) => setGlobalModel(e.target.value)}
              className={cn("flex-1 rounded-md px-3 py-2 text-[13px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white" : "border-neutral-200 bg-white text-black")}
            >
              {AVAILABLE_MODELS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id === activeModel ? '● ' : ''}{m.label} ({m.provider})
                </option>
              ))}
            </select>
            <button
              onClick={handleSaveGlobal}
              disabled={savingGlobalModel || globalModel === activeModel}
              className={cn(
                "px-4 py-2 rounded-md text-[12px] font-medium transition-colors min-w-[90px] flex items-center justify-center gap-1.5",
                savingGlobalModel
                  ? "bg-amber-600 text-white cursor-wait"
                  : globalModel === activeModel
                    ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-700 text-white"
              )}
            >
              {savingGlobalModel ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying...</>
              ) : globalModel === activeModel ? (
                '✓ Active'
              ) : (
                'Apply'
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys */}
        <div className={cn("rounded-lg p-5", classes.card)}>
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-4 h-4 text-emerald-400" />
            <h3 className={cn("text-[14px] font-semibold", classes.heading)}>API Keys</h3>
          </div>
          {loadingSettings || !settings ? (
             <div className="flex items-center gap-2 text-[12px] text-violet-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading keys...</div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className={cn("block text-[11px] mb-1", classes.muted)}>OpenAI API Key</label>
                <input
                  type="password"
                  value={settings.apiKeys.openai}
                  onChange={e => updateSettingsField('apiKeys', 'openai', e.target.value)}
                  className={cn("w-full rounded-md px-3 py-1.5 text-[12px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white focus:border-emerald-500/50" : "border-neutral-200 bg-white text-black focus:border-emerald-500")}
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className={cn("block text-[11px] mb-1", classes.muted)}>Anthropic API Key</label>
                <input
                  type="password"
                  value={settings.apiKeys.anthropic}
                  onChange={e => updateSettingsField('apiKeys', 'anthropic', e.target.value)}
                  className={cn("w-full rounded-md px-3 py-1.5 text-[12px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white focus:border-emerald-500/50" : "border-neutral-200 bg-white text-black focus:border-emerald-500")}
                  placeholder="sk-ant-..."
                />
              </div>
              <div>
                <label className={cn("block text-[11px] mb-1", classes.muted)}>Supabase Project URL</label>
                <input
                  type="text"
                  value={settings.apiKeys.supabase}
                  onChange={e => updateSettingsField('apiKeys', 'supabase', e.target.value)}
                  className={cn("w-full rounded-md px-3 py-1.5 text-[12px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white focus:border-emerald-500/50" : "border-neutral-200 bg-white text-black focus:border-emerald-500")}
                  placeholder="https://xyz.supabase.co"
                />
              </div>
            </div>
          )}
        </div>

        {/* Workspace Configs */}
        <div className={cn("rounded-lg p-5", classes.card)}>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <h3 className={cn("text-[14px] font-semibold", classes.heading)}>Workspace Configs</h3>
          </div>
          {loadingSettings || !settings ? (
             <div className="flex items-center gap-2 text-[12px] text-violet-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading configs...</div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className={cn("block text-[11px] mb-1", classes.muted)}>Workspace Name</label>
                <input
                  type="text"
                  value={settings.workspace.name}
                  onChange={e => updateSettingsField('workspace', 'name', e.target.value)}
                  className={cn("w-full rounded-md px-3 py-1.5 text-[12px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white focus:border-amber-500/50" : "border-neutral-200 bg-white text-black focus:border-amber-500")}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={cn("block text-[11px] mb-1", classes.muted)}>Timezone</label>
                  <select
                    value={settings.workspace.timezone}
                    onChange={e => updateSettingsField('workspace', 'timezone', e.target.value)}
                    className={cn("w-full rounded-md px-3 py-1.5 text-[12px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white" : "border-neutral-200 bg-white text-black")}
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">EST (New York)</option>
                    <option value="Europe/London">GMT (London)</option>
                    <option value="Asia/Tokyo">JST (Tokyo)</option>
                  </select>
                </div>
                <div>
                  <label className={cn("block text-[11px] mb-1", classes.muted)}>Retention (Days)</label>
                  <input
                    type="number"
                    value={settings.workspace.retentionDays}
                    onChange={e => updateSettingsField('workspace', 'retentionDays', parseInt(e.target.value) || 30)}
                    className={cn("w-full rounded-md px-3 py-1.5 text-[12px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white focus:border-amber-500/50" : "border-neutral-200 bg-white text-black focus:border-amber-500")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Agent Defaults */}
        <div className={cn("rounded-lg p-5", classes.card)}>
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-pink-400" />
            <h3 className={cn("text-[14px] font-semibold", classes.heading)}>Agent Defaults</h3>
          </div>
          {loadingSettings || !settings ? (
             <div className="flex items-center gap-2 text-[12px] text-violet-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading defaults...</div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={cn("block text-[11px] mb-1", classes.muted)}>Max Tokens</label>
                  <input
                    type="number"
                    value={settings.agentDefaults.maxTokens}
                    onChange={e => updateSettingsField('agentDefaults', 'maxTokens', parseInt(e.target.value) || 4096)}
                    className={cn("w-full rounded-md px-3 py-1.5 text-[12px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white focus:border-pink-500/50" : "border-neutral-200 bg-white text-black focus:border-pink-500")}
                  />
                </div>
                <div>
                  <label className={cn("block text-[11px] mb-1", classes.muted)}>Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={settings.agentDefaults.temperature}
                    onChange={e => updateSettingsField('agentDefaults', 'temperature', parseFloat(e.target.value) || 0.7)}
                    className={cn("w-full rounded-md px-3 py-1.5 text-[12px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white focus:border-pink-500/50" : "border-neutral-200 bg-white text-black focus:border-pink-500")}
                  />
                </div>
              </div>
              <div>
                <label className={cn("block text-[11px] mb-1", classes.muted)}>Default System Prompt</label>
                <textarea
                  value={settings.agentDefaults.systemPrompt}
                  onChange={e => updateSettingsField('agentDefaults', 'systemPrompt', e.target.value)}
                  rows={3}
                  className={cn("w-full rounded-md px-3 py-2 text-[12px] outline-none border resize-none", isDark ? "border-white/10 bg-black/20 text-white focus:border-pink-500/50" : "border-neutral-200 bg-white text-black focus:border-pink-500")}
                />
              </div>
            </div>
          )}
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
                <select defaultValue="" className={cn("w-48 rounded-md px-3 py-1.5 text-[11px] outline-none border", isDark ? "border-white/10 bg-black/20 text-white" : "border-neutral-200 bg-white text-black")}>
                  <option value="">Use Default</option>
                  {AVAILABLE_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Info — LIVE */}
      <div className={cn("rounded-lg p-5", classes.card)}>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className={cn("text-[14px] font-semibold", classes.heading)}>System Info</h3>
          <div className="ml-auto flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", gwUp ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
            <span className={cn("text-[10px] font-medium", gwUp ? "text-emerald-500" : "text-red-500")}>
              {gwUp ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SystemInfoItem icon={<Server className="w-3.5 h-3.5 text-blue-400" />} label="Gateway" value={gwUp ? 'Connected' : 'Offline'} isDark={isDark} classes={classes} />
          <SystemInfoItem icon={<Clock className="w-3.5 h-3.5 text-violet-400" />} label="GW Uptime" value={formatUptime(gwUptime)} isDark={isDark} classes={classes} />
          <SystemInfoItem icon={<Clock className="w-3.5 h-3.5 text-cyan-400" />} label="VPS Uptime" value={formatUptime(vpsUptime)} isDark={isDark} classes={classes} />
          <SystemInfoItem icon={<Users className="w-3.5 h-3.5 text-amber-400" />} label="Sessions" value={gwSessions !== null ? String(gwSessions) : 'N/A'} isDark={isDark} classes={classes} />
          <SystemInfoItem icon={<Cpu className="w-3.5 h-3.5 text-pink-400" />} label="CPU" value={vpsCpu !== undefined ? `${vpsCpu}%` : 'N/A'} isDark={isDark} classes={classes} />
          <SystemInfoItem
            icon={<HardDrive className="w-3.5 h-3.5 text-emerald-400" />}
            label="Memory"
            value={vpsMemory ? `${vpsMemory.used}/${vpsMemory.total} MB (${vpsMemory.percent}%)` : 'N/A'}
            isDark={isDark}
            classes={classes}
          />
          <SystemInfoItem icon={<HardDrive className="w-3.5 h-3.5 text-orange-400" />} label="Disk" value={vpsDisk ? `${vpsDisk.percent}% used` : 'N/A'} isDark={isDark} classes={classes} />
          <SystemInfoItem icon={<RefreshCw className="w-3.5 h-3.5 text-blue-400" />} label="Active Model" value={activeModel || 'N/A'} isDark={isDark} classes={classes} />
        </div>

        <div className={cn("mt-4 pt-3 border-t grid grid-cols-3 gap-3 text-center", isDark ? "border-white/10" : "border-neutral-200")}>
          <div>
            <div className={cn("text-[10px]", classes.muted)}>Runtime</div>
            <div className={cn("text-[12px] font-medium", classes.heading)}>OpenClaw</div>
          </div>
          <div>
            <div className={cn("text-[10px]", classes.muted)}>Host</div>
            <div className={cn("text-[12px] font-medium", classes.heading)}>Linux x64</div>
          </div>
          <div>
            <div className={cn("text-[10px]", classes.muted)}>Frontend</div>
            <div className={cn("text-[12px] font-medium", classes.heading)}>Next.js + Vercel</div>
          </div>
        </div>
      </div>

    </div>
  );
}

function SystemInfoItem({ icon, label, value, isDark, classes }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isDark: boolean;
  classes: ReturnType<typeof useThemeClasses>;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 p-2.5 rounded-md", isDark ? "bg-white/[0.03]" : "bg-neutral-50")}>
      {icon}
      <div className="flex-1 min-w-0">
        <div className={cn("text-[10px]", classes.muted)}>{label}</div>
        <div className={cn("text-[12px] font-medium truncate", classes.heading)}>{value}</div>
      </div>
    </div>
  );
}
