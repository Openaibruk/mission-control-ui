# Domain: Workspace Improvement (System & Infrastructure)

**Path:** `/home/ubuntu/.openclaw/` & `/home/ubuntu/.openclaw/workspace/`
**Focus:** OpenClaw core configuration, Gateway, AgentSkills, Cron jobs, Cost optimization, OpenViking.

## Key Tech Stack
- Node.js (OpenClaw)
- Bash / Shell (System automation)
- OpenClaw Configuration (`openclaw.json`)
- Python & Go (OpenViking Context DB)

## Key Skills
- `cost-optimizer`
- `active-maintenance`
- `skill-creator`
- `healthcheck`

## Golden Rules
1. **Stability First:** Do not break the OpenClaw Gateway. If modifying `openclaw.json`, verify syntax before saving.
2. **Reload Configs:** Always prompt Bruk to run `openclaw gateway restart` after making configuration changes.
3. **Cost Control:** Always use Free models (like Gemini Flash or Llama-70B:free) for background tasks, maintenance, and agent orchestration. High-cost models (Opus, GPT-4o) are only for explicitly requested complex tasks.