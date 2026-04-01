# skill-enhanced — Markdown Engineering Upgrades

Apply markdown engineering patterns (from markdown.engineering lessons) to workspace skills.

## What Changed (from Source Analysis)

Based on the Claude Code skills system deep dive, the key improvements are:

1. **Frontmatter matters** — `description` is the selector signal; make it one precise line
2. **when_to_use field** — explicit trigger instructions prevent wrong-context activation
3. **arguments + substitution** — `$arg1`, `$ARGUMENTS` for reusable workflows
4. **allowed-tools** — narrow permission patterns instead of broad access
5. **effort / model override** — control cost and thinking per skill
6. **paths** — conditional skills only appear when relevant files are open

## Quick Wins

### Priority 1: Update 3 most-used skills

These skills get used frequently and benefit most from enhanced frontmatter:
- task-completer
- pptx-generator  
- agentmail

### Priority 2: Add skill registry

Create `skills/registry.yaml` for discovery and documentation (Claude doesn't
walk dirs; it benefits from a central index)

### Priority 3: Memory layering

Reorganize memory per the 3-layer model:
- Layer 1: Auto Memory → `memory/facts/` (already exists, just refine)
- Layer 2: Session Memory → `memory/sessions/` (NEW)
- Layer 3: Daily Logs → `memory/YYYY-MM-DD.md` (already exists)

## Implementation Status

- [x] SKILL-MD-SPEC.md template created
- [x] MEMORY.md restructured with index pattern
- [ ] task-completer skill enhanced with enriched frontmatter  
- [ ] pptx-generator skill enhanced
- [ ] agentmail skill enhanced
- [ ] registry.yaml created
- [ ] Session memory template
