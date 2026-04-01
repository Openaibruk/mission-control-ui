---
name: "task-completer"
description: "Complete Mission Control Supabase tasks end-to-end: generate deliverable, upload to Drive (gws), update task status to done"
when_to_use: "Use when a user references a task ID in Mission Control, asks to complete/pick up a task, or needs deliverables generated for a tracked task. Triggers: 'task 123', 'complete task', 'finish the deliverable', MCP analytics showing new tasks."
arguments: task_id
allowed-tools:
  - Read
  - Write
  - Bash(node:*)
  - Bash(gws:*)
  - Bash(vercel:*)
effort: high
---

# Task Completer

Automatically process and complete Mission Control tasks with AI-generated deliverables.

## Setup

Prerequisites:
- `.env` configured with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `OPENROUTER_API_KEY`
- `gws` CLI authenticated for Google Drive uploads

## Usage

```bash
node scripts/task-completer.js <task_id>
```

The script will:
1. Fetch task details from Supabase
2. Select the optimal AI model based on task type
3. Generate the deliverable content
4. Save to a markdown file in `deliverables/`
5. Upload to Google Drive using `gws drive +upload`
6. Post a message with the file link
7. Mark the task as `done`

## Model Selection

- Video production specs: tries `bytedance/seedance-1-5-pro` (paid), falls back to `stepfun/step-3.5-flash:free`
- Code/architecture: `qwen/qwen3-coder:free`
- Documentation/strategy/marketing: `stepfun/step-3.5-flash:free` (or `openrouter/free` auto-router)
- Default: `openrouter/free`

## Examples

```bash
node scripts/task-completer.js 123e4567-e89b-12d3-a456-426614174000
```

Outputs a summary of actions taken.
