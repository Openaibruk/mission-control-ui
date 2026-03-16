'use client';

import { Menu, Plus, Settings, FolderPlus, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { NAV_ITEMS, ViewType } from '@/lib/utils';
import { Agent, Task } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  view: ViewType;
  onMenuClick: () => void;
  onNewTask: () => void;
  onNewProject: () => void;
  onNewAgent: () => void;
  theme: 'dark' | 'light';
  agents: Agent[];
  tasks: Task[];
}

export function Header({ view, onMenuClick, onNewTask, onNewProject, onNewAgent, theme, agents, tasks }: HeaderProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeSessions = 1;
  const totalSessions = tasks.length;
  const activeAgents = agents.filter(a => a.status === 'active').length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowCreateMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={cn("h-12 border-b flex items-center justify-between px-4 md:px-6 shrink-0", classes.divider)}>
      <div className="flex items-center space-x-3">
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center">
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className={cn("text-[11px]", classes.muted)}>
          Agents <span className={cn("font-semibold", classes.heading)}>{activeAgents}</span>/{agents.length}
        </span>
        <span className={cn("text-[11px]", classes.muted)}>
          Tasks <span className={cn("font-semibold", classes.heading)}>{tasks.filter(t => t.status !== 'done' && t.status !== 'rejected').length}</span> active
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-emerald-500 font-medium">Live</span>
        </div>
      </div>

      <div className="flex items-center gap-2" ref={menuRef}>
        <div className="relative">
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="flex items-center space-x-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
          {showCreateMenu && (
            <div className={cn("absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl border z-50 py-1", classes.card)}>
              <button onClick={() => { onNewTask(); setShowCreateMenu(false); }}
                className={cn("w-full flex items-center gap-2 px-3 py-2 text-[12px] transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-neutral-50")}>
                <Plus className="w-3.5 h-3.5 text-violet-400" /> New Task
              </button>
              <button onClick={() => { onNewProject(); setShowCreateMenu(false); }}
                className={cn("w-full flex items-center gap-2 px-3 py-2 text-[12px] transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-neutral-50")}>
                <FolderPlus className="w-3.5 h-3.5 text-blue-400" /> New Project
              </button>
              <button onClick={() => { onNewAgent(); setShowCreateMenu(false); }}
                className={cn("w-full flex items-center gap-2 px-3 py-2 text-[12px] transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-neutral-50")}>
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" /> New Agent
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
