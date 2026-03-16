'use client';

import { Task, Agent } from '@/lib/types';
import { cn, getAvatar, KANBAN_COLUMNS, timeAgo, extractFilePath } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { AlertTriangle, Bell, ExternalLink, Download, FileText, Image, Link2, ChevronRight, MoveRight } from 'lucide-react';
import { useState } from 'react';

interface KanbanBoardProps {
  tasks: Task[];
  agents: Agent[];
  onTaskClick: (task: Task) => void;
  onMoveTask: (taskId: string, newStatus: string) => void;
  onNewTask?: () => void;
  loading?: boolean;
  theme: 'dark' | 'light';
}

function isStalled(task: Task): boolean {
  const age = Date.now() - new Date(task.created_at).getTime();
  if (task.status === 'in_progress' && age > 3600000) return true;
  if (task.status === 'assigned' && age > 7200000) return true;
  return false;
}

function MoveMenu({ task, onMove, isDark }: { task: Task; onMove: (id: string, status: string) => void; isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const currentIdx = KANBAN_COLUMNS.findIndex(c => c.id === task.status);
  const nextCol = KANBAN_COLUMNS[currentIdx + 1];
  const prevCol = KANBAN_COLUMNS[currentIdx - 1];

  if (!nextCol && !prevCol) return null;

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-md font-medium transition-all",
          isDark ? "bg-violet-600/20 text-violet-400 hover:bg-violet-600/30" : "bg-violet-50 text-violet-600 hover:bg-violet-100"
        )}
      >
        <MoveRight className="w-3 h-3" /> Move
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={cn(
            "absolute bottom-full mb-1 right-0 z-50 rounded-lg shadow-xl border py-1 min-w-[140px]",
            isDark ? "bg-[#111113] border-neutral-700" : "bg-white border-neutral-200"
          )}>
            {prevCol && (
              <button
                onClick={() => { onMove(task.id, prevCol.id); setOpen(false); }}
                className={cn("w-full text-left px-3 py-2 text-[11px] transition-colors flex items-center gap-2", isDark ? "hover:bg-white/5" : "hover:bg-neutral-50")}
              >
                <span className={cn("w-2 h-2 rounded-full")} style={{ backgroundColor: prevCol.color }} />
                ← {prevCol.title}
              </button>
            )}
            {nextCol && (
              <button
                onClick={() => { onMove(task.id, nextCol.id); setOpen(false); }}
                className={cn("w-full text-left px-3 py-2 text-[11px] transition-colors flex items-center gap-2", isDark ? "hover:bg-white/5" : "hover:bg-neutral-50")}
              >
                <span className={cn("w-2 h-2 rounded-full")} style={{ backgroundColor: nextCol.color }} />
                → {nextCol.title}
              </button>
            )}
            {/* Also allow jumping to Done from any column */}
            {task.status !== 'done' && (
              <button
                onClick={() => { onMove(task.id, 'done'); setOpen(false); }}
                className={cn("w-full text-left px-3 py-2 text-[11px] transition-colors flex items-center gap-2 border-t mt-1 pt-2", isDark ? "hover:bg-white/5 border-neutral-700" : "hover:bg-neutral-50 border-neutral-100")}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                ✓ Done (skip)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function KanbanBoard({ tasks, agents, onTaskClick, onMoveTask, onNewTask, loading, theme }: KanbanBoardProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [pingedTasks, setPingedTasks] = useState<Set<string>>(new Set());

  const handlePing = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setPingedTasks(prev => new Set(prev).add(task.id));
    setTimeout(() => setPingedTasks(prev => { const n = new Set(prev); n.delete(task.id); return n; }), 3000);
  };

  if (loading) {
    return (
      <div className="p-4 flex h-full">
        <div className="flex gap-4 h-full w-full overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => (
            <div key={col.id} className="min-w-[280px] flex-1 flex flex-col">
              <div className="flex items-center space-x-2 mb-3 px-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className={cn("text-[13px] font-semibold", classes.heading)}>{col.title}</h3>
              </div>
              <div className={cn("flex-1 rounded-lg p-2 space-y-2", isDark ? "bg-white/[0.02]" : "bg-neutral-50")}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={cn("rounded-lg p-3 animate-pulse", classes.card)}>
                    <div className={cn("h-4 w-3/4 rounded mb-2", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
                    <div className={cn("h-3 w-full rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Board header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h2 className={cn("text-[14px] font-semibold", classes.heading)}>Task Board</h2>
          <span className={cn("text-[11px]", classes.muted)}>{tasks.length} tasks</span>
          {tasks.some(isStalled) && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" />
              {tasks.filter(isStalled).length} stalled
            </span>
          )}
        </div>
        {onNewTask && (
          <button onClick={onNewTask} className="flex items-center space-x-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors">
            <ChevronRight className="w-3.5 h-3.5 rotate-0" /><span>Add Task</span>
          </button>
        )}
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 pb-4">
        <div className="flex gap-3 h-full min-w-max">
          {KANBAN_COLUMNS.map((column) => {
            const columnTasks = tasks.filter(t => t.status === column.id);

            return (
              <div key={column.id} className="w-[300px] flex flex-col h-full">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                    <h3 className={cn("text-[13px] font-semibold", classes.heading)}>{column.title}</h3>
                    <span className={cn("text-[11px] px-1.5 py-0.5 rounded-full", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-200 text-neutral-600")}>
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task list */}
                <div className={cn("flex-1 rounded-lg p-2 space-y-2 overflow-y-auto custom-scroll", isDark ? "bg-white/[0.02]" : "bg-neutral-50/50")}>
                  {columnTasks.map((task) => {
                    const stalled = isStalled(task);
                    const pinged = pingedTasks.has(task.id);
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "group border rounded-lg p-3 transition-all",
                          classes.card, classes.hoverCard,
                          stalled && "border-amber-500/40 bg-amber-500/5"
                        )}
                      >
                        {/* Stall warning */}
                        {stalled && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1 text-[9px] text-amber-400 font-semibold">
                              <AlertTriangle className="w-3 h-3" /> STALLED · {timeAgo(task.created_at)}
                            </span>
                            <button
                              onClick={(e) => handlePing(task, e)}
                              className={cn(
                                "flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-medium transition-all",
                                pinged ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                              )}
                            >
                              <Bell className="w-2.5 h-2.5" />
                              {pinged ? 'Pinged!' : 'Ping'}
                            </button>
                          </div>
                        )}

                        {/* Clickable content */}
                        <div onClick={() => onTaskClick(task)} className="cursor-pointer">
                          <h4 className={cn("text-[12px] font-medium mb-1 line-clamp-2", classes.heading)}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className={cn("text-[10px] line-clamp-2 mb-2", classes.muted)}>{task.description}</p>
                          )}
                        </div>

                        {/* Output for done tasks */}
                        {task.status === 'done' && (() => {
                          const filePath = extractFilePath(task.description || '');
                          if (!filePath) return null;
                          return (
                            <div onClick={e => e.stopPropagation()} className={cn("mb-2 p-2 rounded-md border", isDark ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50 border-emerald-200")}>
                              <div className="flex items-center gap-1 mb-1">
                                <FileText className="w-3 h-3 text-emerald-400" />
                                <span className="text-[9px] text-emerald-500 font-semibold uppercase">Output</span>
                              </div>
                              <div className={cn("text-[10px] truncate mb-1.5 font-mono px-1 py-0.5 rounded", isDark ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-600")}>
                                {filePath}
                              </div>
                              <div className="flex gap-1">
                                <a href={`/api/files?path=${encodeURIComponent(filePath)}&action=view`} target="_blank" rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center gap-1 text-[9px] bg-violet-600/20 text-violet-400 border border-violet-500/20 rounded px-2 py-1">
                                  <ExternalLink className="w-2.5 h-2.5" /> View
                                </a>
                                <a href={`/api/files?path=${encodeURIComponent(filePath)}&action=download`}
                                  className="flex-1 flex items-center justify-center gap-1 text-[9px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded px-2 py-1">
                                  <Download className="w-2.5 h-2.5" /> Download
                                </a>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Footer with move controls */}
                        <div className="flex items-center justify-between mt-2" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                              {task.assignees?.slice(0, 3).map((assignee, i) => (
                                <img key={i} src={getAvatar(assignee.replace('@', ''))} alt={assignee}
                                  className="w-5 h-5 rounded-full border-2 border-neutral-900" title={assignee} />
                              ))}
                            </div>
                            <span className={cn("text-[9px]", classes.subtle)}>{timeAgo(task.created_at)}</span>
                          </div>
                          <MoveMenu task={task} onMove={onMoveTask} isDark={isDark} />
                        </div>
                      </div>
                    );
                  })}

                  {columnTasks.length === 0 && (
                    <div className={cn("flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg", classes.divider)}>
                      <p className={cn("text-[11px]", classes.muted)}>No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
