# Mission Control Dashboard — Component Audit Report

**Auditor:** Cinder (QA/Review Agent)
**Date:** 2026-03-18
**Codebase:** `/home/ubuntu/.openclaw/workspace/mission-control-ui/`

---

## Architecture Overview

All data flows through a single `useSupabase()` hook (in `src/hooks/useSupabase.ts`) which:

1. **Initial load:** Fires 4 parallel Supabase queries (tasks, agents, projects, activities) via `loadData()`
2. **Real-time updates:** Subscribes to 4 Supabase Realtime channels:
   - `tasks-rt` — INSERT/UPDATE/DELETE on `tasks`
   - `activities-rt` — INSERT on `activities`
   - `projects-rt` — INSERT/UPDATE/DELETE on `projects`
   - `agents-rt` — INSERT/UPDATE/DELETE on `agents`
3. **Stats:** Recalculated client-side via `calculateStats()` whenever tasks change
4. **Lifecycle:** Data loads once on mount; real-time channels stay open; cleanup on unmount

**Key finding:** The dashboard has a solid real-time foundation. Most views inherit live data automatically. The exceptions are noted below.

---

## 1. ProjectsView (`src/components/views/ProjectsView.tsx`)

| Aspect | Status | Details |
|--------|--------|---------|
| **Data source** | ✅ Live (inherited) | Receives `projects`, `tasks`, `agents` as props from parent `useSupabase()`. Real-time Supabase channels update these. |
| **Auto-refresh** | ✅ Yes | No manual refresh needed — real-time subscription pushes changes. |
| **Loading state** | ✅ Good | Renders skeleton pulse placeholders when `loading=true`. |
| **Error handling** | ⚠️ Minimal | No error state displayed. Relies entirely on parent's error banner. If data arrives empty (no projects), shows "No projects found" — but no distinction between "genuinely empty" and "failed to load." |
| **Missing for live experience** | | |
| | ❌ No manual refresh button | If real-time drops, no way to force re-fetch. Parent has `db.refresh()` but ProjectsView doesn't expose it. |
| | ❌ No "last updated" indicator | User can't tell when data was last refreshed. |
| | ❌ No optimistic UI on task edits | Clicking a task opens a modal (via `onEditTask`), but there's no visual feedback on save. |

**Verdict:** 🟢 GOOD — Live by default via parent subscription. Minor UX gaps.

---

## 2. ActivityView (`src/components/views/ActivityView.tsx`)

