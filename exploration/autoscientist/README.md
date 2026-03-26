# Autoscientist Research Agent

Integration of `karpathy/autoresearch` into OpenClaw workspace for automated deep research.

## Overview

Autoscientist takes a research question, performs automated web searches, reads sources, and synthesizes a comprehensive markdown report. Perfect for:
- Weekly market research
- Competitive analysis
- Technology deep-dives
- Trend monitoring

## Setup

1. Install dependencies (on VPS or local machine where you'll run):
```bash
pip install git+https://github.com/karpathy/autoresearch.git
```

2. (Optional) Add OpenAI API key for better synthesis:
```bash
export OPENAI_API_KEY=sk-...
```

3. Configure Telegram and Google Drive (notifications + upload):
   - **Telegram:** Create a bot via @BotFather → get `BOT_TOKEN`. Message your bot and check `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates` to get your `CHAT_ID`.
   - **Google Drive:** Create a folder (e.g., "Autoscientist Reports") and copy its ID from the URL.
   - Add to `.env` (workspace root) or export:
     ```
     TELEGRAM_BOT_TOKEN=<your_bot_token>
     TELEGRAM_CHAT_ID=<your_chat_id>
     GDRIVE_REPORTS_FOLDER_ID=<drive_folder_id>
     ```
   - Ensure `gws` CLI is logged in (or install `gdrive` CLI as fallback).

## Usage

Run a research query:
```bash
cd /home/ubuntu/.openclaw/workspace/exploration/autoscientist
python3 scripts/run_research.py "Your research question here"
```

Output: `reports/research_YYYY-MM-DD_HHMM.md`

After running, the script will:
- Save the report locally
- Send a Telegram notification with a snippet (if configured)
- Upload the full report to Google Drive (if configured) and send a Drive link via Telegram

## Integration with OpenClaw

- Reports are saved in `exploration/autoscientist/reports/`
- A Mission Control project tracks tasks: “Autoscientist Research Agent”
- You can add cron jobs to run weekly research automatically

## Examples

```bash
python3 scripts/run_research.py "What are the latest advancements in AI agents for 2025?"
python3 scripts/run_research.py "Compare Supabase vs Firebase for startup MVP"
```

## Cron Example

Run weekly research automatically (crontab -e):
```
0 9 * * 1 cd /home/ubuntu/.openclaw/workspace/exploration/autoscientist && /usr/bin/python3 scripts/run_research.py "Weekly AI agents update" >> cron.log 2>&1
```
This runs every Monday at 09:00 EAT.

## Notes

- The `autoresearch` library handles web search, content extraction, and summarization.
- You can customize the report template in `run_research.py`.
- Reports include source URLs and excerpts for traceability.
- Drive upload uses `gws drive +upload` by default; fallback to `gdrive` if needed.
- For large research, the process may take several minutes depending on network and API latency.
