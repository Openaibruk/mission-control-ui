'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import cytoscape, {
  Core,
  NodeSingular,
  EdgeSingular,
} from 'cytoscape'
import fcose from 'cytoscape-fcose'

import { NodeType, GraphNode, GraphEdge, GraphData } from '@/lib/graphTypes'
import { useGraphData, ALL_NODE_TYPES, INITIAL_NODE_LIMIT, ViewMode } from './useGraphData'
import { GraphControls } from './GraphControls'
import { NodeDetailsPanel } from './NodeDetailsPanel'
import { GraphLegend } from './GraphLegend'
import {
  NODE_COLORS,
  NODE_SHAPES,
  NODE_BASE_SIZES,
  EDGE_COLORS,
  NODE_TYPE_EMOJI,
} from './graphStyles'

// Register fcose layout
cytoscape.use(fcose)

// ─── Types ───────────────────────────────────────────────────────────────────

type LayoutName = 'fcose' | 'concentric' | 'grid' | 'circle'

interface GraphViewProps {
  theme?: 'dark' | 'light'
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function truncateLabel(label: string, max: number = 18): string {
  return label.length > max ? label.substring(0, max - 1) + '…' : label
}

function formatCount(n: number): string {
  return n.toLocaleString()
}

// Build directory grouping key from path
function getDirectoryKey(path?: string): string {
  if (!path) return '__root__'
  const parts = path.split('/')
  if (parts.length <= 1) return '__root__'
  return parts.slice(0, -1).join('/')
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function GraphView({ theme: _theme }: GraphViewProps = {}) {
  void _theme // reserved for light theme

  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const {
    data: graphData,
    loading,
    error,
    refetch,
    filters,
    toggleFilter,
    setFilters,
    nodeLimit,
    setNodeLimit,
    hasMore,
    viewMode,
    setViewMode,
    activeTypeFilter,
    setActiveTypeFilter,
  } = useGraphData()

  // UI State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [currentLayout, setCurrentLayout] = useState<LayoutName>('fcose')
  const [tooltip, setTooltip] = useState<{
    node: { label: string; type: NodeType; degree: number; path?: string }
    position: { x: number; y: number }
  } | null>(null)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)

  // ── Type counts for stats bar ──────────────────────────────────────────

  const typeCounts = useMemo(() => {
    if (!graphData) return []
    const counts = graphData.stats.nodeCounts || {}
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .filter(([type]) => NODE_COLORS[type])
  }, [graphData])

  // ── Current nodes (filtered, limited) ──────────────────────────────────

  const currentNodes = useMemo(() => {
    if (!graphData) return []
    let nodes = graphData.nodes.filter(n => filters.has(n.type))
    if (activeTypeFilter) {
      nodes = nodes.filter(n => n.type === activeTypeFilter)
    }
    // Sort by degree, take top N
    nodes = [...nodes].sort((a, b) => b.degree - a.degree)
    if (nodes.length > nodeLimit) {
      nodes = nodes.slice(0, nodeLimit)
    }
    return nodes
  }, [graphData, filters, activeTypeFilter, nodeLimit])

  const currentNodeIds = useMemo(() => new Set(currentNodes.map(n => n.id)), [currentNodes])

  // ── View mode: get extra parent nodes for directory clustering ─────────

  const visibleEdges = useMemo(() => {
    if (!graphData) return []
    // Only include edges where both endpoints are in the current node set
    return graphData.edges.filter(
      e => currentNodeIds.has(e.source) && currentNodeIds.has(e.target)
    )
  }, [graphData, currentNodeIds])

  // ── Initialize Cytoscape ────────────────────────────────────────────────

  useEffect(() => {
    if (!graphData || !containerRef.current) return
    if (currentNodes.length === 0) return

    const elements: cytoscape.ElementDefinition[] = []
    const maxDegree = Math.max(...graphData.nodes.map((n: GraphNode) => n.degree), 1)
    const isLargeGraph = currentNodes.length > 300

    // Add nodes
    for (const node of currentNodes) {
      const colors = NODE_COLORS[node.type] || { bg: '#6B7280', border: '#4B5563' }
      const baseSize = NODE_BASE_SIZES[node.type] || 30
      const sizeScale = 1 + (node.degree / maxDegree) * 1.2
      const size = baseSize * sizeScale

      elements.push({
        data: {
          id: node.id,
          label: isLargeGraph ? truncateLabel(node.label, 12) : truncateLabel(node.label),
          fullLabel: node.label,
          type: node.type,
          degree: node.degree,
          path: node.path || '',
          color: colors.bg,
          borderColor: colors.border,
          shape: NODE_SHAPES[node.type] || 'ellipse',
          size,
          // For directory clustering
          directory: getDirectoryKey(node.path),
        },
      })
    }

    // Add edges
    for (const edge of visibleEdges) {
      elements.push({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
          label: edge.label,
          color: EDGE_COLORS[edge.type] || '#6B7280',
        },
      })
    }

    // If view mode is by-directory, add parent compound nodes
    if (viewMode === 'by-directory') {
      const directories = new Set<string>()
      for (const node of currentNodes) {
        const dir = getDirectoryKey(node.path)
        if (dir !== '__root__') directories.add(dir)
      }
      for (const dir of directories) {
        elements.push({
          data: {
            id: `dir:${dir}`,
            label: truncateLabel(dir.split('/').pop() || dir, 14),
            type: '__directory__',
            color: '#334155',
            borderColor: '#475569',
            shape: 'round-rectangle',
            size: 60,
          },
          classes: 'directory-cluster',
        })
      }
      // Assign parents
      for (const el of elements) {
        if (el.classes === 'directory-cluster') continue
        if (!el.data?.type || el.data.type === '__directory__') continue
        const node = currentNodes.find(n => n.id === el.data.id)
        if (node) {
          const dir = getDirectoryKey(node.path)
          if (dir !== '__root__') {
            ;(el.data as any).parent = `dir:${dir}`
          }
        }
      }
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: ([
        // Directory compound nodes
        {
          selector: '.directory-cluster',
          style: {
            'background-color': '#1E293B',
            'background-opacity': 0.6,
            'border-width': 2,
            'border-color': '#475569',
            'border-style': 'dashed',
            'shape': 'round-rectangle',
            'label': 'data(label)',
            'color': '#94A3B8',
            'font-size': 12,
            'font-weight': 'bold',
            'font-family': 'system-ui, -apple-system, sans-serif',
            'text-valign': 'top',
            'text-margin-y': -8,
            'padding': '20px',
          },
        },
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'border-width': 2,
            'border-color': 'data(borderColor)',
            'width': 'data(size)',
            'height': 'data(size)',
            'shape': 'data(shape)' as unknown as cytoscape.Css.NodeShape,
            'label': 'data(label)',
            'color': '#E5E7EB',
            'font-size': isLargeGraph ? 9 : 11,
            'font-family': 'system-ui, -apple-system, sans-serif',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-wrap': 'ellipsis',
            'text-max-width': isLargeGraph ? '80px' : '120px',
            'transition-property': 'width, height, opacity, border-width, border-color',
            'transition-duration': 300,
          },
        },
        {
          selector: 'node:active',
          style: {
            'overlay-opacity': 0.1,
            'overlay-color': '#fff',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#FFFFFF',
            'width': (ele: NodeSingular) => ele.data('size') * 1.15,
            'height': (ele: NodeSingular) => ele.data('size') * 1.15,
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-width': 3,
            'border-color': '#FBBF24',
            'width': (ele: NodeSingular) => ele.data('size') * 1.3,
            'height': (ele: NodeSingular) => ele.data('size') * 1.3,
          },
        },
        {
          selector: 'node.dimmed',
          style: {
            'opacity': 0.15,
          },
        },
        {
          selector: 'node.filtered-out',
          style: {
            'display': 'none',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': isLargeGraph ? 1 : 1.5,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'target-arrow-width': isLargeGraph ? 6 : 8,
            'curve-style': 'bezier',
            'opacity': isLargeGraph ? 0.2 : 0.4,
            'transition-property': 'opacity, width',
            'transition-duration': 300,
          },
        },
        {
          selector: 'edge:selected',
          style: {
            'width': 3,
            'opacity': 1,
          },
        },
        {
          selector: 'edge.highlighted',
          style: {
            'width': 2.5,
            'opacity': 1,
          },
        },
        {
          selector: 'edge.dimmed',
          style: {
            'opacity': 0.1,
          },
        },
        {
          selector: 'edge.filtered-out',
          style: {
            'display': 'none',
          },
        },
        {
          selector: 'edge.connected-to-selected',
          style: {
            'width': 2.5,
            'opacity': 1,
            'line-style': 'solid',
          },
        },
      ] as any[]),
      layout: { name: 'preset' } as any,
      minZoom: 0.05,
      maxZoom: 5,
      wheelSensitivity: 0.3,
      // Performance: hide edges during pan/zoom for large graphs
      ...(isLargeGraph && { hideEdgesOnViewport: true }),
    })

    // Run layout
    runLayoutInternal(cy, currentLayout, currentNodes.length)

    cyRef.current = cy

    // ── ResizeObserver ──────────────────────────────────────────────────
    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        cy.resize()
        cy.fit(undefined, 50)
      })
      resizeObserverRef.current.observe(containerRef.current)
    }

    // ── Event Handlers ──────────────────────────────────────────────────
    cy.on('tap', 'node', (evt) => {
      const node = evt.target as NodeSingular
      if (node.hasClass('directory-cluster')) return
      setSelectedNodeId(node.id())
    })

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNodeId(null)
      }
    })

    // Double-click to open
    let tapTimeout: ReturnType<typeof setTimeout> | null = null
    cy.on('tap', 'node', (evt) => {
      if (tapTimeout) {
        clearTimeout(tapTimeout)
        tapTimeout = null
        const node = evt.target as NodeSingular
        if (!node.hasClass('directory-cluster')) {
          console.log('Double-clicked node:', node.data('fullLabel'))
        }
        return
      }
      tapTimeout = setTimeout(() => {
        tapTimeout = null
      }, 300)
    })

    cy.on('mouseover', 'node', (evt) => {
      const node = evt.target as NodeSingular
      if (node.hasClass('directory-cluster')) return
      const renderedPosition = node.renderedPosition()
      setTooltip({
        node: {
          label: node.data('fullLabel'),
          type: node.data('type'),
          degree: node.data('degree'),
          path: node.data('path'),
        },
        position: { x: renderedPosition.x, y: renderedPosition.y },
      })
      // Highlight connected
      const connected = node.neighborhood('node')
      cy.nodes().not(node).not(connected).addClass('dimmed')
      cy.edges().not(node.connectedEdges()).addClass('dimmed')
    })

    cy.on('mouseout', 'node', () => {
      setTooltip(null)
      if (!searchQuery) {
        cy.nodes().removeClass('dimmed')
        cy.edges().removeClass('dimmed')
      }
    })

    cy.on('drag', 'node', () => {
      setTooltip(null)
    })

    return () => {
      resizeObserverRef.current?.disconnect()
      cy.destroy()
      cyRef.current = null
    }
  }, [graphData, currentNodes, visibleEdges, viewMode, currentLayout])

  // ── Search effect (enhanced: also searches by path) ────────────────────

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    if (!searchQuery.trim()) {
      cy.nodes().removeClass('highlighted dimmed')
      cy.edges().removeClass('highlighted dimmed')
      return
    }

    const query = searchQuery.toLowerCase()
    const matchingNodes = cy.nodes().filter((node: NodeSingular) => {
      if (node.hasClass('directory-cluster')) return false
      const label = (node.data('fullLabel') || '').toLowerCase()
      const type = (node.data('type') || '').toLowerCase()
      const path = (node.data('path') || '').toLowerCase()
      return label.includes(query) || type.includes(query) || path.includes(query)
    })

    const matchingIds = new Set(matchingNodes.map((n: NodeSingular) => n.id()))

    cy.nodes().forEach((node: NodeSingular) => {
      if (node.hasClass('directory-cluster')) return
      if (matchingIds.has(node.id())) {
        node.removeClass('dimmed').addClass('highlighted')
      } else {
        node.removeClass('highlighted').addClass('dimmed')
      }
    })

    cy.edges().forEach((edge: EdgeSingular) => {
      const srcMatch = matchingIds.has(edge.data('source'))
      const tgtMatch = matchingIds.has(edge.data('target'))
      if (srcMatch && tgtMatch) {
        edge.removeClass('dimmed').addClass('highlighted')
      } else {
        edge.removeClass('highlighted').addClass('dimmed')
      }
    })
  }, [searchQuery])

  // ── Filter effect ──────────────────────────────────────────────────────

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    cy.nodes().forEach((node: NodeSingular) => {
      if (node.hasClass('directory-cluster')) return
      const nodeType = node.data('type') as NodeType
      if (filters.has(nodeType) && (!activeTypeFilter || nodeType === activeTypeFilter)) {
        node.removeClass('filtered-out')
      } else {
        node.addClass('filtered-out')
      }
    })

    cy.edges().forEach((edge: EdgeSingular) => {
      const src = cy.getElementById(edge.data('source'))
      const tgt = cy.getElementById(edge.data('target'))
      if (src.hasClass('filtered-out') || tgt.hasClass('filtered-out')) {
        edge.addClass('filtered-out')
      } else {
        edge.removeClass('filtered-out')
      }
    })
  }, [filters, activeTypeFilter])

  // ── Selection effect ───────────────────────────────────────────────────

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    cy.nodes().removeClass('selected')
    cy.edges().removeClass('connected-to-selected')

    if (selectedNodeId) {
      const node = cy.getElementById(selectedNodeId)
      if (node) {
        node.addClass('selected')
        node.connectedEdges().addClass('connected-to-selected')
      }
    }
  }, [selectedNodeId])

  // ── Layout switcher ────────────────────────────────────────────────────

  function runLayoutInternal(cy: Core, layoutName: LayoutName, nodeCount: number) {
    const isLarge = nodeCount > 300
    let layoutOpts: Record<string, unknown>

    switch (layoutName) {
      case 'fcose':
        layoutOpts = {
          name: 'fcose',
          quality: isLarge ? 'draft' : 'default',
          randomize: true,
          animate: !isLarge,
          animationDuration: isLarge ? 0 : 1000,
          nodeDimensionsIncludeLabels: true,
          fit: true,
          padding: 60,
          nodeRepulsion: () => isLarge ? 4000 : 8000,
          idealEdgeLength: () => isLarge ? 50 : 80,
          edgeElasticity: () => 200,
          nestingFactor: 0.5,
          gravity: 0.25,
          numIter: isLarge ? 1000 : 2500,
          tile: true,
          // For compound nodes (directory clustering)
          nodeSeparation: 40,
        }
        break
      case 'grid':
        layoutOpts = {
          name: 'grid',
          animate: !isLarge,
          animationDuration: 800,
          fit: true,
          padding: 60,
          sort: (a: NodeSingular, b: NodeSingular) => {
            const typeOrder: Record<string, number> = {
              project: 0, agent: 1, task: 2, skill: 3, memory: 4,
              file: 5, doc: 6, folder: 7, config: 8, script: 9,
              concept: 10, tag: 11, person: 12, event: 13,
            }
            return (typeOrder[a.data('type')] || 99) - (typeOrder[b.data('type')] || 99)
          },
        }
        break
      case 'concentric':
        layoutOpts = {
          name: 'concentric',
          animate: !isLarge,
          animationDuration: 800,
          fit: true,
          padding: 60,
          concentric: (node: NodeSingular) => node.data('degree'),
          levelWidth: () => 3,
        }
        break
      case 'circle':
        layoutOpts = {
          name: 'circle',
          animate: !isLarge,
          animationDuration: 800,
          fit: true,
          padding: 60,
          sort: (a: NodeSingular, b: NodeSingular) => b.data('degree') - a.data('degree'),
        }
        break
    }

    cy.layout(layoutOpts as any).run()
  }

  const handleLayoutChange = useCallback((layoutName: LayoutName) => {
    const cy = cyRef.current
    if (!cy) return
    setCurrentLayout(layoutName)
    runLayoutInternal(cy, layoutName, currentNodes.length)
  }, [currentNodes.length])

  // ── Handle node select from detail panel ───────────────────────────────

  const handleNodeSelect = useCallback((id: string) => {
    setSelectedNodeId(id)
    const cy = cyRef.current
    if (cy) {
      const node = cy.getElementById(id)
      if (node && !node.hasClass('directory-cluster')) {
        cy.animate({
          center: { eles: node },
          zoom: 1.5,
          duration: 500,
        } as any)
      }
    }
  }, [])

  // ── Zoom controls ──────────────────────────────────────────────────────

  const handleZoomIn = useCallback(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.zoom({
      level: Math.min(5, cy.zoom() + 0.2),
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
    })
  }, [])

  const handleZoomOut = useCallback(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.zoom({
      level: Math.max(0.05, cy.zoom() - 0.2),
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
    })
  }, [])

  const handleFit = useCallback(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.fit(undefined, 50)
  }, [])

  // ── Toggle filters ─────────────────────────────────────────────────────

  const handleToggleAllFilters = useCallback(() => {
    setFilters((prev: Set<NodeType>) => {
      if (prev.size === ALL_NODE_TYPES.length) {
        return new Set<NodeType>()
      }
      return new Set<NodeType>(ALL_NODE_TYPES)
    })
    setActiveTypeFilter(null)
  }, [setFilters, setActiveTypeFilter])

  // ── Show more nodes ────────────────────────────────────────────────────

  const handleShowMore = useCallback(() => {
    setNodeLimit(nodeLimit + 500)
  }, [setNodeLimit, nodeLimit])

  // ── Keyboard shortcuts ─────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('graph-search')?.focus()
      }
      if (e.key === 'Escape') {
        if (searchQuery) setSearchQuery('')
        else if (selectedNodeId) setSelectedNodeId(null)
        else if (showTypeDropdown) setShowTypeDropdown(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery, selectedNodeId, showTypeDropdown])

  // ── Derived state ──────────────────────────────────────────────────────

  const selectedNode = graphData?.nodes.find((n: GraphNode) => n.id === selectedNodeId) || null
  const renderedCount = currentNodes.length
  const totalVisible = graphData ? graphData.nodes.filter(n => filters.has(n.type)).length : 0

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-950">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Scanning workspace...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-950">
          <div className="text-center">
            <p className="text-red-400 mb-4">Failed to load graph: {error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-500 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Graph Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Controls Toolbar */}
      {graphData && !loading && (
        <GraphControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilters={filters}
          onToggleFilter={toggleFilter}
          onToggleAllFilters={handleToggleAllFilters}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFit={handleFit}
          onRefresh={refetch}
          onLayoutChange={handleLayoutChange}
          currentLayout={currentLayout}
        />
      )}

      {/* ── Type Filter Dropdown ──────────────────────────────────────── */}
      {graphData && !loading && (
        <div className="absolute top-4 right-4 z-30">
          <div className="relative">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            >
              {activeTypeFilter ? (
                <>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: NODE_COLORS[activeTypeFilter]?.bg }}
                  />
                  <span>{activeTypeFilter}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveTypeFilter(null) }}
                    className="text-slate-500 hover:text-white ml-1"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Filter by type</span>
                </>
              )}
            </button>

            {showTypeDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-slate-700 shadow-2xl overflow-hidden z-50">
                <button
                  onClick={() => { setActiveTypeFilter(null); setShowTypeDropdown(false) }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 ${
                    !activeTypeFilter ? 'text-white bg-slate-800' : 'text-slate-400'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-slate-600" />
                  All Types
                </button>
                {ALL_NODE_TYPES.map(type => {
                  const count = graphData.stats.nodeCounts?.[type] || 0
                  const colors = NODE_COLORS[type] || { bg: '#6B7280' }
                  return (
                    <button
                      key={type}
                      onClick={() => { setActiveTypeFilter(type); setShowTypeDropdown(false) }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-800 transition-colors flex items-center justify-between ${
                        activeTypeFilter === type ? 'text-white bg-slate-800' : 'text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.bg }} />
                        {type}
                      </span>
                      <span className="text-xs text-slate-600">{count}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── View Mode Toggle ──────────────────────────────────────────── */}
      {graphData && !loading && (
        <div className="absolute top-4 left-4 z-30">
          <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50">
            <span className="text-xs text-slate-500 mr-1 px-1">View:</span>
            {(['default', 'by-type', 'by-directory'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  viewMode === mode
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {mode === 'default' ? 'Mixed' : mode === 'by-type' ? 'By Type' : 'By Dir'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats Bar with type counts ─────────────────────────────────── */}
      {graphData && !loading && (
        <div className="absolute bottom-14 left-4 right-4 z-30">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-700/50 text-xs text-slate-400 overflow-x-auto">
            <span className="font-medium text-slate-300 whitespace-nowrap">
              {formatCount(graphData.stats.totalNodes)} nodes · {formatCount(graphData.stats.totalEdges)} edges
            </span>
            {renderedCount < totalVisible && (
              <span className="text-amber-400 whitespace-nowrap">
                showing {formatCount(renderedCount)} of {formatCount(totalVisible)}
              </span>
            )}
            <span className="text-slate-600">│</span>
            {typeCounts.map(([type, count]) => (
              <span key={type} className="flex items-center gap-1 whitespace-nowrap">
                <span>{NODE_TYPE_EMOJI[type] || '•'}</span>
                <span>{formatCount(count)}</span>
              </span>
            ))}
            {graphData.stats.generatedAt && (
              <span className="ml-auto text-slate-600 whitespace-nowrap">
                {new Date(graphData.stats.generatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Show More button ──────────────────────────────────────────── */}
      {hasMore && !loading && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={handleShowMore}
            className="px-4 py-2 bg-violet-600/90 hover:bg-violet-500 text-white text-sm rounded-lg shadow-lg backdrop-blur-sm transition-colors flex items-center gap-2"
          >
            <span>Show more nodes</span>
            <span className="text-violet-300 text-xs">
              (+{Math.min(500, totalVisible - renderedCount)})
            </span>
          </button>
        </div>
      )}

      {/* Detail Panel */}
      {selectedNode && (
        <NodeDetailsPanel
          node={selectedNode}
          edges={graphData?.edges || []}
          allNodes={graphData?.nodes || []}
          onClose={() => setSelectedNodeId(null)}
          onNodeSelect={handleNodeSelect}
        />
      )}

      {/* Legend */}
      {graphData && !loading && <GraphLegend stats={graphData.stats} />}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl pointer-events-none text-sm max-w-xs"
          style={{ left: tooltip.position.x + 12, top: tooltip.position.y - 48 }}
        >
          <div className="font-semibold text-white">{tooltip.node.label}</div>
          <div className="text-slate-400 text-xs">
            {tooltip.node.type} · {tooltip.node.degree} connection{tooltip.node.degree !== 1 ? 's' : ''}
          </div>
          {tooltip.node.path && (
            <div className="text-slate-500 text-xs mt-0.5 font-mono truncate">
              {tooltip.node.path}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Named export for compatibility
export { GraphView }
