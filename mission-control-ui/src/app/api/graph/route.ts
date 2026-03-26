import { NextResponse } from 'next/server';
import { scanWorkspace } from '@/lib/graphScanner';
import type { GraphFilter, NodeType } from '@/lib/graphTypes';
import { readFile } from 'fs/promises';
import { join } from 'path';

// ─── Simple in-memory cache ──────────────────────────────────────────────────

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000; // 60 seconds

function getCacheKey(filter: GraphFilter): string {
  return JSON.stringify(filter);
}

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
  // Prevent unbounded growth — keep max 50 entries
  if (cache.size > 50) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

// ─── Static graph data (pre-scanned by workspace-scanner.js) ────────────────

const STATIC_DATA_PATH = join(process.cwd(), 'public', 'api', 'graph-data.json');

async function loadStaticGraphData(): Promise<{ nodes: any[]; edges: any[]; stats: any } | null> {
  try {
    const raw = await readFile(STATIC_DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return {
      nodes: data.nodes || [],
      edges: data.edges || [],
      stats: data.stats || {},
    };
  } catch {
    return null;
  }
}

// ─── Valid node types for query param parsing ────────────────────────────────

const VALID_NODE_TYPES: NodeType[] = [
  'file', 'project', 'agent', 'task', 'folder', 'tag', 'concept', 'person', 'event',
  'skill', 'memory', 'doc', 'config', 'script',
];

// ─── API Route ───────────────────────────────────────────────────────────────

/**
 * GET /api/graph
 *
 * Query params:
 *   types    — Comma-separated node types to include (e.g., "file,agent,tag")
 *   project  — Project ID to filter to (shows project + connected nodes)
 *   search   — Search term to filter node labels/descriptions
 *
 * Returns:
 *   { nodes: [...], edges: [...], stats: {...} }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filter from query params
    const filter: GraphFilter = {};

    const typesParam = searchParams.get('types');
    if (typesParam) {
      filter.types = typesParam
        .split(',')
        .map((t) => t.trim() as NodeType)
        .filter((t) => VALID_NODE_TYPES.includes(t));
    }

    const projectParam = searchParams.get('project');
    if (projectParam) {
      filter.projectId = projectParam;
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      filter.search = searchParam;
    }

    // Check cache
    const cacheKey = getCacheKey(filter);
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, max-age=60',
          'X-Cache': 'HIT',
        },
      });
    }

    // ── Try static file first (fast path, no scanning) ──
    const hasFilters = filter.types?.length || filter.projectId || filter.search;

    if (!hasFilters) {
      const staticData = await loadStaticGraphData();
      if (staticData && staticData.nodes.length > 0) {
        const response = {
          nodes: staticData.nodes,
          edges: staticData.edges,
          stats: staticData.stats,
        };
        setCache(cacheKey, response);
        return NextResponse.json(response, {
          headers: {
            'Cache-Control': 'public, max-age=300',
            'X-Cache': 'STATIC',
          },
        });
      }
    }

    // ── Fallback: live scan (Supabase-based) ──
    const graphData = await scanWorkspace(filter);

    const response = {
      nodes: graphData.nodes,
      edges: graphData.edges,
      stats: graphData.stats,
    };

    // Cache the result
    setCache(cacheKey, response);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Graph API error:', error);
    return NextResponse.json(
      { error: 'Failed to scan workspace', details: String(error) },
      { status: 500 }
    );
  }
}
