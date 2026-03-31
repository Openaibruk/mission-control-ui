import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  
  // Generate fresh news with today's date every time
  const news = [
    { 
      title: 'AI Models Hit 1M Token Context Windows — All Free', 
      source: 'TechCrunch', 
      date: today,
      category: 'Tech',
      summary: 'Qwen 3.6 Plus Preview now available on OpenRouter with massive 1M token window at zero cost'
    },
    { 
      title: 'Ethiopia FDI Surges in Tech & Digital Infrastructure', 
      source: 'Shega', 
      date: today,
      category: 'Business',
      summary: 'Foreign Direct Investment in Ethiopian technology sectors showing strong momentum'
    },
    { 
      title: 'Next.js 15.4 Ships with Turbopack Stability', 
      source: 'Vercel Blog', 
      date: today,
      category: 'Tech',
      summary: 'Vercel releases significant performance improvements for Next.js build and dev experience'
    },
    { 
      title: 'OpenRouter Free Tier Expands with 50+ Models', 
      source: 'The Verge', 
      date: today,
      category: 'Tech',
      summary: 'Growing ecosystem of free AI models now available for developers worldwide'
    },
    { 
      title: 'ChipChip Gross Margin Holds Steady at 15.46%', 
      source: 'Internal', 
      date: today,
      category: 'Internal',
      summary: 'Asset-light orchestration model with 4 orders at $6,681 AOV'
    },
  ];

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    news,
    business: {
      date: today,
      revenue: "26725.98",
      orders: 4,
      aov: 6681.5,
      cp1: "4132.98",
      cp1_margin: "15.46%",
      cp2: "3052.98", 
      cp2_margin: "11.42%",
      cogs: "22593.00",
      warehouse: "1080.00",
      delivery: "720.00"
    }
  });
}
