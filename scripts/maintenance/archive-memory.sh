#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="/home/ubuntu/.openclaw/workspace"
MEM_DIR="$WORKSPACE/memory"
ARCHIVE="$MEM_DIR/archive"

mkdir -p "$ARCHIVE"

echo "Archiving old memory files..."

# Move dated memory files older than 7 days (keep latest 7)
cd "$MEM_DIR"
ls -1 2026-03-*.md 2>/dev/null | while read f; do
  if [[ "$f" != "2026-03-24.md" && "$f" != "2026-03-23.md" && "$f" != "2026-03-22.md" && "$f" != "2026-03-21.md" && "$f" != "2026-03-20.md" && "$f" != "2026-03-19.md" && "$f" != "2026-03-18.md" ]]; then
    mv -v "$f" "$ARCHIVE/"
  fi
done

# Move maintenance logs older than 7 days
find "$MEM_DIR" -maxdepth 1 -name 'maintenance-*.md' -mtime +7 -exec mv -v {} "$ARCHIVE/" \;

echo "Archive complete. Current memory/ contents:"
ls -1 "$MEM_DIR"
