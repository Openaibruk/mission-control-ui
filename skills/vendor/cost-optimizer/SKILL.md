# cost-optimizer

## Description
A skill to automatically scan for free and high-quality "stealth" models on OpenRouter, configure the workspace to use them as defaults to save costs, and ensure expensive models are only used when explicitly requested. 

## Features
- **Daily Stealth Model Scan**: Fetches OpenRouter API to find the best free models (prompt/completion = 0).
- **Workspace Config Update**: Automatically patches `openclaw.json` to use the best free model.
- **Cron Job Update**: Ensures all background tasks, heartbeats, and research tasks run on low/no-cost models.

## Usage
Run the script to optimize costs immediately:
`node ~/.openclaw/workspace/skills/cost-optimizer/scripts/optimize.js`

## Rules for Nova
1. **Always default to free/low-cost models** (like Gemini Flash, or OpenRouter free models).
2. **Never** switch to high-cost models (like Claude Opus or GPT-4o) without asking Bruk for explicit permission first.
3. If an expensive model is requested by Bruk, temporarily use it for the task (via `/model` or `session_status`), and then switch back to a low-cost model when done.