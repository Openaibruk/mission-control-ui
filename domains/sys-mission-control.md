# Domain: Mission Control Dashboard

**Path:** `/home/ubuntu/.openclaw/workspace/mission-control-ui/`
**Vercel Project:** `prj_IA8A1aXQOGrVTCgY7JIV54byNGig` (mission-control-ui-sand.vercel.app)
**Focus:** The Next.js web application used by Bruk to monitor agents, projects, and tasks.

## Key Tech Stack
- Next.js (App Router)
- React, Tailwind CSS
- Supabase (PostgreSQL backend)
- Vercel

## Key Skills
- `vercel-cli` (deployment, env vars, logs)
- `mission-control-db` (Supabase task/agent/feedback management)

## Golden Rules
1. **Deployment:** Always `git push origin main` to trigger Vercel auto-deployments. If manual deployment is needed, strictly deploy to the original project ID. Never create a new Vercel project.
2. **Schema Changes:** Do not modify the Supabase schema (`tasks`, `projects`, `agents`, `feedback`) without Bruk's explicit approval. Draft SQL and wait for him to run it or approve it.
3. **API Keys:** Remember `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for production Vercel builds.