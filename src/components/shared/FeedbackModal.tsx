'use client';

import { useState } from 'react';
import { cn, getThemeClasses } from '@/lib/utils';
import { X, Send, AlertTriangle, Lightbulb, Wrench } from 'lucide-react';

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
  const classes = getThemeClasses(isDark);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('bug');
  const [priority, setPriority] = useState<Priority>('medium');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          priority,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setCategory('bug');
        setPriority('medium');
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch {
      // Silent fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-lg rounded-xl border shadow-2xl",
        classes.card
      )}>
        {/* Header */}
        <div className={cn("flex items-center justify-between px-5 py-4 border-b", classes.divider)}>
          <h3 className={cn("text-sm font-semibold", classes.heading)}>Submit Feedback</h3>
          <button
            onClick={onClose}
            className={cn("p-1 rounded transition-colors", classes.hover)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="w-5 h-5 text-emerald-400" />
            </div>
            <p className={cn("text-sm font-medium", classes.heading)}>Feedback submitted!</p>
            <p className={cn("text-xs mt-1", classes.muted)}>Thank you for your feedback.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Category */}
            <div>
              <label className={cn("text-xs font-medium mb-2 block", classes.heading)}>Category</label>
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors",
                      category === cat.id
                        ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                        : isDark ? 'border-neutral-700 hover:bg-white/5 text-neutral-400' : 'border-neutral-300 hover:bg-neutral-50 text-neutral-600'
                    )}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className={cn("text-xs font-medium mb-2 block", classes.heading)}>Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map((pri) => (
                  <button
                    key={pri.id}
                    type="button"
                    onClick={() => setPriority(pri.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs border transition-colors",
                      priority === pri.id
                        ? 'border-violet-500 bg-violet-500/10'
                        : isDark ? 'border-neutral-700 hover:bg-white/5' : 'border-neutral-300 hover:bg-neutral-50',
                      priority === pri.id ? pri.color : classes.muted
                    )}
                  >
                    {pri.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className={cn("text-xs font-medium mb-1.5 block", classes.heading)}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of your feedback..."
                className={cn("w-full rounded-lg px-3 py-2 text-sm outline-none", classes.input)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className={cn("text-xs font-medium mb-1.5 block", classes.heading)}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about your feedback..."
                className={cn("w-full rounded-lg px-3 py-2 text-sm outline-none resize-none h-24", classes.input)}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className={cn("px-4 py-2 rounded-lg text-sm", classes.hover)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || submitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
