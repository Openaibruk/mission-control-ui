# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

---

## VPS & Infrastructure

- **Host:** AWS EC2 (ip-172-31-1-131)
- **Public IP:** 16.170.169.167
- **OS:** Linux 6.17.0-1009-aws (x64), Node v22.22.1
- **Disk:** 15GB root (expanded from 6.8GB)
- **Timezone:** Africa/Addis_Ababa (UTC+3)

## OpenClaw

- **Gateway:** Running on localhost:18789 (systemd)
- **Model:** mimo-v2-pro (free, OpenRouter) — $0/token
- **Auth:** Device auth disabled (controlUi.dangerouslyDisableDeviceAuth=true)
- **Memory:** 16 files, 59 chunks, vector + FTS ready
- **Heartbeat:** 30m (main session)

## GitHub

- **Auth:** gh CLI authenticated as Openaibruk (token via `gh auth login`)
- **Token:** stored in environment as `GITHUB_TOKEN` (never hardcode)
- **Repos:**
  - `Openaibruk/mission-control-ui` — Mission Control dashboard (main)
  - `Openaibruk/ipmr-feedback` — IPMR feedback system
- **Branch:** main
- **Vercel auto-deploys** on push to main

## Vercel

- **Account:** openaibruks (team_nwwNpIykCXyJFcFGki6uqq3E)
- **Auth:** Local CLI auth in `~/.local/share/com.vercel.cli/auth.json`
- **Projects:**
  - `prj_IA8A1aXQOGrVTCgY7JIV54byNGig` → mission-control-ui (original)
  - `prj_dwbq0vHr97VgqlweFFb9AlOzhSFC` → mission-control (duplicate, can remove)
- **Production URL:** `mission-control-ui-sand.vercel.app`
- **SSO:** Custom domains bypass auth; direct URLs behind Vercel SSO
- **Deployment rule:** ALWAYS deploy to original project, never create new projects

## Supabase

- **URL:** https://vgrdeznxllkdolvrhlnm.supabase.co
- **Key:** (anon key, public — in .env.local)
- **Tables:** agents, tasks, projects, activities, feedback
- **Status:** Connected and working

## Paperclip

- **Server:** localhost:3100 (was port 3100, check current)
- **Company:** ChipChip (12 agents)
- **Auth key:** See `chipchip/paperclip-auth.txt`
- **Gateway adapter:** Configured to connect to OpenClaw ws://127.0.0.1:18789
- **Status:** Running with embedded PostgreSQL

## Mission Control (Dashboard)

- **Live URL:** https://mission-control-ui-sand.vercel.app
- **Source:** Openaibruk/finmissioncontrol (original codebase)
- **Features:** Dashboard, Sidebar, 11 views (Dashboard, Agents, Tasks, Projects, Activity, Approvals, Workflow, Skills, Settings, Feedback, Insights)
- **APIs:** chat, gateway-status, feedback, feedback/[id], files, token-costs
- **Feedback system:** Button in header (not sidebar), centered popup modal, status tracking (submitted → acknowledged → in_progress → project_created → done)
- **Feedback table:** Created in Supabase (migration 003_feedback.sql)

## IPMR Feedback System

- **Live URL:** https://ipmr-feedback.vercel.app (standalone — now merged into Mission Control)
- **Source:** Openaibruk/ipmr-feedback
- **Status:** Merged into Mission Control as "IPMR" sidebar view

## OpenClaw Office (Visual Office)

- **Source:** WW-AI-Lab/openclaw-office (cloned to /home/ubuntu/.openclaw/workspace/openclaw-office)
- **Status:** Merged into Mission Control as "Office" view (virtual office floor plan)
- **Gateway WS proxy:** Was on port 3201 (socat → localhost:18789) — now integrated into MC

## Deployment Rules (CRITICAL)

1. **NEVER create new Vercel projects** — always deploy to `prj_IA8A1aXQOGrVTCgY7JIV54byNGig`
2. **Always push to GitHub first** — Vercel auto-deploys from main branch
3. **One dashboard, one URL** — everything goes in Mission Control (`sand`)
4. **Check disk space** before installing anything (`df -h /`)
5. **Git commit before deploy** — no more orphan deployments

## Token Costs (as of last run)

- Total: $2.37, 3530 calls, 6 models
- Top: claude-opus-4.6 ($1.71), gemini-2.5-flash ($0.40), gemini-3.1-pro ($0.23)

---

_Add whatever helps you do your job. This is your cheat sheet._
