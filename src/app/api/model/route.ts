import { NextResponse } from 'next/server';
import { readFile, writeFile, access } from 'fs/promises';
import { exec } from 'child_process';

export const dynamic = 'force-dynamic';

const CONFIG_PATH = '/home/ubuntu/.openclaw/openclaw.json';

// Helper to get model config from VPS or fallback
async function getConfig() {
  try {
    await access(CONFIG_PATH);
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

    // Model can be a string or an object with .primary
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

    const config = await getConfig();
    if (!config) {
      return NextResponse.json({ error: 'Cannot update model on Vercel (VPS config not accessible)', source: 'vercel' }, { status: 503 });
    }

    if (!config.agents) config.agents = {};
    if (!config.agents.defaults) config.agents.defaults = {};

    // Handle both string and object model formats
    const currentModel = config.agents.defaults.model;
    if (typeof currentModel === 'object' && currentModel !== null) {
      config.agents.defaults.model.primary = model;
    } else {
      config.agents.defaults.model = model;
    }

    // Also update the main agent entry if it exists
    if (config.agents.list) {
      const mainIdx = config.agents.list.findIndex((a: { id: string }) => a.id === 'main');
      if (mainIdx >= 0) {
        config.agents.list[mainIdx].model = model;
      }
    }

    // Ensure the model is in the models registry
    if (!config.agents.defaults.models) config.agents.defaults.models = {};
    if (!config.agents.defaults.models[model]) {
      config.agents.defaults.models[model] = {};
    }

    // Write back
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');

    // Restart gateway
    const restartResult = await new Promise<string>((resolve) => {
      exec('openclaw gateway restart', { timeout: 15000 }, (error, stdout, stderr) => {
        if (error) {
          resolve(`error: ${error.message}`);
        } else {
          resolve(stdout || stderr || 'restarted');
        }
      });
    });

    return NextResponse.json({
      success: true,
      model,
      restart: restartResult.trim(),
    });
  } catch (err) {
    console.error('Failed to update model:', err);
    return NextResponse.json({ error: 'Failed to update model config' }, { status: 500 });
  }
}
