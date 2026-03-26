/**
 * Workspace Scanner for the Knowledge Graph
 * Scans workspace markdown files and Supabase data to build a complete graph
 * in Cytoscape-compatible element format.
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { parseMarkdown, normalizeLinkTarget, isFileReference } from './graphParser';
import type {
  GraphNode,
  GraphEdge,
  GraphData,
  GraphStats,
  GraphFilter,
  CytoscapeNodeElement,
  CytoscapeEdgeElement,
  NodeType,
  EdgeType,
  NodeMetadata,
} from './graphTypes';

// ─── Configuration ───────────────────────────────────────────────────────────

const WORKSPACE = '/home/ubuntu/.openclaw/workspace';

const SCAN_DIRS = ['memory', 'chipchip', 'projects'];

const ROOT_FILES = [
  'SOUL.md',
  'USER.md',
  'MEMORY.md',
  'AGENTS.md',
  'TOOLS.md',
  'IDENTITY.md',
  'HEARTBEAT.md',
  'BRAIN.md',
];

// Well-known agent names (from @mentions in content)
const KNOWN_AGENTS = [
  'Nova', 'Kiro', 'Nora', 'Chip', 'Ava', 'Mia',
  'Luna', 'Zeke', 'Sage', 'Bolt', 'Echo', 'Flux',
];

// ─── Supabase Client ─────────────────────────────────────────────────────────

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
}

// ─── Filesystem Utilities ────────────────────────────────────────────────────

function walkDir(dir: string, extensions: string[] = ['.md']): string[] {
  const results: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'mission-control-ui') continue;
        results.push(...walkDir(fullPath, extensions));
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  } catch {
    // Dir doesn't exist or not readable — skip silently
  }
  return results;
}

/**
 * Resolve a wikilink target to a file path or concept ID.
 */
