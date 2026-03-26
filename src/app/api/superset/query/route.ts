import { NextRequest, NextResponse } from 'next/server';

const SUPERSET_URL = process.env.SUPERSET_URL!;
const SUPERSET_API_TOKEN = process.env.SUPERSET_API_TOKEN!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql, database_id = 6, schema = 'main', client_id, expand_data = true } = body;
    
    if (!sql || typeof sql !== 'string') {
      return NextResponse.json({ error: 'SQL query is required' }, { status: 400 });
    }
    
    if (!SUPERSET_URL || !SUPERSET_API_TOKEN) {
      return NextResponse.json({ error: 'Superset configuration missing on server' }, { status: 500 });
    }
    
    const clientId = client_id || Math.random().toString(36).substring(2, 13);
    
    const supersetResponse = await fetch(`${SUPERSET_URL.replace(/\/+$/,'')}/api/v1/sqllab/execute/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPERSET_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        database_id,
        json: true,
        runAsync: false,
        schema,
        sql,
        tab: 'test',
        expand_data,
      }),
      signal: AbortSignal.timeout(10000),
    });
    
    const data = await supersetResponse.json();
    return NextResponse.json(data, { status: supersetResponse.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
