# MEMORY.md — Development Department

## Completed Work
- PRJ-000: Mission Control Dashboard (Kanban, Supabase, Insights, Live Chat, Approvals)

## Tech Stack
- **Frontend:** Next.js 16.1.6, React, Tailwind CSS, Lucide Icons
- **Backend:** Supabase (PostgreSQL + Realtime)
- **Hosting:** Vercel (auto-deploy via CLI)
- **Package Manager:** npm

## Known Issues
- Vercel env vars must be set via CLI (`npx vercel env add`) for production builds
- Supabase tables require manual SQL creation (anon key can't run DDL)

## Lessons
- Always verify deployment after code changes. Local edits ≠ live.
- Forge needs explicit instructions to commit and push, not just write files.
