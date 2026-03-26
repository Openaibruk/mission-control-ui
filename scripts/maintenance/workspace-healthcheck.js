#!/usr/bin/env node
/**
 * Workspace Health Check
 * Verifies essential config files exist, .env contains required keys, and no secrets in .md files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = '/home/ubuntu/.openclaw/workspace';

let errors = 0;
let warnings = 0;

function checkFile(file, description) {
  const full = path.join(ROOT, file);
  if (fs.existsSync(full)) {
    console.log(`✅ ${description}: exists`);
  } else {
    console.error(`❌ ${description}: missing (${file})`);
    errors++;
  }
}

function checkEnvKeys(keys) {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file missing');
    errors++;
    return;
  }
  const content = fs.readFileSync(envPath, 'utf8');
  keys.forEach(key => {
    if (content.includes(key)) {
      console.log(`✅ .env contains ${key}`);
    } else {
      console.warn(`⚠️ .env missing ${key}`);
      warnings++;
    }
  });
}

function checkNoSecretsInMarkdown() {
  const secretPattern = /ghp_|sk-|eyJ[a-zA-Z0-9_-]{20,}|Bearer\s+[A-Za-z0-9_\-\.]+/i;
  let found = false;
  // Walk through all .md files in workspace (excluding node_modules, archive, etc.)
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', '.git', 'archive', 'data', 'logs', 'memory/archive'].includes(entry.name)) continue;
        walk(full);
      } else if (entry.name.endsWith('.md')) {
        const text = fs.readFileSync(full, 'utf8');
        const matches = text.match(secretPattern);
        if (matches) {
          console.error(`❌ Secrets found in ${full}: ${matches.join(', ')}`);
          found = true;
          errors++;
        }
      }
    }
  };
  walk(ROOT);
  if (!found) console.log('✅ No common secret patterns in .md files');
}

console.log('🔎 Workspace Health Check\n');
console.log('1. Core files:');
checkFile('.gitignore', '.gitignore');
checkFile('package.json', 'package.json');
checkFile('pnpm-workspace.yaml', 'pnpm-workspace.yaml');
checkFile('AGENTS.md', 'AGENTS.md');
checkFile('HEARTBEAT.md', 'HEARTBEAT.md');

console.log('\n2. .env required keys:');
checkEnvKeys(['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'GITHUB_TOKEN', 'OPENROUTER_API_KEY']);

console.log('\n3. Secret scan in markdown files:');
checkNoSecretsInMarkdown();

console.log('\n✅ Health check complete');
if (errors > 0) process.exit(1);
