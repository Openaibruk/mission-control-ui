# Mission Control Database Schema Analysis

*Generated: 2026-03-31 | Supabase Project: `vgrdeznxllkdolvrhlnm`*

---

## 1. `projects` Table

| Column | Type (inferred) | Notes |
|--------|----------------|-------|
| `id` | UUID | Primary key, auto-generated |
| `name` | TEXT | Project/display name |
| `description` | TEXT | Extended description (can include markdown) |
| `status` | TEXT | e.g. `active`, `complete`, `on_hold`, `done` |
| `department` | TEXT | Department/team assignment (e.g. `Cross-dept`, `Operations`, `Engineering`) |
| `total_tasks` | INT | Cached task count (currently always 0 — not auto-updated) |
| `done_tasks` | INT | Cached completed count (currently always 0 — not auto-updated) |
| `created_at` | TIMESTAMPTZ | ISO-8601 timestamp with timezone |

**Issues / Gaps:**
- `total_tasks` and `done_tasks` are never populated — they should be computed via database triggers or updated when tasks are created/completed
- No `updated_at` column (tracking last modification)
- No `assignee` or `owner` column on projects
- No `domain` column (despite domain filtering feature mentioned in task histories)
- No `color` or `icon` fields for UI rendering

---

## 2. `tasks` Table

| Column | Type (inferred) | Notes |
|--------|----------------|-------|
| `id` | UUID | Primary key, auto-generated |
| `title` | TEXT | Task title / summary |
| `description` | TEXT | Full task description (supports markdown, `[output]:` directives) |
| `status` | TEXT | States used: `inbox`, `in_progress`, `done`, `blocked`, `rejected` |
| `assignees` | TEXT[] | PostgreSQL array of agent names (inconsistent: `@Nova` vs `Nova`, some null) |
| `created_at` | TIMESTAMPTZ | ISO-8601 timestamp with timezone |
| `project_id` | UUID (FK?) | References `projects.id`; nullable for standalone tasks |
| `priority` | TEXT | Values: `low`, `medium`, `high`, `critical` (also seen: numeric `1`-`3`) |

**Issues / Gaps:**
- **Assignee format inconsistency**: Some entries use `@Name`, some just `Name`, some are `null`. This breaks agent matching logic
- **Priority format inconsistency**: Mostly text (`low`/`medium`/`high`/`critical`) but some entries use numeric strings (`"1"`, `"2"`, `"3"`)
- No `updated_at` column
- No `completed_at` timestamp (can't measure task completion time)
- No `type` column despite references in task-completer (used for model selection)
- No `deliverable_path` or `result` field to store where outputs ended up
- No `started_at` timestamp for time-to-compute metrics
- FK constraint on `project_id` appears to reference `projects` but `total_tasks`/`done_tasks` don't auto-update

---

## 3. `activities` Table

| Column | Type (inferred) | Notes |
|--------|----------------|-------|
| `id` | UUID | Primary key |
| `agent_name` | TEXT | Name of the agent that performed the action |
| `action` | TEXT | Description of the activity |
| `created_at` | TIMESTAMPTZ | Timestamp |

**Issues / Gaps:**
- Only 4 columns — very minimal
- No `task_id` or `project_id` for linking activity to context
- No `type` field (e.g. `task_complete`, `message` , `deploy`, `file_change`)
- No `metadata`/`payload` JSONB for structured context
- No `duration_ms` or performance metrics

---

## 4. `agents` Table

| Column | Type (inferred) | Notes |
|--------|----------------|-------|
| `id` | UUID | Primary key |
| `name` | TEXT | Agent display name (e.g. `Nova`, `Henok`, `Kiro`) |
| `role` | TEXT | Role/title (e.g. `Chief of Staff`, `CTO`, `Architect`) |
| `status` | TEXT | Current status (e.g. `active`, `idle`, `sleeping`) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `model` | TEXT | Assigned AI model |
| `prompt` | TEXT | System prompt or personality definition |

**Notes:**
- Missing: `department`, `avatar_url`, `last_heartbeat`, `total_tasks_completed`, `current_task_id`

---

## 5. `messages` Table

**⚠️ TABLE DOES NOT EXIST or IS NOT ACCESSIBLE**

The `public.messages` table is not found in the schema cache. This breaks the task-completer's message posting step. Either:
- The table was dropped and needs to be recreated
- RLS policies prevent access
- Table exists under a different schema

---

## Recommended Schema Improvements

### For `tasks`:
```sql
ALTER TABLE tasks
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN started_at TIMESTAMPTZ,
  ADD COLUMN completed_at TIMESTAMPTZ,
  ADD COLUMN type TEXT DEFAULT 'general',
  ADD COLUMN deliverable_url TEXT;
```

### For `projects`:
```sql
ALTER TABLE projects
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN owner_name TEXT,
  ADD COLUMN domain TEXT DEFAULT 'global',
  ADD COLUMN icon TEXT;
```

### Create `messages` table:
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  agent TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Add triggers for project task counts:
```sql
-- Auto-increment total_tasks on task insert
-- Auto-increment done_tasks when task status = 'done'
```
