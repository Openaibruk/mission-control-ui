# Mission Control Deep-Dive

**Author:** @Kiro (Architecture Specialist)  
**Date:** 2026-03-17  
**Scope:** Full analysis of `mission-control-ui/` and `scripts/`  
**Version:** Mission Control v2.1

---

## 1. Executive Summary

Mission Control is a **real-time AI team operations dashboard** built as a Next.js 16 app with Supabase backend. It provides a single-pane-of-glass for managing AI agents (Nova, Cinder, Kiro, etc.), their tasks, projects, approvals, and costs. It's deployed on Vercel and uses Supabase Realtime for live updates.

It's purpose-built for the ChipChip/Bruk workflow — a single human (Bruk) orchestrating a team of AI agents across Development, Marketing, and Strategy departments. It is *not* a general-purpose platform; it's tightly coupled to the OpenClaw ecosystem.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 16.1.6 (App Router) | React 19.2.3, Server Components |
| **Styling** | Tailwind CSS v4 | Dark/light theme with `useTheme` hook |
| **Backend** | Supabase (PostgreSQL) | Direct client access, no ORM |
| **Realtime** | Supabase Realtime Channels | 4 channels: tasks, activities, projects, agents |
| **Deployment** | Vercel | Auto-deploys from git |
| **Package mgr** | npm | `package-lock.json` present |
| **Language** | TypeScript 5.9.3 | Strict mode |

**Key dependencies:** `@supabase/supabase-js` (v2.99), `lucide-react` (icons), `clsx` + `tailwind-merge` (class merging), `uuid`.

---

## 3. Architecture Overview

### 3.1 File Structure

```
mission-control-ui/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Main dashboard (SPA-like single page)
│   │   ├── layout.tsx          # Root layout with Inter font
│   │   ├── api/                # API routes
│   │   │   ├── chat/route.ts   # Nova chat widget backend
│   │   │   ├── heartbeat/route.ts  # Manual heartbeat trigger
│   │   │   ├── feedback/       # Feedback CRUD API
│   │   │   ├── files/route.ts  # Workspace file server
│   │   │   └── token-costs/route.ts  # Cost data endpoint
│   │   └── onboarding/         # Driver onboarding flow
│   ├── components/
│   │   ├── board/KanbanBoard.tsx     # Drag-free Kanban task board
│   │   ├── agents/AgentGrid.tsx      # Org chart + agent management
│   │   ├── chat/NovaWidget.tsx       # Floating chat widget
│   │   ├── dashboard/                # Overview, Stats, Activity, TokenCost, Projects
│   │   ├── layout/                   # Sidebar + Header
│   │   ├── onboarding/               # Driver onboarding Kanban
│   │   ├── shared/                   # Modals (Task, Agent, Project, Feedback)
│   │   └── views/                    # All page views (11 total)
│   ├── hooks/
│   │   ├── useSupabase.ts      # Central data layer (all CRUD + realtime)
│   │   └── useTheme.ts         # Dark/light theme management
│   └── lib/
│       ├── supabase.ts         # Supabase client singleton
│       ├── types.ts            # TypeScript types + model config
│       └── utils.tsx           # Avatars, Kanban columns, helpers
├── supabase/migrations/
│   ├── 001_driver_onboarding.sql
│   └── 002_feedback_system.sql
└── scripts/
    ├── mc.js                   # CLI for Supabase operations
    ├── drive-sync.sh           # Google Drive → knowledge/ sync
    ├── memory-search.js        # Memory file search
    └── self-audit.js           # System health self-audit
```

### 3.2 Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Vercel (Next.js)                       │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │  page.tsx    │  │ API      │  │  Components          │ │
│  │  (SPA shell) │  │ Routes   │  │  (React 19)          │ │
│  └──────┬───────┘  └────┬─────┘  └──────────┬───────────┘ │
│         │               │                    │             │
│  ┌──────┴───────────────┴────────────────────┴───────────┐ │
│  │              useSupabase() Hook                        │ │
│  │  ┌─────────────────────────────────────────────────┐  │ │
│  │  │ Direct Supabase Client (anon key)               │  │ │
│  │  │ • tasks, agents, projects, activities, feedback │  │ │
│  │  │ • Realtime subscriptions (4 channels)           │  │ │
│  │  └─────────────────────────────────────────────────┘  │ │
│  └──────────────────────┬────────────────────────────────┘ │
└─────────────────────────┼──────────────────────────────────┘
                          │ WebSocket (Realtime)
                          ▼
                ┌──────────────────┐
                │   Supabase       │
                │   (PostgreSQL)   │
                │                  │
                │  Tables:         │
                │  • tasks         │
                │  • agents        │
                │  • projects      │
                │  • activities    │
                │  • messages      │
                │  • documents     │
                │  • notifications │
                │  • feedback      │
                │  • driver_       │
                │    onboarding    │
                └──────────────────┘
