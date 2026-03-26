# Graph View — UI/UX Design Specification

> Mission Control Knowledge Graph Visualization
> Version: 1.0 | Date: 2026-03-18

---

## 1. Overview

The Graph View is a full-page interactive knowledge graph that visualizes all workspace content as a connected network. It mirrors the Obsidian graph view experience — nodes for content, edges for relationships, with rich filtering, search, and navigation.

**Primary use cases:**
- Discover connections between projects, agents, tasks, and knowledge files
- Identify hub nodes (highly connected content) and orphan nodes (isolated content)
- Navigate the workspace spatially instead of hierarchically
- Spot patterns and clusters in organizational knowledge

---

## 2. Page Layout

### 2.1 Overall Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ ◀ Sidebar  │         GRAPH CANVAS (full width)         │ Details ▶ │
│            │                                             │  Panel   │
│            │    ╔═════════╗                              │          │
│            │    ║ Toolbar ║ (floating, top-center)       │          │
│            │    ╚═════════╝                              │          │
│            │                                             │          │
│            │       ○───◇                                 │          │
│            │      / \   \                                │          │
│            │     ○   ◆───⬡                               │          │
│            │         |   /                               │          │
│            │         □──●                                │          │
│            │                                             │          │
│            │                              ┌────────┐     │          │
│            │                              │Mini-map│     │          │
│            │                              └────────┘     │          │
│            │                                             │          │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Layout Zones

| Zone | Position | Width | Description |
|------|----------|-------|-------------|
| **Sidebar** | Left | 260px (collapsed: 56px) | Existing Mission Control sidebar — navigation, not graph-specific |
| **Graph Canvas** | Center | Remaining space | The SVG/Canvas where the graph renders |
| **Floating Toolbar** | Top-center of canvas | ~600px | Search, filters, layout toggle |
| **Detail Panel** | Right, overlay | 340px (slides in) | Node details when a node is clicked |
| **Mini-map** | Bottom-right of canvas | 180×120px | Bird's-eye view of entire graph |

---

## 3. Floating Toolbar

Positioned at top-center of the graph canvas, semi-transparent background (`bg-black/60 backdrop-blur-sm`), rounded corners, slight shadow. Appears on page load, fades to 40% opacity when idle (returns to full on hover).

### 3.1 Components (left to right)

```
┌──────────────────────────────────────────────────────────────────┐
│  🔍 [Search nodes...]   │ Type filters │ Layout │ Zoom [−][+] │
│                         │ ◻ ◇ ⬡ □ ●   │ ⚡ ▦ ◎  │   [Fit]     │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.1.1 Search Bar
- **Position:** Leftmost, ~220px wide
- **Behavior:** Real-time fuzzy search as user types
- **Effect:** Matching nodes glow/highlight; non-matching nodes dim to 20% opacity; edges to non-matching nodes hide
- **Debounce:** 200ms
- **Clear button:** × on right side when text is present
- **Keyboard shortcut:** `Cmd/Ctrl + K` focuses search

#### 3.1.2 Node Type Filters
- **Format:** Icon-toggle buttons for each node type
- **Icons:**
  - 🔵 circle → Memory files (blue `#3B82F6`)
  - 💎 diamond → Projects (green `#10B981`)
  - ⬡ hexagon → Agents (purple `#8B5CF6`)
  - 🟧 square → Tasks (orange `#F59E0B`)
  - ⚫ dot → Concepts/Tags (gray `#6B7280`)
- **Behavior:** Click to toggle visibility. All on by default. When a type is toggled off, those nodes and their edges fade out (300ms ease).
- **Active state:** Filled icon with colored underline. Inactive: ghosted at 50% opacity.
- **"All" toggle:** Leftmost button to reset all filters on.

#### 3.1.3 Layout Toggle
- **Three modes:** Force-directed (⚡), Grid (▦), Radial (◎)
- **Force-directed (default):** Physics simulation — nodes repel, edges attract. Natural clustering. Animated transition when toggling.
- **Grid:** Nodes snap to a grid based on type. Good for overview of content inventory.
- **Radial:** Central hub node with others arranged in concentric rings by type or connection count.

