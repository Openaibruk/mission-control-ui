'use client';

import { Agent, Task } from '@/lib/types';
import { cn, getAvatar, getAgentStatusInfo } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { useMemo, useState, useEffect } from 'react';
import { Plus, UserPlus, Bell, Zap, Crown, Bot, Users, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { AgentTriggerModal } from '@/components/shared/AgentTriggerModal';

interface AgentGridProps {
  agents: Agent[];
  tasks: Task[];
  onAgentClick: (agent: Agent) => void;
  onNewAgent: () => void;
  loading?: boolean;
  theme: 'dark' | 'light';
}

interface AgentFileProfile {
  hasSoul: boolean;
  hasAgents: boolean;
  purpose: string;
  skills: string[];
  soulSnippet: string;
  agentConfig: string;
  department: string;
  subteam: string;
}

// Department → Subteam taxonomy
const DEPARTMENT_SUBTEAM_MAP: Record<string, string[]> = {
  'Orchestration': ['Coordination'],
  'Engineering': ['Build', 'Architecture', 'Integration', 'Infrastructure'],
  'Quality & Safety': ['QA', 'Security'],
  'Analytics & Insights': ['Data Science', 'Business Intelligence', 'Operations Analytics'],
  'Marketing & Content': ['Strategy', 'Content', 'Design'],
  'Research': ['Deep Research'],
  'Unassigned': ['Unassigned'],
  'Inactive': ['Inactive'],
};

// Agent → Department/Subteam override mapping (high-priority source)
const AGENT_DEPT_OVERRIDE: Record<string, { department: string; subteam: string }> = {
  Nova: { department: 'Orchestration', subteam: 'Coordination' },
  Henok: { department: 'Engineering', subteam: 'Build' },
  Forge: { department: 'Engineering', subteam: 'Build' },
  Kiro: { department: 'Engineering', subteam: 'Architecture' },
  Cipher: { department: 'Engineering', subteam: 'Integration' },
  Loki: { department: 'Engineering', subteam: 'Infrastructure' },
  Cinder: { department: 'Quality & Safety', subteam: 'QA' },
  Yonas: { department: 'Quality & Safety', subteam: 'QA' },
  Onyx: { department: 'Quality & Safety', subteam: 'Security' },
  Amen: { department: 'Analytics & Insights', subteam: 'Data Science' },
  Orion: { department: 'Analytics & Insights', subteam: 'Operations Analytics' },
  Lyra: { department: 'Analytics & Insights', subteam: 'Business Intelligence' },
  Nahom: { department: 'Marketing & Content', subteam: 'Strategy' },
  Bini: { department: 'Marketing & Content', subteam: 'Content' },
  Lidya: { department: 'Marketing & Content', subteam: 'Design' },
  Autoscientist: { department: 'Research', subteam: 'Deep Research' },
  Aria: { department: 'Unassigned', subteam: 'Unassigned' },
  Aroma: { department: 'Unassigned', subteam: 'Unassigned' },
  Vision: { department: 'Inactive', subteam: 'Inactive' },
  Pulse: { department: 'Unassigned', subteam: 'Unassigned' },
  // Default fallback for any other agent
};

const DEPARTMENT_COLORS: Record<string, { name: string; text: string; border: string; glow: string }> = {
  'Orchestration': { name: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500', glow: 'from-violet-500/5 to-violet-600/5' },
  'Engineering': { name: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', glow: 'from-blue-500/5 to-blue-600/5' },
  'Quality & Safety': { name: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', glow: 'from-rose-500/5 to-rose-600/5' },
  'Analytics & Insights': { name: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', glow: 'from-emerald-500/5 to-emerald-600/5' },
  'Marketing & Content': { name: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', glow: 'from-pink-500/5 to-pink-600/5' },
  'Research': { name: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', glow: 'from-amber-500/5 to-amber-600/5' },
  'Unassigned': { name: 'bg-gray-500', text: 'text-gray-500', border: 'border-gray-500', glow: 'from-gray-500/5 to-gray-600/5' },
  'Inactive': { name: 'bg-neutral-500', text: 'text-neutral-500', border: 'border-neutral-500', glow: 'from-neutral-500/5 to-neutral-600/5' },
};

export function AgentGrid({ agents, tasks, onAgentClick, onNewAgent, loading, theme }: AgentGridProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [pingedAgents, setPingedAgents] = useState<Set<string>>(new Set());
  const [triggerAgent, setTriggerAgent] = useState<string | null>(null);
  const [agentFileProfiles, setAgentFileProfiles] = useState<Record<string, AgentFileProfile>>({});

  // Load actual file profiles for all agents
  useEffect(() => {
    agents.forEach(agent => {
      if (agentFileProfiles[agent.name]) return;
      fetch(`/api/agents/agent-files?agent=${encodeURIComponent(agent.name)}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setAgentFileProfiles(prev => ({ ...prev, [agent.name]: data }));
          }
        })
        .catch(() => {});
    });
  }, [agents]);

  const deptHierarchy = useMemo(() => {
    const hierarchy: Record<string, Record<string, Agent[]>> = {};

    agents.forEach(agent => {
      if (agent.name === 'Bruk' || agent.name === 'Aroma') return;

      // 1. Priority: explicit override (AGENT_DEPT_OVERRIDE)
      let dept = 'Unassigned';
      let sub = 'Unassigned';
      if (AGENT_DEPT_OVERRIDE[agent.name]) {
        dept = AGENT_DEPT_OVERRIDE[agent.name].department;
        sub = AGENT_DEPT_OVERRIDE[agent.name].subteam;
      } else if (agent.department && agent.subteam) {
        // 2. Use DB fields if present
        dept = agent.department;
        sub = agent.subteam;
      } else if (agentFileProfiles[agent.name]?.department && agentFileProfiles[agent.name]?.subteam) {
        // 3. Use extracted file profile
        dept = agentFileProfiles[agent.name].department;
        sub = agentFileProfiles[agent.name].subteam;
      } else if (agent.role) {
        // 4. Fallback: infer from role
        const role = agent.role.toLowerCase();
        if (role.includes('dev') || role.includes('eng') || role.includes('code') || role.includes('build')) {
          dept = 'Engineering'; sub = 'Build';
        } else if (role.includes('architect')) {
          dept = 'Engineering'; sub = 'Architecture';
        } else if (role.includes('integration') || role.includes('connect')) {
          dept = 'Engineering'; sub = 'Integration';
        } else if (role.includes('infra') || role.includes('ops') || role.includes('devops')) {
          dept = 'Engineering'; sub = 'Infrastructure';
        } else if (role.includes('qa') || role.includes('review') || role.includes('test')) {
          dept = 'Quality & Safety'; sub = 'QA';
        } else if (role.includes('security')) {
          dept = 'Quality & Safety'; sub = 'Security';
        } else if (role.includes('analy') || role.includes('data') || role.includes('bi') || role.includes('analytics')) {
          dept = 'Analytics & Insights'; sub = 'Data Science';
        } else if (role.includes('marketing') || role.includes('seo') || role.includes('growth')) {
          dept = 'Marketing & Content'; sub = 'Strategy';
        } else if (role.includes('content') || role.includes('copy') || role.includes('social')) {
          dept = 'Marketing & Content'; sub = 'Content';
        } else if (role.includes('design') || role.includes('ui') || role.includes('ux')) {
          dept = 'Marketing & Content'; sub = 'Design';
        } else if (role.includes('research') || role.includes('researcher')) {
          dept = 'Research'; sub = 'Deep Research';
        } else if (role.includes('orchestrat') || role.includes('coordinator') || role.includes('pm')) {
          dept = 'Orchestration'; sub = 'Coordination';
        } else {
          dept = 'Unassigned'; sub = 'Unassigned';
        }
      }

      // Ensure department and subteam exist in our taxonomy
      if (!DEPARTMENT_SUBTEAM_MAP[dept]) {
        // Try to find closest match
        const match = Object.keys(DEPARTMENT_SUBTEAM_MAP).find(d => dept.toLowerCase().includes(d.toLowerCase()));
        dept = match || 'Unassigned';
      }
      if (!DEPARTMENT_SUBTEAM_MAP[dept]?.includes(sub)) {
        // Fallback to first subteam in that department
        sub = DEPARTMENT_SUBTEAM_MAP[dept]?.[0] || 'Unassigned';
      }

      if (!hierarchy[dept]) hierarchy[dept] = {};
      if (!hierarchy[dept][sub]) hierarchy[dept][sub] = [];
      hierarchy[dept][sub].push(agent);
    });

    // Convert to sorted array structure
    const deptList = Object.keys(hierarchy)
      .filter(d => d !== 'Inactive') // Hide inactive from main view
      .sort((a, b) => {
        const order = ['Orchestration', 'Engineering', 'Quality & Safety', 'Analytics & Insights', 'Marketing & Content', 'Research', 'Unassigned'];
        return (order.indexOf(a) || 999) - (order.indexOf(b) || 999);
      });

    return deptList.map(deptName => {
      const subteams = hierarchy[deptName];
      const subteamList = DEPARTMENT_SUBTEAM_MAP[deptName]
        .filter(st => subteams[st] && subteams[st].length > 0)
        .map(st => ({
          name: st,
          agents: subteams[st].sort((a, b) => a.name.localeCompare(b.name)),
          agentCount: subteams[st].length,
        }));

      const totalAgents = subteamList.reduce((sum, st) => sum + st.agentCount, 0);
      const color = DEPARTMENT_COLORS[deptName] || DEPARTMENT_COLORS['Unassigned'];

      return {
        name: deptName,
        color: color.name,
        textColor: color.text,
        borderColor: color.border,
        glow: color.glow,
        subteams: subteamList,
        agentCount: totalAgents,
      };
    });
  }, [agents, agentFileProfiles]);

  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  // If expandedDepts is empty, all departments are expanded by default

  const handlePing = async (agent: Agent, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `[PING] Agent @${agent.name} has been pinged by Bruk. Wake up and check for new tasks.` }),
      }).catch(() => {});
    } catch {}
    setPingedAgents(prev => new Set(prev).add(agent.id || agent.name));
    setTimeout(() => {
      setPingedAgents(prev => { const n = new Set(prev); n.delete(agent.id || agent.name); return n; });
    }, 5000);
  };

  const agentLastActivity = useMemo(() => {
    const lastByAgent: Record<string, Date> = {};
    tasks.forEach(task => {
      task.assignees?.forEach(assignee => {
        const name = assignee.replace(/^@+/, '');
        const taskDate = new Date(task.created_at);
        if (!lastByAgent[name] || taskDate > lastByAgent[name]) lastByAgent[name] = taskDate;
      });
    });
    return lastByAgent;
  }, [tasks]);

  const getAgentStats = (name: string) => {
    const includesAgent = (t: Task) => t.assignees?.some(a => a.replace(/^@+/, '') === name);
    const done = tasks.filter(t => t.status === 'done' && includesAgent(t)).length;
    const active = tasks.filter(t => ['assigned', 'in_progress', 'review'].includes(t.status) && includesAgent(t)).length;
    return { done, active };
  };

  const toggleDept = (name: string) => {
    setExpandedDepts(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const novaAgent = agents.find(a => a.name === 'Nova');

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={cn("h-16 rounded-xl", isDark ? "bg-neutral-800" : "bg-neutral-200")} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className={cn("text-lg font-semibold", classes.heading)}>Organization Chart</h2>
        <button onClick={onNewAgent} className="flex items-center space-x-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors">
          <UserPlus className="w-3.5 h-3.5" /><span>Add Agent</span>
        </button>
      </div>

      {/* Bruk - Root */}
      <div className="flex flex-col items-center mb-2">
        <div className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-violet-500",
          isDark ? "bg-gray-800/80" : "bg-white"
        )}>
          <Crown className="w-6 h-6 text-violet-500" />
          <div>
            <div className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>Bruk</div>
            <div className={cn("text-[10px]", isDark ? "text-gray-400" : "text-gray-500")}>Human Leader</div>
          </div>
        </div>
        {/* Vertical line */}
        <div className={cn("w-px h-6", isDark ? "bg-gray-600" : "bg-gray-300")} />
      </div>

      {/* Nova - Main Agent */}
      <div className="flex flex-col items-center mb-2">
        {novaAgent && (
          <div
            onClick={() => onAgentClick(novaAgent)}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-blue-500 cursor-pointer transition-all hover:scale-[1.02]",
              isDark ? "bg-gray-800/80" : "bg-white"
            )}
          >
            <div className="relative">
              <img src={getAvatar('Nova')} alt="Nova" className="w-10 h-10 rounded-full border-2 border-blue-400" />
              <Bot className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-500 bg-white rounded-full" />
            </div>
            <div>
              <div className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>Nova</div>
              <div className={cn("text-[10px]", isDark ? "text-gray-400" : "text-gray-500")}>Lead AI Coordinator</div>
            </div>
            <div className="ml-4 text-right">
              <div className="text-sm font-bold text-emerald-500">{getAgentStats('Nova').done}</div>
              <div className={cn("text-[9px]", isDark ? "text-gray-500" : "text-gray-400")}>done</div>
            </div>
          </div>
        )}
        {/* Vertical line */}
        <div className={cn("w-px h-6", isDark ? "bg-gray-600" : "bg-gray-300")} />
      </div>

      {/* Departments */}
      <div className="flex flex-col gap-4">
        {deptHierarchy.map((dept) => {
          const isExpanded = expandedDepts.size === 0 || expandedDepts.has(dept.name);
          return (
            <div key={dept.name} className="rounded-xl border overflow-hidden">
              {/* Department Header */}
              <button
                onClick={() => toggleDept(dept.name)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 transition-all",
                  isDark ? "bg-gray-800/60 border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", dept.color)} />
                  <div>
                    <div className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>{dept.name}</div>
                    <div className={cn("text-[10px]", isDark ? "text-gray-500" : "text-gray-400")}>{dept.agentCount} agents</div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {/* Subteams & Agents */}
              {isExpanded && (
                <div className={cn("p-3 space-y-3", isDark ? "bg-gray-900/20" : "bg-gray-50/50")}>
                  {dept.subteams.map((sub) => (
                    <div key={sub.name}>
                      <div className={cn("text-[11px] font-medium mb-2 flex items-center gap-2", isDark ? "text-gray-500" : "text-gray-500")}>
                        <div className="w-1 h-1 rounded-full bg-current" />
                        {sub.name}
                        <span className={cn("px-1.5 py-0.5 rounded text-[9px]", isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600")}>
                          {sub.agentCount}
                        </span>
                      </div>
                      <div className="space-y-1.5 pl-3 border-l-2 border-dashed" style={{ borderColor: isDark ? '#374151' : '#d1d5db' }}>
                        {sub.agents.map((agent) => {
                          const agentData = agents.find(a => a.name === agent.name);
                          if (!agentData) return null;
                          const stats = getAgentStats(agent.name);
                          const lastActivity = agentLastActivity[agent.name] || null;
                          const statusInfo = getAgentStatusInfo(lastActivity);
                          const pinged = pingedAgents.has(agent.id || agent.name);

                          return (
                            <div
                              key={agent.name}
                              onClick={() => onAgentClick(agentData)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:scale-[1.01]",
                                isDark ? "bg-gray-800/40 hover:bg-gray-800" : "bg-white hover:bg-white hover:shadow-sm"
                              )}
                            >
                              <div className="relative flex-shrink-0">
                                <img src={getAvatar(agent.name)} alt={agent.name} className="w-9 h-9 rounded-full" />
                                <div className={cn(
                                  "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center",
                                  isDark ? "border-gray-800" : "border-white",
                                  statusInfo.color
                                )}
>{statusInfo.icon}</div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={cn("text-[13px] font-medium truncate", isDark ? "text-white" : "text-gray-900")}>{agent.name}</div>
                                <div className={cn("text-[10px] truncate", isDark ? "text-gray-500" : "text-gray-400")}>{agent.role || 'Agent'}</div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {stats.done > 0 && (
                                  <span className="text-[11px] font-semibold text-emerald-500">{stats.done}</span>
                                )}
                                {stats.active > 0 && (
                                  <span className="text-[10px] text-amber-400">{stats.active}</span>
                                )}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setTriggerAgent(agent.name); }}
                                  className={cn(
                                    "p-1.5 rounded-md transition-all",
                                    isDark
                                      ? "hover:bg-emerald-600/20 text-gray-500 hover:text-emerald-400"
                                      : "hover:bg-emerald-50 text-gray-400 hover:text-emerald-600"
                                  )}
                                  title={`Run task for ${agent.name}`}
                                >
                                  <Play className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => handlePing(agentData, e)}
                                  className={cn(
                                    "p-1.5 rounded-md transition-all",
                                    pinged
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : isDark
                                        ? "hover:bg-violet-600/20 text-gray-500 hover:text-violet-400"
                                        : "hover:bg-violet-50 text-gray-400 hover:text-violet-600"
                                  )}
                                >
                                  {pinged ? <Zap className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Agent Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onNewAgent}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed transition-all",
            isDark
              ? "border-gray-700 hover:border-violet-500/30 hover:bg-violet-500/5 text-gray-500 hover:text-violet-400"
              : "border-gray-300 hover:border-violet-400 hover:bg-violet-50 text-gray-400 hover:text-violet-600"
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Agent</span>
        </button>
      </div>

      {/* Agent Trigger Modal */}
      <AgentTriggerModal
        agentName={triggerAgent || ''}
        isOpen={!!triggerAgent}
        onClose={() => setTriggerAgent(null)}
        theme={theme}
      />
    </div>
  );
}
