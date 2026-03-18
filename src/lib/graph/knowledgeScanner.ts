import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// ─── Types ───────────────────────────────────────────────────────────────────

export type NodeType = 'file' | 'memory' | 'concept' | 'tag' | 'project' | 'agent' | 'task'

export type EdgeType = 'links_to' | 'mentions' | 'contains' | 'tagged_with' | 'assigned_to' | 'part_of'

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  path?: string
  metadata: {
    created?: string
    modified?: string
    size?: number
    description?: string
    tags?: string[]
    status?: string
    linkCount?: number
    content?: string
    [key: string]: unknown
  }
  degree: number
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: EdgeType
  label?: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  stats: {
    totalNodes: number
    totalEdges: number
    nodeCounts: Record<string, number>
    generatedAt: string
  }
}

// ─── Config ──────────────────────────────────────────────────────────────────

const WORKSPACE = '/home/ubuntu/.openclaw/workspace'

const SCAN_DIRS = [
  'memory',
  'chipchip',
  'projects',
]

const ROOT_FILES = [
  'SOUL.md',
  'USER.md',
  'MEMORY.md',
  'AGENTS.md',
  'TOOLS.md',
  'IDENTITY.md',
  'HEARTBEAT.md',
  'BRAIN.md',
]

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgrdeznxllkdolvrhlnm.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'

// ─── Filesystem Scanner ──────────────────────────────────────────────────────

function walkDir(dir: string, extensions: string[] = ['.md']): string[] {
  const results: string[] = []
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        // Skip hidden dirs, node_modules, .git, etc.
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
        results.push(...walkDir(fullPath, extensions))
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath)
      }
    }
  } catch {
    // Dir doesn't exist or not readable — skip
  }
  return results
}

// ─── Parsers ─────────────────────────────────────────────────────────────────

function extractWikilinks(content: string): { target: string; alias?: string }[] {
  const links: { target: string; alias?: string }[] = []
  // [[link]] and [[link|alias]]
  const regex = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g
  let match
  while ((match = regex.exec(content)) !== null) {
    links.push({ target: match[1].trim(), alias: match[2]?.trim() })
  }
  return links
}

function extractMarkdownLinks(content: string): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match
  while ((match = regex.exec(content)) !== null) {
    // Skip image links
    if (match[0].startsWith('![')) continue
    links.push({ text: match[1].trim(), url: match[2].trim() })
  }
  return links
}

function extractTags(content: string): string[] {
  const tags: string[] = []
  const regex = /(?:^|\s)#([a-zA-Z0-9/_-]+)/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    const tag = match[1]
    // Avoid matching # headings (single word after # on its own line)
    if (tag.length > 1) {
      tags.push(tag)
    }
  }
  return [...new Set(tags)]
}

function extractHeadings(content: string): string[] {
  const headings: string[] = []
  const regex = /^#{1,6}\s+(.+)$/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    headings.push(match[1].trim())
  }
  return headings
}

