'use client';

import { Project, Task, Activity, Agent } from '@/lib/types';
import { cn, timeAgo, getStatusColor, getAvatar } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { 
  ArrowLeft, Edit3, FolderOpen, CheckCircle2, Clock, 
  AlertCircle, Play, Pause, Archive, CheckSquare, Activity as ActivityIcon,
  ExternalLink, FileText, Image, Download, Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProjectDetailViewProps {
  project: Project;
  tasks: Task[];
  activities: Activity[];
  agents: Agent[];
  theme: 'dark' | 'light';
  onClose: () => void;
  onEdit: () => void;
  onEditTask: (task: Task) => void;
}

export function ProjectDetailView({ 
  project, tasks, activities, agents, theme, onClose, onEdit, onEditTask 
}: ProjectDetailViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const projectTasks = tasks.filter(t => t.project_id === project.id);
  // Simple heuristic for project activities: activities by agents assigned to project tasks
  const projectAgentNames = new Set(projectTasks.flatMap(t => (t.assignees || []).filter(Boolean).map(a => a.replace(/^@+/, ''))));
  const projectActivities = activities.filter(a => a.agent_name && typeof a.agent_name === 'string' && projectAgentNames.has(a.agent_name.replace(/^@+/, '')));

  const doneCount = projectTasks.filter(t => t.status === 'done').length;
  const progress = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;

  // Deliverables state
  const [deliverables, setDeliverables] = useState<{name: string; url: string; type: string; size: string; driveId?: string}[]>([]);
  const [loadingDeliverables, setLoadingDeliverables] = useState(true);

  useEffect(() => {
    // Fetch deliverables for this project from the API
    fetch(`/api/deliverables?project=${encodeURIComponent(project.name)}`)
      .then(res => res.json())
      .then(data => {
        if (data.files) setDeliverables(data.files);
        setLoadingDeliverables(false);
      })
      .catch(() => setLoadingDeliverables(false));
  }, [project.name]);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className={cn("p-2 rounded-lg transition-colors", isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-200")}>
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <FolderOpen className="w-6 h-6 text-violet-500" />
              <h1 className={cn("text-2xl font-bold", classes.heading)}>{project.name}</h1>
              <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider", getStatusColor(project.status))}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            {project.department && (
              <div className={cn("text-[13px] mt-1", classes.muted)}>{project.department}</div>
            )}
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[13px] font-medium transition-colors">
          <Edit3 className="w-4 h-4" /> Edit Project
        </button>
      </div>

      {/* Description & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cn("lg:col-span-2 p-6 rounded-xl border", classes.card)}>
          <h3 className={cn("text-[14px] font-semibold mb-3", classes.heading)}>Description</h3>
          <p className={cn("text-[14px] leading-relaxed whitespace-pre-wrap", classes.muted)}>
            {project.description || 'No description provided.'}
          </p>
        </div>
        <div className={cn("p-6 rounded-xl border space-y-6", classes.card)}>
          <div>
            <h3 className={cn("text-[14px] font-semibold mb-3", classes.heading)}>Progress</h3>
            <div className="flex justify-between text-[13px] mb-2">
              <span className={classes.muted}>{doneCount} of {projectTasks.length} tasks completed</span>
              <span className={cn("font-bold", classes.heading)}>{progress}%</span>
            </div>
            <div className={cn("w-full h-2 rounded-full overflow-hidden", classes.progressBg)}>
              <div 
                className={cn("h-full rounded-full transition-all duration-500", progress === 100 ? 'bg-emerald-500' : progress > 50 ? 'bg-violet-500' : 'bg-amber-500')} 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className={cn("text-[14px] font-semibold mb-3", classes.heading)}>Details</h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className={classes.muted}>Created</span>
                <span className={classes.heading}>{timeAgo(project.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className={classes.muted}>Last Updated</span>
                <span className={classes.heading}>{timeAgo(project.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtasks & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cn("lg:col-span-2 p-6 rounded-xl border", classes.card)}>
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="w-5 h-5 text-blue-500" />
            <h3 className={cn("text-[16px] font-semibold", classes.heading)}>Subtasks</h3>
          </div>
          <div className="space-y-2">
            {projectTasks.length > 0 ? projectTasks.map(task => (
              <div key={task.id} onClick={() => onEditTask(task)} className={cn("flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors", isDark ? "border-neutral-800/50 hover:bg-neutral-800/50" : "border-neutral-100 hover:bg-neutral-50")}>
                <div className="flex items-center gap-3">
                  <span className={cn("w-2 h-2 rounded-full", task.status === 'done' ? 'bg-emerald-500' : task.status === 'in_progress' ? 'bg-amber-500' : 'bg-neutral-500')} />
                  <span className={cn("text-[13px] font-medium", classes.heading)}>{task.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full", getStatusColor(task.status))}>
                    {task.status.replace('_', ' ')}
                  </span>
                  {task.assignees && task.assignees.length > 0 && (
                    <div className="flex -space-x-1">
                      {task.assignees.map(a => (
                        <img key={a} src={getAvatar(a)} alt={a} className="w-6 h-6 rounded-full border border-neutral-800" title={a} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className={cn("text-center py-8 text-[13px]", classes.muted)}>No tasks in this project yet.</div>
            )}
          </div>
        </div>

        <div className={cn("p-6 rounded-xl border", classes.card)}>
          <div className="flex items-center gap-2 mb-4">
            <ActivityIcon className="w-5 h-5 text-emerald-500" />
            <h3 className={cn("text-[16px] font-semibold", classes.heading)}>Activity Logs</h3>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scroll pr-2">
            {projectActivities.length > 0 ? projectActivities.slice(0, 20).map(act => (
              <div key={act.id} className="flex gap-3 text-[12px]">
                <img src={getAvatar(act.agent_name)} alt={act.agent_name} className="w-6 h-6 rounded-full mt-0.5" />
                <div>
                  <div className={cn("font-medium", classes.heading)}>@{act.agent_name}</div>
                  <div className={cn("mt-0.5", classes.muted)}>{act.action}</div>
                  <div className={cn("text-[10px] mt-1", classes.subtle)}>{timeAgo(act.created_at)}</div>
                </div>
              </div>
            )) : (
              <div className={cn("text-center py-8 text-[13px]", classes.muted)}>No recent activity.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