| Aspect | Status | Details |
|--------|--------|---------|
| **Data source** | ✅ Live (inherited) | Receives `activities` array as props. The `activities-rt` channel subscribes to INSERT events and prepends new entries. |
| **Auto-refresh** | ✅ Yes | New activities appear in real-time. |
| **Loading state** | ✅ Good | Renders 10 skeleton cards with pulse animation. |
| **Error handling** | ⚠️ Minimal | No error state. Empty state says "No activity found" — no way to distinguish from error. |
| **Missing for live experience** | | |
| | ❌ No auto-scroll to new items | When a new activity arrives, the view doesn't scroll to show it. If user is scrolled down, new items appear at the bottom silently. |
| | ❌ No timestamp grouping | Activities are shown as a flat list. No "Today / Yesterday / This Week" grouping. |
| | ❌ No manual refresh | No refresh button. Relies 100% on real-time. |
| | ❌ No action type icons | Every activity looks the same — just `agent_name` + `action` text. No visual distinction between create/update/delete actions. |
| | ⚠️ Filter resets on new data | The filter dropdown persists, but if a new agent's activity comes in, the dropdown doesn't update its agent list until the component re-renders (it does via useMemo, but it's computed from current data). |

**Verdict:** 🟡 GOOD but basic — Live updates work, but no grouping, no auto-scroll, minimal error handling.

---

## 3. AgentGrid (`src/components/agents/AgentGrid.tsx`)

| Aspect | Status | Details |
|--------|--------|---------|
| **Data source** | ✅ Live (inherited) | Receives `agents` and `tasks` as props. The `agents-rt` channel handles INSERT/UPDATE/DELETE. |
| **Auto-refresh** | ✅ Yes | Agent status and task counts update in real-time. |
| **Loading state** | ✅ Good | Skeleton placeholders for department sections. |
| **Error handling** | ⚠️ Minimal | No error state displayed. If agent data is missing, departments just show nothing (returns `null` from map). |
| **Missing for live experience** | | |
| | ❌ Hardcoded department structure | Departments array is hardcoded: `{name: 'Development', agents: ['Henok', 'Cinder', 'Kiro', 'Onyx']}` etc. New agents not in these lists won't appear in the org chart. This is a **data integrity bug** — agents added via the UI won't show in the org chart unless manually added to this array. |
| | ❌ Agent status badge derives from tasks, not from agent.status | The colored status dot is computed via `getAgentStatusInfo(lastActivity)` based on task timestamps — not the `agent.status` field from the database. This is arguably better (more accurate), but inconsistent with the data model. |
| | ❌ Ping sends via `/api/chat` with `.catch(() => {})` — silent failure | If the API is down, the ping appears to succeed visually. No user-facing error. |
| | ❌ No "online/offline" count | No summary of how many agents are active/idle/offline. |
| | ⚠️ Nova hard-coded as special agent | Nova gets a special card at the top via `agents.find(a => a.name === 'Nova')`. If Nova doesn't exist in DB, the section renders nothing (no fallback). |

**Verdict:** 🟡 FUNCTIONAL but has a significant data bug — hardcoded department lists mean the org chart is stale/manual.

---

## 4. KanbanBoard (`src/components/board/KanbanBoard.tsx`)

| Aspect | Status | Details |
|--------|--------|---------|
| **Data source** | ✅ Live (inherited) | Receives `tasks` and `agents` as props. Real-time `tasks-rt` channel updates in real-time. |
| **Auto-refresh** | ✅ Yes | Tasks update live — new tasks appear, status changes reflect immediately. |
| **Loading state** | ✅ Good | Skeleton columns with pulse animation per column. |
| **Error handling** | ⚠️ Partial | `moveTask` catches errors and shows `alert()` (not user-friendly). No error UI for failed moves. |
| **Drag-and-drop** | ❌ **NOT IMPLEMENTED** | Despite being a "Kanban board," there is **no drag-and-drop**. Task movement is done via a "Move" dropdown menu with prev/next column buttons. This is a major UX gap for a kanban board. |
| **Missing for live experience** | | |
| | ❌ No drag-and-drop | Tasks can't be dragged between columns. Only button-based movement. |
| | ❌ Move action uses `alert()` for errors | `moveTask` in the hook calls `alert()` on failure — terrible UX. |
| | ⚠️ Stalled detection is time-based only | A task is "stalled" if `in_progress > 1hr` or `assigned > 2hrs`. No manual override or "snooze" capability. |
| | ⚠️ Ping is visual-only | Ping button on stalled tasks just shows a checkmark — doesn't actually notify anyone (unlike AgentGrid ping which calls `/api/chat`). |
| | ❌ No column WIP limits | No way to set limits on columns (e.g., max 3 tasks in "review"). |
| | ❌ No real-time move animation | When a task status changes via real-time, it instantly jumps columns with no animation. |

**Verdict:** 🟡 LIVE but missing core kanban feature (drag-and-drop). Move mechanism works via buttons.

---

## 5. FeedbackView (`src/components/views/FeedbackView.tsx`)

| Aspect | Status | Details |
|--------|--------|---------|
| **Data source** | 🔴 **INDEPENDENT** | Does NOT use `useSupabase()`. Fetches directly from `/api/feedback` via `fetch()`. This is **completely disconnected** from the real-time Supabase subscription system. |
| **Auto-refresh** | ❌ **NO** | Loads once on mount via `useEffect`. No real-time subscription. No polling. No auto-refresh. |
| **Manual refresh** | ✅ Yes | Has a refresh button (🔄 icon) that calls `fetchFeedback()`. |
| **Loading state** | ✅ Good | Renders skeleton cards during initial load. |
| **Error handling** | ✅ Good | Shows error banner with message. Catches fetch failures. `updateStatus` errors are silent (no user feedback on failure though). |
| **Status updates** | ⚠️ Partial | Status can be changed via buttons (calls `/api/feedback/[id]` PATCH). Optimistically updates local state. But errors are silently swallowed. |
| **Missing for live experience** | | |
| | ❌ **No real-time updates** | If someone submits feedback via the modal, the FeedbackView won't update until manually refreshed. |
| | ❌ Status update errors are silent | `updateStatus` has a `catch {}` that swallows errors — user thinks update succeeded when it may have failed. |
| | ❌ No Supabase Realtime subscription | This is the only view that doesn't use the real-time architecture. Should subscribe to `feedback` table changes. |
| | ❌ No "new feedback" notification | When new feedback arrives (and if real-time were added), there's no toast or indicator. |

**Verdict:** 🔴 CRITICAL — Not live. Manual refresh only. Status update errors are silently swallowed. This is the weakest component.

---

## 6. SettingsView (`src/components/views/SettingsView.tsx`)

| Aspect | Status | Details |
|--------|--------|---------|
| **Data source** | 🟡 MIXED | Agent list comes from props (live). Model list is hardcoded in `types.ts` (`AVAILABLE_MODELS`). System info is hardcoded strings. Global model setting is local state only — **not persisted**. |
| **Auto-refresh** | N/A | Settings don't need real-time, but changes aren't saved. |
| **Loading state** | N/A | No loading state needed. |
| **Error handling** | 🔴 **NONE** | The "Apply" button for the global model just calls `setSaved(true)` — it **doesn't actually save anything**. The comment says "In a real implementation, this would call the OpenClaw API." |
| **Missing for live experience** | | |
| | ❌ **Global model setting is non-functional** | "Apply" button is a no-op. No API call. Setting resets on page reload. |
| | ❌ Per-agent model overrides use `defaultValue=""` | These aren't wired to any backend. Changing per-agent model has no effect. |
| | ❌ System info is hardcoded | "Linux x64", "v22.22.1", "Gemini Pro" etc. are static strings — not live system data. |
| | ❌ No actual settings persistence | Nothing in this view writes to the database or any backend. It's entirely a UI mockup. |
| | ❌ `onUpdateAgent` prop received but never called | The parent passes `db.updateAgent` but the SettingsView never invokes it. |

**Verdict:** 🔴 NON-FUNCTIONAL — A UI mockup. Global model selector is a no-op. Per-agent overrides do nothing. System info is static.

---

## 7. StatsCards (`src/components/dashboard/StatsCards.tsx`)

| Aspect | Status | Details |
|--------|--------|---------|
| **Data source** | ✅ Live (inherited) | Receives `DashboardStats` object computed by `calculateStats()` in `useSupabase()`. Stats recalculate whenever tasks change via real-time. |
| **Auto-refresh** | ✅ Yes | Stats update automatically when tasks are added/updated/deleted. |
| **Loading state** | ✅ Good | 4 skeleton cards with pulse animation. |
| **Error handling** | ⚠️ Minimal | No error state. If stats are wrong, there's no indication. |
| **Missing for live experience** | | |
| | ❌ No trend indicators | Shows absolute numbers but no change arrows (e.g., "+3 today"). |
| | ❌ Rate calculation excludes rejected tasks | `rate = done / (total - rejected)`. This is correct but not explained to the user. |
| | ⚠️ `totalTokens` in stats type but not displayed | The `DashboardStats` type includes `totalTokens` and `stalledCount` but the card UI only shows 4 items (total, active, done, rate). The other stats are computed but invisible. |
| | ❌ No click-through | Cards don't link to filtered views (e.g., clicking "Active" should show only active tasks). |

**Verdict:** 🟢 GOOD — Live data, clean rendering. Just lacks trend/context info.

---

## 8. Header (`src/components/layout/Header.tsx`)

| Aspect | Status | Details |
|--------|--------|---------|
| **Data source** | ✅ Live (inherited) | Receives `agents` and `tasks` arrays. Computes `activeAgents` count and active task count from props. |
| **Auto-refresh** | ✅ Yes | Counts update when underlying data changes via real-time. |
| **Loading state** | N/A | Header is always visible; no loading state needed. |
| **Error handling** | N/A | Header doesn't fetch data. |
| **What it shows** | | |
| | ✅ Active agents count (e.g., "Agents 3/12") |
| | ✅ Active task count (excludes done/rejected) |
| | ✅ "Live" indicator with pulsing green dot |
| | ✅ Notification bell with pending approvals badge |
| | ✅ Feedback button |
| | ✅ "New" dropdown (Task / Project / Agent) |
| | ✅ Hamburger menu for mobile |
| **Missing for live experience** | | |
| | ❌ "Live" indicator is cosmetic | The green pulsing dot always shows "Live" — it doesn't actually check if the real-time connection is healthy. If Supabase Realtime disconnects, it still says "Live." |
| | ❌ No notification system | The bell icon shows approval count but doesn't show new activity, new feedback, or other notifications. |
| | ❌ `activeSessions` hardcoded to 1 | `const activeSessions = 1` — never used in the UI, but indicates unfinished work. |
| | ❌ No connection health indicator | No way to tell if Supabase Realtime is connected, reconnecting, or dead. |

**Verdict:** 🟢 GOOD — Clean header, useful at-a-glance info. "Live" badge is misleading (always on).

---

## 9. Sidebar (`src/components/layout/Sidebar.tsx`)

| Aspect | Status | Details |
|--------|--------|---------|
| **Data source** | ✅ Static config | Navigation items are hardcoded in a `sections` array. `pendingCount` comes from props (live). |
| **Auto-refresh** | ✅ (for badge) | Pending approvals badge updates in real-time. |
| **Loading state** | N/A | Static navigation. |
| **Error handling** | N/A | No data fetching. |
| **Navigation items** | | |
| | Main: Overview, Agents, Tasks, Projects, Workflow, Skills, Approvals, Analytics, Feedback, Graph |
| | OBSERVE: Activity, Logs |
| | AUTOMATE: Cron (soon), Webhooks (soon), GitHub (soon) — all non-functional |
| | ADMIN: Settings, Security (soon) — Security is non-functional |
| **What's real vs. placeholder** | | |
| | ✅ Real views: dashboard, agents, board, projects, workflow, skills, approvals, insights, feedback, graph, activity, settings |
| | ❌ Placeholder (redirect to dashboard): Cron, Webhooks, GitHub, Security — all have `id: 'dashboard'` and `opacity-50` with "soon" badge |
| **Missing for live experience** | | |
| | ❌ 4 items are non-functional placeholders | Cron, Webhooks, GitHub, Security all redirect to dashboard. Should be removed or disabled until ready. |
| | ❌ "Jump to page" search is non-functional | The search bar with ⌘K shortcut does nothing — no command palette implementation. |
| | ❌ No unread indicators | No badge for new activities or new feedback items. |
| | ❌ Duplicate "Insights" / "Analytics" | Both are listed (once as "Analytics" in main, once as "Logs" in OBSERVE) — both navigate to `insights` view. "Logs" is misleading since it goes to analytics, not logs. |
| | ⚠️ Gateway Connected indicator is always green | Same as header "Live" — doesn't check actual connection health. |

**Verdict:** 🟡 FUNCTIONAL — Core navigation works. Multiple dead-end placeholders. Search/command palette is fake.

---

## Summary & Priority Recommendations

### 🔴 Critical (Must Fix)

| # | Issue | Component | Impact |
|---|-------|-----------|--------|
| 1 | **FeedbackView has no real-time updates** | FeedbackView | Feedback data is stale until manual refresh. Major UX gap. |
| 2 | **SettingsView is entirely non-functional** | SettingsView | Model selection, per-agent overrides, and system info are all fake UI. |
| 3 | **Silent error swallowing in feedback status updates** | FeedbackView | Users think status was updated when it may have failed. |

### 🟡 Important (Should Fix)

| # | Issue | Component | Impact |
|---|-------|-----------|--------|
| 4 | **Hardcoded department lists in AgentGrid** | AgentGrid | New agents won't appear in org chart. |
| 5 | **No drag-and-drop on Kanban board** | KanbanBoard | Core UX expectation for a "kanban" board. |
| 6 | **"Live" indicators are always-on** | Header, Sidebar | Misleading — no actual connection health monitoring. |
| 7 | **Kanban move errors use `alert()`** | KanbanBoard | Poor UX for error handling. |
| 8 | **4 placeholder nav items (Cron, Webhooks, GitHub, Security)** | Sidebar | Dead ends that frustrate users. |

### 🟢 Nice to Have

| # | Issue | Component | Impact |
|---|-------|-----------|--------|
| 9 | No manual refresh buttons on most views | ProjectsView, ActivityView | If real-time drops, no recovery mechanism. |
| 10 | No "last updated" timestamps | All views | Users can't verify data freshness. |
| 11 | No auto-scroll for new activity items | ActivityView | New items may go unnoticed. |
| 12 | Stats cards don't show trends | StatsCards | No sense of momentum (+3 today, etc.). |
| 13 | Command palette (⌘K) is non-functional | Sidebar | Search UI exists but does nothing. |
| 14 | No activity type icons | ActivityView | All activities look the same. |
| 15 | Ping failures are silent | AgentGrid | Ping appears to succeed even if API is down. |

---

## Overall Assessment

**Real-time coverage: 6/9 components** — ProjectsView, ActivityView, AgentGrid, KanbanBoard, StatsCards, and Header all receive live data via the shared Supabase Realtime subscription.

**Gaps:**
- FeedbackView is completely isolated from the real-time system
- SettingsView is a UI mockup with no backend integration
- No connection health monitoring (the "Live" badge is decorative)
- Several placeholder/fake UI elements (search, command palette, settings)

**Recommendation:** The data infrastructure (`useSupabase` hook with 4 realtime channels) is solid. The main work needed is:
1. Wire FeedbackView into Supabase Realtime (or at least poll `/api/feedback` periodically)
2. Make SettingsView functional (wire model selection to backend)
3. Add connection health monitoring to replace the cosmetic "Live" badge
4. Fix the hardcoded department lists in AgentGrid
