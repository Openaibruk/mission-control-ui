'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { X, Save, User, Phone, Mail } from 'lucide-react';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: { name: string; phone: string; email?: string }) => void;
  theme: 'dark' | 'light';
}

export function AddDriverModal({ isOpen, onClose, onSave, theme }: AddDriverModalProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setEmail('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) return;
    onSave({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={cn("w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto", classes.card)}>
        <div className="flex justify-between items-center mb-5">
          <h3 className={cn("text-[16px] font-semibold", classes.heading)}>Add New Driver</h3>
          <button
            onClick={onClose}
            className={cn("p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 min-w-[32px] min-h-[32px] flex items-center justify-center", classes.muted)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", classes.muted)} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoFocus
                className={cn("w-full rounded-md pl-10 pr-4 py-2.5 text-[14px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}
              />
            </div>
          </div>

          <div>
            <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", classes.muted)} />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={cn("w-full rounded-md pl-10 pr-4 py-2.5 text-[14px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}
              />
            </div>
          </div>

          <div>
            <label className={cn("text-[11px] font-medium mb-1.5 block", classes.muted)}>
              Email <span className="text-neutral-400">(optional)</span>
            </label>
            <div className="relative">
              <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", classes.muted)} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@example.com"
                type="email"
                className={cn("w-full rounded-md pl-10 pr-4 py-2.5 text-[14px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/50", classes.inputBg)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={!name.trim() || !phone.trim()}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white rounded-md py-2.5 text-[13px] font-semibold flex items-center justify-center space-x-2 transition-colors min-h-[44px]"
            >
              <Save className="w-4 h-4" />
              <span>Add Driver</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
