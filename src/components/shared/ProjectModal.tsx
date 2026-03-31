'use client';

import { useState, useEffect } from 'react';
import { Project, Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Save, Trash2, FolderOpen, TrendingUp, Calendar, BarChart3, Hash, Clock, CheckCircle2 } from 'lucide-react';
import { ModalWrapper } from './ModalWrapper';

interface ProjectModalProps {
  project: Project | null;
  isOpen?: boolean;
  isNew?: boolean;
  tasks: Task[];
  onClose: () => void;
  onSave: (project: Partial<Project> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  theme: 'dark' | 'light';
}

export function ProjectModal({ project, isOpen = false, isNew = false, tasks, onClose, onSave, onDelete, theme }: ProjectModalProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'complete' | 'on_hold' | 'paused' | 'archived'>('active');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (project && !isNew) {
      setName(project.name);
      setDescription(project.description || '');
      setStatus(project.status);
      setDepartment(project.department || '');
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

  const doneTasks = tasks.filter(t => t.project_id === project?.id && t.status === 'done').length;
  const activeTasks = tasks.filter(t => t.project_id === project?.id && ['assigned', 'in_progress', 'review'].includes(t.status)).length;
  const totalProjectTasks = tasks.filter(t => t.project_id === project?.id).length;
  const progressPercent = project && project.total_tasks > 0
    ? Math.round((project.done_tasks / project.total_tasks) * 100)
    : totalProjectTasks > 0 ? Math.round((doneTasks / totalProjectTasks) * 100) : 0;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      {({ animationPhase }) => (
        <div className={cn(
          "relative modal-panel p-6 shadow-2xl max-h-[90vh] overflow-y-auto rounded-xl border w-full max-w-md",
          classes.card,
          animationPhase === 'exiting' ? 'opacity-0 scale-95 translate-y-2' : ''
        )}>
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h3 className={cn("text-[16px] font-semibold flex items-center gap-2", classes.heading)}>
              <FolderOpen className="w-5 h-5 text-violet-400" />
              {isNew ? '📁 New Project' : '📁 Edit Project'}
            </h3>
            <button onClick={onClose} className={cn("p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[32px] min-h-[32px] flex items-center justify-center transition-colors", classes.muted)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Project Progress Card (existing only) */}
          {!isNew && project && (
            <div className={cn("mb-5 p-4 rounded-xl border",
              progressPercent === 100
                ? isDark ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
                : isDark ? "bg-white/[0.03] border-neutral-800" : "bg-neutral-50 border-neutral-200"
            )}>
              {/* Progress bar */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className={cn("w-4 h-4", progressPercent === 100 ? "text-emerald-500" : "text-violet-400")} />
                  <span className={cn("text-xs font-semibold", classes.heading)}>Progress</span>
                </div>
                <span className={cn("text-2xl font-bold", progressPercent === 100 ? "text-emerald-500" : "text-violet-500")}>
                  {progressPercent}%
                </span>
              </div>
              <div className={cn("w-full h-2 rounded-full mb-3", isDark ? "bg-neutral-800" : "bg-neutral-200")}>
                <div
                  className={cn("h-full rounded-full transition-all duration-500",
                    progressPercent === 100
                      ? "bg-emerald-500"
                      : progressPercent > 50
                        ? "bg-blue-500"
                        : progressPercent > 0
                          ? "bg-amber-500"
                          : "bg-neutral-500"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-3">
                  <span className={cn("flex items-center gap-1", isDark ? "text-neutral-400" : "text-gray-500")}>
                    <Hash className="w-3 h-3" /> {totalProjectTasks || project.total_tasks} total
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Clock className="w-3 h-3" /> {activeTasks} active
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> {doneTasks || project.done_tasks} done
                  </span>
                </div>
                {project.domain && (
                  <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium",
                    isDark ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-600")}>
                    {project.domain}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Form */}
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
                  <option value="active">🟢 Active</option>
                  <option value="complete">✅ Complete</option>
                  <option value="on_hold">😴 On Hold</option>
                  <option value="paused">⏸️ Paused</option>
                  <option value="archived">📦 Archived</option>
                </select>
              </div>
              <div>
                <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Department</label>
                <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Development"
                  className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)} />
              </div>
            </div>

            {/* Contextual: Cost tokens if tracked */}
            {project && project.cost_tokens && project.cost_tokens > 0 && (
              <div className={cn("flex items-center gap-2 p-2.5 rounded-lg text-xs",
                isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600")}>
                <BarChart3 className="w-3.5 h-3.5" />
                <span>~{project.cost_tokens.toLocaleString()} tokens consumed</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button onClick={handleSave} disabled={!name.trim()}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors min-h-[44px]">
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
      )}
    </ModalWrapper>
  );
}
