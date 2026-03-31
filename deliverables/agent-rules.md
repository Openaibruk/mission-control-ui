# 🤖 Agentic Rules — Autonomous Project Pipeline

*Established: 2026-03-31 | Proven with: ChipChip Strategic Review Q1 2026*

---

## 1. PROJECT CREATION RULE

When Bruk says "create a project" or "do this":
1. Parse the request into clear phases (Data → Synthesis → QA → Delivery)
2. Create a Supabase project with 4-6 specific, named tasks
3. Assign each task to a specific agent by name
4. Log activities for every agent action
5. Set realistic status progression: inbox → in_progress → done

---

## 2. SUBAGENT ORCHESTRATION RULE

- Use `sessions_spawn` with `runtime: "subagent"` and `mode: "run"` for parallel work
- Always use `openrouter/qwen/qwen3.6-plus-preview:free` for subagent tasks (free, 1M context)
- Give each subagent: role name, mission, exact steps, and specific output file path
- Track completion with `subagents(action="list")`
- If a subagent times out or hangs, `steer` it with explicit completion instructions
- NEVER spawn more than 4 parallel subagents at once

---

## 3. QA GATE RULE (Critical!)

- QA must run **in parallel** with synthesis/final work, not after
- If QA finds blocking issues, fix IMMEDIATELY before delivering to Bruk
- **Never say "done" until QA passes** — this was the PPTX brand compliance failure
- QA checks required: data accuracy, brand compliance, consistency vs source docs

---

## 4. DELIVERABLES VISIBILITY RULE

Every completed deliverable MUST be:
1. Saved to `/home/ubuntu/.openclaw/workspace/deliverables/` with clear naming
2. Uploaded to Google Drive (use `gws drive +upload`)
3. Linked in the task's `output_url` field in Supabase
4. Visible in ProjectDetailView (new `/api/deliverables` endpoint)
5. Visible in TaskModal when task status is "done"
6. Visible in FilesView under a "Deliverables" section

**Naming convention:** `{project-slug}-{deliverable-type}.{ext}`
Example: `chipchip-strategic-review-presentation.pptx`

---

## 5. TASK BOARD INTEGRITY RULE

- Every agent action → log to Supabase `activities` table
- Status changes → update task in Supabase immediately
- Project card → update `status`, `total_tasks`, `done_tasks`
- Bruk must be able to see WHO is doing WHAT on the task board in real-time

---

## 6. BRAND ENFORCEMENT RULE (PPTX)

Before declaring a PPTX "done", verify:
1. Color scheme matches brand guidelines (ChipChip: white/red/black)
2. Font family matches brand (Montserrat, not Calibri)
3. Design elements present (curves/circles if specified)
4. Numbers are mathematically correct
5. Financial projections match source documents
6. If brand compliance check fails → rebuild, don't patch

---

## 7. NEWS & UPDATES RULE

The News/Updates card on Overview must show REAL data:
- `/api/news` endpoint generates fresh content with today's date
- Business metrics pulled from Superset/B2B MCP or set to 0 for new day
- Manual refresh button on the card
- Daily cron at 8 AM EAT to refresh

---

## 8. DEPLOYMENT VERIFICATION RULE

Before telling Bruk something is "deployed":
1. Check Vercel build ID matches git commit
2. Test the actual URL returns the expected response
3. Account for Vercel cache — use cache-busting timestamps if needed
4. If auto-deploy is slow, force deploy with `vercel --prod --yes`

---

## 9. COMMUNICATION RULE

- Be specific about file paths, names, and sizes
- Provide direct Google Drive links for deliverables
- Use tables for status summaries
- Never say "working on it" without specifying which agent is doing what
- Keep status updates concise but complete

---

## 10. MODEL ROUTING RULE

- Default model: `openrouter/qwen/qwen3.6-plus-preview:free` (1M context, free)
- Subagent/worker: `openrouter/qwen/qwen3.6-plus-preview:free`
- Heavy code tasks: `qwen-coder` if available
- ALL cron jobs: use explicit `openrouter/` prefix
- Never use shorthand model IDs in OpenClaw config or cron payloads