function resolveLinkTarget(linkText: string, sourcePath: string): string {
  const normalized = normalizeLinkTarget(linkText);

  // Check if it's already a known file ID
  const candidates = [
    path.join(WORKSPACE, `${normalized}.md`),
    path.join(WORKSPACE, normalized),
    path.join(path.dirname(sourcePath), `${normalized}.md`),
    path.join(path.dirname(sourcePath), normalized),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // If no file found, treat as a concept node
  return `concept:${normalized.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Determine node type based on file path.
 */
function getFileNodeType(relPath: string, fileName: string): NodeType {
  if (relPath.startsWith('memory/')) return 'file';
  if (relPath.startsWith('chipchip/')) return 'file';
  if (relPath.startsWith('projects/')) return 'file';
  // Root config files are conceptually "memory" files
  const rootFiles = ['SOUL', 'USER', 'MEMORY', 'AGENTS', 'TOOLS', 'IDENTITY', 'HEARTBEAT', 'BRAIN'];
  if (rootFiles.includes(fileName)) return 'file';
  return 'file';
}

// ─── Node/Edge ID Generators ─────────────────────────────────────────────────

function nodeId(type: NodeType, id: string): string {
  return `${type}:${id}`;
}

function edgeId(source: string, type: EdgeType, target: string): string {
  return `${source}-${type}-${target}`;
}

// ─── File Scanner ────────────────────────────────────────────────────────────

interface FileScanResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

function scanFile(filePath: string, allFilePaths: Set<string>): FileScanResult {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const stat = fs.statSync(filePath);
    const relPath = path.relative(WORKSPACE, filePath);
    const fileName = path.basename(filePath, '.md');
    const nodeType = getFileNodeType(relPath, fileName);

    // Parse markdown content
    const parsed = parseMarkdown(content);

    // Create file node
    const fId = filePath;
    const fileNode: GraphNode = {
      id: fId,
      label: fileName,
      type: nodeType,
      path: relPath,
      metadata: {
        created: stat.birthtime.toISOString(),
        modified: stat.mtime.toISOString(),
        size: stat.size,
        content: parsed.contentPreview,
        tags: parsed.tags,
        linkCount: parsed.wikilinks.length + parsed.markdownLinks.length + parsed.embeds.length,
      },
      degree: 0,
    };

    // If frontmatter has a project reference, add to metadata
    if (parsed.frontmatter.project) {
      fileNode.metadata.project = parsed.frontmatter.project;
    }
    if (parsed.frontmatter.title) {
      fileNode.label = parsed.frontmatter.title as string;
    }

    nodes.push(fileNode);

    // ── Wikilinks ─────────────────────────────────────────────────────────
    for (const link of parsed.wikilinks) {
      const targetId = resolveLinkTarget(link.target, filePath);

      // Create concept node if target wasn't resolved to a file
      if (targetId.startsWith('concept:')) {
        if (!nodes.find((n) => n.id === targetId)) {
          nodes.push({
            id: targetId,
            label: link.alias || link.target,
            type: 'concept',
            metadata: {},
            degree: 0,
          });
        }
      }

      const eId = edgeId(fId, 'link', targetId);
      if (!edges.find((e) => e.id === eId)) {
        edges.push({
          id: eId,
          source: fId,
          target: targetId,
          type: 'link',
          label: link.alias,
        });
      }
    }

    // ── Embeds ────────────────────────────────────────────────────────────
    for (const embed of parsed.embeds) {
      const targetId = resolveLinkTarget(embed.target, filePath);

      if (targetId.startsWith('concept:')) {
        if (!nodes.find((n) => n.id === targetId)) {
          nodes.push({
            id: targetId,
            label: embed.target,
            type: 'concept',
            metadata: {},
            degree: 0,
          });
        }
      }

      const eId = edgeId(fId, 'embed', targetId);
      if (!edges.find((e) => e.id === eId)) {
        edges.push({
          id: eId,
          source: fId,
          target: targetId,
          type: 'embed',
        });
      }
    }

    // ── Markdown links (only to .md files) ────────────────────────────────
    for (const link of parsed.markdownLinks) {
      if (isFileReference(link.url) && link.url.endsWith('.md')) {
        const targetId = resolveLinkTarget(link.url.replace('.md', ''), filePath);
        const eId = edgeId(fId, 'link', targetId);
        if (!edges.find((e) => e.id === eId)) {
          edges.push({
            id: eId,
            source: fId,
            target: targetId,
            type: 'link',
            label: link.text,
          });
        }
      }
    }

    // ── Tags ──────────────────────────────────────────────────────────────
    for (const tag of parsed.tags) {
      const tId = nodeId('tag', tag.toLowerCase());
      if (!nodes.find((n) => n.id === tId)) {
        nodes.push({
          id: tId,
          label: `#${tag}`,
          type: 'tag',
          metadata: {},
          degree: 0,
        });
      }

      const eId = edgeId(fId, 'tag', tId);
      if (!edges.find((e) => e.id === eId)) {
        edges.push({
          id: eId,
          source: fId,
          target: tId,
          type: 'tag',
        });
      }
    }

    // ── @mentions → agent/person nodes ────────────────────────────────────
    for (const mention of parsed.mentions) {
      const isAgent = KNOWN_AGENTS.includes(mention.name);
      const mType: NodeType = isAgent ? 'agent' : 'person';
      const mId = nodeId(mType, mention.name.toLowerCase());

      if (!nodes.find((n) => n.id === mId)) {
        nodes.push({
          id: mId,
          label: mention.name,
          type: mType,
          metadata: {},
          degree: 0,
        });
      }

      const eId = edgeId(fId, 'mentions', mId);
      if (!edges.find((e) => e.id === eId)) {
        edges.push({
          id: eId,
          source: fId,
          target: mId,
          type: 'mentions',
        });
      }
    }

    // ── Frontmatter links ─────────────────────────────────────────────────
    if (parsed.frontmatter.links && Array.isArray(parsed.frontmatter.links)) {
      for (const linkText of parsed.frontmatter.links) {
        const targetId = resolveLinkTarget(linkText, filePath);
        const eId = edgeId(fId, 'references', targetId);
        if (!edges.find((e) => e.id === eId)) {
          edges.push({
            id: eId,
            source: fId,
            target: targetId,
            type: 'references',
          });
        }
      }
    }

    // ── Headings → concept nodes (contains relationship) ──────────────────
    for (const heading of parsed.headings) {
      const hId = nodeId('concept', `${relPath}#${heading.toLowerCase().replace(/\s+/g, '-')}`);
      if (!nodes.find((n) => n.id === hId)) {
        nodes.push({
          id: hId,
          label: heading,
          type: 'concept',
          metadata: { description: `Heading in ${fileName}` },
          degree: 0,
        });
      }

      const eId = edgeId(fId, 'contains', hId);
      if (!edges.find((e) => e.id === eId)) {
        edges.push({
          id: eId,
          source: fId,
          target: hId,
          type: 'contains',
        });
      }
    }

    // ── Folder containment ────────────────────────────────────────────────
    const dirPath = path.dirname(relPath);
    if (dirPath && dirPath !== '.') {
      const folderId = nodeId('folder', dirPath);
      if (!nodes.find((n) => n.id === folderId)) {
        nodes.push({
          id: folderId,
          label: path.basename(dirPath),
          type: 'folder',
          path: dirPath,
          metadata: {},
          degree: 0,
        });
      }

      const eId = edgeId(folderId, 'contains', fId);
      if (!edges.find((e) => e.id === eId)) {
        edges.push({
          id: eId,
          source: folderId,
          target: fId,
          type: 'contains',
        });
      }
    }

    // ── Frontmatter project → belongs_to edge ─────────────────────────────
    if (parsed.frontmatter.project) {
      const projId = nodeId('project', (parsed.frontmatter.project as string).toLowerCase().replace(/\s+/g, '-'));
      // We'll ensure the project node exists when scanning Supabase data
      const eId = edgeId(fId, 'belongs_to', projId);
      if (!edges.find((e) => e.id === eId)) {
        edges.push({
          id: eId,
          source: fId,
          target: projId,
          type: 'belongs_to',
        });
      }
    }
  } catch (err) {
    console.error(`Error scanning ${filePath}:`, err);
  }

  return { nodes, edges };
}

