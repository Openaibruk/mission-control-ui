const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: project, error: pError } = await supabase.from('projects').insert([{
    name: 'ChipChip Delivery Fee Rollout',
    description: 'Implement new 3 Birr home delivery fee while promoting free Super Leader pickup. Coordinate messaging across all channels.',
    status: 'in_progress',
    department: 'Marketing',
    total_tasks: 1,
    done_tasks: 0
  }]).select().single();

  if (pError) return console.error('Error creating project:', pError);
  console.log('Created Project:', project.name);

  const { error: tError } = await supabase.from('tasks').insert([{
    title: 'Approve Strategic Mission Board (A/B/C)',
    description: 'Review the attached Markdown proposal and click Approve to grant the execution token for Option A (Sprint). \n\n[output]: chipchip/delivery-fee-rollout-proposal.md',
    status: 'approval_needed',
    project_id: project.id,
    output_url: 'chipchip/delivery-fee-rollout-proposal.md',
    assignees: ['@Nova']
  }]);

  if (tError) console.error('Error creating task:', tError);
  else console.log('Created approval_needed task.');
}
run();
