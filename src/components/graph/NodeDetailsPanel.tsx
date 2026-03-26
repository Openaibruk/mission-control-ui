'use client'

import { GraphNode, GraphEdge } from '@/lib/graphTypes'
import { getNodeColor, getNodeLabel } from './graphStyles'
import { X, Copy, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react'

interface NodeDetailsPanelProps {
  node: GraphNode | null
  edges: GraphEdge[]
  allNodes: GraphNode[]
  onClose: () => void
  onNodeSelect: (id: string) => void
}

export function NodeDetailsPanel({ node, edges, allNodes, onClose, onNodeSelect }: NodeDetailsPanelProps) {
  if (!node) return null

  const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id)
  const nodeMap = new Map(allNodes.map(n => [n.id, n]))

  const content = node.metadata?.content as string | undefined
  const tags = node.metadata?.tags as string[] | undefined
  const status = node.metadata?.status as string | undefined
  const modified = node.metadata?.modified as string | undefined
  const size = node.metadata?.size as number | undefined
  const description = node.metadata?.description as string | undefined
  const priority = node.metadata?.priority as string | undefined
  const department = node.metadata?.department as string | undefined

  const colors = getNodeColor(node.type)

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[340px] bg-slate-900/95 backdrop-blur-md border-l border-slate-700 z-40 overflow-y-auto animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: colors.bg }} />
          <h3 className="font-semibold text-white truncate">{node.label}</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metadata */}
      <div className="p-4 space-y-3">
        <MetaField label="Type" value={getNodeLabel(node.type)} />
        {node.path && <MetaField label="Path" value={node.path} mono />}
        {status && <MetaField label="Status" value={status} capitalize />}
        {description && <MetaField label="Description" value={description} />}
        {priority && <MetaField label="Priority" value={priority} capitalize />}
        {department && <MetaField label="Department" value={department} />}
        {modified && (
          <MetaField label="Modified" value={new Date(modified).toLocaleDateString()} />
        )}
        {size !== undefined && (
          <MetaField label="Size" value={`${(size / 1024).toFixed(1)} KB`} />
        )}

        {tags && tags.length > 0 && (
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Tags</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Connections */}
      <div className="px-4 pb-4">
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          Connections ({connectedEdges.length})
        </span>
        <div className="mt-2 space-y-1">
          {connectedEdges.map(edge => {
            const isSource = edge.source === node.id
            const connectedId = isSource ? edge.target : edge.source
            const connectedNode = nodeMap.get(connectedId)
            if (!connectedNode) return null

            const connectedColors = getNodeColor(connectedNode.type)

            return (
              <button
                key={edge.id}
                onClick={() => onNodeSelect(connectedId)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800 transition-colors text-left group"
              >
                <span className="text-xs text-slate-500 w-16 flex-shrink-0 flex items-center gap-0.5">
                  {isSource ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                  {edge.type.replace(/_/g, ' ')}
                </span>
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: connectedColors.bg }}
                />
                <span className="text-sm text-slate-300 truncate group-hover:text-white">
                  {connectedNode.label}
                </span>
              </button>
            )
          })}
          {connectedEdges.length === 0 && (
            <p className="text-sm text-slate-500 italic">No connections</p>
          )}
        </div>
      </div>

      {/* Content Preview */}
      {content && (
        <div className="px-4 pb-4">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Preview</span>
          <div className="mt-1 p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap line-clamp-6">
              {content}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-6 flex gap-2">
        {node.path && (
          <button
            onClick={() => navigator.clipboard.writeText(node.path!)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
          >
            <Copy className="w-3 h-3" /> Copy Path
          </button>
        )}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-600/20 text-violet-300 rounded hover:bg-violet-600/30 transition-colors">
          <ExternalLink className="w-3 h-3" /> Open
        </button>
      </div>
    </div>
  )
}

// Helper sub-component
function MetaField({ label, value, mono, capitalize }: {
  label: string
  value: string
  mono?: boolean
  capitalize?: boolean
}) {
  return (
    <div>
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      <p className={`text-sm text-slate-200 ${mono ? 'font-mono truncate' : ''} ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </p>
    </div>
  )
}
