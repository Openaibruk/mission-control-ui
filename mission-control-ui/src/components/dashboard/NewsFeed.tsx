'use client';

import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
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
  const isDark = true;
  const [items, setItems] = useState<NewsItem[]>([]);
  const [business, setBusiness] = useState<BusinessMetrics | null>(null);
  const [filter, setFilter] = useState<'all' | 'internal'>('all');
  const [loading, setLoading] = useState(false);

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news.json?' + Date.now()); // cache bust
      if (res.ok) {
        const data = await res.json();
        if (data.news && Array.isArray(data.news)) {
          setItems(data.news);
        }
        if (data.business && typeof data.business === 'object') {
          setBusiness(data.business as BusinessMetrics);
        }
      }
    } catch (e) {
      console.error('Failed to load news', e);
    } finally {
      setLoading(false);
    }
  }, []);

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
    <div className="rounded-lg border border-neutral-800/50 bg-neutral-900/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-blue-400" />
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">News & Updates</span>
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'internal'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('text-[9px] px-2 py-1 rounded capitalize',
                filter === f ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-500 hover:text-neutral-300')}>
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
        <div className="mb-4 p-3 rounded-lg bg-neutral-800/60 border border-neutral-700/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-400">Business Snapshot — {business.date}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-[9px]">
            <div><span className="text-neutral-500">Revenue</span><div className="font-mono text-white">${Number(business.revenue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>
            <div><span className="text-neutral-500">Orders</span><div className="font-mono text-white">{business.orders}</div></div>
            <div><span className="text-neutral-500">AOV</span><div className="font-mono text-white">${Number(business.aov).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>
            <div><span className="text-neutral-500">COGS</span><div className="font-mono text-white">${Number(business.cogs).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>
            <div className="col-span-2"><span className="text-neutral-500">CP1 (Gross Margin)</span><div className="font-mono text-emerald-400">{business.cp1} ({business.cp1_margin})</div></div>
            <div className="col-span-2"><span className="text-neutral-500">CP2 (Net Margin)</span><div className="font-mono text-amber-400">{business.cp2} ({business.cp2_margin})</div></div>
          </div>
        </div>
      )}

      {/* News items */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {filtered.slice(0, 10).map((item, i) => (
          <div key={i} className="group rounded-md bg-neutral-800/30 hover:bg-neutral-800/60 p-2.5 transition-colors cursor-pointer">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-neutral-200 leading-tight group-hover:text-white transition-colors">
                  {item.title}
                </div>
                {item.summary && (
                  <div className="text-[10px] text-neutral-500 mt-1 line-clamp-1">{item.summary}</div>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={cn('text-[8px] font-semibold px-1.5 py-0.5 rounded', categoryColor(item.category))}>
                    {item.source}
                  </span>
                  <span className="text-[9px] text-neutral-600">{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !loading && (
          <div className="text-xs text-neutral-500 text-center py-4">No news found</div>
        )}
      </div>
    </div>
  );
}