#### 3.1.4 Zoom Controls
- **[−] / [+]:** Step zoom in/out (10% increments)
- **[Fit]:** Auto-fit entire graph to viewport
- **Mouse wheel:** Continuous zoom (centered on cursor position)
- **Pinch-to-zoom:** On tablet
- **Zoom range:** 10% to 500%

---

## 4. Node Styling

### 4.1 Node Types & Visual Treatment

| Node Type | Shape | Color | Base Radius | Emoji Icon |
|-----------|-------|-------|-------------|------------|
| Memory files | Circle | Blue `#3B82F6` | 18px | 📁 |
| Projects | Diamond (rotated square) | Green `#10B981` | 22px | 📋 |
| Agents | Hexagon | Purple `#8B5CF6` | 20px | 🤖 |
| Tasks | Square (rounded) | Orange `#F59E0B` | 16px | 📝 |
| Concepts/Tags | Circle | Gray `#6B7280` | 8px | — |

### 4.2 Size Scaling

Node radius scales based on degree (number of connections):

```
min_radius = type_base_radius
max_radius = type_base_radius × 2.5
radius = min_radius + (degree / max_degree_in_graph) × (max_radius - min_radius)
```

- **Hub nodes** (10+ connections): Visually prominent, up to 2.5× base size
- **Orphan nodes** (0 connections): Base size, slightly faded (opacity 0.6)
- **Transition:** Smooth resize on data update (500ms ease)

### 4.3 Node States

| State | Visual |
|-------|--------|
| **Default** | Solid fill, thin 2px border in lighter shade of type color |
| **Hover** | Scale to 1.2×, add glow shadow in type color, show tooltip |
| **Selected** | Thick 3px white border, pulse animation (subtle), detail panel opens |
| **Highlighted (search match)** | Bright glow, slightly larger |
| **Dimmed (filtered out)** | 15% opacity, no interaction |
| **Dimmed (non-search match)** | 20% opacity, edges hidden |
| **Loading** | Shimmer/pulse animation on the node |

### 4.4 Node Labels

- **Position:** Below the node shape
- **Font:** 11px, system sans-serif, medium weight
- **Color:** `#E5E7EB` (light gray, dark-bg friendly)
- **Truncation:** Max 20 characters, ellipsis
- **Show/hide:** Always visible at zoom ≥ 80%. Below 80%, labels hide unless node is hovered/selected.
- **Collision:** Labels auto-hide if they'd overlap with another label (prefer showing labels for larger/more-connected nodes)

---

## 5. Edge Styling

### 5.1 Edge Types & Visual Treatment

| Relationship | Color | Style | Width | Opacity |
|--------------|-------|-------|-------|---------|
| Links | Light blue `#60A5FA` | Solid | 1.5px | 0.5 |
| Contains | Gray `#6B7280` | Solid | 2px | 0.4 |
| Assigned to | Green `#34D399` | Solid | 1.5px | 0.5 |
| Mentions | Gray `#9CA3AF` | Dotted | 1px | 0.3 |
| Related to | Light purple `#A78BFA` | Dashed | 1px | 0.3 |

### 5.2 Edge States

| State | Visual |
|-------|--------|
| **Default** | As per type table above |
| **Hover (edge)** | Highlight to full opacity (1.0), increase width to 3px, show relationship label |
| **Connected to selected node** | Full opacity, 2px width, animate flow direction (dash animation) |
| **Not connected to selected node** | 10% opacity (background context) |
| **Search highlight** | Full opacity, 2.5px if connecting two matched nodes |

### 5.3 Edge Animation
- When a node is selected, connected edges get a subtle directional animation (moving dashes) showing the relationship direction
- Animation speed: moderate, non-distracting

---

## 6. Detail Panel (Right Side)

