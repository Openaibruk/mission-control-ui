# Autonomous Pipeline Proposal

**Dynamic Task Generation Replacing Hardcoded Scripts**

---

## Problem Statement

Current task execution relies on manually-created scripts (`kickoff-animation.js`, `auto-project.js`, `tech-radar-ingest.js`, etc.) that are tightly coupled to specific workflows. Each new pipeline requires writing a new script, which:

- Increases maintenance burden
- Fragments logic across multiple entry points
- Duplicates model selection, file handling, and status-update code
- Makes monitoring and error handling inconsistent

## Proposed Solution: Dynamic Task Pipeline

### Architecture Overview

```
Task Inbox → Model Router → Deliverable Generator → Drive Upload → Status Update
    ↑                                                       ↓
    └────────────── Activity Log + Message Post ←──────────┘
```

### How It Works

1. **Heartbeat Poll** — A single `task-worker-heartbeat` cron job queries the Supabase `tasks` table for `status = 'inbox'` entries
2. **Model Routing** — Based on `task.title`, `task.description`, and `task.type`, an optimal model is selected:
   - **Code/Architecture** → `qwen/qwen3-coder:free`
   - **Documentation/Strategy/SOP** → `stepfun/step-3.5-flash:free`
   - **Heavy reasoning** → `nvidia/nemotron-3-super-120b-a12b:free`
   - **Default** → `openrouter/free` (auto-router)
   - **Video/spec tasks** → `bytedance/seedance-1-5-pro` (with step-3.5-flash fallback)
3. **Deliverable Generation** — The selected model receives a system prompt + task details and produces a markdown deliverable
4. **Save & Upload** — Deliverable saved to `deliverables/` directory, uploaded to Google Drive via `gws drive upload`
5. **Completion** — Message posted to task (linking deliverable), task marked `done`

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| `task-completer.js` | Main orchestrator | Single entry point for all task execution |
| `task-completer.js` | `selectModel()` | Intelligent model routing based on task content |
| `task-completer.js` | `generateDeliverable()` | AI-based content generation with fallback |
| `task-completer.js` | `uploadToDrive()` | Drive integration via `gws drive upload` |
| `heartbeat` cron | Cron job | Periodic inbox scanner (every ~5 min) |

### Benefits Over Hardcoded Scripts

| Aspect | Hardcoded Scripts | Dynamic Pipeline |
|--------|------------------|------------------|
| New workflow | Write new JS file | Add task to DB |
| Model usage | Baked into script | Selected contextually |
| Error handling | Per-script | Centralized with fallback |
| Monitoring | Ad-hoc logs | Structured Activities table |
| Code duplication | High (each script has its own boilerplate) | Zero (single codebase) |
| Flexibility | Limited to pre-written logic | Any task describable in text |

### Implementation Requirements

1. **Schema additions** needed in `tasks` table:
   - `type` column (text) — for content-aware model routing
   - `output_path` column (text) — tracking where deliverables land
   - `completed_at` column (timestamptz) — for analytics

2. **Messages table** — Currently missing from Supabase; needs creation for posting completion updates

3. **Model key** — OpenRouter API key needs to be valid and active (currently returning 401 errors)

4. **Rate limiting awareness** — Free models have usage limits; implement backoff on 429 responses

---

*This proposal replaces scripts like `auto-project.js`, `tech-radar-ingest.js`, and `kickoff-animation.js` with a single reusable pipeline.*
