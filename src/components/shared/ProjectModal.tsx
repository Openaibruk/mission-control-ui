'use client';

import { useState, useEffect } from 'react';
import { Project, Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Save, Trash2, FolderOpen } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  isNew?: boolean;
  tasks: Task[];
  onClose: () => void;
  onSave: (project: Partial<Project> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  theme: 'dark' | 'light';
}

export function ProjectModal({ project, isNew = false, tasks, onClose, onSave, onDelete, theme }: ProjectModalProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'complete' | 'on_hold' | 'paused' | 'archived'>('active');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (project && !isNew) {
      setName(project.name); setDescription(project.description || '');
      setStatus(project.status); setDepartment(project.department || '');
    } else {
      setName(''); setDescription(''); setStatus('active'); setDepartment('');
    }
  }, [project, isNew]);

  const handleSave = () => {
    if (!name.trim()) return;
    const data: Partial<Project> & { id?: string } = {
      name: name.trim(), description: description.trim(), status, department: department.trim() || undefined,
    };
    if (!isNew && project) data.id = project.id;
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cn("w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto", classes.card)}>
        <div className="flex justify-between items-center mb-5">
          <h3 className={cn("text-[16px] font-semibold flex items-center gap-2", classes.heading)}>
            <FolderOpen className="w-5 h-5 text-violet-400" />
            {isNew ? 'New Project' : 'Edit Project'}
          </h3>
          <button onClick={onClose} className={cn("p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[32px] min-h-[32px] flex items-center justify-center", classes.muted)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isNew && project && (
          <div className={cn("mb-4 p-3 rounded-lg flex items-center justify-between", isDark ? "bg-white/[0.03]" : "bg-neutral-50")}>
            <div>
              <div className={cn("text-[11px]", classes.muted)}>Progress</div>
              <div className={cn("text-lg font-bold", classes.heading)}>
                {project.done_tasks}/{project.total_tasks} tasks
              </div>
            </div>
            <div className={cn("text-2xl font-bold", project.total_tasks > 0 && project.done_tasks === project.total_tasks ? "text-emerald-500" : "text-violet-500")}>
              {project.total_tasks > 0 ? Math.round((project.done_tasks / project.total_tasks) * 100) : 0}%
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Project Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Dashboard Redesign" autoFocus
              className={cn("w-full rounded-md px-4 py-2.5 text-[14px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)} />
          </div>
          <div>
            <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project details..." rows={3}
              className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50 resize-none", classes.inputBg)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'complete' | 'on_hold' | 'paused' | 'archived')}
                className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}>
                <option value="active">Active</option><option value="complete">Complete</option><option value="on_hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Department</label>
              <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Development"
                className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={!name.trim()}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center space-x-2 transition-colors min-h-[44px]">
              <Save className="w-4 h-4" /><span>{isNew ? 'Create Project' : 'Save Changes'}</span>
            </button>
            {!isNew && project && onDelete && (
              <button onClick={() => { onDelete(project.id); onClose(); }}
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
