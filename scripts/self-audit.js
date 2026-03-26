#!/usr/bin/env node
/**
 * Self-Audit Heartbeat
 * Lightweight alternative to capability-evolver — no external deps.
 * Scans logs, tasks, disk, and memory for issues. Reports findings.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = process.env.HOME + '/.openclaw/workspace';
const LOG_DIR = '/tmp/openclaw';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

// Colors
const R = '\x1b[0m';
const Y = '\x1b[33m';
const G = '\x1b[32m';
const RED = '\x1b[31m';

const findings = [];
const add = (severity, category, msg) => findings.push({ severity, category, msg });

// ── 1. Log Error Scan ──────────────────────────────────────────────
function scanLogs() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const logFile = path.join(LOG_DIR, `openclaw-${today}.log`);
    if (!fs.existsSync(logFile)) return;

    const lines = fs.readFileSync(logFile, 'utf8').split('\n').slice(-500); // last 500 lines
    const errors = lines.filter(l => l.includes('ERROR') || l.includes('error') || l.includes('fatal'));
    const warnings = lines.filter(l => l.includes('WARN'));

    // Deduplicate error patterns
    const errorPatterns = {};
    errors.forEach(e => {
      const key = e.replace(/\d+/g, 'N').slice(0, 80);
      errorPatterns[key] = (errorPatterns[key] || 0) + 1;
    });

    const topErrors = Object.entries(errorPatterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (topErrors.length > 0) {
      topErrors.forEach(([pattern, count]) => {
        add('warning', 'logs', `Error (${count}x): ${pattern}`);
      });
    }

    if (warnings.length > 20) {
      add('info', 'logs', `${warnings.length} warnings in today's log`);
    }
  } catch (e) {
    add('error', 'audit', `Log scan failed: ${e.message}`);
  }
}

// ── 2. Disk Space Check ────────────────────────────────────────────
function checkDisk() {
  try {
    const df = execSync("df -h / | tail -1", { timeout: 5000 }).toString().trim();
    const parts = df.split(/\s+/);
    const usage = parseInt(parts[4]);
    const avail = parts[3];

    if (usage >= 95) add('critical', 'disk', `Disk at ${usage}%! Only ${avail} free.`);
    else if (usage >= 85) add('warning', 'disk', `Disk at ${usage}%, ${avail} free.`);
    else add('ok', 'disk', `Disk at ${usage}%, ${avail} free.`);
  } catch (e) {
    add('error', 'audit', `Disk check failed: ${e.message}`);
  }
}

// ── 3. Memory Files Check ──────────────────────────────────────────
function checkMemory() {
  try {
    const memDir = path.join(WORKSPACE, 'memory');
    if (!fs.existsSync(memDir)) {
      add('warning', 'memory', 'No memory/ directory found');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const todayFile = path.join(memDir, `${today}.md`);
    if (!fs.existsSync(todayFile)) {
      add('info', 'memory', `No memory log for today (${today})`);
    }

    const files = fs.readdirSync(memDir).filter(f => f.endsWith('.md'));
    add('ok', 'memory', `${files.length} memory files`);
  } catch (e) {
    add('error', 'audit', `Memory check failed: ${e.message}`);
  }
}

// ── 4. Workspace Health ────────────────────────────────────────────
function checkWorkspace() {
  try {
    // Check for large files
    const du = execSync(`du -sh ${WORKSPACE}/* 2>/dev/null | sort -rh | head -5`, { timeout: 10000 }).toString();
    const topItems = du.trim().split('\n');
    topItems.forEach(line => {
      const [size, name] = line.split('\t');
      if (size && (size.includes('G') || (size.includes('M') && parseInt(size) > 500))) {
        add('info', 'workspace', `Large: ${path.basename(name)} (${size})`);
      }
    });

    // Check for stale temp files
    const tmpZips = execSync("find /tmp -name '*.zip' -mtime +1 2>/dev/null | head -5", { timeout: 5000 }).toString().trim();
    if (tmpZips) {
      add('info', 'cleanup', `Old temp files found:\n${tmpZips}`);
    }
  } catch (e) {
    add('error', 'audit', `Workspace check failed: ${e.message}`);
  }
}

// ── 5. Agent/Process Check ─────────────────────────────────────────
function checkProcesses() {
  try {
    // Check if OpenClaw gateway is running
    const gw = execSync("pgrep -f 'openclaw.*gateway' | head -1", { timeout: 5000 }).toString().trim();
    if (gw) {
      add('ok', 'gateway', `Gateway running (pid ${gw})`);
    } else {
      add('critical', 'gateway', 'Gateway not running!');
    }

    // Check if Vercel CLI is available
    try {
      execSync("which vercel", { timeout: 3000 });
      add('ok', 'tools', 'Vercel CLI available');
    } catch {
      add('info', 'tools', 'Vercel CLI not in PATH');
    }
  } catch (e) {
    add('error', 'audit', `Process check failed: ${e.message}`);
  }
}

// ── Run All Checks ─────────────────────────────────────────────────
console.log('\n🔍 Self-Audit Heartbeat\n' + '─'.repeat(40));

scanLogs();
checkDisk();
checkMemory();
checkWorkspace();
checkProcesses();

// ── Report ─────────────────────────────────────────────────────────
const critical = findings.filter(f => f.severity === 'critical');
const warnings = findings.filter(f => f.severity === 'warning');
const errors = findings.filter(f => f.severity === 'error');
const ok = findings.filter(f => f.severity === 'ok');
const info = findings.filter(f => f.severity === 'info');

ok.forEach(f => console.log(`  ${G}✓${R} [${f.category}] ${f.msg}`));
info.forEach(f => console.log(`  ℹ ${f.category}: ${f.msg}`));
warnings.forEach(f => console.log(`  ${Y}⚠${R} [${f.category}] ${f.msg}`));
errors.forEach(f => console.log(`  ${RED}✗${R} [${f.category}] ${f.msg}`));
critical.forEach(f => console.log(`  ${RED}🚨 CRITICAL${R} [${f.category}] ${f.msg}`));

console.log('─'.repeat(40));
console.log(`Total: ${findings.length} findings (${critical.length} critical, ${warnings.length} warnings, ${ok.length} ok)`);

// Exit with error if critical issues
if (critical.length > 0) process.exit(1);
