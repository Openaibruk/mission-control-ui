import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic';

const WORKSPACE_ROOT = '/home/ubuntu/.openclaw/workspace'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const dirPath = searchParams.get('path') || ''
  const fullPath = path.join(WORKSPACE_ROOT, dirPath.replace(/^(\.\.(\/|\\|$))+/, ''))

  try {
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Directory not found' }, { status: 404 })
    }

    const stats = fs.statSync(fullPath)
    if (!stats.isDirectory()) {
      return NextResponse.json({ error: 'Not a directory' }, { status: 400 })
    }

    const items = fs.readdirSync(fullPath).map(name => {
      const itemPath = path.join(fullPath, name)
      try {
        const itemStats = fs.statSync(itemPath)
        return {
          name,
          path: path.join(dirPath, name).replace(/\\/g, '/'),
          isDirectory: itemStats.isDirectory(),
          size: itemStats.size,
          lastModified: itemStats.mtime.toISOString(),
        }
      } catch (e) {
        return null
      }
    }).filter(Boolean)

    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list directory' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { path: targetPath, type, content = '' } = await request.json()
    if (!targetPath || !type) {
      return NextResponse.json({ error: 'path and type required' }, { status: 400 })
    }

    const fullPath = path.join(WORKSPACE_ROOT, targetPath.replace(/^(\.\.(\/|\\|$))+/, ''))
    
    if (type === 'directory') {
      fs.mkdirSync(fullPath, { recursive: true })
    } else if (type === 'file') {
      fs.writeFileSync(fullPath, content, 'utf8')
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { oldPath, newPath } = await request.json()
    if (!oldPath || !newPath) {
      return NextResponse.json({ error: 'oldPath and newPath required' }, { status: 400 })
    }

    const fullOldPath = path.join(WORKSPACE_ROOT, oldPath.replace(/^(\.\.(\/|\\|$))+/, ''))
    const fullNewPath = path.join(WORKSPACE_ROOT, newPath.replace(/^(\.\.(\/|\\|$))+/, ''))

    if (!fs.existsSync(fullOldPath)) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 })
    }

    fs.renameSync(fullOldPath, fullNewPath)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to rename' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const targetPath = searchParams.get('path')
  
  if (!targetPath) {
    return NextResponse.json({ error: 'path parameter required' }, { status: 400 })
  }

  const fullPath = path.join(WORKSPACE_ROOT, targetPath.replace(/^(\.\.(\/|\\|$))+/, ''))

  try {
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true })
    } else {
      fs.unlinkSync(fullPath)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete' }, { status: 500 })
  }
}
