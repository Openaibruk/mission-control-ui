import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const NEWS_PATH = path.join(process.cwd(), 'public/api/news.json');

export async function POST() {
  try {
    // Call the news-fetch logic via exec
    const fetchNewsScript = `
      const fs = require('fs');
      const https = require('https');
      
      // Search for latest tech news
      const searchQueries = [
        { q: 'AI technology news 2026', category: 'Tech' },
        { q: 'startup funding technology', category: 'Business' },
        { q: 'cloud computing infrastructure updates', category: 'Tech' },
        { q: 'African tech ecosystem news', category: 'Business' },
        { q: 'open source developer tools 2026', category: 'Tech' },
        { q: 'Ethiopia technology news', category: 'Internal' },
      ];

      function searchBrave(query) {
        return new Promise((resolve, reject) => {
          const url = 'https://api.search.brave.com/res/v1/web/search?q=' + encodeURIComponent(query) + '&count=3';
          https.get(url, { headers: { 'Accept-Encoding': 'gzip', 'X-Subscription-Token': process.env.BRAVE_API_KEY || 'BSAgN2ie_9kisOq8GPFWMmL-MruZnS5' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
            });
          }).on('error', reject);
        });
      }

      async function fetchNews() {
        const existing = fs.existsSync(process.argv[2]) ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : { news: [] };
        const existingTitles = new Set((existing.news || []).map(n => n.title));
        const newNews = [];

        for (const sq of searchQueries) {
          try {
            const results = await searchBrave(sq.q);
            if (results.web && results.web.results) {
              for (const r of results.web.results.slice(0, 2)) {
                if (!existingTitles.has(r.title) && newNews.length < 8) {
                  newNews.push({
                    title: r.title,
                    source: r.url ? new URL(r.url).hostname.replace('www.', '') : 'Unknown',
                    date: new Date().toISOString().split('T')[0],
                    category: sq.category,
                    summary: r.description?.substring(0, 150),
                    url: r.url
                  });
                }
              }
            }
          } catch (e) {
            console.error('Error fetching:', sq.q, e.message);
          }
        }

        const allNews = [...(existing.news || []), ...newNews];
        const output = {
          updatedAt: new Date().toISOString(),
          news: allNews.slice(-10),
          business: existing.business || { date: new Date().toISOString().split('T')[0], revenue: "0", orders: 0, aov: 0, cp1: "0", cp1_margin: "0%", cp2: "0", cp2_margin: "0%", cogs: "0", warehouse: "0", delivery: "0" }
        };

        fs.writeFileSync(process.argv[2], JSON.stringify(output, null, 2));
        console.log('Updated news.json with', newNews.length, 'new items');
      }

      fetchNews().catch(console.error);
    `;

    const result = await new Promise<string>((resolve, reject) => {
      exec(`node -e '${fetchNewsScript.replace(/'/g, "'\\''")}' ${NEWS_PATH}`, 
        { timeout: 30000 }, (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve(stdout || stderr);
      });
    });

    return NextResponse.json({ success: true, message: result });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
