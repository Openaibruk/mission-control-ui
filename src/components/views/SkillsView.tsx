'use client';

import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { useState, useMemo } from 'react';
import { Search, Plus, ExternalLink, Wrench, Globe, Bot, ChevronDown, ChevronUp, Package, RefreshCw } from 'lucide-react';

interface SkillsViewProps {
  theme: 'dark' | 'light';
}

interface Skill {
  name: string;
  description: string;
  category: string;
  scope: 'global' | 'agent';
  source: 'workspace' | 'npm';
}

const SKILLS: Skill[] = [
  // Core / Mission Control
  { name: 'mission-control-db', description: 'Interact with Mission Control Supabase: tasks, agents, projects, messages, activities', category: 'Core', scope: 'global', source: 'workspace' },
  { name: 'active-maintenance', description: 'System health checks, memory/log cleanup, disk maintenance', category: 'Core', scope: 'global', source: 'workspace' },
  { name: 'model-usage', description: 'Per-model usage and cost tracking from CodexBar', category: 'Core', scope: 'global', source: 'workspace' },
  
  // Google Workspace
  { name: 'gws-gmail', description: 'Gmail: send, read, manage email', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-gmail-send', description: 'Gmail: send an email', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-gmail-reply', description: 'Gmail: reply to a message (auto-threading)', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-gmail-reply-all', description: 'Gmail: reply-all to a message', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-gmail-forward', description: 'Gmail: forward a message', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-gmail-triage', description: 'Gmail: show unread inbox summary', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-gmail-watch', description: 'Gmail: watch for new emails (stream NDJSON)', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-drive', description: 'Google Drive: manage files, folders, shared drives', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-drive-upload', description: 'Google Drive: upload file with metadata', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-docs', description: 'Google Docs: read and write documents', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-docs-write', description: 'Google Docs: append text to document', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-sheets', description: 'Google Sheets: read and write spreadsheets', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-sheets-read', description: 'Google Sheets: read values', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-sheets-append', description: 'Google Sheets: append a row', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-slides', description: 'Google Slides: read and write presentations', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-calendar', description: 'Google Calendar: manage calendars and events', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-calendar-agenda', description: 'Google Calendar: show upcoming events', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-calendar-insert', description: 'Google Calendar: create new event', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-chat', description: 'Google Chat: manage spaces and messages', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-chat-send', description: 'Google Chat: send message to space', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-classroom', description: 'Google Classroom: manage classes and coursework', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-forms', description: 'Google Forms: read and write forms', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-keep', description: 'Google Keep: manage notes', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-meet', description: 'Google Meet: manage conferences', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-people', description: 'Google People: manage contacts and profiles', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-tasks', description: 'Google Tasks: manage task lists', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-admin-reports', description: 'Google Workspace Admin: audit logs and usage reports', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-events', description: 'Google Workspace Events: subscribe to events', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-events-subscribe', description: 'Workspace Events: subscribe and stream NDJSON', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-events-renew', description: 'Workspace Events: renew/reactivate subscriptions', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-shared', description: 'Shared config for GWS CLI skills', category: 'Google Workspace', scope: 'global', source: 'workspace' },
  { name: 'gws-modelarmor', description: 'Model Armor: filter user-generated content', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-modelarmor-create-template', description: 'Model Armor: create template', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-modelarmor-sanitize-prompt', description: 'Model Armor: sanitize prompt', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-modelarmor-sanitize-response', description: 'Model Armor: sanitize response', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-workflow', description: 'Cross-service productivity workflows', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-workflow-email-to-task', description: 'Convert Gmail message to Google Task', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-workflow-file-announce', description: 'Announce Drive file in Chat space', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-workflow-meeting-prep', description: 'Prepare for meeting: agenda, attendees, docs', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-workflow-standup-report', description: "Today's meetings + open tasks summary", category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  { name: 'gws-workflow-weekly-digest', description: 'Weekly summary: meetings + unread email', category: 'Google Workspace', scope: 'agent', source: 'workspace' },
  
  // DevOps / Infrastructure
  { name: 'vercel-cli', description: 'Deploy web apps, manage env vars, inspect deployments', category: 'DevOps', scope: 'agent', source: 'workspace' },
  { name: 'github-cli', description: 'GitHub CLI: repos, PRs, issues, Actions', category: 'DevOps', scope: 'agent', source: 'workspace' },
  
  // Business
  { name: 'chipchip-supplier-comm', description: 'Send automated messages to farmers/suppliers via Telegram', category: 'Business', scope: 'agent', source: 'workspace' },
  
  // Health & Security (npm global)
  { name: 'healthcheck', description: 'Host security hardening and risk-tolerance configuration', category: 'Security', scope: 'global', source: 'npm' },
  { name: 'node-connect', description: 'Diagnose OpenClaw node connection and pairing failures', category: 'Core', scope: 'global', source: 'npm' },
  { name: 'skill-creator', description: 'Create, edit, improve, or audit AgentSkills', category: 'Core', scope: 'global', source: 'npm' },
  { name: 'tmux', description: 'Remote-control tmux sessions for interactive CLIs', category: 'Core', scope: 'global', source: 'npm' },
  { name: 'weather', description: 'Get current weather and forecasts via wttr.in or Open-Meteo', category: 'Utilities', scope: 'global', source: 'npm' },
];

const CATEGORIES = ['All', 'Core', 'Google Workspace', 'DevOps', 'Business', 'Security', 'Utilities'];

export function SkillsView({ theme }: SkillsViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showScope, setShowScope] = useState<'all' | 'global' | 'agent'>('all');

  const filtered = useMemo(() => {
    return SKILLS.filter(s => {
      if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
      if (showScope !== 'all' && s.scope !== showScope) return false;
      if (search && !s.name.includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, selectedCategory, showScope]);

  const stats = {
    total: SKILLS.length,
    global: SKILLS.filter(s => s.scope === 'global').length,
    agent: SKILLS.filter(s => s.scope === 'agent').length,
    workspace: SKILLS.filter(s => s.source === 'workspace').length,
    npm: SKILLS.filter(s => s.source === 'npm').length,
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={cn("text-lg font-semibold", classes.heading)}>OpenClaw Skills</h2>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
            {stats.total} skills installed • {stats.global} global • {stats.agent} per-agent
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="https://clawhub.com"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Browse ClawhHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className={cn("p-3 rounded-lg border", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <div className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{stats.total}</div>
          <div className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>Total Skills</div>
        </div>
        <div className={cn("p-3 rounded-lg border", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <div className="text-2xl font-bold text-blue-500">{stats.global}</div>
          <div className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>Global Access</div>
        </div>
        <div className={cn("p-3 rounded-lg border", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <div className="text-2xl font-bold text-emerald-500">{stats.agent}</div>
          <div className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>Per-Agent</div>
        </div>
        <div className={cn("p-3 rounded-lg border", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <div className="text-2xl font-bold text-violet-500">{stats.workspace + stats.npm}</div>
          <div className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>Sources</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border flex-1", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <Search className={cn("w-4 h-4", isDark ? "text-gray-500" : "text-gray-400")} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className={cn("bg-transparent text-sm outline-none flex-1", isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400")}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'global', 'agent'] as const).map(scope => (
            <button
              key={scope}
              onClick={() => setShowScope(scope)}
              className={cn(
                "text-[11px] px-3 py-1.5 rounded-md font-medium transition-colors",
                showScope === scope
                  ? "bg-violet-600 text-white"
                  : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {scope === 'all' ? 'All' : scope === 'global' ? '🌍 Global' : '🤖 Per-Agent'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "text-[11px] px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors",
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills List */}
      <div className="space-y-1.5">
        {filtered.map(skill => (
          <div
            key={skill.name}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all",
              isDark ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              skill.scope === 'global' ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
            )}>
              {skill.scope === 'global' ? <Globe className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn("text-[13px] font-medium", isDark ? "text-white" : "text-gray-900")}>{skill.name}</div>
              <div className={cn("text-[11px] truncate", isDark ? "text-gray-400" : "text-gray-500")}>{skill.description}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={cn(
                "text-[9px] px-2 py-0.5 rounded-full font-medium",
                skill.category === 'Core' ? "bg-violet-500/10 text-violet-500" :
                skill.category === 'Google Workspace' ? "bg-blue-500/10 text-blue-500" :
                skill.category === 'DevOps' ? "bg-orange-500/10 text-orange-500" :
                skill.category === 'Business' ? "bg-emerald-500/10 text-emerald-500" :
                skill.category === 'Security' ? "bg-red-500/10 text-red-500" :
                "bg-gray-500/10 text-gray-400"
              )}>
                {skill.category}
              </span>
              <span className={cn(
                "text-[9px] px-2 py-0.5 rounded-full font-medium",
                skill.source === 'workspace' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {skill.source}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={cn("text-center py-12", isDark ? "text-gray-500" : "text-gray-400")}>
          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No skills match your search</p>
        </div>
      )}

      {/* How to Add Skills */}
      <div className={cn("mt-6 p-4 rounded-xl border", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}>
        <h3 className={cn("text-sm font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>How to Add New Skills</h3>
        <div className={cn("text-xs space-y-1.5", isDark ? "text-gray-400" : "text-gray-600")}>
          <p><strong>Via ClawhHub:</strong> <code className={cn("px-1.5 py-0.5 rounded text-[10px]", isDark ? "bg-gray-700" : "bg-gray-200")}>openclaw skill install &lt;skill-name&gt;</code></p>
          <p><strong>Via npm:</strong> <code className={cn("px-1.5 py-0.5 rounded text-[10px]", isDark ? "bg-gray-700" : "bg-gray-200")}>npm i -g openclaw-skill-&lt;name&gt;</code></p>
          <p><strong>Custom:</strong> Create a folder in <code className={cn("px-1.5 py-0.5 rounded text-[10px]", isDark ? "bg-gray-700" : "bg-gray-200")}>skills/</code> with a <code className={cn("px-1.5 py-0.5 rounded text-[10px]", isDark ? "bg-gray-700" : "bg-gray-200")}>SKILL.md</code> file</p>
        </div>
      </div>
    </div>
  );
}
