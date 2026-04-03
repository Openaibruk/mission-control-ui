'use client';

import { Agent, Task } from '@/lib/types';
import { cn, getAvatar, getAgentStatusInfo, getDepartmentColor } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { useMemo, useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Users, Zap, Crown, Bot, Play, Bell } from 'lucide-react';
import { AgentTriggerModal } from '@/components/shared/AgentTriggerModal';

interface OrganizationViewProps {
  agents: Agent[];
  tasks: Task[];
  onAgentClick: (agent: Agent) => void;
  theme: 'dark' | 'light';
}

interface OrgNode {
  id: string;
  name: string;
  type: 'department' | 'subteam' | 'agent';
  color: string;
  textColor: string;
  borderColor: string;
  agents: Agent[];
  children?: OrgNode[];
  agentCount: number;
  activeCount: number;
  doneCount: number;
}

// Define canonical department structure
const DEPARTMENT_HIERARCHY: Record<string, { subteams: string[]; description: string }> = {
  'Core Leadership': {
    subteams: ['Orchestration', 'Coordination'],
    description: 'Strategic direction, agent orchestration, system coherence'
  },
  'Engineering': {
    subteams: ['Build', 'Architecture', 'Integration', 'Security'],
    description: 'Implementation, infrastructure, code quality, security'
  },
  'Analytics & Insights': {
    subteams: ['Data', 'Research', 'BI', 'Forecasting'],
    description: 'Data analysis, research, business intelligence, predictions'
  },
  'Marketing & Creative': {
    subteams: ['Content', 'Design', 'Social', 'Growth'],
    description: 'Content creation, visual design, social media, acquisition'
  },
  'Operations': {
    subteams: ['HR', 'Logistics', 'Support', 'Process'],
    description: 'People ops, delivery, customer support, workflows'
  },
  'Product': {
    subteams: ['Feature', 'UX', 'QA', 'Roadmap'],
    description: 'Feature development, user experience, quality assurance'
  },
};

// Agent → Department/Subteam mapping (canonical)
const AGENT_MAPPING: Record<string, { dept: string; subteam: string }> = {
  // Core Leadership
  'Nova': { dept: 'Core Leadership', subteam: 'Orchestration' },
  'Bruk': { dept: 'Core Leadership', subteam: 'Coordination' },
  'Aroma': { dept: 'Core Leadership', subteam: 'Coordination' },

  // Engineering
  'Henok': { dept: 'Engineering', subteam: 'Build' },
  'Forge': { dept: 'Engineering', subteam: 'Build' },
  'Kiro': { dept: 'Engineering', subteam: 'Architecture' },
  'Cipher': { dept: 'Engineering', subteam: 'Integration' },
  'Onyx': { dept: 'Engineering', subteam: 'Security' },
  'Autoscientist': { dept: 'Engineering', subteam: 'Integration' },
  'System-Agent': { dept: 'Engineering', subteam: 'Integration' },
  'Backend-Agent': { dept: 'Engineering', subteam: 'Build' },
  'UI-Agent': { dept: 'Engineering', subteam: 'Build' },
  'Data-Agent': { dept: 'Engineering', subteam: 'Build' },

  // Analytics & Insights
  'Amen': { dept: 'Analytics & Insights', subteam: 'Data' },
  'Lyra': { dept: 'Analytics & Insights', subteam: 'BI' },
  'Orion': { dept: 'Analytics & Insights', subteam: 'BI' },
  'Vision': { dept: 'Analytics & Insights', subteam: 'Research' },
  'Researcher': { dept: 'Analytics & Insights', subteam: 'Research' },

  // Marketing & Creative
  'Nahom': { dept: 'Marketing & Creative', subteam: 'Growth' },
  'Bini': { dept: 'Marketing & Creative', subteam: 'Content' },
  'Lidya': { dept: 'Marketing & Creative', subteam: 'Design' },
  'Echo': { dept: 'Marketing & Creative', subteam: 'Content' },
  'Maven': { dept: 'Marketing & Creative', subteam: 'Growth' },
  'Pixel': { dept: 'Marketing & Creative', subteam: 'Design' },

  // Operations
  'Cinder': { dept: 'Operations', subteam: 'QA' },
  'Yonas': { dept: 'Operations', subteam: 'Support' },
  'Pulse': { dept: 'Operations', subteam: 'Process' },
  'Reviewer': { dept: 'Operations', subteam: 'QA' },
  'Builder': { dept: 'Operations', subteam: 'Process' },

  // Product
  'Loki': { dept: 'Product', subteam: 'Roadmap' },
};

