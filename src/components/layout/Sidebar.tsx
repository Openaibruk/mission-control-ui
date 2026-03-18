'use client';

import {
  LayoutDashboard, Users, ListTodo, MessageSquare, Bell,
  Activity, FileText, DollarSign, Server,
  Clock, Webhook, Github, GitBranch,
  ShieldCheck, Zap, Moon, Sun, ChevronLeft, Settings,
  Terminal, Hammer, FolderOpen, MessageSquarePlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewType } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';

interface SidebarProps {
  view: ViewType;
  setView: (view: ViewType) => void;
  pendingCount: number;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

interface NavSection {
  label?: string;
  items: {
    id: ViewType;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
    real?: boolean; // has a working view
  }[];
}

const sections: NavSection[] = [
  {
    items: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, real: true },
      { id: 'agents', label: 'Agents', icon: Users, real: true },
      { id: 'board', label: 'Tasks', icon: ListTodo, real: true },
      { id: 'projects' as ViewType, label: 'Projects', icon: FolderOpen, real: true },
      { id: 'workflow', label: 'Workflow', icon: MessageSquare, real: true },
      { id: 'skills', label: 'Skills', icon: Hammer, real: true },
      { id: 'approvals', label: 'Approvals', icon: Bell, real: true },
      { id: 'insights', label: 'Analytics', icon: Activity, real: true },
      { id: 'feedback' as ViewType, label: 'Feedback', icon: MessageSquarePlus, real: true },
      { id: 'graph' as ViewType, label: 'Graph', icon: GitBranch, real: true },
    ],
  },
  {
    label: 'OBSERVE',
    items: [
      { id: 'activity' as ViewType, label: 'Activity', icon: Activity, real: true },
      { id: 'insights' as ViewType, label: 'Logs', icon: FileText, real: true },
    ],
  },
  {
    label: 'AUTOMATE',
    items: [
      { id: 'dashboard' as ViewType, label: 'Cron', icon: Clock },
      { id: 'dashboard' as ViewType, label: 'Webhooks', icon: Webhook },
      { id: 'dashboard' as ViewType, label: 'GitHub', icon: Github },
    ],
  },
  {
    label: 'ADMIN',
    items: [
      { id: 'settings' as ViewType, label: 'Settings', icon: Settings, real: true },
      { id: 'dashboard' as ViewType, label: 'Security', icon: ShieldCheck },
    ],
  },
];

export function Sidebar({ view, setView, pendingCount, isOpen, onClose, theme, toggleTheme }: SidebarProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const handleNavClick = (id: ViewType) => {
    setView(id);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
      <nav className={cn(
        "fixed md:relative z-50 md:z-auto w-[220px] shrink-0 flex flex-col h-screen transition-transform duration-300 -translate-x-full md:translate-x-0",
        isDark ? "bg-[#0a0e1a]" : "bg-white", "border-r", classes.divider, isOpen && "translate-x-0"
      )}>
        {/* Logo */}
        <div className={cn("h-14 flex items-center justify-between px-4 border-b shrink-0", classes.divider)}>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center text-white"><Zap className="w-3.5 h-3.5" /></div>
            <span className={cn("font-bold text-[13px]", classes.heading)}>Mission Ctrl</span>
            <span className={cn("text-[9px] px-1.5 py-0.5 rounded", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-500")}>v2.1</span>
          </div>
        </div>

        {/* GW Connected */}
        <div className="px-4 py-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-500">GW Connected</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pb-3 shrink-0">
          <div className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-[11px]", isDark ? "bg-[#111827] text-neutral-500" : "bg-neutral-100 text-neutral-400")}>
            <span>🔍</span><span>Jump to page, task, agent...</span>
            <div className="ml-auto flex gap-1">
              <kbd className={cn("text-[9px] px-1 rounded", isDark ? "bg-neutral-700 text-neutral-400" : "bg-neutral-200 text-neutral-500")}>⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scroll px-3 space-y-4">
          {sections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.label && <div className={cn("text-[9px] uppercase tracking-widest font-bold mb-2 px-2", classes.subtle)}>{section.label}</div>}
              <div className="space-y-0.5">
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isActive = sIdx === 0 ? view === item.id : view === item.id && item.real;
                  return (
                    <button key={`${sIdx}-${iIdx}`} onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-md text-[12px] font-medium transition-all",
                        isActive
                          ? isDark ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "bg-violet-100 text-violet-800"
                          : cn(classes.muted, isDark ? "hover:bg-white/5" : "hover:bg-neutral-100"),
                        !item.real && sIdx > 0 && "opacity-50"
                      )}>
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                      {item.id === 'approvals' && pendingCount > 0 && sIdx === 0 && (
                        <span className="ml-auto text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">{pendingCount}</span>
                      )}
                      {!item.real && sIdx > 0 && <span className="ml-auto text-[8px] opacity-50">soon</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className={cn("px-3 py-3 border-t space-y-2 shrink-0", classes.divider)}>
          <div className={cn("flex items-center gap-2 px-2.5 py-2 rounded-md text-[11px] cursor-pointer transition-all", isDark ? "bg-[#111827] hover:bg-[#1a2332]" : "bg-neutral-50 hover:bg-neutral-100")}>
            <Terminal className={cn("w-3.5 h-3.5", isDark ? "text-cyan-400" : "text-cyan-600")} />
            <div>
              <div className={cn("font-semibold", classes.heading)}>OpenClaw <span className={cn("text-[9px] px-1 py-0.5 rounded ml-1", isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600")}>CLI</span></div>
              <div className={cn("text-[9px]", classes.subtle)}>Gateway tools & agent control.</div>
            </div>
          </div>
          <div className={cn("flex items-center gap-2 px-2.5 py-2 rounded-md text-[11px] cursor-pointer transition-all", isDark ? "hover:bg-white/5" : "hover:bg-neutral-100")}>
            <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold">B</div>
            <div>
              <div className={cn("font-semibold", classes.heading)}>Bruk</div>
              <div className={cn("text-[9px]", classes.subtle)}>admin</div>
            </div>
          </div>
          <button onClick={toggleTheme} className={cn("w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-md text-[11px] font-medium transition-all", classes.muted, isDark ? "hover:bg-white/5" : "hover:bg-neutral-100")}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </nav>
    </>
  );
}
