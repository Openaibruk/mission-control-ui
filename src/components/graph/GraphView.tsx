'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import cytoscape, {
  Core,
  NodeSingular,
  EdgeSingular,
} from 'cytoscape'
import fcose from 'cytoscape-fcose'

import { NodeType, GraphNode, GraphEdge, GraphData } from '@/lib/graphTypes'
import { useGraphData, ALL_NODE_TYPES } from './useGraphData'
import { GraphControls } from './GraphControls'
import { NodeDetailsPanel } from './NodeDetailsPanel'
import { GraphLegend } from './GraphLegend'
import {
  NODE_COLORS,
  NODE_SHAPES,
  NODE_BASE_SIZES,
  EDGE_COLORS,
} from './graphStyles'

// Register fcose layout
cytoscape.use(fcose)

// ─── Types ───────────────────────────────────────────────────────────────────

type LayoutName = 'fcose' | 'concentric' | 'grid' | 'circle'

interface GraphViewProps {
  theme?: 'dark' | 'light'
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function GraphView({ theme: _theme }: GraphViewProps = {}) {
  void _theme // reserved for light theme

  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const { data: graphData, loading, error, refetch, filters, toggleFilter, setFilters } = useGraphData()

  // UI State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [currentLayout, setCurrentLayout] = useState<LayoutName>('fcose')
  const [tooltip, setTooltip] = useState<{
    node: { label: string; type: NodeType; degree: number }
    position: { x: number; y: number }
  } | null>(null)

  // ── Initialize Cytoscape ────────────────────────────────────────────────

  useEffect(() => {
    if (!graphData || !containerRef.current) return

    const elements: cytoscape.ElementDefinition[] = []
    const maxDegree = Math.max(...graphData.nodes.map((n: GraphNode) => n.degree), 1)

    for (const node of graphData.nodes) {
      const colors = NODE_COLORS[node.type] || { bg: '#6B7280', border: '#4B5563' }
      const baseSize = NODE_BASE_SIZES[node.type] || 30
      const sizeScale = 1 + (node.degree / maxDegree) * 1.5
      const size = baseSize * sizeScale

      elements.push({
        data: {
          id: node.id,
          label: node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label,
          fullLabel: node.label,
          type: node.type,
          degree: node.degree,
          color: colors.bg,
          borderColor: colors.border,
          shape: NODE_SHAPES[node.type] || 'ellipse',
          size,
        },
      })
    }

    for (const edge of graphData.edges) {
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

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: ([
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
            'font-size': 11,
            'font-family': 'system-ui, -apple-system, sans-serif',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-wrap': 'ellipsis',
            'text-max-width': '120px',
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
            'width': 1.5,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'target-arrow-width': 8,
            'curve-style': 'bezier',
            'opacity': 0.4,
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
      minZoom: 0.1,
      maxZoom: 5,
      wheelSensitivity: 0.3,
    })

    // Run fcose layout
    runLayoutInternal(cy, 'fcose')

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
        // Double tap - could trigger navigation
        const node = evt.target as NodeSingular
        console.log('Double-clicked node:', node.data('fullLabel'))
        return
      }
      tapTimeout = setTimeout(() => {
        tapTimeout = null
      }, 300)
    })

    cy.on('mouseover', 'node', (evt) => {
      const node = evt.target as NodeSingular
      const renderedPosition = node.renderedPosition()
      setTooltip({
        node: {
          label: node.data('fullLabel'),
          type: node.data('type'),
          degree: node.data('degree'),
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
      // Only remove dim if no search is active
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
  }, [graphData])

  // ── Search effect ──────────────────────────────────────────────────────

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
      const label = (node.data('fullLabel') || '').toLowerCase()
      const type = (node.data('type') || '').toLowerCase()
      return label.includes(query) || type.includes(query)
    })

    const matchingIds = new Set(matchingNodes.map((n: NodeSingular) => n.id()))

    cy.nodes().forEach((node: NodeSingular) => {
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
      const nodeType = node.data('type') as NodeType
      if (filters.has(nodeType)) {
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
  }, [filters])

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

  function runLayoutInternal(cy: Core, layoutName: LayoutName) {
    let layoutOpts: Record<string, unknown>

    switch (layoutName) {
      case 'fcose':
        layoutOpts = {
          name: 'fcose',
          quality: 'default',
          randomize: true,
          animate: true,
          animationDuration: 1000,
          nodeDimensionsIncludeLabels: true,
          fit: true,
          padding: 60,
          nodeRepulsion: () => 8000,
          idealEdgeLength: () => 80,
          edgeElasticity: () => 200,
          nestingFactor: 0.5,
          gravity: 0.25,
          numIter: 2500,
          tile: true,
        }
        break
      case 'grid':
        layoutOpts = {
          name: 'grid',
          animate: true,
          animationDuration: 800,
          fit: true,
          padding: 60,
          sort: (a: NodeSingular, b: NodeSingular) => {
            const typeOrder: Record<string, number> = { project: 0, agent: 1, task: 2, file: 3, folder: 4, concept: 5, tag: 6 }
            return (typeOrder[a.data('type')] || 99) - (typeOrder[b.data('type')] || 99)
          },
        }
        break
      case 'concentric':
        layoutOpts = {
          name: 'concentric',
          animate: true,
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
          animate: true,
          animationDuration: 800,
          fit: true,
          padding: 60,
          sort: (a: NodeSingular, b: NodeSingular) => a.data('degree') - b.data('degree'),
        }
        break
    }

    cy.layout(layoutOpts as any).run()
  }

  const handleLayoutChange = useCallback((layoutName: LayoutName) => {
    const cy = cyRef.current
    if (!cy) return
    setCurrentLayout(layoutName)
    runLayoutInternal(cy, layoutName)
  }, [])

  // ── Handle node select from detail panel ───────────────────────────────

  const handleNodeSelect = useCallback((id: string) => {
    setSelectedNodeId(id)
    const cy = cyRef.current
    if (cy) {
      const node = cy.getElementById(id)
      if (node) {
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
      level: Math.max(0.1, cy.zoom() - 0.2),
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
  }, [setFilters])

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
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery, selectedNodeId])

  // ── Derived state ──────────────────────────────────────────────────────

  const selectedNode = graphData?.nodes.find((n: GraphNode) => n.id === selectedNodeId) || null

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

      {/* Stats Bar */}
      {graphData && !loading && (
        <div className="absolute bottom-14 left-4 z-30">
          <div className="px-3 py-2 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-700/50 text-xs text-slate-400">
            {graphData.stats.totalNodes} nodes · {graphData.stats.totalEdges} edges
            {graphData.stats.generatedAt && (
              <span className="ml-2 text-slate-600">
                · {new Date(graphData.stats.generatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
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
          className="fixed z-50 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl pointer-events-none text-sm"
          style={{ left: tooltip.position.x + 12, top: tooltip.position.y - 48 }}
        >
          <div className="font-semibold text-white">{tooltip.node.label}</div>
          <div className="text-slate-400 text-xs">
            {tooltip.node.type} · {tooltip.node.degree} connection{tooltip.node.degree !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}

// Named export for compatibility
export { GraphView }