// ─── Supabase Data Fetcher ───────────────────────────────────────────────────

async function fetchSupabaseData(): Promise<FileScanResult> {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  try {
    const supabase = getSupabase();

    // ── Projects ──────────────────────────────────────────────────────────
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name, description, status, department, done_tasks, total_tasks, created_at');

    if (projects) {
      for (const p of projects) {
        nodes.push({
          id: nodeId('project', p.id),
          label: p.name || `Project ${p.id}`,
          type: 'project',
          metadata: {
            description: p.description,
            status: p.status,
            created: p.created_at,
            department: p.department,
          },
          degree: 0,
        });
      }
    }

    // ── Tasks ─────────────────────────────────────────────────────────────
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title, description, status, assignees, project_id, priority, created_at, updated_at');

    if (tasks) {
      for (const t of tasks) {
        nodes.push({
          id: nodeId('task', t.id),
          label: t.title || `Task ${t.id}`,
          type: 'task',
          metadata: {
            description: t.description,
            status: t.status,
            created: t.created_at,
            modified: t.updated_at,
            priority: t.priority,
            assignees: t.assignees,
          },
          degree: 0,
        });

        // Task → Project (belongs_to)
        if (t.project_id) {
          edges.push({
            id: edgeId(nodeId('task', t.id), 'belongs_to', nodeId('project', t.project_id)),
            source: nodeId('task', t.id),
            target: nodeId('project', t.project_id),
            type: 'belongs_to',
          });
        }

        // Agent → Task (assigned)
        if (t.assignees && Array.isArray(t.assignees)) {
          for (const assignee of t.assignees) {
            edges.push({
              id: edgeId(nodeId('agent', assignee), 'assigned', nodeId('task', t.id)),
              source: nodeId('agent', assignee),
              target: nodeId('task', t.id),
              type: 'assigned',
            });
          }
        }
      }
    }

    // ── Agents ────────────────────────────────────────────────────────────
    const { data: agents } = await supabase
      .from('agents')
      .select('id, name, role, status, model, created_at');

    if (agents) {
      for (const a of agents) {
        nodes.push({
          id: nodeId('agent', a.id),
          label: a.name || a.id,
          type: 'agent',
          metadata: {
            description: a.role,
            status: a.status,
            created: a.created_at,
          },
          degree: 0,
        });
      }
    }
  } catch (err) {
    console.error('Supabase fetch error:', err);
  }

  return { nodes, edges };
}

// ─── Conversion to Cytoscape Format ──────────────────────────────────────────

function toCytoscapeNode(node: GraphNode): CytoscapeNodeElement {
  return {
    data: {
      id: node.id,
      type: node.type,
      label: node.label,
      path: node.path,
      status: node.metadata.status,
      description: node.metadata.description,
      tags: node.metadata.tags,
      degree: node.degree,
      ...node.metadata,
    },
  };
}

function toCytoscapeEdge(edge: GraphEdge): CytoscapeEdgeElement {
  return {
    data: {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      label: edge.label,
      weight: edge.weight,
    },
  };
}

// ─── Filtering ───────────────────────────────────────────────────────────────

