'use client';

import { Agent, Task, DashboardStats, Project } from '@/lib/types';
import { cn, getAvatar, getStatusColor } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { CheckCircle2, Check, Users, Zap, FolderOpen, TrendingUp } from 'lucide-react';

interface InsightsViewProps {
  stats: DashboardStats;
  agents: Agent[];
  tasks: Task[];
  projects: Project[];
  loading?: boolean;
  theme: 'dark' | 'light';
}

export function InsightsView({ stats, agents, tasks, projects, loading, theme }: InsightsViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className={cn("flex flex-col p-4 rounded-lg animate-pulse", classes.card)}>
            <div className={cn("h-3 w-12 rounded mb-3", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
            <div className={cn("h-8 w-16 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
          </div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'rate', label: 'Completion Rate', value: `${stats.rate}%`, icon: CheckCircle2, color: 'text-emerald-500', border: 'border-emerald-500' },
          { key: 'done', label: 'Tasks Done', value: String(stats.done), icon: Check, color: 'text-violet-500', border: 'border-violet-500' },
          { key: 'agents', label: 'Agents', value: String(agents.length), icon: Users, color: 'text-blue-500', border: 'border-blue-500' },
          { key: 'projects', label: 'Projects', value: String(projects.length), icon: FolderOpen, color: 'text-amber-500', border: 'border-amber-500' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className={cn("flex flex-col p-4 rounded-lg border-l-4 transition-all hover:scale-[1.02]", classes.card, item.border)}>
              <div className={cn("text-[10px] uppercase font-semibold mb-2", item.color)}>{item.label}</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold">{item.value}</div>
                <Icon className={cn("w-5 h-5", item.color)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Performance */}
      <div>
        <h3 className={cn("text-[14px] font-semibold mb-4 flex items-center gap-2", classes.heading)}>
          <FolderOpen className="w-4 h-4 text-violet-400" /> Project Performance
        </h3>
        <div className={cn("rounded-lg overflow-x-auto", classes.card)}>
          <table className="w-full text-[13px] min-w-[500px]">
            <thead>
              <tr className={cn("border-b", classes.divider)}>
                <th className={cn("text-left px-4 py-3 text-[11px] font-medium uppercase", classes.muted)}>Project</th>
                <th className={cn("text-left px-4 py-3 text-[11px] font-medium uppercase", classes.muted)}>Status</th>
                <th className={cn("text-left px-4 py-3 text-[11px] font-medium uppercase", classes.muted)}>Tasks</th>
                <th className={cn("text-left px-4 py-3 text-[11px] font-medium uppercase", classes.muted)}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const pct = p.total_tasks > 0 ? Math.round((p.done_tasks / p.total_tasks) * 100) : 0;
                return (
                  <tr key={p.id} className={cn("border-t", isDark ? "border-neutral-800" : "border-neutral-100")}>
                    <td className={cn("px-4 py-3 text-[12px] font-medium", classes.heading)}>{p.name}</td>
                    <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full", getStatusColor(p.status))}>{p.status}</span></td>
                    <td className={cn("px-4 py-3 text-[12px]", classes.muted)}>{p.done_tasks}/{p.total_tasks}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-24 rounded-full h-1.5", isDark ? "bg-neutral-700" : "bg-neutral-200")}>
                          <div className={cn("h-1.5 rounded-full transition-all", pct === 100 ? "bg-emerald-500" : "bg-violet-500")} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={cn("text-[10px] font-medium", pct === 100 ? "text-emerald-500" : classes.muted)}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Performance */}
      <div>
        <h3 className={cn("text-[14px] font-semibold mb-4 flex items-center gap-2", classes.heading)}>
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Agent Performance
        </h3>
        <div className={cn("rounded-lg overflow-x-auto", classes.card)}>
          <table className="w-full text-[13px] min-w-[500px]">
            <thead>
              <tr className={cn("border-b", classes.divider)}>
                <th className={cn("text-left px-4 py-3 text-[11px] font-medium uppercase", classes.muted, "sticky left-0", isDark ? "bg-[#111113]" : "bg-white")}>Agent</th>
                <th className={cn("text-left px-4 py-3 text-[11px] font-medium uppercase", classes.muted)}>Done</th>
                <th className={cn("text-left px-4 py-3 text-[11px] font-medium uppercase", classes.muted)}>Active</th>
                <th className={cn("text-left px-4 py-3 text-[11px] font-medium uppercase", classes.muted)}>Impact</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => {
                const tag = `@${agent.name}`;
                const done = tasks.filter(t => t.status === 'done' && t.assignees?.includes(tag)).length;
                const active = tasks.filter(t => ['assigned', 'in_progress', 'review'].includes(t.status) && t.assignees?.includes(tag)).length;
                const impact = stats.total > 0 ? Math.round((done / stats.total) * 100) : 0;
                return (
                  <tr key={agent.id} className={cn("border-t transition-colors", isDark ? "border-neutral-800 hover:bg-neutral-800/[0.05]" : "border-neutral-100 hover:bg-neutral-50")}>
                    <td className={cn("px-4 py-3 font-medium flex items-center space-x-2 sticky left-0", classes.heading, isDark ? "bg-[#111113]" : "bg-white")}>
                      <img src={getAvatar(agent.name)} alt={agent.name} className="w-6 h-6 rounded-full border border-neutral-700" />
                      <span className="text-[12px]">{agent.name}</span>
                    </td>
                    <td className="px-4 py-3 text-emerald-500 font-medium text-[12px]">{done}</td>
                    <td className="px-4 py-3 text-amber-500 text-[12px]">{active}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-20 rounded-full h-1.5", isDark ? "bg-neutral-700" : "bg-neutral-200")}>
                          <div className="bg-violet-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(impact, 100)}%` }} />
                        </div>
                        <span className={cn("text-[10px]", classes.muted)}>{impact}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
