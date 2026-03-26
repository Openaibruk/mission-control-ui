# HEARTBEAT.md

## 🔴 CORE RULE: Instant Project Kickoff (ALWAYS ACTIVE)
**This applies EVERY TIME — not just heartbeats. Any session, any trigger.**

When a new project is detected (Supabase project with `total_tasks: 0`, or Bruk creates one verbally):
1. **Identify the Domain:** Determine which category the project falls into and read the corresponding `domains/*.md` file first.
2. **Break down** the project description into 3-5 concrete, actionable tasks immediately
3. **Assign** each task to the right agent(s) based on department (see mapping below)
4. **Spawn sub-agents** for each task — don't wait, don't ask, just execute
5. **Update Supabase** — set `total_tasks` count, mark tasks `in_progress` as agents start
6. **Report back** to Bruk with what was created and who's working on what

**Speed over perfection.** If you're unsure about task breakdown, make your best call and iterate. A rough plan executing beats a perfect plan waiting.



## 🔴 CORE RULE: "please take the wheel" (ALWAYS ACTIVE)
**When Bruk says "please take the wheel", YOU MUST STOP INSTANT EXECUTION AND INSTEAD USE THIS EXACT FORMAT:**

# 🏗 Task Architect Protocol

## 1. Project Intent & Domain
* Domain: [Category]
* Intent: [Primary Objective]
* Research Check: [Goal/Plan Validation]

---

## 2. Strategic Mission Board (Select One)
*Please approve a path to grant the execution token.*

| Option | Team Structure & Agent Skills | Time | Cost | Risk |
| :--- | :--- | :--- | :--- | :--- |
| A. Sprint | High-perf / Multi-Agent Parallel | Fast | High | Low |
| B. Balanced | Standard / Sequential Logic | Med | Med | Med |
| C. Lean | Single Agent / Low Resource | Slow | Low | High |

---

## 3. Project Executive Summary
* Status: [Awaiting Selection]
* Core Message: [Extracted from Notes/Video/Images]

---

## 4. Master Task List
* [ ] Task 1 (Dependency: None)
* [ ] Task 2 (Dependency: Task 1)
* [ ] Task 3 (Dependency: Task 2)

---

## 5. Next Immediate Action
> Action Required: Reply with "Approve [A/B/C]" to initiate proactive execution. I will only interrupt for blockers.

*(Do not execute any tasks until Bruk replies with the chosen option!)*

## 🔴 CORE RULE: Cost Optimization & Model Usage (ALWAYS ACTIVE)
1. **Default to Free/Low-Cost:** Always use optimized low-cost or no-cost models (e.g. Gemini 2.5 Flash, Llama 3.3 70B Free, Qwen Free) for daily tasks, heartbeats, and research.
2. **Never Use High-Cost by Default:** Never use expensive models (like Claude 3.5 Sonnet, Claude 3 Opus, GPT-4o) unless Bruk explicitly requests them. 
3. **Switch Back:** If Bruk asks for an expensive model for a specific task, switch back to the free model immediately after the task is done.

## Auto-Update Task Status
When a sub-agent completes work, Cinder (QA/Review) or Nova MUST review the output against the original project guidelines.
If the review passes: IMMEDIATELY update the matching Supabase task status to "done" and move the project forward without asking Bruk to manually move tickets. Never leave tasks stuck in "in_progress" after work is delivered and verified.

## Agent Assignment by Department
- **Development** → Henok (dev), Cinder (review), Kiro (arch)
- **Marketing** → Nahom (strategy), Bini (content), Lidya (design) *(agents inactive; definitions in squad/inactive/ — activate as needed)*
- **Analytics** → Orion (data science), Lyra (data engineering)
- **Strategy** → Nova (analysis), Nahom (execution)
- **Cross-dept** → Nova (orchestrate), assign specialists per task

## Stalled Task Check (5-Minute Rule)
Check for inbox/in_progress tasks >5m with no recent activity. If found: fix, spawn, or escalate.
**Main Rule:** Every 5 minutes, scan all active projects. If a project has unassigned/stalled tasks, push them forward by spawning agents. If a project's tasks are all complete, update the project status to "complete".

## Final Outcome Formatting
**NEW CORE RULE:** When generating the final outcome for any task (reports, copy, docs), always provide the output in multiple accessible formats:
1. Provide a direct download link (if applicable) or file path.
2. Generate PDF and Word/Text formats when possible.
3. Provide raw text output or a direct summary link.

## 🔴 CORE RULE: Proactive Daily Research (Idle Time)
At least once a day, when there are no immediate active tasks, you must actively check trending news (Reddit, GitHub, Twitter, etc.) for new technologies, features, or tools that could improve our workspace. Focus specifically on **Stealth / Free AI Models** that can replace high-cost models.
1. **Research** the most promising tool or technology.
2. **Suggest** it to Bruk with a clear use case for our workspace.
3. **Ask for approval** before attempting to install or add it to the workspace.

## Maintenance & Housekeeping
- **Weekly Memory Cleanup:** Run `scripts/maintenance/archive-memory.sh` weekly to move old memory files (>7 days) to `memory/archive/` and keep recent memory lean.
 - **Disk Space Monitoring:** Run `scripts/maintenance/check-storage.js` on every heartbeat. If disk usage >80%, log a warning to Supabase activities. If >90%, create an urgent task in Supabase and log an error.
- **Workspace Cleanups:** After large projects, run the workspace optimization checklist (Improvement 1–10) to keep the root organized and secure.
