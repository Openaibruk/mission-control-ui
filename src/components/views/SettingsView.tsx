'use client';

import { Agent, AVAILABLE_MODELS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Settings, Globe, Users, Zap, CheckCircle2, AlertCircle, Loader2, RefreshCw, Server, Cpu, HardDrive, Clock } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface SettingsViewProps {
  agents: Agent[];
  theme: 'dark' | 'light';
  onUpdateAgent: (agent: Partial<Agent> & { id: string }) => void;
}

interface ModelApiResponse {
  primary: string;
  mainAgentModel: string | null;
  activeModel: string;
  fallbacks: string[];
  availableModels: string[];
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
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatusResponse | null>(null);
  const [gatewayLive, setGatewayLive] = useState<GatewayLiveResponse | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Fetch current model on mount
  useEffect(() => {
    async function fetchModel() {
      try {
        const res = await fetch('/api/model');
        if (res.ok) {
          const data: ModelApiResponse = await res.json();
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

  const handleSaveGlobal = async () => {
    if (!globalModel || globalModel === activeModel) return;
    setSaving(true);
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
      setSaving(false);
    }
  };

  const gwUp = gatewayStatus?.connected || gatewayLive?.gateway?.status === 'online';
  const gwUptime = gatewayLive?.gateway?.uptime || gatewayStatus?.uptime || 0;
  const gwSessions = gatewayLive?.gateway?.sessions ?? null;
  const vpsMemory = gatewayLive?.vps?.memory;
  const vpsCpu = gatewayLive?.vps?.cpu;
  const vpsDisk = gatewayLive?.vps?.disk;
  const vpsUptime = gatewayLive?.vps?.uptime || 0;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-[13px] font-medium transition-all animate-in slide-in-from-top-2",
          toast.type === 'success'
            ? "bg-emerald-600 text-white"
            : "bg-red-600 text-white"
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <h2 className={cn("text-lg font-bold flex items-center gap-2", classes.heading)}>
        <Settings className="w-5 h-5 text-violet-400" /> Settings
      </h2>

      {/* Global Model — LIVE */}
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
        <p className={cn("text-[12px] mb-3", classes.muted)}>
          Changes are written to <code className="text-[11px] px-1 py-0.5 rounded bg-black/20">openclaw.json</code> and the gateway restarts automatically.
        </p>
        {loadingModel ? (
          <div className="flex items-center gap-2 text-[12px] text-violet-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading current model...
          </div>
        ) : (
          <div className="flex gap-2">
            <select
              value={globalModel}
              onChange={(e) => setGlobalModel(e.target.value)}
              className={cn("flex-1 rounded-md px-4 py-2.5 text-[13px] outline-none", classes.inputBg)}
            >
              {AVAILABLE_MODELS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id === activeModel ? '● ' : ''}{m.label} ({m.provider}) — {m.description}
                </option>
              ))}
            </select>
            <button
              onClick={handleSaveGlobal}
              disabled={saving || globalModel === activeModel}
              className={cn(
                "px-4 py-2 rounded-md text-[12px] font-medium transition-colors min-w-[90px] flex items-center justify-center gap-1.5",
                saving
                  ? "bg-amber-600 text-white cursor-wait"
                  : globalModel === activeModel
                    ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-700 text-white"
              )}
            >
              {saving ? (
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

        <div className="grid grid-cols-2 gap-3">
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