```

The architecture is **client-heavy** — almost all business logic lives in the browser. The server is mostly a static file server + a few API routes. This is a deliberate choice for a real-time dashboard but has tradeoffs.

---

## 4. Feature Analysis

### 4.1 Task CRUD

**Implementation:** `useSupabase.ts` hook → direct Supabase client calls.

**Task type** (`src/lib/types.ts`):
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;  // 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done' | 'approval_needed' | 'rejected' | 'backlog'
  assignees?: string[];
  project_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  cost_tokens?: number;
  output_url?: string;
  output_type?: 'file' | 'link' | 'markdown' | 'image' | 'other';
  updated_at?: string;
  created_at: string;
}
```

**CRUD operations** (all in `useSupabase.ts:62-101`):
- `addTask()` — inserts into `tasks` table with status `inbox`, logs activity
- `updateTask()` — partial update by ID, logs activity as "Bruk"
- `deleteTask()` — hard delete by ID (no soft-delete)
- `moveTask()` — status update only, with error alert on failure
- `approveTask()` — approval/rejection with activity logging

**Kanban board** (`KanbanBoard.tsx`): 5 columns (To Do → Assigned → In Progress → Review → Done). No drag-and-drop — uses a `MoveMenu` dropdown with previous/next column buttons plus a "Done (skip)" shortcut.

**Stalled detection** (`useSupabase.ts:30-38`): `countStalled()` flags tasks as stalled if `in_progress` > 1 hour or `assigned` > 2 hours. Shows amber warning badges on the board.

**Strengths:**
- Real-time sync across all clients via Supabase channels
- Stalled task detection is clever and visible
- Output file linking for done tasks with view/download via `/api/files`
- Quick-assign buttons in TaskModal

**Weaknesses:**
- No drag-and-drop Kanban (MoveMenu is functional but clunky)
- No task dependencies or subtasks
- No task templates or recurring tasks
- No bulk operations
- No search/filter on the board view
- Priority field exists in type definition but is barely used in UI
- Activity logging always attributes to "Bruk" — even when agents act via CLI
- No task history/changelog (only last action visible)

### 4.2 Agent Management

**Implementation:** `AgentGrid.tsx` — org chart visualization with department grouping.

**Agent type:**
```typescript
interface Agent {
  id: string; name: string; role: string;
  status: AgentStatus;  // 'active' | 'idle' | 'offline'
  model?: string; prompt?: string; cost_tokens?: number;
}
```

**Departments are hardcoded** in `AgentGrid.tsx:21-25`:
```typescript
const departments = [
  { name: 'Development', agents: ['Henok', 'Cinder', 'Kiro', 'Onyx'] },
  { name: 'Marketing', agents: ['Nahom', 'Bini', 'Lidya', 'Amen'] },
  { name: 'Strategy', agents: ['Vision', 'Cipher', 'Loki'] },
];
```

**Agent status** is computed from task activity timestamps (`getAgentStatusInfo()` in `utils.tsx`), not from a live heartbeat:
- < 2 min: "Working" (green pulse)
- < 10 min: "Idle" (amber)
- < 30 min: "Sleeping" (blue)
- > 30 min: "Offline" (gray)

**Ping feature:** Clicking the bell icon on an agent sends a message to the chat API as `[PING] Agent @Name has been pinged by Bruk.` — essentially just logging an activity.

**Strengths:**
- Clean org chart hierarchy: Bruk → Nova → Departments → Agents
- Per-agent task stats (done/active counts)
- Avatar system with fallback to DiceBear
- Model override per agent in Settings

**Weaknesses:**
- Departments are hardcoded in the component — not in the database
- Agent status is inferred from task data, not real-time heartbeats
- Ping is cosmetic — it logs to activities but doesn't actually wake agents
- No agent capability/skill assignment per agent
- No agent session management or process monitoring
- Agent CRUD is minimal (name, role, status, model)

### 4.3 Projects

**Project type:**
```typescript
interface Project {
  id: string; name: string; description?: string;
  status: 'active' | 'complete' | 'on_hold';
  department?: string;
  done_tasks: number; total_tasks: number; cost_tokens?: number;
}
```

