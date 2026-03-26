'use client';

import { useState, useEffect, useMemo } from 'react';
import { cn, timeAgo } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Feedback } from '@/lib/types';
import { FeedbackStats } from '@/components/feedback/FeedbackStats';
import {
  MessageSquarePlus, Search, Filter, ChevronDown, ChevronUp,
  AlertTriangle, Lightbulb, Wrench, Clock, CheckCircle2,
  Loader2, FolderOpen, ExternalLink, RefreshCw
} from 'lucide-react';

interface FeedbackViewProps {
  theme: 'dark' | 'light';
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400', step: 0 },
  acknowledged: { label: 'Acknowledged', color: 'bg-violet-500/15 text-violet-400 border-violet-500/30', dot: 'bg-violet-400', step: 1 },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400', step: 2 },
  project_created: { label: 'Project Created', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', dot: 'bg-cyan-400', step: 3 },
  done: { label: 'Done', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400', step: 4 },
} as const;

const CATEGORY_CONFIG = {
  bug: { label: 'Bug', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-400' },
  feature: { label: 'Feature', icon: <Lightbulb className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  improvement: { label: 'Improvement', icon: <Wrench className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
} as const;

const PRIORITY_COLORS = {
  low: 'text-blue-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
} as const;

const STATUS_STEPS = ['pending', 'acknowledged', 'in_progress', 'project_created', 'done'] as const;

type StatusFilter = 'all' | 'pending' | 'in_progress' | 'project_created' | 'done';
type CategoryFilter = 'all' | 'bug' | 'feature' | 'improvement';

export function FeedbackView({ theme }: FeedbackViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFeedback(data.feedback || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load feedback');
    }
    setLoading(false);
  };

  useEffect(() => { fetchFeedback(); }, []);

  const updateStatus = async (id: string, newStatus: Feedback['status']) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: newStatus, updated_at: new Date().toISOString() } : f));
    } catch (e) {
      // silent fail
    }
    setUpdatingId(null);
  };

  const filtered = useMemo(() => {
    return feedback.filter(f => {
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
      if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [feedback, statusFilter, categoryFilter, search]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: feedback.length };
    feedback.forEach(f => { counts[f.status] = (counts[f.status] || 0) + 1; });
    return counts;
  }, [feedback]);

  const StatusStepper = ({ status }: { status: Feedback['status'] }) => {
    const currentStep = STATUS_CONFIG[status].step;
    return (
      <div className="flex items-center gap-1">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-1">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i <= currentStep ? STATUS_CONFIG[step].dot : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
            )} />
            {i < STATUS_STEPS.length - 1 && (
              <div className={cn(
                "w-4 h-0.5 rounded",
                i < currentStep ? STATUS_CONFIG[step].dot.replace('bg-', 'bg-') : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
              )} style={{
                backgroundColor: i < currentStep ? undefined : undefined
              }}>
                <div className={cn(
                  "w-full h-full rounded",
                  i < currentStep ? 'opacity-100' : 'opacity-30'
                )} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-3">
        <div className={cn("h-8 w-48 rounded animate-pulse mb-6", isDark ? "bg-neutral-800" : "bg-neutral-200")} />
        {[...Array(6)].map((_, i) => (
          <div key={i} className={cn("rounded-lg p-4 animate-pulse", classes.card)}>
            <div className={cn("h-4 w-2/3 rounded mb-2", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
            <div className={cn("h-3 w-1/3 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <MessageSquarePlus className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className={cn("text-lg font-semibold", classes.heading)}>Feedback</h2>
            <p className={cn("text-xs", classes.muted)}>{feedback.length} total submissions</p>
          </div>
        </div>
        <button
          onClick={fetchFeedback}
          className={cn("p-2 rounded-lg transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-neutral-100")}
          title="Refresh"
        >
          <RefreshCw className={cn("w-4 h-4", classes.muted)} />
        </button>
      </div>

      {/* Stats Cards */}
      <FeedbackStats feedback={feedback} theme={theme} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border flex-1 min-w-[200px]", isDark ? "bg-white/5 border-white/10" : "bg-white border-neutral-200")}>
          <Search className={cn("w-4 h-4 shrink-0", classes.muted)} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title..."
            className={cn("bg-transparent text-sm outline-none w-full", isDark ? "text-white placeholder:text-neutral-500" : "text-neutral-900 placeholder:text-neutral-400")}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          className={cn("text-xs rounded-lg px-3 py-2 border outline-none cursor-pointer", classes.inputBg)}
        >
          <option value="all">All Status ({statusCounts.all})</option>
          <option value="pending">Pending ({statusCounts.pending || 0})</option>
          <option value="in_progress">In Progress ({statusCounts.in_progress || 0})</option>
          <option value="project_created">Project Created ({statusCounts.project_created || 0})</option>
          <option value="done">Done ({statusCounts.done || 0})</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as CategoryFilter)}
          className={cn("text-xs rounded-lg px-3 py-2 border outline-none cursor-pointer", classes.inputBg)}
        >
          <option value="all">All Categories</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="improvement">Improvement</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Feedback List */}
      {filtered.length === 0 ? (
        <div className={cn("text-center py-16", classes.muted)}>
          <MessageSquarePlus className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No feedback found</p>
          <p className="text-xs mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            const cat = CATEGORY_CONFIG[item.category];
            const status = STATUS_CONFIG[item.status];

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg border transition-all",
                  classes.card,
                  isExpanded ? 'ring-1 ring-emerald-500/20' : '',
                  isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-50'
                )}
              >
                {/* Row */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Category icon */}
                  <div className={cn("shrink-0", cat.color)}>
                    {cat.icon}
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-medium truncate", classes.heading)}>
                        {item.title}
                      </span>
                      <span className={cn("text-[10px] font-medium uppercase px-1.5 py-0.5 rounded border shrink-0", status.color)}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={cn("text-[11px]", classes.muted)}>{cat.label}</span>
                      <span className={cn("text-[11px]", PRIORITY_COLORS[item.priority])}>{item.priority}</span>
                      <span className={cn("text-[11px] flex items-center gap-1", classes.subtle)}>
                        <Clock className="w-3 h-3" />
                        {timeAgo(item.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="hidden md:block shrink-0">
                    <StatusStepper status={item.status} />
                  </div>

                  {/* Expand arrow */}
                  <div className="shrink-0">
                    {isExpanded ? (
                      <ChevronUp className={cn("w-4 h-4", classes.muted)} />
                    ) : (
                      <ChevronDown className={cn("w-4 h-4", classes.muted)} />
                    )}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className={cn("px-4 pb-4 border-t pt-3", classes.divider)}>
                    {/* Description */}
                    <div className="mb-4">
                      <label className={cn("text-[10px] font-medium mb-1 block uppercase", classes.subtle)}>Description</label>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-neutral-300" : "text-neutral-600")}>
                        {item.description || <span className={classes.muted}>No description provided</span>}
                      </p>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div>
                        <label className={cn("text-[10px] font-medium block uppercase", classes.subtle)}>Submitted</label>
                        <span className={cn("text-xs", classes.muted)}>
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <label className={cn("text-[10px] font-medium block uppercase", classes.subtle)}>Last Updated</label>
                        <span className={cn("text-xs", classes.muted)}>
                          {new Date(item.updated_at).toLocaleString()}
                        </span>
                      </div>
                      {item.project_id && (
                        <div>
                          <label className={cn("text-[10px] font-medium block uppercase", classes.subtle)}>Linked Project</label>
                          <span className="text-xs text-cyan-400 flex items-center gap-1">
                            <FolderOpen className="w-3 h-3" />
                            {item.project_id}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mobile stepper */}
                    <div className="md:hidden mb-4">
                      <label className={cn("text-[10px] font-medium mb-2 block uppercase", classes.subtle)}>Status Pipeline</label>
                      <StatusStepper status={item.status} />
                    </div>

                    {/* Status actions */}
                    <div className="flex flex-wrap gap-2">
                      <label className={cn("text-[10px] font-medium mr-2 self-center uppercase", classes.subtle)}>Update Status:</label>
                      {STATUS_STEPS.map((step) => (
                        <button
                          key={step}
                          onClick={(e) => { e.stopPropagation(); updateStatus(item.id, step); }}
                          disabled={updatingId === item.id || item.status === step}
                          className={cn(
                            "text-[11px] px-3 py-1.5 rounded-lg border transition-all",
                            item.status === step
                              ? STATUS_CONFIG[step].color + ' font-medium'
                              : isDark
                                ? 'border-white/10 text-neutral-400 hover:bg-white/5'
                                : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50',
                            updatingId === item.id && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {updatingId === item.id && item.status !== step ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            STATUS_CONFIG[step].label
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
