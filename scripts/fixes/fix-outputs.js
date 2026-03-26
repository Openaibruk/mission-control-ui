const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: tasks } = await supabase.from('tasks').select('*').not('description', 'is', null);
  for (const t of tasks) {
    if (t.description && t.description.includes('[output]:')) {
      const match = t.description.match(/\[output\]:\s*(\S+)/);
      if (match) {
        const outputUrl = match[1].split(',')[0].trim();
        if (!t.output_url) {
          console.log(`Updating task ${t.title} with output_url = ${outputUrl}`);
          await supabase.from('tasks').update({ output_url: outputUrl }).eq('id', t.id);
        }
      }
    }
  }
}
run();
