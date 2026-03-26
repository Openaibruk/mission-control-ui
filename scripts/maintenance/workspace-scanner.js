#!/usr/bin/env node
/**
 * Workspace Filesystem Scanner
 * Scans /home/ubuntu/.openclaw/workspace/ and produces data/graph-data.json
 * with nodes (files, folders, tags, skills) and edges (contains, links_to, tagged_with, references).
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/home/ubuntu/.openclaw/workspace';
const OUTPUT = path.join(WORKSPACE, 'data', 'graph-data.json');

const EXCLUDE_DIRS = new Set(['node_modules', '.next', '.git', '.venv-supabase', '.openclaw', 'dist', 'build', '.cache', '__pycache__']);
const EXCLUDE_FILES = new Set(['.DS_Store', 'Thumbs.db']);

// Known config filenames
const CONFIG_FILES = new Set([
  'package.json', 'tsconfig.json', 'openclaw.json', '.env', '.env.local',
  '.env.example', '.gitignore', '.prettierrc', '.eslintrc.json', 'next.config.js',
  'next.config.mjs', 'tailwind.config.ts', 'tailwind.config.js', 'postcss.config.js',
  'postcss.config.mjs', 'vercel.json', 'docker-compose.yml', 'Dockerfile',
  'Makefile', 'README.md', 'LICENSE', 'pnpm-lock.yaml', 'package-lock.json',
  'yarn.lock', 'bun.lockb', 'turbo.json'
]);

// Known project directories (will be typed as 'project')
const PROJECT_DIRS = new Set([
  'mission-control-ui', 'openclaw-office', 'ipmr-feedback', 'chipchip',
  'scripts', 'skills', 'memory'
]);

// Root agent/config files
const ROOT_AGENT_FILES = new Set([
  'SOUL.md', 'USER.md', 'MEMORY.md', 'AGENTS.md', 'HEARTBEAT.md',
  'TOOLS.md', 'IDENTITY.md', 'ID.md', 'PORTFOLIO.md', 'PRIME_DIRECTIVES.md'
]);

const nodes = [];
const edges = [];
const nodesById = new Map();
const tagSet = new Set();
let edgeCounter = 0;

function relPath(absPath) {
  return path.relative(WORKSPACE, absPath);
}

function makeId(type, rel) {
  return `${type}:${rel}`;
}

function addNode(node) {
  if (nodesById.has(node.id)) return;
  nodesById.set(node.id, node);
  nodes.push(node);
}

function addEdge(source, target, type, label) {
  const id = `e${++edgeCounter}`;
  edges.push({ id, source, target, type, ...(label ? { label } : {}) });
}

function isExcludedDir(dirName) {
  return EXCLUDE_DIRS.has(dirName) || dirName.startsWith('.');
}

function classifyFile(filePath, fileName) {
  const rel = relPath(filePath);
  const ext = path.extname(fileName).toLowerCase();

  // Skill file
  if (rel.startsWith('skills/') && fileName === 'SKILL.md') return 'skill';
  if (rel.includes('/skills/') && fileName === 'SKILL.md') return 'skill';

  // Memory files
  if (rel.startsWith('memory/')) return 'memory';

  // Scripts
  if (rel.startsWith('scripts/') && (ext === '.js' || ext === '.sh' || ext === '.ts')) return 'script';

  // Config files
  if (CONFIG_FILES.has(fileName)) return 'config';
  if (fileName.startsWith('.env')) return 'config';
  if (fileName.endsWith('.json') && !fileName.includes('graph-data')) return 'config';

  // Root agent files
  if (ROOT_AGENT_FILES.has(fileName)) return 'agent';

  // TypeScript/React files
  if (ext === '.tsx' || ext === '.ts') return 'file';
  if (ext === '.jsx' || ext === '.js') return 'file';
  if (ext === '.css' || ext === '.scss') return 'file';

  // Markdown docs
  if (ext === '.md') return 'doc';
  if (ext === '.mdx') return 'doc';

  // SQL
  if (ext === '.sql') return 'task';

  // YAML
  if (ext === '.yml' || ext === '.yaml') return 'config';

  return 'file';
}

function classifyDir(dirPath, dirName) {
  const rel = relPath(dirPath);
  if (rel === '' || rel === '.') return 'folder'; // root
  if (PROJECT_DIRS.has(dirName)) return 'folder';
  if (rel.startsWith('skills/')) return 'folder';
  if (rel.startsWith('memory/')) return 'folder';
  return 'folder';
}

function parseFileContent(absPath, ext) {
  const result = { tags: [], headings: [], links: [], mentions: [] };
  try {
    const content = fs.readFileSync(absPath, 'utf8');
    // Only parse markdown and text-like files
    if (['.md', '.mdx', '.txt', '.ts', '.tsx', '.js', '.jsx', '.sql', '.yml', '.yaml'].includes(ext)) {
      // Extract headings (## and ###)
      const headingMatches = content.match(/^#{1,4}\s+(.+)$/gm);
      if (headingMatches) {
        result.headings = headingMatches.map(h => h.replace(/^#{1,4}\s+/, '').trim()).slice(0, 20);
      }

      // Extract wikilinks [[...]]
      const wikiMatches = content.match(/\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]/g);
      if (wikiMatches) {
        result.links = wikiMatches.map(w => {
          const inner = w.slice(2, -2);
          const pipeIdx = inner.indexOf('|');
          return pipeIdx >= 0 ? inner.slice(0, pipeIdx).trim() : inner.trim();
        }).slice(0, 30);
      }

      // Extract markdown links [text](url)
      const mdLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      if (mdLinks) {
        for (const ml of mdLinks) {
          const urlMatch = ml.match(/\]\(([^)]+)\)/);
          if (urlMatch && !urlMatch[1].startsWith('http')) {
            result.links.push(urlMatch[1]);
          }
        }
      }

      // Extract #tags (but not headings)
      const tagMatches = content.match(/(?<!#)#(?!#)[a-zA-Z][\w-]*/g);
      if (tagMatches) {
        result.tags = [...new Set(tagMatches.map(t => t.slice(1)))].slice(0, 15);
      }

      // Extract @mentions
      const mentionMatches = content.match(/@[a-zA-Z][\w-]*/g);
      if (mentionMatches) {
        result.mentions = [...new Set(mentionMatches)].slice(0, 10);
      }

      // First non-empty, non-heading line as description
      const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('---'));
      if (lines.length > 0) {
        result.description = lines[0].slice(0, 200);
      }
    }
  } catch (e) {
    // ignore read errors
  }
  return result;
}

