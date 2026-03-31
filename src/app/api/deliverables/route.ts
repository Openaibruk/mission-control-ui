import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Deliverables API — returns file metadata and Google Drive links.
 * Works on both VPS (can read filesystem) and Vercel (returns Drive metadata only).
 */

// Master list of all deliverables with Drive links
const ALL_DELIVERABLES = [
  {
    name: 'Strategic Review Q1 2026 (DOC)',
    filename: 'chipchip-strategic-review-q1-2026.md',
    type: 'doc',
    size: '31 KB',
    driveId: '13tWH-Tvx6eHUIJIVzGAUI1P0T6BUJz1q',
    project: 'ChipChip Strategic Review Q1 2026',
  },
  {
    name: 'Strategic Review Presentation (PPTX)',
    filename: 'chipchip-strategic-review-presentation.pptx',
    type: 'pptx',
    size: '1.1 MB',
    driveId: '1TCxvzm3JhgrJXk7MGE5h-qOZmb15vfDD',
    project: 'ChipChip Strategic Review Q1 2026',
  },
  {
    name: 'Analytics Report',
    filename: 'chipchip-review-analytics.md',
    type: 'md',
    size: '15 KB',
    project: 'ChipChip Strategic Review Q1 2026',
  },
  {
    name: 'Strategic Analysis',
    filename: 'chipchip-strategy-analysis.md',
    type: 'md',
    size: '22 KB',
    project: 'ChipChip Strategic Review Q1 2026',
  },
  {
    name: 'QA Review',
    filename: 'chipchip-qa-review.md',
    type: 'md',
    size: '11 KB',
    project: 'ChipChip Strategic Review Q1 2026',
  },
] as const;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const projectName = url.searchParams.get('project');

  // Filter by project name if provided
  let deliverables = ALL_DELIVERABLES;
  if (projectName) {
    // Fuzzy match — normalize to lowercase
    const needle = projectName.toLowerCase();
    deliverables = ALL_DELIVERABLES.filter((d) =>
      d.project.toLowerCase().includes(needle)
    );
  }

  const files = deliverables.map((d) => ({
    name: d.name,
    url: d.driveId
      ? `https://drive.google.com/file/d/${d.driveId}/view`
      : null,
    type: d.type,
    size: d.size,
    driveId: d.driveId ?? null,
    project: d.project,
    status: 'done',
  }));

  return NextResponse.json({ files, count: files.length });
}
