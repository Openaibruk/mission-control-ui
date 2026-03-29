'use client';

import { useState, useEffect } from 'react';
import { Agent, Task, AVAILABLE_MODELS } from '@/lib/types';
import { cn, getAvatar } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Save, Trash2, CheckCircle2, Clock, List, BookOpen, Wrench } from 'lucide-react';

interface AgentModalProps {
  agent: Agent | null;
  isNew?: boolean;
  tasks: Task[];
  onClose: () => void;
  onSave: (agent: Partial<Agent> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  theme: 'dark' | 'light';
}

export function AgentModal({ agent, isNew = false, tasks, onClose, onSave, onDelete, theme }: AgentModalProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'active' | 'idle' | 'offline'>('active');
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  
  const [soulContent, setSoulContent] = useState('');
  const [isSavingSoul, setIsSavingSoul] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'soul' | 'skills'>('profile');

  useEffect(() => {
    if (agent && !isNew) {
      setName(agent.name); setRole(agent.role || ''); setStatus(agent.status);
      setModel(agent.model || ''); setPrompt(agent.prompt || '');
    } else {
      setName(''); setRole(''); setStatus('active'); setModel(''); setPrompt('');
    }
  }, [agent, isNew]);

  useEffect(() => {
    // Fetch SOUL.md
    fetch('/api/files?path=SOUL.md')
      .then(res => res.text())
      .then(text => setSoulContent(text))
      .catch(err => console.error('Failed to load SOUL.md:', err));

    // Fetch Skills
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        if (data.skills) setSkills(data.skills);
      })
      .catch(err => console.error('Failed to load skills:', err));
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    const data: Partial<Agent> & { id?: string } = { name: name.trim(), role: role.trim(), status, model };
    if (!isNew && agent) data.id = agent.id;
    onSave(data);
    onClose();
  };

