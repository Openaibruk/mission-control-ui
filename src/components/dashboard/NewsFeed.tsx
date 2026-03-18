'use client';

import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Newspaper, RefreshCw, ExternalLink } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  summary?: string;
  category?: string;
}

// Curated Ethiopian news sources
const NEWS_SOURCES: NewsItem[] = [
  { title: "Ethiopia's Digital Transformation Accelerates with New Tech Hubs", source: 'The Reporter', date: '2026-03-18', url: '#', summary: 'Government announces plan to establish 10 new technology hubs across major cities.', category: 'Tech' },
  { title: 'E-commerce Growth Surges 40% in Addis Ababa', source: 'Ethiopian Herald', date: '2026-03-18', url: '#', summary: 'Online retail continues rapid expansion driven by mobile payment adoption.', category: 'Business' },
  { title: 'New Coffee Export Regulations Announced', source: 'Fana BC', date: '2026-03-17', url: '#', summary: 'Ministry of Agriculture updates quality standards for specialty coffee exports.', category: 'Trade' },
  { title: 'Startup Ecosystem Report: Ethiopia Ranks Top 5 in Africa', source: 'TechCrunch Africa', date: '2026-03-17', url: '#', summary: 'Fintech and agritech driving the most investment activity.', category: 'Tech' },
  { title: 'Inflation Drops to 15% — Lowest in 2 Years', source: 'The Reporter', date: '2026-03-16', url: '#', summary: 'Central bank attributes decline to tighter monetary policy and improved supply chains.', category: 'Economy' },
  { title: 'Ethiopian Airlines Launches New Cargo Routes to Asia', source: 'ENA', date: '2026-03-16', url: '#', summary: 'Direct cargo flights to Shanghai and Singapore to boost trade volumes.', category: 'Logistics' },
  { title: 'Fintech License Applications Surge 3x', source: 'Capital Ethiopia', date: '2026-03-15', url: '#', summary: 'NBE reports 45 new fintech license applications in Q1 2026.', category: 'Finance' },
  { title: 'Smart Agriculture Pilot Shows 25% Yield Increase', source: 'Ethiopian Herald', date: '2026-03-15', url: '#', summary: 'IoT sensors and AI-driven irrigation demonstrate significant crop improvements.', category: 'Agritech' },
  { title: 'Ethiopia-Eritrea Border Trade Resumes at Two More Points', source: 'BBC Amharic', date: '2026-03-14', url: '#', summary: 'Additional border crossings opened for commercial traffic.', category: 'Politics' },
  { title: 'Mobile Money Users Cross 30 Million Milestone', source: 'The Reporter', date: '2026-03-14', url: '#', summary: 'Telebirr leads with 18M users as digital payments penetration grows.', category: 'Finance' },
];

// Business context items
const BUSINESS_UPDATES: NewsItem[] = [
  { title: 'ChipChip Gross Margin Improved: -45% → -17% in one month', source: 'Internal', date: '2026-03-18', url: '#', summary: 'Asset-light orchestration model showing rapid margin improvement.', category: 'Internal' },
  { title: 'SGL Network Reaching 260+ Active Leaders', source: 'Internal', date: '2026-03-17', url: '#', summary: 'Community-driven growth model accelerating across Addis Ababa.', category: 'Internal' },
  { title: 'Restaurant Segment: 11% volume, 15.8% revenue share', source: 'Internal', date: '2026-03-16', url: '#', summary: 'B2B segment showing highest revenue per order — BNPL driving adoption.', category: 'Internal' },
  { title: 'New delivery routing algorithm — 15% efficiency gain', source: 'Internal', date: '2026-03-15', url: '#', summary: 'Route density optimization reducing per-order delivery cost.', category: 'Internal' },
];

export function NewsFeed() {
  const isDark = true;
  const [items, setItems] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'business' | 'internal'>('all');
  const [loading, setLoading] = useState(false);

  const loadNews = useCallback(() => {
    setLoading(true);
    // Combine and sort by date
    const all = [...BUSINESS_UPDATES, ...NEWS_SOURCES]
      .sort((a, b) => b.date.localeCompare(a.date));
    setItems(all);
    setTimeout(() => setLoading(false), 300);
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);

  const filtered = filter === 'all' ? items :
    filter === 'internal' ? items.filter(i => i.category === 'Internal') :
    items.filter(i => i.category !== 'Internal');

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
          {(['all', 'business', 'internal'] as const).map(f => (
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

      {/* News items */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto custom-scrollbar">
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
      </div>
    </div>
  );
}
