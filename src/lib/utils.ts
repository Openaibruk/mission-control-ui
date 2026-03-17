import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ViewType = 'overview' | 'tasks' | 'agents' | 'projects' | 'activity' | 'approvals' | 'org-chart' | 'settings' | 'chat';

export const NAV_ITEMS: { id: ViewType; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'tasks', label: 'Tasks', icon: 'ListTodo' },
  { id: 'agents', label: 'Agents', icon: 'Bot' },
  { id: 'projects', label: 'Projects', icon: 'FolderKanban' },
  { id: 'activity', label: 'Activity', icon: 'Activity' },
  { id: 'approvals', label: 'Approvals', icon: 'ShieldCheck' },
  { id: 'org-chart', label: 'Org Chart', icon: 'Network' },
  { id: 'chat', label: 'Chat', icon: 'MessageSquare' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];

export interface ThemeClasses {
  bg: string;
  card: string;
  heading: string;
  text: string;
  muted: string;
  divider: string;
  input: string;
  hover: string;
  badge: string;
  border: string;
}

export function getThemeClasses(isDark: boolean): ThemeClasses {
  return {
    bg: isDark ? 'bg-neutral-950' : 'bg-white',
    card: isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200',
    heading: isDark ? 'text-white' : 'text-neutral-900',
    text: isDark ? 'text-neutral-300' : 'text-neutral-700',
    muted: isDark ? 'text-neutral-500' : 'text-neutral-400',
    divider: isDark ? 'border-neutral-800' : 'border-neutral-200',
    input: isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900',
    hover: isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100',
    badge: isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600',
    border: isDark ? 'border-neutral-700' : 'border-neutral-300',
  };
}

export const PRIORITY_COLORS: Record<number, string> = {
  1: 'text-red-400',
  2: 'text-orange-400',
  3: 'text-yellow-400',
  4: 'text-blue-400',
  5: 'text-neutral-400',
};

export const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-neutral-500',
  in_progress: 'bg-blue-500',
  approval_needed: 'bg-amber-500',
  done: 'bg-emerald-500',
  rejected: 'bg-red-500',
  blocked: 'bg-red-700',
};

export const AGENT_STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500',
  idle: 'bg-amber-500',
  offline: 'bg-neutral-500',
};

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
