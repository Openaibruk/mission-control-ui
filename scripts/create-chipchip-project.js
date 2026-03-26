import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vgrdeznxllkdolvrhlnm.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  // Pick the most recent ChipChip project (last from list)
  const { data: projects } = await supabase.from('projects')
    .select('id, created_at')
    .eq('name', 'ChipChip Platform Core')
    .order('created_at', { ascending: false })
    .limit(1);
  if (!projects || projects.length === 0) {
    console.error('No ChipChip project found');
    process.exit(1);
  }
  const projectId = projects[0].id;
  console.log('Using project ID:', projectId);

  const tasks = [
    { title: 'Driver Onboarding SOP finalization', description: 'Finalize the driver onboarding standard operating procedure, including document collection, training modules, and approval workflow.', priority: 'high', status: 'inbox', assignees: ['@Nova'] },
    { title: 'Sourcing Strategy 2025 implementation', description: 'Implement the 2025 sourcing strategy: supplier outreach, negotiation templates, and onboarding checklist.', priority: 'high', status: 'inbox', assignees: ['@Nahom'] },
    { title: 'Delivery Fee rollout (3 Birr) integration', description: 'Update frontend, backend, and pricing engine to add 3 Birr home delivery fee with free pickup option for Super Leaders.', priority: 'high', status: 'inbox', assignees: ['@Henok'] },
    { title: 'DataHub Analytics: CP1/CP2 margin metrics', description: 'Add gross margin (CP1) and net margin (CP2) calculations to the DataHub MCP server and Mission Control analytics view.', priority: 'high', status: 'inbox', assignees: ['@Orion', '@Lyra'] },
    { title: 'Paperclip agent pairing with gateway', description: 'Re-pair the ChipChip company agents (12) to the OpenClaw gateway so they can receive tasks.', priority: 'medium', status: 'inbox', assignees: ['@Henok'] },
    { title: 'Unified Architecture Proposal review', description: 'Review the unified architecture proposal and produce ADRs for the chosen approach.', priority: 'medium', status: 'inbox', assignees: ['@Kiro'] },
    { title: 'Marketing Strategy Playbook activation', description: 'Turn the marketing playbook into actionable campaigns and social media calendar.', priority: 'medium', status: 'inbox', assignees: ['@Bini'] },
    { title: 'Customer Retention strategy implementation', description: 'Implement the customer retention guide: loyalty program, win-back flows, and NPS tracking.', priority: 'medium', status: 'inbox', assignees: ['@Nova'] },
    { title: 'Operations: Emergency Response SOP', description: 'Finalize and train the team on the emergency response SOP for delivery incidents.', priority: 'low', status: 'inbox', assignees: ['@Cinder'] },
    { title: 'Graph view refresh for workspace', description: 'Update the knowledge graph view to include latest docs and agents, ensure performance.', priority: 'low', status: 'inbox', assignees: ['@Loki'] }
  ];

  for (const t of tasks) {
    await supabase.from('tasks').insert({ ...t, project_id: projectId });
  }
  console.log('Inserted', tasks.length, 'tasks into project', projectId);
  process.exit(0);
})();
