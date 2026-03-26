import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const GATEWAY_URL = 'http://localhost:3114';
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || process.env.OPENCLAW_GATEWAY_TOKEN || '';
export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${GATEWAY_URL}/api/health`, {
      headers: GATEWAY_TOKEN ? { Authorization: `Bearer ${GATEWAY_TOKEN}` } : {},
      signal: controller.signal, cache: 'no-store',
    }).catch(() => null);
    clearTimeout(timeout);
    if (!res || !res.ok) return NextResponse.json({ connected: false, status: 'offline' });
    const health = await res.json().catch(() => ({}));
    return NextResponse.json({ connected: true, status: 'online', health, uptime: (health as Record<string, unknown>)?.uptime as number || 0 });
  } catch { return NextResponse.json({ connected: false, status: 'error' }); }
}
