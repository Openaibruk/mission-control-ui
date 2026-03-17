'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Send, AlertTriangle, Lightbulb, Wrench, CheckCircle2, MessageSquarePlus } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

type Category = 'bug' | 'feature' | 'improvement';
type Priority = 'low' | 'medium' | 'high' | 'critical';

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'bug', label: 'Bug Report', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { id: 'feature', label: 'Feature Request', icon: <Lightbulb className="w-3.5 h-3.5" /> },
  { id: 'improvement', label: 'Improvement', icon: <Wrench className="w-3.5 h-3.5" /> },
];

const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: 'low', label: 'Low', color: 'text-blue-400' },
  { id: 'medium', label: 'Medium', color: 'text-amber-400' },
  { id: 'high', label: 'High', color: 'text-orange-400' },
  { id: 'critical', label: 'Critical', color: 'text-red-400' },
];

export default function FeedbackModal({ isOpen, onClose, theme }: FeedbackModalProps) {
  const isDark = theme === 'dark';
  const [category, setCategory] = useState<Category>('improvement');
  const [priority, setPriority] = useState<Priority>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, priority, status: 'submitted' }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setTitle('');
        setDescription('');
        setCategory('improvement');
        setPriority('medium');
        onClose();
      }, 2000);
    } catch {
      // Handle error silently
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-lg rounded-xl border shadow-2xl",
          isDark ? "bg-neutral-900 border-white/10" : "bg-white border-gray-200"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>
                {submitted ? 'Feedback Submitted!' : 'Submit Feedback'}
              </h3>
              <p className={cn("text-[10px]", isDark ? "text-neutral-400" : "text-gray-500")}>
                {submitted ? 'Thank you for your feedback' : 'Help us improve Mission Control'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn("p-1 rounded transition-colors", isDark ? "hover:bg-white/5 text-neutral-400" : "hover:bg-gray-100 text-gray-500")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className={cn("text-sm", isDark ? "text-neutral-300" : "text-gray-600")}>Your feedback has been logged</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Category */}
            <div>
              <label className={cn("text-[10px] font-medium mb-2 block", isDark ? "text-neutral-400" : "text-gray-500")}>CATEGORY</label>
              <div className="flex gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border transition-all",
                      category === cat.id
                        ? isDark ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-emerald-300 bg-emerald-50 text-emerald-600"
                        : isDark ? "border-white/5 text-neutral-400 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className={cn("text-[10px] font-medium mb-2 block", isDark ? "text-neutral-400" : "text-gray-500")}>PRIORITY</label>
              <div className="flex gap-2">
                {PRIORITIES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPriority(p.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs border transition-all",
                      priority === p.id
                        ? p.color + (isDark ? " border-current/30 bg-current/10" : " border-current/30 bg-current/5")
                        : isDark ? "border-white/5 text-neutral-400 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className={cn("text-[10px] font-medium mb-1 block", isDark ? "text-neutral-400" : "text-gray-500")}>TITLE</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Brief summary of your feedback"
                className={cn(
                  "w-full text-sm px-3 py-2 rounded-lg border outline-none transition-colors",
                  isDark ? "bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-emerald-500/50" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-emerald-300"
                )}
              />
            </div>

            {/* Description */}
            <div>
              <label className={cn("text-[10px] font-medium mb-1 block", isDark ? "text-neutral-400" : "text-gray-500")}>DESCRIPTION</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue or suggestion in detail..."
                rows={4}
                className={cn(
                  "w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none transition-colors",
                  isDark ? "bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-emerald-500/50" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-emerald-300"
                )}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim() || submitting}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                !title.trim() || !description.trim()
                  ? isDark ? "bg-white/5 text-neutral-500 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              )}
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
