'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, Project, Agent } from '@/lib/types';
import { cn, ALL_STATUSES } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Save, Trash2, Eye, CheckCircle2, ExternalLink, Clock, Tag, Hash, Zap, FileCode, Image, Link as LinkIcon } from 'lucide-react';
import { MarkdownPreviewModal } from './MarkdownPreviewModal';
import { ModalWrapper } from './ModalWrapper';

interface TaskModalProps {
  task: Task | null;
  isOpen?: boolean;
  isNew?: boolean;
  projects: Project[];
  agents: Agent[];
  onClose: () => void;
  onSave: (task: Partial<Task> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  theme: 'dark' | 'light';
}

function detectOutputType(url: string): { icon: React.ReactNode; label: string } {
  const ext = url.split('.').pop()?.toLowerCase();
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (['md','txt','json','html','yaml','yml'].includes(ext || '')) return { icon: <FileCode className="w-4 h-4" />, label: 'Doc' };
    if (['png','jpg','jpeg','gif','webp','svg','pdf'].includes(ext || '')) return { icon: <Image className="w-4 h-4" />, label: 'Media' };
    return { icon: <LinkIcon className="w-4 h-4" />, label: 'URL' };
  }
  if (['md','txt'].includes(ext || '')) return { icon: <FileCode className="w-4 h-4" />, label: 'Text' };
  if (['json','yaml','yml'].includes(ext || '')) return { icon: <FileCode className="w-4 h-4" />, label: 'Data' };
  if (['png','jpg','jpeg','gif','webp','svg'].includes(ext || '')) return { icon: <Image className="w-4 h-4" />, label: 'Image' };
  return { icon: <FileCode className="w-4 h-4" />, label: 'File' };
}

const STATUS_HINTS: Record<TaskStatus, { label: string; color: string; tip: string }> = {
  inbox: { label: '📥 Inbox', color: 'text-neutral-400', tip: 'New, unassigned tasks waiting for assignment' },
  assigned: { label: '📤 Assigned', color: 'text-blue-400', tip: 'Assigned to an agent, awaiting start' },
  in_progress: { label: '⚡ In Progress', color: 'text-amber-400', tip: 'Currently being worked on' },
  review: { label: '🔍 Review', color: 'text-purple-400', tip: 'Complete, awaiting human review' },
  done: { label: '✅ Done', color: 'text-emerald-400', tip: 'Completed and approved' },
  approval_needed: { label: '⚠️ Approval Needed', color: 'text-orange-400', tip: 'Needs human approval before proceeding' },
  rejected: { label: '❌ Rejected', color: 'text-red-400', tip: 'Not approved, needs rework' },
  backlog: { label: '📋 Backlog', color: 'text-neutral-400', tip: 'Deprioritized, will revisit later' },
};

