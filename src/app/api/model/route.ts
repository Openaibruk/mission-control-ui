import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { exec } from 'child_process';

export const dynamic = 'force-dynamic';

const CONFIG_PATH = '/home/ubuntu/.openclaw/openclaw.json';

export async function GET() {
  try {
    const raw = await readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(raw);
    // The primary model is at agents.defaults.model.primary
    const primary = config?.agents?.defaults?.model?.primary || 'unknown';
    // Also grab the main agent's override if it exists
    const mainAgent = config?.agents?.list?.find((a: { id: string }) => a.id === 'main');
    const mainModel = mainAgent?.model || null;
    return NextResponse.json({
      primary,
      mainAgentModel: mainModel,
      activeModel: mainModel || primary,
      fallbacks: config?.agents?.defaults?.model?.fallbacks || [],
      availableModels: Object.keys(config?.agents?.defaults?.models || {}),
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

    // Read current config
    const raw = await readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(raw);

    // Update the main agent model override and the default primary
    if (!config.agents) config.agents = {};
    if (!config.agents.defaults) config.agents.defaults = {};
    if (!config.agents.defaults.model) config.agents.defaults.model = {};
    config.agents.defaults.model.primary = model;

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
