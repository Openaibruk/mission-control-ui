'use client'

import { NodeType } from '@/lib/graphTypes'

// ─── Shared Style Config ─────────────────────────────────────────────────────

export const NODE_COLORS: Record<string, { bg: string; border: string }> = {
  file:    { bg: '#3B82F6', border: '#2563EB' },
  folder:  { bg: '#1E3A5F', border: '#0F2744' },
  skill:   { bg: '#10B981', border: '#059669' },
  memory:  { bg: '#8B5CF6', border: '#7C3AED' },
  doc:     { bg: '#06B6D4', border: '#0891B2' },
  config:  { bg: '#F59E0B', border: '#D97706' },
  tag:     { bg: '#EAB308', border: '#CA8A04' },
  concept: { bg: '#6B7280', border: '#4B5563' },
  script:  { bg: '#EF4444', border: '#DC2626' },
  task:    { bg: '#F97316', border: '#EA580C' },
  agent:   { bg: '#A855F7', border: '#9333EA' },
  project: { bg: '#14B8A6', border: '#0D9488' },
  person:  { bg: '#EC4899', border: '#DB2777' },
  event:   { bg: '#14B8A6', border: '#0D9488' },
}

export const NODE_SHAPES: Record<string, string> = {
  file:    'ellipse',
  folder:  'round-rectangle',
  skill:   'diamond',
  memory:  'hexagon',
  doc:     'round-rectangle',
  config:  'barrel',
  tag:     'triangle',
  concept: 'ellipse',
  script:  'round-rectangle',
  task:    'round-rectangle',
  agent:   'hexagon',
  project: 'diamond',
  person:  'ellipse',
  event:   'round-tag',
}

export const NODE_BASE_SIZES: Record<string, number> = {
  file:    28,
  folder:  40,
  skill:   36,
  memory:  34,
  doc:     30,
  config:  28,
  tag:     18,
  concept: 22,
  script:  28,
  task:    30,
  agent:   38,
  project: 44,
  person:  30,
  event:   30,
}

export const EDGE_COLORS: Record<string, string> = {
  link: '#60A5FA',
  embed: '#818CF8',
  tag: '#A78BFA',
  assigned: '#34D399',
  belongs_to: '#6B7280',
  created: '#FBBF24',
  depends_on: '#F87171',
  references: '#60A5FA',
  contains: '#6B7280',
  mentions: '#9CA3AF',
  links_to: '#60A5FA',
  assigned_to: '#34D399',
  part_of: '#F472B6',
}

export const NODE_TYPE_LABELS: Record<string, string> = {
  file: 'File',
  folder: 'Folder',
  skill: 'Skill',
  memory: 'Memory',
  doc: 'Document',
  config: 'Config',
  tag: 'Tag',
  concept: 'Concept',
  script: 'Script',
  task: 'Task',
  agent: 'Agent',
  project: 'Project',
  person: 'Person',
  event: 'Event',
}

// Emoji mapping for type counts display
export const NODE_TYPE_EMOJI: Record<string, string> = {
  file: '📄',
  folder: '📂',
  skill: '🛠️',
  memory: '🧠',
  doc: '📝',
  config: '⚙️',
  tag: '🏷️',
  concept: '💡',
  script: '📜',
  task: '✅',
  agent: '🤖',
  project: '📁',
  person: '👤',
  event: '📅',
}

export function getNodeColor(type: string) {
  return NODE_COLORS[type] || { bg: '#6B7280', border: '#4B5563' }
}

export function getNodeShape(type: string) {
  return NODE_SHAPES[type] || 'ellipse'
}

export function getNodeBaseSize(type: string) {
  return NODE_BASE_SIZES[type] || 30
}

export function getEdgeColor(type: string) {
  return EDGE_COLORS[type] || '#6B7280'
}

export function getNodeLabel(type: string) {
  return NODE_TYPE_LABELS[type] || type
}
