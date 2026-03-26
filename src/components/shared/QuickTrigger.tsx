'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Zap, X, Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';

interface QuickTriggerProps {
  theme: 'dark' | 'light';
  agents: { id: string; name: string }[];
}

export function QuickTrigger({ theme, agents }: QuickTriggerProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [isOpen, setIsOpen] = useState(false);
  const [agent, setAgent] = useState('');
  const [task, setTask] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async () => {
    if (!agent || !task.trim()) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/agent-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, task: task.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ type: 'success', message: `Task assigned to @${agent}` });
        setTask('');
        setAgent('');
        setTimeout(() => {
          setIsOpen(false);
          setResult(null);
        }, 2000);
      } else {
        setResult({ type: 'error', message: data.error || 'Failed' });
      }
    } catch {
      setResult({ type: 'error', message: 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-20 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110",
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-violet-600 hover:bg-violet-700"
        )}
        title="Quick Trigger Agent"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Zap className="w-5 h-5 text-white" />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className={cn(
          "fixed bottom-[88px] right-6 z-40 w-80 rounded-xl shadow-2xl border p-4",
          isDark ? "bg-[#0f1629] border-white/10" : "bg-white border-neutral-200"
        )}>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-violet-500" />
            <h4 className={cn("text-[13px] font-bold", classes.heading)}>Quick Trigger</h4>
          </div>

          {/* Agent Selector */}
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className={cn(
              "w-full rounded-md px-3 py-2 text-[12px] outline-none mb-2 border transition-colors",
              isDark
                ? "bg-white/[0.05] border-white/10 text-white"
                : "bg-neutral-50 border-neutral-200 text-neutral-900"
            )}
          >
            <option value="">Select agent...</option>
            {agents.map(a => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>

          {/* Task Input */}
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe the task..."
            rows={3}
            className={cn(
              "w-full rounded-md px-3 py-2 text-[12px] outline-none resize-none border transition-colors mb-2",
              isDark
                ? "bg-white/[0.05] border-white/10 text-white placeholder:text-neutral-600"
                : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400"
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />

          {/* Result */}
          {result && (
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md mb-2 text-[11px]",
              result.type === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}>
              {result.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {result.message}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!agent || !task.trim() || submitting}
            className={cn(
              "w-full px-3 py-2 rounded-md text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5",
              !agent || !task.trim() || submitting
                ? "bg-violet-600/50 text-white/50 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            )}
          >
            {submitting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
            ) : (
              <><Send className="w-3.5 h-3.5" /> Trigger</>
            )}
          </button>
        </div>
      )}
    </>
  );
}
