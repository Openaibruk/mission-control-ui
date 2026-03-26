'use client';

import { cn, STATUS_COLORS, PRIORITY_COLORS, getThemeClasses } from '@/lib/utils';
import { Task, Agent } from '@/lib/types';

interface KanbanBoardProps {
  tasks: Task[];
  agents: Agent[];
  theme: 'dark' | 'light';
  onTaskClick?: (task: Task) => void;
}

const COLUMNS: { id: string; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
  { id: 'approval_needed', label: 'Approval' },
];

export default function KanbanBoard({ tasks, agents, theme, onTaskClick }: KanbanBoardProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  const getAgent = (id?: string) => agents.find(a => a.id === id);

  const getColumnTasks = (colId: string) =>
    tasks.filter(t => t.status === colId);

  const priorityLabel = (p: number) => {
    if (p <= 1) return 'P1';
    if (p === 2) return 'P2';
    if (p === 3) return 'P3';
    return `P${p}`;
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[60vh]">
      {COLUMNS.map((col) => {
        const colTasks = getColumnTasks(col.id);
        return (
          <div key={col.id} className={cn("flex flex-col min-w-[260px] w-[260px] shrink-0")}>
            {/* Column Header */}
            <div className={cn(
              "flex items-center justify-between px-3 py-2 rounded-t-lg border-b",
              isDark ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
            )}>
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", STATUS_COLORS[col.id] || 'bg-neutral-500')} />
                <span className={cn("text-xs font-semibold uppercase tracking-wide", classes.heading)}>{col.label}</span>
              </div>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded", classes.badge)}>{colTasks.length}</span>
            </div>

            {/* Cards */}
            <div className={cn(
              "flex-1 space-y-2 p-2 rounded-b-lg",
              isDark ? "bg-neutral-900/50" : "bg-neutral-50/50"
            )}>
              {colTasks.length === 0 ? (
                <p className={cn("text-xs text-center py-4", classes.muted)}>No tasks</p>
              ) : (
                colTasks.map((task) => {
                  const agent = getAgent(task.agent_id);
                  return (
                    <button
                      key={task.id}
                      onClick={() => onTaskClick?.(task)}
                      className={cn(
                        "w-full text-left rounded-lg border p-3 transition-colors",
                        classes.card,
                        isDark ? "hover:bg-neutral-800" : "hover:bg-white"
                      )}
                    >
                      <div className={cn("text-sm font-medium mb-1 line-clamp-2", classes.heading)}>
                        {task.title}
                      </div>
                      <div className="flex items-center justify-between">
                        {agent ? (
                          <span className={cn("text-[10px]", classes.muted)}>
                            {agent.avatar_emoji} {agent.name}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className={cn("text-[10px] font-mono", PRIORITY_COLORS[task.priority] || classes.muted)}>
                          {priorityLabel(task.priority)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
