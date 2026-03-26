'use client';

import { useState } from 'react';
import { cn, getThemeClasses } from '@/lib/utils';
import { Project } from '@/lib/types';
import { X } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => void;
  theme: 'dark' | 'light';
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];

export default function ProjectModal({ isOpen, onClose, onSubmit, theme }: ProjectModalProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color, status: 'active' });
    setName('');
    setColor(COLORS[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-md rounded-xl border shadow-2xl", classes.card)}>
        <div className={cn("flex items-center justify-between px-5 py-4 border-b", classes.divider)}>
          <h3 className={cn("text-sm font-semibold", classes.heading)}>New Project</h3>
          <button onClick={onClose} className={cn("p-1 rounded", classes.hover)}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={cn("text-xs font-medium mb-1.5 block", classes.heading)}>Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              className={cn("w-full rounded-lg px-3 py-2 text-sm outline-none", classes.input)}
              required
            />
          </div>
          <div>
            <label className={cn("text-xs font-medium mb-1.5 block", classes.heading)}>Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-7 h-7 rounded-full transition-transform",
                    color === c && "ring-2 ring-offset-2 ring-violet-400 scale-110"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className={cn("px-4 py-2 rounded-lg text-sm", classes.hover)}>Cancel</button>
            <button type="submit" disabled={!name.trim()} className="px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