**Implementation:** `useSupabase.ts` CRUD + `ProjectsGrid.tsx` component. Manual task count tracking (`total_tasks` incremented on task creation if `project_id` is set).

**Weaknesses:**
- `done_tasks` counter is never auto-incremented when a task moves to "done" — it's not updated anywhere in the code
- No project-level permissions or access control
- No project timeline/Gantt view
- No project templates

### 4.4 Dashboard UI

**Implementation:** `OverviewDashboard.tsx` — the main view when `view === 'dashboard'`.

**Sections:**
1. **Banner** — Gateway Control Plane header with stat badges (total, active, done, rate)
2. **Execution Summary** — 6 status buckets (Inbox, Assigned, In Progress, Review, Done, Stalled)
3. **Status Cards** — Gateway (always "Online"), Sessions (hardcoded "1"), Agents, Queue, Projects
4. **Three-column layout:** Projects list, Agent Router, Activity Stream
5. **Token Cost Widget** — fetched from `/api/token-costs` (static JSON file)
6. **Two-column:** Task Flow summary, Security + Audit stats

**Observations:**
- "Gateway Online" is hardcoded — not a real health check
- "Sessions" count is hardcoded to `1`
- The dashboard is well-designed visually (space theme, gradients, animations)
- Token costs require running an external `tokenTracker.js` script first

### 4.5 Activity Feeds

**Implementation:** `activities` table in Supabase, streamed via Realtime.

Every mutation (task create/update, agent add/update, project create, heartbeat) inserts an activity row with `agent_name` and `action` text.

**Views:**
- `ActivityFeed.tsx` — compact widget on dashboard (last 10 items, auto-scroll)
- `ActivityView.tsx` — full page with agent filter dropdown

**Weaknesses:**
- Activity is a flat text log — no structured data (no before/after diff, no entity references)
- No ability to filter by action type or date range
- No activity search
- Limited to 200 items loaded at once

### 4.6 Notifications

**Implementation:** `notifications` table exists in Supabase but has **no UI component**.

The `mc.js` CLI supports:
- `notifications:get` — fetch undelivered notifications for an agent
- `notifications:mark_read` — mark as delivered

**Status: Backend-only. No frontend exists.** Agents can check notifications via CLI, but the dashboard has no notification panel, no badge count, no notification history view.

### 4.7 Chat Widget (Nova)

**Implementation:** `NovaWidget.tsx` (floating chat bubble) → `/api/chat/route.ts`.

**Features:**
- SSE streaming with word-by-word animation (30ms per word)
- Supports: "create task [title]", "create project [name]", "status", "list tasks", "list projects", "help"
- Logs all messages to `activities` table

**Weaknesses:**
- Nova is a **scripted command parser**, not an LLM integration. It uses keyword matching (`lower.startsWith('create task')`).
- No memory — each message is independent
- No tool use — can only create tasks/projects and show stats
- No integration with OpenClaw's actual agent system
- Streaming is faked (splits response by word, not actual LLM tokens)
- The chat is a demo/scaffold, not production-quality

### 4.8 Google Drive Sync

**Implementation:** `scripts/drive-sync.sh` — a bash script using `gws` CLI.

**What it does:**
- Lists files in a hardcoded Drive folder (`1yyI14_bQ1uYv4__WRfr4gnVRD0JM_xiQ`)
- Exports Google Docs → Markdown, Sheets → CSV, Presentings → plain text
- Saves to `/home/ubuntu/.openclaw/workspace/knowledge/`

**Weaknesses:**
- Runs manually (no cron scheduling)
- Hardcoded folder ID — not configurable
- One-way sync only (Drive → local)
- No change detection — re-downloads everything each run
- No integration with Mission Control UI
- Shell script with minimal error handling

### 4.9 Model Routing

**Implementation:** `AVAILABLE_MODELS` in `src/lib/types.ts:51-60`:

```typescript
export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'google/gemini-3.1-pro-preview', label: 'Gemini Pro', provider: 'Google' },
  { id: 'openrouter/anthropic/claude-opus-4.6', label: 'Claude Opus', provider: 'Anthropic' },
  { id: 'openrouter/anthropic/claude-sonnet-4', label: 'Claude Sonnet', provider: 'Anthropic' },
  { id: 'openrouter/openai/gpt-4.1', label: 'GPT-4.1', provider: 'OpenAI' },
  { id: 'openrouter/openai/o3', label: 'o3', provider: 'OpenAI' },
  { id: 'openrouter/auto', label: 'Auto Router', provider: 'OpenRouter' },
  { id: 'openrouter/minimax/minimax-m2.5', label: 'MiniMax M2.5', provider: 'MiniMax' },
];
```

