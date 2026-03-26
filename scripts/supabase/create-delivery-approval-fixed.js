const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: project } = await supabase.from('projects')
    .select('id')
    .eq('name', 'ChipChip Delivery Fee Rollout')
    .single();

  const { error: tError } = await supabase.from('tasks').insert([{
    title: 'Approve Strategic Mission Board (A/B/C)',
    description: 'Review the attached Markdown proposal and click Approve to grant the execution token for Option A (Sprint). \n\n[output]: chipchip/delivery-fee-rollout-proposal.md',
    status: 'approval_needed',
    project_id: project.id,
    assignees: ['@Nova']
  }]);

  if (tError) console.error('Error creating task:', tError);
  else console.log('Created approval_needed task.');
}
run();