  const handleSaveSoul = async () => {
    setIsSavingSoul(true);
    try {
      await fetch('/api/files/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: 'SOUL.md', content: soulContent }),
      });
      alert('SOUL.md saved to disk!');
    } catch (error) {
      console.error('Error saving SOUL.md:', error);
      alert('Failed to save SOUL.md');
    }
    setIsSavingSoul(false);
  };

  const agentTag = agent ? `@${agent.name}` : '';
  const doneCount = tasks.filter(t => t.status === 'done' && t.assignees?.includes(agentTag)).length;
  const activeCount = tasks.filter(t => ['assigned', 'in_progress', 'review'].includes(t.status) && t.assignees?.includes(agentTag)).length;
  const totalCount = tasks.filter(t => t.assignees?.includes(agentTag)).length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cn("w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto", classes.card)}>
        <div className="flex justify-between items-center mb-5">
          <h3 className={cn("text-[16px] font-semibold", classes.heading)}>{isNew ? 'New Agent' : 'Agent Profile'}</h3>
          <button onClick={onClose} className={cn("p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[32px] min-h-[32px] flex items-center justify-center", classes.muted)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isNew && agent && (
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-4">
              <img src={getAvatar(agent.name)} alt={agent.name} className="w-16 h-16 rounded-xl border-2 border-neutral-700" />
              <div>
                <div className={cn("text-lg font-bold", classes.heading)}>{agent.name}</div>
                {agent.created_at && <div className={cn("text-[11px]", classes.muted)}>Since {new Date(agent.created_at).toLocaleDateString()}</div>}
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2 mb-4 border-b border-neutral-800 pb-2">
          <button onClick={() => setActiveTab('profile')} className={cn("px-3 py-1.5 text-xs font-medium rounded-md", activeTab === 'profile' ? "bg-violet-500/20 text-violet-400" : classes.muted)}>Profile & Settings</button>
          {!isNew && <button onClick={() => setActiveTab('soul')} className={cn("px-3 py-1.5 text-xs font-medium rounded-md", activeTab === 'soul' ? "bg-violet-500/20 text-violet-400" : classes.muted)}>SOUL.md</button>}
          {!isNew && <button onClick={() => setActiveTab('skills')} className={cn("px-3 py-1.5 text-xs font-medium rounded-md", activeTab === 'skills' ? "bg-violet-500/20 text-violet-400" : classes.muted)}>Assigned Skills</button>}
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
              <div>
                <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'idle' | 'offline')}
                  className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}>
                  <option value="active">Active</option><option value="idle">Idle</option><option value="offline">Offline</option>
                </select>
              </div>

              <div className={cn("border-t pt-4 mt-4", classes.divider)}>
                <label className={cn("text-[11px] font-medium mb-1.5 block text-violet-400")}>AI Model Selection</label>
                <select value={model} onChange={(e) => setModel(e.target.value)}
                  className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}>
                  <option value="">Default (Auto)</option>
                  {AVAILABLE_MODELS.map(m => <option key={m.id} value={m.id}>{m.label} — {m.description}</option>)}
                </select>
              </div>

              {!isNew && agent && (
                <div className="grid grid-cols-3 gap-3 pt-2 mt-4">
                  <div className={cn("text-center p-3 rounded-lg", classes.card)}>
                    <div className={cn("flex items-center justify-center space-x-1 mb-1", classes.subtle)}><CheckCircle2 className="w-3 h-3" /><span className="text-[9px] font-semibold uppercase">Done</span></div>
                    <div className="text-lg font-bold text-emerald-500">{doneCount}</div>
                  </div>
                  <div className={cn("text-center p-3 rounded-lg", classes.card)}>
                    <div className={cn("flex items-center justify-center space-x-1 mb-1", classes.subtle)}><Clock className="w-3 h-3" /><span className="text-[9px] font-semibold uppercase">Active</span></div>
                    <div className="text-lg font-bold text-amber-500">{activeCount}</div>
                  </div>
                  <div className={cn("text-center p-3 rounded-lg", classes.card)}>
                    <div className={cn("flex items-center justify-center space-x-1 mb-1", classes.subtle)}><List className="w-3 h-3" /><span className="text-[9px] font-semibold uppercase">Total</span></div>
                    <div className="text-lg font-bold text-violet-500">{totalCount}</div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <button onClick={handleSave} disabled={!name.trim()}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center space-x-2 transition-colors min-h-[44px]">
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
            <div className="flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-2">
                <label className={cn("text-[11px] font-medium", classes.muted)}>SOUL.md Editor (Saves to Disk)</label>
                <button onClick={handleSaveSoul} disabled={isSavingSoul} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-md font-medium transition-colors flex items-center gap-1.5">
                  <Save className="w-3 h-3" /> {isSavingSoul ? 'Saving...' : 'Save to Disk'}
                </button>
              </div>
              <textarea 
                value={soulContent} 
                onChange={e => setSoulContent(e.target.value)}
                className={cn("flex-1 w-full rounded-md p-4 text-[13px] font-mono outline-none resize-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}
                placeholder="Agent SOUL content..."
              />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="h-[400px] overflow-y-auto pr-2 custom-scroll">
              <label className={cn("text-[11px] font-medium mb-3 block", classes.muted)}>Assigned Skills & Tools</label>
              {skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.map((skill, idx) => (
                    <div key={idx} className={cn("p-3 rounded-lg border", isDark ? "bg-neutral-900/50 border-neutral-800" : "bg-neutral-50 border-neutral-200")}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Wrench className="w-4 h-4 text-violet-500" />
                        <span className={cn("text-sm font-semibold", classes.heading)}>{skill.name || skill.id}</span>
                      </div>
                      <p className={cn("text-[11px] line-clamp-2", classes.muted)}>{skill.description || 'No description available.'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cn("text-center p-8 border border-dashed rounded-lg", classes.divider)}>
                  <BookOpen className={cn("w-8 h-8 mx-auto mb-2 opacity-50", classes.muted)} />
                  <p className={cn("text-sm", classes.muted)}>No assigned skills found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
