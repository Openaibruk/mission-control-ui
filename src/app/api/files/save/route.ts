import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic';

const VPS_ROOT = '/home/ubuntu/.openclaw/workspace'
const WORKSPACE_ROOT = fs.existsSync(VPS_ROOT) ? VPS_ROOT : process.cwd()

export async function POST(request: NextRequest) {
  try {
    const { path: filePath, content } = await request.json()
    
    if (!filePath || content === undefined) {
      return NextResponse.json({ error: 'path and content parameters required' }, { status: 400 })
    }

    // Since we are writing SOUL.md, we assume it's in the workspace
    // Ensure the path is relative and within the workspace directory
    const cleanPath = filePath.replace(/^(\.\.(\/|\\|$))+/, '')
    const localVPSPath = path.join(WORKSPACE_ROOT, cleanPath)

    // Make sure the directory exists
    const dir = path.dirname(localVPSPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(localVPSPath, content, 'utf8')

    return NextResponse.json({ success: true, path: filePath })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save file' }, { status: 500 })
  }
}
