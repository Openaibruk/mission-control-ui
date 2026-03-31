# 🚨 MISSION CONTROL DEPLOYMENT PROTOCOL
**CRITICAL — NEVER VIOLATE THESE RULES**

## ROOT CAUSE (March 31, 2026)
Antigravity agent did an "App Router refactor" that deleted `src/app/page.tsx` — the main dashboard entry point. The Kanban board went completely blank because the entire frontend vanished. This wasted 3+ hours of debugging.

## WHAT `03714d8` IS
Commit `03714d8` is the **last known working state** of the Mission Control dashboard. It is the **ONLY** approved version. Any changes to the dashboard must be built ON TOP OF this commit.

## STRUCTURE
```
/home/ubuntu/.openclaw/workspace/
├── src/                    # ← Next.js dashboard code (VERCEL CARES ABOUT THIS)
│   ├── app/                # ← App Router pages
│   │   ├── page.tsx        # *** NEVER DELETE THIS ***
│   │   ├── agents/
│   │   ├── projects/
│   │   └── (dashboard)/    # ← Nested routes
│   ├── components/         # ← React components
│   ├── hooks/              # ← Supabase, theme hooks
│   └── lib/                # ← Types, utils
├── skills/                 # ← OpenClaw agent skills (IGNORED BY VERCEL)
├── deliverables/           # ← Generated docs, PPTX, etc (IGNORED BY VERCEL)
├── apps/                   # ← Other apps (IGNORED BY VERCEL)
├── .clawhub/               # ← ClawHub cache (IGNORED BY VERCEL)
└── memory/, scripts/, etc. # ← OpenClaw workspace (IGNORED BY VERCEL)
```

## 🔒 GOLDEN RULES

### 1. NEVER DELETE `src/app/page.tsx`
This is the main dashboard entry point. If removed, the entire Kanban board goes blank.

### 2. NEVER TOUCH `skills/`, `deliverables/`, `apps/`, `.clawhub/`
These are OpenClaw workspace files. They are NOT part of the Next.js dashboard and MUST NOT be edited by any AI coding agent (Antigravity, Codex, etc.).

### 3. BEFORE ANY AGENT PUSHES TO `main`:
- **Check that `src/app/page.tsx` still exists**
- **Verify build passes locally**: `cd /workspace && npm run build`
- **Push to a feature branch first**, NOT directly to `main`
- **Wait for Vercel build to succeed** before marking task as done

### 4. AFTER ANY PUSH TO `main`:
- **Verify Vercel builds successfully** — check `/tmp/vercel-build.log`
- **Check dashboard is not empty** — query Supabase: `projects > 0` AND `tasks > 0`
- **If build fails, IMMEDIATELY revert**: `git reset --hard 03714d8 && git push --force`

### 5. TSCONFIG.SCOPE FIX
The `tsconfig.json` MUST exclude workspace directories:
```json
"exclude": ["node_modules", "skills", "deliverables", "apps", ".clawhub", "scripts", "chipchip", "exploration"]
```
Without this, Next.js will try to compile agent skills and fail.

## AUTOMATED SAFEGUARDS

### Cron: board-safety-check (every 30 min)
Checks if the dashboard is returning data from Supabase. If projects == 0 or tasks == 0, alerts Bruk immediately.

### Pre-push Hook Concept
Before `git push origin main`:
1. Verify `src/app/page.tsx` exists
2. Verify `tsconfig.json` has the exclude list
3. Verify build passes

## AGENT INSTRUCTIONS (FOR ANTIgravity, CODEX, ETC.)
When working on the Mission Control UI:

```
CRITICAL SAFETY RULES:
1. NEVER delete src/app/page.tsx - it's the main dashboard entry point
2. ONLY modify files under src/ - never touch skills/, deliverables/, apps/
3. Work on a feature branch, NOT main directly
4. Run `npm run build` before pushing
5. After push, verify Vercel build succeeds
6. If in doubt, ask Bruk before pushing to main

The last known working version of src/app/page.tsx is at git commit 03714d8.
```

## RECOVERY CHECKLIST (when dashboard breaks)
1. `cd /home/ubuntu/.openclaw/workspace`
2. `git reset --hard 03714d8`
3. `git push origin main --force`
4. `vercel deploy --prod --yes`
5. Verify dashboard loads with data

---

**Last Updated:** 2026-03-31  
**Trigger:** Antigravity App Router refactor deleted page.tsx, broke entire dashboard