// Collect all skill names for reference matching
const skillNames = new Set();

function scanDirectory(dirPath) {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (e) {
    return;
  }

  const rel = relPath(dirPath);
  const dirName = path.basename(dirPath);
  const dirId = makeId('folder', rel || 'workspace');

  // Count files and subdirs for this directory
  const fileEntries = entries.filter(e => e.isFile() && !EXCLUDE_FILES.has(e.name));
  const dirEntries = entries.filter(e => e.isDirectory() && !isExcludedDir(e.name));

  addNode({
    id: dirId,
    label: dirName || 'workspace',
    type: classifyDir(dirPath, dirName),
    path: rel || '.',
    fileCount: fileEntries.length,
    subdirs: dirEntries.map(d => d.name),
    metadata: {}
  });

  // Process files
  for (const entry of fileEntries) {
    const filePath = path.join(dirPath, entry.name);
    const fileRel = relPath(filePath);
    const ext = path.extname(entry.name).toLowerCase();
    const type = classifyFile(filePath, entry.name);
    const fileId = makeId('file', fileRel);

    let size = 0, modified = '';
    try {
      const stat = fs.statSync(filePath);
      size = stat.size;
      modified = stat.mtime.toISOString();
    } catch (e) {}

    const parsed = parseFileContent(filePath, ext);

    addNode({
      id: fileId,
      label: entry.name,
      type,
      path: fileRel,
      size,
      modified,
      metadata: {
        tags: parsed.tags,
        headings: parsed.headings,
        links: parsed.links,
        mentions: parsed.mentions,
        description: parsed.description || ''
      }
    });

    // Edge: folder contains file
    addEdge(dirId, fileId, 'contains');

    // Collect tag nodes
    for (const tag of parsed.tags) {
      const tagId = makeId('tag', tag);
      if (!nodesById.has(tagId)) {
        addNode({ id: tagId, label: `#${tag}`, type: 'tag', path: '', metadata: {} });
      }
      addEdge(fileId, tagId, 'tagged_with');
      tagSet.add(tag);
    }
  }

  // Process subdirectories
  for (const entry of dirEntries) {
    const subPath = path.join(dirPath, entry.name);
    const subRel = relPath(subPath);
    const subId = makeId('folder', subRel);

    scanDirectory(subPath);

    // Edge: parent folder contains subfolder
    addEdge(dirId, subId, 'contains');
  }
}

