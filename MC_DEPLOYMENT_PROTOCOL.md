# 🚨 Mission Control Dashboard — Deployment Protocol
## Root Cause Analysis + Solutions

**Audit Date:** March 31, 2026  
**Auditor:** OpenClaw  
**Trigger:** Antigravity App Router refactor deleted `src/app/page.tsx` → Kanban board went completely blank

---

## 1. 📋 ROOT CAUSE SUMMARY

| What Happened | Why It Happened | Impact |
|---|---|---|
| **Antigravity deleted `src/app/page.tsx`** | App Router migration moved page logic to `src/app/(dashboard)/` sub-routes | **ENTIRE dashboard went blank** — all tasks/projects invisible |
| **Agent pushed directly to `main`** | No branch protection, no pre-push hooks, no CI checks | Bad code deployed instantly to Vercel |
| **Next.js scanned ALL workspace TypeScript** | `tsconfig.json` used `**/*.ts` including skills/deliverables/apps | Build failures from agent skill scripts (qs-esm, unsafeFunction, etc.) |
| **No rollback plan existed** | No tagged "known good" commit, no automated health checks | 3+ hours wasted manually debugging |
| **Vercel auto-deployed broken code** | Vercel GitHub integration triggers on ANY main push | Broken UI went live immediately |

---

## 2. 🔍 WORKSPACE AUDIT

### Current State (GOOD)
```
/home/ubuntu/.openclaw/workspace/
├── src/                    # ✅ Next.js app (only this is deployed to Vercel)
│   ├── app/                #    Page routes
│   ├── components/         #    React UI components
│   ├── hooks/              #    Supabase/theme hooks
│   └── lib/                #    Types, utils
├── skills/                 # ⚠️  OpenClaw skills (NOT part of dashboard)
├── deliverables/           # ⚠️  Generated files (NOT part of dashboard)
├── apps/                   # ⚠️  Other apps (NOT part of dashboard)
├── .clawhub/               # ⚠️  ClawHub cache (NOT part of dashboard)
├── AGENTS.md               # ⚠️  OpenClaw config (NOT part of dashboard)
├── SOUL.md, MEMORY.md, etc.# ⚠️  Agent workspace files (NOT part of dashboard)
├── .env                    # 🔒 Secrets (in .gitignore, GOOD)
└── node_modules/           # 🔒 Dependencies (in .gitignore, GOOD)
```

### Key Finding
**The workspace contains TWO separate projects that share a directory:**
1. **Mission Control UI** — Next.js dashboard (deployed to Vercel)
2. **OpenClaw Workspace** — Agent skills, memory, configs (local-only)

**This is why Antigravity broke things:** it couldn't tell the difference between dashboard files and agent files.

---

## 3. 🔧 SOLUTIONS — 3 LAYERS

### LAYER 1: GIT PROTECTION (Prevents the damage)
**Problem:** Antigravity could delete any file and push directly to `main`

**Fix — Create pre-push validation script:**
```bash
# Create: /home/ubuntu/.openclaw/workspace/scripts/pre-push-check.sh
#!/bin/bash

# 1. Verify src/app/page.tsx exists
if [ ! -f "src/app/page.tsx" ]; then
    echo "❌ FATAL: src/app/page.tsx missing! Dashboard will be blank."
    echo "    Restore with: git checkout 03714d8 -- src/app/page.tsx"
    exit 1
fi

# 2. Verify tsconfig.json has proper excludes
if ! grep -q "skills" tsconfig.json; then
    echo "❌ FATAL: tsconfig.json missing skills exclude."
    echo "    Next.js will try to compile agent skills and fail."
    exit 1
fi

# 3. Quick build test (only if --build flag)
if [ "$1" = "--build" ]; then
    echo "🔨 Running build test..."
    npm run build || exit 1
    echo "✅ Build passed!"
fi

echo "✅ Pre-push checks passed. Safe to push to main."
```

**Make it executable:**
```bash
chmod +x /home/ubuntu/.openclaw/workspace/scripts/pre-push-check.sh
```

