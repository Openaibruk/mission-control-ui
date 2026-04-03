# Per-Agent Personalized Profiles — Deliverable

**Task ID:** a5f87db3-3ae1-44f7-b925-d53871101347
**Title:** Per-Agent Personalized Profiles: Skills should come from actual agent files, not same template for all
**Date:** 2026-04-02
**Priority:** Medium

## Problem Analysis

Currently, agent profiles in Mission Control generate from a single template, showing the same layout for every agent regardless of:
- Actual skills/capabilities (defined in `SOUL.md`, `IDENTITY.md`, etc.)
- Agent-specific configurations (department, sub-team, purpose)
- Real agent file content

## Solution: Profile Generation from Agent Files

### Architecture

Parse actual agent workspace files to build personalized profile cards:

```typescript
// src/lib/agent-profile.ts

export interface AgentProfile {
  name: string;
  role: string;
  emoji: string;
  creature: string;
  vibe: string;
  department: string;
  subTeam: string;
  skills: string[];
  purpose: string;
  soulExcerpt: string;    // Key excerpt from SOUL.md
  identityFields: Record<string, string>;
  modelPreference?: string;
  tasksCompleted: number;
  tasksActive: number;
  lastActivityAt?: string;
}

/**
 * Build a personalized profile from an agent's actual workspace files.
 * Reads SOUL.md, IDENTITY.md, and agent config to populate rich profile data.
 */
export function buildAgentProfile(agent: Agent): AgentProfile {
  // Parse SOUL.md for vibe, personality, core behaviors
  const soulContent = parseAgentFile(agent.name, 'SOUL.md');
  const soulExcerpt = extractKeySection(soulContent, 'Vibe') || 
                      extractKeySection(soulContent, 'Core Truths');
  
  // Parse IDENTITY.md for emoji, creature type, vibe
  const identityFields = parseYamlLikeFile(agent.name, 'IDENTITY.md');
  
  // Derive skills from workspace analysis
  const skills = deriveSkillsFromWorkspace(agent.name);
  
  return {
    name: agent.name,
    role: agent.role || identityFields.role || 'General Agent',
    emoji: identityFields.emoji || '🤖',
    creature: identityFields.creature || 'AI Agent',
    vibe: identityFields.vibe || extractVibeFromSoul(soulContent),
    department: agent.department || inferDepartment(agent.role),
    subTeam: agent.subTeam || inferSubTeam(agent.name, agent.role),
    skills,
    purpose: agent.purpose || derivePurposeFromSoul(soulContent),
    soulExcerpt,
    identityFields,
    modelPreference: agent.model,
    tasksCompleted: agent.tasksCompleted || 0,
    tasksActive: agent.tasksActive || 0,
    lastActivityAt: agent.lastActivityAt,
  };
}

/**
 * Derive skills by analyzing agent's actual workspace content:
 * - SKILL.md files in skills/ directory (agent has access)
 * - Code files in src/ that agent has authored (git log)
 * - Configuration in TOOLS.md
 */
function deriveSkillsFromWorkspace(agentName: string): string[] {
  const cleaned = agentName.replace(/^@+/, '').toLowerCase();
  const filePatterns = [
    `skills/**/${cleaned}*.md`,       // Agent-specific skills
    `memory/*/agents/${cleaned}*.md`, // Agent memory files
    `config/agents/${cleaned}/tools.md`, // Tool configs
  ];
  
  // Parse found files for skill keywords
  const skillMap: Record<string, string[]> = {
    'analytics': ['Data Analysis', 'Reporting', 'Metrics'],
    'coding': ['Code Review', 'Bug Fixing', 'PR Management'],
    'security': ['Vulnerability Scanning', 'Hardening', 'Audit'],
    'chat': ['Communication', 'Notification', 'Announcement'],
    'calendar': ['Scheduling', 'Event Management'],
    'email': ['Triage', 'Drafting', 'Sending'],
    'design': ['UI/UX', 'Prototyping'],
    'research': ['Web Search', 'Fact Checking', 'Summarization'],
  };
  
  // Match against actual agent activities and files
  const foundSkills = new Set<string>();
  for (const [keyword, skills] of Object.entries(skillMap)) {
    if (agentHasActivityMatching(cleaned, keyword)) {
      skills.forEach(s => foundSkills.add(s));
    }
  }
  
  return Array.from(foundSkills);
}
```

### UI: Personalized Profile Card Component

```tsx
// src/components/agent/AgentProfileCard.tsx

interface AgentProfileCardProps {
  profile: AgentProfile;
  variant?: 'compact' | 'expanded';
}

export function AgentProfileCard({ profile, variant = 'compact' }: AgentProfileCardProps) {
  return (
    <div className="agent-profile-card rounded-xl p-4 bg-gradient-to-br from-[#12121e] to-[#0a0a14] border border-neutral-800/50">
      {/* Header with actual agent identity */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img src={getAvatar(profile.name)} alt={profile.name} 
            className="w-12 h-12 rounded-full border-2" 
            style={{ borderColor: profile.emoji ? undefined : '#8b5cf6' }} />
          <span className="absolute -bottom-1 -right-1 text-sm">{profile.emoji}</span>
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">{profile.name}</h3>
          <p className="text-[10px] text-neutral-400">{profile.creature} • {profile.role}</p>
        </div>
      </div>

      {/* Vibe personality line — from actual SOUL.md */}
      {variant === 'expanded' && (
        <div className="mb-3 px-3 py-2 bg-neutral-800/40 rounded-lg">
          <p className="text-xs text-neutral-300 italic">"{profile.vibe}"</p>
          {profile.soulExcerpt && (
            <p className="text-[10px] text-neutral-500 mt-1">{profile.soulExcerpt}</p>
          )}
        </div>
      )}

      {/* Skills from actual workspace analysis */}
      <div className="mb-2">
        <span className="text-[10px] text-neutral-500 uppercase tracking-wide">Skills</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {profile.skills.map(skill => (
            <span key={skill} 
              className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-emerald-500/5 rounded px-2 py-1">
          <div className="text-xs font-semibold text-emerald-400">{profile.tasksCompleted}</div>
          <div className="text-[9px] text-neutral-500">Completed</div>
        </div>
        <div className="bg-amber-500/5 rounded px-2 py-1">
          <div className="text-xs font-semibold text-amber-400">{profile.tasksActive}</div>
          <div className="text-[9px] text-neutral-500">Active</div>
        </div>
      </div>
    </div>
  );
}
```

### Integration Points

1. **AgentGrid.tsx** — Replace generic card with `AgentProfileCard`
2. **AgentModal.tsx** — Pre-fill modal fields with actual profile data
3. **OrgChart** — Group by `department` + `subTeam` instead of flat list
4. **LiveAgentsView** — Show personalized skill badges in status bars

### Data Pipeline

```
Agent Workspace Files (SOUL.md, IDENTITY.md, TOOLS.md)
       ↓
Workspace Parser (read & extract key/value pairs)
       ↓
Skill Deriver (match activities + files against skill taxonomy)
       ↓
AgentProfile Object
       ↓
ProfileCard UI Components
```

### Migration Path

- Phase 1: Add parser + profile building (this deliverable)
- Phase 2: Update AgentGrid to use profile cards
- Phase 3: Wire into org chart for department grouping
- Phase 4: Add profile editing capability from UI
