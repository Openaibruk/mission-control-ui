# Workflow Evaluation: BMAD-Inspired vs Original

**Evaluator:** Yonas (Research & UX)  
**Date:** 2026-03-16  
**Context:** Pilot sprint completed (Driver Onboarding Tracker)

---

## 1. Pros of New Workflow

### Structure & Clarity
- **Clear phase gates:** Analysis → Planning → Solutioning → Implementation gives work a natural rhythm. No more jumping straight to code without understanding the problem.
- **Documented decisions:** Architecture docs and ADRs mean rationale is captured, not lost in chat logs.
- **Role clarity:** The 5-agent mapping (Nova/PM, Henok/Dev, Cinder/QA, Kiro/Architect, Onyx/Security) removes "who does what" ambiguity.

### Quality Improvements
- **PRD process forces thinking:** Writing down requirements before coding catches edge cases and reduces rework.
- **Architecture review before implementation:** Catching design flaws before code is written is far cheaper than refactoring.
- **Separate QA agent:** Code review by someone other than the implementer actually happens now.

### Sprint Mechanics
- **Sprint status tracking:** `sprint-status.yaml` gives a clear single source of truth for what's in flight.
- **Point estimation:** 13 points across 4 stories gives a realistic view of scope.
- **Retrospective structure:** Built-in space to capture "what went well" and "to improve" — enables actual process improvement.

### Consistency
- **Templates ensure minimum viable docs:** Every feature now gets baseline documentation, not "good enough" notes that vary wildly in quality.
- **Track selection:** Full Feature (10+ pts) vs Quick Flow (1-5 pts) vs Bug Fix gives the right level of process for the right size task.

---

## 2. Cons & Risks

### Overhead
- **More upfront work:** A 10+ point feature now requires PRD + Architecture + Epic creation before any code. For genuinely small tasks, this is bureaucratic delay.
- **Pilot showed this:** The Driver Onboarding Tracker was a pilot — but real-world small bugs or quick tweaks will chafe at this process.

### Risk of Process Fetishization
- **Templates can become cargo cult:** The danger is doing "the process" for its own sake rather than when it adds value.
- **Over-documentation:** Writing a full 4-page PRD for a 1-point task is waste.

### Agent Role Bottlenecks
- **Kiro (Architect) is a single point:** If Kiro is unavailable, architecture reviews stall.
- **Nova does too much:** Analyst + PM + SM + Scribe + UX = Nova is essentially the entire management layer. This is fine for now, but won't scale if the team grows.

### Incomplete Feedback Loop
- **Cinder review didn't complete in pilot:** The implementation happened but QA review is "pending." If this is typical, the "Review" gate becomes aspirational.
- **No velocity data yet:** Can't tell if the 13-point sprint was realistic or wildly optimistic.

### Tooling Gap
- **YAML sprint status lives in git, not Supabase:** The official task system is Supabase, but sprint tracking is a separate file. This creates sync overhead and potential drift.
- **No automation:** Templates exist but nothing auto-creates tasks or assigns agents.

---

## 3. Overhead Analysis: Is It Worth It?

| Task Size | Old Workflow (Ad-hoc) | New Workflow (BMAD) | Verdict |
|-----------|----------------------|---------------------|---------|
| **Bug fix (1 pt)** | Chat: "fix this bug" → code | Bug template (3 steps) | **Overkill** |
| **Small feature (3 pts)** | "Add this button" → code | Quick Flow (3 steps) | **Borderline** |
| **Medium feature (5-8 pts)** | Varies | Full Feature track | **Worth it** |
| **Large feature (10+ pts)** | Usually messy | Full Feature with PRD + Architecture | **Worth it** |

### The Math

**Time spent on process (pilot):**
- PRD creation: ~30 min
- Architecture + ADR: ~30 min  
- Epic breakdown: ~15 min
- Sprint setup: ~10 min
- **Total: ~85 minutes of planning overhead**

**Time saved downstream (theoretical):**
- Fewer misaligned expectations (PRD catches this)
- Fewer mid-project pivots (Architecture review catches this)
- Clearer scope (Epic breakdown)

**Reality check:** For the pilot sprint, the implementation took roughly 2 hours. The 85 min overhead is ~40% of total time. For a real 10+ point feature, this ratio improves — but for small tasks, it's pure overhead.

---

## 4. Recommendation

**Partial adoption** — with track selection as the key mechanism.

### Adopt for:
- Features requiring multiple stories (5+ points)
- Anything involving new data models or integrations
- Architecture decisions (ADR track)
- Team-wide initiatives

### Do NOT apply to:
- Quick bug fixes
- One-off UI tweaks (copy changes, color adjustments)
- Low-risk experiments
- Hotfixes under time pressure

### Track Selection Heuristic

| Condition | Use Track |
|-----------|-----------|
| Affects data model / migrations | Full Feature |
| Requires new API endpoint | Full Feature |
| Touches multiple components | Full Feature |
| Clear scope, single story | Quick Flow |
| Bug report | Bug Fix |
| Tech stack / design decision | ADR |

---

## 5. Suggestions for Improvement

### Immediate (Quick Wins)

1. **Make track selection explicit in every task creation**
   - Add a dropdown or prefix: `[FULL]`, `[QUICK]`, `[BUG]`, `[ADR]`
   - Auto-assign workflow based on tag

2. **Add a "skip template" escape valve**
   - If someone consciously chooses to skip PRD for a small task, allow it — but require a 1-line justification
   - Prevents process from becoming blocker

3. **Move sprint-status.yaml INTO Supabase**
   - Add `sprint`, `epic`, `points`, `velocity` columns to tasks table
   - Kill the dual-source-of-truth problem

4. **Limit PRD length**
   - Hard cap: 2 pages for Full Feature, 1 page for Quick Flow
   - Prevents scope creep in documentation itself

### Short-term (Refine)

5. **Distribute Nova's workload**
   - Consider splitting "PM" from "Scrum Master" as team grows
   - Right now Nova does 5 roles — fragile

6. **Make Cinder review mandatory for Full Feature, optional for Quick Flow**
   - The pilot's incomplete review suggests we set realistic expectations
   - Quick Flow can have lighter review (self-review + one checklist item)

7. **Add velocity tracking**
   - After 3 sprints, have real data on "how many points per day"
   - Enables realistic planning

### If It Works (Nice to Have)

8. **Auto-generate tasks from PRD**
   - AI reads PRD → creates Supabase tasks automatically
   - Reduces manual task creation

9. **Build a `/bmad-start` command**
   - One command picks the right track and creates the right template
   - Lowers friction to use the system

---

## TL;DR

The BMAD-inspired workflow brings **structure, documentation, and role clarity** that the original ad-hoc approach lacked. For medium-to-large features, this is a genuine improvement.

For small tasks (1-5 points), the overhead is **disproportionate**. The solution isn't to abandon the system — it's to **select the right track** and make small tasks fast.

**Final verdict:** Keep it. Refine it. Use track selection to prevent process overhead from becoming bureaucracy.
