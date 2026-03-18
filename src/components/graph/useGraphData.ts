'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { GraphData, NodeType, GraphNode } from '@/lib/graphTypes'

interface UseGraphDataReturn {
  data: GraphData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  filters: Set<NodeType>
  setFilters: React.Dispatch<React.SetStateAction<Set<NodeType>>>
  toggleFilter: (type: NodeType) => void
  filteredNodes: GraphNode[]
}

export const ALL_NODE_TYPES: NodeType[] = [
  'file', 'project', 'agent', 'task', 'folder', 'tag', 'concept', 'person', 'event'
]

export function useGraphData(): UseGraphDataReturn {
  const [data, setData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Set<NodeType>>(new Set(ALL_NODE_TYPES))

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
    return data.nodes.filter((n: GraphNode) => filters.has(n.type))
  }, [data, filters])

  return { data, loading, error, refetch: fetchGraph, filters, setFilters, toggleFilter, filteredNodes }
}
