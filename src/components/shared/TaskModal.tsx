'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, Project, Agent } from '@/lib/types';
import { cn, ALL_STATUSES } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Save, Trash2, Eye, CheckCircle2 } from 'lucide-react';
import { MarkdownPreviewModal } from './MarkdownPreviewModal';

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
  const [previewOpen, setPreviewOpen] = useState(false);

  // Determine if we're viewing a completed task (read-only mode)
  const isDoneView = !isNew && task?.status === 'done';

  useEffect(() => {
    if (task && !isNew) {
      setTitle(task.title); setDescription(task.description || '');
      setStatus(task.status); setAssignees(task.assignees?.join(', ') || '');
      
      // Try to extract output URL from description if not directly provided in DB
      let existingOutput = task.output_url || '';
      if (!existingOutput && task.description) {
        const match = task.description.match(/\[output\]:\s*(\S+)/);
        if (match) existingOutput = match[1];
      }
      setOutputUrl(existingOutput);
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
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={cn(
          "w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto border-2 transition-colors",
          classes.card,
          isDoneView && (isDark ? "border-emerald-500/40 bg-emerald-500/5" : "border-emerald-500/30 bg-emerald-50/50")
        )}>
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <h3 className={cn("text-[16px] font-semibold", classes.heading)}>
                {isNew ? 'New Task' : (isDoneView ? 'Task Details' : 'Edit Task')}
              </h3>
              {isDoneView && (
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider", isDark ? "bg-emerald-500/30 text-emerald-400" : "bg-emerald-500/20 text-emerald-600")}>
                  Completed
                </span>
              )}
            </div>
            <button onClick={onClose} className={cn("p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[32px] min-h-[32px] flex items-center justify-center", classes.muted)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Title</label>
              <input 
                value={title} 
                onChange={(e) => isDoneView ? null : setTitle(e.target.value)} 
                placeholder="Task name" 
                autoFocus
                disabled={isDoneView}
                className={cn("w-full rounded-md px-4 py-2.5 text-[14px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", isDoneView ? "bg-transparent border-none p-0 text-gray-400" : classes.inputBg)} />
            </div>
            <div>
              <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => isDoneView ? null : setDescription(e.target.value)} 
                placeholder="Task details..." 
                rows={4}
                disabled={isDoneView}
                className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50 resize-none", isDoneView ? "bg-transparent border-none p-0 text-gray-400" : classes.inputBg)} />
            </div>
            {!isDoneView && (
              <>
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
                    <label className={cn("flex justify-between items-center text-[11px] font-medium mb-1.5 block", classes.muted)}>
                      <span>Output (file path or URL)</span>
                      {outputUrl.endsWith('.md') && (
                        <button 
                          onClick={() => setPreviewOpen(true)}
                          className={cn("flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors", 
                            isDark ? "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30" : "bg-violet-100 text-violet-600 hover:bg-violet-200")}
                        >
                          <Eye className="w-3 h-3" /> Preview
                        </button>
                      )}
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
              </>
            )}
            {isDoneView && (
              <>
                <div className={cn("mb-4 p-4 rounded-xl border", isDark ? "bg-blue-900/10 border-blue-800/30" : "bg-blue-50 border-blue-200")}>
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink className="w-4 h-4 text-blue-500" />
                    <span className={cn("text-[12px] font-semibold", isDark ? "text-blue-400" : "text-blue-700")}>Deliverable</span>
                  </div>
                  {outputUrl && (
                    <button onClick={() => setPreviewOpen(true)}
                      className={cn("w-full flex items-center justify-between p-3 rounded-lg transition-all border",
                        isDark ? "bg-blue-800/30 hover:bg-blue-800/50 border-blue-700/30" : "bg-white hover:bg-blue-50 border-blue-300")}>
                      <div className="flex items-center gap-2">
                        {outputUrl.endsWith('.pptx') && <span className="text-xl">📊</span>}
                        {(outputUrl.endsWith('.md') || outputUrl.endsWith('.txt')) && <span className="text-xl">📄</span>}
                        {(outputUrl.endsWith('.docx') || outputUrl.endsWith('.doc')) && <span className="text-xl">📝</span>}
                        <div>
                          <div className="text-[12px] font-medium">Preview File</div>
                          <div className="text-[10px] opacity-70">{outputUrl.split('/').pop()}</div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                    </button>
                  )}
                  {!outputUrl && (
                    <p className={cn("text-[11px] text-center", classes.muted)}>No output file attached</p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { onClose(); }} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center space-x-2 transition-colors min-h-[44px]">
                    Close
                  </button>
                  <button onClick={() => { 
                    setStatus('in_progress');
                    onSave({ ...task, status: 'in_progress' });
                  }} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center space-x-2 transition-colors min-h-[44px]">
                    Reopen Task
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <MarkdownPreviewModal 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        filePath={outputUrl ? (outputUrl + '&t=' + Date.now()) : ''} 
        theme={theme} 
      />
    </>
  );
}
