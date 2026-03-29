import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const SETTINGS_PATH = join(process.cwd(), 'workspace-settings.json');

const DEFAULT_SETTINGS = {
  apiKeys: {
    openai: '',
    anthropic: '',
    supabase: ''
  },
  workspace: {
    name: 'OpenClaw Analytics',
    timezone: 'UTC',
    retentionDays: 30
  },
  agentDefaults: {
    maxTokens: 4096,
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.'
  }
};

export async function GET() {
  try {
    const raw = await readFile(SETTINGS_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch (err) {
    // Return defaults if file doesn't exist
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await writeFile(SETTINGS_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true, settings: body });
  } catch (err) {
    console.error('Failed to update settings:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
