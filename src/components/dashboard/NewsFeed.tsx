'use client';

import { cn } from '@/lib/utils';
import { useTheme, useThemeClasses } from '@/hooks/useTheme';
import { Newspaper, RefreshCw, TrendingUp } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  summary?: string;
  category?: string;
}

interface BusinessMetrics {
  date: string;
  revenue: string;
  orders: number;
  aov: number;
  cp1: string;
  cp1_margin: string;
  cp2: string;
  cp2_margin: string;
  cogs: string;
  warehouse: string;
  delivery: string;
}

export function NewsFeed() {
  const { isDark } = useTheme();
  const classes = useThemeClasses(isDark);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [business, setBusiness] = useState<BusinessMetrics | null>(null);
  const [filter, setFilter] = useState<'all' | 'internal'>('all');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news?' + Date.now()); // dynamic API endpoint
      if (res.ok) {
        const data = await res.json();
        if (data.news && Array.isArray(data.news)) {
          setItems(data.news);
        }
        if (data.business && typeof data.business === 'object') {
          setBusiness(data.business as BusinessMetrics);
        }
        if (data.updatedAt) {
          setLastUpdated(data.updatedAt);
        }
      }
    } catch (e) {
      console.error('Failed to load news', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerManualUpdate = useCallback(async () => {
    setLoading(true);
    try {
      // Hit the news fetch endpoint if available, fallback to a proxy
      const res = await fetch('/api/news-fetch', { method: 'POST' });
      if (res.ok) {
        // Refresh the news data
        await loadNews();
      } else {
        // Just reload existing
        await loadNews();
      }
    } catch (e) {
      // Fallback: just refresh existing data
      await loadNews();
    }
  }, [loadNews]);

  useEffect(() => { loadNews(); }, [loadNews]);

  const filtered = filter === 'all' ? items : items.filter(i => i.category === 'Internal');

  const categoryColor = (cat?: string) => {
    switch (cat) {
      case 'Internal': return 'bg-emerald-500/20 text-emerald-400';
      case 'Tech': return 'bg-blue-500/20 text-blue-400';
      case 'Finance': return 'bg-violet-500/20 text-violet-400';
      case 'Economy': return 'bg-amber-500/20 text-amber-400';
      case 'Business': return 'bg-cyan-500/20 text-cyan-400';
      case 'Agritech': return 'bg-green-500/20 text-green-400';
      case 'Logistics': return 'bg-orange-500/20 text-orange-400';
      case 'Trade': return 'bg-yellow-500/20 text-yellow-400';
      case 'Politics': return 'bg-red-500/20 text-red-400';
      default: return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  return (
    <div className={cn("p-4", classes.card)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-blue-400" />
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">News & Updates</span>
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'internal'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('text-[9px] px-2 py-1 rounded capitalize transition-colors',
                filter === f ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700') : cn(classes.muted, isDark ? 'hover:text-neutral-300' : 'hover:text-neutral-900'))}>
              {f}
            </button>
          ))}
          <button onClick={loadNews} className={cn('p-1 ml-1', loading && 'animate-spin')}>
            <RefreshCw className="w-3 h-3 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Business Metrics Card (if present) */}
      {business && (
        <div className={cn("mb-4 p-3 rounded-lg border", isDark ? "bg-neutral-800/60 border-neutral-700/50" : "bg-neutral-50 border-neutral-200")}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-400">Business Snapshot — {business.date}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-[9px]">
            <div><span className={classes.muted}>Revenue</span><div className={cn("font-mono", classes.heading)}>${Number(business.revenue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>
            <div><span className={classes.muted}>Orders</span><div className={cn("font-mono", classes.heading)}>{business.orders}</div></div>
            <div><span className={classes.muted}>AOV</span><div className={cn("font-mono", classes.heading)}>${Number(business.aov).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>
            <div><span className={classes.muted}>COGS</span><div className={cn("font-mono", classes.heading)}>${Number(business.cogs).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>
            <div className="col-span-2"><span className={classes.muted}>CP1 (Gross Margin)</span><div className="font-mono text-emerald-400">{business.cp1} ({business.cp1_margin})</div></div>
            <div className="col-span-2"><span className={classes.muted}>CP2 (Net Margin)</span><div className="font-mono text-amber-400">{business.cp2} ({business.cp2_margin})</div></div>
          </div>
        </div>
      )}

      {/* News items */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {filtered.slice(0, 10).map((item, i) => (
          <div key={i} className={cn("group rounded-md p-2.5 transition-colors cursor-pointer", isDark ? "bg-neutral-800/30 hover:bg-neutral-800/60" : "bg-neutral-50 hover:bg-neutral-100")}>
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className={cn("text-[11px] font-medium leading-tight transition-colors", isDark ? "text-neutral-200 group-hover:text-white" : "text-neutral-700 group-hover:text-black")}>
                  {item.title}
                </div>
                {item.summary && (
                  <div className={cn("text-[10px] mt-1 line-clamp-1", classes.muted)}>{item.summary}</div>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={cn('text-[8px] font-semibold px-1.5 py-0.5 rounded', categoryColor(item.category))}>
                    {item.source}
                  </span>
                  <span className={cn("text-[9px]", classes.subtle)}>{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !loading && (
          <div className={cn("text-xs text-center py-4", classes.muted)}>No news found</div>
        )}
      </div>
    </div>
  );
}