### LAYER 2: TSCONFIG SCOPE FIX (Prevents build failures)
**Problem:** `tsconfig.json` scanned ALL TypeScript files including agent skills

**Current (FIXED):**
```json
{
  "include": [
    "next-env.d.ts",
    "src/**/*.ts",        /* Only src/ */
    "src/**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": [
    "node_modules",
    "skills/*",           /* Agent skills */
    "deliverables/*",     /* Generated files */
    "apps/*",             /* Other apps */
    ".clawhub/*",         /* ClawHub cache */
    "*.md"                /* Markdown files with TS code blocks */
  ]
}
```

### LAYER 3: VERCEL DEPLOYMENT GUARDS (Prevents bad deploys)
**Problem:** Vercel auto-deploys ANY push to main without health checks

**Fix 1: Vercell Deployment Branch**
- Change Vercel to deploy from a `production` branch, not `main`
- Main gets merged to production ONLY after verification
- This adds a buffer between code and deployment

**Fix 2: Vercel Health Check (via cron)**
```bash
# Every 15 min, verify dashboard returns data
curl -s 'https://mission-control-ui-sand.vercel.app/api/projects'
```

---

## 4. 🎯 IMMEDIATE ACTIONS COMPLETED

| Action | Status |
|--------|--------|
| ✅ Known-good commit tagged in memory (`03714d8`) | DONE |
| ✅ tsconfig.json exclude list updated | DONE |
| ✅ Pre-push check script created | DONE |
| ✅ Deployment protocol document created | DONE |
| ✅ Memory updated with deployment rules | DONE |
| ✅ Antigravity agent instructions written | DONE |

---

## 5. ⚠️ ANTI GRAVITY AGENT RULES

**When working on Mission Control UI, Antigravity MUST:**

1. **ONLY modify files under `src/`** — never touch `skills/`, `deliverables/`, `apps/`, `.clawhub/`, `.md` files at root
2. **NEVER delete `src/app/page.tsx`** — this is the main dashboard entry point
3. **Work on a feature branch** — `git checkout -b feature/antigravity-fix` then merge to main
4. **Run `npm run build` before any push** — verify it compiles successfully
5. **Check that `src/app/page.tsx` still exists** after any structural changes
6. **Ask before pushing to `main`** — say "I'm about to push X changes, should I go ahead?"

---

## 6. 🚀 FUTURE IMPROVEMENTS

### Recommended (Low Cost, High Value)
- [x] **Pre-push check script** → Created as `scripts/pre-push-check.sh`
- [x] **tsconfig scope fix** → Applied
- [ ] **Vercel deploy from `production` branch** → Safer, adds verification step
- [ ] **GitHub branch protection on `main`** → Requires PR, blocks force pushes
- [ ] **Vercel health check cron** → Alerts if dashboard goes blank

### Optional (Nice to Have)
- [ ] **Separate repos** → Dashboard in `mission-control-ui/`, workspace in separate dir
- [ ] **CI pipeline** → GitHub Actions runs `npm run build` before allowing merge
- [ ] **Playwright E2E tests** → Verify Kanban cards actually render

---

## 🎯 THE ANSWER: WHY DOES THIS KEEP HAPPENING?

**Short answer:** The workspace mixes two projects in one directory with no boundaries. Any coding agent can accidentally modify workspace files (skills, configs, generated docs) alongside dashboard code. Without pre-push checks or branch protection, mistakes deploy immediately.

**Long answer:** The `03714d8` commit is what we want. It's a working Next.js dashboard with:
- ✅ Kanban board with Supabase data binding
- ✅ Task modal with deliverable previews
- ✅ Project detail view with activity feed
- ✅ All dependencies in `package.json`
- ✅ `tsconfig.json` scoping to exclude workspace files
- ✅ `.gitignore` protecting secrets and node_modules

**The fix is simple:**
1. Protect `src/app/page.tsx` — never let agents delete it
2. Scope `tsconfig.json` — exclude workspace directories  
3. Pre-push validation — run before any commit
4. Branch protection — force PRs instead of direct pushes
5. Separate concerns — when possible, split dashboard from agent workspace

---

*Document saved. This is the canonical reference for all future dashboard work.*
