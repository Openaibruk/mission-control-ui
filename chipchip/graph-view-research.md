# Graph View Research Report — Mission Control

**Author:** @Kiro (AI Architect)
**Date:** 2026-03-18
**Status:** Research Complete
**Context:** Building an Obsidian-style interactive knowledge graph for Mission Control (Next.js + React)

---

## Executive Summary

After evaluating 5 major graph visualization libraries, **Cytoscape.js** emerges as the best fit for a knowledge-graph view in Mission Control. It offers the best balance of performance, built-in graph features (clustering, search, filtering, layouts), and zero external dependencies. For a close second, **Sigma.js** is ideal if raw rendering performance on massive graphs (10K+ nodes) becomes critical.

---

## Library Comparison Table

| Criteria | D3.js | Cytoscape.js | React Flow | Sigma.js | vis.js (vis-network) |
|---|---|---|---|---|---|
| **Bundle Size (gzip)** | ~92 KB (full); ~25 KB (d3-force only) | ~134 KB | ~57 KB | ~26 KB | ~111 KB |
| **React Integration** | ⚠️ Manual (ref-based, conflicts with React's DOM) | ⚠️ Manual (ref-based wrapper needed) | ✅ Native React components | ⚠️ Manual (ref-based) | ⚠️ Manual (ref-based) |
| **Performance (1000+ nodes)** | ⭐⭐⭐ Good with WebGL/Canvas | ⭐⭐⭐⭐ Excellent (Canvas renderer) | ⭐⭐ DOM-based, ~200-500 nodes sweet spot | ⭐⭐⭐⭐⭐ Best (WebGL, designed for 10K+) | ⭐⭐⭐ Good (Canvas) |
| **Performance (10K+ nodes)** | ⭐⭐ Struggles | ⭐⭐⭐⭐ Good | ⭐ Fails (DOM bottleneck) | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Decent |
| **Built-in Layouts** | ✅ Force, tree, pack, cluster | ✅ 10+ layouts (force, concentric, grid, circle, breadthfirst, etc.) | ⚠️ Dagre/ELK via plugins | ⚠️ Force only (via graphology-layout) | ✅ Force, hierarchical, etc. |
| **Zoom/Pan** | Manual implementation | ✅ Built-in | ✅ Built-in | ✅ Built-in | ✅ Built-in |
| **Search/Filter** | Manual | ✅ Built-in (`cy.filter()`, selectors) | Manual | Manual | Manual |
| **Node Styling** | ✅ Full (SVG) | ✅ Full (CSS-like selectors) | ✅ Full (React components) | ✅ GL shaders | ✅ Canvas + CSS |
| **Animations** | ✅ Excellent (transitions) | ✅ Good | ✅ Good | ✅ Good | ✅ Good |
| **Clustering** | Manual | ✅ Built-in (collapse/expand) | Manual | Manual | ✅ Built-in |
| **Touch Support** | Manual | ✅ Built-in | ✅ Built-in | ✅ Built-in | ✅ Built-in |
| **Community** | Massive (110K+ stars) | Strong (10K+ stars, active) | Strong (21K+ stars, XYFlow team) | Moderate (11K+ stars, active) | Moderate (4K+ stars, maintenance mode) |
| **License** | ISC | MIT | MIT | MIT | MIT |
| **Dependencies** | 30 submodules | **Zero** | 3 (zustand, classcat, @xyflow/system) | 2 (events, graphology-utils) | 5 peer deps |
| **Last Major Release** | v7 (stable, mature) | v3.33 (2024) | v12 (2025, XYFlow rebrand) | v3.0 (2024) | v10 (maintenance) |

### Verdict per Library

- **D3.js** — Powerful but requires building everything from scratch. Best as a *utility* (d3-force) inside another lib, not as the primary graph renderer.
- **Cytoscape.js** — ⭐ **RECOMMENDED.** The Swiss army knife of graph viz. Purpose-built for network graphs with excellent API, layouts, and interactivity out of the box.
- **React Flow** — Best for node-based *editors* and *flow diagrams*. DOM-based = poor for dense knowledge graphs. Overkill features (handles, ports) we don't need.
- **Sigma.js** — Best raw WebGL performance. Ideal if we anticipate 10K+ nodes. Pair with Graphology for data model.
- **vis.js** — Legacy library in maintenance mode. No compelling reason to choose over Cytoscape.

---

## Recommended Tech Stack

### Primary: **Cytoscape.js** + React wrapper

**Why Cytoscape wins for Mission Control:**

1. **Purpose-built for network graphs** — Not a general charting lib. It understands graph theory (centrality, clustering, pathfinding).
2. **Zero dependencies** — Won't bloat the existing MC bundle. The ~134KB gzipped is justified by features.
3. **CSS-like styling** — Familiar syntax for styling nodes/edges by type, status, properties.
4. **Built-in layouts** — Force-directed (Obsidian-like), concentric, grid, hierarchical. Switch layouts via dropdown.
5. **Built-in search & filter** — `cy.filter('[type="agent"]')` selectors. No extra code.
6. **Clustering** — Collapsible compound nodes. Group files by directory, tasks by project.
7. **Battle-tested** — Used by bioinformatics, cybersecurity, enterprise dashboards.

### Supporting Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Renderer** | Cytoscape.js (Canvas) | Graph rendering, layouts, interaction |
| **React Bridge** | `react-cytoscapejs` or custom `useEffect` wrapper | Mount Cytoscape in React component |
| **Data Layer** | Zustand (already in MC) | Graph state management |
| **Layout Engine** | Cytoscape built-in (fcose, cola) | Force-directed + constraint layouts |
| **Icons/Emoji** | HTML overlay or Canvas labels | Node type indicators |
| **Realtime** | Supabase Realtime subscriptions | Live graph updates |

### Alternative (if we need 10K+ nodes): **Sigma.js v3** + Graphology

Use only if performance testing reveals Cytoscape bottlenecking. Graphology provides the data model, Sigma renders with WebGL.

---

## Data Model Proposal

### Node Types

```typescript
interface GraphNode {
  id: string;                    // Unique ID
  type: NodeType;                // Classification
  label: string;                 // Display name
  data: Record<string, any>;     // Source-specific metadata
  position?: { x: number; y: number };
  style?: NodeStyle;
}

type NodeType =
  | 'file'          // Markdown file in workspace
  | 'project'       // Mission Control project
  | 'agent'         // AI agent (Kiro, Nova, etc.)
  | 'task'          // Mission Control task
  | 'folder'        // Directory grouping
  | 'tag'           // Tag extracted from frontmatter
  | 'concept'       // Named entity from content
  | 'person'        // From contacts / mentions
  | 'event';        // Calendar events
```

### Edge Types

```typescript
interface GraphEdge {
  id: string;
  source: string;           // Source node ID
  target: string;           // Target node ID
  type: EdgeType;
  weight?: number;          // Strength / relevance (0-1)
  label?: string;
  data?: Record<string, any>;
}

type EdgeType =
  | 'link'            // Markdown [[wikilink]] or [text](url)
  | 'embed'           // ![[embedded]] reference
  | 'tag'             // File → Tag
  | 'assigned'        // Agent → Task
  | 'belongs_to'      // Task → Project
  | 'created'         // Agent → File/Project
  | 'depends_on'      // Task → Task
  | 'references'      // File → File (explicit reference)
  | 'contains'        // Folder → File
  | 'mentions';       // Any → Person
```

### Cytoscape Mapping

```javascript
// Nodes as Cytoscape elements
{ data: { id: 'file:SOUL.md', type: 'file', label: 'SOUL.md', path: 'workspace/SOUL.md' } }
{ data: { id: 'agent:kira', type: 'agent', label: 'Kira', status: 'active' } }
{ data: { id: 'tag:architecture', type: 'tag', label: '#architecture' } }

// Edges
{ data: { source: 'file:SOUL.md', target: 'tag:architecture', type: 'tag', weight: 1 } }
{ data: { source: 'agent:kira', target: 'task:42', type: 'assigned' } }
```

---

## Markdown Parsing Approach

### Wikilink Extraction

```typescript
// Regex patterns for link extraction
const WIKILINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;  // [[target|alias]]
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;       // [text](url)
const EMBED_REGEX = /!\[\[([^\]]+)\]\]/g;                     // ![[embed]]
const FRONTMATTER_TAG_REGEX = /^tags:\s*\[(.+)\]/gm;          // YAML tags
const INLINE_TAG_REGEX = /(?<!\w)#([a-zA-Z][\w/-]*)/g;        // #hashtag
```

### Frontmatter Parsing

```yaml
---
title: "SOUL.md"
tags: [core, identity]
links: [USER.md, AGENTS.md]
project: mission-control
---
```

Frontmatter `links` array → explicit edges. `tags` → tag node edges. `project` → project node edge.

### Content-Based Entity Extraction (Phase 2)

- NER-lite: detect `@mentions`, file paths, URLs, agent names
- TF-IDF or embedding similarity for concept clustering (future)

---

## UI Patterns for Graph View

### Obsidian-Inspired Layout

```
┌──────────────────────────────────────────────────────────┐
│  🔍 Search  │ Type: [All ▾]  │ Layout: [Force ▾]  │ ⚙️  │
├─────────────┴────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────┐                 │
│  │                                     │  ┌───────────┐  │
│  │      GRAPH CANVAS                  │  │ Details   │  │
│  │    (Cytoscape.js)                  │  │ Panel     │  │
│  │                                     │  │           │  │
│  │    ● files    ● agents             │  │ Name: ... │  │
│  │    ● tasks    ● projects           │  │ Type: ... │  │
│  │                                     │  │ Links:    │  │
│  │          ● tags                     │  │ • ...     │  │
│  │                                     │  │           │  │
│  │                                     │  │ [Open]    │  │
│  └─────────────────────────────────────┘  └───────────┘  │
│                                                          │
│  ● File  ■ Agent  ◆ Task  ▲ Project  ◈ Tag              │
│  Selected: 3 nodes · 5 edges                             │
└──────────────────────────────────────────────────────────┘
```

### Key UI Components

1. **Toolbar** — Search input, node type filter dropdown, layout selector, zoom controls
2. **Graph Canvas** — Full-width Cytoscape render with color-coded nodes by type
3. **Details Panel** — Slide-in right sidebar showing selected node metadata, linked files, actions
4. **Legend** — Bottom bar showing node type color/symbol mapping
5. **Mini-map** — Small overview rectangle showing current viewport position
6. **Context Menu** — Right-click → "Open file", "View task", "Filter to this group"

### Interaction Patterns

| Gesture | Action |
|---|---|
| Click node | Select + show details panel |
| Double-click node | Open file/task/agent in main view |
| Hover node | Highlight connected nodes (dim others) |
| Scroll | Zoom in/out |
| Click-drag canvas | Pan |
| Click-drag node | Reposition |
| Click edge | Show edge details |
| Search → Enter | Filter to matching nodes, fade others |
| Shift+Click | Multi-select |

### Color Scheme (Mission Control Theme)

```css
/* Node types — consistent with MC design system */
--node-file:     #3b82f6;  /* Blue */
--node-agent:    #8b5cf6;  /* Purple */
--node-task:     #f59e0b;  /* Amber */
--node-project:  #10b981;  /* Emerald */
--node-tag:      #6b7280;  /* Gray */
--node-folder:   #f97316;  /* Orange */
--node-person:   #ec4899;  /* Pink */
--node-event:    #06b6d4;  /* Cyan */

/* Edge types */
--edge-link:     #94a3b8;  /* Light gray */
--edge-assigned: #8b5cf6;  /* Purple (match agent) */
--edge-tag:      #6b7280;  /* Gray */
--edge-depends:  #ef4444;  /* Red */
```

---

## Implementation Approach

### Phase 1: Core Graph (2-3 days)

1. **`GraphView.tsx`** component with Cytoscape.js mounted via ref
2. **`useGraphData.ts`** hook — fetches files, tasks, agents, projects from MC API + Supabase
3. **`graphParser.ts`** — markdown wikilink + frontmatter extraction
4. **Node/edge element builders** — converts MC data → Cytoscape elements
5. **Basic interactions** — click to select, double-click to open, hover highlight
6. **Force-directed layout** — fcose or cola preset

### Phase 2: Polish (2-3 days)

7. **Details panel** — slide-in sidebar with node metadata
8. **Search** — filter/highlight matching nodes
9. **Type filters** — toggle node types on/off
10. **Layout switcher** — force, concentric, hierarchical, grid
11. **Responsive** — resize handling, mobile touch support

### Phase 3: Advanced (3-5 days)

12. **Real-time updates** — Supabase subscriptions → incremental graph updates
13. **Clustering** — collapse folders, group by project
14. **Mini-map** — overview rectangle
15. **Performance** — virtual rendering for large graphs, node limit + pagination
16. **Animations** — node entrance, selection pulse, search transitions

---

## Estimated Complexity

| Phase | Tasks | Estimated Time | Risk |
|---|---|---|---|
| Phase 1: Core | Cytoscape setup, data pipeline, parsing, basic interactivity | 2-3 days | Low |
| Phase 2: Polish | UI chrome (sidebar, search, filters, layouts) | 2-3 days | Low |
| Phase 3: Advanced | Realtime, clustering, mini-map, perf optimization | 3-5 days | Medium |
| **Total** | | **7-11 days** | |

### Risk Factors

- **Markdown parsing edge cases** — wikilinks with aliases, nested embeds, transclusions. Mitigate with progressive regex + test suite.
- **Graph density** — 100+ files with many cross-links could look chaotic. Mitigate with layout presets, type filters, and zoom-dependent detail.
- **Real-time sync complexity** — Graph diffing (add/remove/update nodes without full redraw). Mitigate with Cytoscape's `cy.add()` / `cy.remove()` incremental API.
- **Bundle size impact** — Adding Cytoscape (~134KB gz) to an already-loaded MC dashboard. Mitigate with Next.js dynamic import + lazy loading.

---

## References

- [Cytoscape.js Documentation](https://js.cytoscape.org/)
- [Sigma.js v3](https://www.sigmajs.org/)
- [React Flow (XYFlow)](https://reactflow.dev/)
- [D3.js Force Graph](https://d3js.org/d3-force)
- [vis-network](https://visjs.github.io/vis-network/docs/network/)
- [Obsidian Graph View](https://help.obsidian.md/Plugins/Graph+view) — design reference

---

*This report is the foundation for implementation. The 4 downstream tasks depend on these decisions. Changes to library choice should be discussed before proceeding.*
