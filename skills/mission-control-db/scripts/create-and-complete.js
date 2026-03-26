require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/mission-control-ui/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addTasks() {
  const tasks = [
    {
      title: 'Create Analytics Team & Build DataHub MCP Skill',
      description: 'Create the Analytics Team department (Orion & Lyra) in AGENTS.md, build the OpenClaw skill to bridge to the Supabase Edge Function, and test all 17 BI endpoints.',
      status: 'done',
      priority: 'high',
      assignees: ['@Nova', '@Orion', '@Lyra']
    },
    {
      title: 'Fix DataHub MCP Endpoint Schemas & Debug ClickHouse',
      description: 'Fix parameter destructuring (dateRange wrapping) and missing queryType arguments across 9 broken MCP tools, then diagnose the underlying ClickHouse connection refused error.',
      status: 'done',
      priority: 'medium',
      assignees: ['@Nova']
    },
    {
      title: 'Fix Ethiopian Calendar Dashboard Bug',
      description: 'Replace broken custom conversion math with official ethiopian-calendar-date-converter package, add missing Megabit month, fix weekday alignment, and deploy UI fix.',
      status: 'done',
      priority: 'high',
      assignees: ['@Nova']
    }
  ];

  const { data, error } = await supabase.from('tasks').insert(tasks).select();
  if (error) {
    console.error('Error adding tasks:', error);
  } else {
    console.log('Successfully added and completed tasks:', data.map(t => t.title).join(', '));
  }
}

addTasks();
