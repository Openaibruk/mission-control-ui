'use client';

import { cn, getThemeClasses } from '@/lib/utils';
import { Puzzle, Zap, Bot, Code } from 'lucide-react';

interface SkillsViewProps {
  theme: 'dark' | 'light';
}

const MOCK_SKILLS = [
  { name: 'weather', description: 'Get current weather and forecasts via wttr.in or Open-Meteo', icon: <Zap className="w-4 h-4 text-amber-400" /> },
  { name: 'github-cli', description: 'Use the GitHub CLI to manage repos, PRs, issues, and Actions', icon: <Code className="w-4 h-4 text-blue-400" /> },
  { name: 'healthcheck', description: 'Host security hardening and risk-tolerance configuration', icon: <Bot className="w-4 h-4 text-emerald-400" /> },
  { name: 'tmux', description: 'Remote-control tmux sessions for interactive CLIs', icon: <Puzzle className="w-4 h-4 text-violet-400" /> },
];

export default function SkillsView({ theme }: SkillsViewProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  return (
    <div className="space-y-4">
      <h2 className={cn("text-lg font-semibold flex items-center gap-2", classes.heading)}>
        <Puzzle className="w-5 h-5" /> Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MOCK_SKILLS.map((skill) => (
          <div key={skill.name} className={cn("rounded-xl border p-4", classes.card)}>
            <div className="flex items-center gap-2 mb-1.5">
              {skill.icon}
              <h3 className={cn("text-sm font-semibold font-mono", classes.heading)}>{skill.name}</h3>
            </div>
            <p className={cn("text-xs", classes.muted)}>{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