**Settings view** (`SettingsView.tsx`) provides:
- Global model selector dropdown
- Per-agent model override dropdown

**Weaknesses:**
- The "Apply" button shows a fake "✓ Saved" but **doesn't actually persist** to Supabase or OpenClaw. It only updates local state.
- Per-agent model overrides have `defaultValue=""` but no `onChange` handler — they're non-functional
- Model routing is a UI-only concept — the actual routing happens in OpenClaw's gateway, not here

### 4.10 Heartbeat Integration

**Implementation:** `/api/heartbeat/route.ts` → calls OpenClaw Gateway's `/api/cron/wake` endpoint.

Triggers a cron wake with a hardcoded instruction:
> "Read HEARTBEAT.md and check for: 1) New projects with 0 tasks... 2) Stalled inbox/in_progress tasks >1h..."

**Observation:** This is actually useful — it bridges the UI to OpenClaw's autonomous heartbeat system.

---

## 5. Scripts (`scripts/`)

### 5.1 `mc.js` — Mission Control CLI

A lightweight Node.js CLI wrapping Supabase operations. Supports:
- `agents:upsert`, `tasks:list`, `tasks:create`, `tasks:update`
- `messages:post`, `messages:list`
- `documents:create`, `documents:list`
- `activities:log`
- `notifications:get`, `notifications:mark_read`

**Used by** OpenClaw agents to interact with Mission Control from CLI/subagent contexts. This is the bridge between autonomous agents and the dashboard.

### 5.2 `drive-sync.sh`

Documented in §4.8 above.

### 5.3 `memory-search.js`

Not analyzed in detail — appears to search memory files in the workspace.

### 5.4 `self-audit.js`

A heartbeat-triggered health scanner that checks:
- Log file errors
- Disk usage
- Stale tasks
- Memory files
- Reports findings as structured output

---

## 6. Database Schema

Based on code analysis (no migration files for core tables):

| Table | Columns (inferred) | Notes |
|-------|-------------------|-------|
| `tasks` | id, title, description, status, assignees[], project_id, priority, cost_tokens, output_url, output_type, created_at, updated_at | Core table |
| `agents` | id, name, role, status, model, prompt, cost_tokens, created_at | |
| `projects` | id, name, description, status, department, done_tasks, total_tasks, cost_tokens, created_at | |
| `activities` | id, agent_name, action, created_at | Flat text log |
| `messages` | id, task_id, agent_name, content, created_at | Threaded messages per task |
| `documents` | id, ... | Barely used |
| `notifications` | id, mentioned_agent, delivered, ... | Backend only, no UI |
| `feedback` | id, title, description, category, priority, status, image_urls[], is_ipmr, created_at, reviewed_at | IPMR system |

**Security model:** All tables use Row Level Security (RLS) with `CREATE POLICY "Allow all for anon"` — meaning the anon key grants full CRUD access. This is appropriate for an internal tool but would be catastrophic for a public-facing app.

---

## 7. Strengths

### 7.1 Real-Time Architecture
The Supabase Realtime integration is well-executed. Four separate channels (tasks, activities, projects, agents) with proper cleanup on unmount (`useSupabase.ts:86-115`). Changes propagate instantly to all connected clients.

### 7.2 Clean, Consistent UI
The dark/light theme system (`useTheme.ts`) is well-designed with a centralized `useThemeClasses()` helper. Every component follows the same pattern. The space-themed dark mode with subtle gradients and star backgrounds is distinctive.

### 7.3 Thoughtful UX Details
- Stalled task detection with amber warnings
- Time-ago formatting everywhere
- Auto-scroll in activity feeds
- Loading skeleton states for every view
- Avatar system with DiceBear fallback
- "GW Connected" indicator in sidebar
- Mobile-responsive with hamburger menu
- ⌘K search placeholder (not implemented, but signals intent)

### 7.4 Dual Interface
CLI (`mc.js`) + Web UI working on the same Supabase backend. Agents can create/update tasks from subagent contexts while humans see real-time updates in the browser.