function getContentPreview(content: string, maxLen = 200): string {
  // Strip markdown formatting for preview
  const stripped = content
    .replace(/^#+\s+/gm, '')
    .replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .trim()
  return stripped.length > maxLen ? stripped.substring(0, maxLen) + '...' : stripped
}

// ─── Resolve link targets ────────────────────────────────────────────────────

function resolveLinkTarget(linkText: string, sourcePath: string): string {
  // Try to find a matching file in the workspace
  const normalized = linkText.replace(/\//g, path.sep)
  
  // Check if it's already a known file ID
  const candidates = [
    path.join(WORKSPACE, `${normalized}.md`),
    path.join(WORKSPACE, normalized),
    path.join(path.dirname(sourcePath), `${normalized}.md`),
    path.join(path.dirname(sourcePath), normalized),
  ]
  
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }
  
  // If no file found, treat as a concept node
  return `concept:${linkText.toLowerCase().replace(/\s+/g, '-')}`
}

// ─── Supabase Data Fetcher ───────────────────────────────────────────────────

async function fetchSupabaseGraphData(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    // Fetch projects
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name, description, status, department, done_tasks, total_tasks, created_at')
    
    if (projects) {
      for (const p of projects) {
        nodes.push({
          id: `project:${p.id}`,
          label: p.name || `Project ${p.id}`,
          type: 'project',
          path: undefined,
          metadata: {
            description: p.description,
            status: p.status,
            created: p.created_at,
            department: p.department,
          },
          degree: 0,
        })
      }
    }

    // Fetch tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title, description, status, assignees, project_id, priority, created_at, updated_at')
    
    if (tasks) {
      for (const t of tasks) {
        nodes.push({
          id: `task:${t.id}`,
          label: t.title || `Task ${t.id}`,
          type: 'task',
          metadata: {
            description: t.description,
            status: t.status,
            created: t.created_at,
            modified: t.updated_at,
          },
          degree: 0,
        })

        // Edge: task → project (part_of)
        if (t.project_id) {
          edges.push({
            id: `task:${t.id}-part_of-project:${t.project_id}`,
            source: `task:${t.id}`,
            target: `project:${t.project_id}`,
            type: 'part_of',
          })
        }

        // Edge: agent → task (assigned_to)
        if (t.assignees && Array.isArray(t.assignees)) {
          for (const assignee of t.assignees) {
            edges.push({
              id: `agent:${assignee}-assigned_to-task:${t.id}`,
              source: `agent:${assignee}`,
              target: `task:${t.id}`,
              type: 'assigned_to',
            })
          }
        }
      }
    }

    // Fetch agents
    const { data: agents } = await supabase
      .from('agents')
      .select('id, name, role, status, model, created_at')
    
    if (agents) {
      for (const a of agents) {
        nodes.push({
          id: `agent:${a.id}`,
          label: a.name || a.id,
          type: 'agent',
          metadata: {
            description: a.role,
            status: a.status,
            created: a.created_at,
          },
          degree: 0,
        })
      }
    }

  } catch (err) {
    console.error('Supabase fetch error:', err)
  }

  return { nodes, edges }
}

// ─── Main Scanner ────────────────────────────────────────────────────────────

