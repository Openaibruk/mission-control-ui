/**
 * Graph types for Mission Control Knowledge Graph
 * Based on graph-view-research.md data model
 */

// ─── Node Types ──────────────────────────────────────────────────────────────

export type NodeType =
  | 'file'       // Markdown file in workspace
  | 'project'    // Mission Control project
  | 'agent'      // AI agent
  | 'task'       // Mission Control task
  | 'folder'     // Directory grouping
  | 'tag'        // Tag extracted from frontmatter/hashtags
  | 'concept'    // Named entity from content (unresolved wikilinks, headings)
  | 'person'     // From @mentions / contacts
  | 'event'      // Calendar events
  | 'skill'      // Agent skill
  | 'memory'     // Memory file (curated or daily)
  | 'doc'        // Document / knowledge base entry
  | 'config'     // Configuration file
  | 'script'     // Executable script

// ─── Edge Types ──────────────────────────────────────────────────────────────

export type EdgeType =
  | 'link'         // Markdown [[wikilink]] or [text](url)
  | 'embed'        // ![[embedded]] reference
  | 'tag'          // File → Tag
  | 'assigned'     // Agent → Task
  | 'belongs_to'   // Task → Project
  | 'created'      // Agent → File/Project
  | 'depends_on'   // Task → Task
  | 'references'   // File → File (explicit reference)
  | 'contains'     // Folder → File
  | 'mentions';    // Any → Person/Agent

// ─── Graph Node ──────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  path?: string;
  metadata: NodeMetadata;
  degree: number;
}

export interface NodeMetadata {
  created?: string;
  modified?: string;
  size?: number;
  description?: string;
  tags?: string[];
  status?: string;
  linkCount?: number;
  content?: string;
  department?: string;
  priority?: string;
  assignees?: string[];
  [key: string]: unknown;
}

// ─── Graph Edge ──────────────────────────────────────────────────────────────

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  weight?: number;
}

// ─── Graph Data (full result) ────────────────────────────────────────────────

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: GraphStats;
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  nodeCounts: Record<string, number>;
  generatedAt: string;
}

// ─── Cytoscape Element Format ────────────────────────────────────────────────

export interface CytoscapeNodeElement {
  data: {
    id: string;
    type: NodeType;
    label: string;
    path?: string;
    status?: string;
    description?: string;
    tags?: string[];
    degree: number;
    [key: string]: unknown;
  };
}

export interface CytoscapeEdgeElement {
  data: {
    id: string;
    source: string;
    target: string;
    type: EdgeType;
    label?: string;
    weight?: number;
  };
}

export type CytoscapeElement = CytoscapeNodeElement | CytoscapeEdgeElement;

// ─── API Response ────────────────────────────────────────────────────────────

export interface GraphApiResponse {
  nodes: CytoscapeNodeElement[];
  edges: CytoscapeEdgeElement[];
  stats: GraphStats;
}

// ─── Filter ──────────────────────────────────────────────────────────────────

export interface GraphFilter {
  types?: NodeType[];
  projectId?: string;
  search?: string;
}

// ─── Parsed Markdown Elements ────────────────────────────────────────────────

export interface ParsedWikilink {
  target: string;
  alias?: string;
}

export interface ParsedMarkdownLink {
  text: string;
  url: string;
}

export interface ParsedEmbed {
  target: string;
}

export interface ParsedFrontmatter {
  title?: string;
  tags?: string[];
  links?: string[];
  project?: string;
  [key: string]: unknown;
}

export interface ParsedMention {
  name: string;
  type: 'agent' | 'person';
}

export interface ParsedMarkdown {
  wikilinks: ParsedWikilink[];
  markdownLinks: ParsedMarkdownLink[];
  embeds: ParsedEmbed[];
  tags: string[];
  mentions: ParsedMention[];
  frontmatter: ParsedFrontmatter;
  headings: string[];
  contentPreview: string;
}
