# 📋 Mission Control Dashboard — Full Audit Report
**Date:** 2026-03-26  
**Auditor:** Nova  
**Dashboard URL:** https://mission-control-ui-sand.vercel.app

---

## 🟢 VERDICT SUMMARY

| Category | Status | Score |
|----------|--------|-------|
| Live Data vs Hardcoded | ⚠️ Mixed | 6/10 |
| Supabase Sync | ✅ Good | 8/10 |
| OpenClaw Workspace Sync | ⚠️ Partial | 5/10 |
| Autonomous Working | ❌ Broken | 3/10 |
| Agents Page | ✅ Good | 7/10 |
| Improvements Needed | 🔴 12 Issues | — |

---

## PAGE-BY-PAGE AUDIT

### 1. 📊 Overview Dashboard
**Data Source:** Supabase (via `useSupabase` hook → `page.tsx`)

| Element | Source | Status |
|---------|--------|--------|
| Agent count | Supabase `agents` table | ✅ Live |
| Task counts (total/active/done) | Supabase `tasks` table | ✅ Live |
| Token costs | **HARDCODED** `$0.00` | ❌ Hardcoded |
| Session count | OpenClaw gateway API | ✅ Live |
| Ethiopian Calendar | `ethiopian-calendar-date-converter` npm | ✅ Live |
| Activity Pulse | **MOCK** — uses `Math.random()` + fake "Ethiopian time" | ❌ Fake |
| News Feed | Static JSON file (`public/api/news.json`) updated by cron | ⚠️ Semi-live |

**Issues Found:**
- `ActivityPulse.tsx` lines 60-70: Generates completely fake random activity data using `Math.random()` with comments saying "Simulated Ethiopian timezone". This shows misleading information to users.
- Token costs always show `$0.00` — the `TokenCost` hook reads from `/api/token-costs` which either doesn't exist or returns empty data.
- The News feed depends on a cron job that had broken file paths (now fixed).

---

### 2. 🤖 Agents Page
**Data Source:** Supabase `agents` table via props

| Element | Source | Status |
|---------|--------|--------|
| Agent list | Supabase | ✅ Live |
| Avatar emojis | Supabase `avatar_emoji` | ✅ Live |
| Status indicators | Supabase `status` | ✅ Live |
| Edit/Add Agent | Supabase insert/update | ✅ Live |

**Issues Found:**
- Agent status (`active`/`idle`/`offline`) is never auto-updated. If Nova is working on a task, it still shows "active" but there's no connection to actual gateway activity.
- No way to assign a model or system prompt to an agent from the UI.

---

### 3. 📋 Tasks Board (Kanban)
**Data Source:** Supabase `tasks` table

| Element | Source | Status |
|---------|--------|--------|
| Task list | Supabase | ✅ Live |
| Drag-and-drop | Local state → Supabase update | ✅ Live |
| Priority labels | Task `priority` field | ✅ Live |
| Assignee display | `task.assignees[0]` | ⚠️ Partial |

**Issues Found:**
- `assignees` is a string array but the system uses `@Name` format inconsistently. Some tasks have `"Nova"`, others `"@Nova"`.
- No automatic task reassignment when agents go offline.

---

### 4. 🏢 Virtual Office
**Data Source:** Static HTML (`virtual-office/index.html`)

| Element | Source | Status |
|---------|--------|--------|
| Office map | Hardcoded HTML | ⚠️ Static |
| Agent positions | Hardcoded | ❌ Hardcoded |
| Real-time updates | None | ❌ Missing |

**Issues Found:**
- The Virtual Office is a standalone HTML file, not integrated with the React dashboard.
- Agent positions are hardcoded. No connection to actual agent status or task activity.

---

### 5. 📈 Analytics
**Data Source:** MCP Analytics Server (live)

| Element | Source | Status |
|---------|--------|--------|
| Margin analysis | MCP datahub endpoint | ✅ Live |
| Daily trends | MCP | ✅ Live |
| Category breakdown | MCP | ✅ Live |
| Product rankings | MCP | ✅ Live |

**Issues Found:**
- Uses old MCP URL: `https://earrqspffkrnreucmtvf.supabase.co/functions/v1/datahub-mcp-server` — should be updated to the new `actfsareesjtcjsckmht` endpoint.
- No authentication token — relies on the server being open.

---

### 6. 📊 Insights
**Data Source:** Computed from props (tasks, agents, stats)

