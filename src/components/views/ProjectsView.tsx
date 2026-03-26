'use client';

import { useState, useMemo, useCallback } from 'react';
import { Task, Agent, Project } from '@/lib/types';
import { cn, timeAgo, getAvatar, getStatusColor, getDepartmentColor } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import {
  FolderOpen, ChevronRight, ChevronDown, Clock, CheckCircle2,
  Circle, AlertCircle, Pause, Archive, ArrowUpDown, Filter,
  User, Calendar, Hash, TrendingUp, ChevronUp, Play
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  agents: Agent[];
  loading?: boolean;
  theme: 'dark' | 'light';
  onEditTask?: (task: Task) => void;
  onEditProject?: (project: Project) => void;
}

type ProjectFilter = 'all' | 'active' | 'complete' | 'paused' | 'archived';
type SortField = 'name' | 'progress' | 'date' | 'tasks';

function getStatusIcon(status: string) {
  switch (status) {
    case 'done':
    case 'complete':
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    case 'in_progress':
    case 'active':
      return <Play className="w-3.5 h-3.5 text-amber-500" />;
    case 'review':
      return <AlertCircle className="w-3.5 h-3.5 text-purple-500" />;
    case 'assigned':
      return <Circle className="w-3.5 h-3.5 text-blue-500" />;
    case 'inbox':
    case 'backlog':
      return <Circle className="w-3.5 h-3.5 text-neutral-500" />;
    case 'rejected':
      return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
    case 'approval_needed':
      return <Clock className="w-3.5 h-3.5 text-orange-500" />;
    case 'paused':
    case 'on_hold':
      return <Pause className="w-3.5 h-3.5 text-yellow-500" />;
    case 'archived':
      return <Archive className="w-3.5 h-3.5 text-neutral-500" />;
    default:
      return <Circle className="w-3.5 h-3.5 text-neutral-500" />;
  }
}

function getProjectStatusStyle(status: string, isDark: boolean): string {
  switch (status) {
    case 'active':
      return isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700';
    case 'complete':
      return isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-100 text-blue-700';
    case 'paused':
    case 'on_hold':
      return isDark ? 'bg-yellow-500/15 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
    case 'archived':
      return isDark ? 'bg-neutral-600/20 text-neutral-400' : 'bg-neutral-100 text-neutral-500';
    default:
      return isDark ? 'bg-neutral-500/15 text-neutral-400' : 'bg-neutral-100 text-neutral-500';
  }
}

function getPriorityColor(priority?: string): string {
  switch (priority) {
    case 'critical': return 'text-red-400';
    case 'high': return 'text-orange-400';
    case 'medium': return 'text-amber-400';
    case 'low': return 'text-neutral-400';
    default: return 'text-neutral-500';
  }
}

function getPriorityBadge(priority?: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-500/15 text-red-400';
    case 'high': return 'bg-orange-500/15 text-orange-400';
    case 'medium': return 'bg-amber-500/15 text-amber-400';
    case 'low': return 'bg-neutral-500/15 text-neutral-400';
    default: return 'bg-neutral-500/10 text-neutral-500';
  }
}