function filterGraph(data: GraphData, filter: GraphFilter): GraphData {
  let { nodes, edges } = data;

  // Filter by node types
  if (filter.types && filter.types.length > 0) {
    const typeSet = new Set(filter.types);
    const nodeIds = new Set(
      nodes.filter((n) => typeSet.has(n.type)).map((n) => n.id)
    );
    nodes = nodes.filter((n) => nodeIds.has(n.id));
    edges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
  }

  // Filter by project (include project node + connected nodes)
  if (filter.projectId) {
    const projId = nodeId('project', filter.projectId);
    const connectedIds = new Set<string>([projId]);

    // Find all edges connected to this project
    for (const edge of edges) {
      if (edge.source === projId) connectedIds.add(edge.target);
      if (edge.target === projId) connectedIds.add(edge.source);
    }

    // Then find nodes connected to those (1-hop expansion)
    for (const edge of edges) {
      if (connectedIds.has(edge.source)) connectedIds.add(edge.target);
      if (connectedIds.has(edge.target)) connectedIds.add(edge.source);
    }

    nodes = nodes.filter((n) => connectedIds.has(n.id));
    edges = edges.filter((e) => connectedIds.has(e.source) && connectedIds.has(e.target));
  }

  // Filter by search term
  if (filter.search) {
    const term = filter.search.toLowerCase();
    const matchingIds = new Set(
      nodes
        .filter(
          (n) =>
            n.label.toLowerCase().includes(term) ||
            n.metadata.description?.toLowerCase().includes(term) ||
            n.metadata.tags?.some((t) => t.toLowerCase().includes(term))
        )
        .map((n) => n.id)
    );
    nodes = nodes.filter((n) => matchingIds.has(n.id));
    edges = edges.filter((e) => matchingIds.has(e.source) && matchingIds.has(e.target));
  }

  return { nodes, edges, stats: computeStats(nodes, edges) };
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function computeStats(nodes: GraphNode[], edges: GraphEdge[]): GraphStats {
  const nodeCounts: Record<string, number> = {};
  for (const node of nodes) {
    nodeCounts[node.type] = (nodeCounts[node.type] || 0) + 1;
  }

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodeCounts,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Main Scan Function ──────────────────────────────────────────────────────

/**
 * Scan the workspace and Supabase to build a complete knowledge graph.
 *
 * @param filter Optional filters for node types, project, search
 * @returns Graph data in raw format with nodes, edges, and stats
 */
export async function scanWorkspace(filter?: GraphFilter): Promise<GraphData> {
  const allNodes = new Map<string, GraphNode>();
  const allEdges: GraphEdge[] = [];
  const edgeSet = new Set<string>();

  // 1. Collect all markdown files
  const allFiles: string[] = [];

  for (const file of ROOT_FILES) {
    const fullPath = path.join(WORKSPACE, file);
    if (fs.existsSync(fullPath)) {
      allFiles.push(fullPath);
    }
  }

  for (const dir of SCAN_DIRS) {
    const dirPath = path.join(WORKSPACE, dir);
    allFiles.push(...walkDir(dirPath));
  }

  const filePathSet = new Set(allFiles);

  // 2. Parse each file
  for (const filePath of allFiles) {
    const result = scanFile(filePath, filePathSet);

    for (const node of result.nodes) {
      if (!allNodes.has(node.id)) {
        allNodes.set(node.id, node);
      }
    }
    for (const edge of result.edges) {
      if (!edgeSet.has(edge.id)) {
        edgeSet.add(edge.id);
        allEdges.push(edge);
      }
    }
  }

  // 3. Fetch Supabase data
  const sbResult = await fetchSupabaseData();
  for (const node of sbResult.nodes) {
    if (!allNodes.has(node.id)) {
      allNodes.set(node.id, node);
    }
  }
  for (const edge of sbResult.edges) {
    if (!edgeSet.has(edge.id)) {
      edgeSet.add(edge.id);
      allEdges.push(edge);
    }
  }

  // 4. Compute degrees
  const degreeMap = new Map<string, number>();
  for (const edge of allEdges) {
    degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
    degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
  }
  for (const [id, node] of allNodes) {
    node.degree = degreeMap.get(id) || 0;
  }

  let nodes = Array.from(allNodes.values());
  let edges = allEdges;

  // 5. Apply filters
  if (filter) {
    const filtered = filterGraph({ nodes, edges, stats: computeStats(nodes, edges) }, filter);
    nodes = filtered.nodes;
    edges = filtered.edges;
  }

  return {
    nodes,
    edges,
    stats: computeStats(nodes, edges),
  };
}

/**
 * Convert graph data to Cytoscape element format.
 */
export function toCytoscapeElements(data: GraphData): {
  nodes: CytoscapeNodeElement[];
  edges: CytoscapeEdgeElement[];
} {
  return {
    nodes: data.nodes.map(toCytoscapeNode),
    edges: data.edges.map(toCytoscapeEdge),
  };
}
