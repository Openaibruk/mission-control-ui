'use client';

import { useState, useEffect } from 'react';
import { cn, getThemeClasses } from '@/lib/utils';
import { Coins, RefreshCw } from 'lucide-react';

interface TokenCostData {
  total_spend: number;
  period: string;
  breakdown: {
    agent_id: string;
    agent_name: string;
    tokens_in: number;
    tokens_out: number;
    cost_usd: number;
  }[];
}

interface TokenCostWidgetProps {
  theme: 'dark' | 'light';
}

export default function TokenCostWidget({ theme }: TokenCostWidgetProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);
  const [data, setData] = useState<TokenCostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/token-costs')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={cn("rounded-xl border p-4", classes.card)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn("text-sm font-semibold flex items-center gap-2", classes.heading)}>
          <Coins className="w-4 h-4 text-amber-400" /> Token Costs
        </h3>
        {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-500" />}
      </div>

      {data ? (
        <>
          <div className="flex items-baseline gap-2 mb-3">
            <span className={cn("text-2xl font-bold", classes.heading)}>
              ${data.total_spend.toFixed(2)}
            </span>
            <span className={cn("text-xs", classes.muted)}>{data.period}</span>
          </div>
          {data.breakdown.length > 0 && (
            <div className="space-y-1.5">
              {data.breakdown.slice(0, 5).map((item) => (
                <div key={item.agent_id} className="flex items-center justify-between text-xs">
                  <span className={classes.text}>{item.agent_name}</span>
                  <span className={cn("font-mono", classes.muted)}>${item.cost_usd.toFixed(4)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className={cn("text-sm", classes.muted)}>
          {loading ? 'Loading...' : 'No token cost data available'}
        </p>
      )}
    </div>
  );
}
