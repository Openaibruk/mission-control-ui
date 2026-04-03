#!/usr/bin/env node
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY required in .env');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

// Find or create a project for bid-supply. For now, we'll try to find by name; if none, skip project_id.
async function findProjectId(name) {
  const { data } = await supabase.from('projects').select('id,name').ilike('name', name).limit(1);
  return data?.[0]?.id || null;
}

const tasks = [
  {
    title: 'SupplierLeaderboard N+1 query refactor',
    description: 'Replace per-supplier queries with single aggregated GROUP BY query. Current implementation fires 1 query per supplier (e.g., 50+ queries). Target: 1 query total.',
    priority: 'critical',
    assignees: ['@Henok'],
  },
  {
    title: 'WCAG color contrast fixes (TodaySummary icons)',
    description: 'Icon colors green-600, amber-600, cyan-600 fail WCAG AA on white. Upgrade to 700 variants or add dark backgrounds. Component: components/TodaySummary.tsx.',
    priority: 'critical',
    assignees: ['@Henok'],
  },
  {
    title: 'Add ARIA labels to interactive elements',
    description: 'Add aria-label to product select, language toggle, LiveTicker marquee, and section headings. Ensure screen reader accessibility.',
    priority: 'critical',
    assignees: ['@Henok'],
  },
  {
    title: 'PriceCharts select accessibility (label + focus ring)',
    description: 'Add <label> or aria-label to product dropdown. Improve focus ring contrast (indigo-300).',
    priority: 'high',
    assignees: ['@Henok'],
  },
  {
    title: 'LiveTicker: pause on hover + prefers-reduced-motion',
    description: 'WCAG 2.2.2 compliance: marquee must pause when hovered or focused. Add reduced-motion media query to disable animation.',
    priority: 'high',
    assignees: ['@Henok'],
  },
  {
    title: 'Empty states redesign: add icons + helpful copy',
    description: 'All data components need consistent empty state with icon, title, and subtext. Components: PriceCharts, ActiveCycles, SupplierLeaderboard, WinnerFeed.',
    priority: 'high',
    assignees: ['@Henok'],
  },
  {
    title: 'Loading states for all dashboard widgets',
    description: 'Add isLoading state and skeleton/spinner UI to TodaySummary, PriceCharts, ActiveCycles, WinnerFeed, SupplierLeaderboard, LiveTicker.',
    priority: 'medium',
    assignees: ['@Henok'],
  },
  {
    title: 'Error handling: replace silent catches with user feedback',
    description: 'All components currently swallow errors. Replace with inline error messages or propagate to ErrorBoundary. Add retry where appropriate.',
    priority: 'medium',
    assignees: ['@Henok'],
  },
  {
    title: 'ErrorBoundary UI improvement: friendly message + retry',
    description: 'Replace raw error.message display with user-friendly text and a retry button that remounts children.',
    priority: 'medium',
    assignees: ['@Henok'],
  },
  {
    title: 'Seeds: add active bidding cycle + recent bids',
    description: 'Run SQL seeds to create at least one active dc_bidding_cycle and insert ~20 recent dc_bids (last 4 hours) to populate TodaySummary, LiveTicker for demo.',
    priority: 'critical',
    assignees: ['@Henok'],
  },
  {
    title: 'SupplierLeaderboard loading + error states',
    description: 'Currently shows "No supplier data" during fetch. Add proper loading indicator and error message.',
    priority: 'medium',
    assignees: ['@Henok'],
  },
  {
    title: 'ActiveCycles date handling: support date-only cycles properly',
    description: 'Fix timing offset: cycles stored as date-only strings are parsed as UTC midnight, causing early expiry for GMT+3. Consider storing timestamptz or adjusting interpretation.',
    priority: 'low',
    assignees: ['@Kiro'],
  },
  {
    title: 'Cleanup: remove stray page.dynamic.tsx.temp and public/index.html',
    description: 'Orphaned files clutter repo. Delete them.',
    priority: 'low',
    assignees: ['@Henok'],
  },
  {
    title: 'LiveTicker: graceful fallback when 4h window empty',
    description: 'If no bids in last 4h, extend window to 24h or show last available bids to avoid empty bar.',
    priority: 'medium',
    assignees: ['@Henok'],
  },
  {
    title: 'Leaderboard: add hover state for consistency with WinnerFeed',
    description: 'WinnerFeed rows have hover; SupplierLeaderboard does not. Add hover:bg-slate-100 for consistency.',
    priority: 'low',
    assignees: ['@Henok'],
  },
  {
    title: 'Layout background cleanup: unify bg in layout vs page',
    description: 'layout.tsx sets bg-slate-50 but page.tsx overrides with bg-white. Decide single source of truth and remove conflicting class.',
    priority: 'low',
    assignees: ['@Henok'],
  },
  {
    title: 'PriceCharts: default product to most-bid one',
    description: 'Dropdown defaults to first product alphabetically; many have zero bids. Default to product with most bids in last 14 days.',
    priority: 'medium',
    assignees: ['@Henok'],
  },
  {
    title: 'LanguageContext: fix hydration mismatch risk',
    description: 'Locale freshly obtained from localStorage on client after SSR; en-preferring users may see flash. Use getLang() in useState initializer directly.',
    priority: 'medium',
    assignees: ['@Nova'],
  },
];

const projectId = await findProjectId('Bid Supply');
if (!projectId) {
  console.warn('No project found for "Bid Supply". Creating without project_id.');
}

for (const t of tasks) {
  const payload = { ...t, project_id: projectId, status: 'todo' };
  const { data, error } = await supabase
    .from('tasks')
    .insert([payload])
    .select()
    .single();
  if (error) {
    console.error('Task insert failed:', t.title, error.message);
  } else {
    console.log('Created task:', data.id, t.title);
  }
}
