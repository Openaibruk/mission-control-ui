#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key) env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

async function sweepBoard() {
  const now = new Date();
  const moved = {};

  // 1. in_progress > 4 hours (based on created_at) → reset to todo
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString();
  const { data: staleInProgress, error: err1 } = await supabase
    .from('tasks')
    .select('id')
    .eq('status', 'in_progress')
    .lt('created_at', fourHoursAgo);
  if (err1) throw err1;
  if (staleInProgress && staleInProgress.length) {
    const ids = staleInProgress.map(t => t.id);
    await supabase.from('tasks').update({ status: 'todo' }).in('id', ids);
    moved['in_progress→todo'] = ids.length;
    console.log(`Reset ${ids.length} in_progress → todo`);
  }

  // 2. assigned > 24 hours → reset to inbox
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const { data: staleAssigned, error: err2 } = await supabase
    .from('tasks')
    .select('id')
    .eq('status', 'assigned')
    .lt('created_at', dayAgo);
  if (err2) throw err2;
  if (staleAssigned && staleAssigned.length) {
    const ids = staleAssigned.map(t => t.id);
    await supabase.from('tasks').update({ status: 'inbox' }).in('id', ids);
    moved['assigned→inbox'] = ids.length;
    console.log(`Reset ${ids.length} assigned → inbox`);
  }

  // 3. review > 48 hours → move to in_progress (also log activity)
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
  const { data: staleReview, error: err3 } = await supabase
    .from('tasks')
    .select('id')
    .eq('status', 'review')
    .lt('created_at', twoDaysAgo);
  if (err3) throw err3;
  if (staleReview && staleReview.length) {
    const ids = staleReview.map(t => t.id);
    await supabase.from('tasks').update({ status: 'in_progress' }).in('id', ids);
    // Log activity
    await supabase.from('activities').insert(
      ids.map(id => ({ agent_name: 'System', action: `Auto-unstuck: review→in_progress` }))
    );
    moved['review→in_progress'] = ids.length;
    console.log(`Reset ${ids.length} review → in_progress`);
  }

  return moved;
}

sweepBoard()
  .then(moved => {
    const total = Object.values(moved).reduce((a, b) => a + b, 0);
    console.log('\n=== Board Sweep Complete ===');
    console.log(`Total tasks moved: ${total}`);
    console.log('Breakdown:', moved);
    process.exit(0);
  })
  .catch(err => {
    console.error('Sweep failed:', err);
    process.exit(1);
  });
