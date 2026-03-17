import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgrdeznxllkdolvrhlnm.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try to fetch from a token_costs table if it exists
    const { data, error } = await supabase
      .from('token_costs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) {
      // Return empty/placeholder data if table doesn't exist
      return NextResponse.json({
        total_spend: 0,
        period: 'this month',
        breakdown: [],
      });
    }

    // Aggregate by agent
    const byAgent: Record<string, { agent_id: string; agent_name: string; tokens_in: number; tokens_out: number; cost_usd: number }> = {};

    for (const row of data) {
      const agentId = row.agent_id || 'unknown';
      if (!byAgent[agentId]) {
        byAgent[agentId] = {
          agent_id: agentId,
          agent_name: row.agent_name || agentId,
          tokens_in: 0,
          tokens_out: 0,
          cost_usd: 0,
        };
      }
      byAgent[agentId].tokens_in += row.tokens_in || 0;
      byAgent[agentId].tokens_out += row.tokens_out || 0;
      byAgent[agentId].cost_usd += row.cost_usd || 0;
    }

    const breakdown = Object.values(byAgent).sort((a, b) => b.cost_usd - a.cost_usd);
    const total_spend = breakdown.reduce((sum, b) => sum + b.cost_usd, 0);

    return NextResponse.json({
      total_spend: Math.round(total_spend * 100) / 100,
      period: 'this month',
      breakdown,
    });
  } catch {
    return NextResponse.json({
      total_spend: 0,
      period: 'this month',
      breakdown: [],
    });
  }
}
