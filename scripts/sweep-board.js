const fetch = require('node-fetch');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function sweep() {
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  };

  const now = new Date();
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

  let moved = 0;

  // 1. in_progress > 4h → todo
  let { data: inProgress } = await fetch(`${SUPABASE_URL}/rest/v1/tasks?status=eq.in_progress&updated_at=lt.${fourHoursAgo}&select=id,title`, { headers }).then(r => r.json());
  if (inProgress && inProgress.length > 0) {
    let ids = inProgress.map(t => t.id);
    await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=in.(${ids.join(',')})`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'todo' })
    });
    moved += ids.length;
    console.log(`Reset in_progress → todo: ${ids.length} tasks`);
  }

  // 2. assigned > 24h → inbox
  let { data: assigned } = await fetch(`${SUPABASE_URL}/rest/v1/tasks?status=eq.assigned&updated_at=lt.${twentyFourHoursAgo}&select=id,title`, { headers }).then(r => r.json());
  if (assigned && assigned.length > 0) {
    let ids = assigned.map(t => t.id);
    await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=in.(${ids.join(',')})`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'inbox' })
    });
    moved += ids.length;
    console.log(`Reset assigned → inbox: ${assigned.length} tasks`);
  }

  // 3. review > 48h → in_progress
  let { data: review } = await fetch(`${SUPABASE_URL}/rest/v1/tasks?status=eq.review&updated_at=lt.${fortyEightHoursAgo}&select=id,title`, { headers }).then(r => r.json());
  if (review && review.length > 0) {
    let ids = review.map(t => t.id);
    await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=in.(${ids.join(',')})`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'in_progress' })
    });
    moved += ids.length;
    console.log(`Reset review → in_progress: ${review.length} tasks`);
  }

  console.log(`📊 Total tasks moved: ${moved}`);
}

sweep().catch(console.error);
