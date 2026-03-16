'use client';

import { Project } from '@/lib/types';
import { cn, getStatusBorderColor, getDepartmentColor, timeAgo } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Folder } from 'lucide-react';

interface ProjectsGridProps {
  projects: Project[];
  loading?: boolean;
  theme: 'dark' | 'light';
}

export function ProjectsGrid({ projects, loading, theme }: ProjectsGridProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  if (loading) {
    return (
      <div>
        <h3 className={cn("text-[14px] font-semibold mb-4", classes.heading)}>Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={cn("flex flex-col p-4 rounded-lg animate-pulse", classes.card)}>
              <div className="flex items-center space-x-2 mb-3">
                <div className={cn("h-5 w-16 rounded-full", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
                <div className={cn("h-5 w-12 rounded-full", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
              </div>
              <div className={cn("h-5 w-3/4 rounded mb-2", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
              <div className={cn("h-4 w-full rounded mb-3", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
              <div className={cn("h-1.5 w-full rounded-full mt-auto", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div>
        <h3 className={cn("text-[14px] font-semibold mb-4", classes.heading)}>Projects</h3>
        <div className={cn("flex flex-col items-center justify-center p-8 rounded-lg", classes.card)}>
          <Folder className={cn("w-10 h-10 mb-3", classes.muted)} />
          <p className={cn("text-[13px] font-medium", classes.heading)}>No projects yet</p>
          <p className={cn("text-[11px] mt-1", classes.muted)}>Projects will appear here when created</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className={cn("text-[14px] font-semibold mb-4", classes.heading)}>Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const pct = project.total_tasks > 0 
            ? Math.round((project.done_tasks / project.total_tasks) * 100) 
            : 0;
          const isComplete = project.status === 'complete' || pct === 100;
          
          const progressColor = isComplete 
            ? 'bg-emerald-500' 
            : pct > 50 
              ? 'bg-violet-500' 
              : 'bg-amber-500';

          return (
            <div 
              key={project.id} 
              className={cn(
                "flex flex-col p-4 rounded-lg border-l-4 transition-all hover:scale-[1.02]",
                classes.card,
                getStatusBorderColor(project.status)
              )}
            >
              <div className="flex items-center space-x-2 mb-2">
                {project.department && (
                  <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full", getDepartmentColor(project.department))}>
                    {project.department}
                  </span>
                )}
                <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full", 
                  isComplete ? 'bg-emerald-500/15 text-emerald-500' : 'bg-neutral-500/15 text-neutral-400'
                )}>
                  {isComplete ? '✓ Done' : project.status?.replace('_', ' ')}
                </span>
              </div>
              
              <h4 className={cn("text-[13px] font-semibold mb-1 line-clamp-1", classes.heading)}>
                {project.name}
              </h4>
              <p className={cn("text-[11px] line-clamp-2 mb-3 flex-1", classes.muted)}>
                {project.description || 'No description'}
              </p>
              
              <div className={cn("w-full rounded-full h-1.5", isDark ? "bg-neutral-800" : "bg-neutral-200")}>
                <div 
                  className={cn("h-1.5 rounded-full transition-all duration-500", progressColor)} 
                  style={{ width: `${pct}%` }}
                />
              </div>
              
              <div className="flex justify-between mt-2">
                <span className={cn("text-[10px]", classes.muted)}>
                  {project.done_tasks}/{project.total_tasks} tasks
                </span>
                <span className={cn("text-[10px]", classes.subtle)}>
                  {timeAgo(project.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}