export async function scanWorkspace(): Promise<GraphData> {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const nodeMap = new Map<string, GraphNode>()

  // 1. Collect all markdown files
  const allFiles: string[] = []
  
  // Root-level files
  for (const file of ROOT_FILES) {
    const fullPath = path.join(WORKSPACE, file)
    if (fs.existsSync(fullPath)) {
      allFiles.push(fullPath)
    }
  }

  // Scanned directories
  for (const dir of SCAN_DIRS) {
    const dirPath = path.join(WORKSPACE, dir)
    allFiles.push(...walkDir(dirPath))
  }

  // 2. Parse each file
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const stat = fs.statSync(filePath)
      const relPath = path.relative(WORKSPACE, filePath)
      const fileName = path.basename(filePath, '.md')
      
      // Determine node type based on path
      let nodeType: NodeType = 'file'
      if (relPath.startsWith('memory/')) nodeType = 'memory'
      else if (relPath.startsWith('chipchip/')) nodeType = 'concept'
      else if (relPath.startsWith('projects/')) nodeType = 'project'
      else if (['SOUL', 'USER', 'MEMORY', 'AGENTS', 'TOOLS', 'IDENTITY', 'HEARTBEAT', 'BRAIN'].includes(fileName)) {
        nodeType = 'memory'
      }

      // Create file node
      const fileNode: GraphNode = {
        id: filePath,
        label: fileName,
        type: nodeType,
        path: relPath,
        metadata: {
          created: stat.birthtime.toISOString(),
          modified: stat.mtime.toISOString(),
          size: stat.size,
          content: getContentPreview(content),
          tags: [],
          linkCount: 0,
        },
        degree: 0,
      }

      // Extract elements
      const wikilinks = extractWikilinks(content)
      const mdLinks = extractMarkdownLinks(content)
      const tags = extractTags(content)
      const headings = extractHeadings(content)

      fileNode.metadata.tags = tags
      fileNode.metadata.linkCount = wikilinks.length + mdLinks.length

      // Store file node
      nodeMap.set(filePath, fileNode)
      nodes.push(fileNode)

      // Create edges for wikilinks
      for (const link of wikilinks) {
        const targetId = resolveLinkTarget(link.target, filePath)
        
        // If target is a concept (no file found), create concept node
        if (targetId.startsWith('concept:')) {
          if (!nodeMap.has(targetId)) {
            const conceptNode: GraphNode = {
              id: targetId,
              label: link.target,
              type: 'concept',
              metadata: {},
              degree: 0,
            }
            nodeMap.set(targetId, conceptNode)
            nodes.push(conceptNode)
          }
        }

        const edgeId = `${filePath}-links_to-${targetId}`
        if (!edges.find(e => e.id === edgeId)) {
          edges.push({
            id: edgeId,
            source: filePath,
            target: targetId,
            type: 'links_to',
            label: link.alias,
          })
        }
      }

      // Create edges for markdown links (to .md files only)
      for (const link of mdLinks) {
        if (link.url.endsWith('.md')) {
          const targetPath = resolveLinkTarget(link.url.replace('.md', ''), filePath)
          const edgeId = `${filePath}-links_to-${targetPath}`
          if (!edges.find(e => e.id === edgeId)) {
            edges.push({
              id: edgeId,
              source: filePath,
              target: targetPath,
              type: 'links_to',
              label: link.text,
            })
          }
        }
      }

      // Create tag nodes and edges
      for (const tag of tags) {
        const tagId = `tag:${tag.toLowerCase()}`
        if (!nodeMap.has(tagId)) {
          const tagNode: GraphNode = {
            id: tagId,
            label: `#${tag}`,
            type: 'tag',
            metadata: {},
            degree: 0,
          }
          nodeMap.set(tagId, tagNode)
          nodes.push(tagNode)
        }

        const edgeId = `${filePath}-tagged_with-${tagId}`
        if (!edges.find(e => e.id === edgeId)) {
          edges.push({
            id: edgeId,
            source: filePath,
            target: tagId,
            type: 'tagged_with',
          })
        }
      }

      // Create heading nodes (contained within file)
      for (const heading of headings) {
        const headingId = `${filePath}#${heading.toLowerCase().replace(/\s+/g, '-')}`
        const headingNode: GraphNode = {
          id: headingId,
          label: heading,
          type: 'concept',
          metadata: { description: `Heading in ${fileName}` },
          degree: 0,
        }
        nodeMap.set(headingId, headingNode)
        nodes.push(headingNode)

        edges.push({
          id: `${filePath}-contains-${headingId}`,
          source: filePath,
          target: headingId,
          type: 'contains',
        })
      }

    } catch (err) {
      console.error(`Error scanning ${filePath}:`, err)
    }
  }

  // 3. Fetch Supabase data
  const { nodes: sbNodes, edges: sbEdges } = await fetchSupabaseGraphData()
  for (const node of sbNodes) {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, node)
      nodes.push(node)
    }
  }
  for (const edge of sbEdges) {
    if (!edges.find(e => e.id === edge.id)) {
      edges.push(edge)
    }
  }

  // 4. Compute degrees
  const degreeMap = new Map<string, number>()
  for (const edge of edges) {
    degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1)
    degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1)
  }
  for (const node of nodes) {
    node.degree = degreeMap.get(node.id) || 0
  }

  // 5. Compute stats
  const nodeCounts: Record<string, number> = {}
  for (const node of nodes) {
    nodeCounts[node.type] = (nodeCounts[node.type] || 0) + 1
  }

  return {
    nodes,
    edges,
    stats: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodeCounts,
      generatedAt: new Date().toISOString(),
    },
  }
}