### 6.1 Behavior
- **Trigger:** Click any node
- **Animation:** Slides in from right (250ms ease-out)
- **Close:** Click × button, click same node again, press Escape, or click empty canvas
- **Width:** 340px fixed
- **Background:** Dark semi-transparent (`bg-gray-900/95 backdrop-blur-md`)
- **Border:** Left border 1px solid `#374151`

### 6.2 Content Structure

```
┌─────────────────────────────────┐
│ ×                             │
│                                 │
│  📁  Memory: Strategy Notes    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  Type: Memory File              │
│  Created: 2026-03-15            │
│  Modified: 2026-03-18           │
│  Size: 4.2 KB                   │
│                                 │
│  ── Connections (7) ──          │
│                                 │
│  Contains → 📋 Project Alpha    │
│  Links to  → 🤖 Agent Nova      │
│  Mentions  → 💡 Revenue Model   │
│  ...                            │
│                                 │
│  ── Preview ──                  │
│                                 │
│  "This file covers the Q2       │
│   strategy for expanding into   │
│   the Ethiopian market..."      │
│                                 │
│  [Open File]  [Copy Path]      │
│                                 │
└─────────────────────────────────┘
```

### 6.3 Panel Sections

1. **Header:** Node icon + label, close button
2. **Metadata:** Type, created date, modified date, file size (if applicable)
3. **Connections list:** All edges with direction, type, and connected node. Click a connection → select that node (panel updates).
4. **Content preview:** First 200 characters of file content, or task description, or agent role.
5. **Actions:**
   - "Open File" / "View Details" — deep link to the content in Mission Control
   - "Copy Path" — copy file path to clipboard
   - "Focus Graph" — re-center graph on this node, show only 2-hop neighborhood

---

## 7. Mini-map

### 7.1 Position & Size
- **Location:** Bottom-right corner of graph canvas, 20px margin
- **Size:** 180 × 120px
- **Background:** `bg-gray-900/80 backdrop-blur-sm`, rounded corners, 1px border `#374151`

### 7.2 Behavior
- Shows entire graph at miniature scale — dots for nodes, faint lines for edges
- A **viewport rectangle** shows current visible area (draggable)
- Clicking on mini-map recenters the main graph to that location
- Updates in real-time as graph is panned/zoomed
- Fades to 30% opacity when idle, returns on hover

---

## 8. Interactions

### 8.1 Mouse / Trackpad

| Action | Effect |
|--------|--------|
| Click node | Select node → open detail panel |
| Click edge | Show relationship tooltip (type, both nodes) |
| Click empty space | Deselect, close detail panel |
| Hover node | Tooltip with full name + connection count |
| Hover edge | Highlight edge, show relationship label |
| Drag node | Reposition node (force layout pauses briefly) |
| Scroll wheel | Zoom in/out (centered on cursor) |
| Click + drag canvas | Pan the graph |
| Double-click node | "Focus" — zoom to 2-hop neighborhood of that node |

### 8.2 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Cmd/Ctrl + K` | Focus search bar |
| `Escape` | Clear search / close detail panel / deselect |
| `+` / `-` | Zoom in / out |
| `0` | Reset zoom to 100% and center |
| `F` | Fit graph to viewport |
| `1-5` | Toggle node type filter (Memory, Projects, Agents, Tasks, Concepts) |
| `Arrow keys` | Pan graph (50px steps) |
| `Tab` | Cycle through nodes (accessibility) |

### 8.3 Tooltip (on hover)

- **Position:** Above the node, centered
- **Background:** `bg-gray-800`, rounded, shadow
- **Content:**
  - Full node name (not truncated)
  - Node type label
  - Connection count: "12 connections"
  - Subtle arrow pointing to node
- **Delay:** 200ms appear, 100ms dismiss

### 8.4 Search Interaction Details
- On search input, nodes matching the query get a golden glow (`#FBBF24`, 300ms transition)
- Non-matching nodes fade to 15% opacity
- Edges between two non-matching nodes hide entirely
- Edges between a match and non-match stay visible at 30% opacity
- Pressing Enter in search box selects the first matching node and opens its detail panel
- Search matches against: node name, node type, tags, file path

