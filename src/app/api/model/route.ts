import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';

export const dynamic = 'force-dynamic';

const CONFIG_PATH = '/home/ubuntu/.openclaw/openclaw.json';

// Helper to get model config from VPS or fallback
async function getConfig() {
  try {
    const raw = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // Not on VPS (e.g. Vercel serverless)
    return null;
  }
}

export async function GET() {
  try {
    const config = await getConfig();
    if (!config) {
      // Vercel fallback: return known model info from env vars or defaults
      return NextResponse.json({
        primary: process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3.6-plus-preview:free',
        mainAgentModel: process.env.DEFAULT_MODEL || null,
        activeModel: process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3.6-plus-preview:free',
        fallbacks: [],
        availableModels: [
          'openrouter/qwen/qwen3.6-plus-preview:free',
          'openrouter/stepfun/step-3.5-flash:free',
          'google/gemini-3.1-pro-preview',
          'openrouter/anthropic/claude-opus-4.6',
        ],
        source: 'env-fallback',
      });
    }

    const modelCfg = config?.agents?.defaults?.model;
    const primary = (typeof modelCfg === 'string') ? modelCfg : (modelCfg?.primary || 'unknown');
    const mainAgent = config?.agents?.list?.find((a: { id: string }) => a.id === 'main');
    const mainModel = mainAgent?.model || null;
    const fallbacks = (typeof modelCfg === 'object') ? (modelCfg?.fallbacks || []) : [];

    return NextResponse.json({
      primary,
      mainAgentModel: mainModel,
      activeModel: mainModel || primary,
      fallbacks,
      availableModels: Object.keys(config?.agents?.defaults?.models || {}),
      source: 'config-file',
    });
  } catch (err) {
    console.error('Failed to read model config:', err);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { model } = body;
    if (!model || typeof model !== 'string') {
      return NextResponse.json({ error: 'Missing model parameter' }, { status: 400 });
    }

    // We cannot update config or restart gateway when running on Vercel (serverless)
    return NextResponse.json({
      error: 'Model changes require deployment update. Edit the model configuration and redeploy the application.',
      hint: 'Use openclaw CLI or edit openclaw.json on the host machine.',
    }, { status: 503 });
  } catch (err) {
    console.error('Failed to update model:', err);
    return NextResponse.json({ error: 'Failed to update model config' }, { status: 500 });
  }
}