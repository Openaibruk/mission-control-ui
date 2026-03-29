require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/apps/mission-control-ui/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function createAuditProject() {
  // Create project
  const { data: project, error: projErr } = await supabase.from('projects').insert({
    name: 'Mission Control Dashboard Audit',
    description: 'Audit each page of the dashboard: Live data vs hard coded, Improvements, Openclaw workspace sync, supabase sync, problems on autonomous working, Agents.',
    status: 'active',
    department: 'Engineering',
    total_tasks: 6,
    done_tasks: 0
  }).select().single();

  if (projErr) {
    console.error('Error creating project:', projErr);
    process.exit(1);
  }

  console.log('Project created:', project.id);

  // Create tasks
  const tasks = [
    {
      title: 'Audit: Live data vs hard coded',
      description: 'Check all dashboard pages and verify whether the data displayed is live from Supabase/Workspace or hardcoded in the frontend components.',
      status: 'inbox',
      project_id: project.id,
      priority: 'high',
      assignees: ['@Nova']
    },
    {
      title: 'Audit: Improvements',
      description: 'Identify UX/UI and functional improvements across the Mission Control dashboard pages.',
      status: 'inbox',
      project_id: project.id,
      priority: 'medium',
      assignees: ['@Nova']
    },
    {
      title: 'Audit: Openclaw workspace sync',
      description: 'Ensure the dashboard is correctly reading from and writing to the Openclaw workspace files where applicable (e.g. skills, config).',
      status: 'inbox',
      project_id: project.id,
      priority: 'high',
      assignees: ['@Nova']
    },
    {
      title: 'Audit: Supabase sync',
      description: 'Check the synchronization between the dashboard UI and Supabase database. Ensure all CRUD operations reflect correctly and instantly.',
      status: 'inbox',
      project_id: project.id,
      priority: 'critical',
      assignees: ['@Nova']
    },
    {
      title: 'Audit: Problems on autonomous working',
      description: 'Investigate and resolve any issues preventing agents from working autonomously based on dashboard configurations or task assignments.',
      status: 'inbox',
      project_id: project.id,
      priority: 'critical',
      assignees: ['@Nova']
    },
    {
      title: 'Audit: Agents',
      description: 'Review the Agents page and modal. Ensure agent status, stats, and configurations are correctly loaded and managed.',
      status: 'inbox',
      project_id: project.id,
      priority: 'medium',
      assignees: ['@Nova']
    }
  ];

  const { error: taskErr } = await supabase.from('tasks').insert(tasks);

  if (taskErr) {
    console.error('Error creating tasks:', taskErr);
    process.exit(1);
  }

  console.log('All tasks created successfully.');
}

createAuditProject();
