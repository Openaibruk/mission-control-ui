# Mission Control Dashboard — Comprehensive Audit Report

**Date:** 2026-03-31  
**Auditor:** mc-audit subagent  
**Scope:** All API routes, UI components, unfinished features, Vercel build risks

---

## TABLE OF CONTENTS

1. [API Routes Audit](#1-api-routes-audit)
2. [Broken UI Components](#2-broken-ui-components)
3. [Unfinished Features](#3-unfinished-features)
4. [Vercel Build Risks](#4-vercel-build-risks)
5. [Summary by Severity](#5-summary-by-severity)

---

## 1. API ROUTES AUDIT

**Total routes found:** 24 route files across 22 endpoints

### 1.1 Critical: Hardcoded Filesystem Paths — Will Crash on Vercel

| Route | File | Issue | Severity |
|-------|------|-------|----------|
| `GET /api/model` | `src/app/api/model/route.ts` | **CRITICAL** — Reads `/home/ubuntu/.openclaw/openclaw.json` and runs `exec('openclaw gateway restart')`. On Vercel, the config read gracefully falls back to env vars, but `POST` tries to write to the same path AND exec a shell command — **shell execution is prohibited on Vercel serverless**. | **CRITICAL** |
| `GET/POST/PUT/DELETE /api/workspace` | `src/app/api/workspace/route.ts` | Uses `fs.readFileSync`, `fs.writeFileSync`, `fs.rmSync` directly on filesystem paths. Checks for `/home/ubuntu/.openclaw/workspace` existence and falls back to `process.cwd()`. On Vercel, `process.cwd()` is the serverless function temp directory — writes are **ephemeral and lost** between invocations. | **CRITICAL** |
| `GET/POST /api/files` + `POST /api/files/save` | `src/app/api/files/route.ts` + `save/route.ts` | Same hardcoded VPS path + process.cwd() fallback. Files are read from and written to temporary Vercel filesystem — **not persistent** and likely to 404 on cold starts. | **CRITICAL** |
| `GET /api/deliverables` | `src/app/api/deliverables/route.ts` | Hardcoded `DELIVERABLES_DIR = '/home/ubuntu/.openclaw/workspace/deliverables'`. Uses `require('fs')` dynamically inside a function (line 53). On Vercel, directory doesn't exist, catch returns empty files array. **Non-functional on deploy.** | **CRITICAL** |
| `GET/POST /api/workspace/search` | `src/app/api/workspace/search/route.ts` | Recursively walks entire filesystem from `WORKSPACE_ROOT`. On Vercel, walks the serverless sandbox — **slow, unpredictable, and may hit size/time limits.** | **CRITICAL** |
| `GET/POST/PUT/DELETE /api/settings` | `src/app/api/settings/route.ts` | Reads/writes `workspace-settings.json` at `process.cwd()`. Same ephemerality problem — settings **won't persist** on Vercel. | **HIGH** |

### 1.2 High: Broken or Missing Error Handling

| Route | Issue | Severity |
|-------|-------|----------|
| `POST /api/hyperlearn/browse` | Missing `try/catch` around the `request.json()` call at the very start. If the request body is malformed JSON, the route **crashes with an unhandled exception** instead of a proper error response. Also, the stream error handler catches errors but never returns a proper HTTP error response — just sends a stream event. Client may hang if stream closes unexpectedly. | **HIGH** |
| `POST /api/hyperlearn/generate-skills` | Proper try/catch, but **no validation** on request body before calling `generateSkillTree()`. If topic/extractedContent contain malicious content, it flows directly into the LLM call. | **MEDIUM** |
| `POST /api/news-fetch` | Uses `exec()` with string interpolation to run a giant inline Node.js script. If anything in the script fails, it's caught but the error handling **doesn't sanitize** stderr/stdout in the response. | **HIGH** |
| `POST /api/feedback-autopilot` | No input validation (it takes no request body, always uses DB state). If the Supabase feedback table doesn't exist, the error is properly caught. However, `analyzeFeedback` and `generateTasks` are **synchronous functions that do no I/O** — fine, but fragile if extended. | **LOW** |
| `PATCH /api/feedback/[id]` | Extracts ID via `url.pathname.split('/').pop()` — fragile. If URL has trailing slash or query params in wrong format, could return wrong ID. Should use `request.nextUrl.pathname` or extract more carefully. | **MEDIUM** |

### 1.3 High: Hardcoded Credentials / Insecure Defaults

| Route | Issue | Severity |
|-------|-------|----------|
| `POST /api/chat` | Falls back to placeholder JWT key: `"eyJhbGciOiJIUzI5...placeholder"` and `https://placeholder.supabase.co`. If Supabase env vars are **not set on Vercel**, it creates a client with **invalid credentials** — requests silently fail when trying to insert into Supabase tables. The streaming response then proceeds with `handleMessage()`, which also tries to write to Supabase. | **HIGH** |
| `POST /api/agent-trigger` | Same placeholder Supabase fallback. Creates an `internal` supabase client instance inside `POST()` instead of module-level (inconsistent with other routes). | **MEDIUM** |
| `GET/POST /api/feedback` + `PATCH /api/feedback/[id]` | Same placeholder Supabase fallback. The anonymous key is hardcoded as a JWT-look-alike string — **misleading** but not an actual secret. Still, the placeholder Supabase URL is a real project URL (`vgrdeznxllkdolvrhlnm.supabase.co`). | **HIGH** |
| `POST /api/feedback-autopilot` | Same placeholder Supabase fallback. Same hardcoded Supabase URL. | **HIGH** |
| `POST /api/news-fetch` | Contains a hardcoded **Brave Search API key**: `'BSAgN2ie_9kisOq8GPFWMmL-MruZnS5'` embedded inside the inline script string. This is **leaked in source control**. | **CRITICAL** |

### 1.4 Medium: Shell Execution in Serverless

| Route | Issue | Severity |
|-------|-------|----------|
| `POST /api/model` | Runs `exec('openclaw gateway restart')` — this binary won't exist on Vercel, will timeout (15s), consume serverless compute time unnecessarily, and return an error. | **HIGH** |
| `POST /api/news-fetch` | Runs an entire Node.js script inline via `exec('node -e ...')`. Vercel serverless has a **10-minute timeout per invocation**, but script timeout is 30s. This is fragile, slow, and burns compute. Should be a cron job or separate API call to Brave. | **HIGH** |

### 1.5 Low: Minor Issues

| Route | Issue | Severity |
|-------|-------|----------|
| `GET /api/news` | **Returns fabricated/mock news** — always generates the same 5 hardcoded stories with today's date. Not pulling from any real source. The `/api/news-fetch` route exists to fetch real news but this route ignores it entirely. | **LOW** (functionally a stub) |
| `GET /api/token-costs` | Returns 404 if data file hasn't been generated yet. This is acceptable behavior, but the route has no `dynamic = 'force-dynamic'` config — Next.js may cache this incorrectly. | **LOW** |
| `GET /api/gateway-live` | Reads from `public/api/gateway-status.json` — depends on an external process to populate this file. Graceful fallback to "unknown" status exists. | **LOW** |
| `GET /api/gateway-status` | **Hardcoded** `GATEWAY_URL = 'http://localhost:3114'` — on Vercel, there's no local gateway. Returns `{connected: false, status: 'offline'}` gracefully. Should be configurable via env var. | **MEDIUM** |

---

## 2. BROKEN UI COMPONENTS

### 2.1 page.tsx (Main App) — `src/app/page.tsx`

**Issue: Missing import for `ApprovalsView`**  
- `ApprovalsView` is used in the render tree (line ~245: `{view === 'approvals' && <ApprovalsView .../>`) but the import is at the **bottom of the file** after `export default function MC()`.  
- **Impact:** This is actually valid with hoisting — the `import` statement is module-scoped and will be hoisted by the JS engine, so it works. However, this is **bad practice** and could confuse tooling or cause issues with bundlers that don't hoist.
- **Severity:** **LOW** (works, but fragile)

**Issue: `WorkflowView` defined but never used**  
- `WorkflowView` function is defined at the bottom of the file but never referenced in any render. The text says "Workflow automation coming soon."
- **Severity:** **LOW** (dead code)

**Issue: Inline CSS class `"bg-white text-black font-sans"` when `activeDomain === 'ChipChip'`**  
- This overrides the theme system with hardcoded light-mode styles, potentially clashing with dark theme.
- **Severity:** **LOW** (cosmetic)

### 2.2 ProjectDetailView.tsx — `src/components/views/ProjectDetailView.tsx`

**Issue: "Last Updated" shows `project.created_at` instead of `project.updated_at`**  
```tsx
<span>{timeAgo(project.created_at)}</span>  // Should be project.updated_at
```
- This is a bug — the Last Updated field shows the creation time.
- **Severity:** **LOW** (cosmetic bug)

**Issue: Deliverables fetch has no error handling for JSON parse**  
```tsx
fetch(`/api/deliverables?project=${...}`)
  .then(res => res.json())  // Could fail if response is not JSON
  .then(data => { if (data.files) ... })
  .catch(() => setLoadingDeliverables(false))
```
- If the API returns HTML (error page), `res.json()` throws — caught by `.catch()`, but the error is swallowed silently.
- **Severity:** **LOW**

**Issue: Deliverables are never injected with `project` name for list view**  
- The `DeliverableItem` interface includes `project` and `status` fields, but the API response from `/api/deliverables` does not return these fields. This creates a type mismatch.
- **Severity:** **LOW**

### 2.3 FilesView.tsx — `src/components/views/FilesView.tsx`

**Status: Mostly solid.** Good error handling for file preview loading, download, and file list fetch.

**Issue: Deliverables view state is initialized but the UI to toggle `showDeliverablesView` is never rendered**  
- The component has state for `showDeliverablesView`, `deliverables`, `loadingDeliverables`, but there's no UI button/section that actually renders these.
- **Severity:** **MEDIUM** (unfinished feature — dead state)

### 2.4 TaskModal.tsx — `src/components/shared/TaskModal.tsx`

**Status: Functionally complete.** Good read-only mode for completed tasks. Output URL parsing works.

**Issue: `handleSave` doesn't validate that output URL format is correct**  
- Accepts any string as output URL, including malformed paths. The `MarkdownPreviewModal` is opened only when the URL ends with `.md`.
- **Severity:** **LOW**

**Issue: `description` field is mutated to embed `[output]: URL` pattern**  
- This is a workaround for missing `output_url` column in the DB. If the DB schema is updated, the regex to extract/clean the pattern may leave orphaned text.
- **Severity:** **LOW** (temporary workaround, documented)

### 2.5 KanbanBoard.tsx — `src/components/board/KanbanBoard.tsx`

**Status: Mostly solid.** Good loading skeleton, filtering, and stall detection.

**Issue: `isStalled` uses creation time, not last-updated time**  
```tsx
const age = Date.now() - new Date(task.created_at).getTime();
```
- A task that was updated recently but created long ago would be incorrectly flagged as stalled. Should use the most recent `updated_at`.
- **Severity:** **LOW** (logic bug)

**Issue: `onMoveTask` may be called with invalid status**  
- The MoveMenu allows moving to prevCol or nextCol or skipping to 'done'. If `KANBAN_COLUMNS` changes, the index math could be wrong.
- **Severity:** **LOW** (unlikely in practice)

### 2.6 AgentModal.tsx — `src/components/shared/AgentModal.tsx`

**Status: Functional.** Three tabs (profile, soul, skills) with save functionality.

**Issue: Soul content fetch is on every AgentModal mount, not per-agent**  
```tsx
fetch('/api/files?path=SOUL.md&t=' + Date.now())  // Always reads global SOUL.md
```
- Fetches the global `SOUL.md` regardless of which agent is being edited. If the app has per-agent soul files, this is incorrect. Currently seems to be designed for a single-agent setup (Nova/Bruk).
- **Severity:** **LOW**

**Issue: `handleSave` doesn't save skills or soul data**  
- Only saves name, role, status, and model to the agent. Soul editing is saved separately via `/api/files/save`. Skills display is read-only.
- **Severity:** **MEDIUM** (UI implies skills are "assigned" but there's no save mechanism)

---

## 3. UNFINISHED FEATURES

### 3.1 Workflow View — `src/app/page.tsx`
- **Status:** Function defined, never rendered. Shows "Workflow automation coming soon."
- **Severity:** **LOW** (explicitly marked as coming soon)

### 3.2 FilesView — Deliverables Toggle
- **Status:** State variables (`showDeliverablesView`, `deliverables`) declared but no UI to show them.
- **Severity:** **MEDIUM** — The deliverables data is fetched but never displayed. Users see no indication of deliverables in the Files view.

### 3.3 News Route — Mock Data Only
- **Status:** `GET /api/news` returns hardcoded fabricated news items. `POST /api/news-fetch` exists but the GET endpoint never calls it.
- **Severity:** **MEDIUM** — The dashboard displays fake news data as if it's real.

### 3.4 Token Costs — Data Dependency
- **Status:** `GET /api/token-costs` returns 404 unless `tokenTracker.js` has been manually run first. No cron or automated regeneration.
- **Severity:** **LOW** — Documented in error message.

### 3.5 Graph Routes — Static Data Dependency
- **Status:** Graph routes read from `public/api/graph-data.json` which must be generated by `workspace-scanner.js`. If the static file is missing, routes return empty data.
- **Severity:** **LOW** — Graceful degradation to empty data.

### 3.6 SettingsView — API Key Storage
- **Status:** UI for entering OpenAI, Anthropic, and Supabase API keys exists. Settings are saved to `workspace-settings.json` via `/api/settings` POST. On Vercel, this file is ephemeral.
- **Severity:** **HIGH** — Settings won't persist across restarts on Vercel.

---

## 4. VERCEL BUILD RISKS

### 4.1 Critical: `serverExternalPackages: ['fs', 'path']`
- **File:** `next.config.ts`
- **Risk:** Declaring `fs` and `path` as server external packages means Next.js won't attempt to bundle them. This works fine in production because these are Node.js built-ins. However, on Vercel serverless, the filesystem is ephemeral. The real risk is that many API routes use these to read/write files that don't exist on Vercel.
- **Impact:** The config itself is fine for Next.js 15+, but the code that uses `fs`/`path` will **fail silently or return wrong data** on Vercel.
- **Fix:** Either remove filesystem-dependent routes from Vercel deployment, or wrap them in proper environment detection.

### 4.2 Critical: TypeScript and ESLint Errors Ignored
```ts
eslint: { ignoreDuringBuilds: true, },
typescript: { ignoreBuildErrors: true, },
```
- **Risk:** Build errors are suppressed. This means **runtime crashes** could ship to production. There could be type errors or broken imports that the compiler would normally catch.
- **Fix:** Remove these configs and fix all build errors. This is a safety net hiding real problems.

### 4.3 HIGH: Missing `maxDuration` Configuration
- Several streaming routes (`chat`, `hyperlearn/browse`, `news-fetch`) perform long-running operations but most don't declare `export const maxDuration`. Only `hyperlearn/browse` sets `maxDuration = 300`.
- **Impact:** Default serverless timeout is 10s on Vercel. Streaming chat and hyperlearn will be killed before completion.
- **Fix:** Add `export const maxDuration = 60` (or higher) to streaming routes.

### 4.4 HIGH: No `dynamic = 'force-dynamic'` on Many Routes
- Routes that use `fs` operations, read external files, or depend on environment state should all have `export const dynamic = 'force-dynamic'`. Missing this on:
  - `/api/deliverables`
  - `/api/files` (has it ✓)
  - `/api/model` (has it ✓)
  - `/api/skills` (has it ✓)
  - `/api/token-costs` — **MISSING**
  - `/api/workspace` (has it ✓)
  - `/api/workspace/search` (has it ✓)
  - `/api/settings` (has it ✓)
  - `/api/news` (has it ✓)
- **Fix:** Add `export const dynamic = 'force-dynamic'` to `/api/token-costs`.

### 4.5 MEDIUM: Static JSON Dependencies
Multiple routes depend on static JSON files in `public/api/`:
- `public/api/gateway-status.json`
- `public/api/skills.json`
- `public/api/token-costs.json`
- `public/api/graph-data.json`
- `public/api/news.json`

These files must be **pre-generated** before deployment. On Vercel, there's no cron to regenerate them. If they're missing, the routes return errors or empty data.

### 4.6 MEDIUM: Environment Variables Not Validated
No `.env.example` or `.env.local` check on startup. The app will boot with placeholder values and users won't notice until features break. Specifically:
- `NEXT_PUBLIC_SUPABASE_URL` — required for chat, feedback, agent-trigger
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — same
- `GATEWAY_TOKEN` / `OPENCLAW_GATEWAY_TOKEN` — required for gateway status
- `SUPERSET_URL` / `SUPERSET_API_TOKEN` — required for superset queries
- `BRAVE_API_KEY` — embedded in code but also needed as env var

---

## 5. SUMMARY BY SEVERITY

### 🔴 CRITICAL (5 issues)
1. **`POST /api/model`** — uses `exec()` with `openclaw gateway restart` (will crash on Vercel serverless)
2. **`POST /api/news-fetch`** — execs inline Node.js with hardcoded Brave API key leaked
3. **`/api/deliverables`** — hardcoded `/home/ubuntu/.openclaw/workspace/deliverables` path (404 on Vercel)
4. **`/api/workspace/*`** — filesystem operations on ephemeral Vercel storage (writes lost)
5. **`/api/files` + `/api/files/save`** — same ephemeral storage problem

### 🟠 HIGH (10 issues)
1. **`POST /api/hyperlearn/browse`** — missing try/catch around initial `request.json()`, client may hang
2. **Hardcoded credentials**: 4 API routes use placeholder Supabase URLs/keys that will silently fail
3. **`POST /api/news-fetch`** — shell execution via exec() is prohibited on Vercel
4. **`POST /api/model`** — shell exec for gateway restart
5. **`next.config.ts`** — `ignoreBuildErrors: true` hides real TypeScript/import errors
6. **Missing `maxDuration`** on streaming routes (chat, news-fetch)
7. **SettingsView** — settings stored in ephemeral filesystem
8. **`GET /api/gateway-status`** — hardcoded localhost gateway URL, not configurable

### 🟡 MEDIUM (6 issues)
1. **`/api/superset/query`** — requires env vars `SUPERSET_URL` and `SUPERSET_API_TOKEN` at module level; will crash if undefined during build
2. **FilesView** — deliverables state declared but no UI to show it (dead code)
3. **News route** — returns fabricated data, no connection to real fetch
4. **Static JSON dependencies** — graph-data, skills, gateway-status, token-costs JSON files must be pre-generated
5. **AgentModal** — "Assigned Skills" tab is read-only, no save mechanism despite UI suggesting otherwise
6. **Missing `dynamic = 'force-dynamic'`** on `/api/token-costs`

### 🟢 LOW (10 issues)
1. **page.tsx** — `ApprovalsView` imported after module export (valid hoisting, bad practice)
2. **page.tsx** — `WorkflowView` defined but never rendered (dead code)
3. **ProjectDetailView** — "Last Updated" shows `created_at` instead of `updated_at`
4. **ProjectDetailView** — deliverables fetch swallows parse errors silently
5. **KanbanBoard** — stall detection uses `created_at` not `updated_at`
6. **AgentModal** — SOUL.md fetch is always global, not per-agent
7. **TaskModal** — output URL format not validated
8. **Token costs** — requires manual `tokenTracker.js` run (documented)
9. **feedback/[id]** — ID extraction via `pathname.split('/').pop()` is fragile
10. **News route** — mock data served as real data to users

---

## RECOMMENDED PRIORITY ORDER FOR FIXES

1. **Fix Vercel crashes first** (CRITICAL): Remove or guard all `exec()` calls and filesystem writes that assume a persistent VPS home directory.
2. **Remove build error suppression** (HIGH): Fix actual TypeScript errors so the config can trust the compiler.
3. **Replace placeholder credentials** (HIGH): Add environment variable validation with helpful error messages instead of silent failures with placeholder URLs.
4. **Add `maxDuration`** (HIGH): To all streaming API routes that may exceed the 10-second default.
5. **Wire up unfinished features** (MEDIUM): Either remove dead code (FilesView deliverables, WorkflowView) or complete the functionality.
6. **Fix minor bugs** (LOW): Last Updated date, stall detection, dead code cleanup.

---

*End of audit.*
