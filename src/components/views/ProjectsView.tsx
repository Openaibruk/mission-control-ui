'use client';

import { cn, getThemeClasses } from '@/lib/utils';
import { Project, Task } from '@/lib/types';
import { FolderKanban, Plus } from 'lucide-react';
import ProjectsGrid from '@/components/dashboard/ProjectsGrid';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  theme: 'dark' | 'light';
  onNewProject?: () => void;
  onProjectClick?: (project: Project) => void;
}

export default function ProjectsView({ projects, tasks, theme, onNewProject, onProjectClick }: ProjectsViewProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={cn("text-lg font-semibold flex items-center gap-2", classes.heading)}>
          <FolderKanban className="w-5 h-5" /> Projects
        </h2>
        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New Project
        </button>
      </div>
      <ProjectsGrid projects={projects} tasks={tasks} theme={theme} onProjectClick={onProjectClick} />
    </div>
  );
}
