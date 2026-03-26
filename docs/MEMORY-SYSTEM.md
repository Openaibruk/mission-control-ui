# Memory System Status

**Last Updated:** 2026-03-15

## Current Status

### OpenClaw Native Memory Search
- **Status:** Not working
- **Error:** "database is not open" / embedding provider failing
- **Root Cause:** No `memorySearch` config in openclaw.json, and `node-llama-cpp` is not installed for local embedding

### SQLite Database
- **Location:** `/home/ubuntu/.openclaw/memory/main.sqlite`
- **Size:** ~12MB
- **Status:** Exists but cannot be queried without `better-sqlite3` module

### Solution Implemented

A custom keyword-based search script is now available:

**Script:** `/home/ubuntu/.openclaw/workspace/scripts/memory-search.js`

**Usage:**
```bash
node scripts/memory-search.js "<query>" [--limit=N]
```

**Example:**
```bash
node scripts/memory-search.js "nova preferences" --limit=3
```

### Search Features
- BM25-like scoring for keyword matching
- Searches: MEMORY.md, IDENTITY.md, USER.md, SOUL.md, AGENTS.md, memory/*.md
- Returns ranked results with snippets

### Files Created
1. `/home/ubuntu/.openclaw/workspace/scripts/memory-search.js` - Local search script
2. `/home/ubuntu/.openclaw/workspace/MEMORY.md` - Starter long-term memory file

## To Enable Full Vector Search (Optional)

To get semantic search working in OpenClaw:

1. **Install node-llama-cpp:**
   ```bash
   cd /home/ubuntu/.openclaw
   pnpm add node-llama-cpp
   pnpm rebuild node-llama-cpp
   ```

2. **Or configure remote embeddings** (requires API key):
   ```json
   {
     "agents": {
       "defaults": {
         "memorySearch": {
           "provider": "openai",
           "model": "text-embedding-3-small",
           "remote": { "apiKey": "YOUR_KEY" }
         }
       }
     }
   }
   ```

## Memory Files Layout

```
/home/ubuntu/.openclaw/workspace/
├── MEMORY.md          # Long-term curated memory
└── memory/
    └── WORKING.md     # Daily/log memory
```
