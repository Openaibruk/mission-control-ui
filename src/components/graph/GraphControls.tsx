'use client'

import { useCallback } from 'react'
import { NodeType } from '@/lib/graphTypes'
import { NODE_COLORS, NODE_TYPE_LABELS } from './graphStyles'
import { Search, ZoomIn, ZoomOut, Maximize2, RefreshCw, LayoutGrid, Circle, Layers } from 'lucide-react'

interface GraphControlsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilters: Set<NodeType>
  onToggleFilter: (type: NodeType) => void
  onToggleAllFilters: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onRefresh: () => void
  onLayoutChange: (layout: 'fcose' | 'concentric' | 'grid' | 'circle') => void
  currentLayout: string
}

const ALL_TYPES: NodeType[] = ['file', 'folder', 'project', 'agent', 'task', 'concept', 'tag', 'person', 'event']

const LAYOUT_OPTIONS = [
  { id: 'fcose' as const, label: 'Force', icon: Circle },
  { id: 'concentric' as const, label: 'Concentric', icon: Layers },
  { id: 'grid' as const, label: 'Grid', icon: LayoutGrid },
  { id: 'circle' as const, label: 'Circle', icon: Circle },
]

export function GraphControls({
  searchQuery,
  onSearchChange,
  activeFilters,
  onToggleFilter,
  onToggleAllFilters,
  onZoomIn,
  onZoomOut,
  onFit,
  onRefresh,
  onLayoutChange,
  currentLayout,
}: GraphControlsProps) {
  const allActive = activeFilters.size === ALL_TYPES.length

  const getShortLabel = useCallback((type: NodeType): string => {
    const labels: Record<string, string> = {
      file: 'F', folder: '📁', project: 'P', agent: 'A',
      task: 'T', concept: 'C', tag: '#', person: '@', event: '📅',
    }
    return labels[type] || type[0].toUpperCase()
  }, [])

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            id="graph-search"
            type="text"
            placeholder="Search nodes... ⌘K"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-52 pl-8 pr-7 py-1.5 bg-slate-800/80 text-white text-sm rounded-lg border border-slate-600/50 focus:outline-none focus:border-violet-500 placeholder-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-700" />

        {/* Type Filters */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleAllFilters}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              allActive ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          {ALL_TYPES.map(type => {
            const active = activeFilters.has(type)
            const colors = NODE_COLORS[type] || { bg: '#6B7280' }
            return (
              <button
                key={type}
                onClick={() => onToggleFilter(type)}
                title={NODE_TYPE_LABELS[type] || type}
                className={`w-6 h-6 rounded flex items-center justify-center transition-all text-[9px] font-bold ${
                  active ? 'ring-1 ring-white/30' : 'opacity-30'
                }`}
                style={{
                  backgroundColor: active ? colors.bg : 'transparent',
                  border: `2px solid ${colors.bg}`,
                  color: active ? '#fff' : colors.bg,
                }}
              >
                {getShortLabel(type)}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-700" />

        {/* Layout */}
        <div className="flex items-center gap-1">
          {LAYOUT_OPTIONS.map(layout => {
            const isActive = currentLayout === layout.id
            return (
              <button
                key={layout.id}
                onClick={() => onLayoutChange(layout.id)}
                title={layout.label}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  isActive ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {layout.label}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-700" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button onClick={onZoomOut} className="w-7 h-7 flex items-center justify-center text-slate-300 bg-slate-800 rounded hover:bg-slate-700 transition-colors" title="Zoom out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={onZoomIn} className="w-7 h-7 flex items-center justify-center text-slate-300 bg-slate-800 rounded hover:bg-slate-700 transition-colors" title="Zoom in">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={onFit} className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors" title="Fit to view">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Refresh */}
        <button onClick={onRefresh} className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors" title="Refresh graph">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