---

## 9. Responsive Behavior

### 9.1 Desktop (≥1024px)
- Full layout as described above
- Detail panel: 340px overlay on right
- Mini-map: visible
- Toolbar: full width with all controls

### 9.2 Tablet (768px–1023px)
- Sidebar collapses to icon-only (56px)
- Detail panel: full-width bottom sheet (slides up from bottom), 50% screen height
- Mini-map: smaller (120×80px), or hidden (toggle in toolbar)
- Toolbar: compact mode — search bar shrinks, filter icons become dropdown, layout toggle becomes dropdown
- Touch gestures: pinch-to-zoom, drag to pan, tap to select

### 9.3 Mobile (<768px)
- **Not a primary target**, but degrades gracefully:
  - Sidebar hidden (hamburger menu)
  - Graph fills entire screen
  - Toolbar: search + hamburger menu for filters/layout
  - Detail panel: full-screen modal
  - No mini-map

---

## 10. Wireframe — Detailed Page Description

### Full Page Wireframe (Desktop)

```
╔══════════════════════════════════════════════════════════════════════════╗
║ ┌──────┐                                                                ║
║ │ 🏠   │  ┌──────────────────────────────────────────────────┐          ║
║ │      │  │                                                  │          ║
║ │ 📊   │  │  ┌──────────────────────────────────────────┐   │ ┌──────┐ ║
║ │      │  │  │ 🔍 Search nodes...    ○ ◇ ⬡ □ ●  ⚡ ▦ ◎ │   │ │  ×   │ ║
║ │ 🤖   │  │  └──────────────────────────────────────────┘   │ │      │ ║
║ │      │  │                                                  │ │ 📁   │ ║
║ │ 📋   │  │              ○ ────── ◇                          │ │      │ ║
║ │      │  │             /│\        \                         │ │ Strat │ ║
║ │ ✅   │  │            / │ \        ◆                        │ │ egy   │ ║
║ │      │  │           ○  │  ○──────/│\                       │ │      │ ║
║ │ 📈   │  │              │          │ ⬡                     │ │ Type: │ ║
║ │      │  │              □──────────┘/                       │ │ Mem   │ ║
║ │ 💬   │  │             /│                                  │ │      │ ║
║ │      │  │            ● ●                                  │ │ Conn: │ ║
║ │ ⚙️   │  │                                                   │ │ 7     │ ║
║ │      │  │        ○         ◇ ─── ⬡                        │ │      │ ║
║ │ 🧠   │  │       / \       /                                │ │ ───── │ ║
║ │      │  │      ●   ◆ ─── ○                                 │ │      │ ║
║ │ 📁   │  │              \                                   │ │ Cont: │ ║
║ │      │  │               □                                  │ │ → 📋  │ ║
║ │ 📝   │  │                                                  │ │ → 🤖  │ ║
║ │      │  │                                     ┌────────┐   │ │ → 💡  │ ║
║ │      │  │                                     │ mini   │   │ │      │ ║
║ │      │  │                                     │ map    │   │ │ Prev: │ ║
║ └──────┘  │                                     └────────┘   │ │ "Thi… │ ║
║           │                                                  │ │      │ ║
║           └──────────────────────────────────────────────────┘ │[Open]│ ║
║                                                                └──────┘ ║
╚══════════════════════════════════════════════════════════════════════════╝

KEY:
○  = Memory file (blue circle)       Sidebar (left): 260px
◇  = Project (green diamond)         Canvas: remaining width
⬡  = Agent (purple hexagon)          Detail Panel (right): 340px overlay
□  = Task (orange square)            Mini-map: bottom-right 180×120px
●  = Concept/Tag (gray dot)          Toolbar: floating top-center ~600px
◆  = Another project
```

### Interaction Flow

