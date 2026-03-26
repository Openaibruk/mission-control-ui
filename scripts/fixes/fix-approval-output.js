const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: task } = await supabase.from('tasks')
    .select('id')
    .eq('title', 'Approve Strategic Mission Board (A/B/C)')
    .single();

  if (task) {
    const { error } = await supabase.from('tasks')
      .update({ output_url: 'chipchip/delivery-fee-rollout-proposal.md' })
      .eq('id', task.id);
    if (error) console.error(error);
    else console.log('Successfully updated output_url on approval task.');
  }
}
run();
