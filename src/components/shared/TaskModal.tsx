'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, Project, Agent } from '@/lib/types';
import { cn, ALL_STATUSES } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Save, Trash2 } from 'lucide-react';

interface TaskModalProps {
  task: Task | null;
  isNew?: boolean;
  projects: Project[];
  agents: Agent[];
  onClose: () => void;
  onSave: (task: Partial<Task> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  theme: 'dark' | 'light';
}

export function TaskModal({ task, isNew = false, projects, agents, onClose, onSave, onDelete, theme }: TaskModalProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('inbox');
  const [assignees, setAssignees] = useState('');
  const [outputUrl, setOutputUrl] = useState('');

  useEffect(() => {
    if (task && !isNew) {
      setTitle(task.title); setDescription(task.description || '');
      setStatus(task.status); setAssignees(task.assignees?.join(', ') || '');
      setOutputUrl(task.output_url || '');
    } else {
      setTitle(''); setDescription(''); setStatus('inbox'); setAssignees(''); setOutputUrl('');
    }
  }, [task, isNew]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    // Store output URL in description with convention (since DB column may not exist)
    let finalDescription = description.trim();
    // Remove any existing output markers
    finalDescription = finalDescription.replace(/\n*\[output\]:\s*\S+/g, '').trim();
    // Add output marker if provided
    if (outputUrl.trim()) {
      finalDescription = finalDescription ? `${finalDescription}\n\n[output]: ${outputUrl.trim()}` : `[output]: ${outputUrl.trim()}`;
    }
    
    const data: Partial<Task> & { id?: string } = {
      title: title.trim(), description: finalDescription, status,
      assignees: assignees.split(',').map(s => s.trim()).filter(Boolean),
    };
    if (!isNew && task) data.id = task.id;
    onSave(data);
  };

  if (!task && !isNew) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cn("w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto", classes.card)}>
        <div className="flex justify-between items-center mb-5">
          <h3 className={cn("text-[16px] font-semibold", classes.heading)}>{isNew ? 'New Task' : 'Edit Task'}</h3>
          <button onClick={onClose} className={cn("p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[32px] min-h-[32px] flex items-center justify-center", classes.muted)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task name" autoFocus
              className={cn("w-full rounded-md px-4 py-2.5 text-[14px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)} />
          </div>
          <div>
            <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task details..." rows={4}
              className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50 resize-none", classes.inputBg)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Assignees</label>
              <input value={assignees} onChange={(e) => setAssignees(e.target.value)} placeholder="@Forge, @Shuri"
                className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)} />
            </div>
          </div>

          {/* Quick assign buttons */}
          {agents.length > 0 && (
            <div>
              <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Quick Assign</label>
              <div className="flex flex-wrap gap-1.5">
                {agents.map(a => {
                  const tag = `@${a.name}`;
                  const isAssigned = assignees.includes(tag);
                  return (
                    <button key={a.id} onClick={() => {
                      if (isAssigned) setAssignees(assignees.replace(tag, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim());
                      else setAssignees(prev => prev ? `${prev}, ${tag}` : tag);
                    }} className={cn("text-[10px] px-2 py-1 rounded-full font-medium transition-all",
                      isAssigned ? "bg-violet-600/30 text-violet-300 border border-violet-500/30" : isDark ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200")}>
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Output URL for done tasks */}
          {(status === 'done' || outputUrl) && (
            <div>
              <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>
                Output (file path or URL)
              </label>
              <input value={outputUrl} onChange={(e) => setOutputUrl(e.target.value)} placeholder="/home/.../file.md or https://..."
                className={cn("w-full rounded-md px-4 py-2.5 text-[12px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50 font-mono", classes.inputBg)} />
              <p className={cn("text-[9px] mt-1", classes.subtle)}>Attach output file path or URL. Shows on Kanban card when done.</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={!title.trim()}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center space-x-2 transition-colors min-h-[44px]">
              <Save className="w-4 h-4" /><span>{isNew ? 'Create Task' : 'Save Changes'}</span>
            </button>
            {!isNew && task && onDelete && (
              <button onClick={() => onDelete(task.id)}
                className="px-4 py-2.5 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-md text-[13px] font-medium transition-colors min-h-[44px] flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
