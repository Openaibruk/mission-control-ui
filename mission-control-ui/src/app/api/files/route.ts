import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filePath = searchParams.get('path')
  const action = searchParams.get('action') || 'view'
  
  if (!filePath) {
    return NextResponse.json({ error: 'path parameter required' }, { status: 400 })
  }

  // When deployed to Vercel, try to fetch from the local public/workspace directory
  // In a real production setup, this would be a Supabase Storage bucket fetch
  const publicPath = path.join(process.cwd(), 'public', 'workspace', filePath)
  const localVPSPath = path.join('/home/ubuntu/.openclaw/workspace', filePath)

  let content: Buffer | null = null;
  let size = 0;

  // Try VPS local path first (if running on EC2)
  if (fs.existsSync(localVPSPath)) {
    content = fs.readFileSync(localVPSPath)
    size = fs.statSync(localVPSPath).size
  } 
  // Fallback to Vercel public/workspace bundle
  else if (fs.existsSync(publicPath)) {
    content = fs.readFileSync(publicPath)
    size = fs.statSync(publicPath).size
  }

  if (!content) {
    return NextResponse.json({ error: 'File not found', path: filePath }, { status: 404 })
  }

  try {
    if (action === 'download') {
      const fileName = path.basename(filePath)
      return new NextResponse(content as any, {
        headers: {
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': String(size),
        },
      })
    }

    const ext = path.extname(filePath).toLowerCase()
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
      '.csv': 'text/csv; charset=utf-8',
    }

    const contentType = contentTypes[ext] || 'text/plain; charset=utf-8'

    return new NextResponse(content as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(size),
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
