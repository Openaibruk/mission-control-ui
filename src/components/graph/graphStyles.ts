'use client'

import { NodeType } from '@/lib/graphTypes'

// ─── Shared Style Config ─────────────────────────────────────────────────────

export const NODE_COLORS: Record<string, { bg: string; border: string }> = {
  file:    { bg: '#3B82F6', border: '#2563EB' },
  memory:  { bg: '#3B82F6', border: '#2563EB' },
  project: { bg: '#10B981', border: '#059669' },
  agent:   { bg: '#8B5CF6', border: '#7C3AED' },
  task:    { bg: '#F59E0B', border: '#D97706' },
  concept: { bg: '#06B6D4', border: '#0891B2' },
  tag:     { bg: '#6B7280', border: '#4B5563' },
  folder:  { bg: '#F97316', border: '#EA580C' },
  person:  { bg: '#EC4899', border: '#DB2777' },
  event:   { bg: '#14B8A6', border: '#0D9488' },
}

export const NODE_SHAPES: Record<string, string> = {
  file: 'ellipse',
  memory: 'ellipse',
  project: 'diamond',
  agent: 'hexagon',
  task: 'round-rectangle',
  concept: 'ellipse',
  tag: 'ellipse',
  folder: 'round-rectangle',
  person: 'ellipse',
  event: 'round-tag',
}

export const NODE_BASE_SIZES: Record<string, number> = {
  file: 36,
  memory: 36,
  project: 44,
  agent: 40,
  task: 32,
  concept: 24,
  tag: 16,
  folder: 36,
  person: 30,
  event: 30,
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
  // Legacy names from original component
  links_to: '#60A5FA',
  assigned_to: '#34D399',
  part_of: '#F472B6',
}

export const NODE_TYPE_LABELS: Record<string, string> = {
  file: 'File',
  memory: 'Memory',
  project: 'Project',
  agent: 'Agent',
  task: 'Task',
  concept: 'Concept',
  tag: 'Tag',
  folder: 'Folder',
  person: 'Person',
  event: 'Event',
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
