const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function run() {
  const { data: tasks } = await supabase.from('tasks').select('id').ilike('title', 'Zarely:%');
  for (const t of tasks) {
    await supabase.from('tasks').update({ status: 'done' }).eq('id', t.id);
  }
}
run();
