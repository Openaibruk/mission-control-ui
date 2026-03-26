'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { GraphData, NodeType, GraphNode } from '@/lib/graphTypes'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ViewMode = 'default' | 'by-type' | 'by-directory'

interface UseGraphDataReturn {
  data: GraphData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  filters: Set<NodeType>
  setFilters: React.Dispatch<React.SetStateAction<Set<NodeType>>>
  toggleFilter: (type: NodeType) => void
  filteredNodes: GraphNode[]
  // New: node limiting
  nodeLimit: number
  setNodeLimit: (limit: number) => void
  hasMore: boolean
  // New: view mode
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  // Type filter (dropdown support)
  activeTypeFilter: NodeType | null
  setActiveTypeFilter: (type: NodeType | null) => void
}

export const ALL_NODE_TYPES: NodeType[] = [
  'file', 'folder', 'project', 'agent', 'task', 'skill', 'memory',
  'doc', 'config', 'tag', 'concept', 'script', 'person', 'event'
]

// How many nodes to render initially for performance
export const INITIAL_NODE_LIMIT = 500

export function useGraphData(): UseGraphDataReturn {
  const [data, setData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Set<NodeType>>(new Set(ALL_NODE_TYPES))
  const [nodeLimit, setNodeLimit] = useState(INITIAL_NODE_LIMIT)
  const [viewMode, setViewMode] = useState<ViewMode>('default')
  const [activeTypeFilter, setActiveTypeFilter] = useState<NodeType | null>(null)

  const fetchGraph = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/graph')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: GraphData = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load graph')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGraph()
  }, [fetchGraph])

  const toggleFilter = useCallback((type: NodeType) => {
    setFilters(prev => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }, [])

  const filteredNodes = useMemo(() => {
    if (!data) return []
    let nodes = data.nodes.filter((n: GraphNode) => filters.has(n.type))

    // Apply single-type dropdown filter
    if (activeTypeFilter) {
      nodes = nodes.filter(n => n.type === activeTypeFilter)
    }

    // Sort by degree (descending) to get most connected nodes first
    // This ensures the top N nodes are the most important
    if (nodes.length > nodeLimit) {
      nodes = [...nodes].sort((a, b) => b.degree - a.degree).slice(0, nodeLimit)
    }

    return nodes
  }, [data, filters, nodeLimit, activeTypeFilter])

  const hasMore = useMemo(() => {
    if (!data) return false
    let visibleCount = data.nodes.filter(n => filters.has(n.type)).length
    if (activeTypeFilter) {
      visibleCount = data.nodes.filter(n => n.type === activeTypeFilter).length
    }
    return visibleCount > nodeLimit
  }, [data, filters, nodeLimit, activeTypeFilter])

  return {
    data,
    loading,
    error,
    refetch: fetchGraph,
    filters,
    setFilters,
    toggleFilter,
    filteredNodes,
    nodeLimit,
    setNodeLimit,
    hasMore,
    viewMode,
    setViewMode,
    activeTypeFilter,
    setActiveTypeFilter,
  }
}
