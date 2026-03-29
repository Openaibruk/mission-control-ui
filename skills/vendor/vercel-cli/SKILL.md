---
name: vercel-cli
description: Use the Vercel CLI to deploy web applications, manage environment variables, inspect deployments, and configure domains. Triggers on requests to "deploy to vercel", "check vercel deployment", "vercel env", or "vercel logs".
---

# Vercel CLI Skill

This skill provides instructions for interacting with the Vercel CLI (`vercel` or `vc`).

## Core Principles
- Always check if the user is authenticated by running `vercel whoami`. If not, prompt the user to authenticate using `vercel login`.
- When deploying, use `vercel` for preview deployments and `vercel --prod` for production deployments.
- Most commands require being inside a Vercel project directory (where `.vercel/` exists or `vercel.json` is configured).

## Common Commands

### Deployment
- **Preview Deploy**: `vercel`
- **Production Deploy**: `vercel --prod`
- **Inspect Deployment**: `vercel inspect <url>`
- **Cancel Deployment**: `vercel cancel <url>`

### Project Management
- **Link Project**: `vercel link` (run this first in a new directory to link it to a Vercel project)
- **List Projects**: `vercel project ls`
- **Environment Variables**: 
  - List: `vercel env ls`
  - Add: `echo "value" | vercel env add <name> [environment]`
  - Pull (download to .env): `vercel env pull`

### Logs & Diagnostics
- **View Logs**: `vercel logs <url>` (or `vercel logs` for the latest deployment in the current dir)