const DEPARTMENT_COLORS = [
  { name: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', glow: 'from-blue-500/5 to-blue-600/5', light: 'bg-blue-50', dark: 'bg-blue-900/20' },
  { name: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500', glow: 'from-violet-500/5 to-violet-600/5', light: 'bg-violet-50', dark: 'bg-violet-900/20' },
  { name: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', glow: 'from-emerald-500/5 to-emerald-600/5', light: 'bg-emerald-50', dark: 'bg-emerald-900/20' },
  { name: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', glow: 'from-amber-500/5 to-amber-600/5', light: 'bg-amber-50', dark: 'bg-amber-900/20' },
  { name: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', glow: 'from-pink-500/5 to-pink-600/5', light: 'bg-pink-50', dark: 'bg-pink-900/20' },
  { name: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500', glow: 'from-cyan-500/5 to-cyan-600/5', light: 'bg-cyan-50', dark: 'bg-cyan-900/20' },
  { name: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', glow: 'from-orange-500/5 to-orange-600/5', light: 'bg-orange-50', dark: 'bg-orange-900/20' },
  { name: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', glow: 'from-rose-500/5 to-rose-600/5', light: 'bg-rose-50', dark: 'bg-rose-900/20' },
];

export function OrganizationView({ agents, tasks, onAgentClick, theme }: OrganizationViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [pingedAgents, setPingedAgents] = useState<Set<string>>(new Set());
  const [triggerAgent, setTriggerAgent] = useState<string | null>(null);

  // Build hierarchical org structure
  const orgTree = useMemo(() => {
    const deptMap = new Map<string, OrgNode>();
    const subteamMap = new Map<string, OrgNode>();

    // Initialize departments
    Object.keys(DEPARTMENT_HIERARCHY).forEach((deptName, idx) => {
      const colorSet = DEPARTMENT_COLORS[idx % DEPARTMENT_COLORS.length];
      deptMap.set(deptName, {
        id: `dept-${deptName}`,
        name: deptName,
        type: 'department',
        color: colorSet.name,
        textColor: colorSet.textColor,
        borderColor: colorSet.border,
        agents: [],
        children: [],
        agentCount: 0,
        activeCount: 0,
        doneCount: 0,
      });
    });

    // Initialize subteams under departments
    DEPARTMENT_HIERARCHY.forEach((info, deptName) => {
      const deptNode = deptMap.get(deptName)!;
      info.subteams.forEach((subteam) => {
        const colorSet = DEPARTMENT_COLORS[deptMap.size % DEPARTMENT_COLORS.length];
        const subteamNode: OrgNode = {
          id: `${deptName}-${subteam}`,
          name: subteam,
          type: 'subteam',
          color: colorSet.name,
          textColor: colorSet.textColor,
          borderColor: colorSet.border,
          agents: [],
          children: [],
          agentCount: 0,
          activeCount: 0,
          doneCount: 0,
        };
        deptNode.children!.push(subteamNode);
        subteamMap.set(subteam, subteamNode);
      });
    });

    // Assign agents to org nodes
    agents.forEach(agent => {
      if (agent.name === 'Bruk' || agent.name === 'Aroma') return; // Skip meta agents
      const mapping = AGENT_MAPPING[agent.name];
      if (!mapping) {
        // Unmapped agents go to "General" in their inferred department
        const deptName = agent.department || 'Engineering';
        if (!deptMap.has(deptName)) {
          const colorSet = DEPARTMENT_COLORS[deptMap.size % DEPARTMENT_COLORS.length];
          deptMap.set(deptName, {
            id: `dept-${deptName}`,
            name: deptName,
            type: 'department',
            color: colorSet.name,
            textColor: colorSet.textColor,
            borderColor: colorSet.border,
            agents: [],
            children: [],
            agentCount: 0,
            activeCount: 0,
            doneCount: 0,
          });
        }
        const deptNode = deptMap.get(deptName)!;
        deptNode.agents.push(agent);
        deptNode.agentCount++;
        // Count tasks
        const agentTasks = tasks.filter(t => t.assignees?.some(a => a.replace(/^@+/, '') === agent.name));
        deptNode.activeCount += agentTasks.filter(t => ['assigned', 'in_progress', 'review'].includes(t.status)).length;
        deptNode.doneCount += agentTasks.filter(t => t.status === 'done').length;
      } else {
        const deptNode = deptMap.get(mapping.dept)!;
        const subteamNode = subteamMap.get(mapping.subteam)!;
        
        subteamNode.agents.push(agent);
        subteamNode.agentCount++;
        subteamNode.activeCount += tasks.filter(t => t.assignees?.some(a => a.replace(/^@+/, '') === agent.name) && ['assigned', 'in_progress', 'review'].includes(t.status)).length;
        subteamNode.doneCount += tasks.filter(t => t.assignees?.some(a => a.replace(/^@+/, '') === agent.name) && t.status === 'done').length;
        
        // Also aggregate to department
        deptNode.activeCount += subteamNode.activeCount;
        deptNode.doneCount += subteamNode.doneCount;
      }
    });

    // Final department counts
    deptMap.forEach(dept => {
      dept.agentCount = dept.children!.reduce((sum, child) => sum + child.agentCount, 0);
    });

    return Array.from(deptMap.values()).filter(d => d.agentCount > 0);
  }, [agents, tasks]);

  const getAgentStats = (agentName: string) => {
    const includesAgent = (t: Task) => t.assignees?.some(a => a.replace(/^@+/, '') === agentName);
    const done = tasks.filter(t => t.status === 'done' && includesAgent(t)).length;
    const active = tasks.filter(t => ['assigned', 'in_progress', 'review'].includes(t.status) && includesAgent(t)).length;
    return { done, active };
  };

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

  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(orgTree.map(d => d.id)));
  const [expandedSubteams, setExpandedSubteams] = useState<Set<string>>(new Set());

  const toggleDept = (deptId: string) => {
    setExpandedDepts(prev => {
      const next = new Set(prev);
      if (next.has(deptId)) {
        next.delete(deptId);
        // Collapse all subteams
        orgTree.forEach(dept => {
          if (dept.id === deptId) {
            dept.children?.forEach(st => expandedSubteams.delete(st.id));
          }
        });
        setExpandedSubteams(new Set());
      } else {
        next.add(deptId);
      }
      return next;
    });
  };

  const toggleSubteam = (subteamId: string) => {
    setExpandedSubteams(prev => {
      const next = new Set(prev);
      if (next.has(subteamId)) next.delete(subteamId); else next.add(subteamId);
      return next;
    });
  };

  if (orgTree.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-2xl font-bold mb-2">No Agents</div>
        <div className="text-muted">Add agents to see the organizational structure.</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={cn("text-lg font-semibold", classes.heading)}>Organization</h2>
          <p className="text-sm text-muted">Department → Subteam → Agent hierarchy</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Crown className="w-4 h-4 text-yellow-500" />
          <span>Bruk (Human Leader)</span>
        </div>
      </div>

      {/* Top-level: Bruk */}
      <div className="flex flex-col items-center mb-6">
        <div className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-yellow-500 shadow-lg",
          isDark ? "bg-gray-800/90" : "bg-white"
        )}>
          <Crown className="w-7 h-7 text-yellow-500" />
          <div>
            <div className={cn("font-bold text-base", isDark ? "text-white" : "text-gray-900")}>Bruk</div>
            <div className={cn("text-[10px] uppercase tracking-wider", isDark ? "text-gray-400" : "text-gray-500")}>Human Leader</div>
          </div>
        </div>
        <div className={cn("w-px h-6 mt-1", isDark ? "bg-gray-600" : "bg-gray-300")} />
      </div>

      {/* Departments */}
      <div className="space-y-4">
        {orgTree.map((dept) => {
          const isDeptExpanded = expandedDepts.has(dept.id);
          const deptTotalActive = dept.children!.reduce((sum, st) => sum + st.activeCount, 0);
          const deptTotalDone = dept.children!.reduce((sum, st) => sum + st.doneCount, 0);
          
          return (
            <div key={dept.id} className="rounded-xl overflow-hidden border" className={isDark ? "border-gray-700" : "border-gray-200"}>
              {/* Department Header */}
              <button
                onClick={() => toggleDept(dept.id)}
                className={cn(
                  "w-full flex items-center justify-between px-5 py-4 transition-all",
                  isDark ? "bg-gray-800/60 hover:bg-gray-800" : "bg-gray-50 hover:bg-white",
                  dept.borderColor
                )}
              >
                <div className="flex items-center gap-3">
                  {isDeptExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  <div className={cn("w-3 h-3 rounded-full", dept.color)} />
                  <div className="flex flex-col items-start">
                    <span className={cn("font-bold text-base", dept.textColor)}>{dept.name}</span>
                    <span className="text-xs text-muted">{DEPARTMENT_HIERARCHY[dept.name]?.description || dept.name} • {dept.agentCount} agents • {deptTotalActive} active • {deptTotalDone} done</span>
                  </div>
                </div>
              </button>

              {isDeptExpanded && (
                <div className={cn("p-4 space-y-3", isDark ? "bg-gray-900/30" : "bg-white")}>
                  {dept.children!.map((subteam) => {
                    const isSubteamExpanded = expandedSubteams.has(subteam.id);
                    return (
                      <div key={subteam.id} className="rounded-lg border overflow-hidden" className={isDark ? "border-gray-700" : "border-gray-200"}>
                        {/* Subteam Header */}
                        <button
                          onClick={() => toggleSubteam(subteam.id)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 transition-all",
                            isDark ? "bg-gray-800/40 hover:bg-gray-800/60" : "bg-gray-100 hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {isSubteamExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className={cn("font-semibold text-sm", isDark ? "text-gray-200" : "text-gray-800")}>{subteam.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              {subteam.agentCount} agents
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted">
                            <span className="text-emerald-500 font-medium">{subteam.doneCount} done</span>
                            <span className="text-amber-500">{subteam.activeCount} active</span>
                          </div>
                        </button>

                        {isSubteamExpanded && (
                          <div className="p-3 space-y-2">
                            {subteam.agents.map((agent) => {
                              const stats = getAgentStats(agent.name);
                              const lastActivity = agent.lastActivityAt ? new Date(agent.lastActivityAt) : null;
                              const statusInfo = getAgentStatusInfo(lastActivity);
                              const pinged = pingedAgents.has(agent.id || agent.name);

                              return (
                                <div
                                  key={agent.name}
                                  onClick={() => onAgentClick(agent)}
                                  className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.01]",
                                    isDark ? "bg-gray-800/40 hover:bg-gray-800" : "bg-white hover:bg-gray-50 shadow-sm"
                                  )}
                                >
                                  <div className="relative flex-shrink-0">
                                    <img src={getAvatar(agent.name)} alt={agent.name} className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600" />
                                    <div className={cn(
                                      "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                      isDark ? "border-gray-800" : "border-white",
                                      statusInfo.color
                                    )}>
                                      {statusInfo.icon}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={cn("font-semibold text-sm", isDark ? "text-white" : "text-gray-900")}>{agent.name}</div>
                                    <div className={cn("text-xs truncate max-w-[200px]", isDark ? "text-gray-400" : "text-gray-500")}>{agent.role || 'Agent'}</div>
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    {stats.done > 0 && (
                                      <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-emerald-500">{stats.done}</span>
                                        <span className="text-[9px] text-muted uppercase">Done</span>
                                      </div>
                                    )}
                                    {stats.active > 0 && (
                                      <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-amber-500">{stats.active}</span>
                                        <span className="text-[9px] text-muted uppercase">Active</span>
                                      </div>
                                    )}
                                    <div className="flex gap-1">
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
                                        <Play className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={(e) => handlePing(agent, e)}
                                        className={cn(
                                          "p-1.5 rounded-md transition-all",
                                          pinged
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : isDark
                                              ? "hover:bg-violet-600/20 text-gray-500 hover:text-violet-400"
                                              : "hover:bg-violet-50 text-gray-400 hover:text-violet-600"
                                        )}
                                      >
                                        {pinged ? <Zap className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unmapped agents section */}
      {(() => {
        const mappedAgentNames = new Set(Object.keys(AGENT_MAPPING));
        const unmapped = agents.filter(a => !mappedAgentNames.has(a.name) && a.name !== 'Bruk' && a.name !== 'Aroma');
        if (unmapped.length === 0) return null;
        return (
          <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
            <div className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Unmapped Agents</div>
            <div className="flex flex-wrap gap-2">
              {unmapped.map(agent => (
                <span key={agent.name} className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {agent.name}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted mt-2">Add these agents to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">AGENT_MAPPING</code> in OrganizationView.tsx to include them.</p>
          </div>
        );
      })()}

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