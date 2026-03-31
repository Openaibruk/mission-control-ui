import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Fetch news from Brave and write to public/api/news.json.
 * No exec() — uses native fetch() for serverless compatibility.
 */
export async function POST() {
  const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
  if (!BRAVE_API_KEY) {
    return NextResponse.json(
      { error: 'BRAVE_API_KEY not configured. Add it to your environment variables.' },
      { status: 503 }
    );
  }

  const searchQueries = [
    { q: 'AI technology news 2026', category: 'Tech' },
    { q: 'startup funding technology', category: 'Business' },
    { q: 'cloud computing infrastructure updates', category: 'Tech' },
    { q: 'African tech ecosystem news', category: 'Business' },
    { q: 'open source developer tools 2026', category: 'Tech' },
    { q: 'Ethiopia technology news', category: 'Internal' },
  ];

  const newNews: any[] = [];

  for (const sq of searchQueries) {
    try {
      const url =
        'https://api.search.brave.com/res/v1/web/search?q=' +
        encodeURIComponent(sq.q) +
        '&count=3';
      const resp = await fetch(url, {
        headers: {
          'X-Subscription-Token': BRAVE_API_KEY,
          Accept: 'application/json',
        },
      });
      if (!resp.ok) {
        console.warn('Brave API returned', resp.status, 'for query:', sq.q);
        continue;
      }
      const data = await resp.json();
      if (data.web?.results) {
        for (const r of data.web.results.slice(0, 2)) {
          if (newNews.length >= 8) break;
          newNews.push({
            title: r.title,
            source: r.url
              ? new URL(r.url).hostname.replace('www.', '')
              : 'Unknown',
            date: new Date().toISOString().split('T')[0],
            category: sq.category,
            summary: r.description?.substring(0, 150) ?? '',
            url: r.url,
          });
        }
      }
    } catch (e: any) {
      console.error('Error fetching:', sq.q, e?.message);
    }
  }

  // We can't write to the filesystem on Vercel serverless, so we return data
  // directly. The /api/news GET route should ideally cache this, but for now:
  return NextResponse.json({
    success: true,
    fetched: newNews.length,
    news: newNews,
    updatedAt: new Date().toISOString(),
    note: 'On Vercel serverless, results are returned directly — consider caching via Supabase or Redis.',
  });
}
