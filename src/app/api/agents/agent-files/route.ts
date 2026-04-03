import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

export const dynamic = 'force-dynamic';

// Resolve agent workspace root — each agent lives in its own directory
// under ~/.openclaw/agents/<name>/ or ~/.openclaw/workspace/agents/<name>/
function resolveAgentDir(agentName: string): string | null {
  const candidates = [
    join(process.env.HOME || '/home/ubuntu', '.openclaw', 'agents', agentName),
    join(process.cwd(), 'agents', agentName),
    join(process.env.HOME || '/home/ubuntu', '.openclaw', 'workspace', 'agents', agentName),
    // Fallback for single-agent workspace: the workspace root itself
    process.cwd(),
  ];
  for (const dir of candidates) {
    if (existsSync(dir) && statSync(dir).isDirectory()) return dir;
  }
  return null;
}

function parseMarkdownSection(content: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^##\\s+${escaped}\\s*$([\\s\\S]*?)(?=^##\\s|\\Z)`, 'm');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function extractSkills(content: string): string[] {
  const skills: string[] = [];
  const lines = content.split('\n');
  const toolRegex = /Tool\s+availability|Tools\s+filtered|available_skills/i;
  const skillRegex = /\*\*([^*<>:"\\|?]+)\*\*|•\s+([^*\n]+)|-\s+([^*\n]+)/g;
  
  for (const line of lines) {
    if (toolRegex.test(line) || line.includes('tool')) {
      let m;
      while ((m = skillRegex.exec(line)) !== null) {
        const skill = (m[1] || m[2] || m[3] || '').trim();
        if (skill && skill.length > 1 && !skill.toLowerCase().includes('read') && !skill.toLowerCase().includes('write')) {
          skills.push(skill);
        }
      }
    }
  }
  return [...new Set(skills)].slice(0, 10);
}

function extractPurpose(content: string): string {
  // Look for "You are..." or role description
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^(You are|I am|This agent|Your role|You're)/i)) {
      return trimmed.slice(0, 200);
    }
  }
  // Fallback to first meaningful paragraph
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 20 && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      return trimmed.slice(0, 200);
    }
  }
  return '';
}