```
1. User lands on Graph View page
   → Graph renders with force-directed layout
   → All nodes visible, all filters ON
   → Toolbar visible at full opacity

2. User types "strategy" in search
   → Matching nodes glow gold
   → Non-matches fade to 15%
   → Graph auto-zooms to show cluster of matches

3. User clicks a Project node (green diamond)
   → Detail panel slides in from right
   → Connected edges animate (flowing dashes)
   → Non-connected edges dim to 10%
   → Mini-map viewport rectangle updates

4. User clicks a connection in the detail panel
   → Graph smoothly transitions to center on the connected node
   → Detail panel updates to show new node's info

5. User clicks "Focus Graph" in detail panel
   → Camera zooms to show selected node + 2-hop neighborhood
   → Other nodes temporarily hidden

6. User presses Escape
   → Detail panel closes, all edges return to default opacity

7. User switches to Grid layout
   → Nodes animate to grid positions, grouped by type
   → Useful for content inventory overview

8. User clicks "Fit" button
   → Entire graph centers and scales to fill viewport
   → Smooth 500ms animation
```

---

## 11. Data Model (for reference)

### Node Shape
```typescript
interface GraphNode {
  id: string;
  label: string;
  type: 'memory' | 'project' | 'agent' | 'task' | 'concept';
  path?: string;           // file path for memory files
  metadata: {
    created: string;       // ISO date
    modified: string;      // ISO date
    size?: number;         // bytes
    description?: string;
    tags?: string[];
  };
  degree: number;          // connection count (computed)
}
```

### Edge Shape
```typescript
interface GraphEdge {
  id: string;
  source: string;          // node ID
  target: string;          // node ID
  type: 'links' | 'contains' | 'assigned_to' | 'mentions' | 'related_to';
  label?: string;
}
```

### Graph Data Shape
```typescript
interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: {
    totalNodes: number;
    totalEdges: number;
    nodeCounts: Record<GraphNode['type'], number>;
  };
}
```

---

## 12. Technical Recommendations

### Rendering
- **Library:** D3.js (force simulation) + SVG for <500 nodes; switch to Canvas/WebGL (PixiJS or deck.gl) for >500 nodes
- **Alternative:** vis-network, react-force-graph, or cytoscape.js — evaluate based on existing stack

### Performance
- Virtualize: only render nodes within viewport + margin
- Debounce force simulation restarts on drag
- Use requestAnimationFrame for animations
- For >1000 nodes: level-of-detail (LOD) — hide labels and simplify shapes when zoomed out

### Data Loading
- Fetch graph data from Supabase API on page mount
- Subscribe to realtime changes for live updates (new tasks, agents coming online)
- Cache graph data in-memory; refresh on navigation back to page

### Theming
- Respect Mission Control's dark theme (all colors specified above are dark-theme optimized)
- Light theme: increase edge opacity to 0.7, use darker node colors, lighten backgrounds

---

## 13. Accessibility

- **Keyboard navigation:** Full Tab + Arrow key support
- **Screen reader:** ARIA labels on all nodes ("Project: Alpha, 7 connections, green diamond shape")
- **Focus indicators:** Visible focus ring on keyboard-selected nodes
- **Reduced motion:** Respect `prefers-reduced-motion` — disable force simulation animation, use instant transitions
- **Color contrast:** All node colors meet WCAG AA against dark background
- **Alternative view:** Provide a table/list view toggle for users who can't use the graph

---

## 14. Open Questions

1. **Data source:** Should we parse markdown files for `[[wikilinks]]` to auto-generate edges? Or rely solely on Supabase relationships?
2. **Real-time:** Should the graph update live as agents create tasks, or is page-load snapshot sufficient?
3. **Graph size limits:** Should we cap displayed nodes (e.g., 500) with a "Load more" mechanism?
4. **Saved views:** Should users be able to save filtered/zoomed graph states?
5. **Export:** Screenshot/PNG export of current graph view?

---

*End of specification.*
