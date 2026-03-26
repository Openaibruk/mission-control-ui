import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GATEWAY_URL = 'http://localhost:3114';
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || process.env.OPENCLAW_GATEWAY_TOKEN || '';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const healthRes = await fetch(`${GATEWAY_URL}/api/health`, {
      headers: GATEWAY_TOKEN ? { Authorization: `Bearer ${GATEWAY_TOKEN}` } : {},
      signal: controller.signal,
      cache: 'no-store',
    }).catch(() => null);

    clearTimeout(timeout);

    if (!healthRes || !healthRes.ok) {
      return NextResponse.json({ connected: false, status: 'offline' });
    }

    const health = await healthRes.json().catch(() => ({}));

    const ctrl2 = new AbortController();
    const timeout2 = setTimeout(() => ctrl2.abort(), 3000);

    const sessionsRes = await fetch(`${GATEWAY_URL}/api/sessions`, {
      headers: GATEWAY_TOKEN ? { Authorization: `Bearer ${GATEWAY_TOKEN}` } : {},
      signal: ctrl2.signal,
      cache: 'no-store',
    }).catch(() => null);

    clearTimeout(timeout2);

    let sessions: unknown[] = [];
    if (sessionsRes?.ok) {
      const data = await sessionsRes.json().catch(() => ({}));
      sessions = Array.isArray(data) ? data : (data?.sessions || []);
    }

    return NextResponse.json({
      connected: true,
      status: 'online',
      sessions: sessions.length,
      health,
      uptime: (health as Record<string, unknown>)?.uptime as number || 0,
    });
  } catch {
    return NextResponse.json({ connected: false, status: 'error' });
  }
}
