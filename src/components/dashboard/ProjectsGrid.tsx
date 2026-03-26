'use client';

import { cn, getThemeClasses } from '@/lib/utils';
import { Project } from '@/lib/types';
import { FolderKanban } from 'lucide-react';

interface ProjectsGridProps {
  projects: Project[];
  tasks: { project_id: string; status: string }[];
  theme: 'dark' | 'light';
  onProjectClick?: (project: Project) => void;
}

export default function ProjectsGrid({ projects, tasks, theme, onProjectClick }: ProjectsGridProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  const getTaskCount = (projectId: string) => tasks.filter(t => t.project_id === projectId).length;
  const getActiveCount = (projectId: string) => tasks.filter(t => t.project_id === projectId && t.status === 'in_progress').length;

  if (projects.length === 0) {
    return (
      <div className={cn("rounded-xl border p-6 text-center", classes.card)}>
        <FolderKanban className={cn("w-8 h-8 mx-auto mb-2", classes.muted)} />
        <p className={cn("text-sm", classes.muted)}>No projects yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onProjectClick?.(project)}
          className={cn(
            "rounded-xl border p-4 text-left transition-colors",
            classes.card,
            isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: project.color || '#6366f1' }}
            />
            <span className={cn("text-sm font-semibold truncate", classes.heading)}>
              {project.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full capitalize",
              project.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-400'
                : classes.badge
            )}>
              {project.status}
            </span>
            <span className={cn("text-xs", classes.muted)}>
              {getActiveCount(project.id)} active / {getTaskCount(project.id)} total
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