function extractDepartment(content: string): string {
  // Look for department/team markers
  const deptPatterns = [
    /(?:department|team|role|function)\s*[:\-\u2013\u2014]\s*(.+)/i,
    /(?:department|team|group):\s*["'](.+?)["']/i,
    /###?\s*(?:Department|Team|Role)\s*\r?\n(.+)/i,
  ];
  for (const pattern of deptPatterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim().slice(0, 50);
  }
  return '';
}

function extractSubTeam(content: string): string {
  const patterns = [
    /(?:sub[- ]?team|crew|squad|unit)\s*[:\-\u2013\u2014]\s*(.+)/i,
    /(?:sub[- ]?team|crew|squad|unit):\s*["'](.+?)["']/i,
  ];
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim().slice(0, 50);
  }
  return '';
}

interface AgentProfile {
  name: string;
  hasSoul: boolean;
  hasAgents: boolean;
  purpose: string;
  skills: string[];
  soulSnippet: string;
  agentConfig: string;
  department: string;
  subteam: string;
}

export async function GET(request: NextRequest) {
  try {
    const agentName = request.nextUrl.searchParams.get('agent');

    if (!agentName) {
      // Return list from ~/.openclaw/agents/ directories + workspace skills
      let agentsList: Array<{ name: string; hasSoul: boolean; hasAgentsMd: boolean; directory: string }> = [];
      
      // Scan ~/.openclaw/agents/ for agent directories
      const openclawAgentsDir = join(process.env.HOME || '/home/ubuntu', '.openclaw', 'agents');
      if (existsSync(openclawAgentsDir)) {
        for (const entry of readdirSync(openclawAgentsDir, { withFileTypes: true })) {
          if (entry.isDirectory() && entry.name !== 'vendor' && entry.name !== 'main') {
            const dir = join(openclawAgentsDir, entry.name);
            agentsList.push({
              name: entry.name,
              hasSoul: existsSync(join(dir, 'SOUL.md')),
              hasAgentsMd: existsSync(join(dir, 'AGENTS.md')),
              directory: dir,
            });
          }
        }
      }
      
      // Also scan workspace agents/ directory
      const workspaceAgentsDir = join(process.cwd(), 'agents');
      if (existsSync(workspaceAgentsDir)) {
        for (const entry of readdirSync(workspaceAgentsDir, { withFileTypes: true })) {
          if (entry.isDirectory() && !agentsList.some(a => a.name === entry.name)) {
            const dir = join(workspaceAgentsDir, entry.name);
            agentsList.push({
              name: entry.name,
              hasSoul: existsSync(join(dir, 'SOUL.md')),
              hasAgentsMd: existsSync(join(dir, 'AGENTS.md')),
              directory: dir,
            });
          }
        }
      }
      
      // Fallback: known agent names from workspace root
      if (agentsList.length === 0) {
        const knownAgents = ['Nova', 'Henok', 'Cinder', 'Kiro', 'Onyx', 'Amen', 'Yonas', 'Nahom', 'Lidya', 'Bini', 'Vision', 'Loki', 'Cipher', 'Forge', 'Autoscientist', 'Aria', 'Aroma', 'Orion', 'Lyra'];
        agentsList = knownAgents.map(name => ({
          name,
          hasSoul: existsSync(join(process.cwd(), 'SOUL.md')),
          hasAgentsMd: existsSync(join(process.cwd(), 'AGENTS.md')),
          directory: process.cwd(),
        }));
      }
      
      return NextResponse.json({ agents: agentsList });
    }

    // Get specific agent profile from their OWN directory
    const agentDir = resolveAgentDir(agentName);
    if (!agentDir) {
      return NextResponse.json({ error: 'Agent directory not found', name: agentName }, { status: 404 });
    }

    const profile: AgentProfile = {
      name: agentName,
      hasSoul: false,
      hasAgents: false,
      purpose: '',
      skills: [],
      soulSnippet: '',
      agentConfig: '',
      department: '',
      subTeam: '',
    };

    // Read SOUL.md from agent's OWN directory
    const soulPath = join(agentDir, 'SOUL.md');
    if (existsSync(soulPath)) {
      const soulContent = readFileSync(soulPath, 'utf-8');
      profile.hasSoul = true;
      profile.soulSnippet = soulContent.split('\n').filter(l => l.trim()).slice(0, 10).join('\n').slice(0, 500);
      profile.purpose = extractPurpose(soulContent);
      profile.skills = extractSkills(soulContent);
      profile.department = extractDepartment(soulContent);
      profile.subteam = extractSubTeam(soulContent);
    } else {
      // Fallback: check workspace root for shared SOUL.md (legacy)
      const sharedSoulPath = join(process.cwd(), 'SOUL.md');
      if (existsSync(sharedSoulPath)) {
        const soulContent = readFileSync(sharedSoulPath, 'utf-8');
        profile.hasSoul = true;
        profile.soulSnippet = soulContent.split('\n').filter(l => l.trim()).slice(0, 5).join('\n').slice(0, 200);
        profile.purpose = '[Using shared workspace SOUL.md — agent should have own]';
      }
    }

    // Read AGENTS.md from agent's OWN directory
    const agentsPath = join(agentDir, 'AGENTS.md');
    if (existsSync(agentsPath)) {
      const agentsContent = readFileSync(agentsPath, 'utf-8');
      profile.hasAgents = true;
      profile.agentConfig = agentsContent.split('\n').filter(l => l.trim()).slice(0, 20).join('\n').slice(0, 1000);
      profile.skills = [...profile.skills, ...extractSkills(agentsContent)];
      profile.skills = [...new Set(profile.skills)].slice(0, 10);
      
      // Extract department/subteam from agent config if not already found
      if (!profile.department) profile.department = extractDepartment(agentsContent);
      if (!profile.subteam) profile.subteam = extractSubTeam(agentsContent);
    } else {
      // Fallback to workspace root
      const sharedAgentsPath = join(process.cwd(), 'AGENTS.md');
      if (existsSync(sharedAgentsPath)) {
        const agentsContent = readFileSync(sharedAgentsPath, 'utf-8');
        profile.hasAgents = true;
        profile.agentConfig = agentsContent.split('\n').filter(l => l.trim()).slice(0, 10).join('\n').slice(0, 500);
      }
    }

    // Check for agent-specific skill files in their directory
    const skillsDir = join(agentDir, 'skills');
    if (existsSync(skillsDir)) {
      try {
        const agentSkills = readdirSync(skillsDir, { withFileTypes: true })
          .filter(d => d.isDirectory())
          .map(d => d.name);
        if (agentSkills.length > 0) {
          profile.skills = [...profile.skills, ...agentSkills].slice(0, 10);
        }
      } catch (err) {
        console.log('Error reading agent skills dir:', err);
      }
    }

    // Also check global workspace skills
    const globalSkillsDir = join(process.cwd(), 'skills');
    if (existsSync(globalSkillsDir)) {
      try {
        const skillDirs = readdirSync(globalSkillsDir, { withFileTypes: true })
          .filter(d => d.isDirectory() && d.name !== 'vendor')
          .map(d => d.name);
        if (skillDirs.length > 0) {
          profile.skills = [...profile.skills, ...skillDirs].slice(0, 10);
        }
      } catch (err) {
        console.log('Error reading workspace skills dir:', err);
      }
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching agent files:', error);
    return NextResponse.json({ error: 'Failed to fetch agent files', details: error instanceof Error ? error.message : 'unknown' }, { status: 500 });
  }
}