// Second pass: resolve links between files
function resolveLinks() {
  const allFileIds = new Set();
  for (const node of nodes) {
    if (node.type !== 'tag' && node.type !== 'folder') {
      allFileIds.add(node.id);
    }
  }

  for (const node of nodes) {
    if (!node.metadata || !node.metadata.links) continue;
    for (const link of node.metadata.links) {
      // Try to resolve as relative path from the node's directory
      const nodeDir = path.dirname(node.path);
      const resolved = path.normalize(path.join(nodeDir, link));
      const targetId = makeId('file', resolved);

      if (nodesById.has(targetId) && targetId !== node.id) {
        addEdge(node.id, targetId, 'links_to');
      }

      // Also try just the filename
      const justName = path.basename(link);
      for (const [id, n] of nodesById) {
        if (n.label === justName && id !== node.id && n.type !== 'tag') {
          if (!edges.find(e => e.source === node.id && e.target === id && e.type === 'links_to')) {
            addEdge(node.id, id, 'links_to');
          }
        }
      }
    }

    // Check for skill references
    for (const [id, n] of nodesById) {
      if (n.type === 'skill' && node.metadata.description && node.metadata.description.includes(n.label.replace('.md', ''))) {
        addEdge(node.id, id, 'references');
      }
    }
  }

  // Mention-based edges
  for (const node of nodes) {
    if (!node.metadata || !node.metadata.mentions) continue;
    for (const mention of node.metadata.mentions) {
      const mentionClean = mention.slice(1); // remove @
      for (const [id, n] of nodesById) {
        if ((n.type === 'agent' || n.type === 'doc') && n.label.toLowerCase().includes(mentionClean.toLowerCase())) {
          if (id !== node.id) {
            addEdge(node.id, id, 'references');
          }
        }
      }
    }
  }
}

// Compute degrees
function computeDegrees() {
  const degreeMap = new Map();
  for (const edge of edges) {
    degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
    degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
  }
  for (const node of nodes) {
    node.degree = degreeMap.get(node.id) || 0;
  }
}

// Main
console.log('🔍 Scanning workspace:', WORKSPACE);
scanDirectory(WORKSPACE);
console.log(`📁 Scanned ${nodes.filter(n => n.type === 'folder').length} folders, ${nodes.filter(n => n.type !== 'folder' && n.type !== 'tag').length} files`);

resolveLinks();
computeDegrees();

// Stats
const nodeCounts = {};
for (const node of nodes) {
  nodeCounts[node.type] = (nodeCounts[node.type] || 0) + 1;
}

const result = {
  nodes,
  edges,
  stats: {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodeCounts,
    generatedAt: new Date().toISOString()
  }
};

fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
console.log(`\n✅ Output: ${OUTPUT}`);
console.log(`📊 ${result.stats.totalNodes} nodes, ${result.stats.totalEdges} edges`);
console.log(`📋 Node types:`, JSON.stringify(nodeCounts, null, 2));
