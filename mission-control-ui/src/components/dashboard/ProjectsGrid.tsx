'use client';

import { Project } from '@/lib/types';
import { cn, getStatusBorderColor, getDepartmentColor, timeAgo } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Folder, MoreVertical, CheckCircle, Pause, Play, Archive } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ProjectsGridProps {
  projects: Project[];
  loading?: boolean;
  theme: 'dark' | 'light';
  onUpdateStatus?: (projectId: string, status: string) => void;
}

export function ProjectsGrid({ projects, loading, theme, onUpdateStatus }: ProjectsGridProps) {
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
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
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
                {onUpdateStatus && (
                  <div className="relative group">
                    <button className={cn("p-1 rounded transition-colors", isDark ? "hover:bg-white/10" : "hover:bg-gray-100")}>
                      <MoreVertical className="w-3 h-3" />
                    </button>
                    <div className={cn("absolute right-0 top-full mt-1 w-36 rounded-lg shadow-xl border py-1 z-50 hidden group-hover:block", isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-200")}>
                      {project.status !== 'complete' && (
                        <button onClick={() => onUpdateStatus(project.id, 'complete')}
                          className={cn("w-full flex items-center gap-2 px-3 py-1.5 text-[10px]", isDark ? "hover:bg-white/5" : "hover:bg-gray-50")}>
                          <CheckCircle className="w-3 h-3 text-emerald-400" /> Mark Complete
                        </button>
                      )}
                      {project.status === 'active' && (
                        <button onClick={() => onUpdateStatus(project.id, 'paused')}
                          className={cn("w-full flex items-center gap-2 px-3 py-1.5 text-[10px]", isDark ? "hover:bg-white/5" : "hover:bg-gray-50")}>
                          <Pause className="w-3 h-3 text-amber-400" /> Pause
                        </button>
                      )}
                      {project.status === 'paused' && (
                        <button onClick={() => onUpdateStatus(project.id, 'active')}
                          className={cn("w-full flex items-center gap-2 px-3 py-1.5 text-[10px]", isDark ? "hover:bg-white/5" : "hover:bg-gray-50")}>
                          <Play className="w-3 h-3 text-blue-400" /> Resume
                        </button>
                      )}
                      <button onClick={() => onUpdateStatus(project.id, 'archived')}
                        className={cn("w-full flex items-center gap-2 px-3 py-1.5 text-[10px]", isDark ? "hover:bg-white/5" : "hover:bg-gray-50")}>
                        <Archive className="w-3 h-3 text-neutral-400" /> Archive
                      </button>
                    </div>
                  </div>
                )}
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