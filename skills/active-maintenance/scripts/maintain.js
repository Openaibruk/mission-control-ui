#!/usr/bin/env node
// Active Maintenance — runs disk checks, log cleanup, memory dedup
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/home/ubuntu/.openclaw/workspace';
const OPENCLAW_DIR = '/home/ubuntu/.openclaw';
const DRY_RUN = process.argv.includes('--dry-run');
const report = [];

function log(msg) { report.push(`[${new Date().toISOString()}] ${msg}`); console.log(msg); }

function run(cmd, opts = {}) {
  try { return execSync(cmd, { encoding: 'utf8', timeout: 30000, ...opts }).trim(); }
  catch (e) { return `ERROR: ${e.message}`; }
}

// 1. Disk Health
function checkDisk() {
  log('=== Disk Health ===');
  const df = run("df -h / /home 2>/dev/null || df -h /");
  df.split('\n').forEach(line => log(`  ${line}`));
  const usage = run("df / | tail -1 | awk '{print $5}' | tr -d '%'");
  const pct = parseInt(usage);
  if (pct > 95) log(`  ⚠️  CRITICAL: Disk usage at ${pct}%`);
  else if (pct > 80) log(`  ⚠️  WARNING: Disk usage at ${pct}%`);
  else log(`  ✅ Disk usage OK at ${pct}%`);
}

// 2. Log Cleanup
function cleanLogs() {
  log('=== Log Cleanup ===');
  const logDir = path.join(OPENCLAW_DIR, 'logs');
  if (!fs.existsSync(logDir)) { log('  No logs directory'); return; }
  
  // Find and compress old logs
  const now = Date.now();
  let compressed = 0, removed = 0;
  
  fs.readdirSync(logDir).forEach(file => {
    const fp = path.join(logDir, file);
    const stat = fs.statSync(fp);
    const ageDays = (now - stat.mtimeMs) / 86400000;
    
    if (file.endsWith('.log') && ageDays > 7 && !DRY_RUN) {
      run(`gzip "${fp}"`); compressed++;
    }
    if ((file.endsWith('.log.gz') || file.endsWith('.log')) && ageDays > 30 && !DRY_RUN) {
      fs.unlinkSync(fp); removed++;
    }
  });
  
  log(`  Compressed: ${compressed}, Removed: ${removed}`);
}

// 3. Build Cache Cleanup
function cleanBuildCache() {
  log('=== Build Cache ===');
  const nextCache = path.join(WORKSPACE, 'mission-control-ui/.next/cache');
  if (fs.existsSync(nextCache)) {
    const size = run(`du -sh "${nextCache}" 2>/dev/null | cut -f1`);
    log(`  Next.js cache: ${size}`);
    if (!DRY_RUN) {
      run(`find "${nextCache}" -type f -mtime +7 -delete 2>/dev/null`);
      log('  Cleaned files older than 7 days');
    }
  }
  
  // Stale .tsbuildinfo
  run(`find "${WORKSPACE}" -name "*.tsbuildinfo" -mtime +14 -delete 2>/dev/null`);
  log('  Cleaned stale .tsbuildinfo files');
}

// 4. Memory Metabolism — dedup and archive
function memoryMaintenance() {
  log('=== Memory Metabolism ===');
  const memDir = path.join(WORKSPACE, 'memory');
  if (!fs.existsSync(memDir)) { log('  No memory directory'); return; }
  
  const files = fs.readdirSync(memDir);
  const dailyFiles = files.filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/));
  const now = Date.now();
  
  // Archive daily logs older than 14 days
  let archived = 0;
  const archiveDir = path.join(memDir, 'archive');
  
  dailyFiles.forEach(file => {
    const dateStr = file.replace('.md', '');
    const fileDate = new Date(dateStr);
    const ageDays = (now - fileDate.getTime()) / 86400000;
    
    if (ageDays > 14) {
      if (!DRY_RUN) {
        if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
        fs.renameSync(path.join(memDir, file), path.join(archiveDir, file));
      }
      archived++;
    }
  });
  
  log(`  Archived: ${archived} old daily logs`);
  
  // Check MEMORY.md size
  const memPath = path.join(WORKSPACE, 'MEMORY.md');
  if (fs.existsSync(memPath)) {
    const size = fs.statSync(memPath).size;
    log(`  MEMORY.md: ${(size / 1024).toFixed(1)} KB`);
    if (size > 50000) log('  ⚠️  MEMORY.md is large — consider trimming');
  }
}

// 5. Write report
function writeReport() {
  const date = new Date().toISOString().split('T')[0];
  const reportPath = path.join(WORKSPACE, `memory/maintenance-${date}.md`);
  const content = `# Maintenance Report — ${date}\n\n${report.join('\n')}\n`;
  
  if (!DRY_RUN) {
    fs.writeFileSync(reportPath, content);
    log(`\nReport saved to memory/maintenance-${date}.md`);
  }
}

// Run all
log(`Active Maintenance ${DRY_RUN ? '(DRY RUN)' : ''} — ${new Date().toISOString()}`);
checkDisk();
cleanLogs();
cleanBuildCache();
memoryMaintenance();
writeReport();
log('\n✅ Maintenance complete');
