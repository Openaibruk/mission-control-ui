/**
 * Markdown parser for the Knowledge Graph
 * Extracts wikilinks, embeds, frontmatter, hashtags, @mentions, and markdown links
 */

import type {
  ParsedMarkdown,
  ParsedWikilink,
  ParsedMarkdownLink,
  ParsedEmbed,
  ParsedFrontmatter,
  ParsedMention,
} from './graphTypes';

// ─── Regex Patterns ──────────────────────────────────────────────────────────

// Wikilinks: [[target]] and [[target|alias]]
// Uses a careful approach to avoid matching inside code blocks or other brackets
const WIKILINK_REGEX = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

// Markdown links: [text](url) — not starting with ! (those are images/embeds)
const MARKDOWN_LINK_REGEX = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;

// Embeds: ![[target]]
const EMBED_REGEX = /!\[\[([^\]]+?)\]\]/g;

// Inline hashtags: #tag (not preceded by alphanumeric, to avoid headings)
const TAG_REGEX = /(?<![a-zA-Z0-9_])#([a-zA-Z][\w/-]*)/g;

// @mentions: @AgentName or @PersonName
const MENTION_REGEX = /@([A-Z][a-zA-Z0-9_-]*)/g;

// Frontmatter boundaries
const FRONTMATTER_START = /^---\s*$/;
const FRONTMATTER_END = /^---\s*$/;

// Headings
const HEADING_REGEX = /^#{1,6}\s+(.+)$/gm;

// ─── Frontmatter Parser ──────────────────────────────────────────────────────

