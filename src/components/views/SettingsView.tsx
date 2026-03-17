'use client';

import { cn, getThemeClasses } from '@/lib/utils';
import { Settings as SettingsIcon, Moon, Sun, Bell, Database, Shield } from 'lucide-react';

interface SettingsViewProps {
  theme: 'dark' | 'light';
}

export default function SettingsView({ theme }: SettingsViewProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  const sections = [
    { icon: isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, title: 'Appearance', desc: 'Dark mode is currently active. Theme switching available in future updates.' },
    { icon: <Bell className="w-4 h-4" />, title: 'Notifications', desc: 'Configure notification preferences for task updates, approvals, and agent alerts.' },
    { icon: <Database className="w-4 h-4" />, title: 'Data & Storage', desc: 'Supabase connection status, data retention policies, and export options.' },
    { icon: <Shield className="w-4 h-4" />, title: 'Security', desc: 'API keys, authentication settings, and access control.' },
  ];

  return (
    <div className="space-y-4">
      <h2 className={cn("text-lg font-semibold flex items-center gap-2", classes.heading)}>
        <SettingsIcon className="w-5 h-5" /> Settings
      </h2>
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.title} className={cn("rounded-xl border p-4", classes.card)}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-violet-400">{section.icon}</span>
              <h3 className={cn("text-sm font-semibold", classes.heading)}>{section.title}</h3>
            </div>
            <p className={cn("text-xs", classes.muted)}>{section.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