### 7.5 Feedback/IPMR System
The feedback system (`002_feedback_system.sql`, `FeedbackView.tsx`) is surprisingly well-built:
- Multi-filter (category, priority, status, search)
- Image attachment support (UI-side)
- IPMR flag
- Expandable card details with lightbox
- Proper RLS policies (separate select/insert/update/delete)

### 7.6 File Server
`/api/files` provides secure workspace file access with path traversal protection (`src/app/api/files/route.ts:15-17`):
```typescript
const resolved = path.resolve(WORKSPACE, filePath)
if (!resolved.startsWith(WORKSPACE)) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 })
}
```

---

## 8. Weaknesses

### 8.1 No Authentication
The entire app uses the Supabase anon key. Anyone with the URL has full CRUD access to all data. No login, no sessions, no user identity. The sidebar shows "Bruk / admin" but it's hardcoded HTML.

### 8.2 Client-Side Business Logic
Almost all logic lives in the browser:
- Stats calculation in `useSupabase.ts`
- Stalled detection in `useSupabase.ts` and `KanbanBoard.tsx`
- Activity logging is done client-side (insert after mutation)
- No server-side validation, no middleware, no API guards

This means a network error or race condition can leave data inconsistent (e.g., `done_tasks` count on projects is never updated).

### 8.3 Broken/Incomplete Features
| Feature | Status | Detail |
|---------|--------|--------|
| **Image upload (feedback)** | Broken | Backend silently discards images (`feedback/route.ts:49-53`) |
| **Model routing (Settings)** | Fake | "Apply" button doesn't persist (`SettingsView.tsx:26-30`) |
| **Per-agent model override** | Non-functional | No `onChange` handler, `defaultValue` only |
| **Ping agents** | Cosmetic | Logs to activity, doesn't actually trigger anything |
| **Nova chat** | Scripted | Keyword matching, not LLM. Streaming is faked word-by-word |
| **Project done_tasks** | Never updated | Counter is set at creation but never incremented |
| **Notification UI** | Missing | Table exists, no frontend |
| **⌘K command palette** | Missing | Placeholder in sidebar only |
| **Cron/Webhooks/GitHub** | Missing | Sidebar items link to `dashboard` with `real: false` |
| **Security panel** | Missing | Button exists, no view |
| **Sidebar search** | Non-functional | Static placeholder text |

### 8.4 Data Integrity Issues
- Hard delete on tasks (no soft delete, no archive)
- No foreign key enforcement visible in code (relies on Supabase schema)
- Activity logging always shows "Bruk" as actor, even for agent-initiated actions via CLI
- No transaction support for multi-table operations (e.g., task creation + activity log + project counter update)

### 8.5 No Testing
Zero test files. No Jest, Vitest, or Playwright configuration. The `qa-feedback-system.md` is a manual QA checklist by @Cinder, not automated tests.

### 8.6 Scalability Concerns
- Activities loaded with `.limit(200)` — will miss older items on busy systems
- No pagination on tasks, agents, or projects (all loaded at once)
- No search indexing
- Realtime channels are per-table (4 open WebSocket connections)

---

## 9. Comparison with Paperclip

### Paperclip's Architecture (from README analysis)

Paperclip is a **purpose-built orchestration server** for running AI agent companies. Key differences:

| Dimension | Mission Control | Paperclip |
|-----------|----------------|-----------|
| **Philosophy** | Dashboard for one team | Server for running companies |
| **Backend** | Supabase (managed Postgres) | Embedded Postgres (self-hosted) |
| **Agent model** | Status display only | Runtime agent management (heartbeats, sessions, budgets) |
| **Execution** | No execution model | Atomic task checkout, budget enforcement |
| **Multi-tenant** | Single team | Multi-company with full isolation |
| **Governance** | Approvals view (manual) | Board-level governance with rollback |
| **Cost control** | Read-only cost display | Per-agent budgets with auto-throttle |
| **Goal alignment** | Project → tasks | Company → goals → tasks (full ancestry) |
| **Agent persistence** | No state management | Persistent agent state across heartbeats |
| **Skill injection** | Static skill list view | Runtime skill injection |
| **Portability** | Tied to ChipChip setup | Export/import company templates |
| **Mobile** | Responsive web UI | Mobile-ready |
| **Ticket system** | Flat activity log | Threaded conversations with audit trail |
| **Architecture** | Client-heavy SPA | Server-side orchestration |

### What Paperclip Does Better

