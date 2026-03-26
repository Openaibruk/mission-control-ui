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

let graphCache: { nodes: GraphNode[]; edges: GraphEdge[] } | null = null;
let cacheTime = 0;

function loadGraph() {
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
 * GET /api/graph/query?type=nodes|edges|stats|search
 *
 * Queries the knowledge graph. For agents to quickly find relevant context.
 *
 * Node search:
 *   /api/graph/query?type=search&q=chipchip&types=file,skill&limit=20
 *
 * Get node by ID:
 *   /api/graph/query?type=node&id=file:SOUL.md
 *
 * Graph stats:
 *   /api/graph/query?type=stats
 *
 * Get all edges for a node:
 *   /api/graph/query?type=edges&node=file:SOUL.md
 *
 * Find shortest path between two nodes:
 *   /api/graph/query?type=path&from=file:SOUL.md&to=file:MEMORY.md
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'stats';
  const graph = loadGraph();

  switch (type) {
    case 'stats': {
      const nodeCounts: Record<string, number> = {};
      const edgeCounts: Record<string, number> = {};
      for (const n of graph.nodes) {
        nodeCounts[n.type] = (nodeCounts[n.type] || 0) + 1;
      }
      for (const e of graph.edges) {
        edgeCounts[e.type] = (edgeCounts[e.type] || 0) + 1;
      }
      return NextResponse.json({
        totalNodes: graph.nodes.length,
        totalEdges: graph.edges.length,
        nodeCounts,
        edgeCounts,
      });
    }

    case 'search': {
      const q = (searchParams.get('q') || '').toLowerCase();
      const types = searchParams.get('types')?.split(',').filter(Boolean);
      const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);

      if (!q) return NextResponse.json({ error: 'Missing ?q=' }, { status: 400 });

      let results = graph.nodes.filter(
        (n) =>
          n.label.toLowerCase().includes(q) ||
          n.id.toLowerCase().includes(q) ||
          (n.path && n.path.toLowerCase().includes(q))
      );

      if (types) results = results.filter((n) => types.includes(n.type));

      results.sort((a, b) => b.degree - a.degree);

      return NextResponse.json({
        query: q,
        total: results.length,
        results: results.slice(0, limit),
      });
    }

    case 'node': {
      const id = searchParams.get('id');
      if (!id) return NextResponse.json({ error: 'Missing ?id=' }, { status: 400 });

      const node = graph.nodes.find(
        (n) => n.id === id || n.path === id || n.id.endsWith(':' + id)
      );
      if (!node) return NextResponse.json({ error: `Not found: ${id}` }, { status: 404 });

      // Find connected nodes
      const connected = graph.edges
        .filter((e) => e.source === node.id || e.target === node.id)
        .map((e) => {
          const otherId = e.source === node.id ? e.target : e.source;
          const other = graph.nodes.find((n) => n.id === otherId);
          return { ...e, node: other };
        });

      return NextResponse.json({ node, connections: connected });
    }

    case 'edges': {
      const node = searchParams.get('node');
      if (!node) return NextResponse.json({ error: 'Missing ?node=' }, { status: 400 });

      const edges = graph.edges.filter((e) => e.source === node || e.target === node);
      return NextResponse.json({ node, totalEdges: edges.length, edges });
    }

    case 'path': {
      const from = searchParams.get('from');
      const to = searchParams.get('to');
      if (!from || !to)
        return NextResponse.json({ error: 'Missing ?from= and ?to=' }, { status: 400 });

      // BFS shortest path
      const fromNode = graph.nodes.find(
        (n) => n.id === from || n.path === from || n.id.endsWith(':' + from)
      );
      const toNode = graph.nodes.find(
        (n) => n.id === to || n.path === to || n.id.endsWith(':' + to)
      );
      if (!fromNode || !toNode)
        return NextResponse.json({ error: 'One or both nodes not found' }, { status: 404 });

      const parent = new Map<string, string>();
      const visited = new Set<string>([fromNode.id]);
      const queue = [fromNode.id];

      // Build adjacency on the fly
      const adj = new Map<string, string[]>();
      for (const e of graph.edges) {
        if (!adj.has(e.source)) adj.set(e.source, []);
        if (!adj.has(e.target)) adj.set(e.target, []);
        adj.get(e.source)!.push(e.target);
        adj.get(e.target)!.push(e.source);
      }

      let found = false;
      while (queue.length > 0 && !found) {
        const current = queue.shift()!;
        for (const neighbor of adj.get(current) || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            parent.set(neighbor, current);
            if (neighbor === toNode.id) {
              found = true;
              break;
            }
            queue.push(neighbor);
          }
        }
      }

      if (!found)
        return NextResponse.json({ from: fromNode.id, to: toNode.id, path: [], hops: -1 });

      // Reconstruct path
      const pathNodes: GraphNode[] = [];
      let cur = toNode.id;
      while (cur) {
        const node = graph.nodes.find((n) => n.id === cur);
        if (node) pathNodes.unshift(node);
        cur = parent.get(cur)!;
      }

      return NextResponse.json({
        from: fromNode.id,
        to: toNode.id,
        hops: pathNodes.length - 1,
        path: pathNodes,
      });
    }

    default:
      return NextResponse.json(
        { error: `Unknown type: ${type}. Use: stats, search, node, edges, path` },
        { status: 400 }
      );
  }
}
