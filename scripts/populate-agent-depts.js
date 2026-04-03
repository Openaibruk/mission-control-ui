#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key) env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
}

// Service role key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUxNzQwMSwiZXhwIjoyMDg5MDkzNDAxfQ.dPRxmxztKgGvOmiPz2T7blDQx6F7_OSOEs649jABYos';
const supabase = createClient(env.SUPABASE_URL, serviceRoleKey);

// Mapping from AgentGrid.tsx
const AGENT_DEPT_OVERRIDE = {
  Nova: { department: 'Orchestration', subTeam: 'Coordination' },
  Henok: { department: 'Engineering', subTeam: 'Build' },
  Forge: { department: 'Engineering', subTeam: 'Build' },
  Kiro: { department: 'Engineering', subTeam: 'Architecture' },
  Cipher: { department: 'Engineering', subTeam: 'Integration' },
  Loki: { department: 'Engineering', subTeam: 'Infrastructure' },
  Cinder: { department: 'Quality & Safety', subTeam: 'QA' },
  Yonas: { department: 'Quality & Safety', subTeam: 'QA' },
  Onyx: { department: 'Quality & Safety', subTeam: 'Security' },
  Amen: { department: 'Analytics & Insights', subTeam: 'Data Science' },
  Orion: { department: 'Analytics & Insights', subTeam: 'Operations Analytics' },
  Lyra: { department: 'Analytics & Insights', subTeam: 'Business Intelligence' },
  Nahom: { department: 'Marketing & Content', subTeam: 'Strategy' },
  Bini: { department: 'Marketing & Content', subTeam: 'Content' },
  Lidya: { department: 'Marketing & Content', subTeam: 'Design' },
  Autoscientist: { department: 'Research', subTeam: 'Deep Research' },
  Aria: { department: 'Unassigned', subTeam: 'Unassigned' },
  Aroma: { department: 'Unassigned', subTeam: 'Unassigned' },
  Vision: { department: 'Inactive', subTeam: 'Inactive' },
  Pulse: { department: 'Unassigned', subTeam: 'Unassigned' },
};

async function populateAgents() {
  // Fetch all agents
  const { data: agents, error: fetchErr } = await supabase.from('agents').select('id, name');
  if (fetchErr) throw fetchErr;

  let updated = 0;
  for (const agent of agents) {
    const mapping = AGENT_DEPT_OVERRIDE[agent.name];
    if (mapping) {
      const { error: updateErr } = await supabase
        .from('agents')
        .update({ department: mapping.department, subteam: mapping.subTeam })
        .eq('id', agent.id);
      if (updateErr) {
        console.error(`Failed to update ${agent.name}:`, updateErr.message);
      } else {
        updated++;
        console.log(`Updated ${agent.name} → ${mapping.department} / ${mapping.subTeam}`);
      }
    } else {
      // Set unassigned if not in mapping
      const { error: updateErr } = await supabase
        .from('agents')
        .update({ department: 'Unassigned', subteam: 'Unassigned' })
        .eq('id', agent.id);
      if (!updateErr) {
        updated++;
        console.log(`Set ${agent.name} → Unassigned`);
      }
    }
  }

  console.log(`\n✅ Finished. Updated ${updated}/${agents.length} agents.`);
}

populateAgents().catch(err => {
  console.error('Population failed:', err);
  process.exit(1);
});
