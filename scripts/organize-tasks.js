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

// Mapping: title keywords -> { department, subteam }
const assignments = [
  { keywords: ['N+1', 'query', 'aggregation'], dept: 'Bid Supply', subteam: 'Backend' },
  { keywords: ['ARIA', 'accessibility', 'WCAG'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['select accessibility', 'label', 'focus ring'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['LiveTicker', 'marquee', 'pause'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['Empty states', 'icons'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['Loading states', 'skeleton'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['Error handling', 'silent catches'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['ErrorBoundary', 'friendly message'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['Seeds', 'active bidding cycle', 'recent bids'], dept: 'Bid Supply', subteam: 'Backend' },
  { keywords: ['SupplierLeaderboard loading'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['date handling', 'date-only cycles'], dept: 'Bid Supply', subteam: 'Architecture' },
  { keywords: ['Cleanup', 'stray', 'orphaned'], dept: 'Bid Supply', subteam: 'DevOps' },
  { keywords: ['graceful fallback', '4h window'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['hover state', 'consistency'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['Layout background', 'unify bg'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['PriceCharts: default product', 'most-bid'], dept: 'Bid Supply', subteam: 'Frontend' },
  { keywords: ['LanguageContext', 'hydration'], dept: 'Bid Supply', subteam: 'Frontend' },
];

function assign(taskTitle) {
  const match = assignments.find(a => a.keywords.some(k => taskTitle.toLowerCase().includes(k.toLowerCase())));
  if (match) return match;
  // default: Bid Supply, Frontend for UI-related, Backend for data-related seeds, else 'unknown'
  if (taskTitle.toLowerCase().includes('seed') || taskTitle.toLowerCase().includes('cycle')) {
    return { department: 'Bid Supply', subteam: 'Backend' };
  }
  if (taskTitle.toLowerCase().includes('date handling') || taskTitle.toLowerCase().includes('architecture')) {
    return { department: 'Bid Supply', subteam: 'Architecture' };
  }
  if (taskTitle.toLowerCase().includes('cleanup')) {
    return { department: 'Bid Supply', subteam: 'DevOps' };
  }
  return { department: 'Bid Supply', subteam: 'Frontend' };
}

async function organize() {
  // Check if columns exist
  const { data: inspect, error } = await supabase.from('tasks').select('department, subteam').limit(1).single().maybeSingle();
  if (error && !error.message.includes('does not exist')) {
    console.error('Error inspecting table:', error.message);
    process.exit(1);
  }

  // Fetch all tasks with id, title
  const { data: tasks, error: fetchErr } = await supabase.from('tasks').select('id, title');
  if (fetchErr) {
    console.error('Fetch tasks error:', fetchErr.message);
    process.exit(1);
  }

  let updated = 0;
  for (const task of tasks) {
    const { department, subteam } = assign(task.title);
    const { error: updErr } = await supabase
      .from('tasks')
      .update({ department, subteam })
      .eq('id', task.id);
    if (updErr) {
      console.error(`Failed to update ${task.title}:`, updErr.message);
    } else {
      updated++;
    }
  }

  console.log(`Organization complete. Updated ${updated} tasks with department=“Bid Supply” and appropriate subteam.`);
}

organize().catch(console.error);
