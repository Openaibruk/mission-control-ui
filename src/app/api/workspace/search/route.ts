import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic';

const VPS_ROOT = '/home/ubuntu/.openclaw/workspace'
const WORKSPACE_ROOT = fs.existsSync(VPS_ROOT) ? VPS_ROOT : process.cwd()

function walkDir(dir: string, fileList: any[] = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir)
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.next') continue;
    const filePath = path.join(dir, file)
    try {
      const stats = fs.statSync(filePath)
      if (stats.isDirectory()) {
        walkDir(filePath, fileList)
      } else {
        fileList.push({
          name: file,
          path: path.relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
          isDirectory: false,
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
        })
      }
    } catch (e) {
      // Ignore files that can't be read
    }
  }
  return fileList
}

export async function GET(request: NextRequest) {
  try {
    const allFiles = walkDir(WORKSPACE_ROOT)
    return NextResponse.json({ items: allFiles })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list files' }, { status: 500 })
  }
}
