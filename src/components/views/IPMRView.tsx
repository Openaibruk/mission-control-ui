'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import {
  Plus, AlertTriangle, Lightbulb, Wrench, CheckCircle2, Clock,
  Search, Filter, ChevronRight, Send, X
} from 'lucide-react';

interface IPMRViewProps {
  theme: 'dark' | 'light';
}

type Category = 'bug' | 'improvement' | 'feature' | 'problem';
type Priority = 'low' | 'medium' | 'high' | 'critical';
type Status = 'submitted' | 'acknowledged' | 'in_progress' | 'project_created' | 'done';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  created_at: string;
  suggested_approach?: string;
}

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'bug', label: 'Bug', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-400' },
  { id: 'improvement', label: 'Improvement', icon: <Wrench className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  { id: 'feature', label: 'Feature', icon: <Lightbulb className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  { id: 'problem', label: 'Problem', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-orange-400' },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  acknowledged: { label: 'Acknowledged', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  project_created: { label: 'Project Created', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  done: { label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'text-gray-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

export function IPMRView({ theme }: IPMRViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [showSubmit, setShowSubmit] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'improvement' as Category, priority: 'medium' as Priority });

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.feedback) setItems(data.feedback);
    } catch {}
  };

  const submitFeedback = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'submitted' }),
      });
      setForm({ title: '', description: '', category: 'improvement', priority: 'medium' });
      setShowSubmit(false);
      loadFeedback();
    } catch {}
  };

  const updateStatus = async (id: string, status: Status) => {
    try {
      await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadFeedback();
    } catch {}
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);
  const stats = {
    total: items.length,
    submitted: items.filter(i => i.status === 'submitted').length,
    in_progress: items.filter(i => i.status === 'in_progress').length,
    done: items.filter(i => i.status === 'done').length,
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn("text-lg font-semibold", classes.heading)}>📋 IPMR — Feedback Collection</h2>
          <p className={cn("text-xs", classes.muted)}>Improvement / Problem / Modification Requests</p>
        </div>
        <button
          onClick={() => setShowSubmit(!showSubmit)}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Submit IPMR
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: classes.heading },
          { label: 'Submitted', value: stats.submitted, color: 'text-blue-400' },
          { label: 'In Progress', value: stats.in_progress, color: 'text-amber-400' },
          { label: 'Done', value: stats.done, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className={cn("rounded-lg border p-3", isDark ? "border-white/5 bg-black/20" : "border-gray-200 bg-white")}>
            <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
            <p className={cn("text-[10px]", classes.muted)}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Submit Form */}
      {showSubmit && (
        <div className={cn("rounded-xl border p-4 space-y-3", isDark ? "border-white/10 bg-black/30" : "border-gray-200 bg-white")}>
          <div className="flex items-center justify-between">
            <h3 className={cn("text-sm font-semibold", classes.heading)}>Submit New IPMR</h3>
            <button onClick={() => setShowSubmit(false)} className={classes.muted}><X className="w-4 h-4" /></button>
          </div>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Title (brief summary)"
            className={cn("w-full text-sm px-3 py-2 rounded-lg border outline-none", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200")}
          />
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe the issue or improvement in detail..."
            rows={3}
            className={cn("w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200")}
          />
          <div className="flex gap-3">
            <div className="flex gap-1">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setForm(f => ({ ...f, category: c.id }))}
                  className={cn(
                    "flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border transition-colors",
                    form.category === c.id ? c.color + " border-current/30 bg-current/10" : classes.muted + " border-transparent"
                  )}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <select
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
              className={cn("text-xs px-2 py-1 rounded border outline-none", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200")}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <button
              onClick={submitFeedback}
              className="ml-auto flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <Send className="w-3 h-3" /> Submit
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn("text-[10px] px-2 py-1 rounded-full border transition-colors", filter === 'all' ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : classes.muted)}
        >
          All
        </button>
        {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn("text-[10px] px-2 py-1 rounded-full border transition-colors", filter === key ? config.bg + ' ' + config.color : classes.muted)}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className={cn("text-center py-8 text-sm", classes.muted)}>No feedback items yet. Submit your first IPMR!</p>
        )}
        {filtered.map(item => (
          <div key={item.id} className={cn("rounded-lg border p-3 transition-all hover:shadow-md", isDark ? "border-white/5 bg-black/20" : "border-gray-200 bg-white")}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-xs font-medium", classes.heading)}>{item.title}</span>
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full border", STATUS_CONFIG[item.status].bg, STATUS_CONFIG[item.status].color)}>
                    {STATUS_CONFIG[item.status].label}
                  </span>
                  <span className={cn("text-[9px]", PRIORITY_COLORS[item.priority])}>{item.priority}</span>
                </div>
                <p className={cn("text-xs", classes.muted)}>{item.description}</p>
              </div>
              <div className="flex gap-1 ml-2">
                {item.status === 'submitted' && (
                  <button onClick={() => updateStatus(item.id, 'acknowledged')} className="text-[9px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 hover:bg-violet-500/20">
                    Acknowledge
                  </button>
                )}
                {item.status === 'acknowledged' && (
                  <button onClick={() => updateStatus(item.id, 'in_progress')} className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20">
                    Start
                  </button>
                )}
                {item.status === 'in_progress' && (
                  <button onClick={() => updateStatus(item.id, 'project_created')} className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
                    Create Project
                  </button>
                )}
                {item.status === 'project_created' && (
                  <button onClick={() => updateStatus(item.id, 'done')} className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
