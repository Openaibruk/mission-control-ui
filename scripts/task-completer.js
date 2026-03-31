#!/usr/bin/env node

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env' });
import OpenAI from 'openai';
import { execSync } from 'child_process';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const openRouterKey = process.env.OPENROUTER_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}
if (!openRouterKey) {
  console.error('OPENROUTER_API_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: openRouterKey,
});

async function getTask(id) {
  const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

function selectModel(task) {
  const title = (task.title || '').toLowerCase();
  const desc = (task.description || '').toLowerCase();
  const type = (task.type || '').toLowerCase();
  const combined = `${title} ${desc} ${type}`;

  // Video tasks: try paid model first, fallback to step-3.5-flash
  if (combined.includes('video') || combined.includes('spec') && combined.includes('video')) {
    // Attempt to use bytedance/seedance-1-5-pro; if it fails (e.g., 402/403), fallback.
    return { primary: 'bytedance/seedance-1-5-pro', fallback: 'qwen/qwen3-coder:free' };
  }

  // Code/architecture tasks
  if (combined.includes('code') || combined.includes('architect') || combined.includes('api') || combined.includes('backend') || combined.includes('frontend') || type === 'code') {
    return { primary: 'qwen/qwen3-coder:free', fallback: 'openrouter/free' };
  }

  // Documentation/strategy/marketing/emergency SOPs: use a high-context free model
  if (combined.includes('documentation') || combined.includes('strategy') || combined.includes('plan') || combined.includes('marketing') || combined.includes('sop') || combined.includes('emergency')) {
    return { primary: 'qwen/qwen3.6-plus-preview:free', fallback: 'qwen/qwen3-coder:free' };
  }

  // Default: use reliable free model
  return { primary: 'qwen/qwen3.6-plus-preview:free', fallback: 'qwen/qwen3-coder:free' };
}

async function generateDeliverable(task, modelConfig) {
  const systemPrompt = `You are a professional task completer. Given a task from a project management system, produce a high-quality deliverable in markdown format. Include necessary sections, bullet points, code blocks if relevant, and clear structure. Output only the deliverable content, no extra commentary.`;

  const userPrompt = `Task Title: ${task.title}\nTask Description: ${task.description || 'No description provided.'}\nTask Type: ${task.type || 'general'}\n\nPlease create the appropriate deliverable.`;

  let model = modelConfig.primary;
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });
    return completion.choices[0].message.content;
  } catch (err) {
    if (modelConfig.fallback && (err.status === 401 || err.status === 402 || err.status === 403 || err.status === 400 || err.message?.includes('model') || err.message?.includes('not found'))) {
      console.log(`Primary model ${model} failed (${err.message}), falling back to ${modelConfig.fallback}`);
      const completion = await openai.chat.completions.create({
        model: modelConfig.fallback,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
      });
      return completion.choices[0].message.content;
    }
    throw err;
  }
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
}

async function uploadToDrive(filepath, displayName) {
  // Use gws drive +upload
  const cmd = `gws drive +upload "${filepath}" --name "${displayName}"`;
  try {
    const output = execSync(cmd, { encoding: 'utf-8' }).trim();
    // Expect output like "Uploaded: <fileId>" or "File uploaded: <id>"
    return output;
  } catch (err) {
    console.error('Drive upload failed:', err.message);
    throw err;
  }
}

async function postMessage(taskId, content) {
  const { error } = await supabase.from('messages').insert({
    task_id: taskId,
    agent: 'Nova',
    content,
  });
  if (error) {
    console.warn(`Warning: Could not post message (RLS/auth issue): ${error.message}`);
  }
}

async function markTaskDone(taskId) {
  const { error } = await supabase.from('tasks').update({ status: 'done' }).eq('id', taskId);
  if (error) throw error;
}

async function main() {
  const taskId = process.argv[2];
  if (!taskId) {
    console.error('Usage: node task-completer.js <task_id>');
    process.exit(1);
  }

  try {
    // 1. Fetch task
    const task = await getTask(taskId);
    console.log(`Processing task: ${task.title} (${taskId})`);

    // 2. Select model
    const modelConfig = selectModel(task);
    console.log(`Selected model strategy: primary=${modelConfig.primary}, fallback=${modelConfig.fallback}`);

    // 3. Generate deliverable
    console.log('Generating deliverable...');
    const content = await generateDeliverable(task, modelConfig);

    // 4. Save to file
    const deliverablesDir = join(process.cwd(), 'deliverables');
    await mkdir(deliverablesDir, { recursive: true });
    const filename = sanitizeFilename(task.title) + `.md`;
    const filepath = join(deliverablesDir, `${taskId}_${filename}`);
    await writeFile(filepath, content, 'utf-8');
    console.log(`Deliverable saved to ${filepath}`);

    // 5. Upload to Drive
    console.log('Uploading to Google Drive...');
    const uploadResult = await uploadToDrive(filepath, `${task.title} - Deliverable`);
    console.log(`Upload result: ${uploadResult}`);

    // 6. Post message
    const message = `Deliverable generated and uploaded.\nFile: ${filename}\nUpload result: ${uploadResult}\n(Generated by Task Completer)`;
    await postMessage(taskId, message);
    console.log('Posted update message to task.');

    // 7. Mark task done
    await markTaskDone(taskId);
    console.log('Task marked as done.');

    console.log(`Task ${taskId} completed successfully.`);
  } catch (err) {
    console.error(`Failed to complete task ${taskId}:`, err.message);
    // Optionally log activity or post error message
    try {
      await postMessage(taskId, `Task completer encountered an error: ${err.message}`);
    } catch (e) {
      // ignore
    }
    process.exit(1);
  }
}

main();
