#!/bin/bash
# Auto-scan workspace graph data and deploy to Mission Control
# Runs the scanner, copies to MC public dir, commits, and pushes to Vercel

set -e

WORKSPACE="/home/ubuntu/.openclaw/workspace"
MC_DIR="$WORKSPACE/mission-control-ui"
LOG_PREFIX="[update-graph $(date '+%Y-%m-%d %H:%M:%S')]"

echo "$LOG_PREFIX Starting graph scan..."

# 1. Run scanner
node "$WORKSPACE/scripts/workspace-scanner.js"
echo "$LOG_PREFIX Scanner complete."

# 2. Copy to MC public dir
mkdir -p "$MC_DIR/public/api"
cp "$WORKSPACE/graph-data.json" "$MC_DIR/public/api/graph-data.json"
echo "$LOG_PREFIX Copied to public/api/graph-data.json ($(wc -c < "$MC_DIR/public/api/graph-data.json") bytes)"

# 3. Commit and push (only if there are changes)
cd "$MC_DIR"
git add public/api/graph-data.json

if git diff --cached --quiet; then
  echo "$LOG_PREFIX No changes detected, skipping commit."
else
  git commit -m "chore: update graph data ($(date '+%H:%M'))"
  git push origin main
  echo "$LOG_PREFIX Pushed to origin/main — Vercel will auto-deploy."
fi

echo "$LOG_PREFIX Done."
