import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DELIVERABLES_DIR = '/home/ubuntu/.openclaw/workspace/deliverables';

// Hardcoded mapping of deliverables with their Drive IDs
const DRIVE_FILES: Record<string, { name: string; file: string; type: string; driveId?: string }> = {
  'chipchip-strategic-review-q1-2026.md': {
    name: 'Strategic Review Q1 2026 (DOC)',
    file: 'chipchip-strategic-review-q1-2026.md',
    type: 'doc',
    driveId: '13tWH-Tvx6eHUIJIVzGAUI1P0T6BUJz1q'  // Uploaded at 11:49
  },
  'chipchip-strategic-review-presentation.pptx': {
    name: 'Strategic Review Presentation (PPTX)',
    file: 'chipchip-strategic-review-presentation.pptx',
    type: 'pptx',
    driveId: '1TCxvzm3JhgrJXk7MGE5h-qOZmb15vfDD'  // Uploaded at 11:49
  },
  'chipchip-review-analytics.md': {
    name: 'Analytics Report',
    file: 'chipchip-review-analytics.md',
    type: 'md',
  },
  'chipchip-strategy-analysis.md': {
    name: 'Strategic Analysis',
    file: 'chipchip-strategy-analysis.md',
    type: 'md',
  },
  'chipchip-qa-review.md': {
    name: 'QA Review',
    file: 'chipchip-qa-review.md',
    type: 'md',
  },
};

// Project name to deliverable file mapping
const PROJECT_DELIVERABLES: Record<string, string[]> = {
  'ChipChip Strategic Review Q1 2026': [
    'chipchip-strategic-review-q1-2026.md',
    'chipchip-strategic-review-presentation.pptx',
    'chipchip-review-analytics.md',
    'chipchip-strategy-analysis.md',
    'chipchip-qa-review.md',
  ]
};

function getFileSize(filePath: string): string {
  try {
    const stats = require('fs').statSync(filePath);
    const bytes = stats.size;
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  } catch {
    return '';
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const projectName = url.searchParams.get('project');

  if (projectName) {
    // Return deliverables for a specific project
    const filenames = PROJECT_DELIVERABLES[projectName] || [];
    const files = filenames.map(filename => {
      const meta = DRIVE_FILES[filename];
      if (!meta) return null;
      const localPath = path.join(DELIVERABLES_DIR, meta.file);
      const size = getFileSize(localPath);
      return {
        name: meta.name,
        url: `/api/files/download?file=${encodeURIComponent(meta.file)}`,
        type: meta.type,
        size,
        driveId: meta.driveId,
      };
    }).filter(Boolean);

    return NextResponse.json({ files, count: files.length });
  }

  // List all deliverable files
  try {
    const entries = await fs.readdir(DELIVERABLES_DIR);
    const allFiles = entries.map(filename => {
      const meta = DRIVE_FILES[filename];
      const localPath = path.join(DELIVERABLES_DIR, filename);
      const size = getFileSize(localPath);
      const type = filename.endsWith('.pptx') ? 'pptx' : filename.endsWith('.md') ? 'md' : 'file';
      return {
        name: meta?.name || filename,
        url: `/api/files/download?file=${encodeURIComponent(filename)}`,
        type,
        size,
        driveId: meta?.driveId,
      };
    });
    return NextResponse.json({ files: allFiles });
  } catch {
    return NextResponse.json({ files: [], error: 'Deliverables directory not accessible' });
  }
}
