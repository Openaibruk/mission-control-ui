import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY required in .env');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase.from('tasks').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching task:', error.message);
    return;
  }
  console.log('Task columns:', Object.keys(data).join('\n'));
}
inspect().catch(console.error);
