const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function finish() {
  const projectId = '1ba5d962-fcb5-4157-8cbd-3b278a063509';
  const { error: pErr } = await supabase.from('projects')
    .update({ status: 'complete', done_tasks: 3 })
    .eq('id', projectId);
  if (pErr) console.error('Project update error:', pErr);
  console.log('Project updated to complete.');
}
finish();