| Element | Source | Status |
|---------|--------|--------|
| Completion rate | Calculated | ✅ Live |
| Task distribution | Calculated | ✅ Live |
| Activity heatmap | Calculated from `task.created_at` | ⚠️ Partial |
| Agent performance | Calculated from `task.assignees` | ⚠️ Partial |

**Issues Found:**
- Activity heatmap only tracks task creation time, not actual work activity.
- Agent performance depends on `assignees` matching `@Name` format which is inconsistent.

---

### 7. ⚡ Skills
**Data Source:** Dynamic API (`/api/skills` — reads from workspace `skills/` folder)

| Element | Source | Status |
|---------|--------|--------|
| Skill list | Filesystem scan | ✅ Live |
| Skill descriptions | SKILL.md parsing | ✅ Live |
| Category grouping | Filesystem structure | ✅ Live |
| Search/filter | Local state | ✅ Live |

**Issues Found:**
- None! This is the best-implemented page.

---

### 8. 🔗 Approvals
**Data Source:** Props (tasks filtered by `approval_needed` status)

| Element | Source | Status |
|---------|--------|--------|
| Approval list | Supabase tasks | ✅ Live |
| Approve/Reject | Supabase update | ✅ Live |

---

### 9. 📰 IPMR
**Data Source:** Live from Supabase

| Element | Source | Status |
|---------|--------|--------|
| Feedback items | Supabase | ✅ Live |
| Status updates | Supabase | ✅ Live |

---

### 10. 💬 Chat
**Data Source:** `/api/chat` → OpenClaw Gateway

| Element | Source | Status |
|---------|--------|--------|
| Chat interface | Gateway WebSocket | ✅ Live |
| Message history | Session context | ✅ Live |

---

### 11. 🔄 Workflow
**Data Source:** None

| Element | Source | Status |
|---------|--------|--------|
| Everything | Placeholder text only | ❌ Empty |

**Issues Found:**
- Completely empty. Just shows "Workflow view loaded successfully." with no content.

---

### 12. 🧠 HyperLearn
**Data Source:** Hyperbrowser API + OpenAI

| Element | Source | Status |
|---------|--------|--------|
| UI | Integrated | ✅ Present |
| API routes | Created | ✅ Present |
| Actual functionality | Needs API keys | ⚠️ Needs config |

---

## 🔴 CRITICAL ISSUES

### 1. Activity Pulse is FAKE DATA
`ActivityPulse.tsx` uses `Math.random()` to generate fake activity bars. This is **misleading** — users think they're seeing real agent activity.

**Fix:** Replace with real data from Supabase `activities` table or remove the component entirely.

### 2. Token Costs Always Show $0.00
The `TokenCost` component reads from `/api/token-costs` which returns nothing. The OpenClaw gateway tracks token costs but they're not being piped to the dashboard.

**Fix:** Create a proper `/api/token-costs` endpoint that reads from OpenClaw's cost tracking.

### 3. Workflow Page is Empty
The Workflow page shows nothing but a placeholder.

**Fix:** Either implement it (show workflow definitions, task dependencies) or remove it from navigation.

### 4. Analytics Uses Old MCP URL
Points to `earrqspffkrnreucmtvf` instead of `actfsareesjtcjsckmht`.

**Fix:** Update the URL in `AnalyticsView.tsx`.

### 5. Virtual Office Not Integrated
The Virtual Office is a standalone HTML page, not connected to the dashboard's data layer.

**Fix:** Either integrate it as a React component or remove it.

### 6. Assignee Format Inconsistency
Tasks use both `"Nova"` and `"@Nova"` for assignees, breaking matching logic in Insights.

**Fix:** Standardize on one format (preferably `@Name` everywhere).

### 7. Agent Status Not Dynamic
Agents always show as "active" or "idle" based on manual DB updates, not actual activity.

**Fix:** Connect agent status to OpenClaw gateway's live session data.

---

## 📋 RECOMMENDED ACTIONS

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 🔴 P0 | Replace fake Activity Pulse with real data | 30min | High |
| 🔴 P0 | Fix Token Costs API endpoint | 20min | Medium |
| 🔴 P0 | Remove or implement Workflow page | 15min | Medium |
| 🟡 P1 | Update Analytics MCP URL | 2min | High |
| 🟡 P1 | Standardize assignee format | 30min | High |
| 🟡 P1 | Make agent status dynamic | 45min | Medium |
| 🟢 P2 | Integrate Virtual Office into React | 2hrs | Low |
| 🟢 P2 | Add real-time activity tracking | 1hr | Medium |

---

*Generated by Nova — Mission Control Audit — 2026-03-26*
