# Mission Control Dashboard V3 — Comprehensive Audit Report

**Generated:** 2026-03-19 17:47 EAT  
**Auditor:** Nova (subagent)  
**Scope:** Full `src/` directory audit  
**ESLint Result:** 29 errors, 105 warnings (build-blocking)

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Build-Blocking Issues (ESLint Errors)](#build-blocking-issues)
3. [Critical Issues](#critical-issues)
4. [Warnings](#warnings)
5. [Info / Improvements](#info--improvements)
6. [File-by-File Findings](#file-by-file-findings)
7. [Architectural Concerns](#architectural-concerns)
8. [Recommended Fix Priority](#recommended-fix-priority)

---

## Executive Summary

The Mission Control Dashboard V3 is a well-structured Next.js application with real-time Supabase integration, a live gateway status panel, and a feedback pipeline. However, the audit reveals:

- **29 ESLint errors** that will block Vercel deployment
- **~50 hardcoded data items** across SkillsView, WorkflowView, NewsFeed, and AgentGrid
- **Settings page model selector is non-functional** — it changes local state only, never calls any API
- **No agent trigger capability** from the UI (the Command Center sends to `/api/chat` which does basic intent matching, not actual OpenClaw gateway commands)
- **Multiple theme-awareness bugs** in dashboard widgets
- Several unused imports/variables throughout

---

## Build-Blocking Issues

### ESLint Errors (29 total — must fix for Vercel deploy)

| # | File | Line | Error | Severity |
|---|------|------|-------|----------|
| 1 | `src/lib/onboarding.ts` | 89 | `no-explicit-any` in `fetchDrivers` return type | **error** |
| 2 | `src/lib/onboarding.ts` | 101 | `no-explicit-any` in `addDriver` return type | **error** |
| 3 | `src/lib/onboarding.ts` | 122 | `no-explicit-any` in `advanceStage` return type | **error** |
| 4 | `src/lib/onboarding.ts` | 140 | `no-explicit-any` in `updates` variable | **error** |
| 5 | `src/lib/onboarding.ts` | 161 | `no-explicit-any` in `deleteDriver` return type | **error** |
| 6 | `src/hooks/useTheme.ts` | 19 | `set-state-in-effect`: `setTheme(saved)` inside useEffect | **error** |
| 7 | `src/components/onboarding/AddDriverModal.tsx` | 25 | `set-state-in-effect`: `setName('')` inside useEffect | **error** |
| 8 | `src/components/onboarding/OnboardingDashboard.tsx` | 67 | `set-state-in-effect`: `loadDrivers()` inside useEffect | **error** |
| 9 | `src/components/shared/AgentModal.tsx` | 31 | `set-state-in-effect`: `setName(agent.name)` inside useEffect | **error** |
| 10 | `src/components/shared/ProjectModal.tsx` | 30 | `set-state-in-effect`: `setName(project.name)` inside useEffect | **error** |
| 11 | `src/components/shared/TaskModal.tsx` | 32 | `set-state-in-effect`: `setTitle(task.title)` inside useEffect | **error** |
| 12 | `src/components/views/ProjectsView.tsx` | 166 | `no-explicit-any` in `buildTaskTree` | **error** |
| 13 | `src/components/graph/useGraphData.ts` | 610 | `no-explicit-any` (2 instances) | **error** |

**Fix for `no-explicit-any`:** Replace `any` with proper types:
- `onboarding.ts`: Use `PostgrestError | null` for error types, and specific type for `updates`
- `ProjectsView.tsx` line 166: Use `Task` type instead of `any`

**Fix for `set-state-in-effect`:** Use `useMemo` with lazy initialization or move state initialization to component's default state:
```tsx
// Instead of:
const [theme, setTheme] = useState<Theme>('dark');
useEffect(() => { const saved = localStorage.getItem('mc-theme'); if (saved) setTheme(saved); }, []);

// Use:
const [theme, setTheme] = useState<Theme>(() => {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem('mc-theme') as Theme) || 'dark';
});
```

For modals (AgentModal, TaskModal, ProjectModal, AddDriverModal), replace `useEffect` + `setState` with prop-derived initial state using a `key` prop on the modal component to reset state when the entity changes.

---

## Critical Issues

### 1. Settings Page Model Selector is Non-Functional
**File:** `src/components/views/SettingsView.tsx`  
**Lines:** 18-25  
**Severity:** 🔴 CRITICAL

The "Apply" button for the global model selector does nothing:
```tsx
const handleSaveGlobal = () => {
  // In a real implementation, this would call the OpenClaw API to change the default model
  setSaved(true);
  setTimeout(() => setSaved(false), 2000);
};
```
- The global model is stored in `useState` only — lost on refresh
- The per-agent model override (line 75) uses `defaultValue=""` on a `<select>` with no `onChange` handler and no save action
- `onUpdateAgent` prop is received but **never used** (ESLint warning, line 15)

**Fix:** 
1. Call the OpenClaw gateway API to set the default model: `PUT /api/gateway/config { defaultModel: globalModel }`
2. Wire up per-agent model select with an `onChange` that calls `onUpdateAgent({ id: agent.id, model: value })`
3. Persist `globalModel` in localStorage or Supabase as a settings record

### 2. No Agent Trigger / Manual Agent Execution from UI
**File:** `src/components/agents/AgentGrid.tsx`  
**Lines:** 46-56  
**Severity:** 🔴 CRITICAL

The "Ping" button on each agent sends a message to `/api/chat` which goes through a basic intent matcher — **it does not actually trigger the agent on the OpenClaw gateway**. The `/api/chat` route (line 29-44 of `chat/route.ts`) simply logs to Supabase activities and returns a simulated response.

The Agent Command Center (`AgentCommandCenter.tsx`) also uses `/api/chat` for its command input — same issue. Commands like "create task" work because they insert into Supabase directly, but actual agent orchestration commands don't reach OpenClaw.

**Fix:** Add a proper `/api/gateway/trigger` endpoint that sends commands to the OpenClaw gateway at `ws://localhost:18789` or via the REST API.

### 3. Hardcoded Skills List (52 skills)
**File:** `src/components/views/SkillsView.tsx`  
**Lines:** 20-107  
**Severity:** 🔴 CRITICAL

The entire skills list is a hardcoded `const SKILLS: Skill[]` array with 52 entries. This will go stale as skills are installed/removed. The "Browse ClawHub" button links to `https://clawhub.com` which likely doesn't exist.

**Fix:** Fetch skills from OpenClaw gateway API: `GET /api/gateway/skills` which should enumerate installed skills from `~/.openclaw/workspace/skills/` and npm global skills.

### 4. Hardcoded Organization/Department Structure
**Files:**  
- `src/components/views/WorkflowView.tsx` lines 14-35 — departments array
- `src/components/agents/AgentGrid.tsx` lines 19-23 — departments array

**Severity:** 🔴 CRITICAL

Agent-to-department mapping is hardcoded:
```tsx
const departments = [
  { name: 'Development', agents: ['Henok', 'Cinder', 'Kiro', 'Onyx'] },
  { name: 'Marketing', agents: ['Nahom', 'Bini', 'Lidya', 'Amen'] },
  { name: 'Strategy', agents: ['Vision', 'Cipher', 'Loki'] },
  { name: 'Operations', agents: ['Nova'] },
];
```
Any agent added/renamed won't appear in the org chart. New agents created via the UI won't show in any department.

**Fix:** Store department assignments in the `agents` Supabase table (add a `department` column) or create a `departments` table. Then derive the org chart from live data.

### 5. Hardcoded News Feed
**File:** `src/components/dashboard/NewsFeed.tsx`  
**Lines:** 20-61  
**Severity:** 🟡 WARNING (not blocking but misleading)

Both `NEWS_SOURCES` and `BUSINESS_UPDATES` arrays are entirely hardcoded with fake data (dated March 2026). The "refresh" button just re-renders the same static data.

**Fix:** Either remove the widget, or fetch real news from an RSS feed / internal updates API.

---

## Warnings

### 6. Theme Not Respected in Dashboard Widgets
**Files:**
- `src/components/dashboard/AgentCommandCenter.tsx` line 39
- `src/components/dashboard/ActivityPulse.tsx` line 37

**Severity:** 🟡 WARNING

Both components call `useThemeClasses()` without the `isDark` parameter:
```tsx
const { bg, text, border } = useThemeClasses(); // WRONG — needs isDark boolean
```
But `useThemeClasses` requires `isDark: boolean`. Without it, `isDark` defaults to `undefined` (falsy), so these components will always render in **light theme** classes regardless of the actual theme setting.

Also, `NewsFeed.tsx` line 60 hardcodes `const isDark = true;` instead of accepting theme from props.

**Fix:** Pass `theme` as a prop to these components (they're rendered inside `OverviewDashboard` which has `theme` available).

### 7. Gateway Status API Points to Wrong Port
**File:** `src/app/api/gateway-status/route.ts` line 3  
**Severity:** 🟡 WARNING

```tsx
const GATEWAY_URL = 'http://localhost:3114';
```
According to TOOLS.md, the OpenClaw gateway runs on port **18789**, not 3114. This means the gateway-status API will always fail (silently returning `{ connected: false, status: 'offline' }`).

Similarly, `src/app/api/feedback-autopilot/route.ts` line 11 uses `ws://localhost:3114/ws`.

**Fix:** Change to `http://localhost:18789` or use an env variable `GATEWAY_URL`.

### 8. System Info Hardcoded in Settings
**File:** `src/components/views/SettingsView.tsx` lines 88-95  
**Severity:** 🟡 WARNING

```tsx
{ label: 'Default Model', value: 'Gemini Pro' },
{ label: 'Node', value: 'v22.22.1' },
```
These should be fetched from the gateway status API.

### 9. Sidebar "Soon" Items Navigate to Dashboard
**File:** `src/components/layout/Sidebar.tsx` lines 48-67  
**Severity:** 🟡 WARNING

Sidebar items like "Cron", "Webhooks", "GitHub", "Security" all have `id: 'dashboard'` which means clicking them navigates to the Overview dashboard instead of showing a "coming soon" page or being disabled.

### 10. Chat API Returns SSE but Command Center Expects JSON
**File:** `src/app/api/chat/route.ts` lines 30-46  
**File:** `src/components/dashboard/AgentCommandCenter.tsx` lines 80-90  
**Severity:** 🟡 WARNING

The `/api/chat` route returns a `ReadableStream` (Server-Sent Events), but the `AgentCommandCenter` parses the response as JSON:
```tsx
const data = await response.json(); // This won't work with an SSE stream
```
This means the command input will likely throw an error or return unexpected results.

**Fix:** Either make the chat API return JSON for simple commands, or update the frontend to consume the SSE stream properly.

### 11. Duplicate "Insights" in Sidebar Navigation
**File:** `src/components/layout/Sidebar.tsx` lines 37-46  
**Severity:** 🟡 WARNING

The "OBSERVE" section has `{ id: 'insights', label: 'Logs' }` which uses the same `id` as the "Analytics" item in the main section. Clicking "Logs" will show the Analytics/Insights view, not actual logs.

### 12. `timeAgoShort` Redefined in OverviewDashboard
**File:** `src/components/dashboard/OverviewDashboard.tsx` lines 36-41  
**Severity:** ℹ️ INFO

`timeAgoShort` is defined locally despite `timeAgo` being imported from `@/lib/utils`. This is a minor DRY violation.

---

## Unused Imports & Variables (105 warnings)

### Header.tsx (5 warnings)
- Line 3: `Settings` — imported but unused
- Line 6: `NAV_ITEMS` — imported but unused
- Line 23: `view` — destructured but unused
- Line 29: `activeSessions` — assigned but unused
- Line 30: `totalSessions` — assigned but unused

### Sidebar.tsx (3 warnings)
- Line 5: `DollarSign`, `Server` — unused
- Line 7: `ChevronLeft` — unused

### ActivityView.tsx (2 warnings)
- Line 6: `Filter` — unused
- Line 16: `agents` — prop received but unused

### ApprovalsView.tsx (1 warning)
- Line 6: `X` — unused

### FeedbackTab.tsx (2 warnings)
- Line 9: `Clock`, `Loader2` — unused

### FeedbackView.tsx (4 warnings)
- Line 9: `Filter` — unused
- Line 10: `CheckCircle2` — unused
- Line 11: `ExternalLink` — unused
- Line 84: `e` — unused error variable

### InsightsView.tsx (1 warning)
- Line 6: `Zap` — unused

### ProjectsView.tsx (6 warnings)
- Line 10: `User`, `Calendar`, `Hash`, `TrendingUp` — all unused
- Line 71: `getPriorityColor` — defined but unused
- Line 91: `onEditProject` — prop destructured but unused

### SettingsView.tsx (1 warning)
- Line 15: `onUpdateAgent` — prop destructured but never called

### SkillsView.tsx (4 warnings)
- Line 6: `Wrench`, `ChevronDown`, `ChevronUp`, `RefreshCw` — all unused

### WorkflowView.tsx (6 warnings)
- Line 6: `useMemo` — unused
- Line 7: `User` — unused
- Line 43: `classes` — assigned but unused
- Line 47: `getTaskCount` — defined but unused
- Lines 81, 116: `<img>` elements — should use `next/image`

### graphStyles.ts (1 warning)
- Line 3: `NodeType` — unused

### graphScanner.ts (2 warnings)
- Line 21: `NodeMetadata` — unused
- Line 130: `allFilePaths` — unused

### utils.tsx (1 warning)
- Line 6: `AgentStatus` — unused

### OnboardingDashboard.tsx (3 warnings)
- Line 6: `OnboardingStats`, `ONBOARDING_STAGES`, `STAGE_LABELS` — all unused

### DriverCard.tsx (1 warning)
- Line 3: `OnboardingStage` — unused

### DriverKanban.tsx (1 warning)
- Line 31: `isActive` — unused

### AgentModal.tsx (1 warning)
- Line 27: `prompt` — assigned but never used

### ProjectModal.tsx (1 warning)
- Line 19: `tasks` — prop received but unused

### TaskModal.tsx (1 warning)
- Line 20: `projects` — prop received but unused

### `<img>` vs `<Image>` (5 warnings)
Multiple components use `<img>` instead of `next/image` `<Image>`:
- `AgentModal.tsx` line 63
- `ActivityView.tsx` line 60
- `WorkflowView.tsx` lines 81, 116
- `InsightsView.tsx` line 120
- `ProjectsView.tsx` line 398

---

## Info / Improvements

### 13. Avatar Images May 404
**File:** `src/lib/utils.tsx` lines 14-38  
**Severity:** ℹ️ INFO

The `AVATARS` map references local images like `/bruk.jpg`, `/nova.jpg`, etc. These need to exist in the `public/` directory. Missing avatars fall back to DiceBear API which is good, but the fallback `<img>` tags will show broken images briefly before loading the fallback.

### 14. "View Security Panel" Button Does Nothing
**File:** `src/components/dashboard/OverviewDashboard.tsx` line 301  
**Severity:** ℹ️ INFO

The "View Security Panel" button in the Security & Audit section is just a `<button>` with no `onClick` handler — it's purely decorative.

### 15. Task Modal Uses Legacy Agent Names in Placeholder
**File:** `src/components/shared/TaskModal.tsx` line 82  
**Severity:** ℹ️ INFO

The assignees input shows `placeholder="@Forge, @Shuri"` — these are legacy agent names. Should be updated to current names.

### 16. Kanban `backlog` Status Mismatch
**File:** `src/lib/types.ts` line 3 vs `src/lib/utils.tsx` lines 140-146  
**Severity:** ℹ️ INFO

`TaskStatus` includes `'backlog'` but `KANBAN_COLUMNS` and `ALL_STATUSES` don't include it. Tasks with `backlog` status would be invisible on the Kanban board.

### 17. Ethiopian Calendar Holiday Data May Be Stale
**File:** `src/components/dashboard/EthiopianCalendar.tsx` lines 16-27  
**Severity:** ℹ️ INFO

The `ETHIOPIAN_HOLIDAYS` map is hardcoded. Moveable feasts (Fasika, Eid) won't be accurate across years.

### 18. `NovaWidget` Chat Widget
**File:** `src/components/chat/NovaWidget.tsx`  
**Severity:** ℹ️ INFO

Not audited in detail but it uses the same `/api/chat` endpoint which returns SSE — likely has the same JSON parsing issue.

### 19. Sidebar Search is Non-Functional
**File:** `src/components/layout/Sidebar.tsx` lines 88-94  
**Severity:** ℹ️ INFO

The search bar (⌘K) is purely decorative — no actual search functionality is wired up.

---

## File-by-File Findings

| File | Issues Found | Severity |
|------|-------------|----------|
| `src/app/page.tsx` | Clean, well-structured main page | ✅ OK |
| `src/app/layout.tsx` | Not audited (boilerplate) | — |
| `src/lib/types.ts` | `backlog` status not used in UI | ℹ️ Info |
| `src/lib/utils.tsx` | 1 unused import | ℹ️ Info |
| `src/lib/supabase.ts` | Clean, proper fallback | ✅ OK |
| `src/lib/onboarding.ts` | 5 `any` type errors | 🔴 Error |
| `src/hooks/useTheme.ts` | `set-state-in-effect` error | 🔴 Error |
| `src/hooks/useSupabase.ts` | Clean, good real-time setup | ✅ OK |
| `src/hooks/useGatewayStatus.ts` | Clean | ✅ OK |
| `src/components/layout/Sidebar.tsx` | 3 unused imports, duplicate `insights` ID, non-functional search, "soon" items navigate to dashboard | 🟡 Warning |
| `src/components/layout/Header.tsx` | 5 unused imports/variables | 🟡 Warning |
| `src/components/dashboard/OverviewDashboard.tsx` | Dead "View Security Panel" button, redundant `timeAgoShort` | ℹ️ Info |
| `src/components/dashboard/AgentCommandCenter.tsx` | Wrong `useThemeClasses()` call (no isDark), chat API SSE/JSON mismatch | 🟡 Warning |
| `src/components/dashboard/ActivityPulse.tsx` | Wrong `useThemeClasses()` call (no isDark), `any` type on line 49 | 🟡 Warning |
| `src/components/dashboard/NewsFeed.tsx` | Fully hardcoded news data, `isDark` hardcoded to `true` | 🟡 Warning |
| `src/components/dashboard/EthiopianCalendar.tsx` | Hardcoded holidays | ℹ️ Info |
| `src/components/dashboard/TokenCostWidget.tsx` | Clean, good fallback | ✅ OK |
| `src/components/dashboard/StatsCards.tsx` | Not audited (likely used elsewhere) | — |
| `src/components/views/SettingsView.tsx` | Model selector non-functional, `onUpdateAgent` unused, hardcoded system info | 🔴 Critical |
| `src/components/views/SkillsView.tsx` | 52 hardcoded skills, dead link to clawhub.com, 4 unused imports | 🔴 Critical |
| `src/components/views/WorkflowView.tsx` | Hardcoded departments/agents, 6 unused variables, `<img>` usage | 🟡 Warning |
| `src/components/views/ActivityView.tsx` | 2 unused imports, `<img>` usage | ℹ️ Info |
| `src/components/views/ApprovalsView.tsx` | 1 unused import | ℹ️ Info |
| `src/components/views/FeedbackView.tsx` | 4 unused imports | ℹ️ Info |
| `src/components/views/FeedbackTab.tsx` | 2 unused imports | ℹ️ Info |
| `src/components/views/InsightsView.tsx` | 1 unused import, `<img>` usage | ℹ️ Info |
| `src/components/views/ProjectsView.tsx` | 6 unused vars, 1 `any` error, `onEditProject` unused, `<img>` usage | 🔴 Error |
| `src/components/shared/AgentModal.tsx` | `set-state-in-effect` error, `prompt` unused, `<img>` usage | 🔴 Error |
| `src/components/shared/TaskModal.tsx` | `set-state-in-effect` error, `projects` unused | 🔴 Error |
| `src/components/shared/ProjectModal.tsx` | `set-state-in-effect` error, `tasks` unused | 🔴 Error |
| `src/components/shared/FeedbackModal.tsx` | Clean | ✅ OK |
| `src/components/shared/FeedbackButton.tsx` | Not audited | — |
| `src/components/board/KanbanBoard.tsx` | Generally clean | ✅ OK |
| `src/components/agents/AgentGrid.tsx` | Hardcoded departments, ping doesn't actually trigger agents | 🟡 Warning |
| `src/components/feedback/FeedbackStats.tsx` | Clean | ✅ OK |
| `src/components/graph/*` | 2 unused vars, 2 `any` errors | 🟡 Warning |
| `src/components/onboarding/*` | `set-state-in-effect` errors, unused imports | 🟡 Warning |
| `src/app/api/chat/route.ts` | Returns SSE, basic intent matching only, no gateway integration | 🟡 Warning |
| `src/app/api/gateway-live/route.ts` | Reads static JSON file — works if file is updated | ✅ OK |
| `src/app/api/gateway-status/route.ts` | Wrong port (3114 vs 18789) | 🟡 Warning |
| `src/app/api/feedback/route.ts` | Clean | ✅ OK |
| `src/app/api/feedback/[id]/route.ts` | Not audited | — |

---

## Architectural Concerns

### 1. No Authentication
There's no auth layer on any API routes or on the dashboard itself. Anyone who can reach the URL can view all data and make changes. The Vercel SSO only applies to direct Vercel URLs, not custom domains.

### 2. Mixed Data Sources
- Tasks, agents, projects, activities → Supabase (live, real-time) ✅
- Skills → Hardcoded array ❌
- News → Hardcoded array ❌
- Department assignments → Hardcoded array ❌
- Gateway status → Static JSON file on disk ✅ (updated by cron)
- System info in Settings → Hardcoded strings ❌
- Model selection → Local state only ❌

### 3. No Error Boundaries
There are no React Error Boundaries. A runtime error in any view component will crash the entire dashboard.

---

## Recommended Fix Priority

### Phase 1: Unblock Vercel Deploy (1-2 hours)
1. Fix 5 `any` types in `onboarding.ts` → use `PostgrestError` 
2. Fix `useTheme.ts` → lazy state initialization
3. Fix modal `set-state-in-effect` errors → use `key` prop pattern
4. Fix `any` in `ProjectsView.tsx` and `useGraphData.ts`
5. Remove or prefix unused variables with `_`

### Phase 2: Make Core Features Actually Work (4-6 hours)
1. **Settings model selector** → call OpenClaw API + persist
2. **Gateway status port** → fix to 18789
3. **Chat API** → fix SSE/JSON mismatch in command center
4. **Skills list** → fetch from gateway API
5. **Theme consistency** → pass `isDark` to all dashboard widgets

### Phase 3: Remove Hardcoded Data (2-3 hours)
1. Department assignments → Supabase `agents.department` column
2. News feed → real RSS or remove widget
3. System info → fetch from gateway

### Phase 4: Add Missing Features (4-8 hours)
1. Agent trigger from UI → gateway WebSocket integration
2. Sidebar search (⌘K) → implement command palette
3. Security panel → link to healthcheck skill
4. Sidebar "soon" items → proper "coming soon" state or remove
5. Error boundaries for each view

---

*End of audit report.*
