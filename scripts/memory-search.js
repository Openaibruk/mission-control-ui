#!/usr/bin/env node
/**
 * Local Memory Search - Simple keyword/BM25 search for workspace markdown files
 * 
 * Usage: node memory-search.js "<query>" [options]
 * 
 * Options:
 *   --limit N     Max results to return (default: 5)
 *   --files       Search specific files (comma-separated)
 * 
 * Example: node memory-search.js "project deadline" --limit 3
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/home/ubuntu/.openclaw/workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');

// Default search paths (in order of priority)
const SEARCH_PATHS = [
  path.join(WORKSPACE, 'MEMORY.md'),
  path.join(WORKSPACE, 'IDENTITY.md'),
  path.join(WORKSPACE, 'USER.md'),
  path.join(WORKSPACE, 'SOUL.md'),
  path.join(WORKSPACE, 'AGENTS.md'),
];

// Stop words to filter out
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'which',
  'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'if', 'then'
]);

/**
 * Tokenize text into searchable terms
 */
function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Simple BM25-like scoring
 */
function scoreDocument(queryTokens, docTokens, docLength, avgDocLength, docFreq) {
  const k1 = 1.5;
  const b = 0.75;
  
  const termFreq = {};
  docTokens.forEach(t => termFreq[t] = (termFreq[t] || 0) + 1);
  
  let score = 0;
  queryTokens.forEach(term => {
    if (termFreq[term]) {
      const tf = termFreq[term];
      const idf = Math.log((docFreq[term] || 1) + 1);
      score += (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * docLength / avgDocLength)) * idf;
    }
  });
  
  return score;
}

/**
 * Search through markdown files
 */
async function search(query, options = {}) {
  const limit = options.limit || 5;
  const searchFiles = options.files ? options.files.split(',').map(f => path.resolve(f)) : null;
  
  // Get all markdown files to index
  const mdFiles = [];
  
  // Add explicit search paths first
  for (const p of SEARCH_PATHS) {
    if (fs.existsSync(p) && !searchFiles) {
      mdFiles.push({ path: p, priority: SEARCH_PATHS.indexOf(p) });
    }
  }
  
  // Add memory directory files
  if (fs.existsSync(MEMORY_DIR) && !searchFiles) {
    const memoryFiles = fs.readdirSync(MEMORY_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => path.join(MEMORY_DIR, f));
    
    for (const f of memoryFiles) {
      if (!mdFiles.find(m => m.path === f)) {
        mdFiles.push({ path: f, priority: 100 });
      }
    }
  }
  
  // Add user-specified files
  if (searchFiles) {
    for (const f of searchFiles) {
      if (fs.existsSync(f)) {
        mdFiles.push({ path: f, priority: 0 });
      }
    }
  }
  
  // Parse documents
  const documents = [];
  for (const { path: filePath, priority } of mdFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const tokens = tokenize(content);
      documents.push({
        path: filePath,
        name: path.basename(filePath),
        content,
        tokens,
        length: tokens.length,
        priority
      });
    } catch (err) {
      console.error(`Error reading ${filePath}: ${err.message}`);
    }
  }
  
  if (documents.length === 0) {
    return { error: 'No documents found to search', results: [] };
  }
  
  // Calculate average document length
  const avgLength = documents.reduce((sum, d) => sum + d.length, 0) / documents.length;
  
  // Calculate document frequency for IDF
  const docFreq = {};
  documents.forEach(doc => {
    new Set(doc.tokens).forEach(term => {
      docFreq[term] = (docFreq[term] || 0) + 1;
    });
  });
  
  // Tokenize query
  const queryTokens = tokenize(query);
  
  if (queryTokens.length === 0) {
    return { error: 'No valid search terms in query', results: [] };
  }
  
  // Score documents
  const results = documents.map(doc => ({
    ...doc,
    score: scoreDocument(queryTokens, doc.tokens, doc.length, avgLength, docFreq)
  }));
  
  // Sort by score (descending), then by priority (ascending)
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.priority - b.priority;
  });
  
  // Build output
  const output = {
    query,
    searchedFiles: documents.length,
    results: []
  };
  
  for (const result of results.slice(0, limit)) {
    if (result.score > 0) {
      // Extract relevant snippet
      const lines = result.content.split('\n');
      let snippet = '';
      
      // Find lines containing query tokens
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (queryTokens.some(t => lowerLine.includes(t))) {
          snippet = line.trim();
          break;
        }
      }
      
      // Fallback to first non-empty line
      if (!snippet) {
        snippet = lines.find(l => l.trim()) || '';
      }
      
      output.results.push({
        file: result.name,
        path: result.path,
        score: Math.round(result.score * 100) / 100,
        snippet: snippet.substring(0, 200)
      });
    }
  }
  
  return output;
}

// CLI
const args = process.argv.slice(2);
const query = args.find(a => !a.startsWith('--'));
const opts = {
  limit: 5,
  files: null
};

for (const arg of args) {
  if (arg.startsWith('--limit=')) {
    opts.limit = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--files=')) {
    opts.files = arg.split('=')[1];
  }
}

if (!query) {
  console.log('Usage: node memory-search.js "<query>" [--limit=N] [--files=file1,file2]');
  console.log('');
  console.log('Examples:');
  console.log('  node memory-search.js "project deadline"');
  console.log('  node memory-search.js "nova preferences" --limit=3');
  console.log('  node memory-search.js "test" --files=/path/to/file.md');
  process.exit(1);
}

search(query, opts).then(result => {
  if (result.error) {
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }
  
  console.log(`\nSearch: "${result.query}"`);
  console.log(`Searched ${result.searchedFiles} files\n`);
  
  if (result.results.length === 0) {
    console.log('No results found.');
  } else {
    result.results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.file} (score: ${r.score})`);
      console.log(`   ${r.snippet}`);
      console.log('');
    });
  }
}).catch(err => {
  console.error('Search failed:', err.message);
  process.exit(1);
});
