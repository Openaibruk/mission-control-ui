import { NextRequest, NextResponse } from 'next/server';
import WebSocket from 'ws';

const GATEWAY_WS = process.env.GATEWAY_WS_URL || 'ws://localhost:3114/ws';
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || process.env.OPENCLAW_GATEWAY_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, type } = body;

    if (type === 'gateway') {
      return NextResponse.json({ status: 'ok', message: 'Gateway info', sessions: [], connected: false });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const targetSession = sessionId || 'main';

    try {
      const response = await sendToGateway(targetSession, message.trim());
      return NextResponse.json({
        success: true,
        response,
        session: targetSession,
        timestamp: new Date().toISOString(),
      });
    } catch (wsError) {
      console.error('Gateway WS error:', wsError);
      return NextResponse.json({
        success: false,
        response: `⚠️ Agent gateway offline. WS Error: ${wsError instanceof Error ? wsError.message : 'Unknown'}`,
        session: targetSession,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function sendToGateway(sessionId: string, message: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const wsUrl = GATEWAY_TOKEN
      ? `${GATEWAY_WS}?token=${encodeURIComponent(GATEWAY_TOKEN)}`
      : GATEWAY_WS;

    const ws = new WebSocket(wsUrl);
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) { settled = true; ws.close(); reject(new Error('Timeout waiting for response')); }
    }, 30000);

    ws.on('open', () => {
      const payload = { type: 'message', sessionId, content: message, timestamp: Date.now() };
      ws.send(JSON.stringify(payload));
    });

    ws.on('data', (data: Buffer) => {
      if (settled) return;
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'response' || parsed.type === 'message' || parsed.content || parsed.text) {
          settled = true; clearTimeout(timeout); ws.close();
          resolve(parsed.content || parsed.text || JSON.stringify(parsed));
        }
      } catch { /* partial or control frame */ }
    });

    ws.on('message', (data: WebSocket.Data) => {
      if (settled) return;
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'response' || parsed.type === 'message' || parsed.content || parsed.text) {
          settled = true; clearTimeout(timeout); ws.close();
          resolve(parsed.content || parsed.text || JSON.stringify(parsed));
        }
      } catch { /* partial or control frame */ }
    });

    ws.on('error', (err) => { if (!settled) { settled = true; clearTimeout(timeout); reject(err); } });
    ws.on('close', () => { if (!settled) { settled = true; clearTimeout(timeout); reject(new Error('Gateway connection closed')); } });
  });
}
