require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/mission-control-ui/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createProjectAndTasks() {
  // Check what columns exist on projects
  const { data: cols } = await supabase.from('projects').select('*').limit(1);
  if (cols && cols[0]) console.log('Project columns:', Object.keys(cols[0]).join(', '));

  // Create project without assumed columns
  const { data: project, error: pErr } = await supabase.from('projects').insert({
    name: 'Mission Control Dashboard V3',
    description: 'Full audit, fix broken/hardcoded features, optimize all pages, add live AI model settings, manual agent triggers, and surprise features.',
    status: 'active'
  }).select().single();

  if (pErr) { console.error('Project error:', pErr); return; }
  console.log('✅ Project created:', project.id);

  const tasks = [
    {
      title: '1. Full Dashboard Audit — Find All Broken/Hardcoded Code',
      description: 'Audit every page and component. Identify: broken imports, hardcoded data that should be live, non-functional buttons, dead API routes, console errors, hydration mismatches.',
      status: 'in_progress',
      priority: 'high',
      assignees: ['@Nova', '@Cinder'],
      project_id: project.id
    },
    {
      title: '2. Fix AI Model Changing Settings (Live)',
      description: 'Make the Settings page model selector actually functional — read current model from OpenClaw gateway, allow switching models, persist changes, show confirmation.',
      status: 'inbox',
      priority: 'high',
      assignees: ['@Henok', '@Nova'],
      project_id: project.id
    },
    {
      title: '3. Fix Manual Agent Trigger Method',
      description: 'Build a working agent trigger UI — ability to select an agent, give it a task, and spawn it from the dashboard. Currently not available or broken.',
      status: 'inbox',
      priority: 'high',
      assignees: ['@Henok', '@Nova'],
      project_id: project.id
    },
    {
      title: '4. Optimize All Pages — Performance & Polish',
      description: 'Fix loading states, add error boundaries, remove unused imports, fix ESLint errors (31 errors blocking auto-deploy), improve responsiveness.',
      status: 'inbox',
      priority: 'medium',
      assignees: ['@Henok', '@Cinder'],
      project_id: project.id
    },
    {
      title: '5. Fix Vercel GitHub Auto-Deploy Pipeline',
      description: 'GitHub pushes are failing on Vercel due to ESLint strictness (useTheme.ts set-state-in-effect, onboarding.ts no-explicit-any). Fix all lint errors so auto-deploy works again.',
      status: 'inbox',
      priority: 'high',
      assignees: ['@Henok'],
      project_id: project.id
    },
    {
      title: '6. Surprise Feature — Live Analytics Dashboard View',
      description: 'New Analytics view powered by DataHub MCP: live ops overview, product sales chart, customer segmentation, super leader leaderboard. Real data, not hardcoded.',
      status: 'inbox',
      priority: 'medium',
      assignees: ['@Henok', '@Orion', '@Lyra'],
      project_id: project.id
    },
    {
      title: '7. Surprise Feature — Live Agent Status & Quick Actions',
      description: 'Real-time agent status cards showing what each agent is doing, with quick action buttons (assign task, view history, trigger run). Connected to Supabase real-time.',
      status: 'inbox',
      priority: 'medium',
      assignees: ['@Henok', '@Nova'],
      project_id: project.id
    }
  ];

  const { data: taskData, error: tErr } = await supabase.from('tasks').insert(tasks).select();
  if (tErr) { console.error('Tasks error:', tErr); return; }
  console.log('✅ Created', taskData.length, 'tasks');
  taskData.forEach(t => console.log('  → ' + t.title + ' [' + t.status + ']'));
}

createProjectAndTasks();
