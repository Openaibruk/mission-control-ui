# Graph Visualization Tools — Research & Recommendation

> **Purpose:** Obsidian-style knowledge graph view for the Mission Control workspace  
> **Date:** 2026-03-18  
> **Target:** React-based dashboard, 100–500 nodes, interactive

---

## 1. Library Comparison

### Quick Verdict Table

| Library | Bundle Size | Force Layout | Search | Zoom/Pan | Click Events | React Native | WebGL | Best For |
|---------|-----------|--------------|--------|----------|-------------|-------------|-------|----------|
| **Cytoscape.js** | ~200 KB | ✅ (CoSE, fcose) | ✅ | ✅ | ✅ | ❌ | ✅ | Network graphs, analysis |
| **React Flow** | ~90 KB | ⚠️ (via dagre/force plugin) | Manual | ✅ | ✅ | ✅ | ❌ (SVG) | Node editors, workflows |
| **D3.js** | ~90 KB (core) | ✅ (d3-force) | Manual | ✅ | ✅ | ❌ | ❌ (SVG/Canvas) | Custom everything |
| **Sigma.js** + Graphology | ~60 KB + ~30 KB | ✅ (via graphology-layout-force) | Manual | ✅ | ✅ | ❌ | ✅ | Large graph rendering |
| **vis-network** | ~150 KB | ✅ (physics) | ✅ | ✅ | ✅ | ❌ | ✅ (Canvas) | Quick prototyping |

### Detailed Analysis

#### Cytoscape.js — ⭐ Top Contender for Knowledge Graphs
- **Bundle:** ~200 KB gzipped (largest, but justified)
- **Performance:** Handles 1000+ nodes easily with Canvas/WebGL rendering. Used by Amazon, Google, Microsoft for network analysis.
- **Force Layout:** Multiple built-in algorithms — CoSE, fcose (compound spring embedder), breadthfirst, circle, grid, concentric. fcose is the closest to Obsidian's physics simulation.
- **Search/Filter:** Built-in `cy.filter()` and selector API (jQuery-like): `cy.nodes('[type="file"]')` — perfect for our node types.
- **Events:** Full event system — `tap`, `mouseover`, `select`, `box-select`, etc.
- **Styling:** CSS-like stylesheet definitions with property mappers (`width: mapData(importance, 0, 10, 20, 80)`).
- **React:** Use as a ref-based component wrapping the core library. No official React wrapper, but trivial to wrap.
- **Plugins:** Rich ecosystem — popper (tooltips), context-menus, navigator (minimap), cola/fcose layouts.
- **Cons:** Not React-native (no JSX node rendering). Steeper API if you just want something simple.

#### React Flow (xyflow) — ⭐ Best React Integration
- **Bundle:** ~90 KB gzipped (lean)
- **Performance:** SVG-based, efficient for 100–300 nodes. Virtualized rendering (only renders visible nodes). 500+ nodes can get sluggish without optimization.
- **Force Layout:** NOT built-in. Need `@dagrejs/dagre` or `d3-force` + manual positioning. The `useNodesState` / `useEdgesState` hooks make position updates easy.
- **Search/Filter:** Manual — filter your nodes array, React re-renders.
- **Events:** React-style props: `onNodeClick`, `onEdgeClick`, `onPaneClick`, `onConnect`, etc.
- **Custom Nodes:** JSX components as nodes — huge win. Want a node that shows a file preview? Just render it.
- **React:** Built for React. Hooks, components, context. Feels natural.
- **Minimap:** Built-in `<MiniMap>` component. Zoom controls built-in. Background grid built-in.
- **Cons:** Force layout requires extra work. Less suited for "hairball" knowledge graphs vs. structured flows.

#### D3.js — Maximum Flexibility, Maximum Work
- **Bundle:** ~90 KB (core); `d3-force` module is ~15 KB
- **Performance:** Good with 100–500 nodes (SVG). Canvas mode possible for larger graphs. You manage the rendering loop.
- **Force Layout:** Best-in-class `d3-force` simulation. This is what Obsidian actually uses under the hood. `d3-force-link`, `d3-force-many-body`, `d3-force-center`, `d3-force-collide`.
- **Search/Filter:** Manual — you build it.
- **Events:** Standard DOM events via selections.
- **React:** Conflict-prone. D3 wants to own the DOM; React wants to own the DOM. You need to either: (a) use D3 only for math/simulation and React for rendering, or (b) use a ref and let D3 take over. Neither is clean.
- **Cons:** You build everything. No built-in minimap, no context menus, no zoom controls. Weeks of work for what other libraries give you in an hour.

