# Project: Mission Control - Unified Team OS

## Objective
Transform Mission Control from a static dashboard into a real-time, collaborative operating system for the ChipChip team, where human employees and AI agents work together, share a unified identity system, and communicate in a company-wide feed.

## 1. Auth & Unified Identity (Supabase)
- **Authentication**: Email/Password via Supabase Auth.
- **Profiles Table**: A unified table for both humans and agents.
  - Fields: `id` (UUID), `username` (unique string, e.g., `@bruk`, `@nova`), `role` (`admin`, `human`, `agent`), `status` (`pending`, `approved`), `avatar_url`.
- **Approval Workflow**: 
  - Humans sign up -> Status set to `pending`.
  - Display "Waiting for Admin Approval" screen.
  - Admins (e.g., Bruk) approve users via a new Admin dashboard view.
- **Onboarding**: Upon approval, users claim their `@username` (if not auto-generated) and set their profile. Agents will have their `@username` manually seeded in the database.

## 2. Company-Wide Chat Feed
- **Global Feed**: A single, central "Company Feed" view in Mission Control.
- **Real-Time**: Built using Supabase Realtime subscriptions so messages appear instantly.
- **Message Schema**: `id`, `sender_id` (fkey to profiles), `content`, `mentions` (array of usernames), `created_at`.

## 3. Human-Agent Interaction (@Mentions)
- **Human-to-Agent**: A human can type `@nova can you draft the delivery fee email?` in the global feed.
- **Routing Engine**: 
  - Supabase Database Webhook (or Edge Function) listens for inserts on the `messages` table.
  - If an agent's `@username` is in the `mentions` array, the payload is forwarded to the OpenClaw Gateway.
- **Agent-to-Human (Proactive)**: 
  - Agents are granted autonomy to post proactively. 
  - When a background task completes (e.g., Task Completer finishes generating a document and uploads it to Drive), the agent uses the Supabase client to insert a new message into the feed: *"Hey @team, I just finished the Delivery Fee Rollout Proposal and uploaded it to Drive: [Link]"*.

## 4. Execution Plan
- **Phase 1: Database & Auth Setup** 
  - Create `profiles` and `messages` tables.
  - Setup RLS (Row Level Security) and Supabase Auth hooks.
  - Build the Auth UI (Login/Register/Pending/Onboarding).
- **Phase 2: Global Feed UI**
  - Build the real-time chat interface in Next.js.
  - Implement `@mention` highlighting and detection.
- **Phase 3: Agent Routing & Webhooks**
  - Connect Supabase inserts to OpenClaw.
  - Update agent skills to post results back to the `messages` table instead of just updating task statuses.

## Status
- **Current State**: `approved` -> Phase 2 In Progress
- **Assigned To**: Builder Agent (Phase 2)