1. **Atomic task checkout** — prevents double-work. MC has no checkout mechanism at all.
2. **Budget enforcement** — agents stop when budget exhausted. MC only displays costs.
3. **Goal alignment** — every task carries full ancestry to company mission. MC has flat project→task.
4. **Persistent agent state** — agents resume context across heartbeats. MC agents are stateless.
5. **Multi-company isolation** — one Paperclip deployment, many companies. MC is single-tenant.
6. **Runtime skill injection** — agents learn workflows at runtime. MC's skill view is read-only catalog.
7. **Governance with rollback** — config changes are revisioned. MC has no versioning.
8. **Portability** — export/import company templates with secret scrubbing.
9. **True orchestration** — Paperclip coordinates work; MC just displays it.

### What Mission Control Does Better (or Differently)

1. **Real-time UI** — Supabase Realtime is more responsive than Paperclip's likely polling model
2. **Visual design** — MC's space-themed dark mode is more polished than typical orchestration dashboards
3. **Feedback/IPMR system** — purpose-built for product feedback, not present in Paperclip
4. **Chat widget** — even if basic, having Nova chat in the dashboard is useful
5. **Skills catalog** — the searchable/filterable skill view is good for visibility
6. **File server** — direct workspace file access from done tasks is a nice touch
7. **Faster to build** — MC is a focused dashboard, not a full orchestration platform

### The Fundamental Gap

**Mission Control is a *dashboard*. Paperclip is an *orchestration engine*.**

MC shows you what your agents are doing. Paperclip tells your agents what to do, tracks their sessions, enforces their budgets, and manages the company hierarchy. MC would need significant architectural changes — moving from a client-side Supabase app to a server-side orchestration layer — to approach Paperclip's capabilities.

---

## 10. Recommendations

### Quick Wins
1. **Fix image upload** — either implement Supabase Storage or hide the UI
2. **Fix project done_tasks counter** — increment on task status → "done"
3. **Add task search/filter** — on the Kanban board
4. **Add drag-and-drop** — for Kanban task movement
5. **Make Nova an actual LLM** — wire it to OpenClaw's chat API

### Medium-Term
6. **Add authentication** — even basic Supabase Auth with email/password
7. **Add soft-delete** — for tasks and projects
8. **Build notification UI** — the backend exists, just needs a component
9. **Fix Settings persistence** — actually save model config to Supabase
10. **Add activity filtering** — by date range, action type, entity

### Strategic
11. **Server-side validation** — move critical logic to API routes or Supabase RPC
12. **Add agent heartbeat integration** — real status from OpenClaw gateway
13. **Build the approval workflow** — it exists but needs better integration with agent execution
14. **Consider Paperclip integration** — MC could be the UI layer on top of Paperclip's orchestration, getting the best of both worlds

---

## 11. Code Quality Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| **TypeScript usage** | Good | Proper types, interfaces, strict mode |
| **Component structure** | Good | Clear separation, consistent patterns |
| **Error handling** | Fair | Some alerts(), some try/catch, some silent failures |
| **Performance** | Fair | No memoization of expensive computations, full table loads |
| **Accessibility** | Poor | No ARIA labels, no keyboard navigation, no screen reader support |
| **Testing** | None | Zero automated tests |
| **Documentation** | Poor | No inline docs, README is default Next.js boilerplate |
| **Security** | Poor | No auth, anon key grants full access, path traversal mitigated but surface is small |

---

## 12. Key Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| `src/hooks/useSupabase.ts` | 240 | **Central data layer** — all CRUD, realtime, stats |
| `src/app/page.tsx` | 160 | Main SPA shell, view routing, modal state |
| `src/components/board/KanbanBoard.tsx` | 220 | Task board with MoveMenu, stalled detection |
| `src/components/agents/AgentGrid.tsx` | 230 | Org chart, department groups, ping |
| `src/components/dashboard/OverviewDashboard.tsx` | 195 | Dashboard with stats, projects, activity |
| `src/components/chat/NovaWidget.tsx` | 195 | Floating chat, SSE streaming |
| `src/app/api/chat/route.ts` | 115 | Chat backend (keyword-matching bot) |
| `src/components/views/FeedbackView.tsx` | 330 | Full feedback management with filters |
| `src/components/views/SkillsView.tsx` | 200 | Skill catalog with search/filter |
| `src/lib/types.ts` | 60 | All TypeScript types + model config |
| `src/lib/utils.tsx` | 170 | Avatars, helpers, Kanban columns |
| `scripts/mc.js` | 80 | CLI for agent→MC operations |

---

*End of analysis. Report generated by @Kiro.*
