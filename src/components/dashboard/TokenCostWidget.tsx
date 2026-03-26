'use client';

import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Zap, DollarSign, Cpu, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TokenCostData {
  generatedAt: string;
  summary: {
    totalCost: number;
    totalTokens: number;
    totalCalls: number;
    avgCostPerCall: number;
    modelCount: number;
  };
  byModel: Array<{
    model: string;
    calls: number;
    tokens: number;
    cost: number;
    input: number;
    output: number;
  }>;
  last7Days: Array<{
    date: string;
    calls: number;
    tokens: number;
    cost: number;
  }>;
}

interface TokenCostWidgetProps {
  theme: 'dark' | 'light';
}

export function TokenCostWidget({ theme }: TokenCostWidgetProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [data, setData] = useState<TokenCostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/token-costs.json')
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={cn("rounded-lg p-5 animate-pulse", classes.card)}>
        <div className={cn("h-4 w-24 rounded mb-3", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
        <div className={cn("h-8 w-16 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
      </div>
    );
  }

  if (!data || !data.summary) {
    return (
      <div className={cn("rounded-lg p-5", classes.card)}>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <h3 className={cn("text-[13px] font-semibold", classes.heading)}>Token Costs</h3>
        </div>
        <p className={cn("text-[11px]", classes.muted)}>No cost data yet. Run the token tracker to see costs.</p>
      </div>
    );
  }

  const { summary, byModel, last7Days } = data;
  const topModel = byModel[0];
  const maxDailyCost = Math.max(...last7Days.map(d => d.cost), 0.01);

  return (
    <div className={cn("rounded-lg p-5", classes.card)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <h3 className={cn("text-[13px] font-semibold", classes.heading)}>Token Costs</h3>
        </div>
        <span className={cn("text-[10px]", classes.subtle)}>
          Updated {new Date(data.generatedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className={cn("p-3 rounded-md text-center", isDark ? "bg-white/[0.03]" : "bg-neutral-50")}>
          <div className={cn("text-[9px] uppercase font-semibold mb-1", "text-emerald-400")}>Total Spend</div>
          <div className={cn("text-[20px] font-bold", classes.heading)}>${summary.totalCost.toFixed(2)}</div>
        </div>
        <div className={cn("p-3 rounded-md text-center", isDark ? "bg-white/[0.03]" : "bg-neutral-50")}>
          <div className={cn("text-[9px] uppercase font-semibold mb-1", "text-blue-400")}>Total Tokens</div>
          <div className={cn("text-[20px] font-bold", classes.heading)}>{(summary.totalTokens / 1000000).toFixed(1)}M</div>
        </div>
        <div className={cn("p-3 rounded-md text-center", isDark ? "bg-white/[0.03]" : "bg-neutral-50")}>
          <div className={cn("text-[9px] uppercase font-semibold mb-1", "text-violet-400")}>API Calls</div>
          <div className={cn("text-[20px] font-bold", classes.heading)}>{summary.totalCalls.toLocaleString()}</div>
        </div>
        <div className={cn("p-3 rounded-md text-center", isDark ? "bg-white/[0.03]" : "bg-neutral-50")}>
          <div className={cn("text-[9px] uppercase font-semibold mb-1", "text-amber-400")}>Avg/Call</div>
          <div className={cn("text-[20px] font-bold", classes.heading)}>${summary.avgCostPerCall.toFixed(4)}</div>
        </div>
      </div>

      {/* Per-model breakdown */}
      {byModel.length > 0 && (
        <div className="mb-4">
          <div className={cn("text-[11px] font-semibold mb-2", classes.muted)}>By Model</div>
          <div className="space-y-2">
            {byModel.map((m) => {
              const pct = summary.totalCost > 0 ? (m.cost / summary.totalCost) * 100 : 0;
              return (
                <div key={m.model} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={cn("text-[11px] font-medium truncate", classes.heading)}>{m.model.replace('anthropic/', '').replace('google/', '').replace('openrouter/', '')}</span>
                      <span className={cn("text-[11px] font-semibold", classes.heading)}>${m.cost.toFixed(2)}</span>
                    </div>
                    <div className={cn("w-full rounded-full h-1.5", isDark ? "bg-neutral-700" : "bg-neutral-200")}>
                      <div 
                        className="h-1.5 rounded-full bg-violet-500 transition-all" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className={cn("text-[9px] mt-0.5", classes.subtle)}>{m.calls} calls · {(m.tokens / 1000).toFixed(0)}k tokens · {pct.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7-day chart */}
      {last7Days.length > 0 && (
        <div>
          <div className={cn("text-[11px] font-semibold mb-2", classes.muted)}>Last 7 Days</div>
          <div className="flex items-end gap-1 h-[40px]">
            {last7Days.slice().reverse().map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-emerald-500/60 rounded-t-sm transition-all hover:bg-emerald-500"
                  style={{ height: `${Math.max((day.cost / maxDailyCost) * 36, 2)}px` }}
                  title={`${day.date}: $${day.cost.toFixed(2)}`}
                />
                <span className={cn("text-[8px] mt-0.5", classes.subtle)}>{day.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
