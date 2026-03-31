# Agent Profiles & Activity Logs — Audit Findings

## 1. AgentModal — Skills/Soul SAVE Issues

### Skills Tab: Read-Only (No Assignment)
The skills tab **only displays** available skills — there is **no mechanism to assign/unassign** skills to a specific agent:
- Skills are fetched from `/api/skills` and rendered as cards
- No checkboxes, toggles, or save button on the skills tab
- The `handleSave()` function in the profile tab does **not** include skills data — it only saves `{ name, role, status, model }`

### SOUL.md Tab: Global, Not Per-Agent
- SOUL.md is saved to disk at `/SOUL.md` — this is a **global** file, not agent-specific
- No agent-scoped soul data (e.g., `agents/{id}/SOUL.md`)
- The agent's SOUL.md is never loaded or saved based on which agent is being edited

### What's Missing
- Skills assignment UI (checkboxes or toggle per skill)
- `handleSave()` needs to include skills data in the payload sent to `onSave`
- Agent-specific SOUL.md path logic

**Quick Fix Priority:** LOW — The modal correctly lets the agent's profile settings be edited and saved. Skills and SOUL.md are informational views in this release. Full assignment/saving should be a follow-up feature.

---

## 2. ProjectDetailView — Activity Log Filtering

### Current Filter Logic (Line ~34-35)
```typescript
const projectAgentNames = new Set(projectTasks.flatMap(t => (t.assignees || []).filter(Boolean).map(a => a.replace(/^@+/, ''))));
const projectActivities = activities.filter(a => a.agent_name && typeof a.agent_name === 'string' && projectAgentNames.has(a.agent_name.replace(/^@+/, '')));
```

### Assessment: ✅ CORRECT

- **Null check works:** `a.agent_name && typeof a.agent_name === 'string'` ensures no undefined/null/number entries crash
- **@-stripping matches:** Both the Set construction and the filter use `.replace(/^@+/, '')` consistently
- **Filtering scope:** Only shows activities from agents assigned to tasks in this project — correct behavior

### One Edge Case
If a project has **no tasks with assignees**, `projectAgentNames` will be empty and **no activities** will show — even if other activities (like project creation) exist. This is acceptable given the current design intent.

---

## Conclusion
| Item | Status | Action |
|------|--------|--------|
| AgentModal profile save | ✅ Works | No fix needed |
| AgentModal skills assignment | ⚠️ Read-only | Document as known limitation |
| AgentModal SOUL.md | ⚠️ Global file | Document as known limitation |
| Activity log null check | ✅ Works | No fix needed |
| Activity log @-stripping | ✅ Works | No fix needed |
