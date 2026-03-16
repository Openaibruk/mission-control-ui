import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const WORKSPACE = '/home/ubuntu/.openclaw/workspace'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filePath = searchParams.get('path')
  const action = searchParams.get('action') || 'view'
  
  if (!filePath) {
    return NextResponse.json({ error: 'path parameter required' }, { status: 400 })
  }

  // Security: resolve and validate path stays within workspace
  const resolved = path.resolve(WORKSPACE, filePath)
  if (!resolved.startsWith(WORKSPACE)) {
    return NextResponse.json({ error: 'Access denied: path outside workspace' }, { status: 403 })
  }

  if (!fs.existsSync(resolved)) {
    return NextResponse.json({ error: 'File not found', path: resolved }, { status: 404 })
  }

  try {
    const content = fs.readFileSync(resolved)
    const stat = fs.statSync(resolved)

    if (action === 'download') {
      const fileName = path.basename(resolved)
      return new NextResponse(content, {
        headers: {
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': String(stat.size),
        },
      })
    }

    // View mode — serve with appropriate content type
    const ext = path.extname(resolved).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.md': 'text/markdown; charset=utf-8',
      '.txt': 'text/plain; charset=utf-8',
      '.json': 'application/json',
      '.js': 'text/javascript',
      '.ts': 'text/typescript',
      '.tsx': 'text/typescript',
      '.py': 'text/x-python',
      '.html': 'text/html',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
    }

    const contentType = contentTypes[ext] || 'text/plain; charset=utf-8'

    // For text-based files, render as plain text
    if (contentType.startsWith('text/') || contentType.startsWith('application/json')) {
      return new NextResponse(content, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(stat.size),
        },
      })
    }

    // For binary files (images etc)
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
