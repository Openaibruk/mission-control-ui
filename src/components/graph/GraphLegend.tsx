'use client'

import { GraphStats } from '@/lib/graphTypes'
import { NODE_COLORS, EDGE_COLORS, NODE_TYPE_LABELS } from './graphStyles'

interface GraphLegendProps {
  stats?: GraphStats | null
}

// Which types to show in the legend
const LEGEND_NODE_TYPES = ['file', 'folder', 'project', 'agent', 'task', 'concept', 'tag']
const LEGEND_EDGE_TYPES = ['link', 'tag', 'assigned', 'belongs_to', 'contains', 'depends_on']

export function GraphLegend({ stats }: GraphLegendProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-30 flex items-end justify-between pointer-events-none">
      {/* Node Legend */}
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/70 backdrop-blur-sm rounded-lg border border-slate-700/50 pointer-events-auto">
        {LEGEND_NODE_TYPES.map(type => {
          const colors = NODE_COLORS[type] || { bg: '#6B7280' }
          const count = stats?.nodeCounts?.[type]
          return (
            <div key={type} className="flex items-center gap-1.5" title={NODE_TYPE_LABELS[type] || type}>
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors.bg }}
              />
              <span className="text-xs text-slate-400">
                {NODE_TYPE_LABELS[type] || type}
                {count !== undefined && (
                  <span className="text-slate-600 ml-0.5">({count})</span>
                )}
              </span>
            </div>
          )
        })}
      </div>

      {/* Edge Legend */}
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/70 backdrop-blur-sm rounded-lg border border-slate-700/50 pointer-events-auto">
        {LEGEND_EDGE_TYPES.map(type => {
          const color = EDGE_COLORS[type] || '#6B7280'
          return (
            <div key={type} className="flex items-center gap-1.5" title={type.replace(/_/g, ' ')}>
              <div className="w-4 h-0.5 rounded" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-500">{type.replace(/_/g, ' ')}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
