import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/api/gateway-status.json')
    const data = fs.readFileSync(filePath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch {
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      vps: { status: 'unknown', uptime: 0, cpu: 0, memory: { total: 0, used: 0, percent: 0 }, disk: { percent: 0 }, load: '0' },
      gateway: { status: 'unknown', uptime: 0, sessions: 0 },
      paperclip: { status: 'unknown' }
    })
  }
}
