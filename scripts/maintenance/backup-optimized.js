#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const backupName = `openclaw-workspace-optimized-${timestamp}.tar.gz`;
const workspaceRoot = '/home/ubuntu/.openclaw/workspace';

// Aggressive exclude list
const excludes = [
  'node_modules',
  '.next',
  '.git',
  'logs',
  'coverage',
  '.cache',
  'dist',
  'build',
  'tmp',
  'temp',
  '*.log',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  '.DS_Store',
  '.env.local',
  'vercel.json',
  'paperclip-server', // already removed, but just in case
  'openclaw-office'   // already removed
];

const tarArgs = ['czf', `/tmp/${backupName}`];
for (const pat of excludes) {
  tarArgs.push('--exclude', pat);
}
tarArgs.push('.');

console.log('Creating final optimized backup...');
process.chdir(workspaceRoot);
execSync(`tar ${tarArgs.join(' ')}`, { stdio: 'inherit' });

const stats = fs.statSync(`/tmp/${backupName}`);
console.log(`Backup created: ${backupName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

// Upload
console.log('Uploading to Google Drive...');
const uploadCmd = `gws drive +upload /tmp/${backupName}`;
const result = execSync(uploadCmd, { encoding: 'utf-8' });
console.log(result);

// Cleanup
fs.unlinkSync(`/tmp/${backupName}`);
console.log('Done.');
