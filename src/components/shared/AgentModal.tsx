'use client';

import { useState, useEffect } from 'react';
import { Agent, Task, AVAILABLE_MODELS } from '@/lib/types';
import { cn, getAvatar, getAgentStatusInfo } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Save, Trash2, CheckCircle2, Clock, List, BookOpen, Wrench, Zap, Cpu, Brain, Globe, Activity, BarChart3, Shield, Code } from 'lucide-react';
import { ModalWrapper } from './ModalWrapper';

interface AgentModalProps {
  agent: Agent | null;
  isOpen?: boolean;
  isNew?: boolean;
  tasks: Task[];
  onClose: () => void;
  onSave: (agent: Partial<Agent> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  theme: 'dark' | 'light';
}

interface Capability {
  icon: React.ReactNode;
  label: string;
  level: 'strong' | 'capable' | 'limited';
}

// Department → Subteam taxonomy (duplicated from AgentGrid; ideally move to shared)
const DEPARTMENT_SUBTEAM_MAP: Record<string, string[]> = {
  'Orchestration': ['Coordination'],
  'Engineering': ['Build', 'Architecture', 'Integration', 'Infrastructure'],
  'Quality & Safety': ['QA', 'Security'],
  'Analytics & Insights': ['Data Science', 'Business Intelligence', 'Operations Analytics'],
  'Marketing & Content': ['Strategy', 'Content', 'Design'],
  'Research': ['Deep Research'],
  'Unassigned': ['Unassigned'],
  'Inactive': ['Inactive'],
};

// Infer capabilities from model + role as fallback when agent files aren't available
function inferCapabilities(model: string, role: string): Capability[] {
  const lower = model.toLowerCase();
  const caps: Capability[] = [];
  if (lower.includes('claude') || lower.includes('gpt') || lower.includes('gemini') || lower.includes('mimo') || lower.includes('nemotron')) {
    caps.push({ icon: <Brain className="w-4 h-4" />, label: 'Reasoning', level: 'strong' });
    caps.push({ icon: <Code className="w-4 h-4" />, label: 'Code Generation', level: 'strong' });
  }
  caps.push({ icon: <Globe className="w-4 h-4" />, label: 'Web Search', level: 'capable' });
  caps.push({ icon: <BarChart3 className="w-4 h-4" />, label: 'Analysis', level: 'capable' });
  caps.push({ icon: <Shield className="w-4 h-4" />, label: 'Safety Guardrails', level: 'strong' });
  if (lower.includes('auto')) caps.push({ icon: <Zap className="w-4 h-4" />, label: 'Auto-Model Routing', level: 'strong' });
  const r = role.toLowerCase();
  if (r.includes('dev') || r.includes('eng') || r.includes('code')) caps.push({ icon: <Cpu className="w-4 h-4" />, label: 'Software Engineering', level: 'strong' });
  if (r.includes('strateg') || r.includes('analyst')) caps.push({ icon: <Activity className="w-4 h-4" />, label: 'Strategic Planning', level: 'strong' });
  if (r.includes('research')) caps.push({ icon: <BookOpen className="w-4 h-4" />, label: 'Deep Research', level: 'strong' });
  if (r.includes('market')) caps.push({ icon: <Globe className="w-4 h-4" />, label: 'Market Intelligence', level: 'capable' });
  return caps.length > 2 ? caps : [
    { icon: <Brain className="w-4 h-4" />, label: 'Reasoning', level: 'capable' },
    { icon: <Code className="w-4 h-4" />, label: 'Code', level: 'capable' },
    { icon: <Globe className="w-4 h-4" />, label: 'Web', level: 'capable' },
  ];
}

interface AgentFileProfile {
  hasSoul: boolean;
  hasAgents: boolean;
  purpose: string;
  skills: string[];
  soulSnippet: string;
  agentConfig: string;
}

export function AgentModal({ agent, isOpen = false, isNew = false, tasks, onClose, onSave, onDelete, theme }: AgentModalProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'active' | 'idle' | 'offline'>('active');
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [department, setDepartment] = useState('');
  const [subTeam, setSubTeam] = useState('');
  const [soulContent, setSoulContent] = useState('');
  const [isSavingSoul, setIsSavingSoul] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'soul' | 'skills'>('profile');
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  // Profile data fetched from actual agent files
  const [agentFileProfile, setAgentFileProfile] = useState<AgentFileProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (agent && !isNew) {
      setName(agent.name); setRole(agent.role || ''); setStatus(agent.status);
      setModel(agent.model || ''); setPrompt(agent.prompt || '');
      setDepartment(agent.department || ''); setSubTeam(agent.subTeam || '');
    } else {
      setName(''); setRole(''); setStatus('active'); setModel(''); setPrompt(''); setDepartment(''); setSubTeam('');
    }
  }, [agent, isNew]);

  useEffect(() => {
    if (isNew || !agent) return;
    fetch(`/api/activities/last?agent=${encodeURIComponent(agent.name)}`)
      .then(res => res.json())
      .then(data => { if (data.timestamp) setLastActivity(new Date(data.timestamp)); })
      .catch(() => {
        const agentTag = `@${agent.name}`;
        const agentTasks = tasks.filter(t => t.assignees?.includes(agentTag));
        const latest = agentTasks.map(t => new Date(t.updated_at || t.created_at)).sort((a, b) => b.getTime() - a.getTime())[0];
        if (latest) setLastActivity(latest);
      });
  }, [agent, isNew, tasks]);

  useEffect(() => {
    fetch('/api/files?path=SOUL.md&t=' + Date.now())
      .then(res => res.text())
      .then(text => setSoulContent(text))
      .catch(err => console.error('Failed to load SOUL.md:', err));
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => { if (data.skills) setSkills(data.skills); })
      .catch(err => console.error('Failed to load skills:', err));
  }, []);

  // Fetch agent-specific profile from actual files (SOUL.md & AGENTS.md)
  useEffect(() => {
    if (!agent || isNew) { setAgentFileProfile(null); return; }
    setLoadingProfile(true);
    fetch(`/api/agents/agent-files?agent=${encodeURIComponent(agent.name)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setAgentFileProfile(data);
        else setAgentFileProfile(null);
      })
      .catch(err => { console.error('Failed to load agent file profile:', err); setAgentFileProfile(null); })
      .finally(() => setLoadingProfile(false));
  }, [agent?.name, isNew]);

  const handleSave = () => {
    if (!name.trim()) return;
    const data: Partial<Agent> & { id?: string } = {
      name: name.trim(),
      role: role.trim(),
      status,
      model,
      department: department || undefined,
      subTeam: subTeam || undefined,
    };
    if (!isNew && agent) data.id = agent.id;
    onSave(data);
    onClose();
  };

  const handleSaveSoul = async () => {
    setIsSavingSoul(true);
    try {
      await fetch('/api/files/save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: 'SOUL.md', content: soulContent }),
      });
    } catch (error) { console.error('Error saving SOUL.md:', error); }
    setIsSavingSoul(false);
  };

  const agentTag = agent ? `@${agent.name}` : '';
  const doneCount = tasks.filter(t => t.status === 'done' && t.assignees?.includes(agentTag)).length;
  const activeCount = tasks.filter(t => ['assigned', 'in_progress', 'review'].includes(t.status) && t.assignees?.includes(agentTag)).length;
  const totalCount = tasks.filter(t => t.assignees?.includes(agentTag)).length;
  const capabilities = inferCapabilities(model || '', role || '');
  const liveStatus = getAgentStatusInfo(lastActivity);

  const getLiveStatus = () => {
    if (status === 'offline') return { label: 'Offline', color: 'text-neutral-400', bg: 'bg-neutral-500/20' };
    if (!lastActivity) return { label: status === 'active' ? 'Active' : 'Idle', color: status === 'active' ? 'text-emerald-400' : 'text-amber-400', bg: status === 'active' ? 'bg-emerald-500/20' : 'bg-amber-500/20' };
    const mins = Math.round((Date.now() - lastActivity.getTime()) / 60000);
    if (mins < 2) return { label: '🟢 Working Now', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (mins < 10) return { label: '🟡 Recently Active', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    if (mins < 30) return { label: '🔵 Active Today', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    return { label: '⚫ Idle', color: 'text-neutral-400', bg: 'bg-neutral-500/20' };
  };
  const liveStatusInfo = getLiveStatus();

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      {({ animationPhase }) => (
        <div className={cn(
          "relative modal-panel p-6 shadow-2xl max-h-[90vh] overflow-y-auto rounded-xl border w-full max-w-2xl",
          classes.card,
          "transform transition-all duration-200",
          animationPhase === 'exiting' ? 'opacity-0 scale-95 translate-y-2' : ''
        )}>
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h3 className={cn("text-[16px] font-semibold", classes.heading)}>
              {isNew ? '🤖 New Agent' : '🔧 Agent Profile'}
            </h3>
            <button onClick={onClose}
              className={cn("p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[32px] min-h-[32px] flex items-center justify-center transition-colors", classes.muted)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Agent identity bar */}
          {!isNew && agent && (
            <div className="flex items-center justify-between mb-5 p-3 rounded-lg bg-gradient-to-r from-violet-500/5 to-blue-500/5 border border-violet-500/10">
              <div className="flex items-center space-x-4">
                <img src={getAvatar(agent.name)} alt={agent.name} className="w-14 h-14 rounded-xl border-2 border-neutral-700 shadow-lg" />
                <div>
                  <div className={cn("text-lg font-bold", classes.heading)}>{agent.name}</div>
                  {role && <div className={cn("text-[12px]", classes.muted)}>{role}</div>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", liveStatusInfo.bg, liveStatusInfo.color)}>
                      {liveStatusInfo.label}
                    </span>
                    {agent.created_at && <span className={cn("text-[10px]", classes.subtle)}>Since {new Date(agent.created_at).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                <div><div className="text-xl font-bold text-emerald-500">{doneCount}</div><div className={cn("text-[9px] uppercase font-semibold", classes.subtle)}>Done</div></div>
                <div><div className="text-xl font-bold text-amber-500">{activeCount}</div><div className={cn("text-[9px] uppercase font-semibold", classes.subtle)}>Active</div></div>
                <div><div className="text-xl font-bold text-violet-500">{totalCount}</div><div className={cn("text-[9px] uppercase font-semibold", classes.subtle)}>Total</div></div>
              </div>
            </div>
          )}

          {/* Capability badges */}
          {!isNew && agent && capabilities.length > 0 && (
            <div className="mb-4">
              <label className={cn("text-[10px] font-medium mb-2 flex items-center gap-1.5", classes.muted)}>
                <Zap className="w-3 h-3 text-amber-400" /> CAPABILITIES
              </label>
              <div className="flex flex-wrap gap-2">
                {capabilities.map((c, i) => (
                  <div key={i} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] border",
                    c.level === 'strong'
                      ? isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : isDark ? "bg-neutral-800/50 border-neutral-700 text-neutral-300" : "bg-neutral-50 border-neutral-200 text-neutral-600"
                  )}>
                    {c.icon}<span>{c.label}</span>
                    {c.level === 'strong' && <span className="text-[8px] text-emerald-400">★</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-2 mb-4 border-b border-neutral-800 pb-2">
            {[{ id: 'profile' as const, label: 'Profile & Settings' }, { id: 'soul' as const, label: 'SOUL.md' }, { id: 'skills' as const, label: 'Skills' }]
              .filter(t => t.id === 'profile' || !isNew)
              .map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    activeTab === tab.id ? "bg-violet-500/20 text-violet-400" : classes.muted)}>
                  {tab.label}
                </button>
              ))}
          </div>

          <div className="space-y-4">
            {activeTab === 'profile' && (
              <>
                <div>
                  <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Agent name"
                    className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)} />
                </div>
                <div>
                  <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Role / Department</label>
                  <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Development, Strategy"
                    className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Department</label>
                    <select value={department} onChange={(e) => setDepartment(e.target.value)}
                      className={cn("w-full rounded-md px-3 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}>
                      <option value="">Select department</option>
                      {['Orchestration', 'Engineering', 'Quality & Safety', 'Analytics & Insights', 'Marketing & Content', 'Research', 'Unassigned', 'Inactive'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Subteam</label>
                    <select value={subTeam} onChange={(e) => setSubTeam(e.target.value)}
                      className={cn("w-full rounded-md px-3 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}>
                      <option value="">Select subteam</option>
                      {department && DEPARTMENT_SUBTEAM_MAP[department]?.map(st => (
                        <option key={st} value={st}>{st}</option>
                      )) || Object.values(DEPARTMENT_SUBTEAM_MAP).flat().map(st => (
                        <option key={st} value={st}>{st} (any department)</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>
                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Status</span>
                  </label>
                  <div className="flex gap-2">
                    {(['active', 'idle', 'offline'] as const).map(s => {
                      const colors: Record<string, string> = { active: "bg-emerald-500", idle: "bg-amber-500", offline: "bg-neutral-500" };
                      return (
                        <button key={s} onClick={() => setStatus(s)}
                          className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-xs border transition-all capitalize",
                            status === s
                              ? isDark ? "bg-white/10 border-violet-500/30 text-white" : "bg-violet-50 border-violet-300 text-violet-700"
                              : isDark ? "border-white/5 text-neutral-400 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                          )}>
                          <span className={cn("w-2 h-2 rounded-full", colors[s])} />{s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className={cn("border-t pt-4", isDark ? "border-neutral-800" : "border-neutral-200")}>
                  <label className={cn("text-[11px] font-medium mb-1.5 block flex items-center gap-1.5 text-violet-400")}>
                    <Cpu className="w-3.5 h-3.5" /> AI Model
                  </label>
                  <select value={model} onChange={(e) => setModel(e.target.value)}
                    className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}>
                    <option value="">Default (Auto)</option>
                    {AVAILABLE_MODELS.map(m => <option key={m.id} value={m.id}>{m.label} — {m.description}</option>)}
                  </select>
                  {model && (
                    <p className={cn("text-[10px] mt-1.5 flex items-center gap-1", classes.subtle)}>
                      <Zap className="w-3 h-3 text-amber-400" /> Using {model.split('/').pop()}
                      {model.includes('auto') && ' — will auto-select best model per task'}
                    </p>
                  )}
                </div>
                {!isNew && agent && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className={cn("text-center p-3 rounded-lg", isDark ? "bg-neutral-900/50" : "bg-neutral-50")}>
                      <div className={cn("flex items-center justify-center space-x-1 mb-1", classes.subtle)}><CheckCircle2 className="w-3 h-3" /><span className="text-[9px] font-semibold uppercase">Done</span></div>
                      <div className="text-lg font-bold text-emerald-500">{doneCount}</div>
                    </div>
                    <div className={cn("text-center p-3 rounded-lg", isDark ? "bg-neutral-900/50" : "bg-neutral-50")}>
                      <div className={cn("flex items-center justify-center space-x-1 mb-1", classes.subtle)}><Clock className="w-3 h-3" /><span className="text-[9px] font-semibold uppercase">Active</span></div>
                      <div className="text-lg font-bold text-amber-500">{activeCount}</div>
                    </div>
                    <div className={cn("text-center p-3 rounded-lg", isDark ? "bg-neutral-900/50" : "bg-neutral-50")}>
                      <div className={cn("flex items-center justify-center space-x-1 mb-1", classes.subtle)}><List className="w-3 h-3" /><span className="text-[9px] font-semibold uppercase">Total</span></div>
                      <div className="text-lg font-bold text-violet-500">{totalCount}</div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSave} disabled={!name.trim()}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors min-h-[44px]">
                    <Save className="w-4 h-4" /><span>{isNew ? 'Create Agent' : 'Save Changes'}</span>
                  </button>
                  {!isNew && agent && onDelete && (
                    <button onClick={() => { onDelete(agent.id); onClose(); }}
                      className="px-4 py-2.5 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-md text-[13px] font-medium transition-colors min-h-[44px] flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            )}
            {activeTab === 'soul' && (
              <div className="flex flex-col" style={{ minHeight: 350 }}>
                <div className="flex items-center justify-between mb-2">
                  <label className={cn("text-[11px] font-medium flex items-center gap-1.5", classes.muted)}><Brain className="w-3.5 h-3.5" /> SOUL.md Editor</label>
                  <button onClick={handleSaveSoul} disabled={isSavingSoul} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-md font-medium transition-colors flex items-center gap-1.5">
                    <Save className="w-3 h-3" /> {isSavingSoul ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <textarea value={soulContent} onChange={e => setSoulContent(e.target.value)}
                  className={cn("flex-1 w-full rounded-md p-4 text-[13px] font-mono outline-none resize-none min-h-[300px] transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}
                  placeholder="Agent SOUL content..." />
              </div>
            )}
            {activeTab === 'skills' && (
              <div style={{ maxHeight: 400 }} className="overflow-y-auto pr-2 custom-scroll">
                {/* Agent-specific skills from actual SOUL.md / AGENTS.md files */}
                {agentFileProfile && (
                  <div className="mb-4">
                    <label className={cn("text-[10px] font-medium mb-2 flex items-center gap-1.5", classes.muted)}>
                      <Zap className="w-3 h-3 text-amber-400" /> AGENT SKILLS FROM FILES
                    </label>
                    {loadingProfile ? (
                      <p className={cn("text-xs", classes.muted)}>Loading agent profile...</p>
                    ) : agentFileProfile.purpose ? (
                      <div className="mb-2">
                        <p className={cn("text-xs italic", classes.subtle)}>"{agentFileProfile.purpose.slice(0, 150)}..."</p>
                      </div>
                    ) : null}
                    {agentFileProfile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {agentFileProfile.skills.map((skill, i) => (
                          <span key={i} className={cn("px-2.5 py-1 rounded-full text-[10px] font-medium border",
                            isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                          )}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className={cn("text-xs", classes.muted)}>No skills detected in agent files.</p>
                    )}
                    {(agentFileProfile.hasSoul || agentFileProfile.hasAgents) && (
                      <p className={cn("text-[10px] mt-2", classes.subtle)}>
                        {(agentFileProfile.hasSoul && agentFileProfile.hasAgents) ? '✓ SOUL.md + AGENTS.md'
                          : agentFileProfile.hasSoul ? '✓ SOUL.md only (no AGENTS.md)'
                          : '✓ AGENTS.md only (no SOUL.md)'}
                      </p>
                    )}
                  </div>
                )}
                
                <label className={cn("text-[11px] font-medium mb-3 block flex items-center gap-1.5", classes.muted)}><Wrench className="w-3.5 h-3.5" /> Assigned Skills & Tools</label>
                {skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skills.map((skill, idx) => (
                      <div key={idx} className={cn("p-3 rounded-lg border transition-all hover:scale-[1.02]",
                        isDark ? "bg-neutral-900/50 border-neutral-800 hover:border-violet-500/30" : "bg-neutral-50 border-neutral-200 hover:border-violet-300")}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Wrench className="w-4 h-4 text-violet-500" />
                          <span className={cn("text-sm font-semibold", classes.heading)}>{skill.name || skill.id}</span>
                        </div>
                        <p className={cn("text-[11px] line-clamp-2", classes.muted)}>{skill.description || 'No description available.'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={cn("text-center p-8 border border-dashed rounded-lg", isDark ? "border-neutral-700" : "border-neutral-300")}>
                    <BookOpen className={cn("w-8 h-8 mx-auto mb-2 opacity-50", classes.muted)} />
                    <p className={cn("text-sm", classes.muted)}>No assigned skills found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}
