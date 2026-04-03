# Compacted Facts — 2026-04-03

## Architecture
- **Backend:** Supabase (fully connected, credentials in workspace `.env` and `mission-control-ui/.env.local`).
- **Frontend:** Next.js dashboard deployed to Vercel.
- **Agents:** Main (Coordinator), Shuri (Product Analyst), Vision, Forge, Cipher, Pixel, Echo, Maven, Pulse.
- **Tools:** `scripts/mc.js` handles Supabase DB interactions. `vercel-cli` and `github-cli` skills installed.
- **Skill:** `mission-control-db` skill created — any model can self-serve Supabase access without asking for keys.

## Environment
- Supabase credentials stored in `/home/ubuntu/.openclaw/workspace/.env`.
- Backup source: `mission-control-ui/.env.local` (NEXT_PUBLIC_ prefixed).
- If `.env` is missing, recreate from UI env file (see mission-control-db skill).

## Completed Milestones
- All 36 initial Mission Control AI Squad tasks completed; 1 backlog item (Ollama setup — deprioritized).
- Dashboard UI overhaul, live feed, agent presence, and Nova chat widget delivered.
- Google Drive sync, write-back loop, and ChipChip KB analysis implemented.
- Smart model routing and token cost optimization configured.
