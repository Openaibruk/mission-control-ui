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

async function sweep() {
  const now = new Date();
  const moved = [];

  // 1) in_progress > 4h with no updates → todo
  // Assuming 'updated_at' column exists; if not, use created_at. We'll try updated_at first.
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString();
  const { data: staleInProgress, error: err1 } = await supabase
    .from('tasks')
    .select('id, status, updated_at, created_at')
    .eq('status', 'in_progress')
    .lt('updated_at', fourHoursAgo);
  if (err1) console.error('Error fetching in_progress tasks:', err1.message);

  if (staleInProgress && staleInProgress.length > 0) {
    const ids = staleInProgress.map(t => t.id);
    const { error: upErr } = await supabase
      .from('tasks')
      .update({ status: 'todo' })
      .in('id', ids);
    if (upErr) console.error('Failed to reset in_progress tasks:', upErr.message);
    else moved.push(`Reset ${ids.length} tasks from in_progress → todo (stale >4h)`);
  }

  // 2) assigned > 24h with no updates → inbox
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const { data: oldAssigned, error: err2 } = await supabase
    .from('tasks')
    .select('id, status, updated_at, created_at')
    .eq('status', 'assigned')
    .lt('updated_at', dayAgo);
  if (err2) console.error('Error fetching assigned tasks:', err2.message);

  if (oldAssigned && oldAssigned.length > 0) {
    const ids = oldAssigned.map(t => t.id);
    const { error: upErr } = await supabase
      .from('tasks')
      .update({ status: 'inbox' })
      .in('id', ids);
    if (upErr) console.error('Failed to reset assigned tasks:', upErr.message);
    else moved.push(`Reset ${ids.length} tasks from assigned → inbox (stale >24h)`);
  }

  // 3) review > 48h → in_progress with notification (we'll just move to in_progress)
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
  const { data: oldReview, error: err3 } = await supabase
    .from('tasks')
    .select('id, status, updated_at, created_at')
    .eq('status', 'review')
    .lt('updated_at', twoDaysAgo);
  if (err3) console.error('Error fetching review tasks:', err3.message);

  if (oldReview && oldReview.length > 0) {
    const ids = oldReview.map(t => t.id);
    const { error: upErr } = await supabase
      .from('tasks')
      .update({ status: 'in_progress' })
      .in('id', ids);
    if (upErr) console.error('Failed to move review tasks:', upErr.message);
    else moved.push(`Moved ${ids.length} tasks from review → in_progress (stale >48h)`);
  }

  console.log('\n=== Board Sweep Report ===');
  console.log(moved.length ? moved.join('\n') : 'No stale tasks found.');
  console.log(`Total tasks moved: ${moved.reduce((sum, msg) => sum + parseInt(msg.match(/\d+/)?.[0] || '0'), 0)}`);
}

sweep().catch(console.error);
