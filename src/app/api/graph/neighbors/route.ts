import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

interface GraphNode {
  id: string;
  label: string;
  type: string;
  path?: string;
  degree: number;
  metadata: Record<string, unknown>;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

let graphCache: GraphData | null = null;
let cacheTime = 0;

function loadGraph(): GraphData {
  if (graphCache && Date.now() - cacheTime < 60_000) return graphCache;
  try {
    const filePath = path.join(process.cwd(), 'public', 'api', 'graph-data.json');
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    graphCache = { nodes: data.nodes, edges: data.edges };
    cacheTime = Date.now();
    return graphCache;
  } catch {
    return { nodes: [], edges: [] };
  }
}

/**
 * GET /api/graph/neighbors?node=<id>&depth=2
 *
 * Returns nodes connected to the given node within N hops.
 * Useful for agents to find context related to a file/task/agent.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nodeId = searchParams.get('node');
  const depth = Math.min(parseInt(searchParams.get('depth') || '2', 10), 5);
  const includeEdges = searchParams.get('includeEdges') === 'true';

  if (!nodeId) {
    return NextResponse.json(
      { error: 'Missing ?node=<id> parameter' },
      { status: 400 }
    );
  }

  const graph = loadGraph();
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  // Check if node exists (try exact match, then partial match)
  let resolvedId = nodeId;
  if (!nodeMap.has(nodeId)) {
    // Try partial match
    const match = graph.nodes.find(
      (n) => n.id.includes(nodeId) || n.path === nodeId || n.label === nodeId
    );
    if (match) resolvedId = match.id;
    else
      return NextResponse.json(
        { error: `Node not found: ${nodeId}`, suggestions: findSimilar(graph.nodes, nodeId) },
        { status: 404 }
      );
  }

  // BFS to find neighbors within depth
  const visited = new Set<string>([resolvedId]);
  const queue: { id: string; d: number }[] = [{ id: resolvedId, d: 0 }];
  const neighborIds = new Set<string>();
  const edgeTypes: Record<string, string> = {}; // "source->target" -> edgeType

  while (queue.length > 0) {
    const { id, d } = queue.shift()!;
    if (d >= depth) continue;

    for (const edge of graph.edges) {
      if (edge.source === id && !visited.has(edge.target)) {
        visited.add(edge.target);
        neighborIds.add(edge.target);
        edgeTypes[`${edge.source}->${edge.target}`] = edge.type;
        queue.push({ id: edge.target, d: d + 1 });
      }
      if (edge.target === id && !visited.has(edge.source)) {
        visited.add(edge.source);
        neighborIds.add(edge.source);
        edgeTypes[`${edge.source}->${edge.target}`] = edge.type;
        queue.push({ id: edge.source, d: d + 1 });
      }
    }
  }

  const centerNode = nodeMap.get(resolvedId)!;
  const neighbors = Array.from(neighborIds)
    .map((id) => nodeMap.get(id))
    .filter(Boolean) as GraphNode[];

  // Group by type
  const byType: Record<string, GraphNode[]> = {};
  for (const n of neighbors) {
    const t = n.type || 'unknown';
    if (!byType[t]) byType[t] = [];
    byType[t].push(n);
  }

  const result: Record<string, unknown> = {
    center: centerNode,
    depth,
    totalNeighbors: neighbors.length,
    neighbors: neighbors.sort((a, b) => b.degree - a.degree),
    byType: Object.fromEntries(
      Object.entries(byType).map(([k, v]) => [k, v.length])
    ),
  };

  if (includeEdges) {
    const relevantEdges = graph.edges.filter(
      (e) =>
        e.source === resolvedId ||
        e.target === resolvedId ||
        neighborIds.has(e.source) ||
        neighborIds.has(e.target)
    );
    result.edges = relevantEdges;
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}

function findSimilar(nodes: GraphNode[], query: string): string[] {
  const q = query.toLowerCase();
  return nodes
    .filter(
      (n) =>
        n.id.toLowerCase().includes(q) ||
        n.label.toLowerCase().includes(q) ||
        (n.path && n.path.toLowerCase().includes(q))
    )
    .slice(0, 5)
    .map((n) => n.id);
}
