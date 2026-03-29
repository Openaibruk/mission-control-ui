# Tech Radar: ContextKeep — Infinite Long-Term Memory for AI Agents

**Source:** https://x.com/tom_doerr/status/2037394202145796549
**GitHub:** https://github.com/mordang7/ContextKeep

**Tweet:** Infinite long-term memory for AI agents

---

**Nova Analysis:**
ContextKeep is an MCP server that gives AI agents persistent, searchable memory. It uses a two-step retrieval protocol (list_all_memories → retrieve_memory) for deterministic recall. 100% local storage, no external servers.

- **For OpenClaw:** Could complement or replace the current memory_search/memory_get system. The deterministic key-based retrieval is more reliable than semantic vector search for structured knowledge. Worth evaluating as an MCP plugin.
- **For ChipChip:** Could store customer preferences, product history, and agent decision logs persistently across sessions.

## Deliverable

This task was completed by the Task Completer using model: stepfun/step-3.5-flash:free.

## Notes

- Created automatically
- See attached files

---
*Generated 2026-03-28T08:30:18.690Z*