#### Sigma.js + Graphology — Performance-First
- **Bundle:** ~60 KB (sigma) + ~30 KB (graphology) = ~90 KB total
- **Performance:** WebGL-rendered. Best option for 1000+ nodes. Used by Gephi (the desktop graph viz tool) for its web exports.
- **Force Layout:** Via `graphology-layout-force` and `graphology-layout-forceatlas2`. ForceAtlas2 is the algorithm Gephi uses — excellent for knowledge graph hairballs.
- **Search/Filter:** Manual via Graphology's graph traversal methods.
- **Events:** `clickNode`, `enterNode`, `downNode`, etc.
- **React:** No official wrapper. Need a ref-based integration.
- **Cons:** Smaller community. Less documentation. Graphology adds complexity (separate data model from rendering).

#### vis-network — Legacy but Functional
- **Bundle:** ~150 KB gzipped
- **Performance:** Canvas-based, handles 1000+ nodes reasonably well.
- **Force Layout:** Built-in physics engine (Barnes-Hut). Easy to configure.
- **Search/Filter:** Basic. Not as powerful as Cytoscape's selectors.
- **Events:** Comprehensive event system.
- **React:** No official wrapper. Community wrappers exist but are stale.
- **Cons:** **Unmaintained** (last meaningful update: 2022). The vis ecosystem split — vis-network is in maintenance mode. Not recommended for new projects.

---

## 2. Knowledge Graph Approaches (How Obsidian/Logseq/Roam Do It)

### Link Detection Patterns

All three tools parse the same core patterns from Markdown files:

| Pattern | Regex | Example | Edge Type |
|---------|-------|---------|-----------|
| **Wikilinks** | `\[\[([^\]]+)\]\]` | `[[My Project]]` | `links_to` |
| **Wikilinks with alias** | `\[\[([^\]]+)\|([^\]]+)\]\]` | `[[page-id\|Display Name]]` | `links_to` |
| **Markdown links** | `\[([^\]]+)\]\(([^)]+)\)` | `[label](path.md)` | `links_to` |
| **Tags** | `#([a-zA-Z0-9/_-]+)` | `#project/mission-control` | `tagged_with` |
| **Headings** | `^#{1,6}\s+(.+)$` | `## Architecture` | `contains` |
| **Block refs** (Roam/Obsidian) | `\(\^([a-zA-Z0-9-]+)\)` | `^block-id-123` | `references` |
| **Embeds** | `!\[\[([^\]]+)\]\]` | `![[diagram.png]]` | `embeds` |

### How Obsidian Builds Its Graph

1. **Vault Scanner:** Recursively reads all `.md` files in the vault directory
2. **Parse Phase:** Extracts wikilinks, tags, headings from each file using regex
3. **Graph Construction:**
   - Each file → a **node** (labeled by filename, sized by link count)
   - Each `[[wikilink]]` → an **edge** (bidirectional in Obsidian)
   - Each `#tag` → a **node** of type "tag" with an edge to the file
4. **Rendering:** Uses a **custom force-directed layout** (heavily inspired by d3-force):
   - `charge` force (nodes repel each other)
   - `link` force (edges pull connected nodes together)
   - `center` force (prevents drift)
   - Collision detection (prevents overlap)
5. **Interaction:** Click node → opens file. Hover → shows connections. Search → filters/highlights.
6. **Local Graph:** Subset view showing only the selected file's neighborhood (1–3 hops)

### How Logseq Differs
- Uses block-level references instead of page-level
- Every bullet point can be a node with its own connections
- Renders with D3 force simulation (confirmed in source)
- More granular = more nodes = needs better performance handling

### Key Insight for Our Implementation
We don't need to replicate Obsidian's rendering engine — we need to replicate its **data model** and **interaction patterns**:
- Scan files → extract links → build graph JSON
- Render with a good library (not from scratch like Obsidian)
- Focus on the **local graph** view (most useful for navigation)

---

