'use client';

import { Agent } from '@/lib/types';
import { cn, getAvatar } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { ChevronRight, Crown, Users, User, Bot } from 'lucide-react';

interface WorkflowViewProps {
  theme: 'dark' | 'light';
  agents?: Agent[];
}

const departments = [
  {
    name: 'Development',
    color: 'bg-blue-600',
    agents: ['Henok', 'Cinder', 'Kiro', 'Onyx'],
    role: 'Build & Ship'
  },
  {
    name: 'Marketing',
    color: 'bg-pink-600',
    agents: ['Nahom', 'Bini', 'Lidya', 'Amen'],
    role: 'Grow & Create'
  },
  {
    name: 'Strategy',
    color: 'bg-violet-600',
    agents: ['Vision', 'Cipher', 'Loki'],
    role: 'Plan & Connect'
  },
  {
    name: 'Operations',
    color: 'bg-emerald-600',
    agents: ['Nova'],
    role: 'Orchestrate & Coordinate'
  }
];

export function WorkflowView({ theme, agents = [] }: WorkflowViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const getAgentByName = (name: string) => agents.find(a => a.name.toLowerCase() === name.toLowerCase());

  const getTaskCount = (agentName: string) => {
    // This would come from props in real implementation
    return 0;
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Organization Chart</h2>
        <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
          ChipChip AI Team Structure: Bruk → Nova → Departments → Agents
        </p>
      </div>

      {/* Root: Bruk */}
      <div className="flex flex-col items-center mb-8">
        <div className={cn(
          "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-violet-500 bg-violet-500/10",
          isDark ? "bg-gray-800" : "bg-white"
        )}>
          <Crown className="w-8 h-8 text-violet-500" />
          <div>
            <div className={cn("font-bold text-lg", isDark ? "text-white" : "text-gray-900")}>Bruk</div>
            <div className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>Human Leader</div>
          </div>
        </div>
        <ChevronRight className={cn("w-6 h-6 mt-2 rotate-90", isDark ? "text-gray-500" : "text-gray-400")} />
        
        {/* Level 1: Nova */}
        <div className={cn(
          "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-blue-500 bg-blue-500/10 mt-2",
          isDark ? "bg-gray-800" : "bg-white"
        )}>
          <div className="relative">
            <img src={getAvatar('Nova')} alt="Nova" className="w-12 h-12 rounded-full border-2 border-blue-500" />
            <Bot className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500 bg-white rounded-full" />
          </div>
          <div>
            <div className={cn("font-bold text-lg", isDark ? "text-white" : "text-gray-900")}>Nova</div>
            <div className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>Lead AI Assistant</div>
          </div>
        </div>
        <ChevronRight className={cn("w-6 h-6 mt-2 rotate-90", isDark ? "text-gray-500" : "text-gray-400")} />
        
        {/* Level 2: Departments */}
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {departments.map((dept) => (
            <div key={dept.name} className="flex flex-col items-center">
              <div className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border",
                isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              )}>
                <Users className={`w-5 h-5 ${dept.color.replace('bg-', 'text-')}`} />
                <span className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{dept.name}</span>
              </div>
              <ChevronRight className={cn("w-5 h-5 mt-1 rotate-90", isDark ? "text-gray-600" : "text-gray-400")} />
              
              {/* Level 3: Agents */}
              <div className="flex flex-wrap justify-center gap-2 mt-1 max-w-xs">
                {dept.agents.map((agentName) => {
                  const agent = getAgentByName(agentName);
                  return (
                    <div
                      key={agentName}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      )}
                    >
                      <img
                        src={getAvatar(agentName)}
                        alt={agentName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className={isDark ? "text-white" : "text-gray-900"}>{agentName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={cn(
        "mt-8 p-4 rounded-xl",
        isDark ? "bg-gray-800" : "bg-gray-50"
      )}>
        <h3 className={cn("font-semibold mb-3", isDark ? "text-white" : "text-gray-900")}>Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-violet-500" />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>Human</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-500" />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>AI Agent</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-500" />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>Department</span>
          </div>
        </div>
      </div>

      {/* Department Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className={cn(
              "p-4 rounded-xl border",
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("w-3 h-3 rounded-full", dept.color)} />
              <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{dept.name}</h3>
            </div>
            <p className={cn("text-sm mb-3", isDark ? "text-gray-400" : "text-gray-600")}>{dept.role}</p>
            <div className="flex flex-wrap gap-2">
              {dept.agents.map((agentName) => (
                <span
                  key={agentName}
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                  )}
                >
                  {agentName}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
