import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase
  .from('feedback')
  .select('*')
  .in('status', ['submitted', 'acknowledged', 'in_progress'])
  .order('created_at', { ascending: true });

if (error) {
  console.error('ERROR:', error.message);
  process.exit(1);
}

if (!data || data.length === 0) {
  console.log('NO_REPLY');
} else {
  console.log(JSON.stringify(data, null, 2));
}
