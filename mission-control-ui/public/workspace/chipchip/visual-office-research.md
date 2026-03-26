# Visual Office for AI Agents — Research Report
_Date: 2026-03-17_

## Summary

Three main options exist for adding a "visual office" to your AI agents. Each offers a different approach to visualizing agent activity in a virtual workspace.

---

## Option 1: OpenClaw Office (WW-AI-Lab) ⭐ RECOMMENDED
**Stars:** ~1.5K | **License:** MIT | **Tech:** React 19 + Vite + React Three Fiber

**GitHub:** https://github.com/WW-AI-Lab/openclaw-office

### What it is
A visual monitoring and management frontend for OpenClaw Multi-Agent systems. Renders agent work status, collaboration links, tool calls, and resource consumption through an isometric-style virtual office scene + a full-featured console.

### Key Features
- **2D Floor Plan** — SVG-rendered isometric office with desk zones, hot desks, meeting areas
- **3D Scene** — React Three Fiber 3D office with character models, holograms, portal effects
- **Agent Avatars** — Deterministic SVG avatars with real-time status animations (idle, working, speaking, tool calling, error)
- **Collaboration Lines** — Visual connections showing inter-agent message flow
- **Speech Bubbles** — Live Markdown text streaming and tool call display
- **Side Panels** — Agent details, token line charts, cost pie charts, activity heatmaps, SubAgent relationship graphs
- **Chat Bar** — Bottom-docked chat for real-time conversations with agents
- **Full Console** — Dashboard, Agents, Channels, Skills, Cron, Settings pages
- **i18n** — Chinese/English bilingual
- **Mock Mode** — Develop without a live Gateway

### Why it fits
- **Native OpenClaw integration** — connects directly to OpenClaw Gateway via WebSocket
- Works with both local and remote Gateways
- `npx @ww-ai-lab/openclaw-office` — instant start
- Most mature option with full console management
- React/Next.js stack aligns with your current MC dashboard tech stack

### Setup
```bash
npx @ww-ai-lab/openclaw-office
```
Or clone and customize:
```bash
git clone https://github.com/WW-AI-Lab/openclaw-office.git
cd openclaw-office
pnpm install
pnpm dev
```

---

## Option 2: Star-Office-UI (Ring Hyacinth)
**Stars:** ~4,800 | **License:** MIT (code) / Non-commercial (art) | **Tech:** Flask + Phaser.js

**GitHub:** https://github.com/ringhyacinth/Star-Office-UI

### What it is
A pixel-art style virtual office dashboard. Turns invisible work states into a cozy pixel-art space with characters, daily notes, and guest agents.

### Key Features
- **6 Status Zones** — idle (sofa), writing/researching/executing/syncing (desk), error (bug area)
- **Animated Pixel Characters** — Characters walk to different office areas based on agent status
- **Yesterday Memo** — Auto-reads from `memory/*.md` files and displays daily work log
- **Multi-Agent Support** — Invite other agents via join keys
- **AI Background Generation** — Gemini API for office decoration
- **Desktop Pet Mode** — Electron transparent window mode
- **i18n** — Chinese/English/Japanese

### Why it might fit
- Highest community adoption (4.8K stars)
- Very lightweight (Python Flask backend)
- Pixel art aesthetic is fun and engaging
- Good for status visualization

### Why it might NOT fit
- **Python backend** (doesn't align with your JS/TS stack)
- Art assets are non-commercial only
- Less management UI — more of a visualizer than a dashboard
- Not a Next.js component — would need integration work

### Setup
```bash
git clone https://github.com/ringhyacinth/Star-Office-UI.git
cd Star-Office-UI
python3 -m pip install -r backend/requirements.txt
cp state.sample.json state.json
cd backend && python3 app.py
# Open http://127.0.0.1:19000
```

---

## Option 3: Pixel Agents (VS Code Extension)
**Stars:** ~4,300 | **License:** MIT | **Tech:** VS Code Extension + TypeScript

**VS Code Marketplace:** https://marketplace.visualstudio.com/items?itemName=pablodelucca.pixel-agents

### What it is
A VS Code extension that adds animated pixel art characters to represent AI coding agents in your editor.

### Key Features
- 6 character styles showing coding, searching, or idle states
- Real-time task tracking
- Sub-agent delegation visualization
- Customizable virtual office design
- Character selection

### Why it might NOT fit
- **VS Code only** — not a web dashboard
- Windows only currently
- Designed for coding agents, not general-purpose agents
- Not integrable with your Mission Control dashboard

---

## Comparison Table

| Feature | OpenClaw Office | Star-Office-UI | Pixel Agents |
|---------|----------------|----------------|--------------|
| Type | Web Dashboard | Web Dashboard | VS Code Extension |
| Stack | React + R3F | Flask + Phaser.js | VS Code API |
| OpenClaw Integration | ✅ Native | ✅ Via Skill | ❌ No |
| 2D Office | ✅ Isometric SVG | ✅ Pixel Art | ✅ Pixel Art |
| 3D Office | ✅ React Three Fiber | ❌ No | ❌ No |
| Agent Management | ✅ Full Console | ⚠️ Status Only | ⚠️ Status Only |
| Chat with Agents | ✅ Built-in | ❌ No | ❌ No |
| Multi-Agent | ✅ Yes | ✅ Yes | ✅ Yes |
| Mobile | ✅ Responsive | ✅ Responsive | ❌ No |
| Cost Tracking | ✅ Token charts | ❌ No | ❌ No |
| i18n | CN/EN | CN/EN/JP | EN |

---

## Recommendation

**OpenClaw Office (WW-AI-Lab)** is the best fit because:

1. **Native OpenClaw integration** — connects directly to your Gateway via WebSocket
2. **Full management console** — not just a visualizer, but a complete agent management UI
3. **React/Next.js stack** — aligns with your Mission Control tech stack
4. **Can be embedded** — React components could be integrated into Mission Control
5. **Active development** — recent commits, responsive maintainers

### Integration with Mission Control

Two approaches:
1. **Separate deployment** — Run OpenClaw Office as a standalone app on a different port/domain
2. **Embed into MC** — Extract the 2D/3D office components from OpenClaw Office and embed them as a new "Office" view in Mission Control's sidebar

### Next Steps
1. Deploy OpenClaw Office standalone to test with your OpenClaw Gateway
2. If it works well, integrate the office view into Mission Control as a new tab/view
3. Connect your agent statuses (Nova, Henok, Cinder, Kiro, etc.) to the visual office
