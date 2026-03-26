---
name: active-maintenance
description: Automated system health checks, memory/log cleanup, and disk maintenance for OpenClaw. Use when asked to clean logs, check disk usage, optimize memory files, or run maintenance. Also triggered automatically via cron.
metadata: {"openclaw":{"emoji":"🧹","always":true}}
---

# Active Maintenance

System health and memory maintenance for OpenClaw.

## Commands

```bash
# Full maintenance
node {baseDir}/scripts/maintain.js

# Dry run (check only)
node {baseDir}/scripts/maintain.js --dry-run
```

## What It Does

1. **Disk Health** — Warn at >80%, critical at >95%
2. **Log Cleanup** — Compress logs >7 days, remove >30 days
3. **Memory Metabolism** — Archive daily logs >14 days, flag large MEMORY.md
4. **Build Cache** — Clear stale .next/cache and .tsbuildinfo files
5. **Report** — Saves to `memory/maintenance-YYYY-MM-DD.md`