export function TaskModal({ task, isOpen = false, isNew = false, projects, agents, onClose, onSave, onDelete, theme }: TaskModalProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('inbox');
  const [assignees, setAssignees] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const isDoneView = !isNew && task?.status === 'done';

  useEffect(() => {
    if (task && !isNew) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setAssignees(task.assignees?.join(', ') || '');
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
    let finalDescription = description.trim();
    finalDescription = finalDescription.replace(/\n*\[output\]:\s*\S+/g, '').trim();
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

  const renderDoneView = () => (
    <div className="space-y-4">
      <div className={cn("flex items-center gap-3 p-3 rounded-lg",
        isDark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200")}>
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <div>
          <div className={cn("text-[12px] font-semibold", isDark ? "text-emerald-300" : "text-emerald-700")}>Task Completed</div>
          {outputUrl && (() => { const { label } = detectOutputType(outputUrl); return <span className="text-[10px] text-emerald-400/80">Output type: {label}</span>; })()}
        </div>
      </div>

      {description && (
        <div>
          <label className={cn("text-[11px] font-medium mb-1 block", classes.muted)}>Description</label>
          <div className={cn("text-[13px] p-3 rounded-lg max-h-32 overflow-y-auto custom-scroll", isDark ? "bg-neutral-900/50" : "bg-neutral-50")}>{description}</div>
        </div>
      )}

      <div>
        <label className={cn("text-[11px] font-medium mb-1.5 block flex items-center gap-1", classes.muted)}>
          <ExternalLink className="w-3 h-3" /> Deliverable
        </label>
        {outputUrl ? (
          <button onClick={() => setPreviewOpen(true)}
            className={cn("w-full flex items-center justify-between p-3 rounded-lg transition-all border",
              isDark ? "bg-blue-900/20 hover:bg-blue-900/30 border-blue-800/30" : "bg-blue-50 hover:bg-blue-100 border-blue-200")}>
            <div className="flex items-center gap-3">
              {outputUrl.endsWith('.pptx') && <span className="text-xl">📊</span>}
              {(outputUrl.endsWith('.md') || outputUrl.endsWith('.txt')) && <span className="text-xl">📄</span>}
              {(outputUrl.endsWith('.docx') || outputUrl.endsWith('.doc')) && <span className="text-xl">📝</span>}
              <div className="text-left">
                <div className={cn("text-[12px] font-medium", classes.heading)}>Preview File</div>
                <div className={cn("text-[10px] truncate max-w-[200px]", classes.muted)}>{outputUrl.split('/').pop()}</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
          </button>
        ) : (
          <p className={cn("text-[11px] text-center py-3", classes.muted)}>No output file attached</p>
        )}
      </div>

      <div className={cn("flex items-center gap-3 text-[10px] p-2 rounded", classes.muted)}>
        {task && <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>}
        {task?.updated_at && <span>• Updated: {new Date(task.updated_at).toLocaleDateString()}</span>}
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onClose} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-2.5 text-[13px] font-semibold transition-colors min-h-[44px]">Close</button>
        <button onClick={() => { onSave({ ...task, status: 'in_progress' as TaskStatus }); }}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors min-h-[44px]">
          <Clock className="w-4 h-4" /><span>Reopen</span>
        </button>
      </div>
    </div>
  );

  const renderEditView = () => {
    const assigneeList = assignees.split(',').map(s => s.trim());
    const sortedAgents = [...agents].sort((a, b) => {
      const order: Record<string, number> = { active: 0, idle: 1, offline: 2 };
      return (order[a.status || 'offline'] ?? 2) - (order[b.status || 'offline'] ?? 2);
    });

    return (
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
            <label className={cn("text-[11px] font-medium mb-1.5 block flex items-center gap-1", classes.muted)}>
              <Tag className="w-3 h-3" /> Status
            </label>
            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_HINTS[s].label}</option>)}
            </select>
            <p className={cn("text-[9px] mt-1", STATUS_HINTS[status].color)}>{STATUS_HINTS[status].tip}</p>
          </div>
          <div>
            <label className={cn("text-[11px] font-medium mb-1.5 block flex items-center gap-1", classes.muted)}>
              <Clock className="w-3 h-3" /> Assignees
            </label>
            <input value={assignees} onChange={(e) => setAssignees(e.target.value)} placeholder="@Nova, @Forge"
              className={cn("w-full rounded-md px-4 py-2.5 text-[13px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)} />
          </div>
        </div>

        {sortedAgents.length > 0 && (
          <div>
            <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>Quick Assign</label>
            <div className="flex flex-wrap gap-1.5">
              {sortedAgents.map(a => {
                const tag = `@${a.name}`;
                const isAssigned = assigneeList.includes(tag);
                return (
                  <button key={a.id} onClick={() => {
                    if (isAssigned) setAssignees(assigneeList.filter(s => s !== tag).join(', '));
                    else setAssignees(prev => prev ? `${prev}, ${tag}` : tag);
                  }} className={cn("text-[10px] px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5",
                    isAssigned
                      ? "bg-violet-600/30 text-violet-300 border border-violet-500/30"
                      : isDark ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0",
                      a.status === 'active' ? "bg-emerald-500" : a.status === 'idle' ? "bg-amber-500" : "bg-neutral-500"
                    )} />
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(status === 'done' || status === 'review' || outputUrl) && (
          <div>
            <label className={cn("flex justify-between items-center text-[11px] font-medium mb-1.5 block", classes.muted)}>
              <span className="flex items-center gap-1.5"><FileCode className="w-3 h-3" /> Output (file path or URL)</span>
              {outputUrl && (() => {
                const { label } = detectOutputType(outputUrl);
                return (
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full", isDark ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-600")}>{label}</span>
                    {outputUrl.endsWith('.md') && (
                      <button onClick={() => setPreviewOpen(true)}
                        className={cn("flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors",
                          isDark ? "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30" : "bg-violet-100 text-violet-600 hover:bg-violet-200")}>
                        <Eye className="w-3 h-3" /> Preview
                      </button>
                    )}
                  </div>
                );
              })()}
            </label>
            <input value={outputUrl} onChange={(e) => setOutputUrl(e.target.value)} placeholder="/home/.../file.md or https://..."
              className={cn("w-full rounded-md px-4 py-2.5 text-[12px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50 font-mono", classes.inputBg)} />
            <p className={cn("text-[9px] mt-1", classes.subtle)}>Attach output file path or URL. Shows on Kanban card when done.</p>
          </div>
        )}

        {task?.project_id && (
          <div className={cn("flex items-center gap-2 p-2.5 rounded-lg text-xs", isDark ? "bg-neutral-800/50 text-neutral-300" : "bg-neutral-50 text-neutral-600")}>
            <Hash className="w-3.5 h-3.5 text-violet-400" />
            <span>Linked to a project</span>
          </div>
        )}

        {task?.priority && (
          <div className={cn("flex items-center gap-2 p-2.5 rounded-lg text-xs",
            task.priority === 'critical' ? "bg-red-500/10 text-red-400" :
            task.priority === 'high' ? "bg-orange-500/10 text-orange-400" :
            task.priority === 'medium' ? "bg-amber-500/10 text-amber-400" :
            "bg-blue-500/10 text-blue-400"
          )}>
            <Zap className="w-3.5 h-3.5" />
            <span className="capitalize font-medium">Priority:</span> {task.priority}
          </div>
        )}

        {task && !isNew && (
          <div className={cn("flex items-center gap-3 text-[10px] p-2 rounded", classes.muted)}>
            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
            {task.updated_at && <span>• Updated: {new Date(task.updated_at).toLocaleDateString()}</span>}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button onClick={handleSave} disabled={!title.trim()}
            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors min-h-[44px]">
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
    );
  };

  return (
    <>
      <ModalWrapper isOpen={isOpen} onClose={onClose}>
        {({ animationPhase }) => (
          <div className={cn(
            "relative modal-panel p-6 shadow-2xl max-h-[90vh] overflow-y-auto rounded-xl border-2 w-full max-w-md",
            classes.card,
            isDoneView && (isDark ? "border-emerald-500/40 bg-emerald-500/5" : "border-emerald-500/30 bg-emerald-50/50")
          )}>
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <h3 className={cn("text-[16px] font-semibold", classes.heading)}>
                  {isNew ? '✨ New Task' : (isDoneView ? '📋 Task Details' : '✏️ Edit Task')}
                </h3>
                {isDoneView && (
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                    isDark ? "bg-emerald-500/30 text-emerald-400" : "bg-emerald-500/20 text-emerald-600")}>
                    Completed
                  </span>
                )}
              </div>
              <button onClick={onClose}
                className={cn("p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[32px] min-h-[32px] flex items-center justify-center", classes.muted)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {isDoneView ? renderDoneView() : renderEditView()}
          </div>
        )}
      </ModalWrapper>
      <MarkdownPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        filePath={outputUrl ? (outputUrl + '&t=' + Date.now()) : ''}
        theme={theme}
      />
    </>
  );
}
