# Scripts

Utility scripts for OpenClaw workspace automation. Organized by category.

## Maintenance

| Script | Purpose | Usage |
|--------|---------|-------|
| `backup-workspace.js` | Create a full workspace backup (tarball) and upload to Drive | `node scripts/maintenance/backup-workspace.js` |
| `backup-optimized.js` | Create an optimized backup excluding large dirs | `node scripts/maintenance/backup-optimized.js` |
| `workspace-scanner.js` | Scan filesystem and output graph-data.json for analysis | `node scripts/maintenance/workspace-scanner.js` |
| `check-storage.js` | Check disk usage; log warnings if low | `node scripts/maintenance/check-storage.js` |
| `update-heartbeat.js` | Update HEARTBEAT.md or perform heartbeat tasks | `node scripts/maintenance/update-heartbeat.js` |
| `archive-memory.sh` | Archive old memory files to `memory/archive/` | `bash scripts/maintenance/archive-memory.sh` |
| `gateway-status-scanner.sh` | Scan OpenClaw gateway status | `bash scripts/maintenance/gateway-status-scanner.sh` |

## Supabase

| Script | Purpose | Usage |
|--------|---------|-------|
| `create-news-table.js` | Create the `news` table in Supabase (standard) | `node scripts/supabase/create-news-table.js` |
| `create-news-table-direct.js` | Create news table using direct connection | `node scripts/supabase/create-news-table-direct.js` |
| `create-news-table-ipv4.js` | Create news table using IPv4 connection | `node scripts/supabase/create-news-table-ipv4.js` |
| `create-delivery-approval.js` | Create approval tasks for delivery fee rollout | `node scripts/supabase/create-delivery-approval.js` |
| `create-delivery-approval-fixed.js` | Fixed version of delivery approval creation | `node scripts/supabase/create-delivery-approval-fixed.js` |
| `query-feedback.js` | Query feedback records from Supabase | `node scripts/supabase/query-feedback.js` |
| `query-projects.js` | Query projects from Supabase | `node scripts/supabase/query-projects.js` |
| `query_agents.js` | Query agents from Supabase | `node scripts/supabase/query_agents.js` |

## Deploy

| Script | Purpose | Usage |
|--------|---------|-------|
| `ensure-projects.js` | Ensure required Supabase projects exist | `node scripts/deploy/ensure-projects.js` |
| `create-recruiter-project.js` | Create HR Recruiter agent project | `node scripts/deploy/create-recruiter-project.js` |
| `create-zarely-project.js` | Create Zarely automation project | `node scripts/deploy/create-zarely-project.js` |

## Fixes (One‑off)

| Script | Purpose | Usage |
|--------|---------|-------|
| `fix-approval-output.js` | Fix approval output formatting | `node scripts/fixes/fix-approval-output.js` |
| `fix-hr-tasks.js` | Fix HR-related tasks | `node scripts/fixes/fix-hr-tasks.js` |
| `fix-kanban.js` | Fix Kanban board issues | `node scripts/fixes/fix-kanban.js` |
| `fix-news-snapshot.js` | Fix B2B news snapshot data | `node scripts/fixes/fix-news-snapshot.js` |
| `fix-outputs.js` | Fix task output links | `node scripts/fixes/fix-outputs.js` |
| `fix-tailwind-config.js` | Fix Tailwind configuration | `node scripts/fixes/fix-tailwind-config.js` |
| `fix-zarely-project.js` | Fix Zarely project setup | `node scripts/fixes/fix-zarely-project.js` |
| `fix-zindex.js` | Fix z-index conflicts | `node scripts/fixes/fix-zindex.js` |
| `finish-all-in-progress.js` | Mark all in-progress tasks as complete | `node scripts/fixes/finish-all-in-progress.js` |
| `finish-delivery-tasks.js` | Complete delivery-related tasks | `node scripts/fixes/finish-delivery-tasks.js` |
| `finish-zarely.js` | Complete Zarely project tasks | `node scripts/fixes/finish-zarely.js` |

## Utilities

| Script | Purpose | Usage |
|--------|---------|-------|
| `add-model.js` | Add a model to configuration | `node scripts/add-model.js` |
| `assign-delivery-b.js` | Assign delivery tasks to agent B | `node scripts/assign-delivery-b.js` |
| `assign-tasks.js` | Assign tasks to agents based on rules | `node scripts/assign-tasks.js` |
| `fetch_tasks.js` | Fetch tasks from Supabase | `node scripts/fetch_tasks.js` |
| `get-share-links.js` | Generate shareable links for files | `node scripts/get-share-links.js` |
| `lovable-builder.js` | Build Lovable.dev integration | `node scripts/lovable-builder.js` |
| `test-ethiopian.js` | Test Ethiopian calendar calculations | `node scripts/test-ethiopian.js` |
| `zarely-blog-automation.js` | Automate Zarely blog posting | `node scripts/zarely-blog-automation.js` |
| `zarely-shopify-dashboard.js` | Generate Zarely Shopify dashboard | `node scripts/zarely-shopify-dashboard.js` |
| `create-bucket.js` | Create a Supabase storage bucket | `node scripts/create-bucket.js` |