function parseFrontmatter(content: string): { frontmatter: ParsedFrontmatter; body: string } {
  const lines = content.split('\n');

  if (lines.length === 0 || !FRONTMATTER_START.test(lines[0])) {
    return { frontmatter: {}, body: content };
  }

  // Find closing ---
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (FRONTMATTER_END.test(lines[i])) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return { frontmatter: {}, body: content };
  }

  const fmLines = lines.slice(1, endIndex);
  const body = lines.slice(endIndex + 1).join('\n');
  const frontmatter: ParsedFrontmatter = {};

  for (const line of fmLines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Handle YAML arrays: [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      const items = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
      frontmatter[key] = items;
    } else {
      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

// ─── Code Block Stripper ─────────────────────────────────────────────────────

/**
 * Replace fenced and inline code blocks with placeholders so regex
 * doesn't match links/tags inside code.
 */
function stripCodeBlocks(content: string): { stripped: string; restore: () => string } {
  const placeholders: string[] = [];
  let stripped = content;

  // Fenced code blocks: ``` ... ```
  stripped = stripped.replace(/```[\s\S]*?```/g, (match) => {
    placeholders.push(match);
    return `__CODE_BLOCK_${placeholders.length - 1}__`;
  });

  // Inline code: `...`
  stripped = stripped.replace(/`[^`]+`/g, (match) => {
    placeholders.push(match);
    return `__CODE_BLOCK_${placeholders.length - 1}__`;
  });

  return {
    stripped,
    restore: () => {
      let result = stripped;
      placeholders.forEach((block, i) => {
        result = result.replace(`__CODE_BLOCK_${i}__`, block);
      });
      return result;
    },
  };
}

// ─── Extract Functions ───────────────────────────────────────────────────────

function extractWikilinks(content: string): ParsedWikilink[] {
  const links: ParsedWikilink[] = [];
  let match: RegExpExecArray | null;

  WIKILINK_REGEX.lastIndex = 0;
  while ((match = WIKILINK_REGEX.exec(content)) !== null) {
    links.push({
      target: match[1].trim(),
      alias: match[2]?.trim(),
    });
  }

  return links;
}

function extractMarkdownLinks(content: string): ParsedMarkdownLink[] {
  const links: ParsedMarkdownLink[] = [];
  let match: RegExpExecArray | null;

  MARKDOWN_LINK_REGEX.lastIndex = 0;
  while ((match = MARKDOWN_LINK_REGEX.exec(content)) !== null) {
    // Skip image links (already handled by EMBED_REGEX or should be ignored)
    if (match[0].startsWith('!')) continue;
    links.push({
      text: match[1].trim(),
      url: match[2].trim(),
    });
  }

  return links;
}

function extractEmbeds(content: string): ParsedEmbed[] {
  const embeds: ParsedEmbed[] = [];
  let match: RegExpExecArray | null;

  EMBED_REGEX.lastIndex = 0;
  while ((match = EMBED_REGEX.exec(content)) !== null) {
    embeds.push({ target: match[1].trim() });
  }

  return embeds;
}

function extractTags(content: string): string[] {
  const tags = new Set<string>();
  let match: RegExpExecArray | null;

  TAG_REGEX.lastIndex = 0;
  while ((match = TAG_REGEX.exec(content)) !== null) {
    const tag = match[1];
    // Filter out single-char tags (likely false positives)
    if (tag.length > 1) {
      tags.add(tag);
    }
  }

  return [...tags];
}

function extractMentions(content: string): ParsedMention[] {
  const mentions: ParsedMention[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  MENTION_REGEX.lastIndex = 0;
  while ((match = MENTION_REGEX.exec(content)) !== null) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      mentions.push({ name, type: 'agent' }); // Default to agent; can refine
    }
  }

  return mentions;
}

function extractHeadings(content: string): string[] {
  const headings: string[] = [];
  let match: RegExpExecArray | null;

  HEADING_REGEX.lastIndex = 0;
  while ((match = HEADING_REGEX.exec(content)) !== null) {
    headings.push(match[1].trim());
  }

  return headings;
}

function getContentPreview(content: string, maxLen = 200): string {
  const stripped = content
    .replace(/^---[\s\S]*?---\s*/m, '') // Remove frontmatter
    .replace(/```[\s\S]*?```/g, '')     // Remove code blocks
    .replace(/`[^`]+`/g, '')            // Remove inline code
    .replace(/^#+\s+/gm, '')            // Remove heading markers
    .replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g, '$1') // Unwrap wikilinks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')               // Unwrap md links
    .replace(/!\[\[[^\]]+\]\]/g, '')    // Remove embeds
    .replace(/[*_~]/g, '')              // Remove formatting
    .replace(/@\w+/g, '')               // Remove mentions
    .replace(/#[\w/-]+/g, '')           // Remove tags
    .trim();

  return stripped.length > maxLen ? stripped.substring(0, maxLen) + '...' : stripped;
}

// ─── Main Parse Function ─────────────────────────────────────────────────────

/**
 * Parse a markdown file's content into structured graph data.
 * Handles all supported syntax: wikilinks, embeds, frontmatter, tags, mentions, etc.
 */
export function parseMarkdown(content: string): ParsedMarkdown {
  // 1. Extract frontmatter
  const { frontmatter, body } = parseFrontmatter(content);

  // 2. Strip code blocks to avoid false matches
  const { stripped } = stripCodeBlocks(body);

  // 3. Extract all elements from the stripped content
  const wikilinks = extractWikilinks(stripped);
  const markdownLinks = extractMarkdownLinks(stripped);
  const embeds = extractEmbeds(stripped);
  const tags = extractTags(stripped);
  const mentions = extractMentions(stripped);
  const headings = extractHeadings(stripped);

  // Merge frontmatter tags with inline tags
  const allTags = new Set([...(frontmatter.tags || []), ...tags]);

  // 4. Generate content preview
  const contentPreview = getContentPreview(body);

  return {
    wikilinks,
    markdownLinks,
    embeds,
    tags: [...allTags],
    mentions,
    frontmatter,
    headings,
    contentPreview,
  };
}

/**
 * Normalize a wikilink target to a file path.
 * Strips anchors (#section) and normalizes separators.
 */
export function normalizeLinkTarget(target: string): string {
  // Remove anchor references
  const withoutAnchor = target.split('#')[0];
  // Normalize path separators
  return withoutAnchor.replace(/\\/g, '/').trim();
}

/**
 * Check if a link target looks like a file reference vs a concept.
 */
export function isFileReference(target: string): boolean {
  return (
    target.endsWith('.md') ||
    target.endsWith('.txt') ||
    target.endsWith('.json') ||
    target.endsWith('.yaml') ||
    target.endsWith('.yml') ||
    target.includes('/') ||
    target.includes('\\')
  );
}
