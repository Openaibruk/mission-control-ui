'use client';

import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  ListTodo,
  Users,
  ShieldCheck,
  MessageSquare,
  Settings,
  GitBranch,
  Puzzle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';

export type ViewId =
  | 'dashboard'
  | 'projects'
  | 'agents'
  | 'tasks'
  | 'onboarding'
  | 'approvals'
  | 'feedback'
  | 'settings'
  | 'workflow'
  | 'skills'
  | 'insights';

interface SidebarProps {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
  theme: 'dark' | 'light';
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const NAV_ITEMS: { id: ViewId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
  { id: 'agents', label: 'Agents', icon: <Bot className="w-4 h-4" /> },
  { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-4 h-4" /> },
  { id: 'onboarding', label: 'Onboarding', icon: <ClipboardList className="w-4 h-4" /> },
  { id: 'approvals', label: 'Approvals', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'workflow', label: 'Workflow', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'skills', label: 'Skills', icon: <Puzzle className="w-4 h-4" /> },
  { id: 'insights', label: 'Insights', icon: <TrendingUp className="w-4 h-4" /> },
];

export function Sidebar({ activeView, onViewChange, theme, collapsed, onToggleCollapse }: SidebarProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r transition-all duration-300 shrink-0',
        classes.divider,
        classes.bg,
        collapsed ? 'w-14' : 'w-52'
      )}
    >
      {/* Logo / Title */}
      <div className={cn('h-12 flex items-center px-4 border-b', classes.divider)}>
        {!collapsed && (
          <span className={cn('text-sm font-bold tracking-tight', classes.heading)}>
            ⚡ Mission Control
          </span>
        )}
        {collapsed && (
          <span className="text-lg mx-auto">⚡</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 rounded-lg transition-colors text-left',
                collapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5',
                isActive
                  ? isDark
                    ? 'bg-white/10 text-white'
                    : 'bg-neutral-100 text-neutral-900'
                  : isDark
                    ? 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className={cn(isActive ? 'text-violet-400' : '')}>{item.icon}</span>
              {!collapsed && (
                <span className="text-[13px] font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className={cn('p-2 border-t', classes.divider)}>
        <button
          onClick={onToggleCollapse}
          className={cn(
            'w-full flex items-center justify-center rounded-lg py-1.5 transition-colors',
            isDark ? 'hover:bg-white/5 text-neutral-400' : 'hover:bg-neutral-50 text-neutral-500'
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