## 3. Recommended Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                     MISSION CONTROL DASHBOARD                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  GRAPH VIEW PAGE                          │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │   │
│  │  │  Controls    │  │  Graph View  │  │  Node Details  │  │   │
│  │  │  - Search    │  │  (Cytoscape) │  │  - Type        │  │   │
│  │  │  - Filters   │  │              │  │  - Connections │  │   │
│  │  │  - Layout    │  │  [force]     │  │  - Preview     │  │   │
│  │  │  - Color by  │  │  [zoom]      │  │  - Actions     │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────────┘  │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │  MiniMap + Legend                                │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                   │
│                              │ JSON graph data                   │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              GRAPH BUILDER SERVICE                        │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │   │
│  │  │ File Scanner │  │ Link Parser  │  │ Data Merger    │  │   │
│  │  │ - memory/*.md│  │ - wikilinks  │  │ - Supabase     │  │   │
│  │  │ - chipchip/* │  │ - markdown   │  │   projects     │  │   │
│  │  │ - *.md       │  │ - tags       │  │ - Supabase     │  │   │
│  │  │              │  │ - headings   │  │   agents/tasks │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Model

```typescript
interface GraphNode {
  id: string;                    // Unique: file path, agent ID, task ID, etc.
  label: string;                 // Display name
  type: NodeType;
  metadata: {
    path?: string;               // File path for file nodes
    content?: string;            // First N chars for preview
    linkCount?: number;          // How many connections
    lastModified?: string;
    tags?: string[];
    status?: string;             // For tasks/agents
    project?: string;
  };
  size: number;                  // Visual size (scaled by connections)
  color: string;                 // Mapped from type
}

type NodeType = 'file' | 'concept' | 'project' | 'agent' | 'task' | 'tag' | 'memory';

interface GraphEdge {
  id: string;                    // `${source}-${target}-${type}`
  source: string;                // Node ID
  target: string;                // Node ID
  type: EdgeType;
  label?: string;                // e.g., "alias" for wikilink aliases
  weight?: number;               // Connection strength
}

type EdgeType = 'links_to' | 'mentions' | 'contains' | 'assigned_to' | 'tagged_with' | 'part_of';

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    generatedAt: string;
    totalFiles: number;
    totalNodes: number;
    totalEdges: number;
  };
}
```

### Indexing Strategy

| Source | Scanner | Node Type | Edge Types |
|--------|---------|-----------|------------|
| `memory/*.md` | Filesystem | `file`, `memory` | `links_to`, `mentions` |
| `chipchip/*.md` | Filesystem | `file`, `concept` | `links_to`, `mentions` |
| `projects/*` (other dirs) | Filesystem | `file` | `links_to` |
| Supabase: `projects` table | API | `project` | `contains` (→ tasks) |
| Supabase: `tasks` table | API | `task` | `assigned_to` (→ agents), `part_of` (→ project) |
| Supabase: `agents` table | API | `agent` | `assigned_to` (→ tasks) |
| Tags (`#tag`) | Parsed | `tag` | `tagged_with` |

### Graph Builder (Node.js Service)

Runs as an API endpoint or cron job:

```typescript
// api/graph-data/route.ts (Next.js API route in Mission Control)
async function buildGraph(): Promise<GraphData> {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  // 1. Scan filesystem
  const files = await scanMarkdownFiles([
    '/home/ubuntu/.openclaw/workspace/memory/',
    '/home/ubuntu/.openclaw/workspace/chipchip/',
    '/home/ubuntu/.openclaw/workspace/projects/',
  ]);
  
  // 2. Parse each file
  for (const file of files) {
    const content = await readFile(file.path);
    const links = extractWikilinks(content);    // [[link]] patterns
    const tags = extractTags(content);           // #tag patterns
    const headings = extractHeadings(content);   // ## Heading
    
    // Create file node
    nodes.push({
      id: file.path,
      label: file.name,
      type: file.path.includes('memory') ? 'memory' : 'file',
      size: links.length + tags.length,
      metadata: { path: file.path, tags, linkCount: links.length }
    });
    
    // Create edges for wikilinks
    for (const link of links) {
      edges.push({
        id: `${file.path}-links_to-${link}`,
        source: file.path,
        target: resolveLinkTarget(link, file.path),
        type: 'links_to'
      });
    }
    
    // Create tag nodes and edges
    for (const tag of tags) {
      const tagId = `tag:${tag}`;
      if (!nodes.find(n => n.id === tagId)) {
        nodes.push({ id: tagId, label: `#${tag}`, type: 'tag', size: 1 });
      }
      edges.push({
        id: `${file.path}-tagged-${tag}`,
        source: file.path,
        target: tagId,
        type: 'tagged_with'
      });
    }
  }
  
  // 3. Merge Supabase data
  const [projects, tasks, agents] = await Promise.all([
    supabase.from('projects').select('*'),
    supabase.from('tasks').select('*'),
    supabase.from('agents').select('*'),
  ]);
  
  // Add project/task/agent nodes and edges...
  
  return { nodes, edges, metadata: { generatedAt: new Date().toISOString(), ... } };
}
```

---

## 4. Recommendation

### 🏆 **Primary Choice: Cytoscape.js**

**Why Cytoscape.js wins:**

1. **Purpose-built for exactly this use case.** Knowledge graphs ARE network graphs. Cytoscape is the gold standard for interactive network visualization.

2. **Built-in force layout with multiple algorithms.** `fcose` (fast compound spring embedder) produces Obsidian-like results out of the box. No extra libraries needed.

3. **Selector/filter API is unmatched.** `cy.nodes('[type="file"]').addClass('highlight')` — this is what we need for search and type filtering.

4. **Canvas/WebGL rendering scales.** 500 nodes is trivial. Can handle 5000+ if needed.

5. **Rich plugin ecosystem:** minimap, context menus, popper tooltips, navigator — all battle-tested.

6. **Styling is CSS-like:** Easy to define colors per node type, size by connection count, edge thickness by weight.

7. **Used in production** by major companies for exactly this type of visualization.

**The trade-off:** Not React-native (no JSX nodes). But for a knowledge graph, we don't need custom JSX node content — we need colored circles with labels and tooltips. Cytoscape handles that perfectly.

### 🥈 **Alternative: React Flow** (if we want rich node rendering)

Choose React Flow if we want to render rich previews inside nodes (file content snippets, agent status cards, etc.). It's a better fit if the graph view is more of a "dashboard" than a pure knowledge graph.

### 📦 Implementation Plan

#### Phase 1: Graph Data Layer (Day 1)
- [ ] Create `/api/graph-data` endpoint in Mission Control
- [ ] Build markdown file scanner (memory/, chipchip/, projects/)
- [ ] Implement wikilink/tag/heading parser with regex
- [ ] Merge Supabase data (projects, tasks, agents)
- [ ] Return typed `GraphData` JSON

#### Phase 2: Graph Visualization Component (Day 2)
- [ ] Install `cytoscape` + `cytoscape-fcose` + `cytoscape-popper`
- [ ] Create `WorkspaceGraph` React component wrapping Cytoscape
- [ ] Style nodes by type (color palette, size mapping)
- [ ] Implement force layout with fcose
- [ ] Add zoom controls, fit-to-screen

#### Phase 3: Interactivity (Day 3)
- [ ] Node click → sidebar with details/preview
- [ ] Search bar → highlight matching nodes, dim others
- [ ] Filter panel → toggle node types (files, agents, tasks, etc.)
- [ ] Hover → show tooltip with node metadata
- [ ] Edge hover → show relationship type

#### Phase 4: Polish & Integration (Day 4)
- [ ] Add minimap (cytoscape-navigator plugin)
- [ ] Color by mode toggle (by type, by age, by connections)
- [ ] Local graph view (selected node + N hops)
- [ ] Add as new page in Mission Control sidebar
- [ ] Cache graph data (refresh every 5 min or on-demand)

### Dependencies

```json
{
  "cytoscape": "^3.28.0",
  "cytoscape-fcose": "^2.2.0",
  "cytoscape-popper": "^2.0.0",
  "@popperjs/core": "^2.11.0"
}
```

Total added bundle: ~230 KB gzipped (acceptable for a dedicated graph page loaded on-demand).

### Node Color Palette

| Type | Color | Hex |
|------|-------|-----|
| Memory files | Blue | `#3B82F6` |
| ChipChip files | Purple | `#8B5CF6` |
| Projects | Orange | `#F59E0B` |
| Agents | Green | `#10B981` |
| Tasks | Rose | `#F43F5E` |
| Tags | Gray | `#6B7280` |
| Concepts | Cyan | `#06B6D4` |

---

## Summary

| Decision | Choice |
|----------|--------|
| **Library** | Cytoscape.js + fcose layout |
| **Rendering** | Canvas (scalable) |
| **Data source** | API endpoint scanning filesystem + Supabase |
| **Layout** | Force-directed (fcose algorithm) |
| **Page type** | New Mission Control sidebar page |
| **Timeline** | ~4 days for full implementation |
| **Bundle impact** | ~230 KB gzipped (lazy-loaded) |

The result: an Obsidian-style interactive graph of your entire workspace — files, projects, agents, tasks — all connected and explorable, right inside Mission Control.
