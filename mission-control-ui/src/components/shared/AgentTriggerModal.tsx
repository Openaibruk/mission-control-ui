'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Zap, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AgentTriggerModalProps {
  agentName: string;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export function AgentTriggerModal({ agentName, isOpen, onClose, theme }: AgentTriggerModalProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [task, setTask] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!task.trim()) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/agent-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: agentName, task: task.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ type: 'success', message: `Task created and assigned to @${agentName}` });
        setTask('');
        setTimeout(() => {
          onClose();
          setResult(null);
        }, 2000);
      } else {
        setResult({ type: 'error', message: data.error || 'Failed to create task' });
      }
    } catch {
      setResult({ type: 'error', message: 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={cn(
          "w-full max-w-md mx-4 rounded-xl shadow-2xl border p-6",
          isDark ? "bg-[#0f1629] border-white/10" : "bg-white border-neutral-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-500" />
            <h3 className={cn("text-[15px] font-bold", classes.heading)}>
              Run Task — @{agentName}
            </h3>
          </div>
          <button onClick={onClose} className={cn("p-1 rounded-md transition-colors", isDark ? "hover:bg-white/10" : "hover:bg-neutral-100")}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Input */}
        <div className="mb-4">
          <label className={cn("text-[12px] font-medium mb-1.5 block", classes.muted)}>
            Task Description
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder={`What should @${agentName} do?`}
            rows={4}
            className={cn(
              "w-full rounded-lg px-4 py-3 text-[13px] outline-none resize-none border transition-colors",
              isDark
                ? "bg-white/[0.05] border-white/10 focus:border-violet-500/50 text-white placeholder:text-neutral-600"
                : "bg-neutral-50 border-neutral-200 focus:border-violet-400 text-neutral-900 placeholder:text-neutral-400"
            )}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />
          <div className={cn("text-[10px] mt-1", classes.muted)}>
            Press Ctrl+Enter to submit
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md mb-4 text-[12px]",
            result.type === 'success'
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-500/10 text-red-500"
          )}>
            {result.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {result.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className={cn(
              "px-4 py-2 rounded-md text-[12px] font-medium transition-colors",
              isDark ? "hover:bg-white/10 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600"
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!task.trim() || submitting}
            className={cn(
              "px-4 py-2 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5",
              !task.trim() || submitting
                ? "bg-violet-600/50 text-white/50 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            )}
          >
            {submitting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Triggering...</>
            ) : (
              <><Zap className="w-3.5 h-3.5" /> Trigger Task</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
