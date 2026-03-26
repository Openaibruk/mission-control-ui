'use client';

import { useState } from 'react';
import { cn, getThemeClasses } from '@/lib/utils';
import { Task, Agent, Project } from '@/lib/types';
import { X } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  theme: 'dark' | 'light';
  agents: Agent[];
  projects: Project[];
}

export default function TaskModal({ isOpen, onClose, onSubmit, theme, agents, projects }: TaskModalProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [agentId, setAgentId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState(3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      agent_id: agentId || undefined,
      project_id: projectId || undefined,
      priority,
      status: 'todo',
    });
    setTitle('');
    setDescription('');
    setAgentId('');
    setProjectId('');
    setPriority(3);
    onClose();
  };

  const inputClass = cn("w-full rounded-lg px-3 py-2 text-sm outline-none", classes.input);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-md rounded-xl border shadow-2xl", classes.card)}>
        <div className={cn("flex items-center justify-between px-5 py-4 border-b", classes.divider)}>
          <h3 className={cn("text-sm font-semibold", classes.heading)}>New Task</h3>
          <button onClick={onClose} className={cn("p-1 rounded", classes.hover)}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className={cn("text-xs font-medium mb-1.5 block", classes.heading)}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title..." className={inputClass} required />
          </div>
          <div>
            <label className={cn("text-xs font-medium mb-1.5 block", classes.heading)}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Task description..." className={cn(inputClass, "h-20 resize-none")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={cn("text-xs font-medium mb-1.5 block", classes.heading)}>Agent</label>
              <select value={agentId} onChange={e => setAgentId(e.target.value)} className={inputClass}>
                <option value="">Unassigned</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.avatar_emoji} {a.name}</option>)}
              </select>
            </div>
            <div>
              <label className={cn("text-xs font-medium mb-1.5 block", classes.heading)}>Project</label>
              <select value={projectId} onChange={e => setProjectId(e.target.value)} className={inputClass}>
                <option value="">No Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={cn("text-xs font-medium mb-1.5 block", classes.heading)}>Priority</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(p => (
                <button key={p} type="button" onClick={() => setPriority(p)}
                  className={cn("flex-1 py-1.5 rounded-lg text-xs border transition-colors",
                    priority === p
                      ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                      : isDark ? 'border-neutral-700 hover:bg-white/5 text-neutral-400' : 'border-neutral-300 hover:bg-neutral-50 text-neutral-600'
                  )}>
                  P{p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className={cn("px-4 py-2 rounded-lg text-sm", classes.hover)}>Cancel</button>
            <button type="submit" disabled={!title.trim()} className="px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
