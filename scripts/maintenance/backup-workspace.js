#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Timestamp for the backup file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]; // YYYY-MM-DD format
const backupName = `openclaw-workspace-backup-${timestamp}.tar.gz`;

// The workspace root
const workspaceRoot = '/home/ubuntu/.openclaw/workspace';

// Exclude patterns (similar to .gitignore)
const excludePatterns = [
  'node_modules',
  '.next',
  '.git',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  '.DS_Store',
  '*.log',
  'tmp',
  'temp',
  'dist',
  'build',
  '.env.local', // may contain secrets; we can include a sanitized version later
  'vercel.json'
];

// Build tar exclude arguments
const tarArgs = ['czf', `/tmp/${backupName}`];
for (const pat of excludePatterns) {
  tarArgs.push('--exclude', pat);
}
tarArgs.push('.');

console.log('🚀 Starting workspace backup...');
console.log(`📦 Output file: ${backupName}`);

try {
  // Change to workspace directory and create tarball
  process.chdir(workspaceRoot);
  execSync(`tar ${tarArgs.join(' ')}`, { stdio: 'inherit' });
  console.log('✅ Tarball created successfully');

  // Upload to Google Drive using gws CLI
  console.log('📤 Uploading to Google Drive...');
  const uploadCmd = `gws drive +upload /tmp/${backupName}`;
  const uploadResult = execSync(uploadCmd, { encoding: 'utf-8' });
  console.log('✅ Upload completed:', uploadResult);

  // Extract Drive file ID if possible (gws might output link)
  const linkMatch = uploadResult.match(/[-\w]{25,}/);
  if (linkMatch) {
    console.log(`🔗 Drive Link: https://drive.google.com/file/d/${linkMatch[0]}/view`);
  }

  // Cleanup local tarball after successful upload
  fs.unlinkSync(`/tmp/${backupName}`);
  console.log('🗑️ Local temp file removed');

} catch (err) {
  console.error('❌ Backup failed:', err.message);
  process.exit(1);
}