export function ProjectsView({ projects, tasks, agents, loading, theme, onEditTask, onEditProject }: ProjectsViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const toggleProject = useCallback((id: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortAsc(s => !s);
        return field;
      }
      setSortAsc(false);
      return field;
    });
  }, []);

  // Compute project stats from actual tasks
  const projectStats = useMemo(() => {
    const map = new Map<string, { total: number; done: number; inProgress: number; tasks: Task[] }>();
    for (const p of projects) {
      const projTasks = tasks.filter(t => t.project_id === p.id);
      const done = projTasks.filter(t => t.status === 'done').length;
      const inProgress = projTasks.filter(t => ['assigned', 'in_progress', 'review'].includes(t.status)).length;
      map.set(p.id, { total: projTasks.length, done, inProgress, tasks: projTasks });
    }
    return map;
  }, [projects, tasks]);

  // Filter & sort projects
  const filteredProjects = useMemo(() => {
    let list = projects;
    if (filter !== 'all') {
      list = list.filter(p => p.status === filter);
    }
    return [...list].sort((a, b) => {
      const aStats = projectStats.get(a.id) || { total: 0, done: 0 };
      const bStats = projectStats.get(b.id) || { total: 0, done: 0 };
      const aProgress = aStats.total > 0 ? (aStats.done / aStats.total) * 100 : 0;
      const bProgress = bStats.total > 0 ? (bStats.done / bStats.total) * 100 : 0;

      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'progress':
          cmp = aProgress - bProgress;
          break;
        case 'date':
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'tasks':
          cmp = aStats.total - bStats.total;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [projects, projectStats, filter, sortField, sortAsc]);

  // Build task tree for a project
  const buildTaskTree = useCallback((projectTasks: Task[]): Task[] => {
    // Tasks without parent_id are top-level
    const topLevel = projectTasks.filter(t => !t.project_id || projectTasks.every(p => p.id !== (t as any).parent_id));
    // For now, flat list since tasks table doesn't seem to have parent_id in the type
    return projectTasks;
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={cn("rounded-lg p-4 animate-pulse", classes.card)}>
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
              <div className="flex-1">
                <div className={cn("h-4 w-1/3 rounded mb-2", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
                <div className={cn("h-3 w-1/2 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className={cn("text-[15px] font-semibold flex items-center gap-2", classes.heading)}>
          <FolderOpen className="w-5 h-5 text-violet-400" />
          Projects
          <span className={cn("text-[11px] font-normal px-2 py-0.5 rounded-full", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-500")}>
            {filteredProjects.length}
          </span>
        </h2>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex items-center gap-1">
            <Filter className={cn("w-3.5 h-3.5", classes.subtle)} />
            {(['all', 'active', 'complete', 'paused', 'archived'] as ProjectFilter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn(
                  "text-[11px] px-2.5 py-1 rounded-md transition-colors capitalize",
                  filter === f
                    ? isDark ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'bg-violet-100 text-violet-700'
                    : isDark ? 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                )}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className={cn("h-5 w-px mx-1", classes.divider)} />
          <ArrowUpDown className={cn("w-3.5 h-3.5", classes.subtle)} />
          {(['name', 'progress', 'date', 'tasks'] as SortField[]).map(f => (
            <button key={f} onClick={() => handleSort(f)}
              className={cn(
                "text-[11px] px-2 py-1 rounded-md transition-colors capitalize flex items-center gap-0.5",
                sortField === f
                  ? isDark ? 'text-violet-300' : 'text-violet-600'
                  : isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-600'
              )}>
              {f}
              {sortField === f && (
                sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div className={cn(
        "grid grid-cols-[1fr_100px_80px_140px_120px_100px] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-t-lg border-b",
        isDark ? "bg-neutral-900/50 border-neutral-800 text-neutral-500" : "bg-neutral-50 border-neutral-200 text-neutral-400"
      )}>
        <div>Project</div>
        <div>Status</div>
        <div>Progress</div>
        <div>Tasks</div>
        <div>Department</div>
        <div>Created</div>
      </div>

      {/* Project rows */}
      <div className="space-y-0">
        {filteredProjects.length === 0 && (
          <div className={cn("text-center py-12", classes.muted)}>
            <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-[13px]">No projects found</p>
            <p className="text-[11px] mt-1 opacity-60">Create a project to get started</p>
          </div>
        )}

        {filteredProjects.map((project) => {
          const stats = projectStats.get(project.id) || { total: 0, done: 0, inProgress: 0, tasks: [] };
          const progress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
          const isExpanded = expandedProjects.has(project.id);

          return (
            <div key={project.id} className={cn("border-b", isDark ? "border-neutral-800/50" : "border-neutral-100")}>
              {/* Project row */}
              <button
                onClick={() => toggleProject(project.id)}
                className={cn(
                  "w-full grid grid-cols-[1fr_100px_80px_140px_120px_100px] gap-3 px-4 py-3 items-center text-left transition-colors",
                  isDark ? "hover:bg-white/[0.02]" : "hover:bg-neutral-50"
                )}
              >
                {/* Name */}
                <div className="flex items-center gap-2 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className={cn("w-4 h-4 shrink-0", classes.subtle)} />
                  ) : (
                    <ChevronRight className={cn("w-4 h-4 shrink-0", classes.subtle)} />
                  )}
                  <FolderOpen className="w-4 h-4 text-violet-400 shrink-0" />
                  <span className={cn("text-[13px] font-medium truncate", classes.heading)}>
                    {project.name}
                  </span>
                </div>

                {/* Status badge */}
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full text-center w-fit",
                  getProjectStatusStyle(project.status, isDark)
                )}>
                  {project.status}
                </span>

                {/* Progress bar */}
                <div className="flex items-center gap-1.5">
                  <div className={cn("flex-1 h-1.5 rounded-full overflow-hidden", classes.progressBg)}>
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        progress === 100 ? 'bg-emerald-500' : progress > 50 ? 'bg-violet-500' : 'bg-amber-500'
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className={cn("text-[10px] font-mono w-7 text-right", classes.subtle)}>{progress}%</span>
                </div>

                {/* Task counts */}
                <div className="flex items-center gap-2 text-[11px]">
                  <span className={cn(classes.muted)}>
                    <span className="font-semibold text-emerald-400">{stats.done}</span>
                    <span className="mx-0.5">/</span>
                    {stats.total}
                  </span>
                  {stats.inProgress > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                      {stats.inProgress} active
                    </span>
                  )}
                </div>

                {/* Department */}
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full w-fit", getDepartmentColor(project.department))}>
                  {project.department || '—'}
                </span>

                {/* Created */}
                <span className={cn("text-[10px]", classes.subtle)}>
                  {timeAgo(project.created_at)}
                </span>
              </button>

              {/* Expanded tasks */}
              {isExpanded && (
                <div className={cn(
                  "pl-12 pr-4 pb-3 space-y-1",
                  isDark ? "bg-neutral-900/30" : "bg-neutral-50/50"
                )}>
                  {stats.tasks.length === 0 ? (
                    <div className={cn("text-[12px] py-3 pl-8", classes.subtle)}>
                      No tasks in this project
                    </div>
                  ) : (
                    <>
                      {/* Task column headers */}
                      <div className={cn(
                        "grid grid-cols-[1fr_90px_80px_130px_110px_90px] gap-2 px-3 py-1.5 text-[9px] uppercase tracking-wider font-semibold",
                        classes.subtle
                      )}>
                        <div>Task</div>
                        <div>Status</div>
                        <div>Priority</div>
                        <div>Assigned</div>
                        <div>Created</div>
                        <div>Time</div>
                      </div>

                      {stats.tasks.map((task) => {
                        const assignee = task.assignees?.[0];
                        const agent = agents.find(a => a.name === assignee);

                        return (
                          <button
                            key={task.id}
                            onClick={() => onEditTask?.(task)}
                            className={cn(
                              "w-full grid grid-cols-[1fr_90px_80px_130px_110px_90px] gap-2 px-3 py-2 rounded-md items-center text-left transition-colors",
                              isDark
                                ? "hover:bg-neutral-800/60 border border-transparent hover:border-neutral-700/50"
                                : "hover:bg-white hover:shadow-sm border border-transparent hover:border-neutral-200"
                            )}
                          >
                            {/* Task title */}
                            <div className="flex items-center gap-2 min-w-0">
                              {getStatusIcon(task.status)}
                              <span className={cn("text-[12px] truncate", classes.heading)}>
                                {task.title}
                              </span>
                            </div>

                            {/* Status */}
                            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full w-fit", getStatusColor(task.status))}>
                              {task.status.replace('_', ' ')}
                            </span>

                            {/* Priority */}
                            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full w-fit", getPriorityBadge(task.priority))}>
                              {task.priority || '—'}
                            </span>

                            {/* Assigned agent */}
                            <div className="flex items-center gap-1.5 min-w-0">
                              {assignee ? (
                                <>
                                  <img
                                    src={getAvatar(assignee)}
                                    alt={assignee}
                                    className="w-5 h-5 rounded-full border border-neutral-700 shrink-0"
                                  />
                                  <span className={cn("text-[11px] truncate", classes.muted)}>
                                    {assignee}
                                  </span>
                                  {agent && (
                                    <span className={cn(
                                      "w-1.5 h-1.5 rounded-full shrink-0",
                                      agent.status === 'active' ? 'bg-emerald-500' : agent.status === 'idle' ? 'bg-amber-500' : 'bg-neutral-500'
                                    )} />
                                  )}
                                </>
                              ) : (
                                <span className={cn("text-[11px]", classes.subtle)}>Unassigned</span>
                              )}
                            </div>

                            {/* Created */}
                            <span className={cn("text-[10px]", classes.subtle)}>
                              {timeAgo(task.created_at)}
                            </span>

                            {/* Time spent placeholder */}
                            <span className={cn("text-[10px]", classes.subtle)}>
                              {task.status === 'done' ? '—' : '—'}
                            </span>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
