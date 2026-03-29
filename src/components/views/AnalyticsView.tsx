'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';

const MCP_URL = 'https://earrqspffkrnreucmtvf.supabase.co/functions/v1/datahub-mcp-server';

export function AnalyticsView({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [viewMode, setViewMode] = useState<'B2B' | 'B2C'>('B2B');
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock data for B2C view
  const b2cData = {
    tokenUsage: {
      total: 1254300,
      daily: Array.from({ length: 30 }).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
        tokens: Math.floor(Math.random() * 50000) + 10000
      }))
    },
    agentPerformance: [
      { name: 'Research Agent', successRate: 98.5, latencyMs: 1200, tasks: 450 },
      { name: 'Code Reviewer', successRate: 94.2, latencyMs: 3400, tasks: 320 },
      { name: 'Data Analyst', successRate: 99.1, latencyMs: 2100, tasks: 890 },
      { name: 'Copywriter', successRate: 91.0, latencyMs: 800, tasks: 150 }
    ],
    projectEfficiency: {
      avgCompletionTime: '2.4h',
      automationRate: 84.5,
      costSaved: '$3,450',
      activeProjects: 12
    }
  };

  const fetchData = async () => {
    if (viewMode === 'B2C') return; // Using mock data for B2C
    
    setLoading(true);
    setError(null);
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      const fmt = (d: Date) => d.toISOString().split('T')[0];
      const resp = await fetch(MCP_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mcp_gCNsJa4XoP3Tb9o143jPiR1AyoF5iN7HITnPmZwwfHdIk6aC'
        },
        body: JSON.stringify({
          jsonrpc: '2.0', method: 'tools/call',
          params: { name: 'get_margin_analysis', arguments: { startDate: fmt(start), endDate: fmt(end) } },
          id: 1,
        }),
      });
      const json = await resp.json();
      if (json.error) { setError(JSON.stringify(json.error)); return; }
      const content = json.result?.content?.[0]?.text;
      if (content) { try { setData(JSON.parse(content)); } catch { setData(null); } }
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { 
    if (viewMode === 'B2B') {
      fetchData(); 
    }
  }, [viewMode]);

  const fmtNum = (n: number | null | undefined) => n != null ? Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '—';
  const fmtPct = (n: number | null | undefined) => n != null ? Number(n).toFixed(1) + '%' : '—';

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold", classes.heading)}>Analytics</h1>
          <p className={cn("text-sm mt-1", classes.muted)}>
            {viewMode === 'B2B' ? 'B2B Margin Analysis — Last 30 Days' : 'B2C Agent Performance & Token Usage'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={cn("flex p-1 rounded-lg border", isDark ? "bg-black/20 border-white/10" : "bg-neutral-100 border-neutral-200")}>
            <button
              onClick={() => setViewMode('B2B')}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === 'B2B' 
                  ? "bg-violet-600 text-white shadow" 
                  : cn("hover:bg-black/10 text-neutral-400", isDark ? "hover:text-white" : "hover:text-black")
              )}
            >
              B2B Data
            </button>
            <button
              onClick={() => setViewMode('B2C')}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === 'B2C' 
                  ? "bg-violet-600 text-white shadow" 
                  : cn("hover:bg-black/10 text-neutral-400", isDark ? "hover:text-white" : "hover:text-black")
              )}
            >
              B2C Data
            </button>
          </div>
          
          {viewMode === 'B2B' && (
            <button onClick={fetchData} disabled={loading}
              className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          )}
        </div>
      </div>

      {error && viewMode === 'B2B' && (
        <div className="bg-red-900/20 border border-red-700 text-red-200 p-4 rounded"><pre className="text-xs">{error}</pre></div>
      )}

      {/* --- B2B VIEW --- */}
      {viewMode === 'B2B' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {data?.summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total GMV', value: fmtNum(data.summary.total_gmv), color: 'text-white', sub: 'ETB' },
                { label: 'Total Cost', value: fmtNum(data.summary.total_cost), color: 'text-amber-400', sub: 'ETB' },
                { label: 'Gross Margin', value: fmtNum(data.summary.total_gross_margin), color: 'text-emerald-400', sub: 'ETB' },
                { label: 'Net Margin', value: fmtNum(data.summary.total_net_margin), color: 'text-blue-400', sub: 'ETB' },
                { label: 'Margin %', value: fmtPct(data.summary.avg_margin_percent), color: 'text-violet-400', sub: 'avg' },
                { label: 'Coverage', value: fmtPct(data.summary.coverage_percent), color: 'text-cyan-400', sub: `${data.summary.matched_products}/${data.summary.matched_products + data.summary.unmatched_products}` },
              ].map(card => (
                <div key={card.label} className={cn("border rounded-lg p-4", classes.card)}>
                  <div className={cn("text-[10px] uppercase tracking-wider mb-1", classes.muted)}>{card.label}</div>
                  <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
                  <div className={cn("text-[9px] mt-0.5", classes.muted)}>{card.sub}</div>
                </div>
              ))}
            </div>
          )}

          {data?.daily_trends && data.daily_trends.length > 0 && (
            <div className={cn("border rounded-lg p-5", classes.card)}>
              <h3 className={cn("text-sm font-semibold mb-4", classes.heading)}>Daily GMV Trend</h3>
              <div className="flex items-end gap-1 h-32 overflow-x-auto">
                {data.daily_trends.map((d: any, i: number) => {
                  const maxGmv = Math.max(...data.daily_trends.map((t: any) => t.gmv || 0));
                  const h = maxGmv > 0 ? ((d.gmv || 0) / maxGmv) * 100 : 0;
                  return (
                    <div key={i} className="flex flex-col items-center flex-shrink-0" style={{ width: Math.max(20, 600 / data.daily_trends.length) }}>
                      <div className="w-full bg-violet-500/30 rounded-t relative group" style={{ height: `${h}%`, minHeight: 2 }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                          {fmtNum(d.gmv)} ETB
                        </div>
                      </div>
                      <div className={cn("text-[8px] mt-1 -rotate-45 origin-top-left whitespace-nowrap", classes.muted)}>
                        {(d.date || '').slice(5)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.category_breakdown && data.category_breakdown.length > 0 && (
              <div className={cn("border rounded-lg p-5", classes.card)}>
                <h3 className={cn("text-sm font-semibold mb-3", classes.heading)}>Category Breakdown</h3>
                <div className="space-y-2">
                  {data.category_breakdown.map((cat: any, i: number) => {
                    const maxGmv = Math.max(...data.category_breakdown.map((c: any) => c.gmv || 0));
                    const pct = maxGmv > 0 ? ((cat.gmv || 0) / maxGmv) * 100 : 0;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className={classes.heading}>{cat.category}</span>
                          <span className={classes.muted}>{fmtNum(cat.gmv)} ETB · {fmtPct(cat.margin_percent)}</span>
                        </div>
                        <div className={cn("h-2 rounded-full overflow-hidden", isDark ? "bg-white/10" : "bg-black/10")}>
                          <div className="h-full bg-violet-500/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data?.top_margin_products && data.top_margin_products.length > 0 && (
              <div className={cn("border rounded-lg p-5", classes.card)}>
                <h3 className={cn("text-sm font-semibold mb-3", classes.heading)}>Top Margin Products</h3>
                <div className="space-y-1.5">
                  {data.top_margin_products.slice(0, 8).map((p: any, i: number) => (
                    <div key={i} className={cn("flex items-center justify-between py-1.5 border-b last:border-0", isDark ? "border-white/10" : "border-black/10")}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={cn("text-[10px] w-4", classes.muted)}>{i + 1}</span>
                        <span className={cn("text-xs truncate", classes.heading)}>{p.product_name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-emerald-400">{fmtPct(p.margin_percent)}</span>
                        <span className={cn("text-[10px]", classes.muted)}>{fmtNum(p.gmv)} ETB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!data && !loading && !error && (
            <div className={cn("text-center py-12", classes.muted)}>No B2B data available. Click Refresh to load.</div>
          )}
        </div>
      )}

      {/* --- B2C VIEW --- */}
      {viewMode === 'B2C' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Efficiency & Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Token Usage', value: fmtNum(b2cData.tokenUsage.total), color: 'text-pink-400', sub: 'Last 30 Days' },
              { label: 'Avg Task Latency', value: '1.8s', color: 'text-amber-400', sub: 'Across all agents' },
              { label: 'Automation Rate', value: `${b2cData.projectEfficiency.automationRate}%`, color: 'text-emerald-400', sub: 'Human-in-the-loop reduction' },
              { label: 'Estimated Saved', value: b2cData.projectEfficiency.costSaved, color: 'text-blue-400', sub: 'vs traditional API calls' },
            ].map(card => (
              <div key={card.label} className={cn("border rounded-lg p-4", classes.card)}>
                <div className={cn("text-[10px] uppercase tracking-wider mb-1", classes.muted)}>{card.label}</div>
                <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
                <div className={cn("text-[9px] mt-0.5", classes.muted)}>{card.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Token Trends */}
            <div className={cn("border rounded-lg p-5 lg:col-span-2", classes.card)}>
              <h3 className={cn("text-sm font-semibold mb-4", classes.heading)}>Token Usage Trends</h3>
              <div className="flex items-end gap-1 h-48 overflow-x-auto">
                {b2cData.tokenUsage.daily.map((d, i) => {
                  const maxTokens = Math.max(...b2cData.tokenUsage.daily.map(t => t.tokens));
                  const h = maxTokens > 0 ? (d.tokens / maxTokens) * 100 : 0;
                  return (
                    <div key={i} className="flex flex-col items-center flex-shrink-0" style={{ width: Math.max(20, 100 / b2cData.tokenUsage.daily.length) + '%' }}>
                      <div className="w-full bg-pink-500/40 rounded-t relative group" style={{ height: `${h}%`, minHeight: 4 }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none shadow-lg">
                          {fmtNum(d.tokens)} tokens
                        </div>
                      </div>
                      <div className={cn("text-[8px] mt-2 -rotate-45 origin-top-left whitespace-nowrap", classes.muted)}>
                        {d.date.slice(5)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent Performance */}
            <div className={cn("border rounded-lg p-5", classes.card)}>
              <h3 className={cn("text-sm font-semibold mb-4", classes.heading)}>Agent Performance</h3>
              <div className="space-y-4">
                {b2cData.agentPerformance.map((agent, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className={cn("text-xs font-medium", classes.heading)}>{agent.name}</span>
                      <span className="text-xs text-emerald-400">{agent.successRate}% success</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={classes.muted}>{agent.tasks} tasks</span>
                      <span className={classes.muted}>{agent.latencyMs}ms avg</span>
                    </div>
                    <div className={cn("h-1.5 rounded-full overflow-hidden", isDark ? "bg-white/10" : "bg-black/10")}>
                      <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${agent.successRate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      )}

    </div>
  );
}
