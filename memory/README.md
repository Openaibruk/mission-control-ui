# /memory

**Purpose:** The persistent internal state and memory of OpenClaw and its agents.

**Structure:**
* `/facts/`: Durable, cross-session truths (e.g., user preferences, environment facts). Only the Orchestrator may write here.
* `/daily-log/`: Ephemeral daily updates, maintenance logs, and raw transcripts. (Compacted automatically on a weekly basis).
* `/decisions/`: ADRs (Architecture Decision Records) and key technical decisions.
* `/handoffs/`: Used by agents to pass context between shifts or to other agents.

**Rules:**
Never flood `facts/` with verbose logs. Use `daily-log/` for routine updates.
