# ChipChip Dev Team Playbook & Agent Mapping

_Based on BMAD-METHOD's structured agile framework, adapted for Mission Control_

---

## BMAD's 4-Phase Model

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: ANALYSIS        PHASE 2: PLANNING                    │
│  ┌─────────────┐          ┌─────────────┐                      │
│  │ Brainstorm  │──────────│   PRD       │                      │
│  │ Research    │          │   UX Spec   │                      │
│  │ Brief       │          └──────┬──────┘                      │
│  └─────────────┘                 │                              │
│                                  ▼                              │
│  PHASE 3: SOLUTIONING     PHASE 4: IMPLEMENTATION              │
│  ┌─────────────┐          ┌─────────────┐                      │
│  │ Architecture│──────────│ Sprint Plan │                      │
│  │ Epics/Story │          │ Story Cycle │──→ Dev → Review      │
│  │ Readiness   │          │ Retro       │                      │
│  └─────────────┘          └─────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agent Role Mapping: BMAD → ChipChip

| BMAD Agent | ChipChip Agent | Responsibilities |
|------------|---------------|------------------|
| **Analyst** | **Nova** | Brainstorming, market research, competitive analysis, ideation |
| **PM** | **Nova** | PRD creation, epic decomposition, story management, stakeholder alignment |
| **Architect** | **Kiro** | System design, ADRs (Architecture Decision Records), tech stack decisions, readiness checks |
| **UX Designer** | **Nova** | User flows, wireframes, UX specs, accessibility reviews |
| **Scrum Master** | **Nova** | Sprint planning, story creation, retrospective facilitation, blockers |
| **Dev (Implementer)** | **Henok** | Code implementation, bug fixes, feature development |
| **Dev (Reviewer)** | **Cinder** | Code review, quality validation, test coverage |
| **QA** | **Cinder** | Quality gates, acceptance criteria validation, test strategy |
| **DevOps** | **Henok** | CI/CD, deployment, infrastructure, monitoring |
| **Security** | **Onyx** | Security review, compliance, vulnerability assessment |
| **Scribe** | **Nova** | Documentation, API docs, runbooks |
| **BMad Master** | **Nova** (as Orchestrator) | General guidance, workflow routing, help |

### Key Insight
BMAD uses 12 specialized agents. We consolidate into 5 core agents with clear separation:
- **Nova** = Planning, analysis, orchestration (BMAD's Analyst + PM + SM + Scribe + UX)
- **Henok** = Building & deploying (BMAD's Dev + DevOps)
- **Cinder** = Quality & review (BMAD's QA + Reviewer)
- **Kiro** = Architecture & design (BMAD's Architect)
- **Onyx** = Security & compliance (BMAD's Security)

---

## Workflow Templates

### Template 1: Full Feature Lifecycle (BMAD Method Track)
_Use for: New features, significant changes, 10+ story points_

| Step | Agent | Action | Output |
|------|-------|--------|--------|
| 1 | Nova (Analyst) | Brainstorm & research the feature | `brief.md` |
| 2 | Nova (PM) | Create PRD with requirements | `prd-[feature].md` |
| 3 | Kiro (Architect) | Design architecture | `architecture-[feature].md` |
| 4 | Nova (PM) | Break into epics & stories | Epic/story tasks in Supabase |
| 5 | Kiro (Architect) | Readiness check | PASS/CONCERNS/FAIL |
| 6 | Nova (SM) | Sprint planning | `sprint-status.yaml` |
| 7 | Henok (Dev) | Implement stories (loop) | Code + tests |
| 8 | Cinder (Review) | Code review per story | Approved / changes needed |
| 9 | Nova (SM) | Sprint retrospective | Retro notes |

### Template 2: Quick Feature (Quick Flow Track)
_Use for: Small features, 1-5 story points, clear scope_

| Step | Agent | Action | Output |
|------|-------|--------|--------|
| 1 | Nova (PM) | Write tech spec (condensed PRD) | `tech-spec-[feature].md` |
| 2 | Henok (Dev) | Implement directly | Code + tests |
| 3 | Cinder (Review) | Quick review | Approved / changes needed |

### Template 3: Bug Fix
_Use for: Bug reports, hotfixes_

| Step | Agent | Action | Output |
|------|-------|--------|--------|
| 1 | Cinder (QA) | Reproduce & analyze bug | Bug analysis in task |
| 2 | Henok (Dev) | Fix + add regression test | Code fix |
| 3 | Cinder (Review) | Verify fix | Done |

### Template 4: Architecture Decision
_Use for: Tech stack changes, system redesign, new integrations_

| Step | Agent | Action | Output |
|------|-------|--------|--------|
| 1 | Kiro (Architect) | Research & evaluate options | ADR document |
| 2 | Nova (PM) | Assess business impact | Impact summary |
| 3 | Onyx (Security) | Security review if applicable | Security assessment |
| 4 | Kiro (Architect) | Final ADR with recommendation | `adr-[title].md` |

---

## Sprint Planning Workflow

### Before Sprint (Planning)
1. **Nova (PM):** Review backlog, prioritize stories
2. **Nova (PM):** Create sprint goal in Supabase project
3. **Nova (SM):** Generate sprint tasks from selected stories
4. **Kiro (Architect):** Flag any architecture dependencies

### During Sprint (Execution)
1. **Henok (Dev):** Pick highest-priority `inbox` task
2. **Henok (Dev):** Implement, update status to `in_progress` → `done`
3. **Cinder (Review):** Review completed work
4. **Nova (SM):** Monitor blockers, update sprint status

### After Sprint (Retrospective)
1. **Nova (SM):** Run retrospective — what went well, what didn't
2. **Nova (PM):** Carry over unfinished stories
3. **Nova (PM):** Plan next sprint

---

## Task Status Flow

```
inbox → in_progress → done
              ↓
         blocked (stalled > 1h)
              ↓
         [resolve] → in_progress
```

---

## Document Templates Location

All BMAD-inspired documents go in `chipchip/workflows/`:

```
chipchip/workflows/
├── templates/
│   ├── prd-template.md          # Product Requirements Document
│   ├── architecture-template.md # Architecture document with ADRs
│   ├── tech-spec-template.md    # Quick Flow tech spec
│   ├── epic-template.md         # Epic with user stories
│   └── sprint-status.yaml       # Sprint tracking
└── examples/
    └── [filled examples as we use them]
```

---

## How to Use This Playbook

### For a new feature request:
1. Determine track size:
   - **Quick Flow** (1-5 pts): Go straight to Template 2
   - **BMAD Method** (10+ pts): Use Template 1 full lifecycle
2. Create project in Mission Control with name + description
3. Create tasks following the template steps
4. Assign tasks to the right agent based on the mapping above

### For a bug report:
1. Use Template 3
2. Log bug as task with severity (critical/high/medium/low)
3. Assign to Cinder (QA) first for analysis

### For a tech decision:
1. Use Template 4
2. Create task with `[ADR]` prefix
3. Assign to Kiro (Architect)

---

## Next Steps

- [ ] Create document templates in `chipchip/workflows/templates/`
- [ ] Run pilot sprint using Template 1 or 2
- [ ] Refine agent roles based on real usage
- [ ] Add workflow automation (auto-assign based on task type)

---

_Playbook v1.0 — Based on BMAD-METHOD framework analysis, adapted for ChipChip dev team_
